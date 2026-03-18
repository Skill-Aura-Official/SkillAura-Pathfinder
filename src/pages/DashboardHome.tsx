import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, DollarSign, Award, Briefcase, GraduationCap, Flame, Calendar, ArrowUpRight, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import StatRadar from "@/components/dashboard/StatRadar";
import Achievements from "@/components/dashboard/Achievements";
import Leaderboard from "@/components/dashboard/Leaderboard";

interface CareerProfile {
  career_class: string;
  level: number;
  current_xp: number;
  max_xp: number;
  rank: string;
  job_readiness: number | null;
  salary_estimate: string | null;
  target_career: string | null;
  stat_technical: number | null;
  stat_logic: number | null;
  stat_creativity: number | null;
  stat_communication: number | null;
  stat_leadership: number | null;
  stat_problem_solving: number | null;
  resume_data: any;
  interview_data: any;
}

const classLabels: Record<string, string> = {
  explorer: "Explorer", software_engineer: "Software Engineer", data_scientist: "Data Scientist",
  ai_engineer: "AI Engineer", product_manager: "Product Manager",
  cybersecurity_analyst: "Cybersecurity Analyst", entrepreneur: "Entrepreneur",
};

const classIcons: Record<string, typeof Target> = {
  explorer: Target, data_scientist: TrendingUp, ai_engineer: Flame,
  software_engineer: GraduationCap, product_manager: Briefcase,
  cybersecurity_analyst: Target, entrepreneur: DollarSign,
};

interface UserQuestWithQuest {
  id: string;
  status: string;
  progress: number | null;
  quest: { title: string; objective: string; difficulty: string; xp_reward: number; skill_reward: string | null; quest_type: string };
}

export default function DashboardHome() {
  const { user } = useAuth();
  const [career, setCareer] = useState<CareerProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [userQuests, setUserQuests] = useState<UserQuestWithQuest[]>([]);
  const [userSkills, setUserSkills] = useState<{ name: string; level: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("career_profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("profiles").select("display_name").eq("user_id", user.id).single(),
      supabase.from("user_quests").select("id, status, progress, quest:quests(title, objective, difficulty, xp_reward, skill_reward, quest_type)").eq("user_id", user.id).limit(5),
      supabase.from("user_skills").select("level, skill:skills(name)").eq("user_id", user.id),
    ]).then(([careerRes, profileRes, questsRes, skillsRes]) => {
      if (careerRes.data) setCareer(careerRes.data as unknown as CareerProfile);
      if (profileRes.data) setDisplayName(profileRes.data.display_name || "Operative");
      if (questsRes.data) setUserQuests(questsRes.data as unknown as UserQuestWithQuest[]);
      if (skillsRes.data) {
        setUserSkills((skillsRes.data as any[]).map(s => ({ name: (s.skill as any)?.name || "Unknown", level: s.level })));
      }
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  const careerClass = career?.career_class || "explorer";
  const ClassIcon = classIcons[careerClass] || Target;
  const interviewData = career?.interview_data as { goals?: string; strengths?: string; interests?: string; experience?: string } | null;

  const statsCards = [
    { icon: Target, label: "Job Readiness", value: `${career?.job_readiness?.toFixed(1) || 0}%`, color: "text-primary" },
    { icon: TrendingUp, label: "Career Class", value: classLabels[careerClass] || "Explorer", color: "text-rank-c" },
    { icon: DollarSign, label: "Salary Estimate", value: career?.salary_estimate || "N/A", color: "text-accent" },
    { icon: Award, label: "Target Role", value: career?.target_career || "Exploring", color: "text-rank-a" },
  ];

  return (
    <>
      {/* Welcome Banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 surface-card-inset p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ClassIcon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              <span className="text-label text-primary">{classLabels[careerClass] || "Explorer"}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back, <span className="text-primary">{displayName}</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {interviewData?.goals ? `Goal: ${interviewData.goals}` : "Your career command center awaits."}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" })}
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {statsCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="surface-card-inset p-3 group hover:bg-secondary/50 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <s.icon className={`h-3.5 w-3.5 ${s.color}`} strokeWidth={1.5} />
                <span className="text-label">{s.label}</span>
              </div>
              <ArrowUpRight className="h-3 w-3 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
            </div>
            <div className={`text-lg font-bold font-mono tracking-tight ${s.color}`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Skills from DB */}
      {userSkills.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
          <div className="text-label px-1 mb-2">Your Skills</div>
          <div className="flex flex-wrap gap-2">
            {userSkills.map((skill) => (
              <span key={skill.name} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-mono font-medium border border-primary/20">
                {skill.name} (Lv.{skill.level})
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Profile Insights */}
      {(interviewData?.experience || interviewData?.strengths) && (
        <div className="grid md:grid-cols-2 gap-3 mb-6">
          {interviewData?.experience && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="surface-card-inset p-4">
              <div className="text-label mb-2">Experience</div>
              <p className="text-sm text-foreground">{interviewData.experience}</p>
            </motion.div>
          )}
          {interviewData?.strengths && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="surface-card-inset p-4">
              <div className="text-label mb-2">Core Strengths</div>
              <p className="text-sm text-foreground">{interviewData.strengths}</p>
              {interviewData.interests && (
                <p className="text-xs text-muted-foreground mt-2">🔥 Interests: {interviewData.interests}</p>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Active Quests from DB */}
        <div className="lg:col-span-1 space-y-4">
          <div className="text-label px-1">Active Quests</div>
          {userQuests.length > 0 ? userQuests.filter(uq => uq.status !== "completed").slice(0, 3).map((uq) => (
            <motion.div key={uq.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="surface-interactive p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-label">{uq.quest.quest_type} Quest</span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  uq.quest.difficulty === "E" ? "text-rank-e bg-rank-e/10" :
                  uq.quest.difficulty === "D" ? "text-rank-d bg-rank-d/10" :
                  uq.quest.difficulty === "C" ? "text-rank-c bg-rank-c/10" :
                  "text-rank-b bg-rank-b/10"
                }`}>{uq.quest.difficulty}</span>
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1">{uq.quest.title}</h4>
              <p className="text-xs text-muted-foreground mb-2">{uq.quest.objective}</p>
              <div className="text-xs text-muted-foreground font-mono">+{uq.quest.xp_reward} XP</div>
            </motion.div>
          )) : (
            <div className="surface-card-inset p-4 text-center text-sm text-muted-foreground">No active quests. Visit Quest Log to get started.</div>
          )}
        </div>

        {/* Stats */}
        <div className="lg:col-span-1 space-y-4">
          <StatRadar
            stats={career ? {
              Technical: career.stat_technical || 10,
              Logic: career.stat_logic || 10,
              Creativity: career.stat_creativity || 10,
              Communication: career.stat_communication || 10,
              Leadership: career.stat_leadership || 10,
              "Problem Solving": career.stat_problem_solving || 10,
            } : undefined}
          />
        </div>

        {/* Right column */}
        <div className="lg:col-span-1 space-y-4">
          <Achievements />
          <Leaderboard />
        </div>
      </div>
    </>
  );
}

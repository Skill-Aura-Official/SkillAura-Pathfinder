import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, DollarSign, Award, Briefcase, GraduationCap, Flame, Calendar, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import QuestCard, { Quest } from "@/components/dashboard/QuestCard";
import StatRadar from "@/components/dashboard/StatRadar";
import SkillTree from "@/components/dashboard/SkillTree";
import CareerGPS from "@/components/dashboard/CareerGPS";
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

interface Profile {
  display_name: string | null;
}

const classLabels: Record<string, string> = {
  explorer: "Explorer",
  software_engineer: "Software Engineer",
  data_scientist: "Data Scientist",
  ai_engineer: "AI Engineer",
  product_manager: "Product Manager",
  cybersecurity_analyst: "Cybersecurity Analyst",
  entrepreneur: "Entrepreneur",
};

const classIcons: Record<string, typeof Target> = {
  explorer: Target,
  data_scientist: TrendingUp,
  ai_engineer: Flame,
  software_engineer: GraduationCap,
  product_manager: Briefcase,
  cybersecurity_analyst: Target,
  entrepreneur: DollarSign,
};

const defaultQuests: Quest[] = [
  { id: "1", title: "Complete ML Basics", objective: "Finish the introduction to supervised learning module.", difficulty: "D", xpReward: 200, skillReward: "ML +1", type: "daily", status: "available" },
  { id: "2", title: "Build REST API", objective: "Create a CRUD API with authentication and testing.", difficulty: "C", xpReward: 350, skillReward: "Backend +2", type: "weekly", status: "in_progress", progress: 65 },
  { id: "3", title: "Deploy ML Model", objective: "Train and deploy a classification model to production.", difficulty: "B", xpReward: 500, skillReward: "ML +3", type: "boss", status: "available" },
];

export default function DashboardHome() {
  const { user } = useAuth();
  const [career, setCareer] = useState<CareerProfile | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("career_profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("profiles").select("display_name").eq("user_id", user.id).single(),
    ]).then(([careerRes, profileRes]) => {
      if (careerRes.data) setCareer(careerRes.data as unknown as CareerProfile);
      if (profileRes.data) setProfile(profileRes.data);
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-primary animate-pulse font-mono text-sm">Loading career data...</div>
      </div>
    );
  }

  const displayName = profile?.display_name || "Operative";
  const careerClass = career?.career_class || "explorer";
  const ClassIcon = classIcons[careerClass] || Target;
  const resumeData = career?.resume_data as { skills?: string[]; experience?: string; education?: string } | null;
  const interviewData = career?.interview_data as { goals?: string; strengths?: string; interests?: string } | null;
  const skills = resumeData?.skills || [];

  const statsCards = [
    { icon: Target, label: "Job Readiness", value: `${career?.job_readiness?.toFixed(1) || 0}%`, color: "text-primary" },
    { icon: TrendingUp, label: "Career Class", value: classLabels[careerClass] || "Explorer", color: "text-rank-c" },
    { icon: DollarSign, label: "Salary Estimate", value: career?.salary_estimate || "N/A", color: "text-accent" },
    { icon: Award, label: "Target Role", value: career?.target_career || "Exploring", color: "text-rank-a" },
  ];

  return (
    <>
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 surface-card-inset p-5 relative overflow-hidden"
      >
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
              {interviewData?.goals
                ? `Goal: ${interviewData.goals.slice(0, 80)}${interviewData.goals.length > 80 ? "..." : ""}`
                : "Your career command center awaits."}
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
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="surface-card-inset p-3 group hover:bg-secondary/50 transition-colors"
          >
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

      {/* Skills from Resume */}
      {skills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="text-label px-1 mb-2">Your Skills (from Resume)</div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-mono font-medium border border-primary/20">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Profile Insights */}
      {(resumeData?.experience || interviewData?.strengths) && (
        <div className="grid md:grid-cols-2 gap-3 mb-6">
          {resumeData?.experience && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="surface-card-inset p-4"
            >
              <div className="text-label mb-2">Experience</div>
              <p className="text-sm text-foreground">{resumeData.experience}</p>
              {resumeData.education && (
                <p className="text-xs text-muted-foreground mt-2">🎓 {resumeData.education}</p>
              )}
            </motion.div>
          )}
          {interviewData?.strengths && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="surface-card-inset p-4"
            >
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
        <div className="lg:col-span-1 space-y-4">
          <div className="text-label px-1">Active Quests</div>
          {defaultQuests.map((q) => <QuestCard key={q.id} quest={q} />)}
        </div>
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
          <SkillTree />
        </div>
        <div className="lg:col-span-1 space-y-4">
          <CareerGPS />
          <Achievements />
          <Leaderboard />
        </div>
      </div>
    </>
  );
}

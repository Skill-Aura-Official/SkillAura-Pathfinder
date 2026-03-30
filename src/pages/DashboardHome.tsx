import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, TrendingUp, DollarSign, Award, Briefcase, GraduationCap, Flame, Calendar, ArrowUpRight, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/integrations/api/client";
import StatRadar from "@/components/dashboard/StatRadar";
import Achievements from "@/components/dashboard/Achievements";

interface CareerProfile {
  level: number;
  rank: string;
  currentXp: number;
  maxXp: number;
  careerClass: string;
  targetCareer: string | null;
  jobReadiness: number;
  salaryEstimate: string | null;
  statTechnical: number;
  statLogic: number;
  statCreativity: number;
  statCommunication: number;
  statLeadership: number;
  statProblemSolving: number;
  resumeData: any;
  interviewData: any;
}

interface Quest {
  _id: string;
  title: string;
  questType: string;
  difficulty: string;
  xpReward: number;
  status: string;
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

export default function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [career, setCareer] = useState<CareerProfile | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.get("/profile/career"),
      api.get("/quests?limit=3&status=available"),
    ]).then(([careerData, questData]) => {
      if (careerData.career) setCareer(careerData.career);
      if (questData.quests) setQuests(questData.quests);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
    </div>
  );

  const stats = career ? [
    { label: "Technical", value: career.statTechnical },
    { label: "Logic", value: career.statLogic },
    { label: "Creativity", value: career.statCreativity },
    { label: "Communication", value: career.statCommunication },
    { label: "Leadership", value: career.statLeadership },
    { label: "Problem Solving", value: career.statProblemSolving },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, <span className="text-primary">{user?.displayName || user?.username}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {classLabels[career?.careerClass || "explorer"]} • Rank {career?.rank || "E"} • Level {career?.level || 1}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: TrendingUp, label: "Job Readiness", value: `${career?.jobReadiness || 0}%`, color: "text-green-400" },
          { icon: DollarSign, label: "Salary Est.", value: career?.salaryEstimate || "N/A", color: "text-accent" },
          { icon: Target, label: "Target", value: career?.targetCareer || "Exploring", color: "text-primary" },
          { icon: Award, label: "Class", value: classLabels[career?.careerClass || "explorer"], color: "text-rank-b" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="surface-card-inset p-4">
            <stat.icon className={`h-4 w-4 ${stat.color} mb-2`} strokeWidth={1.5} />
            <div className="text-xs text-muted-foreground">{stat.label}</div>
            <div className="text-sm font-bold text-foreground mt-0.5 truncate">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stat Radar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="lg:col-span-1">
          <StatRadar stats={stats} />
        </motion.div>

        {/* Active Quests */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="lg:col-span-2">
          <div className="surface-card-inset p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-label">Active Quests</div>
              <button onClick={() => navigate("/quests")} className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
            {quests.length > 0 ? (
              <div className="space-y-2">
                {quests.map((q) => (
                  <div key={q._id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div>
                      <div className="text-sm font-medium text-foreground">{q.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 capitalize">{q.questType} • Rank {q.difficulty}</div>
                    </div>
                    <div className="text-xs font-mono text-accent">+{q.xpReward} XP</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">
                No active quests. <button onClick={() => navigate("/quests")} className="text-primary hover:underline">Generate some!</button>
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Achievements />
        {/* Quick Actions */}
        <div className="surface-card-inset p-4">
          <div className="text-label mb-3">Quick Actions</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Flame, label: "AI Mentor", path: "/ai-mentor", color: "text-orange-400" },
              { icon: Calendar, label: "Quest Log", path: "/quests", color: "text-blue-400" },
              { icon: GraduationCap, label: "Skill Tree", path: "/skill-tree", color: "text-green-400" },
              { icon: Briefcase, label: "Career GPS", path: "/career-gps", color: "text-purple-400" },
            ].map((action) => (
              <button key={action.label} onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <action.icon className={`h-5 w-5 ${action.color}`} strokeWidth={1.5} />
                <span className="text-xs text-foreground font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
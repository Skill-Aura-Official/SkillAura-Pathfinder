import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lock, TrendingUp, DollarSign, Target, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/integrations/api/client";

interface CareerProfile {
  level: number;
  rank: string;
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

const milestones = [
  { rank: "E", label: "Initiate", desc: "Begin your journey", xp: 0 },
  { rank: "D", label: "Apprentice", desc: "First skills unlocked", xp: 500 },
  { rank: "C", label: "Practitioner", desc: "Building expertise", xp: 1500 },
  { rank: "B", label: "Specialist", desc: "Advanced capabilities", xp: 3500 },
  { rank: "A", label: "Expert", desc: "Industry recognition", xp: 7000 },
  { rank: "S", label: "Legend", desc: "Peak performance", xp: 15000 },
];

const rankOrder = ["E", "D", "C", "B", "A", "S"];

export default function CareerGPSPage() {
  const { user } = useAuth();
  const [career, setCareer] = useState<CareerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get("/profile/career").then((data) => {
      if (data.career) setCareer(data.career);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
    </div>
  );

  const currentRankIndex = rankOrder.indexOf(career?.rank || "E");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Career GPS</h1>
        <p className="text-sm text-muted-foreground mt-1">Your personalized career roadmap</p>
      </div>

      {/* Career Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Target, label: "Target Career", value: career?.targetCareer || "Exploring", color: "text-primary" },
          { icon: TrendingUp, label: "Job Readiness", value: `${career?.jobReadiness || 0}%`, color: "text-green-400" },
          { icon: DollarSign, label: "Salary Estimate", value: career?.salaryEstimate || "N/A", color: "text-accent" },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="surface-card-inset p-4">
            <item.icon className={`h-5 w-5 ${item.color} mb-2`} strokeWidth={1.5} />
            <div className="text-xs text-muted-foreground">{item.label}</div>
            <div className="text-lg font-bold text-foreground mt-0.5">{item.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Rank Milestones */}
      <div className="surface-card-inset p-6">
        <div className="text-label mb-6">Rank Progression</div>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-6">
            {milestones.map((milestone, i) => {
              const isCompleted = i <= currentRankIndex;
              const isCurrent = i === currentRankIndex;
              const isLocked = i > currentRankIndex;
              return (
                <motion.div key={milestone.rank} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-4 pl-0">
                  <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 flex-shrink-0 ${
                    isCurrent ? "border-primary bg-primary/20" :
                    isCompleted ? "border-green-400 bg-green-400/20" :
                    "border-border bg-background"
                  }`}>
                    {isCompleted && !isCurrent ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    ) : isCurrent ? (
                      <span className="text-xs font-black text-primary">{milestone.rank}</span>
                    ) : (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                  <div className={`flex-1 pb-2 ${isLocked ? "opacity-50" : ""}`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                        Rank {milestone.rank} — {milestone.label}
                      </span>
                      {isCurrent && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">CURRENT</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{milestone.desc}</p>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">{milestone.xp.toLocaleString()} XP required</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats */}
      {career && (
        <div className="surface-card-inset p-4">
          <div className="text-label mb-4">Skill Stats</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "Technical", value: career.statTechnical },
              { label: "Logic", value: career.statLogic },
              { label: "Creativity", value: career.statCreativity },
              { label: "Communication", value: career.statCommunication },
              { label: "Leadership", value: career.statLeadership },
              { label: "Problem Solving", value: career.statProblemSolving },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className="text-foreground font-mono">{stat.value}/50</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(stat.value / 50) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
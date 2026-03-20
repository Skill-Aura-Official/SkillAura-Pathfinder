import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lock, TrendingUp, DollarSign, Target, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function CareerGPSPage() {
  const { user } = useAuth();
  const [career, setCareer] = useState<any>(null);
  const [skills, setSkills] = useState<{ name: string; level: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("career_profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("user_skills").select("level, skill:skills(name)").eq("user_id", user.id),
    ]).then(([careerRes, skillsRes]) => {
      if (careerRes.data) setCareer(careerRes.data);
      if (skillsRes.data) {
        setSkills((skillsRes.data as any[]).map(s => ({ name: (s.skill as any)?.name || "Unknown", level: s.level })));
      }
      setLoading(false);
    });
  }, [user]);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  const interview = career?.interview_data as any;
  const targetCareer = career?.target_career || "Explorer";
  const jobReadiness = career?.job_readiness || 0;
  const salaryEstimate = career?.salary_estimate || "N/A";

  // Build dynamic roadmap from user's skills
  const roadmapSteps = skills
    .sort((a, b) => b.level - a.level)
    .map(s => ({
      label: s.name,
      status: s.level >= 5 ? "done" as const : s.level >= 2 ? "current" as const : "locked" as const,
      level: `Lv${s.level}`,
    }));

  // Add future milestones
  const futureSteps = [
    { label: "Portfolio Projects", status: "locked" as const, level: "-" },
    { label: targetCareer, status: "locked" as const, level: "Goal" },
  ];
  const fullRoadmap = [...roadmapSteps, ...futureSteps];

  const completedSteps = roadmapSteps.filter(s => s.status === "done").length;
  const totalSteps = fullRoadmap.length;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Career GPS</h1>
        <p className="text-sm text-muted-foreground">Your personalized career roadmap with AI predictions.</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Roadmap */}
        <div className="lg:col-span-1">
          <div className="surface-card-inset p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-label">Career Roadmap → {targetCareer}</div>
              <div className="text-xs font-mono text-primary">{progress}%</div>
            </div>
            {fullRoadmap.length > 0 ? (
              <div className="space-y-0">
                {fullRoadmap.map((step, i) => (
                  <div key={step.label + i} className="flex items-center gap-3 py-2.5">
                    <div className="flex flex-col items-center">
                      {step.status === "done" ? <CheckCircle2 className="h-5 w-5 text-rank-c" /> : step.status === "current" ? <Circle className="h-5 w-5 text-primary animate-pulse" /> : <Lock className="h-5 w-5 text-muted-foreground/40" />}
                      {i < fullRoadmap.length - 1 && <div className={`w-px h-5 mt-1 ${step.status === "done" ? "bg-rank-c/30" : "bg-border"}`} />}
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm ${step.status === "done" ? "text-muted-foreground line-through" : step.status === "current" ? "text-foreground font-medium" : "text-muted-foreground/40"}`}>{step.label}</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{step.level}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">Complete onboarding and quests to build your roadmap.</p>
            )}
          </div>
        </div>

        {/* Career Twin */}
        <div className="lg:col-span-2 space-y-4">
          <div className="surface-card-inset p-6">
            <div className="text-label mb-4">AI Career Twin — Simulation</div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <Target className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-2xl font-bold font-mono text-primary">{jobReadiness}%</div>
                <div className="text-label">Job Readiness</div>
              </div>
              <div className="text-center">
                <DollarSign className="h-5 w-5 text-accent mx-auto mb-1" />
                <div className="text-2xl font-bold font-mono text-accent">{salaryEstimate}</div>
                <div className="text-label">Salary Potential</div>
              </div>
              <div className="text-center">
                <TrendingUp className="h-5 w-5 text-rank-c mx-auto mb-1" />
                <div className="text-2xl font-bold font-mono text-rank-c">Lv{career?.level || 1}</div>
                <div className="text-label">Current Level</div>
              </div>
            </div>
            {interview?.goals && (
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">💡 Goal: {interview.goals}. Keep completing quests to increase your job readiness score.</p>
              </div>
            )}
          </div>

          <div className="surface-card-inset p-6">
            <div className="text-label mb-4">Skill Levels</div>
            {skills.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {skills.map(s => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="text-sm text-foreground font-medium w-24 truncate">{s.name}</span>
                    <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full gradient-primary" style={{ width: `${Math.min((s.level / 10) * 100, 100)}%` }} />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{s.level}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Unlock skills through quests to see progress here.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

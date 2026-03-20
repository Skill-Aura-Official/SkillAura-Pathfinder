import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { TrendingUp, Target, Zap, BarChart3, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [career, setCareer] = useState<any>(null);
  const [questStats, setQuestStats] = useState({ total: 0, completed: 0, inProgress: 0 });
  const [skillCount, setSkillCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("career_profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("user_quests").select("status").eq("user_id", user.id),
      supabase.from("user_skills").select("id").eq("user_id", user.id),
    ]).then(([careerRes, questsRes, skillsRes]) => {
      if (careerRes.data) setCareer(careerRes.data);
      if (questsRes.data) {
        const q = questsRes.data;
        setQuestStats({
          total: q.length,
          completed: q.filter(x => x.status === "completed").length,
          inProgress: q.filter(x => x.status === "in_progress").length,
        });
      }
      if (skillsRes.data) setSkillCount(skillsRes.data.length);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  const statData = career ? [
    { stat: "Technical", value: career.stat_technical || 10 },
    { stat: "Logic", value: career.stat_logic || 10 },
    { stat: "Creativity", value: career.stat_creativity || 10 },
    { stat: "Communication", value: career.stat_communication || 10 },
    { stat: "Leadership", value: career.stat_leadership || 10 },
    { stat: "Problem Solving", value: career.stat_problem_solving || 10 },
  ] : [];

  const cards = [
    { icon: Zap, label: "Total XP", value: career?.current_xp?.toLocaleString() || "0", color: "text-accent" },
    { icon: Target, label: "Quests Done", value: String(questStats.completed), color: "text-primary" },
    { icon: TrendingUp, label: "Skills Unlocked", value: String(skillCount), color: "text-rank-c" },
    { icon: BarChart3, label: "Job Readiness", value: `${career?.job_readiness?.toFixed(1) || 0}%`, color: "text-rank-a" },
  ];

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Career Intelligence Analytics</h1>
        <p className="text-sm text-muted-foreground">Deep insights into your career progression.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {cards.map(s => (
          <div key={s.label} className="surface-card-inset p-3">
            <div className="flex items-center gap-2 mb-1"><s.icon className={`h-3.5 w-3.5 ${s.color}`} strokeWidth={1.5} /><span className="text-label">{s.label}</span></div>
            <div className={`text-xl font-bold font-mono tracking-tight ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="surface-card-inset p-6">
          <div className="text-label mb-4">Ability Stats</div>
          {statData.length > 0 ? (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={statData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="stat" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                  <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Complete onboarding to see stats.</p>
          )}
        </div>

        <div className="surface-card-inset p-6">
          <div className="text-label mb-4">Quest Progress</div>
          <div className="space-y-4">
            {[
              { label: "Completed", value: questStats.completed, total: questStats.total, color: "bg-rank-c" },
              { label: "In Progress", value: questStats.inProgress, total: questStats.total, color: "gradient-primary" },
              { label: "Available", value: questStats.total - questStats.completed - questStats.inProgress, total: questStats.total, color: "bg-secondary" },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-mono text-foreground">{s.value}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full rounded-full ${s.color} transition-all`} style={{ width: s.total > 0 ? `${(s.value / s.total) * 100}%` : "0%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

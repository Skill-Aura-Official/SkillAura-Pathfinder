import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function SkillTreePage() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<{ name: string; level: number; category: string }[]>([]);
  const [stats, setStats] = useState<{ name: string; value: number; color: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("user_skills").select("level, skill:skills(name, category)").eq("user_id", user.id),
      supabase.from("career_profiles").select("stat_technical, stat_logic, stat_creativity, stat_communication, stat_leadership, stat_problem_solving").eq("user_id", user.id).single(),
    ]).then(([skillsRes, statsRes]) => {
      if (skillsRes.data) {
        setSkills((skillsRes.data as any[]).map(s => ({
          name: (s.skill as any)?.name || "Unknown",
          level: s.level,
          category: (s.skill as any)?.category || "General",
        })));
      }
      if (statsRes.data) {
        const d = statsRes.data;
        setStats([
          { name: "Technical", value: d.stat_technical || 10, color: "hsl(var(--primary))" },
          { name: "Logic", value: d.stat_logic || 10, color: "hsl(var(--rank-a))" },
          { name: "Creativity", value: d.stat_creativity || 10, color: "hsl(var(--accent))" },
          { name: "Communication", value: d.stat_communication || 10, color: "hsl(var(--rank-c))" },
          { name: "Leadership", value: d.stat_leadership || 10, color: "hsl(var(--rank-s))" },
          { name: "Problem Solving", value: d.stat_problem_solving || 10, color: "hsl(var(--primary))" },
        ]);
      }
      setLoading(false);
    });
  }, [user]);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Skill Tree & Heatmap</h1>
        <p className="text-sm text-muted-foreground">Track your abilities and identify skill gaps.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="surface-card-inset p-6">
          <div className="text-label mb-4">Stat Heatmap</div>
          {stats.length > 0 ? (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {stats.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.7} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Complete onboarding to see your stats.</p>
          )}
        </div>

        <div className="surface-card-inset p-6">
          <div className="text-label mb-4">Your Skills</div>
          {skills.length > 0 ? (
            <div className="space-y-3">
              {skills.map((a, i) => (
                <motion.div key={a.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3">
                  <div className="w-28 text-sm text-foreground font-medium truncate">{a.name}</div>
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${Math.min((a.level / 10) * 100, 100)}%` }} />
                  </div>
                  <span className="text-xs font-mono text-primary w-14 text-right">Lv{a.level}/10</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No skills unlocked yet. Complete quests to earn skills.</p>
          )}
        </div>
      </div>
    </>
  );
}

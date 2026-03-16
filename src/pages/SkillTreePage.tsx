import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const skillCategories = [
  { name: "Technical", value: 78, color: "hsl(217 91% 60%)" },
  { name: "Logic", value: 85, color: "hsl(271 81% 56%)" },
  { name: "Creativity", value: 62, color: "hsl(38 92% 50%)" },
  { name: "Communication", value: 70, color: "hsl(142 71% 45%)" },
  { name: "Leadership", value: 45, color: "hsl(330 81% 60%)" },
  { name: "Problem Solving", value: 88, color: "hsl(217 91% 60%)" },
];

const abilities = [
  { name: "Python", level: 3, maxLevel: 5, category: "Technical" },
  { name: "Machine Learning", level: 1, maxLevel: 5, category: "Technical" },
  { name: "React", level: 2, maxLevel: 5, category: "Technical" },
  { name: "SQL", level: 3, maxLevel: 5, category: "Technical" },
  { name: "Communication", level: 3, maxLevel: 5, category: "Soft" },
  { name: "Leadership", level: 1, maxLevel: 5, category: "Soft" },
  { name: "Problem Solving", level: 4, maxLevel: 5, category: "Core" },
  { name: "System Design", level: 1, maxLevel: 5, category: "Technical" },
];

export default function SkillTreePage() {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Skill Tree & Heatmap</h1>
        <p className="text-sm text-muted-foreground">Track your abilities and identify skill gaps.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skill Heatmap */}
        <div className="surface-card-inset p-6">
          <div className="text-label mb-4">Skill Heatmap</div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillCategories} layout="vertical">
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={{ background: "hsl(217 33% 10%)", border: "1px solid hsl(217 33% 17%)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {skillCategories.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Abilities List */}
        <div className="surface-card-inset p-6">
          <div className="text-label mb-4">Abilities</div>
          <div className="space-y-3">
            {abilities.map((a, i) => (
              <motion.div key={a.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3">
                <div className="w-28 text-sm text-foreground font-medium">{a.name}</div>
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${(a.level / a.maxLevel) * 100}%` }} />
                </div>
                <span className="text-xs font-mono text-primary w-12 text-right">Lv{a.level}/{a.maxLevel}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

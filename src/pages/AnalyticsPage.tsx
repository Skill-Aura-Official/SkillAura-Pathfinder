import { motion } from "framer-motion";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { TrendingUp, Target, Zap, BarChart3 } from "lucide-react";

const xpHistory = [
  { day: "Mon", xp: 120 }, { day: "Tue", xp: 280 }, { day: "Wed", xp: 180 },
  { day: "Thu", xp: 420 }, { day: "Fri", xp: 350 }, { day: "Sat", xp: 500 }, { day: "Sun", xp: 380 },
];

const statData = [
  { stat: "Technical", value: 78 }, { stat: "Logic", value: 85 }, { stat: "Creativity", value: 62 },
  { stat: "Communication", value: 70 }, { stat: "Leadership", value: 45 }, { stat: "Problem Solving", value: 88 },
];

const marketDemand = [
  { skill: "Python", demand: 92 }, { skill: "React", demand: 88 }, { skill: "ML", demand: 95 },
  { skill: "AWS", demand: 85 }, { skill: "SQL", demand: 78 }, { skill: "Docker", demand: 82 },
];

export default function AnalyticsPage() {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Career Intelligence Analytics</h1>
        <p className="text-sm text-muted-foreground">Deep insights into your career progression and market positioning.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Zap, label: "XP This Week", value: "2,230", color: "text-xp" },
          { icon: Target, label: "Quests Done", value: "12", color: "text-primary" },
          { icon: TrendingUp, label: "Streak", value: "7 days", color: "text-rank-c" },
          { icon: BarChart3, label: "Rank Progress", value: "68%", color: "text-rank-a" },
        ].map(s => (
          <div key={s.label} className="surface-card-inset p-3">
            <div className="flex items-center gap-2 mb-1"><s.icon className={`h-3.5 w-3.5 ${s.color}`} strokeWidth={1.5} /><span className="text-label">{s.label}</span></div>
            <div className={`text-xl font-bold font-mono tracking-tight ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="surface-card-inset p-6">
          <div className="text-label mb-4">XP Earned This Week</div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={xpHistory}>
                <XAxis dataKey="day" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(217 33% 10%)", border: "1px solid hsl(217 33% 17%)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="xp" stroke="hsl(38 92% 50%)" strokeWidth={2} dot={{ fill: "hsl(38 92% 50%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface-card-inset p-6">
          <div className="text-label mb-4">Ability Stats</div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={statData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="hsl(217 33% 17%)" />
                <PolarAngleAxis dataKey="stat" tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} />
                <Radar dataKey="value" stroke="hsl(217 91% 60%)" fill="hsl(217 91% 60%)" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface-card-inset p-6 lg:col-span-2">
          <div className="text-label mb-4">Market Demand — Your Skills vs Industry</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {marketDemand.map(s => (
              <div key={s.skill} className="flex items-center gap-3">
                <span className="text-sm text-foreground font-medium w-16">{s.skill}</span>
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-rank-c/70" style={{ width: `${s.demand}%` }} />
                </div>
                <span className="text-xs font-mono text-muted-foreground">{s.demand}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

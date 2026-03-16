import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lock, TrendingUp, DollarSign, Target } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const roadmap = [
  { label: "Python Fundamentals", status: "done" as const, level: "Lv3" },
  { label: "Data Analysis", status: "done" as const, level: "Lv2" },
  { label: "Machine Learning Basics", status: "current" as const, level: "Lv1" },
  { label: "Deep Learning", status: "locked" as const, level: "-" },
  { label: "Portfolio Projects", status: "locked" as const, level: "-" },
  { label: "Internship", status: "locked" as const, level: "-" },
  { label: "Junior Data Scientist", status: "locked" as const, level: "-" },
  { label: "Senior Data Scientist", status: "locked" as const, level: "-" },
];

const salaryData = [
  { month: "Now", salary: 0 }, { month: "3m", salary: 3 }, { month: "6m", salary: 5 },
  { month: "1y", salary: 8 }, { month: "2y", salary: 14 }, { month: "3y", salary: 22 },
];

const careerTwin = {
  jobReadiness: 64.2,
  salaryPotential: "₹8.4L",
  timeline: "18 months",
  prediction: "If you complete Machine Learning Lv4, job readiness increases to 78%.",
};

export default function CareerGPSPage() {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Career GPS</h1>
        <p className="text-sm text-muted-foreground">Your step-by-step career roadmap with AI predictions.</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Roadmap */}
        <div className="lg:col-span-1">
          <div className="surface-card-inset p-4">
            <div className="text-label mb-4">Career Roadmap → Data Scientist</div>
            <div className="space-y-0">
              {roadmap.map((step, i) => (
                <div key={step.label} className="flex items-center gap-3 py-2.5">
                  <div className="flex flex-col items-center">
                    {step.status === "done" ? <CheckCircle2 className="h-5 w-5 text-rank-c" /> : step.status === "current" ? <Circle className="h-5 w-5 text-primary animate-pulse-glow" /> : <Lock className="h-5 w-5 text-muted-foreground/40" />}
                    {i < roadmap.length - 1 && <div className={`w-px h-5 mt-1 ${step.status === "done" ? "bg-rank-c/30" : "bg-border"}`} />}
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm ${step.status === "done" ? "text-muted-foreground line-through" : step.status === "current" ? "text-foreground font-medium" : "text-muted-foreground/40"}`}>{step.label}</span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{step.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Career Twin & Salary */}
        <div className="lg:col-span-2 space-y-4">
          {/* Career Twin */}
          <div className="surface-card-inset p-6">
            <div className="text-label mb-4">AI Career Twin — Simulation</div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <Target className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-2xl font-bold font-mono text-primary">{careerTwin.jobReadiness}%</div>
                <div className="text-label">Job Readiness</div>
              </div>
              <div className="text-center">
                <DollarSign className="h-5 w-5 text-accent mx-auto mb-1" />
                <div className="text-2xl font-bold font-mono text-accent">{careerTwin.salaryPotential}</div>
                <div className="text-label">Salary Potential</div>
              </div>
              <div className="text-center">
                <TrendingUp className="h-5 w-5 text-rank-c mx-auto mb-1" />
                <div className="text-2xl font-bold font-mono text-rank-c">{careerTwin.timeline}</div>
                <div className="text-label">Est. Timeline</div>
              </div>
            </div>
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">💡 {careerTwin.prediction}</p>
            </div>
          </div>

          {/* Salary Projection */}
          <div className="surface-card-inset p-6">
            <div className="text-label mb-4">Salary Projection (₹ Lakhs/Year)</div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salaryData}>
                  <defs>
                    <linearGradient id="salaryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(217 33% 10%)", border: "1px solid hsl(217 33% 17%)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="salary" stroke="hsl(217 91% 60%)" fill="url(#salaryGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { motion } from "framer-motion";
import { Target, TrendingUp, DollarSign, Award } from "lucide-react";
import QuestCard, { Quest } from "@/components/dashboard/QuestCard";
import StatRadar from "@/components/dashboard/StatRadar";
import SkillTree from "@/components/dashboard/SkillTree";
import CareerGPS from "@/components/dashboard/CareerGPS";
import Achievements from "@/components/dashboard/Achievements";
import Leaderboard from "@/components/dashboard/Leaderboard";

const quests: Quest[] = [
  { id: "1", title: "Complete ML Basics", objective: "Finish the introduction to supervised learning module.", difficulty: "D", xpReward: 200, skillReward: "ML +1", type: "daily", status: "available" },
  { id: "2", title: "Build REST API", objective: "Create a CRUD API with authentication and testing.", difficulty: "C", xpReward: 350, skillReward: "Backend +2", type: "weekly", status: "in_progress", progress: 65 },
  { id: "3", title: "Deploy ML Model", objective: "Train and deploy a classification model to production.", difficulty: "B", xpReward: 500, skillReward: "ML +3", type: "boss", status: "available" },
];

export default function DashboardHome() {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Career Command Center</h1>
        <p className="text-sm text-muted-foreground">Welcome back, Operative. 3 quests await.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Target, label: "Job Readiness", value: "64.2%", color: "text-primary" },
          { icon: TrendingUp, label: "Market Demand", value: "High", color: "text-rank-c" },
          { icon: DollarSign, label: "Salary Estimate", value: "₹8.4L", color: "text-accent" },
          { icon: Award, label: "Achievements", value: "6 / 24", color: "text-rank-a" },
        ].map((s) => (
          <div key={s.label} className="surface-card-inset p-3">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`h-3.5 w-3.5 ${s.color}`} strokeWidth={1.5} />
              <span className="text-label">{s.label}</span>
            </div>
            <div className={`text-xl font-bold font-mono tracking-tight ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <div className="text-label px-1">Active Quests</div>
          {quests.map((q) => <QuestCard key={q.id} quest={q} />)}
        </div>
        <div className="lg:col-span-1 space-y-4">
          <StatRadar />
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

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, Home, Swords, Map, BarChart3, Award, MessageSquare, Settings, LogOut, Target, TrendingUp, DollarSign } from "lucide-react";
import XPBar from "@/components/dashboard/XPBar";
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

const sidebarItems = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: Swords, label: "Quests" },
  { icon: Map, label: "Career GPS" },
  { icon: Target, label: "Skill Tree" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Award, label: "Achievements" },
  { icon: MessageSquare, label: "AI Mentor" },
  { icon: Settings, label: "Settings" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-border/50 p-4">
        <div className="flex items-center gap-2 mb-8 px-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <Zap className="h-4 w-4 text-foreground" />
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">SkillAura</span>
        </div>
        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.5} />
              {item.label}
            </button>
          ))}
        </nav>
        <button className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => navigate("/")}>
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
          Exit System
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl px-6 py-3">
          <XPBar level={7} currentXP={1420} maxXP={2000} rank="D" />
        </header>

        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Career Command Center</h1>
            <p className="text-sm text-muted-foreground">Welcome back, Operative. 3 quests await.</p>
          </motion.div>

          {/* Quick stats */}
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

          {/* Main grid */}
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Left column - Quests */}
            <div className="lg:col-span-1 space-y-4">
              <div className="text-label px-1">Active Quests</div>
              {quests.map((q) => (
                <QuestCard key={q.id} quest={q} />
              ))}
            </div>

            {/* Center column */}
            <div className="lg:col-span-1 space-y-4">
              <StatRadar />
              <SkillTree />
            </div>

            {/* Right column */}
            <div className="lg:col-span-1 space-y-4">
              <CareerGPS />
              <Achievements />
              <Leaderboard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

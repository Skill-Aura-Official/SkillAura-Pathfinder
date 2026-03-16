import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Zap, Home, Swords, Map, Target, BarChart3, Award, MessageSquare, Settings, LogOut, Users, Shield, Briefcase, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import XPBar from "@/components/dashboard/XPBar";

const playerItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Swords, label: "Quests", path: "/quests" },
  { icon: Map, label: "Career GPS", path: "/career-gps" },
  { icon: Target, label: "Skill Tree", path: "/skill-tree" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Award, label: "Achievements", path: "/achievements" },
  { icon: Crown, label: "Leaderboard", path: "/leaderboard" },
  { icon: MessageSquare, label: "AI Mentor", path: "/ai-mentor" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const adminItems = [
  { icon: Shield, label: "Admin Panel", path: "/admin" },
];

const recruiterItems = [
  { icon: Briefcase, label: "Recruiter", path: "/recruiter" },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const allItems = [...playerItems, ...adminItems, ...recruiterItems];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:flex flex-col w-60 border-r border-border/50 p-4">
        <div className="flex items-center gap-2 mb-8 px-2 cursor-pointer" onClick={() => navigate("/")}>
          <img src="/favicon.png" alt="SkillAura PathFinder AI" className="h-8 w-8" />
          <span className="text-base font-bold tracking-tight text-foreground">SkillAura <span className="text-primary">PF</span></span>
        </div>
        <nav className="flex-1 space-y-1">
          {allItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.5} />
              {item.label}
            </button>
          ))}
        </nav>
        <button
          className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={async () => { await signOut(); navigate("/"); }}
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
          Exit System
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl px-6 py-3">
          <XPBar level={7} currentXP={1420} maxXP={2000} rank="D" />
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

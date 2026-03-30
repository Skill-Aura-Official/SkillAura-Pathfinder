import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Home, Swords, Map, Target, BarChart3, Award, MessageSquare, Settings, LogOut, Shield, Briefcase, Crown, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/integrations/api/client";
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

const adminItems = [{ icon: Shield, label: "Admin Panel", path: "/admin" }];
const recruiterItems = [{ icon: Briefcase, label: "Recruiter", path: "/recruiter" }];

interface CareerData {
  level: number;
  currentXp: number;
  maxXp: number;
  rank: string;
  careerClass: string;
}

const classLabels: Record<string, string> = {
  explorer: "Explorer",
  software_engineer: "Software Engineer",
  data_scientist: "Data Scientist",
  ai_engineer: "AI Engineer",
  product_manager: "Product Manager",
  cybersecurity_analyst: "Cybersecurity Analyst",
  entrepreneur: "Entrepreneur",
};

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [career, setCareer] = useState<CareerData | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.get("/profile/career").then((data) => {
      if (data.career) setCareer(data.career);
      if (data.theme) document.body.setAttribute("data-theme", data.theme);
    }).catch(() => {});
  }, [user]);

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isRecruiter = user?.role === "recruiter";

  const allItems = [
    ...playerItems,
    ...(isAdmin ? adminItems : []),
    ...(isRecruiter ? recruiterItems : []),
  ];

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 mb-8 px-2 cursor-pointer" onClick={() => navigate("/")}>
        <img src="/favicon.png" alt="SkillAura PathFinder AI" className="h-8 w-8" />
        <span className="text-base font-bold tracking-tight text-foreground">
          SkillAura <span className="text-primary">PF</span>
        </span>
      </div>

      <div className="mb-6 px-2">
        <div className="surface-card-inset p-3">
          <div className="text-sm font-bold text-foreground">{user?.displayName || user?.username}</div>
          <div className="text-[10px] font-mono text-primary mt-0.5">
            {classLabels[career?.careerClass || "explorer"]} • Rank {career?.rank || "E"}
          </div>
          {(isAdmin || isRecruiter) && (
            <div className="mt-1.5 flex gap-1">
              {isAdmin && <span className="text-[9px] px-1.5 py-0.5 rounded bg-rank-a/10 text-rank-a font-bold uppercase">Admin</span>}
              {isRecruiter && <span className="text-[9px] px-1.5 py-0.5 rounded bg-rank-d/10 text-rank-d font-bold uppercase">Recruiter</span>}
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {allItems.map((item) => (
          <button
            key={item.path}
            onClick={() => { navigate(item.path); setMobileMenu(false); }}
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
        onClick={() => { signOut(); navigate("/"); }}
      >
        <LogOut className="h-4 w-4" strokeWidth={1.5} />
        Exit System
      </button>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:flex flex-col w-60 border-r border-border/50 p-4">
        <SidebarContent />
      </aside>

      <button
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-card border border-border/50"
        onClick={() => setMobileMenu(!mobileMenu)}
      >
        {mobileMenu ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
      </button>

      {mobileMenu && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenu(false)} />
          <aside className="relative flex flex-col w-60 h-full bg-background border-r border-border/50 p-4 pt-14">
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-xl px-6 py-3">
          <XPBar
            level={career?.level || 1}
            currentXP={career?.currentXp || 0}
            maxXP={career?.maxXp || 200}
            rank={career?.rank || "E"}
            playerName={user?.displayName || user?.username || "Player"}
            careerClass={classLabels[career?.careerClass || "explorer"]}
          />
        </header>
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
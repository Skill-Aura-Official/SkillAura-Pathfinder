import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Swords, Map, Target, BarChart3, Award, MessageSquare, Settings,
  LogOut, Shield, Briefcase, Crown, Menu, X, ChevronLeft, Zap,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import XPBar from "@/components/dashboard/XPBar";
import { Skeleton } from "@/components/ui/skeleton";

const playerItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Swords, label: "Quests", path: "/quests" },
  { icon: Map, label: "Career GPS", path: "/career-gps" },
  { icon: Target, label: "Skill Tree", path: "/skill-tree" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Award, label: "Achievements", path: "/achievements" },
  { icon: Crown, label: "Leaderboard", path: "/leaderboard" },
  { icon: MessageSquare, label: "AI Mentor", path: "/ai-mentor" },
];

const settingsItem = { icon: Settings, label: "Settings", path: "/settings" };
const adminItems = [{ icon: Shield, label: "Admin Panel", path: "/admin" }];
const recruiterItems = [{ icon: Briefcase, label: "Recruiter", path: "/recruiter" }];

interface CareerData {
  level: number;
  current_xp: number;
  max_xp: number;
  rank: string;
  career_class: string;
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
  const [roles, setRoles] = useState<string[]>([]);
  const [career, setCareer] = useState<CareerData | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sa-sidebar-collapsed") === "1";
  });
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", user.id),
      supabase.from("career_profiles").select("level, current_xp, max_xp, rank, career_class").eq("user_id", user.id).maybeSingle(),
      supabase.from("profiles").select("display_name, theme").eq("user_id", user.id).maybeSingle(),
    ]).then(([rolesRes, careerRes, profileRes]) => {
      if (rolesRes.data) setRoles(rolesRes.data.map((r) => r.role));
      if (careerRes.data) setCareer(careerRes.data as unknown as CareerData);
      if (profileRes.data) {
        setDisplayName(profileRes.data.display_name || "");
        const theme = (profileRes.data as any).theme || "ocean";
        document.body.setAttribute("data-theme", theme);
      }
      setLoadingProfile(false);
    });
  }, [user]);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenu(false); }, [location.pathname]);

  const isAdmin = roles.includes("admin") || roles.includes("super_admin");
  const isRecruiter = roles.includes("recruiter");

  const allItems = [
    ...playerItems,
    ...(isAdmin ? adminItems : []),
    ...(isRecruiter ? recruiterItems : []),
  ];

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sa-sidebar-collapsed", next ? "1" : "0");
  };

  const SidebarBody = ({ inDrawer = false }: { inDrawer?: boolean }) => (
    <>
      {/* Brand */}
      <button
        onClick={() => navigate("/")}
        className={`flex items-center gap-2.5 mb-7 px-2 group ${collapsed && !inDrawer ? "justify-center" : ""}`}
      >
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-xl gradient-primary grid place-items-center shadow-[0_0_24px_-4px_hsl(var(--primary)/0.6)] group-hover:shadow-[0_0_32px_-2px_hsl(var(--primary)/0.8)] transition-shadow">
            <Zap className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
        </div>
        {(!collapsed || inDrawer) && (
          <div className="flex flex-col items-start leading-tight">
            <span className="text-sm font-display font-bold text-foreground">SkillAura</span>
            <span className="text-[10px] font-mono text-primary tracking-wider">PATHFINDER · AI</span>
          </div>
        )}
      </button>

      {/* Identity card */}
      {(!collapsed || inDrawer) && (
        <div className="mb-5 px-2">
          <div className="surface-card-inset p-3">
            {loadingProfile ? (
              <>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-32" />
              </>
            ) : (
              <>
                <div className="text-sm font-bold text-foreground truncate">{displayName || "Operative"}</div>
                <div className="text-[10px] font-mono text-primary mt-0.5 truncate">
                  {classLabels[career?.career_class || "explorer"]} · Rank {career?.rank || "E"}
                </div>
                {(isAdmin || isRecruiter) && (
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {isAdmin && <span className="text-[9px] px-1.5 py-0.5 rounded bg-rank-a/15 text-rank-a font-bold uppercase tracking-wider">Admin</span>}
                    {isRecruiter && <span className="text-[9px] px-1.5 py-0.5 rounded bg-rank-d/15 text-rank-d font-bold uppercase tracking-wider">Recruiter</span>}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-0.5">
        {allItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setMobileMenu(false); }}
              title={collapsed && !inDrawer ? item.label : undefined}
              className={`relative flex items-center gap-3 w-full ${collapsed && !inDrawer ? "px-0 justify-center" : "px-3"} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-r bg-primary shadow-[0_0_12px_hsl(var(--primary))]"
                />
              )}
              <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {(!collapsed || inDrawer) && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="mt-3 pt-3 border-t border-border/50 space-y-0.5">
        <button
          onClick={() => { navigate(settingsItem.path); setMobileMenu(false); }}
          title={collapsed && !inDrawer ? "Settings" : undefined}
          className={`flex items-center gap-3 w-full ${collapsed && !inDrawer ? "px-0 justify-center" : "px-3"} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            location.pathname === settingsItem.path
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          }`}
        >
          <Settings className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          {(!collapsed || inDrawer) && <span>Settings</span>}
        </button>
        <button
          className={`flex items-center gap-3 w-full ${collapsed && !inDrawer ? "px-0 justify-center" : "px-3"} py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200`}
          onClick={async () => { await signOut(); navigate("/"); }}
          title={collapsed && !inDrawer ? "Exit System" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          {(!collapsed || inDrawer) && <span>Exit System</span>}
        </button>
      </div>
    </>
  );

  const sidebarWidth = collapsed ? "w-[72px]" : "w-64";

  return (
    <div className="flex min-h-screen bg-background relative aurora-bg">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col ${sidebarWidth} shrink-0 border-r border-border/50 p-4 sticky top-0 h-screen z-30 bg-sidebar/60 backdrop-blur-xl transition-[width] duration-300`}
      >
        <SidebarBody />
        {/* Collapse toggle */}
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border grid place-items-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors shadow-md"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={`h-3.5 w-3.5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </aside>

      {/* Mobile menu trigger */}
      <button
        className="lg:hidden fixed top-3 left-3 z-50 p-2.5 rounded-xl glass-strong"
        onClick={() => setMobileMenu(!mobileMenu)}
        aria-label="Toggle menu"
      >
        {mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setMobileMenu(false)} />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="relative flex flex-col w-72 h-full bg-sidebar border-r border-border/50 p-4 pt-16"
            >
              <SidebarBody inDrawer />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 min-w-0 relative z-10">
        <header className="sticky top-0 z-20 border-b border-border/50 bg-background/70 backdrop-blur-xl px-4 md:px-6 py-3 pl-16 lg:pl-6">
          {loadingProfile ? (
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </div>
          ) : (
            <XPBar
              level={career?.level || 1}
              currentXP={career?.current_xp || 0}
              maxXP={career?.max_xp || 200}
              rank={career?.rank || "E"}
              playerName={displayName}
              careerClass={classLabels[career?.career_class || "explorer"]}
            />
          )}
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Swords, BarChart3, Settings, Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type Tab = "users" | "quests" | "analytics";

interface UserRow { user_id: string; display_name: string | null; level: number | null; rank: string | null; career_class: string | null; current_xp: number | null; }
interface QuestRow { id: string; title: string; quest_type: string; difficulty: string; xp_reward: number; }

const classLabels: Record<string, string> = {
  explorer: "Explorer", software_engineer: "Software Engineer", data_scientist: "Data Scientist",
  ai_engineer: "AI Engineer", product_manager: "Product Manager", cybersecurity_analyst: "Cybersecurity Analyst", entrepreneur: "Entrepreneur",
};

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>("users");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [quests, setQuests] = useState<QuestRow[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalQuests: 0, completedQuests: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("leaderboard").select("*").order("current_xp", { ascending: false }),
      supabase.from("quests").select("id, title, quest_type, difficulty, xp_reward"),
      supabase.from("user_quests").select("status"),
    ]).then(([usersRes, questsRes, uqRes]) => {
      if (usersRes.data) {
        setUsers(usersRes.data.map(u => ({
          user_id: u.user_id || "",
          display_name: u.display_name,
          level: u.level,
          rank: u.rank,
          career_class: u.career_class,
          current_xp: u.current_xp,
        })));
      }
      if (questsRes.data) setQuests(questsRes.data);
      const completed = (uqRes.data || []).filter(q => q.status === "completed").length;
      setStats({
        totalUsers: usersRes.data?.length || 0,
        totalQuests: questsRes.data?.length || 0,
        completedQuests: completed,
      });
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  const filteredUsers = users.filter(u => (u.display_name || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Panel</h1>
        <p className="text-sm text-muted-foreground">Manage users, quests, and platform analytics.</p>
      </motion.div>

      <div className="flex gap-2 mb-6">
        {([["users", Users, "Users"], ["quests", Swords, "Quests"], ["analytics", BarChart3, "Analytics"]] as [Tab, typeof Users, string][]).map(([key, Icon, label]) => (
          <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === key ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
            <Icon className="h-3.5 w-3.5" />{label}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div className="surface-card-inset">
          <div className="p-4 border-b border-border/30 flex items-center gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-secondary border-border h-9" /></div>
          </div>
          <div className="divide-y divide-border/30">
            {filteredUsers.map(u => (
              <div key={u.user_id} className="flex items-center justify-between px-4 py-3">
                <div><div className="text-sm font-medium text-foreground">{u.display_name || "Unknown"}</div></div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-muted-foreground">Lv{u.level || 1}</span>
                  <span className="text-xs font-mono text-primary">{u.rank || "E"}</span>
                  <span className="text-xs text-muted-foreground">{classLabels[u.career_class || "explorer"]}</span>
                  <span className="text-xs font-mono text-accent">{(u.current_xp || 0).toLocaleString()} XP</span>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">No users found.</div>}
          </div>
        </div>
      )}

      {tab === "quests" && (
        <div className="surface-card-inset divide-y divide-border/30">
          {quests.map(q => (
            <div key={q.id} className="flex items-center justify-between px-4 py-3">
              <div className="text-sm font-medium text-foreground">{q.title}</div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">{q.quest_type}</span>
                <span className="text-xs font-mono text-primary">{q.difficulty}</span>
                <span className="text-xs font-mono text-accent">+{q.xp_reward} XP</span>
              </div>
            </div>
          ))}
          {quests.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">No quests in the system.</div>}
        </div>
      )}

      {tab === "analytics" && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Total Users", value: stats.totalUsers },
            { label: "Total Quests", value: stats.totalQuests },
            { label: "Quests Completed", value: stats.completedQuests },
          ].map(s => (
            <div key={s.label} className="surface-card-inset p-4 text-center">
              <div className="text-2xl font-bold font-mono text-foreground">{s.value.toLocaleString()}</div>
              <div className="text-label mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

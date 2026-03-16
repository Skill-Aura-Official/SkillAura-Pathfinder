import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Swords, BarChart3, Settings, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Tab = "users" | "quests" | "skills" | "analytics";

const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", level: 12, rank: "C", class: "Data Scientist", status: "active" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", level: 8, rank: "D", class: "Software Engineer", status: "active" },
  { id: "3", name: "Bob Wilson", email: "bob@example.com", level: 3, rank: "E", class: "Explorer", status: "inactive" },
];

const mockQuests = [
  { id: "1", title: "ML Basics", type: "daily", difficulty: "D", xp: 200, active: true },
  { id: "2", title: "Build REST API", type: "weekly", difficulty: "C", xp: 350, active: true },
  { id: "3", title: "System Design Boss", type: "boss", difficulty: "A", xp: 800, active: true },
];

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>("users");
  const [search, setSearch] = useState("");

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Panel</h1>
        <p className="text-sm text-muted-foreground">Manage users, quests, skills, and platform analytics.</p>
      </motion.div>

      <div className="flex gap-2 mb-6">
        {([["users", Users, "Users"], ["quests", Swords, "Quests"], ["skills", Settings, "Skills"], ["analytics", BarChart3, "Analytics"]] as [Tab, typeof Users, string][]).map(([key, Icon, label]) => (
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
            {mockUsers.filter(u => u.name.toLowerCase().includes(search.toLowerCase())).map(u => (
              <div key={u.id} className="flex items-center justify-between px-4 py-3">
                <div><div className="text-sm font-medium text-foreground">{u.name}</div><div className="text-xs text-muted-foreground">{u.email}</div></div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-muted-foreground">Lv{u.level}</span>
                  <span className="text-xs font-mono text-primary">{u.rank}</span>
                  <span className="text-xs text-muted-foreground">{u.class}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${u.status === "active" ? "bg-rank-c/10 text-rank-c" : "bg-destructive/10 text-destructive"}`}>{u.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "quests" && (
        <div>
          <div className="flex justify-end mb-4"><Button size="sm" className="gradient-primary text-foreground border-0"><Plus className="h-3 w-3 mr-1" />Create Quest</Button></div>
          <div className="surface-card-inset divide-y divide-border/30">
            {mockQuests.map(q => (
              <div key={q.id} className="flex items-center justify-between px-4 py-3">
                <div className="text-sm font-medium text-foreground">{q.title}</div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">{q.type}</span>
                  <span className="text-xs font-mono text-primary">{q.difficulty}</span>
                  <span className="text-xs font-mono text-xp">+{q.xp} XP</span>
                  <Button size="sm" variant="outline" className="border-border h-7 text-xs">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "skills" && (
        <div className="surface-card-inset p-6 text-center text-sm text-muted-foreground">
          <Settings className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
          <p>Skill management: Create skill trees, define prerequisites, manage career paths.</p>
          <Button size="sm" className="gradient-primary text-foreground border-0 mt-4"><Plus className="h-3 w-3 mr-1" />Add Skill</Button>
        </div>
      )}

      {tab === "analytics" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Users", value: "1,247" },
            { label: "Active Today", value: "342" },
            { label: "Quests Completed", value: "8,923" },
            { label: "Avg. Level", value: "4.2" },
          ].map(s => (
            <div key={s.label} className="surface-card-inset p-4 text-center">
              <div className="text-2xl font-bold font-mono text-foreground">{s.value}</div>
              <div className="text-label mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Swords, Zap, Clock, ChevronRight, Shield, Flame, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuestFilter = "all" | "daily" | "weekly" | "boss" | "epic";

const allQuests = [
  { id: "1", title: "Complete ML Basics", objective: "Finish supervised learning module", difficulty: "D", xpReward: 200, skillReward: "ML +1", type: "daily" as const, status: "available" as const },
  { id: "2", title: "Build REST API", objective: "Create a CRUD API with auth", difficulty: "C", xpReward: 350, skillReward: "Backend +2", type: "weekly" as const, status: "in_progress" as const, progress: 65 },
  { id: "3", title: "Deploy ML Model", objective: "Deploy classification model to prod", difficulty: "B", xpReward: 500, skillReward: "ML +3", type: "boss" as const, status: "available" as const },
  { id: "4", title: "Write Technical Blog", objective: "Publish a blog on Medium or Dev.to", difficulty: "E", xpReward: 100, skillReward: "Communication +1", type: "daily" as const, status: "available" as const },
  { id: "5", title: "Open Source Contribution", objective: "Contribute to an open source project", difficulty: "C", xpReward: 300, skillReward: "Collaboration +2", type: "weekly" as const, status: "available" as const },
  { id: "6", title: "Full Stack Portfolio", objective: "Build and deploy a full-stack portfolio app", difficulty: "A", xpReward: 1000, skillReward: "All +3", type: "epic" as const, status: "available" as const },
  { id: "7", title: "System Design Interview", objective: "Practice system design with mock interview", difficulty: "A", xpReward: 800, skillReward: "Architecture +3", type: "boss" as const, status: "available" as const },
  { id: "8", title: "LeetCode Daily Challenge", objective: "Solve today's LeetCode problem", difficulty: "D", xpReward: 150, skillReward: "Logic +1", type: "daily" as const, status: "completed" as const },
];

const difficultyColor: Record<string, string> = {
  E: "text-rank-e bg-rank-e/10", D: "text-rank-d bg-rank-d/10", C: "text-rank-c bg-rank-c/10",
  B: "text-rank-b bg-rank-b/10", A: "text-rank-a bg-rank-a/10", S: "text-rank-s bg-rank-s/10",
};

const typeIcons: Record<string, typeof Swords> = {
  daily: Flame, weekly: Clock, boss: Shield, epic: Crown,
};

export default function QuestLog() {
  const [filter, setFilter] = useState<QuestFilter>("all");
  const filtered = filter === "all" ? allQuests : allQuests.filter(q => q.type === filter);

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Quest Log</h1>
        <p className="text-sm text-muted-foreground">Accept quests to earn XP and level up your abilities.</p>
      </motion.div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "daily", "weekly", "boss", "epic"] as QuestFilter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((q, i) => {
          const TypeIcon = typeIcons[q.type] || Swords;
          return (
            <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="surface-interactive p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TypeIcon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                  <span className="text-label">{q.type} Quest</span>
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${difficultyColor[q.difficulty]}`}>{q.difficulty}</span>
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1">{q.title}</h4>
              <p className="text-xs text-muted-foreground mb-3">{q.objective}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-xp" /><span className="font-mono">+{q.xpReward} XP</span></span>
                <span className="font-mono">{q.skillReward}</span>
              </div>
              {q.status === "in_progress" && q.progress != null ? (
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full gradient-primary" style={{ width: `${q.progress}%` }} />
                </div>
              ) : q.status === "completed" ? (
                <div className="text-xs font-mono text-rank-c text-center">✓ Completed</div>
              ) : (
                <Button size="sm" className="w-full gradient-primary text-foreground border-0 h-8 text-xs">
                  Accept Quest <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

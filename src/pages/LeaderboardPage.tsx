import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Trophy, Medal } from "lucide-react";

type Category = "global" | "data_science" | "engineering" | "quest_completion";

const leaderboards: Record<Category, { rank: number; name: string; level: number; xp: string; badge: string; isUser?: boolean }[]> = {
  global: [
    { rank: 1, name: "ArcaneKoder", level: 42, xp: "12.4K", badge: "S" },
    { rank: 2, name: "NeuralNinja", level: 38, xp: "11.1K", badge: "A" },
    { rank: 3, name: "DataPioneer", level: 35, xp: "9.8K", badge: "A" },
    { rank: 4, name: "CodeWizard", level: 30, xp: "8.2K", badge: "B" },
    { rank: 5, name: "ByteMaster", level: 28, xp: "7.5K", badge: "B" },
    { rank: 42, name: "You", level: 7, xp: "1.4K", badge: "D", isUser: true },
  ],
  data_science: [
    { rank: 1, name: "DataPioneer", level: 35, xp: "9.8K", badge: "A" },
    { rank: 2, name: "NeuralNinja", level: 38, xp: "8.5K", badge: "A" },
    { rank: 3, name: "MLExplorer", level: 25, xp: "6.2K", badge: "B" },
    { rank: 12, name: "You", level: 7, xp: "1.4K", badge: "D", isUser: true },
  ],
  engineering: [
    { rank: 1, name: "ArcaneKoder", level: 42, xp: "12.4K", badge: "S" },
    { rank: 2, name: "CodeWizard", level: 30, xp: "8.2K", badge: "B" },
    { rank: 3, name: "ByteMaster", level: 28, xp: "7.5K", badge: "B" },
    { rank: 8, name: "You", level: 7, xp: "1.4K", badge: "D", isUser: true },
  ],
  quest_completion: [
    { rank: 1, name: "QuestHunter99", level: 40, xp: "324 quests", badge: "S" },
    { rank: 2, name: "ArcaneKoder", level: 42, xp: "298 quests", badge: "S" },
    { rank: 3, name: "NeuralNinja", level: 38, xp: "275 quests", badge: "A" },
    { rank: 55, name: "You", level: 7, xp: "8 quests", badge: "D", isUser: true },
  ],
};

const badgeColor: Record<string, string> = { S: "text-rank-s", A: "text-rank-a", B: "text-rank-b", C: "text-rank-c", D: "text-rank-d", E: "text-rank-e" };
const rankIcon = (rank: number) => rank === 1 ? <Crown className="h-4 w-4 text-xp" /> : rank === 2 ? <Trophy className="h-4 w-4 text-muted-foreground" /> : rank === 3 ? <Medal className="h-4 w-4 text-accent" /> : null;

export default function LeaderboardPage() {
  const [category, setCategory] = useState<Category>("global");
  const data = leaderboards[category];

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Global Leaderboard</h1>
        <p className="text-sm text-muted-foreground">Compete and rise through the ranks.</p>
      </motion.div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {([["global", "Global"], ["data_science", "Data Science"], ["engineering", "Engineering"], ["quest_completion", "Quest Completion"]] as [Category, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setCategory(key)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category === key ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="surface-card-inset">
        {data.map((p, i) => (
          <motion.div key={p.rank + p.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
            className={`flex items-center justify-between py-3 px-4 border-b border-border/30 last:border-0 ${p.isUser ? "bg-primary/10" : ""}`}>
            <div className="flex items-center gap-3">
              <span className="w-8 flex justify-center">{rankIcon(p.rank) || <span className="text-xs font-mono text-muted-foreground">#{p.rank}</span>}</span>
              <span className={`font-medium text-sm ${p.isUser ? "text-primary" : "text-foreground"}`}>{p.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-muted-foreground">Lv{p.level}</span>
              <span className="text-xs font-mono text-muted-foreground">{p.xp}</span>
              <span className={`text-sm font-black font-mono ${badgeColor[p.badge]}`}>{p.badge}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

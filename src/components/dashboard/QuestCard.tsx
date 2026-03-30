import { motion } from "framer-motion";
import { Swords, Clock, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Quest {
  id: string;
  title: string;
  objective: string;
  difficulty: string;
  xpReward: number;
  skillReward: string;
  type: "daily" | "weekly" | "boss" | "epic";
  progress?: number;
  status: "available" | "in_progress" | "completed";
}

const difficultyColor: Record<string, string> = {
  E: "text-rank-e bg-rank-e/10",
  D: "text-rank-d bg-rank-d/10",
  C: "text-rank-c bg-rank-c/10",
  B: "text-rank-b bg-rank-b/10",
  A: "text-rank-a bg-rank-a/10",
  S: "text-rank-s bg-rank-s/10",
};

const typeLabel: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  boss: "Boss",
  epic: "Epic",
};

export default function QuestCard({ quest }: { quest: Quest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface-interactive p-4 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Swords className="h-4 w-4 text-primary" strokeWidth={1.5} />
          <span className="text-label">{typeLabel[quest.type]} Quest</span>
        </div>
        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${difficultyColor[quest.difficulty] ?? ""}`}>
          {quest.difficulty}
        </span>
      </div>
      <h4 className="text-sm font-semibold text-foreground mb-1">{quest.title}</h4>
      <p className="text-xs text-muted-foreground mb-3">{quest.objective}</p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <Zap className="h-3 w-3 text-xp" />
          <span className="font-mono">+{quest.xpReward} XP</span>
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {quest.skillReward}
        </span>
      </div>
      {quest.status === "in_progress" && quest.progress != null ? (
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full gradient-primary transition-all duration-500"
            style={{ width: `${quest.progress}%` }}
          />
        </div>
      ) : quest.status === "available" ? (
        <Button size="sm" className="w-full gradient-primary text-foreground border-0 h-8 text-xs">
          Accept Quest <ChevronRight className="ml-1 h-3 w-3" />
        </Button>
      ) : (
        <div className="text-xs font-mono text-rank-c text-center">✓ Completed</div>
      )}
    </motion.div>
  );
}

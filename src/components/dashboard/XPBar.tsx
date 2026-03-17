import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface XPBarProps {
  level: number;
  currentXP: number;
  maxXP: number;
  rank: string;
  playerName?: string;
  careerClass?: string;
  className?: string;
}

const rankColors: Record<string, string> = {
  E: "text-rank-e",
  D: "text-rank-d",
  C: "text-rank-c",
  B: "text-rank-b",
  A: "text-rank-a",
  S: "text-rank-s",
};

const rankBgColors: Record<string, string> = {
  E: "bg-rank-e/10",
  D: "bg-rank-d/10",
  C: "bg-rank-c/10",
  B: "bg-rank-b/10",
  A: "bg-rank-a/10",
  S: "bg-rank-s/10",
};

export default function XPBar({ level, currentXP, maxXP, rank, playerName, careerClass, className }: XPBarProps) {
  const pct = maxXP > 0 ? (currentXP / maxXP) * 100 : 0;

  return (
    <div className={`flex items-center gap-4 ${className ?? ""}`}>
      {/* Level badge */}
      <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-primary glow-blue shrink-0">
        <span className="text-sm font-bold font-mono text-foreground">{level}</span>
      </div>

      {/* Info + XP bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 min-w-0">
            {playerName && <span className="text-sm font-semibold text-foreground truncate">{playerName}</span>}
            {careerClass && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono hidden sm:inline">{careerClass}</span>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-accent" />
              <span className="font-mono">{currentXP}/{maxXP}</span>
            </div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${rankBgColors[rank] || ""}`}>
              <span className={`text-lg font-black font-mono ${rankColors[rank] ?? "text-foreground"}`}>{rank}</span>
            </div>
          </div>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full gradient-xp"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>
    </div>
  );
}

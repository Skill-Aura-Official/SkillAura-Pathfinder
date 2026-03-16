import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface XPBarProps {
  level: number;
  currentXP: number;
  maxXP: number;
  rank: string;
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

export default function XPBar({ level, currentXP, maxXP, rank, className }: XPBarProps) {
  const pct = (currentXP / maxXP) * 100;

  return (
    <div className={`surface-card-inset p-4 ${className ?? ""}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-primary glow-blue">
            <span className="text-sm font-bold font-mono text-foreground">{level}</span>
          </div>
          <div>
            <div className="text-label">Level</div>
            <div className="text-sm font-semibold text-foreground">Career Operative</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-label">Rank</div>
          <span className={`text-2xl font-black font-mono ${rankColors[rank] ?? "text-foreground"}`}>{rank}</span>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Zap className="h-3 w-3 text-xp" />
            <span className="font-mono">{currentXP} / {maxXP} XP</span>
          </div>
          <span className="text-xs font-mono text-muted-foreground">{pct.toFixed(0)}%</span>
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

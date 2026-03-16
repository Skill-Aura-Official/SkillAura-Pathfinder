import { motion } from "framer-motion";
import { Trophy, Flame, Swords, Star } from "lucide-react";

const achievements = [
  { icon: Star, title: "First Quest", desc: "Completed your first quest", unlocked: true },
  { icon: Flame, title: "Streak Master", desc: "7-day quest streak", unlocked: true },
  { icon: Swords, title: "Boss Slayer", desc: "Defeat a boss quest", unlocked: false },
  { icon: Trophy, title: "Career Evolver", desc: "Advance your career class", unlocked: false },
];

export default function Achievements() {
  return (
    <div className="surface-card-inset p-4">
      <div className="text-label mb-3">Achievements</div>
      <div className="grid grid-cols-2 gap-2">
        {achievements.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`flex flex-col items-center p-3 rounded-lg text-center ${a.unlocked ? "bg-accent/10" : "bg-secondary/50 opacity-40"}`}
          >
            <a.icon className={`h-5 w-5 mb-1.5 ${a.unlocked ? "text-accent" : "text-muted-foreground"}`} strokeWidth={1.5} />
            <span className="text-[10px] font-semibold text-foreground">{a.title}</span>
            <span className="text-[9px] text-muted-foreground">{a.desc}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { Trophy, Star, Flame, Swords, Shield, Zap, Award, Crown, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const achievements = [
  { icon: Star, title: "First Quest", desc: "Completed your first quest", rarity: "common", unlocked: true },
  { icon: Flame, title: "Streak Master", desc: "7-day quest streak", rarity: "uncommon", unlocked: true },
  { icon: Zap, title: "XP Hunter", desc: "Earned 1,000 XP", rarity: "uncommon", unlocked: true },
  { icon: Swords, title: "Boss Slayer", desc: "Defeat a boss quest", rarity: "rare", unlocked: false },
  { icon: Shield, title: "Defender", desc: "Complete 5 cybersecurity quests", rarity: "rare", unlocked: false },
  { icon: Crown, title: "Rank Up", desc: "Reach Rank D", rarity: "uncommon", unlocked: true },
  { icon: Trophy, title: "Career Evolver", desc: "Advance career class", rarity: "epic", unlocked: false },
  { icon: Award, title: "Skill Master", desc: "Max out any skill", rarity: "epic", unlocked: false },
  { icon: BookOpen, title: "Knowledge Seeker", desc: "Complete 20 quests", rarity: "rare", unlocked: true },
  { icon: Zap, title: "Speed Runner", desc: "Complete 3 quests in one day", rarity: "rare", unlocked: true },
  { icon: Crown, title: "S-Rank Legend", desc: "Reach Rank S", rarity: "legendary", unlocked: false },
  { icon: Trophy, title: "Full Stack Hero", desc: "Master all skill trees", rarity: "legendary", unlocked: false },
];

const rarityColor: Record<string, string> = {
  common: "text-muted-foreground", uncommon: "text-rank-c", rare: "text-rank-b", epic: "text-rank-a", legendary: "text-rank-s",
};

const certifications = [
  { title: "Machine Learning Fundamentals", price: "₹199", completed: true },
  { title: "Full Stack Development", price: "₹199", completed: false },
  { title: "Data Science Professional", price: "₹299", completed: false },
];

export default function AchievementsPage() {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Achievements & Certifications</h1>
        <p className="text-sm text-muted-foreground">{achievements.filter(a => a.unlocked).length} / {achievements.length} achievements unlocked.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {achievements.map((a, i) => (
          <motion.div key={a.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
            className={`surface-interactive p-4 text-center ${!a.unlocked ? "opacity-30" : ""}`}>
            <a.icon className={`h-8 w-8 mx-auto mb-2 ${a.unlocked ? rarityColor[a.rarity] : "text-muted-foreground"}`} strokeWidth={1.5} />
            <h4 className="text-xs font-semibold text-foreground">{a.title}</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">{a.desc}</p>
            <span className={`text-[9px] font-mono uppercase ${rarityColor[a.rarity]}`}>{a.rarity}</span>
          </motion.div>
        ))}
      </div>

      <div className="text-label px-1 mb-3">Certifications</div>
      <div className="grid md:grid-cols-3 gap-4">
        {certifications.map(c => (
          <div key={c.title} className="surface-card-inset p-4">
            <h4 className="text-sm font-semibold text-foreground mb-1">{c.title}</h4>
            <p className="text-xs text-muted-foreground mb-3">{c.price}</p>
            {c.completed ? (
              <Button size="sm" className="w-full gradient-primary text-foreground border-0 h-8 text-xs">Download Certificate</Button>
            ) : (
              <Button size="sm" variant="outline" className="w-full border-border h-8 text-xs">Unlock Certificate</Button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface AchievementRow {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  rarity: string | null;
  xp_reward: number | null;
}

const rarityColor: Record<string, string> = {
  common: "text-muted-foreground", uncommon: "text-rank-c", rare: "text-rank-b", epic: "text-rank-a", legendary: "text-rank-s",
};

export default function AchievementsPage() {
  const { user } = useAuth();
  const [allAchievements, setAllAchievements] = useState<AchievementRow[]>([]);
  const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("achievements").select("*"),
      supabase.from("user_achievements").select("achievement_id").eq("user_id", user.id),
    ]).then(([achRes, earnedRes]) => {
      if (achRes.data) setAllAchievements(achRes.data);
      if (earnedRes.data) setEarnedIds(new Set(earnedRes.data.map(e => e.achievement_id)));
      setLoading(false);
    });
  }, [user]);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  const earned = allAchievements.filter(a => earnedIds.has(a.id));
  const locked = allAchievements.filter(a => !earnedIds.has(a.id));

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Achievements</h1>
        <p className="text-sm text-muted-foreground">{earned.length} / {allAchievements.length} achievements unlocked.</p>
      </motion.div>

      {allAchievements.length === 0 ? (
        <div className="surface-card-inset p-12 text-center">
          <Trophy className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No achievements available yet. Keep leveling up!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {allAchievements.map((a, i) => {
            const unlocked = earnedIds.has(a.id);
            const rarity = a.rarity || "common";
            return (
              <motion.div key={a.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                className={`surface-interactive p-4 text-center ${!unlocked ? "opacity-30" : ""}`}>
                <Star className={`h-8 w-8 mx-auto mb-2 ${unlocked ? rarityColor[rarity] : "text-muted-foreground"}`} strokeWidth={1.5} />
                <h4 className="text-xs font-semibold text-foreground">{a.title}</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">{a.description}</p>
                <span className={`text-[9px] font-mono uppercase ${rarityColor[rarity]}`}>{rarity}</span>
                {a.xp_reward ? <div className="text-[9px] font-mono text-accent mt-0.5">+{a.xp_reward} XP</div> : null}
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
}

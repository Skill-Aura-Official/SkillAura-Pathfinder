import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function Achievements() {
  const { user } = useAuth();
  const [earned, setEarned] = useState<{ title: string; description: string | null; rarity: string | null }[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_achievements")
      .select("achievement:achievements(title, description, rarity)")
      .eq("user_id", user.id)
      .limit(4)
      .then(({ data }) => {
        if (data) {
          setEarned((data as any[]).map(d => ({
            title: d.achievement?.title || "Unknown",
            description: d.achievement?.description || null,
            rarity: d.achievement?.rarity || "common",
          })));
        }
      });
  }, [user]);

  const rarityColor: Record<string, string> = { common: "text-muted-foreground", uncommon: "text-rank-c", rare: "text-rank-b", epic: "text-rank-a", legendary: "text-rank-s" };

  return (
    <div className="surface-card-inset p-4">
      <div className="text-label mb-3">Achievements</div>
      {earned.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {earned.map((a, i) => (
            <motion.div key={a.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center p-3 rounded-lg text-center bg-accent/10">
              <Star className={`h-5 w-5 mb-1.5 ${rarityColor[a.rarity || "common"]}`} strokeWidth={1.5} />
              <span className="text-[10px] font-semibold text-foreground">{a.title}</span>
              <span className="text-[9px] text-muted-foreground">{a.description}</span>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-4">No achievements yet. Complete quests to earn them!</p>
      )}
    </div>
  );
}

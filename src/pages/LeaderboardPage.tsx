import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, Trophy, Medal, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  user_id: string | null;
  display_name: string | null;
  level: number | null;
  current_xp: number | null;
  rank: string | null;
  career_class: string | null;
}

const badgeColor: Record<string, string> = { S: "text-rank-s", A: "text-rank-a", B: "text-rank-b", C: "text-rank-c", D: "text-rank-d", E: "text-rank-e" };
const rankIcon = (rank: number) => rank === 1 ? <Crown className="h-4 w-4 text-accent" /> : rank === 2 ? <Trophy className="h-4 w-4 text-muted-foreground" /> : rank === 3 ? <Medal className="h-4 w-4 text-accent" /> : null;

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("leaderboard").select("*").order("current_xp", { ascending: false }).limit(50)
      .then(({ data }) => {
        if (data) setEntries(data as LeaderboardEntry[]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Global Leaderboard</h1>
        <p className="text-sm text-muted-foreground">Compete and rise through the ranks.</p>
      </motion.div>

      {entries.length === 0 ? (
        <div className="surface-card-inset p-12 text-center">
          <Trophy className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No players on the leaderboard yet. Be the first!</p>
        </div>
      ) : (
        <div className="surface-card-inset">
          {entries.map((p, i) => {
            const isUser = p.user_id === user?.id;
            const rank = i + 1;
            return (
              <motion.div key={p.user_id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className={`flex items-center justify-between py-3 px-4 border-b border-border/30 last:border-0 ${isUser ? "bg-primary/10" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className="w-8 flex justify-center">{rankIcon(rank) || <span className="text-xs font-mono text-muted-foreground">#{rank}</span>}</span>
                  <span className={`font-medium text-sm ${isUser ? "text-primary" : "text-foreground"}`}>{p.display_name || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-muted-foreground">Lv{p.level || 1}</span>
                  <span className="text-xs font-mono text-muted-foreground">{(p.current_xp || 0).toLocaleString()} XP</span>
                  <span className={`text-sm font-black font-mono ${badgeColor[p.rank || "E"]}`}>{p.rank || "E"}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
}

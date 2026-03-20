import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const badgeColor: Record<string, string> = { S: "text-rank-s", A: "text-rank-a", B: "text-rank-b", C: "text-rank-c", D: "text-rank-d", E: "text-rank-e" };

export default function Leaderboard() {
  const { user } = useAuth();
  const [players, setPlayers] = useState<{ user_id: string | null; display_name: string | null; level: number | null; current_xp: number | null; rank: string | null }[]>([]);

  useEffect(() => {
    supabase.from("leaderboard").select("*").order("current_xp", { ascending: false }).limit(5)
      .then(({ data }) => { if (data) setPlayers(data as any[]); });
  }, []);

  return (
    <div className="surface-card-inset p-4">
      <div className="text-label mb-3">Global Leaderboard</div>
      {players.length > 0 ? (
        <div className="space-y-2">
          {players.map((p, i) => {
            const isUser = p.user_id === user?.id;
            return (
              <div key={p.user_id || i} className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm ${isUser ? "bg-primary/10 border border-primary/20" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-4">#{i + 1}</span>
                  <span className={`font-medium ${isUser ? "text-primary" : "text-foreground"}`}>{p.display_name || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-muted-foreground">Lv{p.level || 1}</span>
                  <span className={`text-sm font-black font-mono ${badgeColor[p.rank || "E"]}`}>{p.rank || "E"}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-4">No players yet.</p>
      )}
    </div>
  );
}

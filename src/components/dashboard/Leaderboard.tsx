import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/integrations/api/client";

const badgeColor: Record<string, string> = {
  S: "text-rank-s", A: "text-rank-a", B: "text-rank-b",
  C: "text-rank-c", D: "text-rank-d", E: "text-rank-e",
};

export default function Leaderboard() {
  const { user } = useAuth();
  const [players, setPlayers] = useState<{
    _id: string;
    displayName: string | null;
    level: number | null;
    currentXp: number | null;
    rank: string | null;
  }[]>([]);

  useEffect(() => {
    api.get("/profile/leaderboard?limit=5").then((data) => {
      if (data.leaderboard) setPlayers(data.leaderboard);
    }).catch(() => {});
  }, []);

  return (
    <div className="surface-card-inset p-4">
      <div className="text-label mb-3">Global Leaderboard</div>
      {players.length > 0 ? (
        <div className="space-y-2">
          {players.map((p, i) => {
            const isUser = p._id === user?._id;
            return (
              <div key={p._id || i} className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm ${isUser ? "bg-primary/10 border border-primary/20" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-4">#{i + 1}</span>
                  <span className={`font-medium ${isUser ? "text-primary" : "text-foreground"}`}>
                    {p.displayName || "Unknown"}
                  </span>
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
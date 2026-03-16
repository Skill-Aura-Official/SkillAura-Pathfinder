const players = [
  { rank: 1, name: "ArcaneKoder", level: 42, xp: "12.4K", badge: "S" },
  { rank: 2, name: "NeuralNinja", level: 38, xp: "11.1K", badge: "A" },
  { rank: 3, name: "DataPioneer", level: 35, xp: "9.8K", badge: "A" },
  { rank: 4, name: "You", level: 7, xp: "1.4K", badge: "D", isUser: true },
];

const badgeColor: Record<string, string> = {
  S: "text-rank-s",
  A: "text-rank-a",
  B: "text-rank-b",
  C: "text-rank-c",
  D: "text-rank-d",
  E: "text-rank-e",
};

export default function Leaderboard() {
  return (
    <div className="surface-card-inset p-4">
      <div className="text-label mb-3">Global Leaderboard</div>
      <div className="space-y-2">
        {players.map((p) => (
          <div
            key={p.rank}
            className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm ${
              p.isUser ? "bg-primary/10 border border-primary/20" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground w-4">#{p.rank}</span>
              <span className={`font-medium ${p.isUser ? "text-primary" : "text-foreground"}`}>{p.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-muted-foreground">Lv{p.level}</span>
              <span className="text-xs font-mono text-muted-foreground">{p.xp}</span>
              <span className={`text-sm font-black font-mono ${badgeColor[p.badge]}`}>{p.badge}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

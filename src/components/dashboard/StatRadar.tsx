import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

interface StatRadarProps {
  stats?: Record<string, number>;
}

export default function StatRadar({ stats }: StatRadarProps) {
  if (!stats) {
    return (
      <div className="surface-card-inset p-4">
        <div className="text-label mb-3">Ability Stats</div>
        <p className="text-xs text-muted-foreground text-center py-8">Complete onboarding to see your stats.</p>
      </div>
    );
  }

  const data = Object.entries(stats).map(([stat, value]) => ({ stat, value }));

  return (
    <div className="surface-card-inset p-4">
      <div className="text-label mb-3">Ability Stats</div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="stat"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontFamily: "Inter" }}
            />
            <Radar
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

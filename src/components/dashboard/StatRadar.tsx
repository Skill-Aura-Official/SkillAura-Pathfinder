import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

interface StatRadarProps {
  stats?: Record<string, number>;
}

const defaultStats: Record<string, number> = {
  Technical: 78,
  Logic: 85,
  Creativity: 62,
  Communication: 70,
  Leadership: 45,
  "Problem Solving": 88,
};

export default function StatRadar({ stats }: StatRadarProps) {
  const data = Object.entries(stats || defaultStats).map(([stat, value]) => ({ stat, value }));

  return (
    <div className="surface-card-inset p-4">
      <div className="text-label mb-3">Ability Stats</div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="hsl(217 33% 17%)" />
            <PolarAngleAxis
              dataKey="stat"
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 10, fontFamily: "Inter" }}
            />
            <Radar
              dataKey="value"
              stroke="hsl(217 91% 60%)"
              fill="hsl(217 91% 60%)"
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

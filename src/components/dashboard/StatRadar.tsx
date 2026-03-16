import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

const data = [
  { stat: "Technical", value: 78 },
  { stat: "Logic", value: 85 },
  { stat: "Creativity", value: 62 },
  { stat: "Communication", value: 70 },
  { stat: "Leadership", value: 45 },
  { stat: "Problem Solving", value: 88 },
];

export default function StatRadar() {
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

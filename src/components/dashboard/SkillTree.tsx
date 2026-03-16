import { motion } from "framer-motion";

interface SkillNode {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  status: "locked" | "unlocked" | "mastered";
  x: number;
  y: number;
  connections: string[];
}

const nodes: SkillNode[] = [
  { id: "python", name: "Python", level: 3, maxLevel: 5, status: "mastered", x: 150, y: 30, connections: ["data-analysis"] },
  { id: "data-analysis", name: "Data Analysis", level: 2, maxLevel: 5, status: "unlocked", x: 150, y: 100, connections: ["ml", "visualization"] },
  { id: "ml", name: "Machine Learning", level: 1, maxLevel: 5, status: "unlocked", x: 80, y: 170, connections: ["deep-learning"] },
  { id: "visualization", name: "Data Viz", level: 0, maxLevel: 5, status: "locked", x: 220, y: 170, connections: [] },
  { id: "deep-learning", name: "Deep Learning", level: 0, maxLevel: 5, status: "locked", x: 80, y: 240, connections: [] },
];

const statusStyles = {
  locked: "bg-secondary text-muted-foreground opacity-40",
  unlocked: "bg-primary/20 text-primary border border-primary/30",
  mastered: "bg-accent/20 text-accent border border-accent/30",
};

export default function SkillTree() {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  return (
    <div className="surface-card-inset p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-label">Skill Tree — Data Science</div>
        <div className="flex gap-3 text-[9px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" /> Mastered</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Unlocked</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary" /> Locked</span>
        </div>
      </div>
      <div className="relative h-[280px]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 280">
          {nodes.flatMap(node =>
            node.connections.map(targetId => {
              const target = nodeMap.get(targetId);
              if (!target) return null;
              return (
                <line
                  key={`${node.id}-${targetId}`}
                  x1={node.x}
                  y1={node.y + 20}
                  x2={target.x}
                  y2={target.y}
                  stroke="hsl(217 33% 17%)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              );
            })
          )}
        </svg>
        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`absolute flex flex-col items-center`}
            style={{ left: node.x - 30, top: node.y - 10 }}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${statusStyles[node.status]}`}>
              {node.status !== "locked" ? `Lv${node.level}` : "?"}
            </div>
            <span className="text-[10px] text-muted-foreground mt-1 whitespace-nowrap">{node.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface SkillNode {
  id: string;
  name: string;
  level: number;
  status: "locked" | "unlocked" | "mastered";
  x: number;
  y: number;
}

const statusStyles = {
  locked: "bg-secondary text-muted-foreground opacity-40",
  unlocked: "bg-primary/20 text-primary border border-primary/30",
  mastered: "bg-accent/20 text-accent border border-accent/30",
};

export default function SkillTree() {
  const { user } = useAuth();
  const [nodes, setNodes] = useState<SkillNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase
      .from("user_skills")
      .select("id, level, unlocked, skill:skills(name)")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const mapped = (data as any[]).map((s, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            return {
              id: s.id,
              name: s.skill?.name || "Unknown",
              level: s.level,
              status: s.level >= 5 ? "mastered" as const : s.unlocked ? "unlocked" as const : "locked" as const,
              x: 60 + col * 90,
              y: 30 + row * 70,
            };
          });
          setNodes(mapped.slice(0, 9));
        }
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="surface-card-inset p-4 flex items-center justify-center h-[280px]">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="surface-card-inset p-4">
        <div className="text-label mb-3">Skill Tree</div>
        <p className="text-xs text-muted-foreground text-center py-8">Complete onboarding and quests to unlock skills.</p>
      </div>
    );
  }

  return (
    <div className="surface-card-inset p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-label">Skill Tree</div>
        <div className="flex gap-3 text-[9px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" /> Mastered</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Unlocked</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary" /> Locked</span>
        </div>
      </div>
      <div className="relative h-[280px]">
        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="absolute flex flex-col items-center"
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

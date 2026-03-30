import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, Star, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/integrations/api/client";

interface UserSkill {
  _id: string;
  skillId: { _id: string; name: string; category: string; description: string | null };
  level: number;
  xp: number;
  unlocked: boolean;
}

const categoryColor: Record<string, string> = {
  technical: "text-blue-400 bg-blue-400/10",
  soft: "text-green-400 bg-green-400/10",
  extracted: "text-purple-400 bg-purple-400/10",
  leadership: "text-orange-400 bg-orange-400/10",
  default: "text-primary bg-primary/10",
};

export default function SkillTreePage() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    if (!user) return;
    api.get("/profile/skills").then((data) => {
      if (data.skills) setSkills(data.skills);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const categories = ["all", ...Array.from(new Set(skills.map(s => s.skillId?.category || "default")))];
  const filtered = activeCategory === "all" ? skills : skills.filter(s => s.skillId?.category === activeCategory);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Skill Tree</h1>
        <p className="text-sm text-muted-foreground mt-1">Your abilities and expertise</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              activeCategory === cat ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground bg-secondary"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((skill, i) => {
            const colorClass = categoryColor[skill.skillId?.category || "default"] || categoryColor.default;
            return (
              <motion.div key={skill._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                className={`surface-card-inset p-4 ${!skill.unlocked ? "opacity-50" : ""}`}>
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${colorClass}`}>
                    {skill.skillId?.category || "general"}
                  </span>
                  {skill.unlocked
                    ? <Unlock className="h-3.5 w-3.5 text-green-400" strokeWidth={1.5} />
                    : <Lock className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                  }
                </div>
                <div className="text-sm font-bold text-foreground mb-1">{skill.skillId?.name || "Unknown"}</div>
                {skill.skillId?.description && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{skill.skillId.description}</p>
                )}
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="h-3 w-3" strokeWidth={1.5} />
                    <span>Level {skill.level}</span>
                  </div>
                  <span className="text-muted-foreground font-mono">{skill.xp} XP</span>
                </div>
                <div className="h-1 bg-secondary rounded-full">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min((skill.xp % 100), 100)}%` }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 surface-card-inset">
          <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground">No skills yet. Complete quests to unlock them!</p>
        </div>
      )}
    </div>
  );
}
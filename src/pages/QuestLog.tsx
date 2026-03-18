import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swords, Zap, Clock, ChevronRight, Shield, Flame, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type QuestFilter = "all" | "daily" | "weekly" | "boss" | "epic";

interface UserQuest {
  id: string;
  quest_id: string;
  status: "available" | "in_progress" | "completed";
  progress: number | null;
  quest: {
    id: string;
    title: string;
    objective: string;
    difficulty: string;
    xp_reward: number;
    skill_reward: string | null;
    quest_type: string;
  };
}

const difficultyColor: Record<string, string> = {
  E: "text-rank-e bg-rank-e/10", D: "text-rank-d bg-rank-d/10", C: "text-rank-c bg-rank-c/10",
  B: "text-rank-b bg-rank-b/10", A: "text-rank-a bg-rank-a/10", S: "text-rank-s bg-rank-s/10",
};

const typeIcons: Record<string, typeof Swords> = {
  daily: Flame, weekly: Clock, boss: Shield, epic: Crown,
};

export default function QuestLog() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<QuestFilter>("all");
  const [userQuests, setUserQuests] = useState<UserQuest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuests = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("user_quests")
      .select("id, quest_id, status, progress, quest:quests(id, title, objective, difficulty, xp_reward, skill_reward, quest_type)")
      .eq("user_id", user.id);

    if (!error && data) {
      setUserQuests(data as unknown as UserQuest[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchQuests(); }, [user]);

  const acceptQuest = async (userQuestId: string) => {
    const { error } = await supabase.from("user_quests").update({ status: "in_progress" as any, started_at: new Date().toISOString() }).eq("id", userQuestId);
    if (!error) { toast.success("Quest accepted!"); fetchQuests(); }
  };

  const completeQuest = async (uq: UserQuest) => {
    const { error } = await supabase.from("user_quests").update({ status: "completed" as any, completed_at: new Date().toISOString(), progress: 100 }).eq("id", uq.id);
    if (!error && user) {
      // Add XP
      await supabase.rpc("update_level", { p_user_id: user.id });
      const { data: cp } = await supabase.from("career_profiles").select("current_xp").eq("user_id", user.id).single();
      if (cp) {
        await supabase.from("career_profiles").update({ current_xp: (cp.current_xp || 0) + uq.quest.xp_reward }).eq("user_id", user.id);
        await supabase.rpc("update_level", { p_user_id: user.id });
      }
      toast.success(`+${uq.quest.xp_reward} XP earned!`);
      fetchQuests();
    }
  };

  const filtered = filter === "all" ? userQuests : userQuests.filter(q => q.quest.quest_type === filter);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Quest Log</h1>
        <p className="text-sm text-muted-foreground">Accept quests to earn XP and level up your abilities.</p>
      </motion.div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "daily", "weekly", "boss", "epic"] as QuestFilter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="surface-card-inset p-12 text-center">
          <Swords className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No quests assigned yet. Complete onboarding to get starter quests.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((uq, i) => {
            const q = uq.quest;
            const TypeIcon = typeIcons[q.quest_type] || Swords;
            return (
              <motion.div key={uq.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="surface-interactive p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TypeIcon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    <span className="text-label">{q.quest_type} Quest</span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${difficultyColor[q.difficulty]}`}>{q.difficulty}</span>
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1">{q.title}</h4>
                <p className="text-xs text-muted-foreground mb-3">{q.objective}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-xp" /><span className="font-mono">+{q.xp_reward} XP</span></span>
                  {q.skill_reward && <span className="font-mono">{q.skill_reward}</span>}
                </div>
                {uq.status === "in_progress" ? (
                  <Button size="sm" onClick={() => completeQuest(uq)} className="w-full bg-accent text-accent-foreground border-0 h-8 text-xs">
                    Mark Complete ✓
                  </Button>
                ) : uq.status === "completed" ? (
                  <div className="text-xs font-mono text-rank-c text-center">✓ Completed</div>
                ) : (
                  <Button size="sm" onClick={() => acceptQuest(uq.id)} className="w-full gradient-primary text-foreground border-0 h-8 text-xs">
                    Accept Quest <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
}

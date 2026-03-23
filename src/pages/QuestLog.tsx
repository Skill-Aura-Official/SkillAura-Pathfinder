import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swords, Zap, Clock, ChevronRight, Shield, Flame, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { handleQuestCompletion, systemToast } from "@/lib/system-toast";

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
    if (!error) {
      systemToast("quest", "Quest accepted! Begin your mission.");
      fetchQuests();
    }
  };

  const completeQuest = async (uq: UserQuest) => {
    if (!user) return;
    try {
      await handleQuestCompletion(supabase, user.id, uq.id, uq.quest.id, uq.quest.xp_reward, uq.quest.skill_reward);
      fetchQuests();
    } catch {
      systemToast("quest", "Failed to complete quest. Try again.");
    }
  };

  const filtered = filter === "all" ? userQuests : userQuests.filter(q => q.quest.quest_type === filter);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  const generateQuests = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-quests");
      if (error) throw error;
      if (data?.inserted > 0) {
        systemToast("quest", `${data.inserted} new AI-generated quests assigned!`);
        await fetchQuests();
      } else {
        systemToast("quest", "No new quests could be generated right now.");
      }
    } catch (e: any) {
      const msg = e?.message?.includes("429") ? "Rate limited. Try again later." :
                  e?.message?.includes("402") ? "AI credits depleted." : "Failed to generate quests.";
      systemToast("quest", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Quest Log</h1>
          <p className="text-sm text-muted-foreground">Accept quests to earn XP and level up your abilities.</p>
        </div>
        <Button size="sm" onClick={generateQuests} disabled={loading} className="gradient-primary text-foreground border-0">
          <Zap className="h-3.5 w-3.5 mr-1" /> Generate AI Quests
        </Button>
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
          <p className="text-sm text-muted-foreground mb-4">No quests assigned yet.</p>
          <Button size="sm" onClick={generateQuests} disabled={loading} className="gradient-primary text-foreground border-0">
            <Zap className="h-3.5 w-3.5 mr-1" /> Generate Your First Quests
          </Button>
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

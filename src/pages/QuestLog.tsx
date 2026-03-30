import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swords, Loader2, Zap, RefreshCw, CheckCircle2, Clock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/integrations/api/client";
import { toast } from "sonner";

interface Quest {
  _id: string;
  title: string;
  objective: string;
  questType: string;
  difficulty: string;
  xpReward: number;
  skillReward: string | null;
  status: string;
  progress: number;
}

const difficultyColor: Record<string, string> = {
  E: "text-rank-e", D: "text-rank-d", C: "text-rank-c",
  B: "text-rank-b", A: "text-rank-a", S: "text-rank-s",
};

const typeIcon: Record<string, any> = {
  daily: Clock, weekly: Swords, boss: Zap, epic: Zap,
};

export default function QuestLog() {
  const { user } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"available" | "in_progress" | "completed">("available");

  const fetchQuests = async () => {
    try {
      const data = await api.get(`/quests?status=${activeTab}`);
      if (data.quests) setQuests(data.quests);
    } catch {
      toast.error("Failed to load quests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchQuests();
  }, [user, activeTab]);

  const handleGenerateQuests = async () => {
    setGenerating(true);
    try {
      const data = await api.post("/ai/generate-quests", {});
      if (data.error) { toast.error(data.error); return; }
      toast.success(`${data.inserted || 0} new quests generated!`);
      fetchQuests();
    } catch {
      toast.error("Quest generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleStartQuest = async (questId: string) => {
    try {
      const data = await api.put(`/quests/${questId}/start`, {});
      if (data.error) { toast.error(data.error); return; }
      toast.success("Quest started!");
      fetchQuests();
    } catch {
      toast.error("Failed to start quest");
    }
  };

  const handleCompleteQuest = async (questId: string) => {
    try {
      const data = await api.put(`/quests/${questId}/complete`, {});
      if (data.error) { toast.error(data.error); return; }
      toast.success(`Quest complete! +${data.xpGained || 0} XP`);
      fetchQuests();
    } catch {
      toast.error("Failed to complete quest");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quest Log</h1>
          <p className="text-sm text-muted-foreground mt-1">Your active missions and objectives</p>
        </div>
        <Button onClick={handleGenerateQuests} disabled={generating} className="gradient-primary text-foreground border-0">
          {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <><RefreshCw className="h-4 w-4 mr-2" />Generate Quests</>}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["available", "in_progress", "completed"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeTab === tab ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
            }`}>
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Quest List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : quests.length > 0 ? (
        <div className="space-y-3">
          {quests.map((quest, i) => {
            const Icon = typeIcon[quest.questType] || Swords;
            return (
              <motion.div key={quest._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="surface-card-inset p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-foreground">{quest.title}</span>
                        <span className={`text-xs font-mono font-black ${difficultyColor[quest.difficulty]}`}>
                          [{quest.difficulty}]
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground capitalize">
                          {quest.questType}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{quest.objective}</p>
                      {quest.skillReward && (
                        <p className="text-xs text-accent mt-1">🎯 Skill: {quest.skillReward}</p>
                      )}
                      {quest.status === "in_progress" && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Progress</span><span>{quest.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-secondary rounded-full">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${quest.progress}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-mono text-accent">+{quest.xpReward} XP</span>
                    {quest.status === "available" && (
                      <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleStartQuest(quest._id)}>
                        Start
                      </Button>
                    )}
                    {quest.status === "in_progress" && (
                      <Button size="sm" className="text-xs h-7 gradient-primary text-foreground border-0" onClick={() => handleCompleteQuest(quest._id)}>
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Complete
                      </Button>
                    )}
                    {quest.status === "completed" && (
                      <span className="text-xs text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Done
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 surface-card-inset">
          <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground">No {activeTab.replace("_", " ")} quests.</p>
          {activeTab === "available" && (
            <Button onClick={handleGenerateQuests} className="mt-4 gradient-primary text-foreground border-0" disabled={generating}>
              Generate Quests
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
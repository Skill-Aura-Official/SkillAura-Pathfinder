import { toast } from "sonner";

export function systemToast(type: "xp" | "level" | "rank" | "quest" | "skill" | "achievement", message: string) {
  const prefix: Record<string, string> = {
    xp: "⚡ [SYSTEM]",
    level: "🔺 [LEVEL UP]",
    rank: "👑 [RANK UP]",
    quest: "⚔️ [QUEST]",
    skill: "🧠 [SKILL]",
    achievement: "🏆 [ACHIEVEMENT]",
  };

  toast(message, {
    description: prefix[type],
    duration: 4000,
    className: "font-mono",
  });
}

export async function handleQuestCompletion(
  supabase: any,
  userId: string,
  userQuestId: string,
  questId: string,
  xpReward: number,
  skillReward: string | null,
) {
  // Mark quest completed
  const { error } = await supabase
    .from("user_quests")
    .update({ status: "completed", completed_at: new Date().toISOString(), progress: 100 })
    .eq("id", userQuestId);

  if (error) throw error;

  // Get current XP
  const { data: cp } = await supabase
    .from("career_profiles")
    .select("current_xp, level, rank")
    .eq("user_id", userId)
    .single();

  const oldLevel = cp?.level || 1;
  const oldRank = cp?.rank || "E";

  // Add XP
  await supabase
    .from("career_profiles")
    .update({ current_xp: (cp?.current_xp || 0) + xpReward })
    .eq("user_id", userId);

  // Update level/rank
  await supabase.rpc("update_level", { p_user_id: userId });

  // Get new level/rank
  const { data: newCp } = await supabase
    .from("career_profiles")
    .select("level, rank")
    .eq("user_id", userId)
    .single();

  // Show RPG toasts
  systemToast("xp", `+${xpReward} XP earned!`);

  if (skillReward) {
    systemToast("skill", `${skillReward} upgraded!`);
  }

  if (newCp && newCp.level > oldLevel) {
    setTimeout(() => systemToast("level", `Level ${oldLevel} → ${newCp.level}`), 500);
  }

  if (newCp && newCp.rank !== oldRank) {
    setTimeout(() => systemToast("rank", `Rank ${oldRank} → ${newCp.rank}`), 1000);
  }

  return { newLevel: newCp?.level, newRank: newCp?.rank };
}

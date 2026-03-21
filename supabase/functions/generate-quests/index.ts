import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Fetch user context
    const [careerRes, skillsRes, questsRes] = await Promise.all([
      supabase.from("career_profiles").select("career_class, level, rank, target_career, interview_data, stat_technical, stat_logic, stat_creativity, stat_communication, stat_leadership, stat_problem_solving").eq("user_id", user.id).single(),
      supabase.from("user_skills").select("level, skill:skills(name, category)").eq("user_id", user.id),
      supabase.from("user_quests").select("quest:quests(title, quest_type, difficulty, skill_reward)").eq("user_id", user.id).eq("status", "completed"),
    ]);

    const career = careerRes.data;
    const skills = (skillsRes.data || []) as any[];
    const completedQuests = (questsRes.data || []) as any[];
    const interview = career?.interview_data as any;

    const skillNames = skills.map(s => `${s.skill?.name} (Lv${s.level})`).join(", ");
    const completedQuestTitles = completedQuests.map(q => q.quest?.title).join(", ");

    const prompt = `You are a career quest generator for a gamified RPG career platform.

User Profile:
- Career Class: ${career?.career_class || "explorer"}
- Level: ${career?.level || 1}, Rank: ${career?.rank || "E"}
- Target Career: ${career?.target_career || "Exploring"}
- Skills: ${skillNames || "None yet"}
- Completed Quests: ${completedQuestTitles || "None yet"}
- Goal: ${interview?.goals || "Not set"}
- Stats: Technical=${career?.stat_technical||10}, Logic=${career?.stat_logic||10}, Creativity=${career?.stat_creativity||10}, Communication=${career?.stat_communication||10}, Leadership=${career?.stat_leadership||10}, Problem Solving=${career?.stat_problem_solving||10}

Generate 3 personalized quests that:
1. Fill skill gaps based on their current stats and career goal
2. Are appropriate for their level and rank
3. Include a mix of types (daily, weekly, boss)

Return ONLY a JSON array with objects having: title, objective, quest_type (daily/weekly/boss), difficulty (E/D/C/B/A/S), xp_reward (number), skill_reward (string or null), career_class (matching their class).`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 1024 },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini error:", response.status, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error("AI generation failed");
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    
    // Extract JSON
    let jsonStr = rawText;
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1];
    
    let quests: any[] = [];
    try {
      const parsed = JSON.parse(jsonStr.trim());
      quests = Array.isArray(parsed) ? parsed : parsed.quests || [];
    } catch {
      console.error("Failed to parse quest JSON:", rawText);
      quests = [];
    }

    // Insert generated quests
    const insertedQuests: string[] = [];
    for (const q of quests) {
      const { data: quest } = await supabase.from("quests").insert({
        title: q.title,
        objective: q.objective,
        quest_type: q.quest_type || "daily",
        difficulty: q.difficulty || "E",
        xp_reward: q.xp_reward || 100,
        skill_reward: q.skill_reward || null,
        career_class: q.career_class || career?.career_class || "explorer",
        created_by: user.id,
        is_template: false,
      }).select("id").single();

      if (quest) {
        await supabase.from("user_quests").insert({
          user_id: user.id,
          quest_id: quest.id,
          status: "available",
          progress: 0,
        });
        insertedQuests.push(quest.id);
      }
    }

    return new Response(JSON.stringify({ quests, inserted: insertedQuests.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-quests error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

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

    const { messages } = await req.json();

    // Get user context from auth header
    let userContext = "";
    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      try {
        const supabase = createClient(
          Deno.env.get("SUPABASE_URL") || "",
          Deno.env.get("SUPABASE_ANON_KEY") || "",
          { global: { headers: { Authorization: authHeader } } }
        );
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const [careerRes, profileRes, skillsRes] = await Promise.all([
            supabase.from("career_profiles").select("career_class, level, rank, current_xp, target_career, salary_estimate, job_readiness, interview_data, resume_data").eq("user_id", user.id).single(),
            supabase.from("profiles").select("display_name").eq("user_id", user.id).single(),
            supabase.from("user_skills").select("level, skill:skills(name)").eq("user_id", user.id),
          ]);
          const cp = careerRes.data;
          const profile = profileRes.data;
          const skills = (skillsRes.data || []) as any[];
          const interview = cp?.interview_data as any;
          const resume = cp?.resume_data as any;
          
          userContext = `\n\nCurrent user context:
- Name: ${profile?.display_name || "Unknown"}
- Career Class: ${cp?.career_class || "explorer"}
- Level: ${cp?.level || 1}, Rank: ${cp?.rank || "E"}, XP: ${cp?.current_xp || 0}
- Target Career: ${cp?.target_career || "Exploring"}
- Salary Estimate: ${cp?.salary_estimate || "N/A"}
- Job Readiness: ${cp?.job_readiness || 0}%
- Skills: ${skills.map(s => `${(s.skill as any)?.name} (Lv.${s.level})`).join(", ") || "None yet"}
- Career Goal: ${interview?.goals || "Not set"}
- Strengths: ${interview?.strengths || "Not set"}
- Experience: ${interview?.experience || "Not set"}
${resume?.summary ? `- Resume Summary: ${resume.summary}` : ""}
${resume?.career_paths ? `- Suggested Paths: ${resume.career_paths.join(", ")}` : ""}

Use this context to give personalized, specific career advice. Reference their actual skills, level, and goals. Never give generic advice.`;
        }
      } catch (e) {
        console.log("Could not fetch user context:", e);
      }
    }

    const systemPrompt = `You are an AI Career System for SkillAura PathFinder AI — a gamified RPG career intelligence platform. You are NOT a chatbot. You are a SYSTEM INTELLIGENCE.

Behavior rules:
- Address the user by name when possible
- Reference their ACTUAL skills, level, rank, and goals
- Give specific, actionable advice — not generic motivation
- Use RPG terminology: quests, skill trees, leveling up, rank advancement
- When suggesting next steps, frame them as quests or missions
- Be direct, strategic, and data-driven
- Format responses with system-style headers like [ANALYSIS], [RECOMMENDATION], [QUEST SUGGESTION]${userContext}`;

    // Call Gemini API directly
    const geminiMessages = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini error:", response.status, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "System error. Please retry.";

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-mentor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

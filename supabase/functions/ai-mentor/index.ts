import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Try to get user context from auth header
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
            supabase.from("career_profiles").select("career_class, level, rank, current_xp, target_career, salary_estimate, job_readiness, interview_data").eq("user_id", user.id).single(),
            supabase.from("profiles").select("display_name").eq("user_id", user.id).single(),
            supabase.from("user_skills").select("level, skill:skills(name)").eq("user_id", user.id),
          ]);
          const cp = careerRes.data;
          const profile = profileRes.data;
          const skills = (skillsRes.data || []) as any[];
          const interview = cp?.interview_data as any;
          
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
- Interests: ${interview?.interests || "Not set"}
- Experience: ${interview?.experience || "Not set"}

Use this context to give personalized, specific career advice. Reference their actual skills, level, and goals.`;
        }
      } catch (e) {
        console.log("Could not fetch user context:", e);
      }
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an AI Career Mentor for SkillAura PathFinder AI — a gamified career intelligence platform. You help users with:
- Career decisions and strategy
- Skills to learn based on their career goals
- Industry demand and market trends
- Salary expectations and negotiation
- Learning roadmaps and quest suggestions
- Interview preparation tips

Keep responses helpful, concise, and actionable. Use RPG/gaming terminology when appropriate (quests, leveling up, skill trees, etc.). Be encouraging and motivating.${userContext}`
          },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "I'm having trouble right now.";

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

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build personal context from auth header
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
            supabase.from("career_profiles").select("career_class, level, rank, current_xp, target_career, salary_estimate, job_readiness, interview_data, resume_data").eq("user_id", user.id).maybeSingle(),
            supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle(),
            supabase.from("user_skills").select("level, skill:skills(name)").eq("user_id", user.id),
          ]);
          const cp = careerRes.data as any;
          const profile = profileRes.data as any;
          const skills = (skillsRes.data || []) as any[];
          const interview = cp?.interview_data;
          const resume = cp?.resume_data;
          userContext = `\n\n## Operative dossier
- Name: ${profile?.display_name || "Unknown"}
- Class: ${cp?.career_class || "explorer"} | Level ${cp?.level || 1} | Rank ${cp?.rank || "E"} | XP ${cp?.current_xp || 0}
- Target: ${cp?.target_career || "exploring"} | Salary band: ${cp?.salary_estimate || "N/A"} | Readiness: ${cp?.job_readiness || 0}%
- Skills: ${skills.map(s => `${(s.skill as any)?.name} (Lv.${s.level})`).join(", ") || "None recorded"}
- Goal: ${interview?.goals || "not set"} | Strengths: ${interview?.strengths || "not set"} | Experience: ${interview?.experience || "not set"}
${resume?.summary ? `- Resume summary: ${resume.summary}` : ""}
Use this dossier in every response. Reference real numbers and skills. Never give generic advice.`;
        }
      } catch (e) { console.log("ctx error:", e); }
    }

    const systemPrompt = `You are the AI System Intelligence for SkillAura PathFinder — a gamified RPG career platform. You are not a chatbot; you are a tactical career operating system.

Style:
- Use markdown: **bold**, bullet points, \`code\`, ## headings sparingly
- Use RPG framing: quests, skill trees, levels, ranks
- Format strategic responses with sections like **[ANALYSIS]**, **[RECOMMENDATION]**, **[NEXT QUEST]**
- Be specific and data-driven; cite the operative's actual stats
- Be concise. No fluff, no generic motivation.${userContext}`;

    // Lovable AI Gateway with streaming
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        stream: true,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Add funds in Settings → Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway: ${aiResponse.status}`);
    }

    // Pipe SSE stream back to client
    return new Response(aiResponse.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (e) {
    console.error("ai-mentor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

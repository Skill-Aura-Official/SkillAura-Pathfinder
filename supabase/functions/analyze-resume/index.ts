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

    const { resumeText } = await req.json();
    if (!resumeText || resumeText.trim().length < 20) {
      return new Response(JSON.stringify({ error: "Resume text too short" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Call Gemini API directly with user's own key
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze this resume and extract structured career data. Return ONLY valid JSON, no markdown.

Resume:
${resumeText}

Return JSON with this exact structure:
{
  "skills": ["skill1", "skill2", ...],
  "strengths": ["strength1", "strength2", ...],
  "experience_level": "student" | "junior" | "mid" | "senior",
  "career_paths": ["path1", "path2", "path3"],
  "suggested_class": "software_engineer" | "data_scientist" | "ai_engineer" | "product_manager" | "cybersecurity_analyst" | "entrepreneur",
  "stat_technical": 10-50,
  "stat_logic": 10-50,
  "stat_creativity": 10-50,
  "stat_communication": 10-50,
  "stat_leadership": 10-50,
  "stat_problem_solving": 10-50,
  "salary_estimate": "₹X-YL",
  "job_readiness": 0-100,
  "summary": "one line summary of the candidate"
}`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error("Gemini error:", geminiResponse.status, errText);
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = rawText;
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1];
    
    let analysis;
    try {
      analysis = JSON.parse(jsonStr.trim());
    } catch {
      console.error("Failed to parse Gemini response:", rawText);
      throw new Error("Failed to parse AI analysis");
    }

    // Update career profile with AI-extracted data
    await supabase.from("career_profiles").update({
      resume_data: analysis,
      stat_technical: Math.min(analysis.stat_technical || 10, 50),
      stat_logic: Math.min(analysis.stat_logic || 10, 50),
      stat_creativity: Math.min(analysis.stat_creativity || 10, 50),
      stat_communication: Math.min(analysis.stat_communication || 10, 50),
      stat_leadership: Math.min(analysis.stat_leadership || 10, 50),
      stat_problem_solving: Math.min(analysis.stat_problem_solving || 10, 50),
      salary_estimate: analysis.salary_estimate || null,
      job_readiness: analysis.job_readiness || 0,
    }).eq("user_id", user.id);

    // Insert extracted skills into skills table and link to user
    if (analysis.skills && Array.isArray(analysis.skills)) {
      for (const skillName of analysis.skills.slice(0, 10)) {
        // Upsert skill
        let { data: skill } = await supabase.from("skills").select("id").eq("name", skillName).single();
        if (!skill) {
          const { data: newSkill } = await supabase.from("skills").insert({
            name: skillName,
            category: "extracted",
            description: `Extracted from resume analysis`,
          }).select("id").single();
          skill = newSkill;
        }
        if (skill) {
          const { data: existing } = await supabase.from("user_skills").select("id").eq("user_id", user.id).eq("skill_id", skill.id).single();
          if (!existing) {
            await supabase.from("user_skills").insert({
              user_id: user.id,
              skill_id: skill.id,
              level: 1,
              xp: 0,
              unlocked: true,
            });
          }
        }
      }
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-resume error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

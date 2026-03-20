import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Brain, Swords, ChevronRight, Check, Zap, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const careerClasses = [
  { id: "software_engineer", name: "Software Engineer", desc: "Build systems and applications", icon: "💻" },
  { id: "data_scientist", name: "Data Scientist", desc: "Analyze data and build models", icon: "📊" },
  { id: "ai_engineer", name: "AI Engineer", desc: "Create intelligent systems", icon: "🤖" },
  { id: "product_manager", name: "Product Manager", desc: "Lead product strategy", icon: "🎯" },
  { id: "cybersecurity_analyst", name: "Cybersecurity Analyst", desc: "Protect digital assets", icon: "🛡️" },
  { id: "entrepreneur", name: "Entrepreneur", desc: "Build your own venture", icon: "🚀" },
];

const interviewQuestions = [
  { key: "goal", q: "What is your primary career goal?", options: ["Get a job", "Switch careers", "Level up skills", "Start a business"] },
  { key: "industry", q: "Which industry interests you most?", options: ["Technology", "Finance", "Healthcare", "Education"] },
  { key: "experience", q: "What's your experience level?", options: ["Student", "0-2 years", "3-5 years", "5+ years"] },
  { key: "strength", q: "What's your biggest strength?", options: ["Problem Solving", "Communication", "Technical Skills", "Leadership"] },
];

type Phase = "boot" | "identify" | "resume" | "interview" | "class" | "scanning" | "generating" | "assigning" | "entering";

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>("boot");
  const [playerName, setPlayerName] = useState("");
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedClass, setSelectedClass] = useState("");
  const [interviewIdx, setInterviewIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);

  // Boot sequence
  useEffect(() => {
    if (phase !== "boot") return;
    const lines = [
      "[SYSTEM] Initializing SkillAura PathFinder AI...",
      "[SYSTEM] Loading career intelligence modules...",
      "[SYSTEM] Connecting to skill database...",
      "[SYSTEM] AI Mentor online...",
      "[SYSTEM] Quest engine ready...",
      "[SYSTEM] ████████████████████ 100%",
      "",
      "[SYSTEM ACTIVATED]",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setBootLines(prev => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase("identify"), 600);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [phase]);

  const handleAnswer = (answer: string) => {
    const key = interviewQuestions[interviewIdx].key;
    const newAnswers = { ...answers, [key]: answer };
    setAnswers(newAnswers);
    if (interviewIdx < interviewQuestions.length - 1) {
      setInterviewIdx(interviewIdx + 1);
    } else {
      setPhase("class");
    }
  };

  const runSystemSequence = async () => {
    if (!user) return;
    setSaving(true);

    // Phase: Scanning
    setPhase("scanning");
    await new Promise(r => setTimeout(r, 1500));

    // Phase: Generating
    setPhase("generating");

    try {
      const statBoost: Record<string, any> = {};
      if (answers.strength === "Problem Solving") { statBoost.stat_problem_solving = 20; statBoost.stat_logic = 15; }
      else if (answers.strength === "Communication") { statBoost.stat_communication = 20; statBoost.stat_leadership = 15; }
      else if (answers.strength === "Technical Skills") { statBoost.stat_technical = 20; statBoost.stat_logic = 15; }
      else if (answers.strength === "Leadership") { statBoost.stat_leadership = 20; statBoost.stat_communication = 15; }

      // Update profile name
      await supabase.from("profiles").update({ display_name: playerName }).eq("user_id", user.id);

      // Update career profile
      await supabase.from("career_profiles").update({
        career_class: selectedClass as any,
        interview_data: {
          goals: answers.goal || "",
          interests: answers.industry || "",
          strengths: answers.strength || "",
          experience: answers.experience || "",
        } as any,
        target_career: careerClasses.find(c => c.id === selectedClass)?.name || "Explorer",
        ...statBoost,
      }).eq("user_id", user.id);

      await new Promise(r => setTimeout(r, 1200));

      // Phase: Assigning quests
      setPhase("assigning");

      // Assign starter quests matching career class or generic
      const { data: quests } = await supabase
        .from("quests")
        .select("id")
        .or(`career_class.eq.${selectedClass},career_class.is.null`)
        .limit(5);

      if (quests && quests.length > 0) {
        const { data: existing } = await supabase.from("user_quests").select("quest_id").eq("user_id", user.id);
        const existingIds = new Set((existing || []).map(e => e.quest_id));
        const newQuests = quests.filter(q => !existingIds.has(q.id)).map(q => ({
          user_id: user.id,
          quest_id: q.id,
          status: "available" as const,
          progress: 0,
        }));
        if (newQuests.length > 0) await supabase.from("user_quests").insert(newQuests);
      }

      // Assign starter skills
      const { data: skills } = await supabase.from("skills").select("id").limit(7);
      if (skills && skills.length > 0) {
        const { data: existing } = await supabase.from("user_skills").select("skill_id").eq("user_id", user.id);
        const existingIds = new Set((existing || []).map(e => e.skill_id));
        const newSkills = skills.filter(s => !existingIds.has(s.id)).map(s => ({
          user_id: user.id,
          skill_id: s.id,
          level: 1,
          xp: 0,
          unlocked: true,
        }));
        if (newSkills.length > 0) await supabase.from("user_skills").insert(newSkills);
      }

      await new Promise(r => setTimeout(r, 1000));

      // Phase: Entering
      setPhase("entering");
      await new Promise(r => setTimeout(r, 1500));

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("System initialization failed. Retrying...");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {/* BOOT SEQUENCE */}
          {phase === "boot" && (
            <motion.div key="boot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="surface-card-inset p-8 font-mono">
              <div className="space-y-1">
                {bootLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-sm ${line.includes("ACTIVATED") ? "text-primary font-bold text-lg" : line.includes("████") ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {line}
                  </motion.div>
                ))}
                <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
              </div>
            </motion.div>
          )}

          {/* IDENTIFY */}
          {phase === "identify" && (
            <motion.div key="identify" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="surface-card-inset p-8 text-center">
              <div className="text-primary font-mono text-sm mb-6 animate-pulse">[SYSTEM] New entity detected</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Identify yourself, Player.</h2>
              <p className="text-sm text-muted-foreground mb-6">What shall the system call you?</p>
              <Input
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                placeholder="Enter your name..."
                className="bg-secondary border-border text-center text-lg mb-4"
                autoFocus
              />
              <Button
                className="gradient-primary text-foreground border-0 glow-blue"
                onClick={() => setPhase("resume")}
                disabled={!playerName.trim()}
              >
                Confirm Identity <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* RESUME */}
          {phase === "resume" && (
            <motion.div key="resume" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="surface-card-inset p-8 text-center">
              <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">Upload Your Resume</h2>
              <p className="text-sm text-muted-foreground mb-6">Our AI will scan and extract your abilities.</p>
              {!resumeUploaded ? (
                <div
                  className="border-2 border-dashed border-border rounded-xl p-12 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => { setResumeUploaded(true); toast.success("Resume scanned! Skills extracted."); }}
                >
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Click to upload PDF, DOCX</p>
                </div>
              ) : (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                  <Check className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-foreground font-medium">Resume analyzed successfully!</p>
                </div>
              )}
              <div className="flex gap-3 mt-6 justify-center">
                <Button variant="outline" className="border-border" onClick={() => setPhase("interview")}>Skip</Button>
                <Button className="gradient-primary text-foreground border-0" onClick={() => setPhase("interview")} disabled={!resumeUploaded}>
                  Continue <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* INTERVIEW */}
          {phase === "interview" && (
            <motion.div key="interview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="surface-card-inset p-8">
              <Brain className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground text-center mb-2">Career Interview</h2>
              <p className="text-sm text-muted-foreground text-center mb-1">
                Question {interviewIdx + 1} of {interviewQuestions.length}
              </p>
              <div className="w-full bg-secondary rounded-full h-1 mb-6">
                <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${((interviewIdx + 1) / interviewQuestions.length) * 100}%` }} />
              </div>
              <h3 className="text-lg font-semibold text-foreground text-center mb-4">
                {interviewQuestions[interviewIdx].q}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {interviewQuestions[interviewIdx].options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    className="surface-interactive p-4 text-sm text-foreground hover:border-primary/30 text-center active:scale-[0.97] transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* CLASS SELECTION */}
          {phase === "class" && (
            <motion.div key="class" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="surface-card-inset p-8">
              <Swords className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground text-center mb-2">Choose Your Class</h2>
              <p className="text-sm text-muted-foreground text-center mb-6">This determines your career path. You can evolve later.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {careerClasses.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClass(c.id)}
                    className={`surface-interactive p-4 text-center transition-all active:scale-[0.97] ${
                      selectedClass === c.id ? "ring-2 ring-primary bg-primary/10" : ""
                    }`}
                  >
                    <span className="text-2xl block mb-2">{c.icon}</span>
                    <span className="text-sm font-semibold text-foreground block">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.desc}</span>
                  </button>
                ))}
              </div>
              <Button className="w-full gradient-primary text-foreground border-0 mt-6 glow-blue" onClick={runSystemSequence} disabled={!selectedClass || saving}>
                Initialize System <Zap className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* SCANNING */}
          {phase === "scanning" && (
            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="surface-card-inset p-12 text-center">
              <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
              <div className="font-mono text-primary text-sm animate-pulse mb-2">[SYSTEM] Scanning Player Data...</div>
              <p className="text-xs text-muted-foreground">Analyzing skills, experience, and career trajectory</p>
            </motion.div>
          )}

          {/* GENERATING */}
          {phase === "generating" && (
            <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="surface-card-inset p-12 text-center">
              <Zap className="h-12 w-12 text-accent mx-auto mb-4 animate-pulse" />
              <div className="font-mono text-accent text-sm animate-pulse mb-2">[SYSTEM] Generating Player Profile...</div>
              <div className="grid grid-cols-2 gap-3 mt-6 max-w-xs mx-auto text-left">
                <div><span className="text-label">Level</span><div className="font-mono font-bold text-foreground">1</div></div>
                <div><span className="text-label">Rank</span><div className="font-mono font-bold text-rank-e">E</div></div>
                <div><span className="text-label">XP</span><div className="font-mono font-bold text-foreground">0 / 200</div></div>
                <div><span className="text-label">Class</span><div className="font-mono font-bold text-primary">{careerClasses.find(c => c.id === selectedClass)?.name}</div></div>
              </div>
            </motion.div>
          )}

          {/* ASSIGNING */}
          {phase === "assigning" && (
            <motion.div key="assigning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="surface-card-inset p-12 text-center">
              <Swords className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
              <div className="font-mono text-primary text-sm animate-pulse mb-2">[SYSTEM] Assigning Initial Quests...</div>
              <p className="text-xs text-muted-foreground">Calibrating difficulty to your skill level</p>
            </motion.div>
          )}

          {/* ENTERING */}
          {phase === "entering" && (
            <motion.div key="entering" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="surface-card-inset p-12 text-center">
              <img src="/favicon.png" alt="SkillAura PathFinder AI" className="h-16 w-16 mx-auto mb-4" />
              <div className="font-mono text-primary text-lg font-bold mb-2 glow-blue">[ENTERING SYSTEM...]</div>
              <p className="text-sm text-muted-foreground">Welcome, {playerName}. Your journey begins now.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

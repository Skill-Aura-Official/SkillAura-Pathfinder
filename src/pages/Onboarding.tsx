import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Brain, Swords, ChevronRight, Check, Zap, FileText, Loader2, Waves, Wind, Wrench, Moon, Target, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const themes = [
  { id: "ocean", name: "Ocean", icon: Waves, emoji: "🌊", desc: "Calm depths, fluid motion", color: "from-cyan-500 to-blue-600" },
  { id: "windy", name: "Windy", icon: Wind, emoji: "🌪️", desc: "Swift currents, fast flow", color: "from-emerald-400 to-teal-600" },
  { id: "wrench", name: "Wrench", icon: Wrench, emoji: "⚙️", desc: "Mechanical precision", color: "from-zinc-400 to-slate-600" },
  { id: "bloodmoon", name: "Blood Moon", icon: Moon, emoji: "🌕", desc: "Dark intensity, raw power", color: "from-red-500 to-rose-800" },
];

const careerClasses = [
  { id: "software_engineer", name: "Software Engineer", desc: "Build systems & applications", icon: "💻" },
  { id: "data_scientist", name: "Data Scientist", desc: "Analyze data & build models", icon: "📊" },
  { id: "ai_engineer", name: "AI Engineer", desc: "Create intelligent systems", icon: "🤖" },
  { id: "product_manager", name: "Product Manager", desc: "Lead product strategy", icon: "🎯" },
  { id: "cybersecurity_analyst", name: "Cybersecurity Analyst", desc: "Protect digital assets", icon: "🛡️" },
  { id: "entrepreneur", name: "Entrepreneur", desc: "Build your own venture", icon: "🚀" },
];

const goals = [
  { id: "job_fast", label: "Get a Job Fast", icon: "⚡", desc: "Optimize for immediate placement" },
  { id: "master_skill", label: "Master a Skill", icon: "🧠", desc: "Deep dive into one domain" },
  { id: "explore", label: "Explore Careers", icon: "🔍", desc: "Discover your ideal path" },
  { id: "startup", label: "Build a Startup", icon: "🚀", desc: "Entrepreneurial journey" },
];

type Phase = "boot" | "identity" | "credentials" | "theme" | "resume" | "scanning" | "profile_gen" | "goal" | "class" | "assigning" | "entering";

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>("boot");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<any>(null);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [saving, setSaving] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [usernameError, setUsernameError] = useState("");

  // If already logged in, skip credentials
  const needsAuth = !user;

  // Boot sequence
  useEffect(() => {
    if (phase !== "boot") return;
    const lines = [
      "[CORE] SkillAura PathFinder AI v3.0",
      "[CORE] Initializing neural career engine...",
      "[CORE] Loading skill intelligence modules...",
      "[CORE] AI Mentor: ONLINE",
      "[CORE] Quest Engine: ONLINE",
      "[CORE] Skill Tree: ONLINE",
      "[CORE] Career GPS: ONLINE",
      "[SCAN] ████████████████████████ 100%",
      "",
      "[ SYSTEM ACTIVATED ]",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setBootLines(prev => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase("identity"), 800);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [phase]);

  const checkUsername = useCallback(async (name: string) => {
    if (name.length < 3) { setUsernameError("Min 3 characters"); return false; }
    const { data } = await supabase.from("profiles").select("id").eq("display_name", name).limit(1);
    if (data && data.length > 0) { setUsernameError("Username taken"); return false; }
    setUsernameError("");
    return true;
  }, []);

  const handleIdentityNext = async () => {
    const valid = await checkUsername(username.trim());
    if (!valid) return;
    setPhase(needsAuth ? "credentials" : "theme");
  };

  const handleSignup = async () => {
    setSaving(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: username.trim() }, emailRedirectTo: window.location.origin },
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Access granted!");
    setPhase("theme");
  };

  const handleResumeUpload = async () => {
    if (!resumeFile || !user) return;
    setSaving(true);
    setPhase("scanning");

    try {
      // Upload to storage
      const filePath = `${user.id}/${Date.now()}_${resumeFile.name}`;
      await supabase.storage.from("resumes").upload(filePath, resumeFile);

      // Extract text (for now send filename as placeholder — real PDF parsing would need a library)
      // Read file as text if possible
      let resumeText = "";
      try {
        resumeText = await resumeFile.text();
      } catch {
        resumeText = `Resume file: ${resumeFile.name}`;
      }

      // Call AI analysis
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { resumeText },
      });

      if (error) throw error;

      setResumeAnalysis(data?.analysis);
      if (data?.analysis?.suggested_class) {
        setSelectedClass(data.analysis.suggested_class);
      }

      setPhase("profile_gen");
      await new Promise(r => setTimeout(r, 2000));
      setPhase("goal");
    } catch (err: any) {
      console.error(err);
      toast.error("Resume scan failed. Proceeding manually...");
      setPhase("goal");
    } finally {
      setSaving(false);
    }
  };

  const handleSkipResume = () => {
    setPhase("goal");
  };

  const runFinalSequence = async () => {
    if (!user) return;
    setSaving(true);
    setPhase("assigning");

    try {
      // Save theme
      await supabase.from("profiles").update({
        display_name: username.trim() || displayName,
        theme: selectedTheme,
      }).eq("user_id", user.id);

      // Update career profile
      const updateData: any = {
        career_class: selectedClass || "explorer",
        interview_data: {
          goals: selectedGoal,
          strengths: resumeAnalysis?.strengths?.join(", ") || "",
          experience: resumeAnalysis?.experience_level || "student",
          interests: resumeAnalysis?.career_paths?.join(", ") || "",
        },
        target_career: careerClasses.find(c => c.id === selectedClass)?.name || "Explorer",
      };

      if (resumeAnalysis) {
        updateData.stat_technical = Math.min(resumeAnalysis.stat_technical || 10, 50);
        updateData.stat_logic = Math.min(resumeAnalysis.stat_logic || 10, 50);
        updateData.stat_creativity = Math.min(resumeAnalysis.stat_creativity || 10, 50);
        updateData.stat_communication = Math.min(resumeAnalysis.stat_communication || 10, 50);
        updateData.stat_leadership = Math.min(resumeAnalysis.stat_leadership || 10, 50);
        updateData.stat_problem_solving = Math.min(resumeAnalysis.stat_problem_solving || 10, 50);
        updateData.salary_estimate = resumeAnalysis.salary_estimate || null;
        updateData.job_readiness = resumeAnalysis.job_readiness || 0;
      }

      await supabase.from("career_profiles").update(updateData).eq("user_id", user.id);

      // Assign starter quests
      const { data: quests } = await supabase
        .from("quests")
        .select("id")
        .or(`career_class.eq.${selectedClass || "explorer"},career_class.is.null`)
        .limit(5);

      if (quests && quests.length > 0) {
        const { data: existing } = await supabase.from("user_quests").select("quest_id").eq("user_id", user.id);
        const existingIds = new Set((existing || []).map(e => e.quest_id));
        const newQuests = quests.filter(q => !existingIds.has(q.id)).map(q => ({
          user_id: user.id, quest_id: q.id, status: "available" as const, progress: 0,
        }));
        if (newQuests.length > 0) await supabase.from("user_quests").insert(newQuests);
      }

      // Assign starter skills if none from resume
      const { data: existingSkills } = await supabase.from("user_skills").select("id").eq("user_id", user.id).limit(1);
      if (!existingSkills || existingSkills.length === 0) {
        const { data: skills } = await supabase.from("skills").select("id").limit(5);
        if (skills && skills.length > 0) {
          const newSkills = skills.map(s => ({
            user_id: user.id, skill_id: s.id, level: 1, xp: 0, unlocked: true,
          }));
          await supabase.from("user_skills").insert(newSkills);
        }
      }

      await new Promise(r => setTimeout(r, 1500));
      setPhase("entering");
      await new Promise(r => setTimeout(r, 2000));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("System initialization failed.");
      setSaving(false);
    }
  };

  const themeGradient = selectedTheme
    ? themes.find(t => t.id === selectedTheme)?.color || ""
    : "";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {/* BOOT */}
          {phase === "boot" && (
            <motion.div key="boot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="surface-card-inset p-8 font-mono">
              <div className="space-y-1">
                {bootLines.map((line, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className={`text-sm ${line.includes("ACTIVATED") ? "text-primary font-bold text-lg" : line.includes("████") ? "text-primary" : line.includes("ONLINE") ? "text-green-400" : "text-muted-foreground"}`}>
                    {line}
                  </motion.div>
                ))}
                <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
              </div>
            </motion.div>
          )}

          {/* IDENTITY */}
          {phase === "identity" && (
            <motion.div key="identity" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="surface-card-inset p-8 text-center">
              <div className="font-mono text-primary text-sm mb-6 animate-pulse">[SYSTEM] New entity detected</div>
              <Crosshair className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Identify yourself, Player.</h2>
              <p className="text-sm text-muted-foreground mb-6">Choose a unique username for the system.</p>
              <div className="space-y-3 max-w-sm mx-auto">
                <div>
                  <Input value={username} onChange={e => { setUsername(e.target.value); setUsernameError(""); }}
                    placeholder="Username (unique)" className="bg-secondary border-border text-center text-lg" autoFocus />
                  {usernameError && <p className="text-xs text-destructive mt-1">{usernameError}</p>}
                </div>
                <Input value={displayName} onChange={e => setDisplayName(e.target.value)}
                  placeholder="Display Name (optional)" className="bg-secondary border-border text-center" />
                <Button className="gradient-primary text-foreground border-0 w-full" onClick={handleIdentityNext} disabled={!username.trim()}>
                  Confirm Identity <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* CREDENTIALS (only for new signups) */}
          {phase === "credentials" && (
            <motion.div key="credentials" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="surface-card-inset p-8 text-center">
              <div className="font-mono text-primary text-sm mb-6 animate-pulse">[SYSTEM] Secure your access</div>
              <h2 className="text-xl font-bold text-foreground mb-2">Create Access Credentials</h2>
              <p className="text-sm text-muted-foreground mb-6">These protect your system profile.</p>
              <div className="space-y-3 max-w-sm mx-auto">
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Email" className="bg-secondary border-border" />
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Password (min 6 chars)" className="bg-secondary border-border" minLength={6} />
                <Button className="gradient-primary text-foreground border-0 w-full" onClick={handleSignup} disabled={saving || !email || password.length < 6}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Secure Access <ChevronRight className="ml-1 h-4 w-4" /></>}
                </Button>
              </div>
            </motion.div>
          )}

          {/* THEME */}
          {phase === "theme" && (
            <motion.div key="theme" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="surface-card-inset p-8">
              <div className="font-mono text-primary text-sm mb-4 text-center animate-pulse">[SYSTEM] Configure environment</div>
              <h2 className="text-xl font-bold text-foreground text-center mb-2">Choose Your Environment</h2>
              <p className="text-sm text-muted-foreground text-center mb-6">This shapes your entire system experience.</p>
              <div className="grid grid-cols-2 gap-3">
                {themes.map(t => (
                  <button key={t.id} onClick={() => setSelectedTheme(t.id)}
                    className={`relative overflow-hidden surface-interactive p-5 text-center transition-all active:scale-[0.97] ${selectedTheme === t.id ? "ring-2 ring-primary" : ""}`}>
                    <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${t.color}`} />
                    <div className="relative">
                      <span className="text-3xl block mb-2">{t.emoji}</span>
                      <span className="text-sm font-semibold text-foreground block">{t.name}</span>
                      <span className="text-xs text-muted-foreground">{t.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
              <Button className="w-full gradient-primary text-foreground border-0 mt-6" onClick={() => setPhase("resume")} disabled={!selectedTheme}>
                Apply Environment <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* RESUME */}
          {phase === "resume" && (
            <motion.div key="resume" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="surface-card-inset p-8 text-center">
              <div className="font-mono text-primary text-sm mb-4 animate-pulse">[SYSTEM] Upload your scroll of experience</div>
              <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">Resume Upload</h2>
              <p className="text-sm text-muted-foreground mb-6">Our AI will scan and extract your abilities using Gemini intelligence.</p>
              {!resumeFile ? (
                <label className="block border-2 border-dashed border-border rounded-xl p-12 cursor-pointer hover:border-primary/50 transition-colors">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Click to upload PDF, DOCX, TXT</p>
                  <input type="file" accept=".pdf,.docx,.txt,.doc" className="hidden"
                    onChange={e => { if (e.target.files?.[0]) setResumeFile(e.target.files[0]); }} />
                </label>
              ) : (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                  <Check className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-foreground font-medium">{resumeFile.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{(resumeFile.size / 1024).toFixed(0)} KB</p>
                </div>
              )}
              <div className="flex gap-3 mt-6 justify-center">
                <Button variant="outline" className="border-border" onClick={handleSkipResume}>Skip for now</Button>
                <Button className="gradient-primary text-foreground border-0" onClick={handleResumeUpload} disabled={!resumeFile || saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Scan Resume <Brain className="ml-1 h-4 w-4" /></>}
                </Button>
              </div>
            </motion.div>
          )}

          {/* SCANNING */}
          {phase === "scanning" && (
            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="surface-card-inset p-12 text-center">
              <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
              <div className="font-mono text-primary text-sm animate-pulse mb-2">[AI] Scanning Resume Data...</div>
              <div className="font-mono text-xs text-muted-foreground space-y-1 mt-4">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>Extracting skills...</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>Analyzing experience...</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>Generating career profile...</motion.p>
              </div>
            </motion.div>
          )}

          {/* PROFILE GENERATION */}
          {phase === "profile_gen" && (
            <motion.div key="profile_gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="surface-card-inset p-8 text-center">
              <Zap className="h-12 w-12 text-accent mx-auto mb-4 animate-pulse" />
              <div className="font-mono text-accent text-sm animate-pulse mb-4">[AI] Analysis Complete</div>
              {resumeAnalysis && (
                <div className="text-left max-w-sm mx-auto space-y-3">
                  {resumeAnalysis.summary && (
                    <p className="text-sm text-foreground italic">"{resumeAnalysis.summary}"</p>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="surface-card p-2"><span className="text-label">Level</span><div className="font-mono font-bold text-foreground">1</div></div>
                    <div className="surface-card p-2"><span className="text-label">Rank</span><div className="font-mono font-bold text-rank-e">E</div></div>
                    <div className="surface-card p-2"><span className="text-label">Class</span><div className="font-mono font-bold text-primary">{careerClasses.find(c => c.id === resumeAnalysis.suggested_class)?.name || "Explorer"}</div></div>
                    <div className="surface-card p-2"><span className="text-label">Readiness</span><div className="font-mono font-bold text-accent">{resumeAnalysis.job_readiness}%</div></div>
                  </div>
                  {resumeAnalysis.skills && (
                    <div>
                      <span className="text-label">Detected Skills</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {resumeAnalysis.skills.slice(0, 8).map((s: string) => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* GOAL */}
          {phase === "goal" && (
            <motion.div key="goal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="surface-card-inset p-8">
              <Target className="h-10 w-10 text-primary mx-auto mb-4" />
              <div className="font-mono text-primary text-sm mb-4 text-center animate-pulse">[SYSTEM] Define your objective</div>
              <h2 className="text-xl font-bold text-foreground text-center mb-2">What is your objective?</h2>
              <p className="text-sm text-muted-foreground text-center mb-6">This drives your quest generation and AI guidance.</p>
              <div className="grid grid-cols-2 gap-3">
                {goals.map(g => (
                  <button key={g.id} onClick={() => setSelectedGoal(g.id)}
                    className={`surface-interactive p-4 text-center transition-all active:scale-[0.97] ${selectedGoal === g.id ? "ring-2 ring-primary bg-primary/10" : ""}`}>
                    <span className="text-2xl block mb-2">{g.icon}</span>
                    <span className="text-sm font-semibold text-foreground block">{g.label}</span>
                    <span className="text-xs text-muted-foreground">{g.desc}</span>
                  </button>
                ))}
              </div>
              <Button className="w-full gradient-primary text-foreground border-0 mt-6" onClick={() => setPhase("class")} disabled={!selectedGoal}>
                Lock Objective <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* CLASS */}
          {phase === "class" && (
            <motion.div key="class" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="surface-card-inset p-8">
              <Swords className="h-10 w-10 text-primary mx-auto mb-4" />
              <div className="font-mono text-primary text-sm mb-4 text-center animate-pulse">[SYSTEM] Select career class</div>
              <h2 className="text-xl font-bold text-foreground text-center mb-2">Choose Your Class</h2>
              {resumeAnalysis?.suggested_class && (
                <p className="text-xs text-accent text-center mb-4 font-mono">AI Recommended: {careerClasses.find(c => c.id === resumeAnalysis.suggested_class)?.name}</p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {careerClasses.map(c => (
                  <button key={c.id} onClick={() => setSelectedClass(c.id)}
                    className={`surface-interactive p-4 text-center transition-all active:scale-[0.97] ${selectedClass === c.id ? "ring-2 ring-primary bg-primary/10" : ""}`}>
                    <span className="text-2xl block mb-2">{c.icon}</span>
                    <span className="text-sm font-semibold text-foreground block">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.desc}</span>
                  </button>
                ))}
              </div>
              <Button className="w-full gradient-primary text-foreground border-0 mt-6 glow-blue" onClick={runFinalSequence} disabled={!selectedClass || saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Initialize System <Zap className="ml-1 h-4 w-4" /></>}
              </Button>
            </motion.div>
          )}

          {/* ASSIGNING */}
          {phase === "assigning" && (
            <motion.div key="assigning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="surface-card-inset p-12 text-center">
              <Swords className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
              <div className="font-mono text-primary text-sm animate-pulse mb-2">[SYSTEM] Assigning Initial Quests...</div>
              <div className="font-mono text-xs text-muted-foreground space-y-1 mt-4">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>Building skill tree...</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>Calibrating difficulty...</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>Generating quest chain...</motion.p>
              </div>
            </motion.div>
          )}

          {/* ENTERING */}
          {phase === "entering" && (
            <motion.div key="entering" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="surface-card-inset p-12 text-center">
              <img src="/favicon.png" alt="SkillAura" className="h-16 w-16 mx-auto mb-4" />
              <div className="font-mono text-primary text-lg font-bold mb-2 glow-blue">[ ENTERING SYSTEM... ]</div>
              <p className="text-sm text-muted-foreground">Welcome, {username || displayName || "Player"}. Your journey begins now.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

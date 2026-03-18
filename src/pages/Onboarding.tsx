import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Brain, Swords, ChevronRight, Check, Zap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedClass, setSelectedClass] = useState("");
  const [interviewIdx, setInterviewIdx] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleResumeUpload = () => {
    setTimeout(() => {
      setResumeUploaded(true);
      toast.success("Resume analyzed! Skills extracted.");
    }, 1500);
  };

  const handleAnswer = (answer: string) => {
    const key = interviewQuestions[interviewIdx].key;
    const newAnswers = { ...answers, [key]: answer };
    setAnswers(newAnswers);
    if (interviewIdx < interviewQuestions.length - 1) {
      setInterviewIdx(interviewIdx + 1);
    } else {
      setStep(2);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // 1. Update career profile with class + interview data + initial stats based on strength
      const statBoost: Record<string, any> = {};
      if (answers.strength === "Problem Solving") { statBoost.stat_problem_solving = 20; statBoost.stat_logic = 15; }
      else if (answers.strength === "Communication") { statBoost.stat_communication = 20; statBoost.stat_leadership = 15; }
      else if (answers.strength === "Technical Skills") { statBoost.stat_technical = 20; statBoost.stat_logic = 15; }
      else if (answers.strength === "Leadership") { statBoost.stat_leadership = 20; statBoost.stat_communication = 15; }

      await supabase.from("career_profiles").update({
        career_class: selectedClass as any,
        interview_data: {
          goals: answers.goal || "",
          interests: answers.industry || "",
          strengths: answers.strength || "",
          experience: answers.experience || "",
        } as any,
        target_career: `${careerClasses.find(c => c.id === selectedClass)?.name || "Explorer"}`,
        ...statBoost,
      }).eq("user_id", user.id);

      // 2. Assign starter quests from quests table
      const { data: quests } = await supabase.from("quests").select("id").limit(4);
      if (quests && quests.length > 0) {
        const questInserts = quests.map(q => ({
          user_id: user.id,
          quest_id: q.id,
          status: "available" as const,
          progress: 0,
        }));
        await supabase.from("user_quests").insert(questInserts);
      }

      // 3. Assign starter skills
      const { data: skills } = await supabase.from("skills").select("id").limit(7);
      if (skills && skills.length > 0) {
        // Check which skills user already has
        const { data: existing } = await supabase.from("user_skills").select("skill_id").eq("user_id", user.id);
        const existingIds = new Set((existing || []).map(e => e.skill_id));
        const newSkills = skills.filter(s => !existingIds.has(s.id)).map(s => ({
          user_id: user.id,
          skill_id: s.id,
          level: 1,
          xp: 0,
          unlocked: true,
        }));
        if (newSkills.length > 0) {
          await supabase.from("user_skills").insert(newSkills);
        }
      }

      toast.success("Career profile created! Welcome aboard.");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const steps = ["Upload Resume", "Career Interview", "Class Selection", "Begin"];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                i <= step ? "gradient-primary text-foreground" : "bg-secondary text-muted-foreground"
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && <div className={`w-12 h-0.5 ${i < step ? "bg-primary" : "bg-secondary"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="resume" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="surface-card-inset p-8 text-center">
              <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">Upload Your Resume</h2>
              <p className="text-sm text-muted-foreground mb-6">Our AI will extract your skills, experience, and technologies.</p>
              
              {!resumeUploaded ? (
                <div className="border-2 border-dashed border-border rounded-xl p-12 cursor-pointer hover:border-primary/50 transition-colors" onClick={handleResumeUpload}>
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
                <Button variant="outline" className="border-border" onClick={() => setStep(1)}>Skip</Button>
                <Button className="gradient-primary text-foreground border-0" onClick={() => setStep(1)} disabled={!resumeUploaded}>
                  Continue <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="interview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="surface-card-inset p-8">
              <Brain className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground text-center mb-2">Career Interview</h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Question {interviewIdx + 1} of {interviewQuestions.length}
              </p>
              <h3 className="text-lg font-semibold text-foreground text-center mb-4">
                {interviewQuestions[interviewIdx].q}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {interviewQuestions[interviewIdx].options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    className="surface-interactive p-4 text-sm text-foreground hover:border-primary/30 text-center"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="class" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="surface-card-inset p-8">
              <Swords className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground text-center mb-2">Choose Your Class</h2>
              <p className="text-sm text-muted-foreground text-center mb-6">Select your career path. You can change later.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {careerClasses.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClass(c.id)}
                    className={`surface-interactive p-4 text-center transition-all ${
                      selectedClass === c.id ? "ring-2 ring-primary bg-primary/10" : ""
                    }`}
                  >
                    <span className="text-2xl block mb-2">{c.icon}</span>
                    <span className="text-sm font-semibold text-foreground block">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.desc}</span>
                  </button>
                ))}
              </div>
              <Button className="w-full gradient-primary text-foreground border-0 mt-6" onClick={() => setStep(3)} disabled={!selectedClass}>
                Continue <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="surface-card-inset p-8 text-center">
              <img src="/favicon.png" alt="SkillAura PathFinder AI" className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">System Activated</h2>
              <p className="text-sm text-muted-foreground mb-6">Your career profile is ready. Begin your ascension.</p>
              <div className="surface-card p-4 mb-6 text-left">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-label">Level</span><div className="font-mono font-bold text-foreground">1</div></div>
                  <div><span className="text-label">Rank</span><div className="font-mono font-bold text-rank-e">E</div></div>
                  <div><span className="text-label">XP</span><div className="font-mono font-bold text-foreground">0 / 200</div></div>
                  <div><span className="text-label">Class</span><div className="font-mono font-bold text-primary">{careerClasses.find(c => c.id === selectedClass)?.name}</div></div>
                </div>
              </div>
              <Button className="gradient-primary text-foreground border-0 glow-blue" onClick={handleComplete} disabled={saving}>
                {saving ? "Initializing..." : "Enter Command Center"} <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, Target, Brain, TrendingUp, Shield, Award, ChevronRight, Swords, Map, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Brain, title: "AI Resume Analysis", desc: "Upload your resume. Our AI extracts abilities, detects gaps, and builds your career profile." },
  { icon: Swords, title: "Dynamic Quest Engine", desc: "AI-generated quests tailored to your skill gaps. Daily, weekly, and boss battles." },
  { icon: Map, title: "Career GPS", desc: "Step-by-step career paths from your current position to your dream role." },
  { icon: Target, title: "Skill Tree System", desc: "Visual progression trees for every career class. Unlock abilities as you level up." },
  { icon: TrendingUp, title: "Career Intelligence", desc: "Salary predictions, job readiness scores, and market demand analytics." },
  { icon: Award, title: "Rank & Leaderboard", desc: "Compete globally. Rise from Rank E to the elite Rank S." },
];

const stats = [
  { value: "50K+", label: "Active Players" },
  { value: "1.2M", label: "Quests Completed" },
  { value: "94%", label: "Career Match Rate" },
  { value: "S-Rank", label: "Top Achievers" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="SkillAura PathFinder AI" className="h-8 w-8" />
            <span className="text-lg font-bold tracking-tight text-foreground">SkillAura <span className="text-primary">PathFinder</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="/pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <Button onClick={() => navigate("/dashboard")} size="sm" className="gradient-primary text-foreground border-0">
            Enter System <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(217_91%_60%/0.15),_transparent_60%)]" />
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground mb-8">
              <Shield className="h-3 w-3 text-primary" />
              Career Operating System v2.0
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9] mb-6">
              Stop searching.
              <br />
              <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
                Start Leveling.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Your career is a build. Optimize it. AI-powered quest engine, skill trees, 
              and career simulation — all in one tactical command center.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/dashboard")}
                size="lg"
                className="gradient-primary text-foreground border-0 text-base px-8 h-12 glow-blue"
              >
                Initiate Career Scan <Zap className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border text-foreground hover:bg-secondary h-12 px-8 text-base"
              >
                View Demo
              </Button>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((s) => (
              <div key={s.label} className="surface-card-inset p-4 text-center">
                <div className="text-2xl font-bold font-mono tracking-tight text-foreground">{s.value}</div>
                <div className="text-label mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-label text-primary mb-3">System Modules</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Every tool you need to ascend
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="surface-interactive p-6 group cursor-default"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-label text-accent mb-3">Activation Flow</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              From zero to hero in four steps
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Upload Resume", desc: "Drag and drop your resume. AI extracts your abilities instantly." },
              { step: "02", title: "Career Interview", desc: "Answer AI-driven questions about goals, interests, and strengths." },
              { step: "03", title: "Class Selection", desc: "Choose your career class: AI Engineer, Data Scientist, and more." },
              { step: "04", title: "Begin Questing", desc: "Your personalized quest log and skill tree are ready. Start leveling." },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-4xl font-black font-mono text-primary/20 mb-3">{s.step}</div>
                <h3 className="text-base font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="surface-card-inset p-12 md:p-20 text-center max-w-4xl mx-auto relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(217_91%_60%/0.1),_transparent_70%)]" />
            <div className="relative">
              <BarChart3 className="h-10 w-10 text-primary mx-auto mb-6" strokeWidth={1.5} />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                Your career is a build. Optimize it.
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Join thousands of players engineering their career progression with AI-powered intelligence.
              </p>
              <Button
                onClick={() => navigate("/dashboard")}
                size="lg"
                className="gradient-primary text-foreground border-0 h-12 px-8 glow-blue"
              >
                Begin Your Ascension <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">SkillAura PathFinder AI</span>
          </div>
          <p>© 2026 SkillAura. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

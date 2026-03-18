import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Brain, Users, Rocket, Shield, Heart, Target, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

const team = [
  { name: "Jatin", role: "Founder", desc: "Visionary behind SkillAura. Passionate about making career development accessible and engaging for everyone." },
  { name: "Naman Rathee", role: "Strategy", desc: "Drives product strategy and growth. Focused on building a platform that truly helps people navigate their careers." },
  { name: "Abhinav", role: "Tech & Prompt Engineering", desc: "Architects the AI systems and prompt engineering that power PathFinder AI's intelligent career guidance." },
];

const values = [
  { icon: Brain, title: "AI-First Thinking", desc: "Every feature is powered by intelligent algorithms that learn and adapt to your career journey." },
  { icon: Users, title: "Community Driven", desc: "Built by career seekers, for career seekers. Your feedback shapes our roadmap." },
  { icon: Shield, title: "Privacy & Trust", desc: "Your career data is encrypted and never shared without consent." },
  { icon: Heart, title: "Inclusive Growth", desc: "Career advancement tools accessible to everyone, regardless of background." },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/favicon.png" alt="SkillAura PathFinder AI" className="h-8 w-8" />
            <span className="text-lg font-bold tracking-tight text-foreground">SkillAura <span className="text-primary">PathFinder</span></span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(217_91%_60%/0.12),_transparent_60%)]" />
        <div className="container mx-auto px-6 relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl mx-auto text-center">
            <div className="text-label text-primary mb-3">About Us</div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[0.95] mb-6">
              Building the future of
              <br />
              <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">career intelligence</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              SkillAura is a startup building AI-driven career solutions. PathFinder AI is a gamified career navigation system that helps users build skills, follow structured paths, and become job-ready.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="surface-card-inset p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                <Target className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                A world where no one is lost in their career. Where AI acts as your personal career navigator — analyzing market trends, predicting opportunities, and guiding you step-by-step toward your dream role.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="surface-card-inset p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
                <Lightbulb className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To gamify career development and make professional growth as engaging as playing your favorite RPG. We combine AI intelligence with game mechanics to create personalized career paths that keep you motivated and growing.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-label text-accent mb-3">Core Values</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">What drives us forward</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="surface-card-inset p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-4">
                  <v.icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-label text-primary mb-3">The Team</div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Meet the people behind SkillAura</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {team.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="surface-card-inset p-6 text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 mx-auto mb-4 flex items-center justify-center text-xl font-bold text-foreground">
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <h3 className="text-sm font-semibold text-foreground">{t.name}</h3>
                <div className="text-xs text-primary font-medium mb-2">{t.role}</div>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="surface-card-inset p-12 text-center max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(217_91%_60%/0.1),_transparent_70%)]" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-foreground mb-3">Ready to level up?</h2>
              <p className="text-muted-foreground mb-6 text-sm">Join professionals building their dream careers with AI-powered guidance.</p>
              <Button onClick={() => navigate("/signup")} className="gradient-primary text-foreground border-0 glow-blue">
                Start Your Journey <Rocket className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="SkillAura PathFinder AI" className="h-5 w-5" />
            <span className="font-semibold text-foreground">SkillAura PathFinder AI</span>
          </div>
          <p>© 2026 SkillAura. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

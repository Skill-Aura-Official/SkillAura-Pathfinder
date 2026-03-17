import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Brain, Users, Globe, Rocket, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import aboutImg from "@/assets/about-ai.jpg";
import companyImg from "@/assets/company-office.jpg";
import visionImg from "@/assets/vision-compass.jpg";

const team = [
  { name: "Arjun Mehta", role: "Founder & CEO", desc: "Ex-Google engineer, AI/ML researcher with 10+ years in career tech." },
  { name: "Priya Sharma", role: "CTO", desc: "Full-stack architect. Built scalable systems at Amazon and Flipkart." },
  { name: "Ravi Kumar", role: "Head of AI", desc: "PhD in NLP. Pioneered resume intelligence systems." },
  { name: "Sara Chen", role: "Head of Design", desc: "Design leader from Figma. Crafts gamified experiences." },
];

const values = [
  { icon: Brain, title: "AI-First Thinking", desc: "Every feature is powered by intelligent algorithms that learn and adapt." },
  { icon: Users, title: "Community Driven", desc: "Built by career seekers, for career seekers. Your feedback shapes our roadmap." },
  { icon: Shield, title: "Privacy & Trust", desc: "Your career data is encrypted and never shared without consent." },
  { icon: Heart, title: "Inclusive Growth", desc: "Career advancement tools accessible to everyone, regardless of background." },
];

const milestones = [
  { year: "2024", event: "SkillAura PathFinder AI founded in Bangalore" },
  { year: "2024", event: "Launched beta with 1,000 early adopters" },
  { year: "2025", event: "AI Quest Engine & Skill Tree v2.0 released" },
  { year: "2025", event: "Crossed 50,000 active players globally" },
  { year: "2026", event: "Recruiter panel & job matching system launched" },
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
              SkillAura PathFinder AI is an AI-powered career operating system that gamifies professional growth. 
              We turn career development into an engaging, data-driven journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Section with Image */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img src={aboutImg} alt="AI-Powered Intelligence" className="rounded-2xl w-full object-cover aspect-square shadow-2xl" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="text-label text-accent mb-3">Our Story</div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Born from a simple question</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                "Why is career development so boring?" We asked this in 2024 and couldn't find a good answer. 
                Traditional career platforms felt like filing tax returns — necessary but soul-crushing.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                So we built SkillAura PathFinder AI — a platform that treats your career like an RPG. 
                With AI-powered quest engines, dynamic skill trees, and competitive leaderboards, 
                we make leveling up your career as addictive as your favorite game.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 md:order-1">
              <div className="text-label text-primary mb-3">Our Vision</div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">A world where everyone has a career GPS</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We envision a future where no one is lost in their career. Where AI acts as your personal 
                career navigator — analyzing market trends, predicting opportunities, and guiding you 
                step-by-step toward your dream role.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By 2028, we aim to empower 10 million professionals across 50+ countries with 
                AI-driven career intelligence, making quality career guidance accessible and engaging for everyone.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 md:order-2">
              <img src={visionImg} alt="Career Vision" className="rounded-2xl w-full object-cover aspect-square shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company / Values */}
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

      {/* Company Details with Image */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img src={companyImg} alt="Our Team" className="rounded-2xl w-full object-cover aspect-square shadow-2xl" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="text-label text-primary mb-3">Company</div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Built by builders, for builders</h2>
              <div className="space-y-3">
                <div className="surface-card-inset p-3 flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">Headquarters</div>
                    <div className="text-xs text-muted-foreground">Bangalore, India — with remote teams globally</div>
                  </div>
                </div>
                <div className="surface-card-inset p-3 flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">Team Size</div>
                    <div className="text-xs text-muted-foreground">35+ engineers, designers, and career scientists</div>
                  </div>
                </div>
                <div className="surface-card-inset p-3 flex items-center gap-3">
                  <Rocket className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">Founded</div>
                    <div className="text-xs text-muted-foreground">2024 — backed by leading venture capital</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-label text-primary mb-3">Journey</div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Our milestones</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-0">
            {milestones.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex gap-4 pb-8 relative">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary shrink-0 mt-1.5" />
                  {i < milestones.length - 1 && <div className="w-px flex-1 bg-border" />}
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-primary">{m.year}</div>
                  <div className="text-sm text-foreground">{m.event}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-label text-accent mb-3">Leadership</div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Meet the team</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
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
              <p className="text-muted-foreground mb-6 text-sm">Join 50,000+ professionals building their dream careers with AI.</p>
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
          <p>© 2026 SkillAura PathFinder AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

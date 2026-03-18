import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, Target, Brain, TrendingUp, Shield, Award, ChevronRight, Swords, Map, BarChart3, Users, Eye, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

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

const testimonials = [
  { name: "Ananya R.", role: "Data Scientist at Google", quote: "SkillAura turned my scattered learning into a clear career path. Went from Rank E to B in 3 months!" },
  { name: "Vikram S.", role: "Full Stack Developer", quote: "The quest system is addictive. I've completed 200+ quests and landed my dream job." },
  { name: "Priya M.", role: "AI Engineer at Meta", quote: "The AI Mentor feature is incredible. It's like having a senior engineer guiding you 24/7." },
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
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
            <button onClick={() => navigate("/about")} className="hover:text-foreground transition-colors">About</button>
            <button onClick={() => navigate("/pricing")} className="hover:text-foreground transition-colors">Pricing</button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="text-muted-foreground hover:text-foreground">
              Login
            </Button>
            <Button onClick={() => navigate("/signup")} size="sm" className="gradient-primary text-foreground border-0">
              Get Started <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero with Background Image */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
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
                onClick={() => navigate("/signup")}
                size="lg"
                className="gradient-primary text-foreground border-0 text-base px-8 h-12 glow-blue"
              >
                Initiate Career Scan <Zap className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/about")}
                className="border-border text-foreground hover:bg-secondary h-12 px-8 text-base"
              >
                Learn More
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

      {/* Testimonials */}
      <section id="testimonials" className="py-24 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-label text-accent mb-3">Player Feedback</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              What our players are saying
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="surface-card-inset p-6"
              >
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xs font-bold text-foreground">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => navigate("/about")}
              className="surface-interactive p-6 cursor-pointer group"
            >
              <Building2 className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-base font-semibold text-foreground mb-1">About Us</h3>
              <p className="text-xs text-muted-foreground">Our story, team, vision and company details.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              onClick={() => navigate("/about")}
              className="surface-interactive p-6 cursor-pointer group"
            >
              <Eye className="h-8 w-8 text-accent mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-base font-semibold text-foreground mb-1">Our Vision</h3>
              <p className="text-xs text-muted-foreground">Building the future of AI-powered career intelligence.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onClick={() => navigate("/pricing")}
              className="surface-interactive p-6 cursor-pointer group"
            >
              <Zap className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-base font-semibold text-foreground mb-1">Pricing</h3>
              <p className="text-xs text-muted-foreground">Free and premium plans for every career stage.</p>
            </motion.div>
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
                onClick={() => navigate("/signup")}
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
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/favicon.png" alt="SkillAura PathFinder AI" className="h-6 w-6" />
                <span className="font-bold text-foreground">SkillAura PathFinder AI</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                AI-powered career operating system. Gamify your professional growth.
              </p>
            </div>
            <div>
              <div className="text-label mb-3">Product</div>
              <div className="space-y-2">
                <button onClick={() => navigate("/#features")} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Features</button>
                <button onClick={() => navigate("/pricing")} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</button>
                <button onClick={() => navigate("/signup")} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Get Started</button>
              </div>
            </div>
            <div>
              <div className="text-label mb-3">Company</div>
              <div className="space-y-2">
                <button onClick={() => navigate("/about")} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">About</button>
                <button onClick={() => navigate("/about")} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Vision</button>
                <button onClick={() => navigate("/about")} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Team</button>
              </div>
            </div>
            <div>
              <div className="text-label mb-3">Legal</div>
              <div className="space-y-2">
                <span className="block text-sm text-muted-foreground">Privacy Policy</span>
                <span className="block text-sm text-muted-foreground">Terms of Service</span>
                <span className="block text-sm text-muted-foreground">Contact</span>
              </div>
            </div>
          </div>
          <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026 SkillAura PathFinder AI. All rights reserved.</p>
            <p className="text-xs">Built with ❤️ by the SkillAura team</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

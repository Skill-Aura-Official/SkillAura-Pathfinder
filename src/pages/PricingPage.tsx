import { motion } from "framer-motion";
import { Check, Zap, Crown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    features: ["Resume analysis", "3 daily quests", "Basic career matches", "Skill heatmap", "Leaderboard access"],
    cta: "Current Plan",
    active: true,
  },
  {
    name: "Premium",
    price: "₹199",
    period: "/month",
    features: ["Unlimited quests", "AI Career Twin simulation", "AI Mentor chatbot", "Advanced analytics", "Salary predictions", "Boss quest access", "Priority support"],
    cta: "Upgrade Now",
    highlight: true,
  },
];

const questPacks = [
  { title: "Machine Learning Master Pack", desc: "10 advanced ML quests + Boss Battle", price: "₹99", xp: "3,500 XP" },
  { title: "Full Stack Challenge Pack", desc: "8 full-stack project quests", price: "₹79", xp: "2,800 XP" },
  { title: "System Design Pack", desc: "6 system design quests + interview prep", price: "₹129", xp: "4,000 XP" },
];

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/favicon.png" alt="SkillAura PathFinder AI" className="h-8 w-8" />
            <span className="text-lg font-bold tracking-tight text-foreground">SkillAura <span className="text-primary">PathFinder</span></span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">Level Up Your Plan</h1>
          <p className="text-muted-foreground">Choose the plan that matches your career ambition.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`surface-card-inset p-6 ${plan.highlight ? "ring-2 ring-primary" : ""}`}>
              {plan.highlight && <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Crown className="h-3 w-3" />RECOMMENDED</div>}
              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <div className="mt-2 mb-4"><span className="text-3xl font-bold font-mono text-foreground">{plan.price}</span><span className="text-sm text-muted-foreground">{plan.period}</span></div>
              <ul className="space-y-2 mb-6">
                {plan.features.map(f => <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 text-rank-c" />{f}</li>)}
              </ul>
              <Button className={`w-full ${plan.highlight ? "gradient-primary text-foreground border-0 glow-blue" : "bg-secondary text-foreground border-border"}`} disabled={plan.active}>
                {plan.cta} {plan.highlight && <ChevronRight className="ml-1 h-4 w-4" />}
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-6">Quest Marketplace</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {questPacks.map(qp => (
              <div key={qp.title} className="surface-card-inset p-4">
                <h4 className="text-sm font-semibold text-foreground mb-1">{qp.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{qp.desc}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold font-mono text-foreground">{qp.price}</span>
                  <span className="text-xs font-mono text-xp">{qp.xp}</span>
                </div>
                <Button size="sm" variant="outline" className="w-full border-border h-8 text-xs">Purchase</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

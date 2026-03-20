import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function CareerGPS() {
  const { user } = useAuth();
  const [steps, setSteps] = useState<{ label: string; status: "done" | "current" | "locked" }[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("user_skills").select("level, skill:skills(name)").eq("user_id", user.id).then(({ data }) => {
      if (data && data.length > 0) {
        const mapped = (data as any[])
          .sort((a: any, b: any) => b.level - a.level)
          .map((s: any) => ({
            label: s.skill?.name || "Unknown",
            status: s.level >= 5 ? "done" as const : s.level >= 2 ? "current" as const : "locked" as const,
          }));
        setSteps(mapped.slice(0, 6));
      }
    });
  }, [user]);

  const completed = steps.filter(s => s.status === "done").length;
  const total = steps.length || 1;

  return (
    <div className="surface-card-inset p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-label">Career GPS</div>
        <div className="text-xs font-mono text-primary">{Math.round((completed / total) * 100)}%</div>
      </div>
      {steps.length > 0 ? (
        <div className="space-y-0">
          {steps.map((step, i) => (
            <motion.div key={step.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-3 py-2">
              <div className="flex flex-col items-center">
                {step.status === "done" ? <CheckCircle2 className="h-4 w-4 text-rank-c" /> : step.status === "current" ? <Circle className="h-4 w-4 text-primary animate-pulse" /> : <Lock className="h-4 w-4 text-muted-foreground/40" />}
                {i < steps.length - 1 && <div className={`w-px h-4 mt-1 ${step.status === "done" ? "bg-rank-c/30" : "bg-border"}`} />}
              </div>
              <span className={`text-sm ${step.status === "done" ? "text-muted-foreground line-through" : step.status === "current" ? "text-foreground font-medium" : "text-muted-foreground/40"}`}>{step.label}</span>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-4">Complete onboarding to see your career path.</p>
      )}
    </div>
  );
}

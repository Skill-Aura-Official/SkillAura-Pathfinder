import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lock } from "lucide-react";

const steps = [
  { label: "Python Fundamentals", status: "done" as const },
  { label: "Data Analysis", status: "done" as const },
  { label: "Machine Learning Basics", status: "current" as const },
  { label: "Portfolio Projects", status: "locked" as const },
  { label: "Internship", status: "locked" as const },
  { label: "Data Scientist", status: "locked" as const },
];

export default function CareerGPS() {
  return (
    <div className="surface-card-inset p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-label">Career GPS</div>
        <div className="text-xs font-mono text-primary">33% Complete</div>
      </div>
      <div className="space-y-0">
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 py-2"
          >
            <div className="flex flex-col items-center">
              {step.status === "done" ? (
                <CheckCircle2 className="h-4 w-4 text-rank-c" />
              ) : step.status === "current" ? (
                <Circle className="h-4 w-4 text-primary animate-pulse-glow" />
              ) : (
                <Lock className="h-4 w-4 text-muted-foreground/40" />
              )}
              {i < steps.length - 1 && (
                <div className={`w-px h-4 mt-1 ${step.status === "done" ? "bg-rank-c/30" : "bg-border"}`} />
              )}
            </div>
            <span className={`text-sm ${step.status === "done" ? "text-muted-foreground line-through" : step.status === "current" ? "text-foreground font-medium" : "text-muted-foreground/40"}`}>
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

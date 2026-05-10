import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}

export default function PageHeader({ eyebrow, title, description, icon, actions, children }: PageHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mb-6 md:mb-8"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && <div className="text-label text-primary mb-2 flex items-center gap-2">{icon}{eyebrow}</div>}
          <h1 className="text-display text-3xl md:text-4xl text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
      {children}
    </motion.header>
  );
}

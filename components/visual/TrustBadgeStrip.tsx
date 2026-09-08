"use client";

import { motion } from "framer-motion";
import { Shield, Globe, CheckCircle2, Lock } from "lucide-react";

const badges = [
  { icon: Shield, label: "SOC 2-Aligned Controls" },
  { icon: Lock, label: "PIPEDA Canadian Sovereignty" },
  { icon: CheckCircle2, label: "Zero-Trust Architecture" },
  { icon: Globe, label: "Deterministic SLA Gates" },
];

export function TrustBadgeStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4">
      {badges.map((badge, i) => (
        <motion.div
          key={badge.label}
          className="flex items-center gap-2 border-2 border-border bg-card px-3.5 py-1.5 font-mono text-xs font-bold uppercase text-foreground shadow-[2px_2px_0px_0px_hsl(var(--text))] hover:border-primary transition-colors"
          initial={{ y: 8, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
        >
          <badge.icon className="h-3.5 w-3.5 text-primary" />
          <span>{badge.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

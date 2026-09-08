"use client";

import { motion } from "framer-motion";
import { Cpu, ShieldCheck, Database, FileCheck, Layers } from "lucide-react";

const ORBIT_NODES = [
  { label: "01. INGEST", icon: Database, delay: 0.1 },
  { label: "02. MODEL", icon: Cpu, delay: 0.2 },
  { label: "03. GUARD", icon: ShieldCheck, delay: 0.3 },
  { label: "04. AUDIT", icon: FileCheck, delay: 0.4 },
];

export function HeroIllustration() {
  return (
    <div className="hud-panel relative overflow-hidden border-2 border-border bg-card p-6 shadow-[4px_4px_0px_0px_hsl(var(--text))]">
      <div className="flex items-center justify-between border-b-2 border-border pb-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
            Deterministic Automation Engine Architecture
          </span>
        </div>
        <span className="font-mono text-[10px] font-bold uppercase border border-primary/40 px-2 py-0.5 bg-primary/10 text-primary">
          Core Bus
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ORBIT_NODES.map((node) => {
          const Icon = node.icon;
          return (
            <motion.div
              key={node.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: node.delay, duration: 0.3 }}
              className="flex flex-col items-center justify-center p-4 border-2 border-border bg-background hover:border-primary text-center group transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center border border-border bg-muted/40 text-primary group-hover:border-primary group-hover:bg-primary/10 transition-colors mb-2">
                <Icon className="h-5 w-5" />
              </div>
              <span className="font-mono text-xs font-black uppercase text-foreground">
                {node.label}
              </span>
              <span className="mt-1 font-mono text-[10px] text-muted-foreground">
                Policy Gated
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
        <span>Zero Unchecked LLM Actions</span>
        <span className="text-primary font-bold">100% Policy Intercept Coverage</span>
      </div>
    </div>
  );
}

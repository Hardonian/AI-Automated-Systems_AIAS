"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Diagnostic Audit",
    desc: "Map value streams, failure modes, and decision boundaries.",
    artifact: "Clear Architecture Brief",
  },
  {
    num: "02",
    title: "Contract Mapping",
    desc: "Lock strict Zod schemas, error budgets, and PIPEDA boundaries.",
    artifact: "Schema Contracts Spec",
  },
  {
    num: "03",
    title: "Deterministic Build",
    desc: "Construct policy gates, state-machine controllers, and retry logic.",
    artifact: "Auditable Runbook Fabric",
  },
  {
    num: "04",
    title: "Governed Rollout",
    desc: "Canary deployment with automated circuit-breakers and rollback.",
    artifact: "Production Signoff Receipt",
  },
  {
    num: "05",
    title: "Continuous Observability",
    desc: "Immutable telemetry ledger and human-in-the-loop escalation.",
    artifact: "Live SLA Dashboard",
  },
];

export function ProcessStepsVisual() {
  return (
    <div className="border-2 border-border bg-card p-6 shadow-[4px_4px_0px_0px_hsl(var(--text))]">
      <div className="flex items-center justify-between border-b-2 border-border pb-3 mb-6">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
          Delivery Lifecycle // Step-by-Step
        </h3>
        <span className="font-mono text-[10px] font-bold uppercase border border-primary/40 px-2 py-0.5 bg-primary/10 text-primary">
          Governance-First
        </span>
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-2 border-border bg-background p-3.5 transition-all hover:border-primary group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-border bg-black text-xs font-mono font-black text-primary group-hover:border-primary">
                {step.num}
              </div>
              <div>
                <p className="font-mono text-xs font-bold uppercase text-foreground">
                  {step.title}
                </p>
                <p className="text-[11px] font-mono text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-center font-mono text-[10px] text-muted-foreground border border-border px-2 py-0.5 bg-muted/30">
              <CheckCircle2 className="h-3 w-3 text-primary" />
              <span>{step.artifact}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

interface WorkflowStep {
  id: string;
  name: string;
  type: "Deterministic" | "Constrained AI" | "Policy Gate";
  desc: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  { id: "01", name: "Input Contract", type: "Deterministic", desc: "Zod validation" },
  { id: "02", name: "Model Extract", type: "Constrained AI", desc: "Zero-temp inference" },
  { id: "03", name: "Policy Verify", type: "Policy Gate", desc: "Math & PII guardrails" },
  { id: "04", name: "Runbook Post", type: "Deterministic", desc: "Signed audit receipt" },
];

export function WorkflowDiagram() {
  return (
    <div className="border-2 border-border bg-card p-6 shadow-[4px_4px_0px_0px_hsl(var(--text))]">
      <div className="flex items-center justify-between border-b-2 border-border pb-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
            Deterministic Workflow Topology
          </span>
        </div>
        <span className="font-mono text-[10px] font-bold uppercase text-primary border border-primary/40 px-2 py-0.5 bg-primary/10">
          State Machine
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WORKFLOW_STEPS.map((step, idx) => (
          <div
            key={step.id}
            className="relative flex flex-col justify-between border-2 border-border bg-background p-4 transition-all hover:border-primary"
          >
            <div>
              <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-2">
                <span className="font-mono text-xs font-black text-primary">
                  {step.id}
                </span>
                <span className="font-mono text-[10px] uppercase text-muted-foreground">
                  {step.type}
                </span>
              </div>
              <h4 className="font-mono text-sm font-bold uppercase text-foreground">
                {step.name}
              </h4>
              <p className="mt-1 text-xs font-mono text-muted-foreground">
                {step.desc}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-1.5 pt-2 border-t border-border/40 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              <span>Gated Transition</span>
            </div>

            {idx < WORKFLOW_STEPS.length - 1 && (
              <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                <span className="flex h-5 w-5 items-center justify-center border border-border bg-card text-muted-foreground">
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

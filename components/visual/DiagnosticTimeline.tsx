"use client";

import { CheckCircle2 } from "lucide-react";

const phases = [
  {
    code: "PHASE_01",
    name: "Diagnose",
    detail: "Capture current state, bottlenecks, error budgets, and failure modes.",
  },
  {
    code: "PHASE_02",
    name: "Design",
    detail: "Define boundaries between deterministic logic and constrained AI assistance.",
  },
  {
    code: "PHASE_03",
    name: "Deploy",
    detail: "Ship a scoped production pilot with strict QA gates and live telemetry.",
  },
  {
    code: "PHASE_04",
    name: "De-risk",
    detail: "Run monitored rollout with incident, exception, and rollback playbooks.",
  },
];

export function DiagnosticTimeline() {
  return (
    <div className="space-y-4 font-mono">
      {phases.map((phase) => (
        <div
          key={phase.name}
          className="flex items-start gap-3 border-2 border-border bg-card p-4 transition-all hover:border-primary"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-primary bg-primary/10 text-xs font-black text-primary mt-0.5">
            {phase.code.split("_")[1]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary uppercase">
                [{phase.code}]
              </span>
              <h4 className="text-sm font-black uppercase text-foreground">
                {phase.name}
              </h4>
            </div>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {phase.detail}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

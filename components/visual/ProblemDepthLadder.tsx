"use client";

import { AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";

const levels = [
  {
    code: "LVL_01",
    level: "Surface Friction",
    issue: "Manual rework and duplicate data entry across disjointed SaaS tools.",
    severity: "Operational Drag",
  },
  {
    code: "LVL_02",
    level: "System Brittleness",
    issue: "Disconnected APIs and fragile webhook handoffs that break silently without alarms.",
    severity: "Data Inconsistency",
  },
  {
    code: "LVL_03",
    level: "Control Void",
    issue: "No deterministic checkpoints, validation bounds, or mathematical variance gates.",
    severity: "Financial & Risk Exposure",
  },
  {
    code: "LVL_04",
    level: "Strategic Governance",
    issue: "AI agents deployed without clear escalation runbooks, audit ledgers, or human ownership.",
    severity: "Production Catastrophe",
  },
];

export function ProblemDepthLadder() {
  return (
    <div className="border-2 border-border bg-card p-6 shadow-[4px_4px_0px_0px_hsl(var(--text))]">
      <div className="flex items-center justify-between border-b-2 border-border pb-3 mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-primary" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
            Operational Failure Depth Ladder
          </h3>
        </div>
        <span className="font-mono text-[10px] font-bold uppercase border border-border px-2 py-0.5 bg-muted/40">
          Root Cause Analysis
        </span>
      </div>

      <div className="space-y-3">
        {levels.map((item) => (
          <div
            key={item.code}
            className="border-2 border-border bg-background p-4 transition-all hover:border-primary group"
          >
            <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2">
              <span className="font-mono text-xs font-black text-primary">
                [{item.code}] {item.level}
              </span>
              <span className="font-mono text-[10px] font-bold uppercase text-destructive border border-destructive/30 bg-destructive/5 px-1.5 py-0.2">
                {item.severity}
              </span>
            </div>
            <p className="text-xs font-mono text-muted-foreground leading-relaxed">
              {item.issue}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

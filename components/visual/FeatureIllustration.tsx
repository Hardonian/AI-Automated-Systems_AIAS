"use client";

import { motion } from "framer-motion";
import { Cpu, ShieldCheck, Database, GitBranch } from "lucide-react";

interface FeatureIllustrationProps {
  type: "agents" | "automation" | "security" | "integration";
  className?: string;
}

export function FeatureIllustration({
  type,
  className = "",
}: FeatureIllustrationProps) {
  const illustrations = {
    agents: (
      <div className="flex h-full w-full flex-col justify-between border-2 border-border bg-background p-4">
        <div className="flex items-center justify-between border-b border-border/50 pb-2">
          <span className="font-mono text-[10px] font-bold uppercase text-primary">
            Agentic Orchestration
          </span>
          <Cpu className="h-4 w-4 text-primary" />
        </div>
        <div className="my-2 space-y-1 font-mono text-[11px] text-muted-foreground">
          <div className="flex justify-between">
            <span>Context Clamp:</span>
            <span className="font-bold text-foreground">Active</span>
          </div>
          <div className="flex justify-between">
            <span>Temperature:</span>
            <span className="font-bold text-foreground">0.0 (Deterministic)</span>
          </div>
        </div>
        <div className="border-t border-border/40 pt-2 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
          ✓ Structured JSON Output Enforced
        </div>
      </div>
    ),
    automation: (
      <div className="flex h-full w-full flex-col justify-between border-2 border-border bg-background p-4">
        <div className="flex items-center justify-between border-b border-border/50 pb-2">
          <span className="font-mono text-[10px] font-bold uppercase text-primary">
            Pipeline Execution
          </span>
          <Database className="h-4 w-4 text-primary" />
        </div>
        <div className="my-2 space-y-1 font-mono text-[11px] text-muted-foreground">
          <div className="flex justify-between">
            <span>Latency (P95):</span>
            <span className="font-bold text-foreground">142ms</span>
          </div>
          <div className="flex justify-between">
            <span>Circuit Breaker:</span>
            <span className="font-bold text-foreground">Enabled</span>
          </div>
        </div>
        <div className="border-t border-border/40 pt-2 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
          ✓ Automated Retry & Dead-Letter Queue
        </div>
      </div>
    ),
    security: (
      <div className="flex h-full w-full flex-col justify-between border-2 border-border bg-background p-4">
        <div className="flex items-center justify-between border-b border-border/50 pb-2">
          <span className="font-mono text-[10px] font-bold uppercase text-primary">
            Governance Gate
          </span>
          <ShieldCheck className="h-4 w-4 text-primary" />
        </div>
        <div className="my-2 space-y-1 font-mono text-[11px] text-muted-foreground">
          <div className="flex justify-between">
            <span>Data Boundary:</span>
            <span className="font-bold text-foreground">Canadian / PIPEDA</span>
          </div>
          <div className="flex justify-between">
            <span>Entropy Scan:</span>
            <span className="font-bold text-foreground">0 PII Leakage</span>
          </div>
        </div>
        <div className="border-t border-border/40 pt-2 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
          ✓ Cryptographic Audit Receipt
        </div>
      </div>
    ),
    integration: (
      <div className="flex h-full w-full flex-col justify-between border-2 border-border bg-background p-4">
        <div className="flex items-center justify-between border-b border-border/50 pb-2">
          <span className="font-mono text-[10px] font-bold uppercase text-primary">
            System Connectors
          </span>
          <GitBranch className="h-4 w-4 text-primary" />
        </div>
        <div className="my-2 space-y-1 font-mono text-[11px] text-muted-foreground">
          <div className="flex justify-between">
            <span>Contracts:</span>
            <span className="font-bold text-foreground">Strict Zod Schemas</span>
          </div>
          <div className="flex justify-between">
            <span>Handoff:</span>
            <span className="font-bold text-foreground">Human-in-the-Loop</span>
          </div>
        </div>
        <div className="border-t border-border/40 pt-2 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
          ✓ Bi-directional Webhook Dispatch
        </div>
      </div>
    ),
  };

  return (
    <div className={`h-36 w-full ${className}`}>{illustrations[type]}</div>
  );
}

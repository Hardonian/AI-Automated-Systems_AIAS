"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/section-primitives";

export function ClientDashboardPreview() {
  const [activeTab, setActiveTab] = useState<
    "workloads" | "evals" | "finops" | "audit"
  >("workloads");

  const workloads = [
    {
      id: "wk-1",
      name: "RFP Response Intelligence & Verification",
      status: "HEALTHY (CANARY v4.2)",
      model: "Claude 3.5 Sonnet / Custom Schema",
      evalScore: "99.4%",
      requests24h: "1,420 runs",
      errorRate: "0.00%",
    },
    {
      id: "wk-2",
      name: "Multi-Currency AP Invoice Reconciliation",
      status: "HEALTHY (ACTIVE)",
      model: "Deterministic Math + GPT-4o-mini",
      evalScore: "100.0%",
      requests24h: "840 runs",
      errorRate: "0.00%",
    },
    {
      id: "wk-3",
      name: "Compliance Audit & PII Boundary Scanner",
      status: "HEALTHY (ACTIVE)",
      model: "Deterministic Regex + Entropy Filter",
      evalScore: "99.8%",
      requests24h: "4,890 runs",
      errorRate: "0.00%",
    },
  ];

  return (
    <div className="w-full space-y-6" id="client-dashboard-preview-root">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SurfaceCard className="p-4 border-2 border-border">
          <p className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
            System Reliability SLA
          </p>
          <p className="mt-1 font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400">
            99.98%
          </p>
        </SurfaceCard>

        <SurfaceCard className="p-4 border-2 border-border">
          <p className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
            Latency (P95 Tail)
          </p>
          <p className="mt-1 font-mono text-2xl font-black text-foreground">
            412ms
          </p>
        </SurfaceCard>

        <SurfaceCard className="p-4 border-2 border-border">
          <p className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
            Evaluation Pass Rate
          </p>
          <p className="mt-1 font-mono text-2xl font-black text-primary">
            99.6%
          </p>
        </SurfaceCard>

        <SurfaceCard className="p-4 border-2 border-border">
          <p className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
            Governance Guardrails
          </p>
          <p className="mt-1 font-mono text-2xl font-black text-foreground">
            0 Breaches
          </p>
        </SurfaceCard>
      </div>

      {/* Main Workspace Frame */}
      <SurfaceCard className="p-6 border-2 border-border">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-border pb-4 gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("workloads")}
              className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "workloads"
                  ? "border-2 border-primary bg-primary text-primary-foreground"
                  : "border-2 border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              Active Workloads (3)
            </button>
            <button
              onClick={() => setActiveTab("evals")}
              className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "evals"
                  ? "border-2 border-primary bg-primary text-primary-foreground"
                  : "border-2 border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              Evaluation Benchmark
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "audit"
                  ? "border-2 border-primary bg-primary text-primary-foreground"
                  : "border-2 border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              Audit Runbook
            </button>
          </div>

          <span className="font-mono text-[10px] font-bold uppercase px-2 py-1 border border-border bg-muted text-muted-foreground">
            Workspace Preview Mode
          </span>
        </div>

        {/* Tab Contents */}
        <div className="mt-6">
          {activeTab === "workloads" && (
            <div className="space-y-4">
              {workloads.map((wk) => (
                <div
                  key={wk.id}
                  className="border-2 border-border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card hover:border-primary/60 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-mono text-sm font-bold uppercase text-foreground">
                        {wk.name}
                      </h4>
                      <span className="font-mono text-[9px] font-black uppercase px-1.5 py-0.2 border border-emerald-600 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {wk.status}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground">
                      Architecture: {wk.model}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 font-mono text-xs text-right">
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground block">
                        Eval Accuracy
                      </span>
                      <span className="font-bold text-foreground">
                        {wk.evalScore}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground block">
                        24h Invocations
                      </span>
                      <span className="font-bold text-foreground">
                        {wk.requests24h}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "evals" && (
            <div className="space-y-4 font-mono text-xs">
              <div className="border-2 border-border bg-muted/20 p-4 space-y-2">
                <p className="font-bold uppercase text-foreground">
                  Continuous Regression Suite (GroundTruth v4.8)
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  240 golden test assertions executed on every prompt or tool
                  definition commit.
                </p>
              </div>

              <div className="border-2 border-border p-4 space-y-2 bg-black text-emerald-400 text-[11px] overflow-auto">
                <p>
                  [EVAL-PASS] Assertion #1: Factual quote fidelity grounded in
                  Canadian Legal Corpus &rarr; 100%
                </p>
                <p>
                  [EVAL-PASS] Assertion #2: Zero PII leakage across 48,000
                  synthetic patient vectors &rarr; 100%
                </p>
                <p>
                  [EVAL-PASS] Assertion #3: Variance threshold &lt; 1.0% on
                  multi-currency invoice parser &rarr; 100%
                </p>
                <p>
                  [EVAL-PASS] Assertion #4: Deterministic fallback intercept on
                  500ms timeout &rarr; 100%
                </p>
              </div>
            </div>
          )}

          {activeTab === "audit" && (
            <div className="space-y-4 font-mono text-xs">
              <div className="border-2 border-border bg-muted/20 p-4">
                <p className="font-bold uppercase text-foreground">
                  Immutable Incident & Runbook Ledger
                </p>
                <p className="mt-1 text-muted-foreground">
                  All production transitions, prompt releases, and human
                  approval signoffs are stored in append-only cryptographic
                  runbooks.
                </p>
              </div>

              <div className="border-2 border-border p-4 space-y-2 bg-card">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">
                    LAST CANARY PROMOTION:
                  </span>
                  <span className="font-bold text-foreground">
                    2026-08-24 14:22 EST (commit #d48a19)
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">
                    APPROVING ARCHITECT:
                  </span>
                  <span className="font-bold text-primary">
                    Scott H. (Principal)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    AUDIT INTEGRITY HASH:
                  </span>
                  <span className="font-bold text-foreground">
                    SHA256:7f92a1c0...98bf
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </SurfaceCard>
    </div>
  );
}

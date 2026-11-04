"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Send,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/section-primitives";
import {
  analyzeWorkspaceBrief,
  appendWorkspaceNotes,
  DEFAULT_WORKSPACE_TEMPLATE,
  generateSHA256Receipt,
  readWorkspaceNotes,
  useBroadcastChannel,
} from "@/lib/utils/client-engines";

export function ClientDashboardPreview() {
  const [activeTab, setActiveTab] = useState<
    "workloads" | "evals" | "finops" | "audit"
  >("workloads");
  const [canaryRolledBack, setCanaryRolledBack] = useState(false);
  const [evalRunDigest, setEvalRunDigest] = useState<string | null>(null);
  const [isRunningEval, setIsRunningEval] = useState(false);
  const [syncedToWorkspace, setSyncedToWorkspace] = useState(false);
  const [workspaceNotes, setWorkspaceNotes] = useState<string>("");

  const onRemoteWorkspace = useCallback((msg: { notes: string }) => {
    if (msg && typeof msg.notes === "string") {
      setWorkspaceNotes(msg.notes);
    }
  }, []);
  const { postMessage: postWorkspaceMessage } = useBroadcastChannel<{
    notes: string;
  }>("aias-workspace", onRemoteWorkspace);

  useEffect(() => {
    const current = readWorkspaceNotes();
    if (current && current !== DEFAULT_WORKSPACE_TEMPLATE) {
      queueMicrotask(() => setWorkspaceNotes(current));
    }
  }, []);

  const briefAudit = useMemo(
    () => (workspaceNotes ? analyzeWorkspaceBrief(workspaceNotes) : null),
    [workspaceNotes],
  );

  const handleRunEvalSuite = async () => {
    setIsRunningEval(true);
    const receipt = await generateSHA256Receipt(
      `GroundTruth-v4.8::240-vectors::${canaryRolledBack ? "rollback-verified" : "canary-v4.2"}`,
    );
    setEvalRunDigest(receipt.hash);
    setIsRunningEval(false);
  };

  const handleSyncDashboardToWorkspace = () => {
    const block = [
      "## Control-Plane & Canary Telemetry Snapshot",
      `- System Reliability Target: 99.98% | Tail P95 Latency: ${canaryRolledBack ? "388ms (Post-Rollback Stable)" : "412ms"}`,
      `- Active Canary State: ${canaryRolledBack ? "Auto-Rolled Back to Stable Tag #d48a19 (Zero Hard-500s)" : "HEALTHY (CANARY v4.2)"}`,
      `- Continuous Regression Suite: 240/240 assertions passed${evalRunDigest ? ` (SHA-256: \`${evalRunDigest.slice(0, 16)}…\`)` : ""}`,
      `- FinOps Loop Ceiling: Hard step cap (maxSteps <= 4) · 78% deterministic cache hit rate`,
    ].join("\n");
    const nextNotes = appendWorkspaceNotes(block);
    setWorkspaceNotes(nextNotes);
    postWorkspaceMessage({ notes: nextNotes });
    setSyncedToWorkspace(true);
    setTimeout(() => setSyncedToWorkspace(false), 2500);
  };

  const workloads = [
    {
      id: "wk-1",
      name: "RFP Response Intelligence & Verification",
      status: canaryRolledBack
        ? "ROLLED BACK TO STABLE v4.1 (CIRCUIT TRIPPED)"
        : "HEALTHY (CANARY v4.2)",
      model: "Claude 3.5 Sonnet / Custom Schema",
      evalScore: canaryRolledBack ? "100.0%" : "99.4%",
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
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("workloads")}
              className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "workloads"
                  ? "border-2 border-primary bg-primary text-primary-foreground"
                  : "border-2 border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              Active Workloads ({briefAudit ? 4 : 3})
            </button>
            <button
              type="button"
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
              type="button"
              onClick={() => setActiveTab("finops")}
              className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "finops"
                  ? "border-2 border-primary bg-primary text-primary-foreground"
                  : "border-2 border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              FinOps &amp; Capacity
            </button>
            <button
              type="button"
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

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setCanaryRolledBack((prev) => !prev)}
              className="h-7 rounded-none border-border font-mono text-[10px] font-bold uppercase"
            >
              {canaryRolledBack ? (
                <>
                  <RotateCcw className="mr-1 h-3 w-3 text-emerald-400" />
                  Restore Canary v4.2
                </>
              ) : (
                <>
                  <Zap className="mr-1 h-3 w-3 text-amber-400" />
                  Simulate Canary Fault
                </>
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleSyncDashboardToWorkspace}
              className="h-7 rounded-none border-border font-mono text-[10px] font-bold uppercase"
            >
              <Send className="mr-1 h-3 w-3" />
              {syncedToWorkspace ? "Synced ✓" : "Sync to Console"}
            </Button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="mt-6">
          {activeTab === "workloads" && (
            <div className="space-y-4">
              {briefAudit && (
                <div className="border-2 border-primary bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h4 className="font-mono text-sm font-bold uppercase text-foreground">
                        Custom Session Architecture Brief (Live Local Sync)
                      </h4>
                      <span className="font-mono text-[9px] font-black uppercase px-1.5 py-0.5 border border-primary bg-primary/10 text-primary">
                        GRADE {briefAudit.grade} ({briefAudit.score}% READINESS)
                      </span>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground">
                      {briefAudit.presentPillars.length}/5 Core Pillars ·{" "}
                      {briefAudit.detectedGates} Guardrail Tokens ·{" "}
                      {briefAudit.wordCount} words in local vault
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="rounded-none border-primary/50 font-mono text-[10px] font-bold uppercase text-primary"
                    >
                      <Link href="/tools#workspace-title">
                        Inspect in Console{" "}
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {workloads.map((wk) => (
                <div
                  key={wk.id}
                  className="border-2 border-border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card hover:border-primary/60 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-mono text-sm font-bold uppercase text-foreground">
                        {wk.name}
                      </h4>
                      <span
                        className={`font-mono text-[9px] font-black uppercase px-1.5 py-0.2 border ${
                          wk.id === "wk-1" && canaryRolledBack
                            ? "border-amber-500 bg-amber-500/10 text-amber-400"
                            : "border-emerald-600 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
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
              <div className="border-2 border-border bg-muted/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-bold uppercase text-foreground">
                    Continuous Regression Suite (GroundTruth v4.8)
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    240 golden test assertions executed on every prompt or tool
                    definition commit.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleRunEvalSuite}
                  disabled={isRunningEval}
                  className="rounded-none font-mono text-[10px] font-bold uppercase shrink-0"
                >
                  <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                  {isRunningEval
                    ? "Running Assertions…"
                    : "Re-Verify 240 Assertions"}
                </Button>
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
                {evalRunDigest && (
                  <p className="pt-2 border-t border-emerald-500/30 text-cyan-400">
                    [WEB-CRYPTO-VERIFIED] Signed Runbook Digest: {evalRunDigest}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "finops" && (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="border-2 border-border bg-background p-4">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">
                    Deterministic Cache Hit Ratio
                  </p>
                  <p className="mt-1 text-2xl font-black text-emerald-400">
                    78.4%
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Handled by pre-inference Zod &amp; rule tables
                  </p>
                </div>
                <div className="border-2 border-border bg-background p-4">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">
                    Loop-Breaker Step Ceiling
                  </p>
                  <p className="mt-1 text-2xl font-black text-primary">
                    maxSteps &le; 4
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    0 recursive runaway loops in 30-day window
                  </p>
                </div>
                <div className="border-2 border-border bg-background p-4">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">
                    Dead-Letter Replay Recovery
                  </p>
                  <p className="mt-1 text-2xl font-black text-foreground">
                    100.0%
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Idempotent UUID ledger prevents duplicate commits
                  </p>
                </div>
              </div>
              <div className="border-2 border-border bg-muted/20 p-4 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    All model invocations are bounded by strict schema contracts
                    and synchronous timeout circuit breakers.
                  </span>
                </span>
                <Link
                  href="/roi-calculator"
                  className="font-bold uppercase text-primary hover:underline shrink-0"
                >
                  Model Capacity ROI &rarr;
                </Link>
              </div>
            </div>
          )}

          {activeTab === "audit" && (
            <div className="space-y-4 font-mono text-xs">
              <div className="border-2 border-border bg-muted/20 p-4">
                <p className="font-bold uppercase text-foreground">
                  Immutable Incident &amp; Runbook Ledger
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
                    {canaryRolledBack
                      ? "AUTO-ROLLBACK TO v4.1 (commit #d48a19)"
                      : "2026-08-24 14:22 EST (commit #d48a19)"}
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
                    {evalRunDigest
                      ? `SHA256:${evalRunDigest.slice(0, 12)}...${evalRunDigest.slice(-4)}`
                      : "SHA256:7f92a1c0...98bf"}
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

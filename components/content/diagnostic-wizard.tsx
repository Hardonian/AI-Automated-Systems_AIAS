"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Download,
  FileCode2,
  FileText,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/section-primitives";

type WorkloadType =
  | "customer-support"
  | "financial-ops"
  | "engineering-automation"
  | "compliance-audit";

type VolumeLevel = "low" | "medium" | "high";
type LatencyTier = "realtime" | "near-realtime" | "async";

type AllocationMode = "deterministic" | "ai" | "hybrid";

interface BoundaryCapability {
  id: string;
  label: string;
  description: string;
  recommended: AllocationMode;
  selected: AllocationMode;
}

const DEFAULT_CAPABILITIES: Omit<BoundaryCapability, "selected">[] = [
  {
    id: "schema-validation",
    label: "Input Parsing & Schema Validation",
    description:
      "Validating structure, types, and required payload constraints.",
    recommended: "deterministic",
  },
  {
    id: "unstructured-synthesis",
    label: "Semantic Understanding & Synthesis",
    description: "Extracting intent, summarization, and contextual reasoning.",
    recommended: "ai",
  },
  {
    id: "authorization-policy",
    label: "Policy Gates & Permission Check",
    description: "Enforcing roles, tenant isolation, and transaction limits.",
    recommended: "deterministic",
  },
  {
    id: "math-calculations",
    label: "Calculations & Financial Math",
    description:
      "Invoicing math, interest rates, ledger entries, and tax rates.",
    recommended: "deterministic",
  },
  {
    id: "customer-messaging",
    label: "Outbound Content Generation",
    description: "Drafting messages, notifications, and tailored replies.",
    recommended: "hybrid",
  },
  {
    id: "audit-receipts",
    label: "Audit Ledger & Receipts",
    description: "Immutable hashing, execution logs, and replay receipts.",
    recommended: "deterministic",
  },
];

const FAILURE_MODES = [
  {
    id: "hallucination",
    label: "Hallucination Risk",
    description:
      "Model outputs plausibly incorrect facts, IDs, or commitments.",
  },
  {
    id: "latency-spike",
    label: "Provider Outages & Latency Spikes",
    description: "Upstream LLM API delays, 504 timeouts, or degraded status.",
  },
  {
    id: "pii-leak",
    label: "PII & Confidential Data Exposure",
    description: "Unsanitized customer records sent to third-party endpoints.",
  },
  {
    id: "budget-runaway",
    label: "Cost & Token Runaway",
    description: "Recursive agent loops or unbudgeted token consumption.",
  },
];

export function DiagnosticWizard() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [workload, setWorkload] = useState<WorkloadType>("financial-ops");
  const [volume, setVolume] = useState<VolumeLevel>("medium");
  const [latency, setLatency] = useState<LatencyTier>("near-realtime");

  const [allocations, setAllocations] = useState<
    Record<string, AllocationMode>
  >(() =>
    Object.fromEntries(
      DEFAULT_CAPABILITIES.map((cap) => [cap.id, cap.recommended]),
    ),
  );

  const [selectedRisks, setSelectedRisks] = useState<string[]>([
    "hallucination",
    "pii-leak",
  ]);

  const [copied, setCopied] = useState(false);
  const formId = useId();

  const toggleRisk = (riskId: string) => {
    setSelectedRisks((prev) =>
      prev.includes(riskId)
        ? prev.filter((r) => r !== riskId)
        : [...prev, riskId],
    );
  };

  const handleAllocationChange = (id: string, mode: AllocationMode) => {
    setAllocations((prev) => ({ ...prev, [id]: mode }));
  };

  // Evaluation algorithm based on deterministic engineering principles
  const evaluation = useMemo(() => {
    let score = 100;

    // Deduct points for high-risk anti-patterns
    if (allocations["math-calculations"] === "ai") score -= 25;
    if (allocations["authorization-policy"] === "ai") score -= 25;
    if (allocations["schema-validation"] === "ai") score -= 15;
    if (allocations["audit-receipts"] === "ai") score -= 20;

    // Bonus for proper boundary pairing
    if (allocations["unstructured-synthesis"] === "ai") score += 5;
    if (allocations["customer-messaging"] === "hybrid") score += 5;

    score = Math.max(20, Math.min(100, score));

    let grade = "A";
    let status = "Production-Ready Boundary Separation";
    let recommendation =
      "Your target architecture demonstrates sound governance with deterministic control over money, policy, and data validity.";
    let track = "Advisory & Co-Build Sprint";

    if (score < 60) {
      grade = "D";
      status = "Critical Fragility: High Probability of Silent Failure";
      recommendation =
        "Core policy or math functions are assigned to probabilistic models. Immediate architectural intervention required to install deterministic guards.";
      track = "Stabilization & Emergency Remediation";
    } else if (score < 80) {
      grade = "B";
      status = "Moderate Fragility: Gaps in Enforcement Layer";
      recommendation =
        "Architecture has reasonable foundations but leaves edge states exposed. Strengthen schema validation and audit immutability.";
      track = "Targeted Governance Hardening";
    }

    return { score, grade, status, recommendation, track };
  }, [allocations]);

  const briefMarkdown = useMemo(() => {
    return [
      "# AIAS Architecture Clarity Diagnostic Brief",
      `*Generated: ${new Date().toISOString()}*`,
      "",
      `## 1. Workload Context`,
      `- **Workload Domain:** ${workload}`,
      `- **Volume Tier:** ${volume}`,
      `- **Latency Target:** ${latency}`,
      "",
      `## 2. Boundary Allocation`,
      ...DEFAULT_CAPABILITIES.map((cap) => {
        const mode = allocations[cap.id] ?? cap.recommended;
        return `- **${cap.label}:** ${mode.toUpperCase()} (Recommended: ${cap.recommended.toUpperCase()})`;
      }),
      "",
      `## 3. High-Priority Failure Modes`,
      ...selectedRisks.map(
        (r) => `- ${FAILURE_MODES.find((item) => item.id === r)?.label ?? r}`,
      ),
      "",
      `## 4. Evaluation Scorecard`,
      `- **Maturity Score:** ${evaluation.score}/100 (Grade ${evaluation.grade})`,
      `- **Posture:** ${evaluation.status}`,
      `- **Recommended Track:** ${evaluation.track}`,
      "",
      `## 5. Architectural Guidance`,
      evaluation.recommendation,
      "",
      "---",
      "*AI Automated Systems (AIAS) · aiautomatedsystems.ca*",
    ].join("\n");
  }, [workload, volume, latency, allocations, selectedRisks, evaluation]);

  const handleDownload = (format: "json" | "md") => {
    const filename = `aias-diagnostic-brief.${format}`;
    let content = "";
    let mime = "";

    if (format === "json") {
      content = JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          workload,
          volume,
          latency,
          allocations,
          selectedRisks,
          evaluation,
        },
        null,
        2,
      );
      mime = "application/json";
    } else {
      content = briefMarkdown;
      mime = "text/markdown";
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const copyBrief = async () => {
    await navigator.clipboard.writeText(briefMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const resetAll = () => {
    setStep(1);
    setAllocations(
      Object.fromEntries(
        DEFAULT_CAPABILITIES.map((cap) => [cap.id, cap.recommended]),
      ),
    );
    setSelectedRisks(["hallucination", "pii-leak"]);
  };

  return (
    <div className="w-full space-y-8" id="diagnostic-wizard-root">
      {/* Top Wizard Steps Header */}
      <div className="border-2 border-border bg-card p-4 sm:p-6 shadow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Interactive Diligence Engine
            </p>
            <h3 className="font-mono text-lg font-black uppercase text-foreground">
              AI Clarity Diagnostic Assessment
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase text-muted-foreground">
              Step {step} of 4
            </span>
            <button
              className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors ml-2"
              onClick={resetAll}
              type="button"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>
        </div>

        {/* Step Indicator Badges */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { s: 1, name: "1. Workload Surface" },
            { s: 2, name: "2. Boundary Map" },
            { s: 3, name: "3. Risk Ceilings" },
            { s: 4, name: "4. Architecture Brief" },
          ].map((item) => (
            <button
              className={`px-3 py-2 text-left font-mono text-xs font-bold uppercase border transition-all ${
                step === item.s
                  ? "border-primary bg-primary/10 text-primary"
                  : step > item.s
                    ? "border-border text-foreground hover:border-primary/50"
                    : "border-border/40 text-muted-foreground/60"
              }`}
              key={item.s}
              onClick={() => setStep(item.s as 1 | 2 | 3 | 4)}
              type="button"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Workload & Operating Pressure */}
      {step === 1 && (
        <SurfaceCard className="border-2 border-border p-6 sm:p-8 space-y-6">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Section 01 // Baseline Requirements
            </span>
            <h4 className="mt-1 font-mono text-xl font-bold uppercase text-foreground">
              Define the Operating Pressure on Your System
            </h4>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Every robust automation architecture begins with explicit
              boundaries around volume, latency budgets, and compliance scope.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label
                className="font-mono text-xs font-bold uppercase block mb-3 text-foreground"
                htmlFor={`${formId}-workload`}
              >
                Workload Domain:
              </label>
              <div
                className="grid sm:grid-cols-2 gap-3"
                id={`${formId}-workload`}
              >
                {[
                  {
                    id: "financial-ops",
                    title: "Financial & Invoicing Ops",
                    desc: "Ledger syncing, invoice reconciliation, budget approvals",
                  },
                  {
                    id: "customer-support",
                    title: "Customer Support & Triage",
                    desc: "Inbound ticket classification, knowledge retrieval, drafting",
                  },
                  {
                    id: "engineering-automation",
                    title: "Engineering & Release Fabric",
                    desc: "CI verification, documentation sync, code review automation",
                  },
                  {
                    id: "compliance-audit",
                    title: "Regulatory & Compliance Audit",
                    desc: "Policy enforcement, audit trail verification, data governance",
                  },
                ].map((item) => (
                  <button
                    className={`p-4 text-left border-2 transition-all ${
                      workload === item.id
                        ? "border-primary bg-primary/5 text-foreground shadow-sm"
                        : "border-border bg-card/50 text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                    key={item.id}
                    onClick={() => setWorkload(item.id as WorkloadType)}
                    type="button"
                  >
                    <div className="font-mono text-xs font-bold uppercase text-foreground flex items-center justify-between">
                      {item.title}
                      {workload === item.id && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-border">
              <div>
                <label className="font-mono text-xs font-bold uppercase block mb-3 text-foreground">
                  Transaction / Request Volume:
                </label>
                <div className="space-y-2">
                  {[
                    { id: "low", title: "Low (< 1,000 requests/day)" },
                    {
                      id: "medium",
                      title: "Medium (1,000 – 50,000 requests/day)",
                    },
                    { id: "high", title: "High (50,000+ requests/day)" },
                  ].map((lvl) => (
                    <button
                      className={`w-full p-3 text-left font-mono text-xs border transition-all ${
                        volume === lvl.id
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                      key={lvl.id}
                      onClick={() => setVolume(lvl.id as VolumeLevel)}
                      type="button"
                    >
                      {lvl.title}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-mono text-xs font-bold uppercase block mb-3 text-foreground">
                  Latency Budget:
                </label>
                <div className="space-y-2">
                  {[
                    { id: "realtime", title: "Sub-Second (< 500ms real-time)" },
                    {
                      id: "near-realtime",
                      title: "Near-Real-Time (1s – 5s response)",
                    },
                    {
                      id: "async",
                      title: "Asynchronous (Queue & batch processing)",
                    },
                  ].map((lat) => (
                    <button
                      className={`w-full p-3 text-left font-mono text-xs border transition-all ${
                        latency === lat.id
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                      key={lat.id}
                      onClick={() => setLatency(lat.id as LatencyTier)}
                      type="button"
                    >
                      {lat.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              className="font-mono text-xs font-bold uppercase tracking-wider"
              onClick={() => setStep(2)}
              type="button"
            >
              Next: Boundary Allocation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </SurfaceCard>
      )}

      {/* Step 2: Deterministic vs AI Boundary Allocation */}
      {step === 2 && (
        <SurfaceCard className="border-2 border-border p-6 sm:p-8 space-y-6">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Section 02 // Architectural Boundary Mapping
            </span>
            <h4 className="mt-1 font-mono text-xl font-bold uppercase text-foreground">
              Map Deterministic vs. Probabilistic Components
            </h4>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              The #1 source of AI production failure is assigning
              mission-critical invariants (math, permissions, schema
              enforcement) to language models. Assign each pillar carefully.
            </p>
          </div>

          <div className="space-y-4">
            {DEFAULT_CAPABILITIES.map((cap) => {
              const current = allocations[cap.id] ?? cap.recommended;
              return (
                <div
                  className="p-4 border-2 border-border bg-card/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  key={cap.id}
                >
                  <div className="max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold uppercase text-foreground">
                        {cap.label}
                      </span>
                      {current === cap.recommended && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 border border-primary/40 bg-primary/10 text-primary font-bold uppercase">
                          Target Standard
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {cap.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 w-full md:w-auto">
                    {[
                      {
                        mode: "deterministic",
                        label: "Deterministic",
                        tag: "Code & Rules",
                      },
                      {
                        mode: "hybrid",
                        label: "Hybrid Gate",
                        tag: "AI + Review",
                      },
                      {
                        mode: "ai",
                        label: "Model Only",
                        tag: "Probabilistic",
                      },
                    ].map((opt) => (
                      <button
                        className={`flex-1 md:flex-none px-3 py-2 text-center border font-mono text-xs transition-all ${
                          current === opt.mode
                            ? "border-primary bg-primary text-primary-foreground font-bold shadow"
                            : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground"
                        }`}
                        key={opt.mode}
                        onClick={() =>
                          handleAllocationChange(
                            cap.id,
                            opt.mode as AllocationMode,
                          )
                        }
                        type="button"
                      >
                        <div className="text-[11px] uppercase">{opt.label}</div>
                        <div className="text-[9px] opacity-75">{opt.tag}</div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-border">
            <Button
              className="font-mono text-xs font-bold uppercase"
              onClick={() => setStep(1)}
              type="button"
              variant="outline"
            >
              Back
            </Button>
            <Button
              className="font-mono text-xs font-bold uppercase tracking-wider"
              onClick={() => setStep(3)}
              type="button"
            >
              Next: Risk Ceilings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </SurfaceCard>
      )}

      {/* Step 3: Risk Ceilings & Failure Modes */}
      {step === 3 && (
        <SurfaceCard className="border-2 border-border p-6 sm:p-8 space-y-6">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Section 03 // Safety & Failure Mode Matrix
            </span>
            <h4 className="mt-1 font-mono text-xl font-bold uppercase text-foreground">
              Select Your Top Operational Concerns
            </h4>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Which failure modes present catastrophic legal, financial, or
              reputational exposure if not bounded by deterministic safety
              gates?
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {FAILURE_MODES.map((risk) => {
              const active = selectedRisks.includes(risk.id);
              return (
                <button
                  className={`p-5 text-left border-2 transition-all flex flex-col justify-between ${
                    active
                      ? "border-amber-500 bg-amber-500/5 text-foreground"
                      : "border-border bg-card/60 text-muted-foreground hover:border-foreground"
                  }`}
                  key={risk.id}
                  onClick={() => toggleRisk(risk.id)}
                  type="button"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold uppercase text-foreground">
                        {risk.label}
                      </span>
                      {active ? (
                        <ShieldAlert className="h-4 w-4 text-amber-500" />
                      ) : (
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {risk.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between font-mono text-[10px] uppercase">
                    <span>Priority Guardrail</span>
                    <span className={active ? "text-amber-500 font-bold" : ""}>
                      {active ? "Monitored ●" : "Inactive ○"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-border">
            <Button
              className="font-mono text-xs font-bold uppercase"
              onClick={() => setStep(2)}
              type="button"
              variant="outline"
            >
              Back
            </Button>
            <Button
              className="font-mono text-xs font-bold uppercase tracking-wider"
              onClick={() => setStep(4)}
              type="button"
            >
              Generate Architecture Brief
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </SurfaceCard>
      )}

      {/* Step 4: Diagnostic Decision Brief & Scorecard */}
      {step === 4 && (
        <div className="space-y-6">
          {/* Scorecard Hero Banner */}
          <div className="border-2 border-border bg-card p-6 sm:p-8 shadow-card">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b-2 border-border">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                    AIAS Diligence Result
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 border border-primary bg-primary/10 text-primary font-bold">
                    Grade {evaluation.grade}
                  </span>
                </div>
                <h3 className="mt-1 font-mono text-2xl font-black uppercase text-foreground">
                  {evaluation.status}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground max-w-2xl leading-relaxed">
                  {evaluation.recommendation}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-4 bg-background border-2 border-border p-4">
                <div className="text-center">
                  <p className="font-mono text-3xl font-black text-primary">
                    {evaluation.score}
                    <span className="text-xs text-muted-foreground">/100</span>
                  </p>
                  <p className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
                    Reliability Index
                  </p>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="text-left">
                  <p className="font-mono text-xs font-bold uppercase text-foreground">
                    {evaluation.track}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    Recommended Model
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                className="font-mono text-xs font-bold uppercase"
                onClick={() => handleDownload("json")}
                type="button"
                variant="outline"
              >
                <FileCode2 className="mr-2 h-4 w-4" />
                Export Brief (.json)
              </Button>
              <Button
                className="font-mono text-xs font-bold uppercase"
                onClick={() => handleDownload("md")}
                type="button"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Markdown (.md)
              </Button>
              <Button
                className="font-mono text-xs font-bold uppercase"
                onClick={copyBrief}
                type="button"
                variant="outline"
              >
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "Copied!" : "Copy Brief"}
              </Button>
              <Button
                asChild
                className="font-mono text-xs font-bold uppercase ml-auto"
              >
                <Link
                  href={`/contact?ref=diagnostic&grade=${evaluation.grade}&score=${evaluation.score}`}
                >
                  Schedule Diligence Review
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Formatted Markdown Preview */}
          <SurfaceCard className="border-2 border-border p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="font-mono text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Diagnostic Technical Report
              </span>
              <span className="font-mono text-[10px] uppercase text-muted-foreground">
                Zero Off-Device Transmission · 100% Client-Side
              </span>
            </div>
            <pre className="p-4 bg-black/60 border border-border text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {briefMarkdown}
            </pre>
          </SurfaceCard>
        </div>
      )}
    </div>
  );
}

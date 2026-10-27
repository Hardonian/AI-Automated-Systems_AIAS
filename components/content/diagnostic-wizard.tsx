"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Download,
  FileCode2,
  FileText,
  Layers,
  Link2,
  RotateCcw,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/section-primitives";
import {
  DEFAULT_DIAGNOSTIC_CAPABILITIES,
  DIAGNOSTIC_FAILURE_MODES,
  decodeDiagnosticState,
  encodeDiagnosticState,
  evaluateDiagnosticArchitecture,
  useBroadcastChannel,
  type DiagnosticAllocationMode,
  type DiagnosticLatencyTier,
  type DiagnosticVolumeLevel,
  type DiagnosticWorkloadType,
} from "@/lib/utils/client-engines";

type WorkloadType = DiagnosticWorkloadType;
type VolumeLevel = DiagnosticVolumeLevel;
type LatencyTier = DiagnosticLatencyTier;
type AllocationMode = DiagnosticAllocationMode;
type DepthMode = "executive" | "architect";

const DEFAULT_CAPABILITIES = DEFAULT_DIAGNOSTIC_CAPABILITIES;
const FAILURE_MODES = DIAGNOSTIC_FAILURE_MODES;

const SCENARIO_PRESETS: ReadonlyArray<{
  id: string;
  label: string;
  badge: string;
  workload: WorkloadType;
  volume: VolumeLevel;
  latency: LatencyTier;
  allocations: Record<string, AllocationMode>;
  risks: string[];
}> = [
  {
    id: "governed-finops",
    label: "Governed FinOps Baseline",
    badge: "Grade A Target",
    workload: "financial-ops",
    volume: "high",
    latency: "near-realtime",
    allocations: {
      "schema-validation": "deterministic",
      "unstructured-synthesis": "ai",
      "authorization-policy": "deterministic",
      "math-calculations": "deterministic",
      "customer-messaging": "hybrid",
      "audit-receipts": "deterministic",
    },
    risks: ["hallucination", "pii-leak"],
  },
  {
    id: "fragile-agent-audit",
    label: "Fragile Prototype Audit",
    badge: "Risk Drift Demo",
    workload: "customer-support",
    volume: "high",
    latency: "realtime",
    allocations: {
      "schema-validation": "ai",
      "unstructured-synthesis": "ai",
      "authorization-policy": "ai",
      "math-calculations": "ai",
      "customer-messaging": "ai",
      "audit-receipts": "hybrid",
    },
    risks: ["hallucination", "latency-spike", "pii-leak", "budget-runaway"],
  },
  {
    id: "sovereign-compliance",
    label: "PIPEDA Compliance Airlock",
    badge: "Zero-Trust Gate",
    workload: "compliance-audit",
    volume: "medium",
    latency: "async",
    allocations: {
      "schema-validation": "deterministic",
      "unstructured-synthesis": "hybrid",
      "authorization-policy": "deterministic",
      "math-calculations": "deterministic",
      "customer-messaging": "deterministic",
      "audit-receipts": "deterministic",
    },
    risks: ["pii-leak", "hallucination"],
  },
];

export function DiagnosticWizard() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [workload, setWorkload] = useState<WorkloadType>("financial-ops");
  const [volume, setVolume] = useState<VolumeLevel>("medium");
  const [latency, setLatency] = useState<LatencyTier>("near-realtime");
  const [depthMode, setDepthMode] = useState<DepthMode>("executive");

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
  const [rfcCopied, setRfcCopied] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [syncedToWorkspace, setSyncedToWorkspace] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const formId = useId();
  const { postMessage } = useBroadcastChannel<{ notes: string }>(
    "aias-workspace",
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const decoded = decodeDiagnosticState(window.location.search);
    if (!decoded) return;
    queueMicrotask(() => {
      if (decoded.workload) setWorkload(decoded.workload);
      if (decoded.volume) setVolume(decoded.volume);
      if (decoded.latency) setLatency(decoded.latency);
      if (decoded.allocations) setAllocations(decoded.allocations);
      if (decoded.risks) setSelectedRisks(decoded.risks);
      if (decoded.step) setStep(decoded.step);
      setAnnouncement(
        "Loaded diagnostic configuration from shared URL parameters.",
      );
    });
  }, []);

  const applyScenarioPreset = (preset: (typeof SCENARIO_PRESETS)[number]) => {
    setWorkload(preset.workload);
    setVolume(preset.volume);
    setLatency(preset.latency);
    setAllocations({ ...preset.allocations });
    setSelectedRisks([...preset.risks]);
    setAnnouncement(`Applied scenario preset: ${preset.label}.`);
  };

  const toggleRisk = (riskId: string) => {
    setSelectedRisks((prev) => {
      const exists = prev.includes(riskId);
      const updated = exists
        ? prev.filter((r) => r !== riskId)
        : [...prev, riskId];
      const item = FAILURE_MODES.find((f) => f.id === riskId);
      setAnnouncement(
        `${item?.label ?? riskId} ${exists ? "removed from" : "added to"} priority guardrails.`,
      );
      return updated;
    });
  };

  const handleAllocationChange = (id: string, mode: AllocationMode) => {
    setAllocations((prev) => ({ ...prev, [id]: mode }));
    const cap = DEFAULT_CAPABILITIES.find((c) => c.id === id);
    setAnnouncement(
      `Set ${cap?.label ?? id} to ${mode.toUpperCase()} execution.`,
    );
  };

  // Evaluation algorithm based on deterministic engineering principles
  const evaluation = useMemo(
    () =>
      evaluateDiagnosticArchitecture(
        allocations,
        workload,
        volume,
        latency,
        selectedRisks,
      ),
    [allocations, workload, volume, latency, selectedRisks],
  );

  const composition = evaluation.composition;

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
      `- **Deterministic Balance:** ${composition.deterministicPct}% deterministic / ${composition.hybridPct}% hybrid / ${composition.aiPct}% probabilistic`,
      "",
      `## 5. Architectural Guidance`,
      evaluation.recommendation,
      "",
      "---",
      "*AI Automated Systems (AIAS) · aiautomatedsystems.ca*",
    ].join("\n");
  }, [
    workload,
    volume,
    latency,
    allocations,
    selectedRisks,
    evaluation,
    composition,
  ]);

  const rfcMarkdown = useMemo(() => {
    return [
      `# RFC: Architectural Governance & Boundary Isolation for ${workload.toUpperCase()}`,
      `**Target Status:** ${evaluation.status} (Reliability Index: ${evaluation.score}/100, Grade ${evaluation.grade})`,
      `**Recommended Track:** ${evaluation.track}`,
      "",
      "## 1. Problem Statement & Operational Boundary",
      `Our current ${workload} workflow processes at **${volume} volume** with a **${latency} latency target**.`,
      "To prevent silent non-deterministic failures, the boundary allocation must strictly separate deterministic code invariants from generative inference.",
      "",
      "## 2. Invariant Boundary Mapping",
      ...DEFAULT_CAPABILITIES.map((cap) => {
        const mode = allocations[cap.id] ?? cap.recommended;
        return `- **${cap.label}**: \`${mode.toUpperCase()}\` ${mode === cap.recommended ? "✓ Target Standard" : "⚠ Risk Drift Detected"}`;
      }),
      "",
      "## 3. High-Priority Guardrail Mitigations",
      ...selectedRisks.map((r) => {
        const item = FAILURE_MODES.find((m) => m.id === r);
        return `- **${item?.label ?? r}**: Enforce explicit code-level circuit breakers and sanitization gates.`;
      }),
      "",
      "## 4. Architecture Composition",
      `- Deterministic Foundation: ${composition.deterministicPct}%`,
      `- Hybrid Verification: ${composition.hybridPct}%`,
      `- Generative Inference: ${composition.aiPct}%`,
      "",
      "## 5. Next Implementation Steps",
      "1. Refactor core calculations and policy checks to deterministic functions.",
      "2. Wrap LLM calls in strict Zod schema validation and automated fallback handlers.",
      "3. Conduct a 15-minute engineering architecture review with AIAS specialists.",
      "",
      "Generated via AIAS Diligence Engine (https://aiautomatedsystems.ca/diagnostic)",
    ].join("\n");
  }, [
    workload,
    volume,
    latency,
    allocations,
    selectedRisks,
    evaluation,
    composition,
  ]);

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
          composition,
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
    setAnnouncement(
      `Downloaded diagnostic brief in ${format.toUpperCase()} format.`,
    );
  };

  const copyBrief = async () => {
    await navigator.clipboard.writeText(briefMarkdown);
    setCopied(true);
    setAnnouncement("Diagnostic brief copied to clipboard.");
    setTimeout(() => setCopied(false), 2500);
  };

  const copyRfc = async () => {
    await navigator.clipboard.writeText(rfcMarkdown);
    setRfcCopied(true);
    setAnnouncement("Engineering RFC copied to clipboard.");
    setTimeout(() => setRfcCopied(false), 2500);
  };

  const copyShareLink = async () => {
    const query = encodeDiagnosticState({
      workload,
      volume,
      latency,
      allocations,
      risks: selectedRisks,
      step: 4,
    });
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}?${query}`
        : `https://aiautomatedsystems.ca/diagnostic?${query}`;
    if (typeof window !== "undefined") {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?${query}`,
      );
    }
    await navigator.clipboard.writeText(shareUrl);
    setShareLinkCopied(true);
    setAnnouncement("Shareable diagnostic permalink copied to clipboard.");
    setTimeout(() => setShareLinkCopied(false), 2500);
  };

  const syncToWorkspace = () => {
    const payload = depthMode === "architect" ? rfcMarkdown : briefMarkdown;
    try {
      window.localStorage.setItem(
        "aias_workspace_notes",
        JSON.stringify(payload),
      );
    } catch {
      // Ignore storage quota errors
    }
    postMessage({ notes: payload });
    setSyncedToWorkspace(true);
    setAnnouncement("Diagnostic brief synchronized to local Handoff Console.");
    setTimeout(() => setSyncedToWorkspace(false), 3000);
  };

  const resetAll = () => {
    setStep(1);
    setWorkload("financial-ops");
    setVolume("medium");
    setLatency("near-realtime");
    setAllocations(
      Object.fromEntries(
        DEFAULT_CAPABILITIES.map((cap) => [cap.id, cap.recommended]),
      ),
    );
    setSelectedRisks(["hallucination", "pii-leak"]);
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    setAnnouncement("Diagnostic wizard reset to default configurations.");
  };

  return (
    <div className="w-full space-y-8" id="diagnostic-wizard-root">
      {/* Screen Reader Announcement Live Region */}
      <div aria-live="polite" className="sr-only" role="status">
        {announcement}
      </div>

      {/* Top Wizard Steps Header */}
      <div
        aria-label="Diagnostic Assessment Navigation"
        className="border-2 border-border bg-card p-4 sm:p-6 shadow-card"
        role="region"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Interactive Diligence Engine
            </p>
            <h2 className="font-mono text-lg font-black uppercase text-foreground">
              AI Clarity Diagnostic Assessment
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Dual-Depth Readability Mode Toggle */}
            <div
              aria-label="Readability depth mode"
              className="inline-flex items-center border border-border bg-background p-0.5 font-mono text-[10px] uppercase"
              role="group"
            >
              <button
                aria-pressed={depthMode === "executive"}
                className={`px-2.5 py-1 font-bold transition-colors ${
                  depthMode === "executive"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => {
                  setDepthMode("executive");
                  setAnnouncement("Switched to Executive Summary mode.");
                }}
                type="button"
              >
                Executive View
              </button>
              <button
                aria-pressed={depthMode === "architect"}
                className={`px-2.5 py-1 font-bold transition-colors ${
                  depthMode === "architect"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => {
                  setDepthMode("architect");
                  setAnnouncement(
                    "Switched to Systems Architect Contract mode.",
                  );
                }}
                type="button"
              >
                Architect Spec
              </button>
            </div>
            <span
              aria-current="step"
              className="font-mono text-xs font-bold uppercase text-muted-foreground ml-1"
            >
              Step {step} of 4
            </span>
            <button
              aria-label="Reset diagnostic assessment to default values"
              className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={resetAll}
              type="button"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>
        </div>

        {/* Step Indicator Badges */}
        <div
          aria-label="Diagnostic assessment progress"
          className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2"
          role="tablist"
        >
          {[
            { s: 1, name: "1. Workload Surface" },
            { s: 2, name: "2. Boundary Map" },
            { s: 3, name: "3. Risk Ceilings" },
            { s: 4, name: "4. Architecture Brief" },
          ].map((item) => (
            <button
              aria-controls={`step-panel-${item.s}`}
              aria-selected={step === item.s}
              className={`px-3 py-2 text-left font-mono text-xs font-bold uppercase border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                step === item.s
                  ? "border-primary bg-primary/10 text-primary"
                  : step > item.s
                    ? "border-border text-foreground hover:border-primary/50"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40"
              }`}
              id={`step-tab-${item.s}`}
              key={item.s}
              onClick={() => {
                setStep(item.s as 1 | 2 | 3 | 4);
                setAnnouncement(`Navigated to Step ${item.s}: ${item.name}`);
              }}
              role="tab"
              type="button"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Workload & Operating Pressure */}
      {step === 1 && (
        <div aria-labelledby="step-tab-1" id="step-panel-1" role="tabpanel">
          <SurfaceCard className="border-2 border-border p-6 sm:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                  Section 01 // Baseline Requirements
                </span>
                <h3 className="mt-1 font-mono text-xl font-bold uppercase text-foreground">
                  Define the Operating Pressure on Your System
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Every robust automation architecture begins with explicit
                  boundaries around volume, latency budgets, and compliance
                  scope.
                </p>
              </div>

              {/* 1-Click Scenario Presets */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Quick-Load Reference Scenarios:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SCENARIO_PRESETS.map((preset) => (
                    <button
                      className="border border-border bg-background px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase text-foreground transition-all hover:border-primary hover:text-primary"
                      key={preset.id}
                      onClick={() => applyScenarioPreset(preset)}
                      type="button"
                    >
                      {preset.label}{" "}
                      <span className="text-primary">({preset.badge})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  className="font-mono text-xs font-bold uppercase block mb-3 text-foreground"
                  id={`${formId}-workload-label`}
                >
                  Workload Domain:
                </label>
                <div
                  aria-labelledby={`${formId}-workload-label`}
                  className="grid sm:grid-cols-2 gap-3"
                  id={`${formId}-workload`}
                  role="radiogroup"
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
                      aria-checked={workload === item.id}
                      className={`p-4 text-left border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                        workload === item.id
                          ? "border-primary bg-primary/5 text-foreground shadow-sm"
                          : "border-border bg-card/50 text-muted-foreground hover:border-border hover:text-foreground"
                      }`}
                      key={item.id}
                      onClick={() => {
                        setWorkload(item.id as WorkloadType);
                        setAnnouncement(`Selected workload: ${item.title}`);
                      }}
                      role="radio"
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
                  <label
                    className="font-mono text-xs font-bold uppercase block mb-3 text-foreground"
                    id={`${formId}-volume-label`}
                  >
                    Transaction / Request Volume:
                  </label>
                  <div
                    aria-labelledby={`${formId}-volume-label`}
                    className="space-y-2"
                    role="radiogroup"
                  >
                    {[
                      { id: "low", title: "Low (< 1,000 requests/day)" },
                      {
                        id: "medium",
                        title: "Medium (1,000 – 50,000 requests/day)",
                      },
                      { id: "high", title: "High (50,000+ requests/day)" },
                    ].map((lvl) => (
                      <button
                        aria-checked={volume === lvl.id}
                        className={`w-full p-3 text-left font-mono text-xs border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                          volume === lvl.id
                            ? "border-primary bg-primary/10 text-primary font-bold"
                            : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                        key={lvl.id}
                        onClick={() => {
                          setVolume(lvl.id as VolumeLevel);
                          setAnnouncement(
                            `Selected transaction volume: ${lvl.title}`,
                          );
                        }}
                        role="radio"
                        type="button"
                      >
                        {lvl.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    className="font-mono text-xs font-bold uppercase block mb-3 text-foreground"
                    id={`${formId}-latency-label`}
                  >
                    Latency Budget:
                  </label>
                  <div
                    aria-labelledby={`${formId}-latency-label`}
                    className="space-y-2"
                    role="radiogroup"
                  >
                    {[
                      {
                        id: "realtime",
                        title: "Sub-Second (< 500ms real-time)",
                      },
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
                        aria-checked={latency === lat.id}
                        className={`w-full p-3 text-left font-mono text-xs border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                          latency === lat.id
                            ? "border-primary bg-primary/10 text-primary font-bold"
                            : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                        key={lat.id}
                        onClick={() => {
                          setLatency(lat.id as LatencyTier);
                          setAnnouncement(
                            `Selected latency target: ${lat.title}`,
                          );
                        }}
                        role="radio"
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
                onClick={() => {
                  setStep(2);
                  setAnnouncement("Navigated to Step 2: Boundary Map.");
                }}
                type="button"
              >
                Next: Boundary Allocation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </SurfaceCard>
        </div>
      )}

      {/* Step 2: Deterministic vs AI Boundary Allocation */}
      {step === 2 && (
        <div aria-labelledby="step-tab-2" id="step-panel-2" role="tabpanel">
          <SurfaceCard className="border-2 border-border p-6 sm:p-8 space-y-6">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                Section 02 // Architectural Boundary Mapping
              </span>
              <h3 className="mt-1 font-mono text-xl font-bold uppercase text-foreground">
                Map Deterministic vs. Probabilistic Components
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                The #1 source of AI production failure is assigning
                mission-critical invariants (math, permissions, schema
                enforcement) to language models. Assign each pillar carefully.
              </p>
            </div>

            <ul className="space-y-4" role="list">
              {DEFAULT_CAPABILITIES.map((cap) => {
                const current = allocations[cap.id] ?? cap.recommended;
                return (
                  <li
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
                      {depthMode === "architect" && (
                        <p className="mt-2 border-l-2 border-primary/60 pl-2 font-mono text-[11px] text-primary">
                          Invariant: {cap.contractInvariant}
                        </p>
                      )}
                    </div>

                    <div
                      aria-label={`Execution model for ${cap.label}`}
                      className="flex items-center gap-1 shrink-0 w-full md:w-auto"
                      role="radiogroup"
                    >
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
                          aria-checked={current === opt.mode}
                          className={`flex-1 md:flex-none px-3 py-2 text-center border font-mono text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
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
                          role="radio"
                          type="button"
                        >
                          <div className="text-[11px] uppercase">
                            {opt.label}
                          </div>
                          <div className="text-[9px] opacity-75">{opt.tag}</div>
                        </button>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="pt-4 flex items-center justify-between border-t border-border">
              <Button
                className="font-mono text-xs font-bold uppercase"
                onClick={() => {
                  setStep(1);
                  setAnnouncement("Navigated back to Step 1.");
                }}
                type="button"
                variant="outline"
              >
                Back
              </Button>
              <Button
                className="font-mono text-xs font-bold uppercase tracking-wider"
                onClick={() => {
                  setStep(3);
                  setAnnouncement("Navigated to Step 3: Risk Ceilings.");
                }}
                type="button"
              >
                Next: Risk Ceilings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </SurfaceCard>
        </div>
      )}

      {/* Step 3: Risk Ceilings & Failure Modes */}
      {step === 3 && (
        <div aria-labelledby="step-tab-3" id="step-panel-3" role="tabpanel">
          <SurfaceCard className="border-2 border-border p-6 sm:p-8 space-y-6">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                Section 03 // Safety & Failure Mode Matrix
              </span>
              <h3
                className="mt-1 font-mono text-xl font-bold uppercase text-foreground"
                id={`${formId}-risks-label`}
              >
                Select Your Top Operational Concerns
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Which failure modes present catastrophic legal, financial, or
                reputational exposure if not bounded by deterministic safety
                gates?
              </p>
            </div>

            <div
              aria-labelledby={`${formId}-risks-label`}
              className="grid sm:grid-cols-2 gap-4"
              role="group"
            >
              {FAILURE_MODES.map((risk) => {
                const active = selectedRisks.includes(risk.id);
                return (
                  <button
                    aria-checked={active}
                    className={`p-5 text-left border-2 transition-all flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                      active
                        ? "border-amber-500 bg-amber-500/5 text-foreground"
                        : "border-border bg-card/60 text-muted-foreground hover:border-foreground"
                    }`}
                    key={risk.id}
                    onClick={() => toggleRisk(risk.id)}
                    role="checkbox"
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
                      {depthMode === "architect" && (
                        <p className="mt-2 border-l-2 border-amber-500/60 pl-2 font-mono text-[11px] text-amber-400">
                          Gate: {risk.mitigationGate}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between font-mono text-[10px] uppercase">
                      <span>Priority Guardrail</span>
                      <span
                        className={active ? "text-amber-500 font-bold" : ""}
                      >
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
                onClick={() => {
                  setStep(2);
                  setAnnouncement("Navigated back to Step 2.");
                }}
                type="button"
                variant="outline"
              >
                Back
              </Button>
              <Button
                className="font-mono text-xs font-bold uppercase tracking-wider"
                onClick={() => {
                  setStep(4);
                  setAnnouncement(
                    "Generated Architecture Brief and Scorecard.",
                  );
                }}
                type="button"
              >
                Generate Architecture Brief
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </SurfaceCard>
        </div>
      )}

      {/* Step 4: Diagnostic Decision Brief & Scorecard */}
      {step === 4 && (
        <div
          aria-labelledby="step-tab-4"
          className="space-y-6"
          id="step-panel-4"
          role="tabpanel"
        >
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

            {/* Operational Profile Telemetry Strip */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="border border-border bg-background/80 p-3.5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Target P95 Latency Budget
                </p>
                <p className="mt-1 font-mono text-xs font-bold text-foreground">
                  {evaluation.operationalProfile.targetP95Latency}
                </p>
              </div>
              <div className="border border-border bg-background/80 p-3.5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Est. Annual Capacity Reclaimed
                </p>
                <p className="mt-1 font-mono text-xs font-bold text-cyan-400">
                  ~
                  {evaluation.operationalProfile.estimatedHoursReclaimedPerYear.toLocaleString()}{" "}
                  engineering &amp; ops hrs/yr
                </p>
              </div>
              <div className="border border-border bg-background/80 p-3.5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Primary Circuit-Breaker Pattern
                </p>
                <p className="mt-1 font-mono text-xs font-bold text-emerald-400">
                  {evaluation.operationalProfile.circuitBreakerPattern}
                </p>
              </div>
            </div>

            {evaluation.operationalProfile.criticalDrifts.length > 0 && (
              <div className="mt-4 border-2 border-amber-500/60 bg-amber-500/10 p-4 font-mono text-xs">
                <p className="font-bold uppercase text-amber-400">
                  ⚠ Critical Invariant Drift Detected (
                  {evaluation.operationalProfile.criticalDrifts.length}{" "}
                  boundaries exposed):
                </p>
                <p className="mt-1 text-muted-foreground">
                  Assigned to probabilistic inference:{" "}
                  <span className="font-bold text-foreground">
                    {evaluation.operationalProfile.criticalDrifts.join(", ")}
                  </span>
                  . Refactor these pillars to Deterministic Code to eliminate
                  silent failure risk.
                </p>
              </div>
            )}

            {/* Architecture Composition Balance Meter */}
            <div className="mt-6 p-4 bg-background border border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                  Architecture Composition Matrix
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {composition.deterministicPct >= 50
                    ? "✓ Governed & Production-Resilient"
                    : "⚠ Fragile: Excessive Probabilistic Exposure"}
                </span>
              </div>
              <div
                aria-label="Composition balance meter"
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={composition.deterministicPct}
                className="h-3 w-full flex rounded-full overflow-hidden bg-muted"
                role="progressbar"
              >
                <div
                  className="bg-emerald-500 transition-all"
                  style={{ width: `${composition.deterministicPct}%` }}
                  title={`Deterministic: ${composition.deterministicPct}%`}
                />
                <div
                  className="bg-amber-500 transition-all"
                  style={{ width: `${composition.hybridPct}%` }}
                  title={`Hybrid Gate: ${composition.hybridPct}%`}
                />
                <div
                  className="bg-rose-500 transition-all"
                  style={{ width: `${composition.aiPct}%` }}
                  title={`Model Only: ${composition.aiPct}%`}
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Deterministic: {composition.deterministicPct}%</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>Hybrid Gate: {composition.hybridPct}%</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-rose-400">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span>Model Only: {composition.aiPct}%</span>
                </div>
              </div>
            </div>

            {/* Action Buttons & CRO Conversion CTA */}
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
                className="font-mono text-xs font-bold uppercase border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10"
                onClick={copyRfc}
                type="button"
                variant="outline"
              >
                <Sparkles className="mr-2 h-4 w-4 text-cyan-400" />
                {rfcCopied ? "RFC Copied!" : "Copy 1-Page RFC"}
              </Button>
              <Button
                className="font-mono text-xs font-bold uppercase border-primary/50 text-primary hover:bg-primary/10"
                onClick={copyShareLink}
                type="button"
                variant="outline"
              >
                <Link2 className="mr-2 h-4 w-4" />
                {shareLinkCopied ? "Permalink Copied!" : "Share CTO Permalink"}
              </Button>
              <Button
                className="font-mono text-xs font-bold uppercase"
                onClick={syncToWorkspace}
                type="button"
                variant="outline"
              >
                <Send className="mr-2 h-4 w-4" />
                {syncedToWorkspace
                  ? "Synced to Console ✓"
                  : "Send to Handoff Console"}
              </Button>
              <Button
                asChild
                className="font-mono text-xs font-bold uppercase ml-auto shadow-md"
              >
                <Link
                  href={`/contact?ref=diagnostic&grade=${evaluation.grade}&score=${evaluation.score}&workload=${workload}&track=${encodeURIComponent(evaluation.track)}`}
                >
                  Schedule Diligence Review with Spec Attached
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Formatted Markdown Preview with Executive / Architect Switcher */}
          <SurfaceCard className="border-2 border-border p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <span className="font-mono text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                {depthMode === "architect" ? (
                  <Layers className="h-4 w-4 text-cyan-400" />
                ) : (
                  <FileText className="h-4 w-4 text-primary" />
                )}
                {depthMode === "architect"
                  ? "Systems Engineering RFC & Boundary Specification"
                  : "Diagnostic Technical Report (Executive Brief)"}
              </span>
              <div className="flex items-center gap-3">
                <Link
                  className="font-mono text-[10px] font-bold uppercase text-primary underline underline-offset-4 hover:text-foreground"
                  href="/tools#workspace-title"
                >
                  Open Handoff Console →
                </Link>
                <span className="font-mono text-[10px] uppercase text-muted-foreground">
                  Zero Off-Device Transmission · 100% Client-Side
                </span>
              </div>
            </div>
            <pre className="p-4 bg-black/60 border border-border text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {depthMode === "architect" ? rfcMarkdown : briefMarkdown}
            </pre>
          </SurfaceCard>
        </div>
      )}
    </div>
  );
}

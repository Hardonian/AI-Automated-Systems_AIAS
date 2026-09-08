"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldAlert,
  Cpu,
  Database,
  FileCheck2,
  Terminal,
  Activity,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
} from "lucide-react";
import { playClick, playTelemetryTone, playWarning, playSuccess } from "@/lib/audio/sound-fx";
import { Button } from "@/components/ui/button";

interface TopologyStage {
  id: string;
  number: string;
  name: string;
  subname: string;
  category: "DETERMINISTIC" | "GOVERNED_MODEL" | "POLICY_GATE" | "RUNBOOK";
  latency: string;
  memoryLimit: string;
  status: "ACTIVE" | "VERIFIED" | "INTERCEPTED" | "STANDBY";
  contractRules: string[];
  normalTelemetry: {
    inputSummary: string;
    actionSummary: string;
    outputSummary: string;
    assertionCode: string;
  };
  interceptTelemetry: {
    inputSummary: string;
    actionSummary: string;
    outputSummary: string;
    assertionCode: string;
  };
}

const TOPOLOGY_STAGES: TopologyStage[] = [
  {
    id: "schema-gate",
    number: "01",
    name: "Schema Contract Gate",
    subname: "Strict Input Zod Validation",
    category: "DETERMINISTIC",
    latency: "12ms",
    memoryLimit: "32MB",
    status: "VERIFIED",
    contractRules: [
      "Runtime Zod Schema parse check",
      "Explicit field type assertions (0 `any`)",
      "Reject undefined payload keys immediately",
    ],
    normalTelemetry: {
      inputSummary: 'Payload: {"account": "Apex Corp", "action": "ingest_lead"}',
      actionSummary: "Zod parse valid: 0 contract errors detected.",
      outputSummary: "Normalized Typed Object emitted to Bus [ID: aias-8841]",
      assertionCode: "assert(schema.safeParse(req).success === true);",
    },
    interceptTelemetry: {
      inputSummary: 'Payload: {"account": "Apex Corp", "unverified_flag": true}',
      actionSummary: "Syntax valid, payload passed to inference runtime.",
      outputSummary: "Normalized Typed Object emitted with risk metadata.",
      assertionCode: "assert(schema.safeParse(req).success === true);",
    },
  },
  {
    id: "model-core",
    number: "02",
    name: "Governed Model Core",
    subname: "Scoped Context & Temperature Lock",
    category: "GOVERNED_MODEL",
    latency: "340ms",
    memoryLimit: "128MB",
    status: "ACTIVE",
    contractRules: [
      "Temperature clamped to 0.0 for deterministic outputs",
      "Context isolation (PIPEDA Canadian data boundary)",
      "Strict output JSON schema extraction",
    ],
    normalTelemetry: {
      inputSummary: "Scoped system prompt + validated prospect text.",
      actionSummary: "Extracted entities: 18 line items, complexity score 44.2.",
      outputSummary: "Structured JSON proposed draft ready for policy review.",
      assertionCode: "model.generate({ temperature: 0.0, format: 'json' });",
    },
    interceptTelemetry: {
      inputSummary: "Scoped system prompt + unverified parameter injection.",
      actionSummary: "Entity extracted with potential compliance boundary ambiguity.",
      outputSummary: "Proposed draft marked with RISK_FLAG_POLICY_REVIEW.",
      assertionCode: "model.generate({ temperature: 0.0, format: 'json' });",
    },
  },
  {
    id: "policy-guardrail",
    number: "03",
    name: "Deterministic Policy Gate",
    subname: "Zero-Trust Safety & Variance Intercept",
    category: "POLICY_GATE",
    latency: "18ms",
    memoryLimit: "64MB",
    status: "VERIFIED",
    contractRules: [
      "Mathematical variance ceiling <= 1.0% limit",
      "Entropy scan: 0 PII or unencrypted token leakage",
      "Multi-tenant data boundary isolation verification",
    ],
    normalTelemetry: {
      inputSummary: "Model proposal verified against 6 compliance rules.",
      actionSummary: "All assertions passed: Math parity 100%, PII scan: 0.",
      outputSummary: "Policy Gate PASSED: Authorized for production execution.",
      assertionCode: "if (variance <= 0.01 && piiCount === 0) approve();",
    },
    interceptTelemetry: {
      inputSummary: "Model proposal contains multi-tenant boundary ambiguity.",
      actionSummary: "SAFETY ASSERTION TRIGGERED: Rule #14 boundary violation.",
      outputSummary: "INTERCEPTED: Execution halted. Routing to human architect.",
      assertionCode: "if (hasAmbiguity) throw SafetyEscalation();",
    },
  },
  {
    id: "audit-dispatch",
    number: "04",
    name: "Immutable Audit Ledger",
    subname: "Cryptographic Receipt & Dispatch",
    category: "RUNBOOK",
    latency: "24ms",
    memoryLimit: "48MB",
    status: "ACTIVE",
    contractRules: [
      "SHA-256 signed execution trace receipt",
      "Immutable append-only telemetry logging",
      "Human-in-the-loop escalation runbook generation",
    ],
    normalTelemetry: {
      inputSummary: "Approved artifact payload from Policy Gate.",
      actionSummary: "Receipt signed: SHA256-d7a8f9c1...02b3.",
      outputSummary: "Dispatched to target ERP / CRM with verifiable receipt.",
      assertionCode: "auditLedger.append(signedReceipt); dispatch();",
    },
    interceptTelemetry: {
      inputSummary: "Safety Intercept bundle from Policy Gate #03.",
      actionSummary: "Incident packet locked and signed with exception code.",
      outputSummary: "Escalated to Senior Architect on-call queue. Production safe.",
      assertionCode: "auditLedger.recordIncident(receipt); notifyHuman();",
    },
  },
];

export function SystemTopologyVisualizer() {
  const [activeStageId, setActiveStageId] = useState<string>("schema-gate");
  const [simulateIntercept, setSimulateIntercept] = useState<boolean>(false);
  const [pulseActive, setPulseActive] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const fallbackStage: TopologyStage = TOPOLOGY_STAGES[0]!;
  const activeStage: TopologyStage =
    TOPOLOGY_STAGES.find((s) => s.id === activeStageId) ?? fallbackStage;

  const handleStageSelect = (id: string) => {
    playClick();
    setActiveStageId(id);
  };

  const handleToggleIntercept = (checked: boolean) => {
    if (checked) {
      playWarning();
    } else {
      playClick();
    }
    setSimulateIntercept(checked);
  };

  const triggerLivePulse = () => {
    if (pulseActive) return;
    playClick();
    setPulseActive(true);
    setActiveStepIndex(0);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < TOPOLOGY_STAGES.length) {
        setActiveStepIndex(step);
        const nextStage = TOPOLOGY_STAGES[step];
        if (nextStage) {
          setActiveStageId(nextStage.id);
        }
        if (simulateIntercept && step === 2) {
          playWarning();
        } else {
          playTelemetryTone();
        }
      } else {
        clearInterval(interval);
        setPulseActive(false);
        if (simulateIntercept) {
          playWarning();
        } else {
          playSuccess();
        }
      }
    }, 650);
  };

  const telemetryData = simulateIntercept
    ? activeStage.interceptTelemetry
    : activeStage.normalTelemetry;

  return (
    <div
      className="hud-panel relative overflow-hidden border-2 border-border bg-card shadow-[6px_6px_0px_0px_hsl(var(--text))] text-foreground"
      id="system-topology-visualizer"
    >
      {/* HUD Telemetry Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border bg-muted/40 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-3 w-3 items-center justify-center">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                  simulateIntercept ? "bg-destructive" : "bg-emerald-500"
                }`}
              />
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                  simulateIntercept ? "bg-destructive" : "bg-emerald-500"
                }`}
              />
            </span>
          </div>
          <div className="font-mono text-xs font-black uppercase tracking-wider text-foreground">
            TOPOLOGY_V1.1 //{" "}
            <span className="text-primary font-mono">
              {simulateIntercept
                ? "SAFETY_INTERCEPT_MODE"
                : "DETERMINISTIC_PIPELINE"}
            </span>
          </div>
        </div>

        {/* Live System Stats */}
        <div className="flex flex-wrap items-center gap-4 font-mono text-[11px]">
          <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground">
            <span>UPTIME:</span>
            <span className="font-bold text-foreground">99.99%</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground">
            <span>PIPELINE_LATENCY:</span>
            <span className="font-bold text-foreground">~394ms</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span>INVARIANT:</span>
            <span className="border border-primary/40 bg-primary/10 px-1.5 py-0.2 font-bold text-primary">
              ZERO_HARD_500
            </span>
          </div>
        </div>
      </div>

      {/* Control Console Action Deck */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-border/80 bg-background/90 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase text-foreground">
            Trace Mode:
          </span>
          <label className="flex cursor-pointer items-center gap-2 border-2 border-border bg-card px-2.5 py-1 text-xs font-mono font-bold uppercase transition-colors hover:border-foreground">
            <input
              type="checkbox"
              checked={simulateIntercept}
              onChange={(e) => handleToggleIntercept(e.target.checked)}
              className="h-3.5 w-3.5 rounded-none border-2 border-border accent-primary cursor-pointer"
            />
            <span
              className={
                simulateIntercept
                  ? "text-destructive font-black"
                  : "text-muted-foreground"
              }
            >
              Simulate Risk Intercept
            </span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={triggerLivePulse}
            disabled={pulseActive}
            className="rounded-none border-2 border-primary bg-primary px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-[2px_2px_0px_0px_hsl(var(--text))] hover:-translate-y-0.5"
          >
            {pulseActive ? (
              <>
                <Zap className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Tracing...
              </>
            ) : (
              <>
                <Play className="mr-1.5 h-3.5 w-3.5 fill-current" />
                Inject Test Packet
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Interactive Topology Flow Canvas */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stages Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {TOPOLOGY_STAGES.map((stage, idx) => {
            const isSelected = activeStageId === stage.id;
            const isPulsing = pulseActive && activeStepIndex === idx;
            const isInterceptPoint = simulateIntercept && idx === 2;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => handleStageSelect(stage.id)}
                className={`relative flex flex-col items-start p-4 text-left border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-[4px_4px_0px_0px_hsl(var(--primary))] -translate-y-1"
                    : "border-border bg-card hover:border-foreground/70"
                } ${isPulsing ? "ring-2 ring-primary animate-pulse" : ""}`}
              >
                {/* Stage Header */}
                <div className="flex w-full items-center justify-between border-b border-border/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center border border-border bg-muted font-mono text-[11px] font-black text-foreground">
                      {stage.number}
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {stage.category}
                    </span>
                  </div>

                  {isInterceptPoint ? (
                    <span className="flex items-center gap-1 border border-destructive bg-destructive/10 px-1.5 py-0.2 font-mono text-[10px] font-bold text-destructive">
                      <ShieldAlert className="h-3 w-3" />
                      INTERCEPT
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 border border-emerald-600/40 bg-emerald-500/10 px-1.5 py-0.2 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      GATED
                    </span>
                  )}
                </div>

                {/* Stage Title */}
                <div className="mt-3 w-full">
                  <h3 className="font-mono text-sm font-black uppercase text-foreground leading-tight">
                    {stage.name}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground line-clamp-1">
                    {stage.subname}
                  </p>
                </div>

                {/* Telemetry Chips */}
                <div className="mt-4 flex w-full items-center justify-between pt-2 border-t border-border/40 font-mono text-[10px] text-muted-foreground">
                  <span>LATENCY: {stage.latency}</span>
                  <span>MEM: {stage.memoryLimit}</span>
                </div>

                {/* Direction Indicator */}
                {idx < TOPOLOGY_STAGES.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                    <span className="flex h-6 w-6 items-center justify-center border-2 border-border bg-card text-muted-foreground shadow-sm">
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Stage Inspector HUD Deck */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage.id + String(simulateIntercept)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-6 border-2 border-border bg-surface-muted p-5 sm:p-6"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              {/* Left Column: Stage Contract & Invariant Assertions */}
              <div className="lg:w-1/2 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="border border-primary bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold uppercase text-primary">
                    STAGE {activeStage.number} SPECIFICATION
                  </span>
                  <span className="font-mono text-xs font-bold uppercase text-muted-foreground">
                    {activeStage.name}
                  </span>
                </div>

                <div>
                  <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                    Mandatory Policy & Boundary Guardrails:
                  </h4>
                  <ul className="mt-2.5 space-y-1.5 font-mono text-xs text-muted-foreground">
                    {activeStage.contractRules.map((rule) => (
                      <li key={rule} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border/60 pt-3">
                  <span className="font-mono text-[11px] font-bold uppercase text-muted-foreground">
                    Execution Assertion Logic:
                  </span>
                  <div className="mt-1 border border-border bg-background p-2.5 font-mono text-xs text-emerald-600 dark:text-emerald-400">
                    <code>{telemetryData.assertionCode}</code>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Telemetry Snapshot */}
              <div className="lg:w-1/2 border-2 border-border bg-card p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-primary" />
                    Live Telemetry Trace
                  </span>
                  <span
                    className={`font-mono text-[10px] font-bold uppercase px-2 py-0.2 border ${
                      simulateIntercept && activeStage.id === "policy-guardrail"
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-emerald-600 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {simulateIntercept && activeStage.id === "policy-guardrail"
                      ? "GATE INTERCEPTED"
                      : "NOMINAL (0 FAULTS)"}
                  </span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase">
                      Input Payload:
                    </span>
                    <p className="text-foreground bg-muted/40 p-1.5 border border-border/60 break-all">
                      {telemetryData.inputSummary}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase">
                      Action State:
                    </span>
                    <p className="text-foreground bg-muted/40 p-1.5 border border-border/60">
                      {telemetryData.actionSummary}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase">
                      Emitted Output / Outcome:
                    </span>
                    <p
                      className={`p-1.5 border font-bold ${
                        simulateIntercept && activeStage.id === "policy-guardrail"
                          ? "border-destructive bg-destructive/10 text-destructive"
                          : "border-border/60 bg-muted/40 text-foreground"
                      }`}
                    >
                      {telemetryData.outputSummary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

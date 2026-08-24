'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  RotateCcw,
  Terminal,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Download,
  Copy,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SurfaceCard } from '@/components/ui/section-primitives';

type ScenarioKey = 'lead-qualification' | 'invoice-audit' | 'governance-gate' | 'support-triage';

interface Stage {
  id: string;
  name: string;
  type: 'deterministic' | 'ai-assisted';
  description: string;
}

interface ScenarioConfig {
  id: ScenarioKey;
  title: string;
  badge: string;
  description: string;
  inputPayload: Record<string, unknown>;
  stages: Stage[];
  normalOutput: {
    artifact: Record<string, unknown>;
    policyChecks: { name: string; status: 'passed' | 'warning' | 'failed'; detail: string }[];
    logs: string[];
  };
  fallbackOutput: {
    artifact: Record<string, unknown>;
    policyChecks: { name: string; status: 'passed' | 'warning' | 'failed'; detail: string }[];
    logs: string[];
  };
}

const SCENARIOS: Record<ScenarioKey, ScenarioConfig> = {
  'lead-qualification': {
    id: 'lead-qualification',
    title: 'Lead Intake & Routing Engine',
    badge: 'Operations',
    description: 'Validates prospect constraints, enriches firmographics, computes risk scores, and deterministically routes to the appropriate engagement model.',
    inputPayload: {
      account: 'Apex Industrial Cloud',
      annualRevenue: '$45M CAD',
      teamSize: 180,
      techStack: ['PostgreSQL', 'LangChain', 'FastAPI'],
      workflowProblem: 'Manual compliance review of automated RFP responses',
      urgency: 'this-month',
      budgetFlexibility: 'strategic',
    },
    stages: [
      { id: 'ingest', name: 'Schema Ingestion', type: 'deterministic', description: 'Strict Zod contract validation and deduplication' },
      { id: 'enrich', name: 'Context Retrieval & Scoring', type: 'ai-assisted', description: 'Model-assisted entity extraction & risk matrix analysis' },
      { id: 'gate', name: 'Policy & Guardrail Gate', type: 'deterministic', description: 'Deterministic budget, governance, and scope boundary checks' },
      { id: 'dispatch', name: 'Runbook Dispatch', type: 'deterministic', description: 'Generates structured brief, routes to partner queue' },
    ],
    normalOutput: {
      artifact: {
        status: 'QUALIFIED_AND_ROUTED',
        recommendedEngagement: 'Co-Build Sprint (4-6 weeks)',
        assignedLeadArchitect: 'Scott H. (Toronto Ops)',
        riskTier: 'MODERATE_GOVERNANCE',
        estimatedWeeklyHoursReclaimed: 28.5,
        targetDeliveryWindow: 'Q3-2026',
        telemetryId: 'aias-sim-lead-8841',
      },
      policyChecks: [
        { name: 'Schema Conformance (Zod)', status: 'passed', detail: 'All 7 mandatory fields matched exact contracts' },
        { name: 'Pricing Guardrail Verification', status: 'passed', detail: 'Zero forbidden per-hour/token rates detected' },
        { name: 'Data Residency Boundary', status: 'passed', detail: 'Canadian sovereignty requirement enforced (PIPEDA)' },
        { name: 'Routing Threshold Match', status: 'passed', detail: 'Complexity index 44.2 matches Co-Build tier criteria' },
      ],
      logs: [
        '[00.01s] [INGEST] Incoming payload received. Verifying JSON structure against strict schema.',
        '[00.32s] [INGEST] Schema validated: 0 contract errors. Account "Apex Industrial Cloud" locked.',
        '[00.74s] [MODEL] Context enrichment initiated. Cross-referencing industry risk benchmarks.',
        '[01.20s] [MODEL] Complexity score computed: 44.2/100. Manual rework load: 14 hrs/week.',
        '[01.65s] [GATE] Running deterministic policy evaluation across 4 governance rules.',
        '[01.90s] [GATE] Policy check passed: PIPEDA data residency & strict scope boundaries confirmed.',
        '[02.25s] [DISPATCH] Structured engagement brief generated. Dispatched to onboarding pipeline.',
      ],
    },
    fallbackOutput: {
      artifact: {
        status: 'HEURISTIC_FLAG_HUMAN_REVIEW',
        recommendedEngagement: 'Manual Diagnostic Review Required',
        assignedLeadArchitect: 'Lead Governance Principal',
        riskTier: 'HIGH_COMPLIANCE_HOLD',
        reason: 'Unverified multi-tenant data boundary detected in RFP pipeline',
        telemetryId: 'aias-sim-lead-8841-FLAGGED',
      },
      policyChecks: [
        { name: 'Schema Conformance (Zod)', status: 'passed', detail: 'Payload syntactically valid' },
        { name: 'Data Boundary Isolation Gate', status: 'failed', detail: 'Multi-tenant isolation requires human architect signoff' },
        { name: 'Automatic Dispatch Block', status: 'warning', detail: 'Automated dispatch halted by Policy Rule #14' },
      ],
      logs: [
        '[00.01s] [INGEST] Incoming payload received and validated.',
        '[00.45s] [MODEL] Model analysis detected high compliance risk keyword: "unverified multi-tenant".',
        '[00.85s] [GATE] Triggering deterministic safety boundary #14.',
        '[01.10s] [GATE] ALERT: Automatic dispatch rejected. Enforcing human-in-the-loop escalation.',
        '[01.40s] [DISPATCH] Incident record stored in audit ledger. Lead assigned to manual diagnostic queue.',
      ],
    },
  },
  'invoice-audit': {
    id: 'invoice-audit',
    title: 'Financial & Invoice Reconciliation',
    badge: 'FinOps',
    description: 'Performs deterministic multi-currency line-item verification, GL code matching, and variance guardrails.',
    inputPayload: {
      vendor: 'CloudScale Telemetry Inc.',
      invoiceNumber: 'INV-2026-9042',
      grossAmountCAD: 34250.0,
      taxCAD: 4452.5,
      costCenter: 'CC-AI-INFRA-400',
      lineItemsCount: 18,
      statedVariance: '0.4%',
    },
    stages: [
      { id: 'extract', name: 'Document Ingestion', type: 'deterministic', description: 'Deterministic optical & PDF payload ingestion' },
      { id: 'reconcile', name: 'GL Mapping & Extraction', type: 'ai-assisted', description: 'Model entity extraction & ledger categorization' },
      { id: 'verify', name: 'Tolerance & Variance Gate', type: 'deterministic', description: 'Deterministic math check: variance <= 1.0% limit' },
      { id: 'audit', name: 'Ledger Audit Ledger', type: 'deterministic', description: 'Signs cryptographic verification receipt' },
    ],
    normalOutput: {
      artifact: {
        reconciliationStatus: 'APPROVED_FOR_PAYMENT',
        computedVariance: '0.00%',
        calculatedTotalCAD: 38702.5,
        glAccountAssigned: 'GL-6410-SOFTWARE-COMPUTE',
        auditSignoff: 'SHA256-d7a8f9c1...02b3',
        approvalRouting: 'Auto-approved under $50k FinOps threshold',
      },
      policyChecks: [
        { name: 'Line-Item Mathematical Parity', status: 'passed', detail: 'Sum of 18 items exactly equals $34,250.00' },
        { name: 'Tax Formula Conformance (HST/GST)', status: 'passed', detail: '13.00% tax calculation verified to 4 decimal places' },
        { name: 'Budget Cap Allocation Gate', status: 'passed', detail: 'Cost Center CC-AI-INFRA-400 has $82k remaining budget' },
      ],
      logs: [
        '[00.02s] [INGEST] Ingested invoice INV-2026-9042 from CloudScale Telemetry Inc.',
        '[00.40s] [RECONCILE] Extracted 18 line items across 3 compute tiers. Mapped to GL-6410.',
        '[00.82s] [VERIFY] Mathematical parity check executed: Sum matches gross total exactly.',
        '[01.15s] [VERIFY] Budget allocation verified: remaining balance sufficient.',
        '[01.50s] [AUDIT] Cryptographic receipt generated. Ready for ERP ledger posting.',
      ],
    },
    fallbackOutput: {
      artifact: {
        reconciliationStatus: 'HELD_VARIANCE_BREACH',
        computedVariance: '+4.8%',
        calculatedTotalCAD: 35894.0,
        discrepancyCAD: '+$1,644.00 vs PO Agreement',
        flaggedAction: 'Payment frozen; notification sent to procurement officer',
      },
      policyChecks: [
        { name: 'Mathematical Parity Check', status: 'passed', detail: 'Line items sum correctly' },
        { name: 'Purchase Order Matching', status: 'failed', detail: 'Invoice exceeds signed PO ceiling by $1,644.00 CAD' },
        { name: 'Auto-Pay FinOps Safety Gate', status: 'failed', detail: 'Variance > 1.0% limit halted transaction' },
      ],
      logs: [
        '[00.02s] [INGEST] Ingested invoice INV-2026-9042.',
        '[00.45s] [RECONCILE] Extraction completed.',
        '[00.90s] [VERIFY] PO comparison breach detected: Variance +4.8% exceeds 1.0% tolerance.',
        '[01.15s] [VERIFY] SAFETY GATE TRIGGERED: Auto-payment blocked by FinOps guardrail.',
        '[01.45s] [AUDIT] Exception bundle dispatched to FinOps audit desk.',
      ],
    },
  },
  'governance-gate': {
    id: 'governance-gate',
    title: 'Model Guardrail & Evaluation Gate',
    badge: 'AI Safety',
    description: 'Evaluates model output before production commit, detecting hallucinations, PII leakage, and schema drift.',
    inputPayload: {
      workload: 'Customer Knowledge Agent',
      modelSource: 'Claude 3.5 Sonnet / GPT-4o Mix',
      evaluationBenchmark: 'GroundTruth-v4 (240 tests)',
      targetAccuracyPassRate: '98.0%',
      targetConfidenceScore: '>= 0.92',
    },
    stages: [
      { id: 'eval', name: 'Evaluation Harness', type: 'deterministic', description: 'Runs regression suite across 240 benchmark assertions' },
      { id: 'semantic', name: 'Semantic Boundary Check', type: 'ai-assisted', description: 'Multi-model cross-eval & factual grounding verification' },
      { id: 'pii', name: 'PII & Security Gate', type: 'deterministic', description: 'Deterministic regex & entropy scan for sensitive credentials' },
      { id: 'commit', name: 'Production Gateway', type: 'deterministic', description: 'Deterministic promotion or immediate canary rollback' },
    ],
    normalOutput: {
      artifact: {
        deploymentStatus: 'PROMOTED_TO_PRODUCTION',
        evalPassRate: '99.17% (238/240 passed)',
        factualGroundingIndex: 0.984,
        piiDetected: 'ZERO_INSTANCES',
        latencyP95: '412ms',
        canaryDuration: '10 min validation clean',
      },
      policyChecks: [
        { name: 'Benchmark Eval Threshold', status: 'passed', detail: '99.17% pass rate exceeds 98.0% requirement' },
        { name: 'Zero-PII Leakage Assertion', status: 'passed', detail: 'Scanned 48,000 output tokens without sensitive matches' },
        { name: 'Cost Ceiling Constraint', status: 'passed', detail: 'Inference rate stayed within $0.018/query allocation' },
      ],
      logs: [
        '[00.02s] [EVAL] Initialized GroundTruth-v4 test harness with 240 assertions.',
        '[00.55s] [EVAL] Executed test batches: 238 passed, 2 non-critical stylistic warnings.',
        '[00.95s] [SEMANTIC] Cross-model verification score: 0.984 grounding coefficient.',
        '[01.30s] [PII] Deterministic entropy & token scanner: Clean (0 PII anomalies).',
        '[01.65s] [COMMIT] Release gate cleared. Model configuration promoted to live canary.',
      ],
    },
    fallbackOutput: {
      artifact: {
        deploymentStatus: 'ROLLBACK_TRIGGERED',
        evalPassRate: '93.75% (225/240 passed)',
        factualGroundingIndex: 0.812,
        anomaliesDetected: '15 hallucinated reference URLs',
        actionTaken: 'Automated rollback to checkpoint v3.12.4',
      },
      policyChecks: [
        { name: 'Benchmark Eval Threshold', status: 'failed', detail: '93.75% falls below mandatory 98.0% gate' },
        { name: 'Hallucination Detection Gate', status: 'failed', detail: 'Grounding index 0.812 triggered safety intercept' },
        { name: 'Automated Rollback Rule #4', status: 'passed', detail: 'Rollback initiated in 12ms; production unaffected' },
      ],
      logs: [
        '[00.02s] [EVAL] Running GroundTruth-v4 suite.',
        '[00.60s] [EVAL] Detected 15 failures in citation veracity test suite.',
        '[00.92s] [SEMANTIC] Grounding coefficient 0.812 failed minimum safety threshold (0.92).',
        '[01.10s] [GATE] CRITICAL: Release gate aborted by Safety Policy.',
        '[01.35s] [COMMIT] Automated instant rollback to stable version v3.12.4 executed.',
      ],
    },
  },
  'support-triage': {
    id: 'support-triage',
    title: 'Multi-Tier Support Escalation',
    badge: 'Customer Ops',
    description: 'Deterministic ticket classification, SLA countdown monitoring, and AI draft generation with human verification.',
    inputPayload: {
      ticketId: 'TCK-2026-8819',
      customerTier: 'Enterprise SLA Platinum',
      issueCategory: 'Webhook delivery failure',
      customerSentiment: 'Urgent / High Friction',
      responseTimeRemaining: '18 minutes',
    },
    stages: [
      { id: 'classify', name: 'SLA Triage', type: 'deterministic', description: 'Deterministic priority scoring & SLA timer lock' },
      { id: 'draft', name: 'Root-Cause & Draft Response', type: 'ai-assisted', description: 'System log synthesis & structured resolution draft' },
      { id: 'safety', name: 'Contract & Tone Check', type: 'deterministic', description: 'Verifies no binding legal commitments in draft' },
      { id: 'route', name: 'Human-in-the-Loop Dispatch', type: 'deterministic', description: 'Queues to senior engineer with 1-click approve' },
    ],
    normalOutput: {
      artifact: {
        triageStatus: 'DRAFT_READY_FOR_ENGINEER',
        assignedQueue: 'L3 Integration Reliability',
        generatedDiagnostic: 'Endpoint returned HTTP 504 gateway timeout due to TLS renegotiation',
        suggestedFix: 'Update webhook client timeout to 8000ms & renew cert chain',
        slaConfidence: 'Response queued with 14m remaining',
      },
      policyChecks: [
        { name: 'SLA Time-Lock Guardrail', status: 'passed', detail: 'Escalation triggered within 30 seconds of ticket receipt' },
        { name: 'Legal Commitment Filter', status: 'passed', detail: 'Zero unauthorized compensation claims in proposed draft' },
        { name: 'Required Human Signoff Gate', status: 'passed', detail: 'Direct delivery blocked until engineer presses Confirm' },
      ],
      logs: [
        '[00.01s] [CLASSIFY] Ingested TCK-2026-8819. Customer tier: Enterprise SLA Platinum.',
        '[00.35s] [CLASSIFY] Priority set to P1-URGENT. Target response: < 20 min.',
        '[00.80s] [DRAFT] Analyzed endpoint logs: HTTP 504 TLS timeout diagnosed.',
        '[01.25s] [SAFETY] Verified draft text against customer support policy contracts.',
        '[01.60s] [ROUTE] Ticket enriched with fix and placed in Engineer review queue.',
      ],
    },
    fallbackOutput: {
      artifact: {
        triageStatus: 'DIRECT_PAGER_ALERT',
        escalationReason: 'SLA < 10m threshold reached + System Outage detected',
        onCallPaged: 'DevOps Primary On-Call (SMS + PagerDuty)',
        fallbackAction: 'Sent automated acknowledgement to client with live status page link',
      },
      policyChecks: [
        { name: 'Critical SLA Breached', status: 'warning', detail: 'Time-to-breach < 10 mins triggered fast-path escalation' },
        { name: 'PagerDuty Integration Gate', status: 'passed', detail: 'Direct engineer alert dispatched successfully' },
      ],
      logs: [
        '[00.01s] [CLASSIFY] Ticket processed.',
        '[00.40s] [CLASSIFY] WARNING: SLA urgency breached < 10 min window.',
        '[00.75s] [SAFETY] Immediate fast-path safety trigger activated.',
        '[01.05s] [ROUTE] Automated live status notice dispatched to customer.',
        '[01.30s] [ROUTE] Paged primary on-call engineer directly.',
      ],
    },
  },
};

export function AutomationEngineSimulator() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<ScenarioKey>('lead-qualification');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState<'visual' | 'logs' | 'artifact' | 'guardrails'>('visual');
  const [completed, setCompleted] = useState(false);
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const scenario = SCENARIOS[selectedScenarioKey];
  const activeData = simulateFailure ? scenario.fallbackOutput : scenario.normalOutput;

  const resetSimulationState = () => {
    setIsRunning(false);
    setCurrentStageIndex(-1);
    setCompleted(false);
    setDisplayedLogs([]);
  };

  const handleSelectScenario = (key: ScenarioKey) => {
    setSelectedScenarioKey(key);
    resetSimulationState();
  };

  const handleToggleFailure = (checked: boolean) => {
    setSimulateFailure(checked);
    resetSimulationState();
  };

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStageIndex(0);
    setCompleted(false);
    setDisplayedLogs([activeData.logs[0] ?? 'Starting workflow execution...']);

    let stage = 0;
    const stageInterval = setInterval(() => {
      stage += 1;
      if (stage < scenario.stages.length) {
        setCurrentStageIndex(stage);
        if (activeData.logs[stage]) {
          setDisplayedLogs((prev) => [...prev, activeData.logs[stage] as string]);
        }
      } else {
        clearInterval(stageInterval);
        setIsRunning(false);
        setCompleted(true);
        setCurrentStageIndex(scenario.stages.length);
        setDisplayedLogs(activeData.logs);
      }
    }, 700);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStageIndex(-1);
    setCompleted(false);
    setDisplayedLogs([]);
  };

  const handleCopyArtifact = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(activeData.artifact, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownloadRunbook = () => {
    const runbook = {
      scenario: scenario.title,
      timestamp: new Date().toISOString(),
      mode: simulateFailure ? 'FAILURE_RECOVERY_SIMULATION' : 'DETERMINISTIC_SUCCESS_RUN',
      input: scenario.inputPayload,
      executionTrace: {
        stages: scenario.stages.map((s) => ({
          stage: s.name,
          layer: s.type,
          status: completed ? 'COMPLETED' : 'PENDING',
        })),
        policyEvaluations: activeData.policyChecks,
        outputArtifact: activeData.artifact,
        telemetryLogs: activeData.logs,
      },
    };

    const blob = new Blob([JSON.stringify(runbook, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aias-runbook-${scenario.id}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-8" id="automation-simulator-root">
      {/* Header & Scenario Selection */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center border border-primary bg-primary/10 text-xs font-mono font-bold text-primary">
              {'//'}
            </span>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Live Architecture Simulator
            </p>
          </div>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
            Deterministic Automation Engine
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Test how deterministic guardrails and AI layers interact with full observability and zero hard failures.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-none border-2 border-border bg-card p-1.5 shadow-card">
            <label className="flex cursor-pointer items-center gap-2 px-2 text-xs font-mono font-bold uppercase text-foreground">
              <input
                type="checkbox"
                checked={simulateFailure}
                onChange={(e) => handleToggleFailure(e.target.checked)}
                className="h-4 w-4 rounded-none border-2 border-border accent-primary cursor-pointer"
              />
              <span className={simulateFailure ? 'text-destructive font-black' : 'text-muted-foreground'}>
                Simulate Risk Intercept
              </span>
            </label>
          </div>

          <Button
            onClick={runSimulation}
            disabled={isRunning}
            className="rounded-none border-2 border-primary bg-primary px-6 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card hover:-translate-y-0.5 hover:shadow-lg transition-all"
            aria-label="Execute workflow simulation"
          >
            {isRunning ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-spin text-primary-foreground" />
                Executing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4 fill-current" />
                Run Simulation
              </>
            )}
          </Button>

          <Button
            onClick={handleReset}
            variant="outline"
            disabled={isRunning || (currentStageIndex === -1 && !completed)}
            className="rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-wider hover:border-foreground"
            aria-label="Reset simulation"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Scenario Pill Tabs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4" role="tablist" aria-label="Select Scenario">
        {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => {
          const item = SCENARIOS[key];
          const isSelected = selectedScenarioKey === key;
          return (
            <button
              key={key}
              onClick={() => handleSelectScenario(key)}
              role="tab"
              aria-selected={isSelected}
              className={`flex flex-col items-start p-4 text-left border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-card font-bold'
                  : 'border-border bg-card hover:border-muted-foreground text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 border border-border bg-background">
                  {item.badge}
                </span>
                {isSelected && <Sparkles className="h-3.5 w-3.5 text-primary" />}
              </div>
              <p className="mt-2.5 font-mono text-xs font-bold uppercase tracking-wide text-foreground">
                {item.title}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Col: Pipeline Architecture & Stages (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          <SurfaceCard className="p-6 border-2 border-border">
            <div className="flex items-center justify-between border-b-2 border-border pb-4">
              <div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
                  Workflow Execution Pipeline
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {scenario.description}
                </p>
              </div>
              <span
                className={`font-mono text-xs font-bold uppercase px-2 py-1 border ${
                  completed
                    ? simulateFailure
                      ? 'border-destructive bg-destructive/10 text-destructive'
                      : 'border-emerald-600 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : isRunning
                    ? 'border-primary bg-primary/10 text-primary animate-pulse'
                    : 'border-border bg-muted text-muted-foreground'
                }`}
              >
                {completed
                  ? simulateFailure
                    ? 'SAFETY GATE INTERCEPTED'
                    : 'RUN COMPLETED (100% OK)'
                  : isRunning
                  ? `RUNNING STAGE ${currentStageIndex + 1}/${scenario.stages.length}`
                  : 'STANDBY'}
              </span>
            </div>

            {/* Stages Stack */}
            <div className="mt-6 space-y-4">
              {scenario.stages.map((stage, idx) => {
                const isPassed = completed || (isRunning && currentStageIndex > idx);
                const isCurrent = isRunning && currentStageIndex === idx;
                const isUpcoming = !isRunning && !completed && currentStageIndex < idx;

                return (
                  <motion.div
                    key={stage.id}
                    layout
                    className={`relative border-2 p-4 transition-all ${
                      isCurrent
                        ? 'border-primary bg-primary/5 shadow-card translate-x-1'
                        : isPassed
                        ? 'border-border bg-card'
                        : 'border-border/60 bg-muted/20 opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center border-2 font-mono text-xs font-black transition-colors ${
                            isCurrent
                              ? 'border-primary bg-primary text-primary-foreground animate-pulse'
                              : isPassed
                              ? 'border-emerald-600 bg-emerald-500 text-white'
                              : 'border-border bg-muted text-muted-foreground'
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : isCurrent ? (
                            <Cpu className="h-4 w-4" />
                          ) : (
                            <span>0{idx + 1}</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-mono text-sm font-bold uppercase text-foreground">
                              {stage.name}
                            </h4>
                            <span
                              className={`font-mono text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 border ${
                                stage.type === 'deterministic'
                                  ? 'border-border bg-background text-foreground'
                                  : 'border-primary/40 bg-primary/10 text-primary'
                              }`}
                            >
                              {stage.type}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {stage.description}
                          </p>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div className="text-right">
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-primary animate-pulse">
                            PROCESSING
                          </span>
                        )}
                        {isPassed && (
                          <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            VALIDATED
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="font-mono text-[10px] text-muted-foreground">
                            QUEUED
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Input Payload Preview */}
            <div className="mt-6 border-t-2 border-border pt-4">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Sample Input Context
              </p>
              <pre className="max-h-36 overflow-auto border-2 border-border bg-muted/40 p-3 font-mono text-xs text-foreground">
                {JSON.stringify(scenario.inputPayload, null, 2)}
              </pre>
            </div>
          </SurfaceCard>
        </div>

        {/* Right Col: Live Logs, Policy Checks, & Artifact Inspector (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          <SurfaceCard className="p-6 border-2 border-border h-full flex flex-col">
            {/* Inspector Navigation Tabs */}
            <div className="flex border-b-2 border-border pb-3 gap-2">
              <button
                onClick={() => setActiveTab('visual')}
                className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'visual'
                    ? 'border-2 border-primary bg-primary text-primary-foreground'
                    : 'border-2 border-border bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                Artifact
              </button>
              <button
                onClick={() => setActiveTab('guardrails')}
                className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'guardrails'
                    ? 'border-2 border-primary bg-primary text-primary-foreground'
                    : 'border-2 border-border bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                Policies ({activeData.policyChecks.length})
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'logs'
                    ? 'border-2 border-primary bg-primary text-primary-foreground'
                    : 'border-2 border-border bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                Logs
              </button>
            </div>

            {/* Tab Body */}
            <div className="mt-4 flex-1">
              {activeTab === 'visual' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Structured Output Artifact
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopyArtifact}
                        className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-primary hover:underline cursor-pointer"
                      >
                        <Copy className="h-3 w-3" />
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        onClick={handleDownloadRunbook}
                        className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-primary hover:underline cursor-pointer"
                      >
                        <Download className="h-3 w-3" />
                        Export
                      </button>
                    </div>
                  </div>
                  <pre className="max-h-80 overflow-auto border-2 border-border bg-muted/40 p-3 font-mono text-xs text-foreground">
                    {JSON.stringify(activeData.artifact, null, 2)}
                  </pre>
                  {completed && (
                    <div className="rounded-none border-2 border-primary bg-primary/10 p-3">
                      <p className="font-mono text-xs font-bold uppercase text-foreground">
                        ✓ Audit Trail Verified
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Deterministic contracts ensured all execution boundaries remained within defined tolerances.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'guardrails' && (
                <div className="space-y-3">
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Deterministic Policy Evaluations
                  </p>
                  <div className="space-y-2.5">
                    {activeData.policyChecks.map((check) => (
                      <div
                        key={check.name}
                        className={`border-2 p-3 ${
                          check.status === 'passed'
                            ? 'border-emerald-600/50 bg-emerald-500/5'
                            : check.status === 'failed'
                            ? 'border-destructive bg-destructive/5'
                            : 'border-amber-500/50 bg-amber-500/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold uppercase text-foreground">
                            {check.name}
                          </span>
                          <span
                            className={`font-mono text-[10px] font-black uppercase px-1.5 py-0.5 border ${
                              check.status === 'passed'
                                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                                : check.status === 'failed'
                                ? 'border-destructive text-destructive bg-destructive/10'
                                : 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                            }`}
                          >
                            {check.status}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          {check.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'logs' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Terminal className="h-3.5 w-3.5" />
                      Live Execution Trace
                    </p>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {displayedLogs.length} events logged
                    </span>
                  </div>
                  <div className="h-72 overflow-auto border-2 border-border bg-black p-3 font-mono text-xs text-emerald-400 space-y-1.5">
                    {displayedLogs.length === 0 ? (
                      <p className="text-zinc-500 italic">Click &quot;Run Simulation&quot; to stream runtime telemetry...</p>
                    ) : (
                      displayedLogs.map((log, idx) => (
                        <p key={idx} className="leading-relaxed">
                          {log}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Diagnostic Link */}
            <div className="mt-6 border-t-2 border-border pt-4">
              <Button
                asChild
                className="w-full rounded-none border-2 border-primary bg-primary font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                <a href="/book">
                  Book Architecture Diagnostic
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </div>
  );
}

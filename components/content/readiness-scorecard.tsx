'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CheckSquare,
  Square,
  ShieldCheck,
  AlertTriangle,
  FileDown,
  Copy,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ListChecks,
  Activity,
  Layers,
  FileCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SurfaceCard } from '@/components/ui/section-primitives';

interface ChecklistItem {
  id: string;
  pillar: string;
  label: string;
  detail: string;
  impactWeight: number; // 1-3
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Pillar 1: Data & Schema Contracts
  {
    id: 'data-1',
    pillar: 'Data & Schema Contracts',
    label: 'Strict Runtime Type Validation (Zod/JSON Schema)',
    detail: 'All incoming payloads and tool outputs are validated against strict schema contracts before model ingestion.',
    impactWeight: 3,
  },
  {
    id: 'data-2',
    pillar: 'Data & Schema Contracts',
    label: 'Automated PII & Credential Scrubbing',
    detail: 'Deterministic regex & entropy filters remove API keys, credit cards, SINs, and personal health data before external API calls.',
    impactWeight: 3,
  },
  {
    id: 'data-3',
    pillar: 'Data & Schema Contracts',
    label: 'Deterministic Deduplication & Idempotency',
    detail: 'Webhook and message consumers enforce idempotent replay keys to prevent duplicate execution loops.',
    impactWeight: 2,
  },
  {
    id: 'data-4',
    pillar: 'Data & Schema Contracts',
    label: 'Versioned Evaluation Test Vectors',
    detail: 'Fixed golden datasets are stored in version control to evaluate prompt and schema migrations.',
    impactWeight: 2,
  },

  // Pillar 2: Decision Boundaries & Model Routing
  {
    id: 'boundary-1',
    pillar: 'Decision Boundaries & Model Routing',
    label: 'Separation of Arithmetic & Logic from AI Inference',
    detail: 'Financial calculations, tax formulas, and permissions are computed deterministically in code, never by the model.',
    impactWeight: 3,
  },
  {
    id: 'boundary-2',
    pillar: 'Decision Boundaries & Model Routing',
    label: 'Explicit Fallback Paths for Edge Failures',
    detail: 'Pre-configured deterministic fallbacks execute when model latency spikes or rate limits are encountered.',
    impactWeight: 3,
  },
  {
    id: 'boundary-3',
    pillar: 'Decision Boundaries & Model Routing',
    label: 'Prompt & Model Version Pinning',
    detail: 'Prompts are managed as code in Git with locked model hashes, temperature zero defaults, and peer review requirements.',
    impactWeight: 2,
  },
  {
    id: 'boundary-4',
    pillar: 'Decision Boundaries & Model Routing',
    label: 'Multi-Tenant Isolation & Partitioning',
    detail: 'Tenant data and embeddings are strictly isolated at the database layer with cryptographic boundaries.',
    impactWeight: 3,
  },

  // Pillar 3: Observability & Evaluation Integrity
  {
    id: 'obs-1',
    pillar: 'Observability & Evaluation Integrity',
    label: 'Continuous Regression & Factual Grounding Scoring',
    detail: 'Automated benchmark harnesses test accuracy and hallucination rates before production releases.',
    impactWeight: 3,
  },
  {
    id: 'obs-2',
    pillar: 'Observability & Evaluation Integrity',
    label: 'Token & FinOps Cost Ceiling Alarms',
    detail: 'Budget thresholds automatically halt or throttle workloads when monthly token spend reaches 80% and 95%.',
    impactWeight: 2,
  },
  {
    id: 'obs-3',
    pillar: 'Observability & Evaluation Integrity',
    label: 'End-to-End Tracing & Telemetry Spans',
    detail: 'Every model interaction produces an immutable trace log with latency, prompt tokens, and output validation receipts.',
    impactWeight: 2,
  },
  {
    id: 'obs-4',
    pillar: 'Observability & Evaluation Integrity',
    label: 'Incident Replay & Regression Reproduction',
    detail: 'Failed production runs can be re-executed in a sandbox with identical historical state for rapid RCA.',
    impactWeight: 2,
  },

  // Pillar 4: Human-in-the-Loop & Governance
  {
    id: 'gov-1',
    pillar: 'Human-in-the-Loop & Governance',
    label: 'Mandatory Human Approval on Irreversible Actions',
    detail: 'Financial transfers, account deletions, and outward contract commitments require explicit human confirmation.',
    impactWeight: 3,
  },
  {
    id: 'gov-2',
    pillar: 'Human-in-the-Loop & Governance',
    label: '1-Click Instant Rollback Runbooks',
    detail: 'Engineers can instantly revert model prompts, tool definitions, and routing tables to previous stable commits in < 30 seconds.',
    impactWeight: 3,
  },
  {
    id: 'gov-3',
    pillar: 'Human-in-the-Loop & Governance',
    label: 'PIPEDA & Canadian Data Residency Compliance',
    detail: 'Data handling adheres to Canadian privacy legislation with explicit consent logging and retention schedules.',
    impactWeight: 2,
  },
  {
    id: 'gov-4',
    pillar: 'Human-in-the-Loop & Governance',
    label: 'Clear Operational Ownership & Escalation Matrix',
    detail: 'Every automated agent has a designated named engineer owner and documented escalation response SLAs.',
    impactWeight: 2,
  },
];

export function ReadinessScorecard() {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(() => new Set(['data-1', 'boundary-1', 'gov-1']));
  const [copied, setCopied] = useState(false);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    setCheckedIds(new Set(CHECKLIST_ITEMS.map((item) => item.id)));
  };

  const clearAll = () => {
    setCheckedIds(new Set());
  };

  const stats = useMemo(() => {
    const totalWeight = CHECKLIST_ITEMS.reduce((sum, item) => sum + item.impactWeight, 0);
    const checkedWeight = CHECKLIST_ITEMS.filter((item) => checkedIds.has(item.id)).reduce(
      (sum, item) => sum + item.impactWeight,
      0
    );

    const scorePercentage = Math.round((checkedWeight / totalWeight) * 100);

    const pillars = Array.from(new Set(CHECKLIST_ITEMS.map((item) => item.pillar))).map((pillarName) => {
      const pillarItems = CHECKLIST_ITEMS.filter((item) => item.pillar === pillarName);
      const pillarChecked = pillarItems.filter((item) => checkedIds.has(item.id));
      const pWeight = pillarItems.reduce((s, i) => s + i.impactWeight, 0);
      const pCheckedWeight = pillarChecked.reduce((s, i) => s + i.impactWeight, 0);
      const percent = Math.round((pCheckedWeight / pWeight) * 100);

      return {
        name: pillarName,
        total: pillarItems.length,
        checked: pillarChecked.length,
        percent,
      };
    });

    let tier = {
      label: 'CRITICAL GOVERNANCE RISK',
      color: 'text-destructive border-destructive bg-destructive/10',
      description:
        'Major governance and boundary gaps detected. High probability of operational variance, silent failure loops, or compliance exposure.',
      recommendation: 'Immediate Diagnostic Sprint recommended to map boundaries and establish contract gates before further production deployment.',
    };

    if (scorePercentage >= 90) {
      tier = {
        label: 'ENTERPRISE CONTROL-PLANE',
        color: 'text-emerald-600 dark:text-emerald-400 border-emerald-600 bg-emerald-500/10',
        description:
          'Exceptional governance posture. Your architecture incorporates deterministic contracts, robust evaluation gates, and auditable runbooks.',
        recommendation: 'Target advanced multi-agent orchestration or automated FinOps routing optimizations.',
      };
    } else if (scorePercentage >= 70) {
      tier = {
        label: 'PRODUCTION-READY GOVERNANCE',
        color: 'text-primary border-primary bg-primary/10',
        description:
          'Strong core safeguards in place. Minor optimization opportunities remain in evaluation telemetry and human escalation protocols.',
        recommendation: 'Focus on automated canary evaluation and incident replay reproducibility.',
      };
    } else if (scorePercentage >= 40) {
      tier = {
        label: 'EMERGING GOVERNANCE POSTURE',
        color: 'text-amber-600 dark:text-amber-400 border-amber-600 bg-amber-500/10',
        description:
          'Foundational controls exist but significant blind spots remain in error handling, evaluation integrity, or arithmetic boundaries.',
        recommendation: 'Prioritize separating deterministic math/permissions from AI prompts and introduce structured runtime validation.',
      };
    }

    return {
      scorePercentage,
      checkedCount: checkedIds.size,
      totalCount: CHECKLIST_ITEMS.length,
      pillars,
      tier,
    };
  }, [checkedIds]);

  const generateReportJson = () => {
    return {
      assessment: 'AIAS AI Governance Readiness Audit',
      date: new Date().toISOString(),
      score: `${stats.scorePercentage}%`,
      tier: stats.tier.label,
      summary: stats.tier.description,
      pillarBreakdown: stats.pillars.map((p) => ({
        pillar: p.name,
        score: `${p.percent}%`,
        itemsPassed: `${p.checked}/${p.total}`,
      })),
      gapsIdentified: CHECKLIST_ITEMS.filter((item) => !checkedIds.has(item.id)).map((item) => ({
        pillar: item.pillar,
        requirement: item.label,
        impactWeight: `${item.impactWeight}/3`,
      })),
    };
  };

  const handleDownloadReport = () => {
    const report = generateReportJson();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aias-governance-audit-${stats.scorePercentage}pct.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyReport = async () => {
    try {
      const report = generateReportJson();
      await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="w-full space-y-8" id="readiness-scorecard-root">
      {/* Top Header & Live Scorecard Gauge */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Score Overview Banner */}
        <SurfaceCard className="lg:col-span-8 p-6 sm:p-8 border-2 border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center border border-primary bg-primary/10 text-xs font-mono font-bold text-primary">
                {'//'}
              </span>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                Interactive Governance Scorecard
              </p>
            </div>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
              Evaluate Your AI Stack Maturity
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Check off the controls your organization currently enforces in production. Get instant maturity tiering, gap analysis, and tailored architecture recommendations.
            </p>
          </div>

          <div className="mt-6 border-t-2 border-border pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.pillars.map((pillar) => (
              <div key={pillar.name} className="space-y-1">
                <p className="font-mono text-[10px] font-bold uppercase text-muted-foreground truncate" title={pillar.name}>
                  {pillar.name}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-foreground">{pillar.percent}%</span>
                  <span className="text-xs text-muted-foreground">({pillar.checked}/{pillar.total})</span>
                </div>
                <div className="w-full h-1.5 bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${pillar.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        {/* Live Score Dial */}
        <SurfaceCard className="lg:col-span-4 p-6 sm:p-8 border-2 border-primary bg-card flex flex-col items-center justify-center text-center shadow-card">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Overall Readiness Score
          </p>
          <div className="my-4 flex items-baseline justify-center">
            <span className="text-6xl font-black tracking-tight text-foreground font-mono">
              {stats.scorePercentage}
            </span>
            <span className="text-2xl font-bold text-primary ml-1">%</span>
          </div>

          <span
            className={`font-mono text-xs font-black uppercase px-3 py-1 border-2 tracking-wider ${stats.tier.color}`}
          >
            {stats.tier.label}
          </span>

          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {stats.tier.description}
          </p>

          <div className="mt-6 flex gap-2 w-full">
            <Button
              onClick={handleCopyReport}
              variant="outline"
              size="sm"
              className="flex-1 rounded-none border-2 border-border font-mono text-[10px] font-bold uppercase tracking-wider"
              aria-label="Copy audit scorecard JSON"
            >
              <Copy className="mr-1.5 h-3 w-3" />
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button
              onClick={handleDownloadReport}
              variant="outline"
              size="sm"
              className="flex-1 rounded-none border-2 border-border font-mono text-[10px] font-bold uppercase tracking-wider"
              aria-label="Download audit scorecard report"
            >
              <FileDown className="mr-1.5 h-3 w-3" />
              Export
            </Button>
          </div>
        </SurfaceCard>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-y-2 border-border py-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold uppercase text-foreground">
            Checklist Items: {stats.checkedCount} of {stats.totalCount} Implemented
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={selectAll}
            variant="ghost"
            size="sm"
            className="font-mono text-xs font-bold uppercase text-muted-foreground hover:text-foreground"
          >
            Select All
          </Button>
          <span className="text-border">|</span>
          <Button
            onClick={clearAll}
            variant="ghost"
            size="sm"
            className="font-mono text-xs font-bold uppercase text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Interactive 16-Point Checklist Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {stats.pillars.map((pillar) => (
          <SurfaceCard key={pillar.name} className="border-2 border-border p-6 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-border pb-3">
              <h3 className="font-mono text-sm font-bold uppercase text-foreground">
                {pillar.name}
              </h3>
              <span className="font-mono text-xs font-bold text-primary">
                {pillar.percent}% Complete
              </span>
            </div>

            <div className="space-y-3">
              {CHECKLIST_ITEMS.filter((item) => item.pillar === pillar.name).map((item) => {
                const isChecked = checkedIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-start gap-3 p-3 border-2 cursor-pointer transition-all ${
                      isChecked
                        ? 'border-primary/50 bg-primary/5 shadow-sm'
                        : 'border-border bg-card hover:border-muted-foreground'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 shrink-0 text-foreground focus:outline-none"
                      aria-label={`Toggle ${item.label}`}
                    >
                      {isChecked ? (
                        <CheckSquare className="h-5 w-5 text-primary" />
                      ) : (
                        <Square className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`font-mono text-xs font-bold uppercase ${isChecked ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {item.label}
                        </p>
                        <span className="font-mono text-[9px] uppercase px-1 border border-border text-muted-foreground shrink-0">
                          Weight: {item.impactWeight}x
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </SurfaceCard>
        ))}
      </div>

      {/* Strategic Recommendation & Booking CTA */}
      <SurfaceCard className="border-2 border-primary bg-card p-6 sm:p-8 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                Recommended Action Plan
              </p>
            </div>
            <h3 className="text-xl font-bold uppercase text-foreground">
              {stats.tier.recommendation}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We specialize in engineering the deterministic control-planes, evaluation benchmarks, and governance guardrails required to take experimental AI stacks into high-reliability production.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button
              asChild
              size="lg"
              className="rounded-none border-2 border-primary bg-primary font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card hover:-translate-y-0.5 transition-all"
            >
              <Link href="/book">
                Book Diagnostic Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-widest hover:border-foreground transition-all"
            >
              <Link href="/contact">
                Submit Stack Intake
              </Link>
            </Button>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}

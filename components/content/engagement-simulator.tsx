'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Download,
  Copy,
  Sliders,
  Shield,
  Layers,
  Calendar,
} from 'lucide-react';

import { SurfaceCard } from '@/components/ui/section-primitives';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type Mode = 'advisory' | 'co-build' | 'managed';

interface ModeDetails {
  title: string;
  badge: string;
  summary: string;
  deliverables: string[];
}

const MODE_DETAILS: Record<Mode, ModeDetails> = {
  advisory: {
    title: 'Advisory & Governance Sprint',
    badge: '2-3 Weeks',
    summary: 'Focused architecture guidance, risk registers, and deterministic policy reviews for capable in-house development teams.',
    deliverables: [
      'Deterministic Decision & Boundary Map',
      'Evaluation Harness & Factual Grounding Spec',
      'Bi-weekly Architecture Review Sessions',
    ],
  },
  'co-build': {
    id: 'co-build',
    title: 'Co-Build Implementation Sprint',
    badge: '4-8 Weeks',
    summary: 'Joint pair-architecting with your team to deliver governed agents, contract gates, and auditable runtime pipelines.',
    deliverables: [
      'Production-Ready Control-Plane Infrastructure',
      'Deterministic Input/Output Zod Schemas',
      'Automated Canary Evaluation & Rollback Runbooks',
      'Team Capability Transfer & Pairing',
    ],
  } as unknown as ModeDetails,
  managed: {
    title: 'Managed Control-Plane Refinement',
    badge: 'Ongoing Oversight',
    summary: 'Full lifecycle operation, continuous evaluation integrity, and proactive incident mitigation for mission-critical AI workloads.',
    deliverables: [
      'Dedicated Architect Response SLA',
      'Monthly FinOps Token & Workload Audits',
      'Proactive Prompt & Tool Regression Hardening',
      'Audit-Ready Compliance Artifacts (PIPEDA)',
    ],
  },
};

export function EngagementSimulator() {
  const [step, setStep] = useState(1);
  const [manualHours, setManualHours] = useState(20);
  const [integrationCount, setIntegrationCount] = useState(4);
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium');
  const [timeline, setTimeline] = useState('8-12 weeks');
  const [outcome, setOutcome] = useState('Eliminate manual review bottlenecks while ensuring strict deterministic output guardrails.');
  const [copied, setCopied] = useState(false);

  const recommendation = useMemo((): { mode: Mode; rationale: string[] } => {
    const complexity = manualHours + integrationCount * 4;
    if (riskTolerance === 'low' || complexity > 45) {
      return {
        mode: 'managed',
        rationale: [
          'High compliance or mission-critical footprint requires dedicated governance oversight.',
          'Workflow complexity (> 45 index) benefits from continuous runbook ownership and incident monitoring.',
        ],
      };
    }

    if (complexity > 30 || riskTolerance === 'medium') {
      return {
        mode: 'co-build',
        rationale: [
          'Moderate complexity initiative requiring joint architecture ownership and production pairing.',
          'Co-build ensures internal engineering team upskilling while de-risking deterministic guardrail implementation.',
        ],
      };
    }

    return {
      mode: 'advisory',
      rationale: [
        'Current workflow scope is ideal for guided internal execution with structured architecture gates.',
        'Advisory engagement delivers clear blueprints while preserving team independence.',
      ],
    };
  }, [integrationCount, manualHours, riskTolerance]);

  const brief = useMemo(
    () => ({
      briefGeneratedAt: new Date().toISOString(),
      currentAssessment: {
        manualHoursPerWeek: manualHours,
        criticalIntegrationsCount: integrationCount,
        complexityScore: manualHours + integrationCount * 4,
      },
      constraints: {
        riskToleranceTier: riskTolerance,
        targetTimeline: timeline,
      },
      coreObjective: outcome,
      suggestedEngagementModel: recommendation.mode,
      details: MODE_DETAILS[recommendation.mode],
      architecturalRationale: recommendation.rationale,
    }),
    [manualHours, integrationCount, riskTolerance, timeline, outcome, recommendation]
  );

  const handleCopyBrief = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(brief, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownloadBrief = () => {
    const blob = new Blob([JSON.stringify(brief, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aias-engagement-brief-${recommendation.mode}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6" id="engagement-simulator-root">
      <SurfaceCard className="border-2 border-border p-6 sm:p-8">
        {/* Step Progress Header */}
        <div className="flex items-center justify-between border-b-2 border-border pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center border border-primary bg-primary/10 text-xs font-mono font-bold text-primary">
              {'//'}
            </span>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Step {step} of 4: {step === 1 ? 'Scope' : step === 2 ? 'Constraints' : step === 3 ? 'Objectives' : 'Generated Brief'}
            </p>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 w-8 border transition-all ${
                  step === s
                    ? 'border-primary bg-primary'
                    : step > s
                    ? 'border-emerald-600 bg-emerald-500'
                    : 'border-border bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Workload & Scope */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold uppercase text-foreground">
                1. Current Workload & Scope
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Estimate the operational friction and integration surfaces involved in your target automation.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block font-mono text-xs font-bold uppercase text-foreground">
                  Manual Routine Hours / Week
                </label>
                <Input
                  min={1}
                  max={200}
                  type="number"
                  value={manualHours}
                  onChange={(e) => setManualHours(Math.max(1, Number(e.target.value) || 1))}
                  className="rounded-none border-2 border-border font-mono text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  Total human hours spent weekly verifying or executing this process.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-xs font-bold uppercase text-foreground">
                  Critical Tool Integrations in Scope
                </label>
                <Input
                  min={1}
                  max={30}
                  type="number"
                  value={integrationCount}
                  onChange={(e) => setIntegrationCount(Math.max(1, Number(e.target.value) || 1))}
                  className="rounded-none border-2 border-border font-mono text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  Databases, CRMs, ERPs, APIs, or document repositories connected.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Constraints & Risk Profile */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold uppercase text-foreground">
                2. Risk Tolerance & Timeline Constraints
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Define your operating risk profile and required implementation window.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-mono text-xs font-bold uppercase text-foreground mb-2">
                  Operating Risk Tolerance
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {(['low', 'medium', 'high'] as const).map((level) => {
                    const isSelected = riskTolerance === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setRiskTolerance(level)}
                        className={`p-3 text-center border-2 transition-all font-mono text-xs uppercase font-bold cursor-pointer ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary font-black shadow-sm'
                            : 'border-border bg-card text-muted-foreground hover:border-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {level === 'low' ? 'Low (Regulated)' : level === 'medium' ? 'Medium (Balanced)' : 'High (Rapid R&D)'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block font-mono text-xs font-bold uppercase text-foreground">
                  Target Implementation Timeline
                </label>
                <Input
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="e.g. 6-8 weeks, Q3 rollout"
                  className="rounded-none border-2 border-border font-mono text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Core Desired Outcomes */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold uppercase text-foreground">
                3. Primary Operational Objectives
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                What measurable outcome matters most to leadership upon deployment?
              </p>
            </div>

            <div className="space-y-2">
              <label className="block font-mono text-xs font-bold uppercase text-foreground">
                Desired Business Outcome & Success Criteria
              </label>
              <Textarea
                rows={4}
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="rounded-none border-2 border-border font-mono text-xs leading-relaxed"
                placeholder="e.g. Reduce manual review cycle from 48 hours to 10 minutes with zero hallucinated customer quotes."
              />
            </div>
          </div>
        )}

        {/* Step 4: Executive Brief Output */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-border pb-4 gap-2">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                  Recommended Engagement Model
                </span>
                <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mt-0.5">
                  {MODE_DETAILS[recommendation.mode]?.title}
                </h2>
              </div>
              <span className="font-mono text-xs font-bold uppercase px-3 py-1 border border-primary bg-primary/10 text-primary self-start sm:self-auto">
                {MODE_DETAILS[recommendation.mode]?.badge}
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {MODE_DETAILS[recommendation.mode]?.summary}
            </p>

            {/* Key Deliverables */}
            <div className="border-2 border-border bg-muted/20 p-5">
              <p className="font-mono text-xs font-bold uppercase text-foreground mb-3">
                Core Deliverables in Scope:
              </p>
              <ul className="space-y-2">
                {MODE_DETAILS[recommendation.mode]?.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Architecture Rationale */}
            <div className="border-2 border-border bg-card p-5">
              <p className="font-mono text-xs font-bold uppercase text-foreground mb-2">
                Architectural Rationale:
              </p>
              <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-4">
                {recommendation.rationale.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Brief JSON Export Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                onClick={handleCopyBrief}
                variant="outline"
                size="sm"
                className="rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-wider hover:border-foreground"
              >
                <Copy className="mr-1.5 h-3.5 w-3.5" />
                {copied ? 'Copied to Clipboard!' : 'Copy Brief JSON'}
              </Button>
              <Button
                onClick={handleDownloadBrief}
                variant="outline"
                size="sm"
                className="rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-wider hover:border-foreground"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Download Brief (.json)
              </Button>
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="mt-8 border-t-2 border-border pt-6 flex justify-between items-center">
          <Button
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            disabled={step === 1}
            variant="outline"
            className="rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {step < 4 ? (
            <Button
              onClick={() => setStep((prev) => Math.min(4, prev + 1))}
              className="rounded-none border-2 border-primary bg-primary font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card hover:-translate-y-0.5 transition-all"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              asChild
              className="rounded-none border-2 border-primary bg-primary font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card hover:-translate-y-0.5 transition-all"
            >
              <Link href="/book">
                Book Strategy Call with this Brief
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </SurfaceCard>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  Play,
  Copy,
  Check,
  Sparkles,
  Sliders,
  AlertTriangle,
  FileCode,
  ArrowRight,
  ExternalLink,
  Lock,
  RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

interface PresetScenario {
  id: string;
  name: string;
  category: string;
  sampleInput: string;
  suggestedRules: {
    maskPii: boolean;
    blockUnapprovedFinancials: boolean;
    enforceSchema: boolean;
    requireHumanSignOff: boolean;
  };
}

const PRESETS: PresetScenario[] = [
  {
    id: 'refund-dispatch',
    name: 'Customer Refund & Credit Card Request',
    category: 'E-Commerce',
    sampleInput:
      'Customer requested $420.00 refund for damaged item. Card on file: 4532-8921-3829-1029, email: alex.miller@example.com. Requested immediate refund to card without manager signature.',
    suggestedRules: {
      maskPii: true,
      blockUnapprovedFinancials: true,
      enforceSchema: true,
      requireHumanSignOff: true,
    },
  },
  {
    id: 'invoice-parsing',
    name: 'Invoice Parsing & Supplier PO Dispatch',
    category: 'Finance / AP',
    sampleInput:
      'Vendor Acme Corp submitted Invoice #INV-9821 for $8,450.00. PO Number referenced: PO-4402. Line items: Server hardware $7,000, Delivery $1,450. Match confidence: 84%.',
    suggestedRules: {
      maskPii: false,
      blockUnapprovedFinancials: true,
      enforceSchema: true,
      requireHumanSignOff: true,
    },
  },
  {
    id: 'support-escalation',
    name: 'Support VIP Ticket Triage',
    category: 'Support',
    sampleInput:
      'Enterprise user reported outage on webhook sync endpoint. Sentiment: High frustration. Customer Tier: Enterprise SLA (2 hour resolution).',
    suggestedRules: {
      maskPii: true,
      blockUnapprovedFinancials: false,
      enforceSchema: true,
      requireHumanSignOff: false,
    },
  },
];

const DEFAULT_PRESET: PresetScenario = PRESETS[0]!;

export function PolicyStudioClient() {
  const [selectedPreset, setSelectedPreset] = useState<PresetScenario>(DEFAULT_PRESET);
  const [promptText, setPromptText] = useState<string>(DEFAULT_PRESET.sampleInput);

  // Policy rules
  const [maskPii, setMaskPii] = useState<boolean>(true);
  const [blockFinancials, setBlockFinancials] = useState<boolean>(true);
  const [enforceSchema, setEnforceSchema] = useState<boolean>(true);
  const [requireHumanSignOff, setRequireHumanSignOff] = useState<boolean>(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(90);

  // Evaluation results
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<{
    status: 'PASSED' | 'INTERCEPTED' | 'ESCALATED';
    violations: string[];
    redactedPayload: string;
    decisionTelemetry: {
      evaluatedRules: number;
      latencyMs: number;
      confidenceScore: number;
      deterministicRoute: string;
    };
    generatedCode: string;
  } | null>(null);

  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const handleSelectPreset = (preset: PresetScenario) => {
    setSelectedPreset(preset);
    setPromptText(preset.sampleInput);
    setMaskPii(preset.suggestedRules.maskPii);
    setBlockFinancials(preset.suggestedRules.blockUnapprovedFinancials);
    setEnforceSchema(preset.suggestedRules.enforceSchema);
    setRequireHumanSignOff(preset.suggestedRules.requireHumanSignOff);
    setEvalResult(null);
  };

  const handleRunEvaluation = () => {
    setIsEvaluating(true);

    setTimeout(() => {
      let status: 'PASSED' | 'INTERCEPTED' | 'ESCALATED' = 'PASSED';
      const violations: string[] = [];
      let redacted = promptText;

      // PII check
      if (maskPii) {
        if (/(\d{4}[-\s]?){4}/.test(promptText)) {
          redacted = redacted.replace(/(\d{4}[-\s]?){4}/g, '[REDACTED_PAYMENT_CARD]');
          violations.push('Policy G101: Detected & Masked Card Details');
        }
        if (/[\w.-]+@[\w.-]+\.\w+/.test(promptText)) {
          redacted = redacted.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[REDACTED_EMAIL]');
          violations.push('Policy G102: Detected & Masked Email Address');
        }
      }

      // Financial threshold check
      const amountMatch = promptText.match(/\$(\d+[\d,.]*)/);
      if (blockFinancials && amountMatch && amountMatch[1]) {
        const val = parseFloat(amountMatch[1].replace(/,/g, ''));
        if (val > 100) {
          status = 'INTERCEPTED';
          violations.push(
            `Policy F204: Action involves financial movement ($${val.toLocaleString()}) > $100 limit without supervisor approval.`
          );
        }
      }

      // Confidence check
      const simulatedConfidence = selectedPreset.id === 'invoice-parsing' ? 84 : 96;
      if (requireHumanSignOff && simulatedConfidence < confidenceThreshold) {
        status = 'ESCALATED';
        violations.push(
          `Policy C301: Extraction confidence (${simulatedConfidence}%) falls below required threshold (${confidenceThreshold}%). Routing to Operator Review.`
        );
      }

      const generatedZod = `import { z } from 'zod';

export const ${selectedPreset.id.replace(/-/g, '_')}_policy = z.object({
  payload_id: z.string().uuid(),
  timestamp: z.string().datetime(),
  domain: z.literal('${selectedPreset.category}'),
  confidence_score: z.number().min(${confidenceThreshold / 100}),
  pii_masking_applied: z.literal(${maskPii}),
  financial_gate: z.object({
    requires_signoff: z.literal(${blockFinancials}),
    max_unsupervised_amount: z.literal(100),
  }),
  operator_fallback: z.enum(['AUTO_DISPATCH', 'HOLD_FOR_OPERATOR', 'REJECT']).default('${
    status === 'PASSED' ? 'AUTO_DISPATCH' : 'HOLD_FOR_OPERATOR'
  }'),
});`;

      setEvalResult({
        status,
        violations,
        redactedPayload: redacted,
        decisionTelemetry: {
          evaluatedRules: (maskPii ? 2 : 0) + (blockFinancials ? 1 : 0) + (enforceSchema ? 1 : 0) + (requireHumanSignOff ? 1 : 0) + 3,
          latencyMs: 18,
          confidenceScore: simulatedConfidence,
          deterministicRoute:
            status === 'PASSED'
              ? 'GATEWAY::PROCEED_EXECUTION'
              : status === 'INTERCEPTED'
              ? 'GATEWAY::INTERCEPT_AND_LOCK'
              : 'GATEWAY::OPERATOR_TRIAGE_QUEUE',
        },
        generatedCode: generatedZod,
      });

      setIsEvaluating(false);
    }, 300);
  };

  const handleCopyCode = () => {
    if (evalResult?.generatedCode) {
      navigator.clipboard.writeText(evalResult.generatedCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="space-y-12">
      {/* Scenario Presets Selector */}
      <div className="border-2 border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            Step 01 // Select or Define Execution Scenario
          </span>
        </div>
        <h2 className="font-mono text-lg font-black uppercase text-foreground">
          Choose a Pre-Configured Test Payload
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`border-2 p-4 text-left font-mono transition-all cursor-pointer ${
                selectedPreset.id === preset.id
                  ? 'border-primary bg-primary/10 shadow-[2px_2px_0px_0px_hsl(var(--primary))]'
                  : 'border-border bg-background hover:border-foreground'
              }`}
              type="button"
            >
              <span className="border border-border bg-background px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                {preset.category}
              </span>
              <p className="mt-2 text-xs font-bold uppercase text-foreground">{preset.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Interactive Controls & Input Form */}
        <div className="lg:col-span-6 space-y-6">
          {/* Prompt / Payload Box */}
          <div className="border-2 border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <label className="font-mono text-xs font-bold uppercase text-foreground">
                Simulated AI Prompt / Unstructured Payload:
              </label>
              <button
                onClick={() => setPromptText(selectedPreset.sampleInput)}
                className="font-mono text-[11px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
                type="button"
              >
                <RefreshCw className="h-3 w-3" />
                Reset
              </button>
            </div>
            <textarea
              rows={5}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full border-2 border-border bg-background p-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
              placeholder="Enter sample prompt or unstructured text..."
            />
          </div>

          {/* Policy Gates Configuration */}
          <div className="border-2 border-border bg-card p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-border pb-3">
              <Sliders className="h-4 w-4 text-primary" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                Deterministic Boundary Policy Rules
              </h3>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between border border-border bg-surface-muted p-3 cursor-pointer">
                <div>
                  <p className="font-mono text-xs font-bold uppercase text-foreground">
                    1. Mask Sensitive PII (Credit Cards & Emails)
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Deterministic regex scrubbing before AI processing
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={maskPii}
                  onChange={(e) => setMaskPii(e.target.checked)}
                  className="h-4 w-4 rounded-none border-2 border-border accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between border border-border bg-surface-muted p-3 cursor-pointer">
                <div>
                  <p className="font-mono text-xs font-bold uppercase text-foreground">
                    2. Intercept Financial Moves &gt; $100
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Requires explicit human supervisor approval
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={blockFinancials}
                  onChange={(e) => setBlockFinancials(e.target.checked)}
                  className="h-4 w-4 rounded-none border-2 border-border accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between border border-border bg-surface-muted p-3 cursor-pointer">
                <div>
                  <p className="font-mono text-xs font-bold uppercase text-foreground">
                    3. Enforce Strict Zod Output Schema
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Reject unstructured or hallucinated keys immediately
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enforceSchema}
                  onChange={(e) => setEnforceSchema(e.target.checked)}
                  className="h-4 w-4 rounded-none border-2 border-border accent-primary cursor-pointer"
                />
              </label>

              <div className="border border-border bg-surface-muted p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs font-bold uppercase text-foreground">
                      4. Confidence Gating Threshold: {confidenceThreshold}%
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Escalate to human review if model confidence dips below
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={requireHumanSignOff}
                    onChange={(e) => setRequireHumanSignOff(e.target.checked)}
                    className="h-4 w-4 rounded-none border-2 border-border accent-primary cursor-pointer"
                  />
                </div>
                <input
                  type="range"
                  min={70}
                  max={98}
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(parseInt(e.target.value, 10))}
                  disabled={!requireHumanSignOff}
                  className="mt-3 w-full accent-primary cursor-pointer"
                />
              </div>
            </div>

            <Button
              onClick={handleRunEvaluation}
              disabled={isEvaluating}
              className="w-full rounded-none border-2 border-primary bg-primary py-5 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card hover:-translate-y-0.5 transition-transform cursor-pointer"
            >
              {isEvaluating ? 'Evaluating Boundary Gates...' : 'Run Policy Gate Evaluation'}
              <Play className="ml-2 h-4 w-4 fill-current" />
            </Button>
          </div>
        </div>

        {/* Right: Live Interception & Telemetry Output */}
        <div className="lg:col-span-6 space-y-6">
          <div className="border-2 border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between border-b-2 border-border pb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                Control Plane Evaluation Result
              </span>
              {evalResult && (
                <span
                  className={`border px-2.5 py-0.5 font-mono text-xs font-black uppercase ${
                    evalResult.status === 'PASSED'
                      ? 'border-green-500 bg-green-500/10 text-green-500'
                      : evalResult.status === 'INTERCEPTED'
                      ? 'border-red-500 bg-red-500/10 text-red-500'
                      : 'border-amber-500 bg-amber-500/10 text-amber-500'
                  }`}
                >
                  {evalResult.status}
                </span>
              )}
            </div>

            {/* Evaluation Details */}
            {evalResult ? (
              <div className="mt-4 space-y-4">
                {/* Telemetry chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="border border-border bg-surface-muted p-2">
                    <p className="font-mono text-[9px] uppercase text-muted-foreground">Rules Run</p>
                    <p className="font-mono text-xs font-bold text-foreground">
                      {evalResult.decisionTelemetry.evaluatedRules} Gates
                    </p>
                  </div>
                  <div className="border border-border bg-surface-muted p-2">
                    <p className="font-mono text-[9px] uppercase text-muted-foreground">Latency</p>
                    <p className="font-mono text-xs font-bold text-foreground">
                      {evalResult.decisionTelemetry.latencyMs} ms
                    </p>
                  </div>
                  <div className="border border-border bg-surface-muted p-2">
                    <p className="font-mono text-[9px] uppercase text-muted-foreground">Confidence</p>
                    <p className="font-mono text-xs font-bold text-foreground">
                      {evalResult.decisionTelemetry.confidenceScore}%
                    </p>
                  </div>
                  <div className="border border-border bg-surface-muted p-2">
                    <p className="font-mono text-[9px] uppercase text-muted-foreground">Audit Code</p>
                    <p className="font-mono text-[10px] font-bold text-primary">
                      {evalResult.status === 'PASSED' ? 'OK-200' : 'GAT-403'}
                    </p>
                  </div>
                </div>

                {/* Violations / Interceptions */}
                <div>
                  <p className="font-mono text-xs font-bold uppercase text-foreground mb-1.5">
                    Policy Triggers & Interceptions:
                  </p>
                  {evalResult.violations.length > 0 ? (
                    <ul className="space-y-1.5">
                      {evalResult.violations.map((v) => (
                        <li
                          key={v}
                          className="flex items-start gap-2 border border-border bg-surface-muted p-2 text-xs text-foreground"
                        >
                          <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-500 mt-0.5" />
                          <span className="font-mono text-[11px]">{v}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="border border-border bg-green-500/10 p-3 text-xs font-mono text-green-500 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      All policy gates passed with zero boundary violations.
                    </div>
                  )}
                </div>

                {/* Redacted Payload */}
                {maskPii && (
                  <div>
                    <p className="font-mono text-xs font-bold uppercase text-foreground mb-1.5">
                      Sanitized Payload Transmitted to Execution Engine:
                    </p>
                    <div className="border border-border bg-surface-muted p-3 font-mono text-[11px] text-muted-foreground break-all">
                      {evalResult.redactedPayload}
                    </div>
                  </div>
                )}

                {/* Generated Schema Box */}
                <div className="border-t-2 border-border pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <FileCode className="h-3.5 w-3.5 text-primary" />
                      <span className="font-mono text-xs font-bold uppercase text-foreground">
                        Generated Production Zod Policy Schema
                      </span>
                    </div>
                    <Button
                      onClick={handleCopyCode}
                      size="sm"
                      variant="outline"
                      className="rounded-none border border-border font-mono text-[10px] uppercase h-7 px-2.5 cursor-pointer"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="h-3 w-3 mr-1 text-green-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Zod
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="border border-border bg-black/90 p-3 font-mono text-[11px] text-green-400 overflow-x-auto">
                    {evalResult.generatedCode}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-muted-foreground">
                <ShieldAlert className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="font-mono text-xs uppercase">
                  Click &ldquo;Run Policy Gate Evaluation&rdquo; to simulate control-plane execution.
                </p>
              </div>
            )}
          </div>

          {/* Download Full Kit / Hire Us Card */}
          <div className="border-2 border-border bg-surface-muted p-6">
            <h4 className="font-mono text-xs font-black uppercase tracking-wider text-foreground">
              Ready to Embed This Guardrail Kit Into Your Architecture?
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Get our complete open-source TypeScript & Zod guardrail package from the product
              catalog, or hire AIAS engineers to harden your entire system.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="sm"
                className="rounded-none border-2 border-primary bg-primary font-mono text-[11px] font-bold uppercase"
              >
                <Link href="/catalog">
                  Browse Product Catalog
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="rounded-none border-2 border-border font-mono text-[11px] font-bold uppercase"
              >
                <Link href="/hire">Hire Us to Build</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

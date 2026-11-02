"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Cpu,
  Download,
  FileCode2,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DigitalAssetSpec {
  id: string;
  title: string;
  price: string;
  badge: string;
  checksum: string;
  deliverables: string[];
  targetHref: string;
  isExternal?: boolean;
}

const DIGITAL_ASSETS: DigitalAssetSpec[] = [
  {
    id: "comfy-pack",
    title: "ComfyUI 11-Workflow Production Pack",
    price: "$29",
    badge: "Available now",
    checksum: "One-time download with local GPU execution",
    deliverables: [
      "11 local-first ComfyUI workflows for portrait, product, and concept generation",
      "Runs on your own GPU with zero cloud API key dependency",
      "One-time purchase with instant source delivery",
    ],
    targetHref: "https://aiautomatedsystems.ca/p/comfyui-workflow-pack",
    isExternal: true,
  },
  {
    id: "policy-guardrail-kit",
    title: "Deterministic Policy & Zod Guardrail Kit",
    price: "Open Source",
    badge: "Reference kit",
    checksum: "Reusable TypeScript & Zod boundary contracts",
    deliverables: [
      "Strict Zod schema contracts for validating AI inputs and tool calls",
      "Regex and semantic PII scrubbers for sensitive data isolation",
      "Confidence score evaluation with human-in-the-loop triggers",
    ],
    targetHref: "/catalog/policy-guardrail-kit",
  },
  {
    id: "invoice-document-parser",
    title: "Autonomous Financial Doc & Invoice Parser",
    price: "Modular scope",
    badge: "Data engine",
    checksum: "Confidence-scored extraction with reconciliation",
    deliverables: [
      "Multi-format document layout and text vector extraction pipeline",
      "Deterministic policy intercept for currency, tax IDs, and totals",
      "Automatic ERP commit router for high-confidence payloads",
    ],
    targetHref: "/catalog/invoice-document-parser",
  },
];

const COMPARISON_ROWS = [
  {
    metric: "Turnaround SLA",
    tier1: "Instant source download",
    tier2: "Fixed 5 business days",
    tier3: "4 to 8 weeks by milestone",
    tier4: "Continuous monthly cadence",
  },
  {
    metric: "Source Code IP",
    tier1: "100% Client-Owned",
    tier2: "100% Client-Owned",
    tier3: "100% Client-Owned",
    tier4: "100% Client-Owned",
  },
  {
    metric: "Verification Rigor",
    tier1: "Self-contained JSON evals",
    tier2: "25+ deterministic gate audit",
    tier3: "100+ synthetic edge case suite",
    tier4: "Continuous regression tests",
  },
  {
    metric: "Architecture Deliverable",
    tier1: "Workflow templates & schemas",
    tier2: "System Architecture Dossier",
    tier3: "Full Production Control Plane",
    tier4: "Monthly Governance Reports",
  },
  {
    metric: "Operational Support",
    tier1: "Documentation & runbooks",
    tier2: "Direct sprint review sessions",
    tier3: "Dedicated Slack / VPC bridge",
    tier4: "Priority 4-hour response SLA",
  },
];

export function PricingEngineSuite() {
  const teamSizeId = useId();
  const weeklyHoursId = useId();
  const blendedRateId = useId();

  // ROI Simulator State
  const [teamSize, setTeamSize] = useState<number>(6);
  const [weeklyHours, setWeeklyHours] = useState<number>(15);
  const [blendedRate, setBlendedRate] = useState<number>(95);
  const [roiAttached, setRoiAttached] = useState<boolean>(false);
  const [recoveryPct, setRecoveryPct] = useState<number>(60);

  // Calculations
  const annualDrag = useMemo(() => {
    return teamSize * weeklyHours * 50 * blendedRate;
  }, [teamSize, weeklyHours, blendedRate]);

  const annualReclaimed = useMemo(() => {
    return Math.round(annualDrag * (recoveryPct / 100));
  }, [annualDrag, recoveryPct]);

  const auditPaybackDays = useMemo(() => {
    const dailyReclaimed = annualReclaimed / 250;
    return dailyReclaimed > 0
      ? Math.max(3, Math.round(5000 / dailyReclaimed))
      : 30;
  }, [annualReclaimed]);

  const handleAttachRoiToBooking = () => {
    try {
      const summaryText = `Projected ROI Calculation: Team Size: ${teamSize} | Weekly Manual Burden: ${weeklyHours} hrs | Annual Drag: $${annualDrag.toLocaleString()} | Projected Reclaim: $${annualReclaimed.toLocaleString()} | Est. Payback: ${auditPaybackDays} days`;
      window.localStorage.setItem("aias_workspace_notes", summaryText);
      setRoiAttached(true);
      setTimeout(() => setRoiAttached(false), 3000);
    } catch {
      // Ignore
    }
  };

  const handleDownloadAssetSpec = (asset: DigitalAssetSpec) => {
    try {
      const jsonContent = JSON.stringify(asset, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aias-${asset.id}-spec.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="mt-12 space-y-12">
      {/* Engine 1 Feature A: Interactive Payback & ROI Simulator */}
      <div className="border-2 border-border bg-card p-6 sm:p-8 shadow-card text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-border pb-6">
          <div>
            <div className="inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
              <Calculator className="h-3 w-3" />
              <span>Investment Payback Simulator</span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
              ESTIMATE YOUR OPERATIONAL CASHFLOW MULTIPLIER
            </h2>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              Calculate the measurable cost of brittle AI scripts and manual
              verification drag before booking an audit sprint.
            </p>
          </div>
          <span className="font-mono text-xs text-primary font-bold border border-border bg-background px-3 py-1.5 uppercase">
            Assumption: {recoveryPct}% recovery (editable)
          </span>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between font-mono text-xs font-bold uppercase text-foreground mb-2">
                <label htmlFor={teamSizeId}>
                  Engineering / Operator Headcount:
                </label>
                <span className="text-primary">{teamSize} team members</span>
              </div>
              <input
                id={teamSizeId}
                type="range"
                min={1}
                max={40}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
                <span>1 member</span>
                <span>40 members</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-xs font-bold uppercase text-foreground mb-2">
                <label htmlFor={weeklyHoursId}>
                  Weekly Triage &amp; Manual Verification Hours:
                </label>
                <span className="text-primary">{weeklyHours} hrs / member</span>
              </div>
              <input
                id={weeklyHoursId}
                type="range"
                min={4}
                max={45}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
                <span>4 hrs</span>
                <span>45 hrs</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-xs font-bold uppercase text-foreground mb-2">
                <label htmlFor={blendedRateId}>
                  Loaded Resource Cost Benchmark ($/unit):
                </label>
                <span className="text-primary">${blendedRate} / unit</span>
              </div>
              <input
                id={blendedRateId}
                type="range"
                min={45}
                max={220}
                step={5}
                value={blendedRate}
                onChange={(e) => setBlendedRate(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
                <span>$45 / unit</span>
                <span>$220 / unit</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-xs font-bold uppercase text-foreground mb-2">
                <label htmlFor="recovery-pct">
                  Assumed Efficiency Recovery:
                </label>
                <span className="text-primary">{recoveryPct}%</span>
              </div>
              <input
                id="recovery-pct"
                type="range"
                min={10}
                max={90}
                step={5}
                value={recoveryPct}
                onChange={(e) => setRecoveryPct(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
                <span>10% (conservative)</span>
                <span>90% (optimistic)</span>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="border-2 border-border bg-muted/20 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-3 text-xs font-mono text-muted-foreground uppercase">
                <span>Projected Economic Impact</span>
                <span className="text-primary font-bold">
                  Assumes 50 working weeks/yr
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="border border-border bg-card p-3">
                  <p className="text-[10px] font-mono uppercase text-muted-foreground font-bold">
                    Annual Drag Cost
                  </p>
                  <p className="text-xl sm:text-2xl font-black font-mono text-rose-400 mt-1">
                    ${annualDrag.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-mono text-muted-foreground mt-1">
                    Current manual verification
                  </p>
                </div>

                <div className="border border-border bg-card p-3">
                  <p className="text-[10px] font-mono uppercase text-muted-foreground font-bold">
                    Reclaimed Capacity
                  </p>
                  <p className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-1">
                    ${annualReclaimed.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-mono text-muted-foreground mt-1">
                    Via deterministic policy gates
                  </p>
                </div>
              </div>

              <div className="mt-4 border border-border bg-card p-4">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-muted-foreground uppercase">
                    Audit Sprint Payback Time:
                  </span>
                  <span className="text-base font-black text-primary">
                    ~{auditPaybackDays} Business Days
                  </span>
                </div>
                <p className="text-[10px] font-mono text-muted-foreground mt-1">
                  Based on a typical $5,000 Audit Sprint covering 5 business
                  days of diligence.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={handleAttachRoiToBooking}
                variant="outline"
                className="font-mono text-xs font-bold uppercase"
              >
                {roiAttached
                  ? "Attached to Session Record ✓"
                  : "Attach Findings to Intake Spec"}
              </Button>
              <Button asChild className="font-mono text-xs font-bold uppercase">
                <Link
                  href={`/book?brief=${encodeURIComponent(`Projected Annual Savings: $${annualReclaimed.toLocaleString()} with ${auditPaybackDays}-day payback`)}`}
                >
                  Book Strategy Intake With Spec{" "}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Engine 1 Feature B: Sovereign Digital Assets Tier 1 Storefront */}
      <div className="border-2 border-border bg-card p-6 sm:p-8 shadow-card text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-border pb-6">
          <div>
            <div className="inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
              <PackageCheck className="h-3 w-3" />
              <span>Tier 1 Digital Assets</span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
              SELF-SERVE DIGITAL ASSETS &amp; RUNTIME KITS
            </h2>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              Production-hardened runbooks and schema packs with zero recurring
              seat licensing. Instant source code delivery.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="font-mono text-xs font-bold uppercase shrink-0"
          >
            <Link href="/catalog">
              Browse Full Catalog <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {DIGITAL_ASSETS.map((asset) => (
            <div
              key={asset.id}
              className="border-2 border-border bg-background p-5 flex flex-col justify-between hover:border-primary transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase text-primary border border-primary/30 bg-primary/10 px-2 py-0.5">
                    {asset.badge}
                  </span>
                  <span className="font-mono text-xl font-black text-foreground">
                    {asset.price}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground mt-3 leading-snug">
                  {asset.title}
                </h3>
                <ul className="mt-4 space-y-2 text-xs text-muted-foreground font-mono">
                  {asset.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60">
                <div className="font-mono text-[9px] text-muted-foreground truncate mb-3">
                  {asset.checksum}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadAssetSpec(asset)}
                    className="w-full font-mono text-[11px] uppercase font-bold"
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5" /> Spec (.json)
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="w-full font-mono text-[11px] uppercase font-bold"
                  >
                    {asset.isExternal ? (
                      <a
                        href={asset.targetHref}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Get Pack →
                      </a>
                    ) : (
                      <Link href={asset.targetHref}>Inspect Spec →</Link>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engine 1 Feature C: Detailed SLA & Deliverables Matrix */}
      <div className="border-2 border-border bg-card p-6 sm:p-8 shadow-card text-left">
        <div className="border-b-2 border-border pb-4">
          <div className="inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
            <ShieldCheck className="h-3 w-3" />
            <span>Sovereign Engagement Contract</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
            TIER DELIVERABLES &amp; GOVERNANCE MATRIX
          </h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Clear contractual comparison across turnaround SLAs, source code IP
            guarantees, and verification rigor.
          </p>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse font-mono text-xs text-left">
            <thead>
              <tr className="border-b-2 border-border bg-muted/40 text-[11px] uppercase text-muted-foreground">
                <th className="p-3 font-bold">Contract Dimension</th>
                <th className="p-3 font-bold">Tier 1: Sovereign Assets</th>
                <th className="p-3 font-bold">
                  Tier 2: Audit &amp; Architecture
                </th>
                <th className="p-3 font-bold">Tier 3: Implementation</th>
                <th className="p-3 font-bold">Tier 4: Governance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {COMPARISON_ROWS.map((row) => (
                <tr
                  key={row.metric}
                  className="hover:bg-muted/10 transition-colors"
                >
                  <td className="p-3 font-bold text-foreground">
                    {row.metric}
                  </td>
                  <td className="p-3 text-muted-foreground">{row.tier1}</td>
                  <td className="p-3 text-foreground font-semibold">
                    {row.tier2}
                  </td>
                  <td className="p-3 text-primary font-semibold">
                    {row.tier3}
                  </td>
                  <td className="p-3 text-muted-foreground">{row.tier4}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

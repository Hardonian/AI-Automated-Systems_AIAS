"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  Download,
  Flame,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const WEEKS_PER_YEAR = 48;
const AUTOMATION_FACTOR = 0.65; // realistic conservative capture rate
const BASELINE_SPRINT_COST = 38000;

interface Preset {
  id: string;
  name: string;
  badge: string;
  teamSize: number;
  hours: number;
  rate: number;
}

const PRESETS: Preset[] = [
  {
    id: "squad",
    name: "Growth Squad",
    badge: "5-10 FTEs",
    teamSize: 8,
    hours: 12,
    rate: 65,
  },
  {
    id: "scaleup",
    name: "Scaleup Operations",
    badge: "25-50 FTEs",
    teamSize: 28,
    hours: 14,
    rate: 75,
  },
  {
    id: "enterprise",
    name: "Enterprise Business Unit",
    badge: "75+ FTEs",
    teamSize: 75,
    hours: 16,
    rate: 90,
  },
];

export function InstantRoiSizer() {
  const [teamSize, setTeamSize] = useState<number>(15);
  const [hours, setHours] = useState<number>(12);
  const [rate, setRate] = useState<number>(75);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const formId = useId();

  const applyPreset = (preset: Preset) => {
    setTeamSize(preset.teamSize);
    setHours(preset.hours);
    setRate(preset.rate);
    setActivePreset(preset.id);
  };

  const calculations = useMemo(() => {
    const weeklyHoursSaved = teamSize * hours * AUTOMATION_FACTOR;
    const annualHoursSaved = Math.round(weeklyHoursSaved * WEEKS_PER_YEAR);
    const annualSavings = Math.round(annualHoursSaved * rate);
    const dailySavings = annualSavings / 365;
    const breakEvenDays =
      dailySavings > 0
        ? Math.max(12, Math.round(BASELINE_SPRINT_COST / dailySavings))
        : 45;
    const roiMultiplier =
      BASELINE_SPRINT_COST > 0
        ? (annualSavings / BASELINE_SPRINT_COST).toFixed(1)
        : "5.2";

    return {
      annualHoursSaved,
      annualSavings,
      breakEvenDays,
      roiMultiplier,
    };
  }, [teamSize, hours, rate]);

  const downloadJsonBrief = () => {
    const brief = {
      timestamp: new Date().toISOString(),
      teamSize,
      hoursPerWeekLost: hours,
      loadedHourlyRate: rate,
      projectedAnnualHoursRecovered: calculations.annualHoursSaved,
      projectedAnnualCapitalRecovered: calculations.annualSavings,
      estimatedBreakevenVelocityDays: calculations.breakEvenDays,
      estimatedRoiMultiplier: `${calculations.roiMultiplier}x`,
      provider: "AI Automated Systems (AIAS)",
    };

    const blob = new Blob([JSON.stringify(brief, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aias-roi-opportunity-brief-${teamSize}fte.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      aria-labelledby="roi-sizer-heading"
      className="relative border-b-2 border-border bg-card py-20 overflow-hidden"
      id="instant-roi"
    >
      {/* High-tech accent glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 border-2 border-cyan-500/40 bg-cyan-500/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-cyan-400 mb-4 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            <Flame className="h-3.5 w-3.5 text-cyan-400" />
            <span>Interactive Value Engine // Real-Time Estimator</span>
          </div>
          <h2
            className="text-3xl font-black uppercase tracking-tighter sm:text-5xl text-foreground"
            id="roi-sizer-heading"
          >
            CALCULATE YOUR ANNUAL AUTOMATION CAPACITY
          </h2>
          <p className="mt-4 font-mono text-sm sm:text-base text-muted-foreground">
            Drag your team parameters below to see exactly how many engineering
            and operational hours — and how much hard capital — deterministic AI
            systems can unlock for your business.
          </p>
        </div>

        {/* Preset Quick-Buttons */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          <span className="font-mono text-xs font-bold uppercase text-muted-foreground mr-1">
            Quick Presets:
          </span>
          {PRESETS.map((p) => (
            <button
              className={`px-4 py-2 font-mono text-xs font-bold uppercase border-2 transition-all ${
                activePreset === p.id
                  ? "border-cyan-500 bg-cyan-500/15 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                  : "border-border bg-background/60 text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
              key={p.id}
              onClick={() => applyPreset(p)}
              type="button"
            >
              {p.name}{" "}
              <span className="opacity-70 font-normal">({p.badge})</span>
            </button>
          ))}
        </div>

        {/* Main 2-Column Sizer Layout */}
        <div className="grid gap-8 lg:grid-cols-12 items-stretch">
          {/* Left Column: Sliders & Controls */}
          <div className="lg:col-span-7 border-2 border-border bg-background/80 backdrop-blur p-6 sm:p-8 flex flex-col justify-between shadow-card">
            <div className="space-y-8">
              {/* Slider 1: Team Size */}
              <div>
                <div className="flex items-center justify-between font-mono mb-2">
                  <label
                    className="text-xs font-bold uppercase text-foreground"
                    htmlFor={`${formId}-team`}
                  >
                    Workflow Team Size (FTEs)
                  </label>
                  <span className="text-sm font-black text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 border border-cyan-500/30">
                    {teamSize} People
                  </span>
                </div>
                <Slider
                  aria-label="Team Size"
                  className="py-2"
                  id={`${formId}-team`}
                  max={100}
                  min={2}
                  onValueChange={(val) => {
                    setTeamSize(val[0] ?? 15);
                    setActivePreset(null);
                  }}
                  step={1}
                  value={[teamSize]}
                />
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                  Number of knowledge workers handling manual data, triage, or
                  reporting.
                </p>
              </div>

              {/* Slider 2: Hours Lost */}
              <div>
                <div className="flex items-center justify-between font-mono mb-2">
                  <label
                    className="text-xs font-bold uppercase text-foreground"
                    htmlFor={`${formId}-hours`}
                  >
                    Repetitive Hours / Person / Week
                  </label>
                  <span className="text-sm font-black text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 border border-cyan-500/30">
                    {hours} Hours / Week
                  </span>
                </div>
                <Slider
                  aria-label="Hours Lost Per Week"
                  className="py-2"
                  id={`${formId}-hours`}
                  max={30}
                  min={4}
                  onValueChange={(val) => {
                    setHours(val[0] ?? 12);
                    setActivePreset(null);
                  }}
                  step={1}
                  value={[hours]}
                />
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                  Time consumed by cross-system copying, document triage, or
                  manual reviews.
                </p>
              </div>

              {/* Slider 3: Labor Rate */}
              <div>
                <div className="flex items-center justify-between font-mono mb-2">
                  <label
                    className="text-xs font-bold uppercase text-foreground"
                    htmlFor={`${formId}-rate`}
                  >
                    Loaded Hourly Rate ($CAD)
                  </label>
                  <span className="text-sm font-black text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 border border-cyan-500/30">
                    ${rate} / Hour
                  </span>
                </div>
                <Slider
                  aria-label="Loaded Hourly Rate"
                  className="py-2"
                  id={`${formId}-rate`}
                  max={150}
                  min={45}
                  onValueChange={(val) => {
                    setRate(val[0] ?? 75);
                    setActivePreset(null);
                  }}
                  step={5}
                  value={[rate]}
                />
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                  Fully loaded internal cost (salary, benefits, tooling
                  overhead).
                </p>
              </div>
            </div>

            {/* Bottom Methodology Footnote */}
            <div className="mt-8 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-muted-foreground">
              <span>
                Model assumptions: 48 weeks/yr · 65% conservative automation
                efficiency
              </span>
              <button
                className="text-primary hover:text-foreground transition-colors underline underline-offset-2 flex items-center gap-1"
                onClick={downloadJsonBrief}
                type="button"
              >
                <Download className="h-3 w-3" />
                Export Brief JSON
              </button>
            </div>
          </div>

          {/* Right Column: Value Readout & Direct Conversion Card */}
          <div className="lg:col-span-5 border-2 border-cyan-500/60 bg-gradient-to-b from-card via-card to-cyan-950/20 p-6 sm:p-8 flex flex-col justify-between shadow-[0_0_30px_rgba(6,182,212,0.12)]">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  Calculated Opportunity
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 font-bold uppercase">
                  {calculations.roiMultiplier}x ROI Impact
                </span>
              </div>

              {/* Hero Metric: Capital Recovered */}
              <div className="mt-6">
                <p className="font-mono text-xs uppercase font-bold text-muted-foreground">
                  Estimated Annual Capital Recovered:
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-4xl sm:text-5xl font-black text-foreground tracking-tight">
                    ${calculations.annualSavings.toLocaleString()}
                  </span>
                  <span className="font-mono text-sm font-bold text-cyan-400">
                    / yr
                  </span>
                </div>
              </div>

              {/* Secondary Metrics Grid */}
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6">
                <div className="border border-border/80 bg-background/60 p-3.5">
                  <p className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
                    Hours Reclaimed
                  </p>
                  <p className="mt-1 font-mono text-xl sm:text-2xl font-black text-primary">
                    {calculations.annualHoursSaved.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      hrs/yr
                    </span>
                  </p>
                </div>
                <div className="border border-border/80 bg-background/60 p-3.5">
                  <p className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
                    Breakeven Velocity
                  </p>
                  <p className="mt-1 font-mono text-xl sm:text-2xl font-black text-cyan-400">
                    ~{calculations.breakEvenDays}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      Days
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Direct High-Converting Action Group */}
            <div className="mt-8 space-y-3 pt-6 border-t border-border">
              <Button
                asChild
                className="w-full rounded-none border-2 border-cyan-500 bg-cyan-500 px-6 py-6 font-mono text-sm font-black uppercase tracking-wider text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]"
                size="lg"
              >
                <Link
                  href={`/contact?ref=roi-sizer&team=${teamSize}&hours=${hours}&savings=${calculations.annualSavings}`}
                >
                  Lock In This Efficiency // Request Proposal
                  <ArrowRight className="ml-2.5 h-4 w-4" />
                </Link>
              </Button>

              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pt-1 px-1">
                <Link
                  className="hover:text-cyan-400 transition-colors underline underline-offset-4 flex items-center gap-1"
                  href="/roi-calculator"
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  Full Monte-Carlo Engine →
                </Link>
                <Link
                  className="hover:text-primary transition-colors underline underline-offset-4"
                  href="/book"
                >
                  Book 30-Min Call
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

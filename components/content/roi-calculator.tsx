'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  TrendingUp,
  Clock,
  DollarSign,
  ShieldCheck,
  Download,
  Copy,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';

import { SurfaceCard } from '@/components/ui/section-primitives';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

const WEEKS_PER_YEAR = 48;
const BASELINE_IMPLEMENTATION_COST = 48000;

interface PresetScenario {
  id: string;
  name: string;
  badge: string;
  teamSize: number;
  laborRate: number;
  manualHours: number;
  repetitionRate: number;
  maturity: number;
}

const PRESETS: PresetScenario[] = [
  {
    id: 'startup',
    name: 'Startup / Growth Team',
    badge: '10-25 FTEs',
    teamSize: 12,
    laborRate: 65,
    manualHours: 16,
    repetitionRate: 70,
    maturity: 45,
  },
  {
    id: 'midmarket',
    name: 'Mid-Market Operations',
    badge: '50-200 FTEs',
    teamSize: 45,
    laborRate: 78,
    manualHours: 12,
    repetitionRate: 60,
    maturity: 65,
  },
  {
    id: 'enterprise',
    name: 'Enterprise Regulated Unit',
    badge: '200+ FTEs',
    teamSize: 120,
    laborRate: 95,
    manualHours: 10,
    repetitionRate: 50,
    maturity: 80,
  },
];

export function RoiCalculator() {
  const [teamSize, setTeamSize] = useState(12);
  const [laborRate, setLaborRate] = useState(65);
  const [manualHours, setManualHours] = useState(14);
  const [repetitionRate, setRepetitionRate] = useState(65);
  const [maturity, setMaturity] = useState(55);
  const [copyState, setCopyState] = useState<'idle' | 'done' | 'error'>('idle');

  const applyPreset = (preset: PresetScenario) => {
    setTeamSize(preset.teamSize);
    setLaborRate(preset.laborRate);
    setManualHours(preset.manualHours);
    setRepetitionRate(preset.repetitionRate);
    setMaturity(preset.maturity);
  };

  const model = useMemo(() => {
    const maturityFactor = maturity / 100;
    const repetitionFactor = repetitionRate / 100;
    const weeklySavedHours = teamSize * manualHours * repetitionFactor * maturityFactor;
    const annualSavedHours = weeklySavedHours * WEEKS_PER_YEAR;
    const annualCostSavings = annualSavedHours * laborRate;
    const monthlySavings = annualCostSavings / 12;
    const breakEvenMonths = monthlySavings > 0 ? BASELINE_IMPLEMENTATION_COST / monthlySavings : 0;
    const roiMultiplier = BASELINE_IMPLEMENTATION_COST > 0 ? (annualCostSavings / BASELINE_IMPLEMENTATION_COST).toFixed(1) : '1.0';

    return {
      maturityFactor,
      repetitionFactor,
      weeklySavedHours,
      annualSavedHours,
      annualCostSavings,
      monthlySavings,
      breakEvenMonths,
      roiMultiplier,
      riskReduction: Math.min(90, Math.round((repetitionFactor * 0.5 + maturityFactor * 0.5) * 100)),
    };
  }, [teamSize, laborRate, manualHours, repetitionRate, maturity]);

  const summary = {
    inputs: {
      teamSize,
      blendedLaborRateCAD: laborRate,
      manualHoursWeeklyPerFte: manualHours,
      repetitionRatePercent: repetitionRate,
      automationMaturityPercent: maturity,
    },
    assumptions: {
      operatingWeeksPerYear: WEEKS_PER_YEAR,
      baselineImplementationBudgetCAD: BASELINE_IMPLEMENTATION_COST,
      calculationFormula:
        'weekly_reclaimed_hours = team_size * manual_hours_per_week * repetition_rate * automation_maturity',
    },
    outputs: {
      weeklyHoursReclaimed: Number(model.weeklySavedHours.toFixed(1)),
      annualHoursReclaimed: Math.round(model.annualSavedHours),
      projectedAnnualSavingsCAD: Math.round(model.annualCostSavings),
      estimatedBreakEvenMonths: Number(model.breakEvenMonths.toFixed(1)),
      firstYearRoiMultiplier: `${model.roiMultiplier}x`,
      riskReductionIndex: `${model.riskReduction}%`,
      riskNote:
        model.riskReduction >= 60
          ? 'High repeatability and defined maturity indicate immediate high-probability operational ROI.'
          : 'Moderate baseline maturity indicates governance and safety guardrails should precede scaling.',
    },
  };

  const downloadSummary = () => {
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'aias-roi-projection.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(summary, null, 2));
      setCopyState('done');
      setTimeout(() => setCopyState('idle'), 2500);
    } catch {
      setCopyState('error');
    }
  };

  return (
    <div className="w-full space-y-8" id="roi-calculator-root">
      {/* Preset Scenarios */}
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary mb-3">
          Select Baseline Scenario
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className="p-4 text-left border-2 border-border bg-card hover:border-primary hover:shadow-card transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-border bg-background">
                  {preset.badge}
                </span>
                <Sparkles className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="mt-2 font-mono text-xs font-bold uppercase text-foreground">
                {preset.name}
              </h3>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                {preset.teamSize} FTEs • ~${preset.laborRate}/unit • {preset.manualHours}h manual
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Interactive Sliders & Inputs (6 cols) */}
        <div className="space-y-6 lg:col-span-6">
          <SurfaceCard className="p-6 sm:p-8 border-2 border-border">
            <div className="flex items-center justify-between border-b-2 border-border pb-4 mb-6">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                  Parameters
                </p>
                <h3 className="font-mono text-sm font-bold uppercase text-foreground mt-0.5">
                  Operating Team Variables
                </h3>
              </div>
              <Calculator className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs font-bold uppercase text-foreground">
                    Team Size (FTEs Affected)
                  </span>
                  <span className="font-mono text-xs font-black text-primary px-2 py-0.5 border border-primary/40 bg-primary/5">
                    {teamSize} People
                  </span>
                </div>
                <Input
                  min={1}
                  max={500}
                  type="number"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Math.max(1, Number(e.target.value) || 1))}
                  className="rounded-none border-2 border-border font-mono text-xs"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs font-bold uppercase text-foreground">
                    Blended Compensation Rate (CAD / resource unit)
                  </span>
                  <span className="font-mono text-xs font-black text-primary px-2 py-0.5 border border-primary/40 bg-primary/5">
                    ${laborRate} CAD
                  </span>
                </div>
                <Input
                  min={1}
                  type="number"
                  value={laborRate}
                  onChange={(e) => setLaborRate(Math.max(1, Number(e.target.value) || 1))}
                  className="rounded-none border-2 border-border font-mono text-xs"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs font-bold uppercase text-foreground">
                    Manual Routine Hours / Week / Person
                  </span>
                  <span className="font-mono text-xs font-black text-primary px-2 py-0.5 border border-primary/40 bg-primary/5">
                    {manualHours} hrs/wk
                  </span>
                </div>
                <Input
                  min={1}
                  max={40}
                  type="number"
                  value={manualHours}
                  onChange={(e) => setManualHours(Math.max(1, Number(e.target.value) || 1))}
                  className="rounded-none border-2 border-border font-mono text-xs"
                />
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-xs font-bold uppercase text-foreground">
                    Workflow Repetition Rate
                  </span>
                  <span className="font-mono text-xs font-bold text-foreground">
                    {repetitionRate}%
                  </span>
                </div>
                <Slider
                  min={10}
                  max={100}
                  step={1}
                  value={[repetitionRate]}
                  onValueChange={(val) => setRepetitionRate(val[0] ?? 65)}
                  className="cursor-pointer"
                />
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Portion of manual tasks that follow recurring patterns and clear business logic.
                </p>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-xs font-bold uppercase text-foreground">
                    Target Automation Maturity
                  </span>
                  <span className="font-mono text-xs font-bold text-foreground">
                    {maturity}%
                  </span>
                </div>
                <Slider
                  min={10}
                  max={100}
                  step={1}
                  value={[maturity]}
                  onValueChange={(val) => setMaturity(val[0] ?? 55)}
                  className="cursor-pointer"
                />
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Expected degree of end-to-end automation with deterministic human-in-the-loop checkpoints.
                </p>
              </div>
            </div>
          </SurfaceCard>
        </div>

        {/* Right Column: Calculated Outputs & Financial Forecast (6 cols) */}
        <div className="space-y-6 lg:col-span-6">
          <SurfaceCard className="p-6 sm:p-8 border-2 border-primary bg-card h-full flex flex-col justify-between shadow-card">
            <div>
              <div className="flex items-center justify-between border-b-2 border-border pb-4 mb-6">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                    Projections
                  </p>
                  <h3 className="font-mono text-sm font-bold uppercase text-foreground mt-0.5">
                    Estimated Business Impact
                  </h3>
                </div>
                <span className="font-mono text-xs font-black uppercase px-2.5 py-1 border border-primary text-primary bg-primary/10">
                  {model.roiMultiplier}x First-Year ROI
                </span>
              </div>

              {/* Stat Highlights */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border-2 border-border bg-muted/20 p-4">
                  <p className="font-mono text-xs uppercase text-muted-foreground">
                    Time Saved Weekly
                  </p>
                  <p className="mt-1 font-mono text-2xl sm:text-3xl font-black text-foreground">
                    {model.weeklySavedHours.toFixed(1)} <span className="text-sm font-bold text-muted-foreground">hrs</span>
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    ~{Math.round(model.annualSavedHours).toLocaleString()} annual hours reclaimed
                  </p>
                </div>

                <div className="border-2 border-border bg-primary/5 p-4 border-primary/40">
                  <p className="font-mono text-xs uppercase text-primary font-bold">
                    Projected Annual Savings
                  </p>
                  <p className="mt-1 font-mono text-2xl sm:text-3xl font-black text-foreground">
                    ${Math.round(model.annualCostSavings).toLocaleString()}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    CAD in reclaimed labor efficiency
                  </p>
                </div>
              </div>

              {/* Break-even and Risk Score */}
              <div className="space-y-4 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground uppercase">
                    Estimated Payback Period:
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    {model.breakEvenMonths <= 0.1 ? '< 1 month' : `${model.breakEvenMonths.toFixed(1)} months`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground uppercase">
                    Operational Variance Risk Reduction:
                  </span>
                  <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {model.riskReduction}%
                  </span>
                </div>

                <div className="rounded-none border-2 border-border bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground font-mono uppercase">Guidance: </strong>
                    {summary.outputs.riskNote}
                  </p>
                </div>
              </div>
            </div>

            {/* Export and Booking Actions */}
            <div className="mt-8 pt-4 border-t-2 border-border space-y-3">
              <div className="flex gap-3">
                <Button
                  onClick={downloadSummary}
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-wider hover:border-foreground"
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Download JSON
                </Button>
                <Button
                  onClick={copySummary}
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-wider hover:border-foreground"
                >
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  {copyState === 'done' ? 'Copied!' : 'Copy Summary'}
                </Button>
              </div>

              <Button
                asChild
                className="w-full rounded-none border-2 border-primary bg-primary font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card hover:-translate-y-0.5 transition-all py-5"
              >
                <Link href="/book">
                  Book Diagnostic to Review ROI Model
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </div>
  );
}

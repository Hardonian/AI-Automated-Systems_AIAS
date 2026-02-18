'use client';

import { useMemo, useState } from 'react';

import { SurfaceCard } from '@/components/ui/section-primitives';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

const WEEKS_PER_YEAR = 48;
const BASELINE_IMPLEMENTATION_COST = 48000;

export function RoiCalculator() {
  const [teamSize, setTeamSize] = useState(12);
  const [hourlyCost, setHourlyCost] = useState(62);
  const [manualHours, setManualHours] = useState(14);
  const [repetitionRate, setRepetitionRate] = useState(65);
  const [maturity, setMaturity] = useState(55);
  const [copyState, setCopyState] = useState<'idle' | 'done' | 'error'>('idle');

  const model = useMemo(() => {
    const maturityFactor = maturity / 100;
    const repetitionFactor = repetitionRate / 100;
    const weeklySavedHours = teamSize * manualHours * repetitionFactor * maturityFactor;
    const annualSavedHours = weeklySavedHours * WEEKS_PER_YEAR;
    const annualCostSavings = annualSavedHours * hourlyCost;
    const monthlySavings = annualCostSavings / 12;
    const breakEvenMonths = monthlySavings > 0 ? BASELINE_IMPLEMENTATION_COST / monthlySavings : 0;

    return {
      maturityFactor,
      repetitionFactor,
      weeklySavedHours,
      annualSavedHours,
      annualCostSavings,
      breakEvenMonths,
      riskReduction: Math.min(90, Math.round((repetitionFactor * 0.5 + maturityFactor * 0.5) * 100)),
    };
  }, [teamSize, hourlyCost, manualHours, repetitionRate, maturity]);

  const summary = {
    inputs: { teamSize, hourlyCost, manualHours, repetitionRate, maturity },
    assumptions: {
      weeksPerYear: WEEKS_PER_YEAR,
      implementationBaseline: BASELINE_IMPLEMENTATION_COST,
      formula:
        'weekly_saved_hours = team_size * manual_hours_per_week * repetition_rate * automation_maturity',
    },
    outputs: {
      weeklySavedHours: Number(model.weeklySavedHours.toFixed(2)),
      annualSavedHours: Math.round(model.annualSavedHours),
      annualCostSavings: Math.round(model.annualCostSavings),
      breakEvenMonths: Number(model.breakEvenMonths.toFixed(1)),
      riskReductionNote:
        model.riskReduction >= 60
          ? 'Higher repeatability + maturity suggests lower operational variance risk.'
          : 'Moderate maturity indicates risk controls should be strengthened before scale.',
    },
  };

  const downloadSummary = () => {
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'aias-roi-summary.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(summary, null, 2));
      setCopyState('done');
    } catch {
      setCopyState('error');
    }
  };

  return (
    <div className='grid gap-8 lg:grid-cols-2'>
      <SurfaceCard>
        <h2 className='text-2xl font-bold'>Inputs</h2>
        <div className='mt-6 space-y-6'>
          <label className='block'>
            <span className='text-sm font-semibold'>Team size</span>
            <Input className='mt-2' min={1} onChange={event => setTeamSize(Math.max(1, Number(event.target.value) || 1))} type='number' value={teamSize} />
          </label>
          <label className='block'>
            <span className='text-sm font-semibold'>Average labor cost per team member (CAD)</span>
            <Input className='mt-2' min={1} onChange={event => setHourlyCost(Math.max(1, Number(event.target.value) || 1))} type='number' value={hourlyCost} />
          </label>
          <label className='block'>
            <span className='text-sm font-semibold'>Manual hours per person/week</span>
            <Input className='mt-2' min={1} onChange={event => setManualHours(Math.max(1, Number(event.target.value) || 1))} type='number' value={manualHours} />
          </label>

          <div>
            <p className='text-sm font-semibold'>Repetition rate ({repetitionRate}%)</p>
            <Slider className='mt-3' max={100} min={10} onValueChange={value => setRepetitionRate(value[0] ?? 10)} step={1} value={[repetitionRate]} />
          </div>

          <div>
            <p className='text-sm font-semibold'>Automation maturity ({maturity}%)</p>
            <Slider className='mt-3' max={100} min={10} onValueChange={value => setMaturity(value[0] ?? 10)} step={1} value={[maturity]} />
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <h2 className='text-2xl font-bold'>Estimated outputs</h2>
        <dl className='mt-6 space-y-5'>
          <div>
            <dt className='text-sm text-muted-foreground'>Time saved per week</dt>
            <dd className='text-2xl font-semibold'>{model.weeklySavedHours.toFixed(1)} hours</dd>
          </div>
          <div>
            <dt className='text-sm text-muted-foreground'>Annualized savings</dt>
            <dd className='text-2xl font-semibold'>${Math.round(model.annualCostSavings).toLocaleString()} CAD</dd>
          </div>
          <div>
            <dt className='text-sm text-muted-foreground'>Break-even estimate</dt>
            <dd className='text-2xl font-semibold'>{model.breakEvenMonths.toFixed(1)} months</dd>
          </div>
          <div>
            <dt className='text-sm text-muted-foreground'>Risk reduction note</dt>
            <dd className='text-sm text-muted-foreground'>
              {summary.outputs.riskReductionNote} Estimated risk reduction index: {model.riskReduction}%.
            </dd>
          </div>
        </dl>

        <div className='mt-6 flex flex-wrap gap-3'>
          <button className='rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted' onClick={downloadSummary} type='button'>
            Download summary JSON
          </button>
          <button className='rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted' onClick={copySummary} type='button'>
            Copy summary
          </button>
          {copyState === 'done' && <p className='text-xs text-muted-foreground'>Copied to clipboard.</p>}
          {copyState === 'error' && <p className='text-xs text-muted-foreground'>Clipboard unavailable in this browser.</p>}
        </div>
      </SurfaceCard>
    </div>
  );
}

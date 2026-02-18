'use client';

import { useMemo, useState } from 'react';

import { SurfaceCard } from '@/components/ui/section-primitives';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const HOURLY_RATE = 62;
const WEEKS_PER_YEAR = 48;
const BASELINE_IMPLEMENTATION_COST = 48000;

const MATURITY_MULTIPLIER = {
  emerging: 0.35,
  scaling: 0.55,
  advanced: 0.75,
} as const;

type MaturityLevel = keyof typeof MATURITY_MULTIPLIER;

export function RoiCalculator() {
  const [teamSize, setTeamSize] = useState(12);
  const [manualHours, setManualHours] = useState(14);
  const [maturity, setMaturity] = useState<MaturityLevel>('scaling');

  const model = useMemo(() => {
    const automationFactor = MATURITY_MULTIPLIER[maturity];
    const weeklySavedHours = teamSize * manualHours * automationFactor;
    const annualSavedHours = weeklySavedHours * WEEKS_PER_YEAR;
    const annualCostSavings = annualSavedHours * HOURLY_RATE;
    const monthlyCostSavings = annualCostSavings / 12;
    const breakEvenMonths =
      monthlyCostSavings > 0
        ? BASELINE_IMPLEMENTATION_COST / monthlyCostSavings
        : Number.POSITIVE_INFINITY;

    return {
      automationFactor,
      weeklySavedHours,
      annualSavedHours,
      annualCostSavings,
      breakEvenMonths,
    };
  }, [maturity, manualHours, teamSize]);

  return (
    <div className='grid gap-8 lg:grid-cols-2'>
      <SurfaceCard>
        <h2 className='text-2xl font-bold'>Inputs</h2>
        <div className='mt-6 space-y-7'>
          <label className='block'>
            <span className='text-sm font-semibold'>Team size</span>
            <Input
              className='mt-2'
              min={1}
              onChange={event => setTeamSize(Math.max(1, Number(event.target.value) || 1))}
              type='number'
              value={teamSize}
            />
          </label>

          <label className='block'>
            <span className='text-sm font-semibold'>Manual hours per person/week</span>
            <Input
              className='mt-2'
              min={1}
              onChange={event => setManualHours(Math.max(1, Number(event.target.value) || 1))}
              type='number'
              value={manualHours}
            />
          </label>

          <label className='block'>
            <span className='text-sm font-semibold'>Automation maturity</span>
            <Select
              onValueChange={value => setMaturity(value as MaturityLevel)}
              value={maturity}
            >
              <SelectTrigger className='mt-2'>
                <SelectValue placeholder='Select maturity' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='emerging'>Emerging (pilot workflows)</SelectItem>
                <SelectItem value='scaling'>Scaling (cross-team automations)</SelectItem>
                <SelectItem value='advanced'>Advanced (governed orchestration)</SelectItem>
              </SelectContent>
            </Select>
            <p className='mt-2 text-xs text-muted-foreground'>
              Current savings factor: {(model.automationFactor * 100).toFixed(0)}% of manual effort
              automated.
            </p>
          </label>
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <h2 className='text-2xl font-bold'>Estimated outputs</h2>
        <dl className='mt-6 space-y-5'>
          <div>
            <dt className='text-sm text-muted-foreground'>Weekly time savings</dt>
            <dd className='text-2xl font-semibold'>{model.weeklySavedHours.toFixed(1)} hours</dd>
          </div>
          <div>
            <dt className='text-sm text-muted-foreground'>Annual time savings</dt>
            <dd className='text-2xl font-semibold'>
              {Math.round(model.annualSavedHours).toLocaleString()} hours
            </dd>
          </div>
          <div>
            <dt className='text-sm text-muted-foreground'>Annual cost savings</dt>
            <dd className='text-2xl font-semibold'>
              ${Math.round(model.annualCostSavings).toLocaleString()} CAD
            </dd>
          </div>
          <div>
            <dt className='text-sm text-muted-foreground'>Break-even estimate</dt>
            <dd className='text-2xl font-semibold'>{model.breakEvenMonths.toFixed(1)} months</dd>
            <p className='mt-1 text-xs text-muted-foreground'>
              Assumes a ${BASELINE_IMPLEMENTATION_COST.toLocaleString()} implementation baseline.
            </p>
          </div>
        </dl>
      </SurfaceCard>
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';

import { SurfaceCard } from '@/components/ui/section-primitives';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

const HOURLY_RATE = 62;
const WEEKS_PER_YEAR = 48;

export function RoiCalculator() {
  const [teamSize, setTeamSize] = useState(12);
  const [manualHours, setManualHours] = useState(14);
  const [automationLevel, setAutomationLevel] = useState(55);

  const model = useMemo(() => {
    const automationFactor = automationLevel / 100;
    const weeklySavedHours = teamSize * manualHours * automationFactor;
    const annualSavedHours = weeklySavedHours * WEEKS_PER_YEAR;
    const annualCostSavings = annualSavedHours * HOURLY_RATE;

    return {
      weeklySavedHours,
      annualSavedHours,
      annualCostSavings,
    };
  }, [automationLevel, manualHours, teamSize]);

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
              onChange={event => setTeamSize(Number(event.target.value) || 1)}
              type='number'
              value={teamSize}
            />
          </label>

          <label className='block'>
            <span className='text-sm font-semibold'>Manual hours per person/week</span>
            <Input
              className='mt-2'
              min={1}
              onChange={event => setManualHours(Number(event.target.value) || 1)}
              type='number'
              value={manualHours}
            />
          </label>

          <div>
            <p className='text-sm font-semibold'>Automation level: {automationLevel}%</p>
            <Slider
              className='mt-4'
              max={95}
              min={5}
              onValueChange={value => setAutomationLevel(value[0] ?? 5)}
              step={5}
              value={[automationLevel]}
            />
          </div>
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
        </dl>
      </SurfaceCard>
    </div>
  );
}

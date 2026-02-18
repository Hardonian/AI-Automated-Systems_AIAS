'use client';

import { useMemo, useState } from 'react';

import { SurfaceCard } from '@/components/ui/section-primitives';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Mode = 'advisory' | 'co-build' | 'managed';

export function EngagementSimulator() {
  const [step, setStep] = useState(1);
  const [manualHours, setManualHours] = useState(20);
  const [integrationCount, setIntegrationCount] = useState(4);
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium');
  const [timeline, setTimeline] = useState('12 weeks');
  const [outcome, setOutcome] = useState('Improve workflow reliability while reducing operator load.');

  const recommendation = useMemo((): { mode: Mode; rationale: string[] } => {
    const complexity = manualHours + integrationCount * 4;
    if (riskTolerance === 'low' || complexity > 45) {
      return {
        mode: 'managed',
        rationale: [
          'Risk profile indicates tighter governance and runbook ownership.',
          'Higher complexity benefits from shared operator coverage and staged rollout.',
        ],
      };
    }

    if (complexity > 30 || riskTolerance === 'medium') {
      return {
        mode: 'co-build',
        rationale: [
          'The initiative has moderate complexity and needs joint architecture ownership.',
          'Co-build keeps internal capability growth while reducing delivery risk.',
        ],
      };
    }

    return {
      mode: 'advisory',
      rationale: [
        'Current constraints are suitable for guided internal execution.',
        'Advisory mode preserves team autonomy with deterministic governance support.',
      ],
    };
  }, [integrationCount, manualHours, riskTolerance]);

  const brief = {
    assessment: { manualHours, integrationCount },
    constraints: { riskTolerance, timeline },
    desiredOutcomes: outcome,
    suggestedMode: recommendation.mode,
    rationale: recommendation.rationale,
  };

  return (
    <div className='space-y-6'>
      <SurfaceCard>
        <p className='text-xs font-semibold uppercase tracking-[0.12em] text-primary'>Step {step} of 4</p>

        {step === 1 && (
          <div className='mt-4 space-y-5'>
            <h2 className='text-xl font-bold'>Current state assessment</h2>
            <label className='block'>
              <span className='text-sm font-semibold'>Manual workflow hours/week</span>
              <Input className='mt-2' min={1} onChange={event => setManualHours(Math.max(1, Number(event.target.value) || 1))} type='number' value={manualHours} />
            </label>
            <label className='block'>
              <span className='text-sm font-semibold'>Critical integrations in scope</span>
              <Input className='mt-2' min={1} onChange={event => setIntegrationCount(Math.max(1, Number(event.target.value) || 1))} type='number' value={integrationCount} />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className='mt-4 space-y-5'>
            <h2 className='text-xl font-bold'>Constraints & risk profile</h2>
            <div>
              <p className='text-sm font-semibold'>Risk tolerance</p>
              <div className='mt-2 flex gap-3'>
                {(['low', 'medium', 'high'] as const).map(level => (
                  <button
                    className={`rounded-md border px-3 py-2 text-sm ${riskTolerance === level ? 'border-primary bg-primary/10' : ''}`}
                    key={level}
                    onClick={() => setRiskTolerance(level)}
                    type='button'
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <label className='block'>
              <span className='text-sm font-semibold'>Target timeline</span>
              <Input className='mt-2' onChange={event => setTimeline(event.target.value)} value={timeline} />
            </label>
          </div>
        )}

        {step === 3 && (
          <div className='mt-4 space-y-5'>
            <h2 className='text-xl font-bold'>Desired outcomes</h2>
            <label className='block'>
              <span className='text-sm font-semibold'>What outcome matters most?</span>
              <Textarea className='mt-2 min-h-[140px]' onChange={event => setOutcome(event.target.value)} value={outcome} />
            </label>
          </div>
        )}

        {step === 4 && (
          <div className='mt-4 space-y-5'>
            <h2 className='text-xl font-bold'>Suggested engagement mode</h2>
            <p className='text-lg font-semibold capitalize'>{recommendation.mode}</p>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              {recommendation.rationale.map(item => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
            <pre className='overflow-auto rounded-md border bg-muted/30 p-4 text-xs'>{JSON.stringify(brief, null, 2)}</pre>
          </div>
        )}

        <div className='mt-6 flex justify-between'>
          <button className='rounded-md border px-4 py-2 text-sm disabled:opacity-40' disabled={step === 1} onClick={() => setStep(previous => Math.max(1, previous - 1))} type='button'>
            Back
          </button>
          <button className='rounded-md border px-4 py-2 text-sm disabled:opacity-40' disabled={step === 4} onClick={() => setStep(previous => Math.min(4, previous + 1))} type='button'>
            Next
          </button>
        </div>
      </SurfaceCard>
    </div>
  );
}

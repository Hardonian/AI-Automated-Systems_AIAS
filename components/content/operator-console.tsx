'use client';

import { useEffect, useMemo, useState } from 'react';

import type { OperatorLead } from '@/src/content/moat';
import { SurfaceCard } from '@/components/ui/section-primitives';

const STORAGE_KEY = 'aias-operator-leads';

export function OperatorConsole({ initialLeads, readOnly = false }: { initialLeads: OperatorLead[]; readOnly?: boolean }) {
  const [leads, setLeads] = useState<OperatorLead[]>(initialLeads);

  useEffect(() => {
    if (readOnly) {
      return;
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as OperatorLead[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setLeads(parsed);
        }
      } catch {
        setLeads(initialLeads);
      }
    }
  }, [initialLeads, readOnly]);

  useEffect(() => {
    if (!readOnly) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    }
  }, [leads, readOnly]);

  const averageRisk = useMemo(() => {
    if (leads.length === 0) {
      return 0;
    }
    return Math.round(leads.reduce((sum, lead) => sum + lead.riskScore, 0) / leads.length);
  }, [leads]);

  const updateLead = (index: number, patch: Partial<OperatorLead>) => {
    if (readOnly) {
      return;
    }

    setLeads(current =>
      current.map((lead, leadIndex) => (leadIndex === index ? { ...lead, ...patch } : lead)),
    );
  };

  return (
    <div className='space-y-6'>
      <SurfaceCard>
        <h2 className='text-2xl font-bold'>Engagement Pipeline</h2>
        <p className='mt-2 text-sm text-muted-foreground'>Average risk score: {averageRisk}. {readOnly ? 'Demo data only.' : 'Edits are stored in local browser storage.'}</p>
      </SurfaceCard>

      <div className='grid gap-4'>
        {leads.map((lead, index) => (
          <SurfaceCard className='space-y-4' key={lead.account}>
            <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
              <h3 className='text-lg font-semibold'>{lead.account}</h3>
              <label className='text-sm'>
                Stage
                <select
                  className='ml-2 rounded-md border bg-background px-2 py-1'
                  disabled={readOnly}
                  onChange={event => updateLead(index, { stage: event.target.value as OperatorLead['stage'] })}
                  value={lead.stage}
                >
                  <option value='intake'>intake</option>
                  <option value='scoping'>scoping</option>
                  <option value='pilot'>pilot</option>
                  <option value='governance-review'>governance-review</option>
                  <option value='active'>active</option>
                </select>
              </label>
            </div>

            <div className='grid gap-4 md:grid-cols-3'>
              <label className='text-sm'>
                Risk score
                <input
                  className='mt-1 w-full rounded-md border bg-background px-2 py-1'
                  disabled={readOnly}
                  max={100}
                  min={0}
                  onChange={event => updateLead(index, { riskScore: Number(event.target.value) || 0 })}
                  type='number'
                  value={lead.riskScore}
                />
              </label>
              <label className='text-sm md:col-span-2'>
                Owner
                <input
                  className='mt-1 w-full rounded-md border bg-background px-2 py-1'
                  disabled={readOnly}
                  onChange={event => updateLead(index, { owner: event.target.value })}
                  value={lead.owner}
                />
              </label>
            </div>

            <label className='block text-sm'>
              Notes
              <textarea
                className='mt-1 min-h-[80px] w-full rounded-md border bg-background px-2 py-1'
                disabled={readOnly}
                onChange={event => updateLead(index, { notes: event.target.value })}
                value={lead.notes}
              />
            </label>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}

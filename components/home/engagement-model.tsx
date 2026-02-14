'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const phases = [
  {
    step: '01',
    title: 'Foundation',
    structure: 'Fixed Project',
    investment: 'Starting at $X,XXX',
    description: 'Best for first AI workflows, pilot automation, and fast validation.',
    outputs: [
      'AI opportunity mapping',
      'Architecture design',
      '1–2 production-ready workflows',
      'Documentation + handoff',
    ],
  },
  {
    step: '02',
    title: 'Build + Empower',
    structure: 'Implementation + Enablement',
    investment: 'Starting at $X,XXX',
    description: 'Build systems while enabling internal teams to confidently run them.',
    outputs: [
      'Multi-workflow system design',
      'Custom integrations',
      'Governance framework',
      'Operational playbooks',
    ],
  },
  {
    step: '03',
    title: 'Build + Manage + Scale',
    structure: 'Monthly Strategic Partnership',
    investment: 'Starting at $X,XXX / month',
    description: 'Continuous optimization, measurable reporting, and priority response.',
    outputs: [
      'Ongoing workflow deployment',
      'Optimization cycles',
      'Monitoring + reporting',
      'Quarterly strategy reviews',
    ],
  },
];

export function EngagementModel() {
  return (
    <section className='px-4 py-20' id='process'>
      <div className='container mx-auto max-w-6xl'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>Engagement Paths</h2>
          <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
            Choose a clear starting point, then scale capacity and refinement as you grow.
          </p>
        </div>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8'>
          {phases.map(phase => (
            <Card key={phase.title} className='relative transition-all hover:border-primary/50 hover:shadow-lg'>
              <CardContent className='p-8'>
                <div className='mb-4 flex items-center justify-between'>
                  <div className='text-4xl font-bold text-primary/20'>{phase.step}</div>
                  <span className='rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                    {phase.structure}
                  </span>
                </div>
                <h3 className='mb-2 text-xl font-semibold'>{phase.title}</h3>
                <p className='mb-4 text-sm font-medium text-primary'>{phase.investment}</p>
                <p className='mb-6 text-sm text-muted-foreground'>{phase.description}</p>
                <ul className='space-y-3'>
                  {phase.outputs.map(output => (
                    <li key={output} className='flex items-start gap-2 text-sm text-muted-foreground'>
                      <CheckCircle2 className='mt-0.5 h-4 w-4 flex-shrink-0 text-primary' />
                      {output}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className='mt-12 text-center'>
          <Button asChild variant='outline' size='lg'>
            <Link href='/pricing'>
              Review pricing details
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

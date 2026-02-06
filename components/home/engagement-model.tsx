'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const phases = [
  {
    step: '01',
    title: 'Pilot',
    duration: '2-4 weeks',
    price: 'Fixed price',
    description:
      'Ship your first production automation with complete documentation and hand-off.',
    outputs: [
      '1-2 production workflows',
      'Complete documentation',
      'Observability setup',
      'Team training session',
    ],
  },
  {
    step: '02',
    title: 'Scale',
    duration: '6-12 weeks',
    price: 'Fixed price',
    description:
      'Expand automation across workflows with enterprise integrations and advanced monitoring.',
    outputs: [
      '3-8 production workflows',
      'Enterprise integrations',
      'Cross-workflow orchestration',
      'Performance dashboard',
    ],
  },
  {
    step: '03',
    title: 'Enable',
    duration: 'Ongoing',
    price: 'Retainer',
    description:
      'Continuous improvement and support. Your team operates independently with our backing.',
    outputs: [
      'Monthly optimization',
      'Priority support',
      'New workflow development',
      'Pattern library access',
    ],
  },
];

export function EngagementModel() {
  return (
    <section className='px-4 py-20' id='process'>
      <div className='container mx-auto max-w-6xl'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
            Engagement Model
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
            Pilot → Scale → Enable. Transparent pricing, practical phases, no
            lock-in.
          </p>
        </div>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8'>
          {phases.map(phase => (
            <Card
              key={phase.title}
              className='relative transition-all hover:border-primary/50 hover:shadow-lg'
            >
              <CardContent className='p-8'>
                <div className='mb-4 flex items-center justify-between'>
                  <div className='text-4xl font-bold text-primary/20'>
                    {phase.step}
                  </div>
                  <span className='rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                    {phase.price}
                  </span>
                </div>
                <h3 className='mb-2 text-xl font-semibold'>{phase.title}</h3>
                <p className='mb-4 text-sm font-medium text-primary'>
                  {phase.duration}
                </p>
                <p className='mb-6 text-sm text-muted-foreground'>
                  {phase.description}
                </p>
                <ul className='space-y-3'>
                  {phase.outputs.map((output, index) => (
                    <li
                      key={index}
                      className='flex items-start gap-2 text-sm text-muted-foreground'
                    >
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
            <Link href='/process'>
              See full process
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

'use client';

import { Shield, Zap, TrendingUp, Users, FileText, Clock } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

const outcomes = [
  {
    icon: Clock,
    pattern: 'Pattern',
    label: 'Reduction in repetitive tasks',
    description:
      'Delivery teams replace repetitive coordination tasks with deterministic automations and review checkpoints.',
  },
  {
    icon: Shield,
    pattern: 'Pattern',
    label: 'Human-in-the-loop oversight',
    description:
      'Critical decisions stay with your team while automation handles routing, preparation, and verification.',
  },
  {
    icon: Zap,
    pattern: 'Pattern',
    label: 'Faster pilot execution',
    description:
      'Focused pilot scopes accelerate implementation without changing your core systems all at once.',
  },
  {
    icon: TrendingUp,
    pattern: 'Pattern',
    label: 'Continuous iteration cycles',
    description:
      'Operational telemetry supports regular improvements after launch.',
  },
];

const deliverables = [
  {
    icon: FileText,
    title: 'Workflow Blueprints',
    items: ['State machine diagrams', 'Error handling procedures', 'Human checkpoint definitions'],
  },
  {
    icon: Users,
    title: 'Training & Handoff',
    items: ['Team workshops', 'Documentation & runbooks', 'Ongoing support options'],
  },
  {
    icon: Shield,
    title: 'Governance & Security',
    items: ['Audit trails & event logs', 'SOC2-ready controls', 'PIPEDA compliance framework'],
  },
];

export function OutcomesSection() {
  return (
    <section className='bg-muted/30 px-4 py-20' id='outcomes'>
      <div className='container mx-auto max-w-6xl'>
        <div className='mb-16'>
          <div className='mb-8 text-center'>
            <h2 className='mb-4 text-3xl font-bold md:text-4xl'>Outcomes, Not Just Features</h2>
            <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
              Outcome patterns from real delivery engagements. Results depend on implementation scope and team readiness.
            </p>
          </div>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {outcomes.map(outcome => (
              <Card key={outcome.label} className='p-6 text-center'>
                <CardContent className='pt-6'>
                  <outcome.icon className='mx-auto mb-4 h-8 w-8 text-primary' />
                  <div className='mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-primary'>
                    {outcome.pattern}
                  </div>
                  <div className='mb-2 font-semibold text-foreground'>{outcome.label}</div>
                  <p className='text-sm text-muted-foreground'>{outcome.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className='mb-8 text-center'>
            <h3 className='mb-4 text-2xl font-bold'>What You Own After Every Engagement</h3>
            <p className='mx-auto max-w-2xl text-muted-foreground'>
              All artifacts remain with your organization. No lock-in, no dependencies.
            </p>
          </div>
          <div className='grid gap-6 md:grid-cols-3'>
            {deliverables.map(category => (
              <Card key={category.title} className='h-full'>
                <CardContent className='p-6'>
                  <div className='mb-4 flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10'>
                      <category.icon className='h-5 w-5 text-primary' />
                    </div>
                    <h4 className='font-semibold'>{category.title}</h4>
                  </div>
                  <ul className='space-y-3'>
                    {category.items.map(item => (
                      <li key={item} className='flex items-start gap-2 text-sm text-muted-foreground'>
                        <span className='mt-0.5 text-primary'>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

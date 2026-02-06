'use client';

import { Clock, Shield, Zap, TrendingUp, Users, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const outcomes = [
  {
    icon: Clock,
    metric: '90%',
    label: 'Reduction in Manual Tasks',
    description:
      'Automate repetitive workflows and free your team for strategic work',
  },
  {
    icon: Shield,
    metric: '24/7',
    label: 'Human-in-the-Loop Oversight',
    description:
      'Critical decisions always require human approval with full audit trails',
  },
  {
    icon: Zap,
    metric: '< 2hr',
    label: 'Time to Production',
    description:
      'Ship your first workflow in weeks, not months with our pilot model',
  },
  {
    icon: TrendingUp,
    metric: '3x',
    label: 'Faster Iterations',
    description:
      'Test and deploy changes with version-controlled automation logic',
  },
];

const deliverables = [
  {
    icon: FileText,
    title: 'Workflow Blueprints',
    items: [
      'State machine diagrams',
      'Error handling procedures',
      'Human checkpoint definitions',
    ],
  },
  {
    icon: Users,
    title: 'Training & Handoff',
    items: [
      'Team workshops',
      'Documentation & runbooks',
      'Ongoing support options',
    ],
  },
  {
    icon: Shield,
    title: 'Governance & Security',
    items: [
      'Audit trails (Supabase)',
      'SOC2-ready controls',
      'PIPEDA compliance framework',
    ],
  },
];

export function OutcomesSection() {
  return (
    <section className='bg-muted/30 px-4 py-20' id='outcomes'>
      <div className='container mx-auto max-w-6xl'>
        {/* Outcomes Metrics */}
        <div className='mb-16'>
          <div className='mb-8 text-center'>
            <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
              Outcomes, Not Just Features
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
              Every engagement delivers measurable business impact. Here is what
              you can expect.
            </p>
          </div>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {outcomes.map(outcome => (
              <Card key={outcome.label} className='p-6 text-center'>
                <CardContent className='pt-6'>
                  <outcome.icon className='mx-auto mb-4 h-8 w-8 text-primary' />
                  <div className='mb-2 text-4xl font-bold text-foreground'>
                    {outcome.metric}
                  </div>
                  <div className='mb-2 font-semibold text-primary'>
                    {outcome.label}
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    {outcome.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Deliverables */}
        <div>
          <div className='mb-8 text-center'>
            <h3 className='mb-4 text-2xl font-bold'>
              What You Own After Every Engagement
            </h3>
            <p className='mx-auto max-w-2xl text-muted-foreground'>
              All artifacts remain with your organization. No lock-in, no
              dependencies.
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
                      <li
                        key={item}
                        className='flex items-start gap-2 text-sm text-muted-foreground'
                      >
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

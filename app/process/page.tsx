import type { Metadata } from 'next';
import {
  ArrowRight,
  CheckCircle2,
  Target,
  Users,
  FileText,
  Rocket,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Process — AI Automated Systems | How Engagements Work',
  description:
    'Our engagement model: Pilot, Scale, Enable. Practical phases to ship reliable automation.',
};

const phases = [
  {
    title: 'Pilot',
    duration: '2-4 weeks',
    tagline: 'Ship your first workflow',
    icon: Rocket,
    description:
      'Focused engagement to design, build, and deploy your first production automation.',
    activities: [
      'Discovery session to identify highest-value use case',
      'Workflow design with state machines and error handling',
      'Build and iterative testing',
      'Observability and monitoring setup',
      'Governance baseline configuration',
    ],
    outcomes: [
      '1-2 production workflows shipped',
      'Complete documentation and runbooks',
      'Error budget and SLA defined',
      'Hand-off to your team',
    ],
  },
  {
    title: 'Scale',
    duration: '6-12 weeks',
    tagline: 'Expand automation across workflows',
    icon: Target,
    description:
      'Expand automation to additional workflows and integrate with more systems.',
    activities: [
      'Additional workflow design and build',
      'Integration with enterprise systems',
      'Advanced observability and alerting',
      'Cross-workflow orchestration',
      'Performance optimization',
    ],
    outcomes: [
      '3-8 production workflows',
      'Integrated system architecture',
      'Comprehensive monitoring dashboard',
      'Internal capability to extend patterns',
    ],
  },
  {
    title: 'Enable',
    duration: 'Ongoing',
    tagline: 'Build internal capability',
    icon: Users,
    description:
      'Ongoing support to train your team and iterate on automations.',
    activities: [
      'Workshop training for your team',
      'Office hours for questions and support',
      'Iterative improvements based on feedback',
      'Pattern documentation and knowledge transfer',
    ],
    outcomes: [
      'Trained internal team',
      'Internal playbook for new workflows',
      'Ongoing support agreement',
      'Continuous improvement process',
    ],
  },
];

const principles = [
  {
    title: 'Practical First',
    description:
      'We ship working code, not PDFs. Every engagement produces tangible artifacts you own.',
  },
  {
    title: 'Systems Thinking',
    description:
      'We analyze your whole operation, not just isolated problems. Workflows connect to systems.',
  },
  {
    title: 'Human-Centered',
    description:
      'Humans stay in the loop for critical decisions. Automation augments, not replaces.',
  },
  {
    title: 'Operable from Day One',
    description:
      'Every automation includes runbooks, monitoring, and error handling. No fragile prototypes.',
  },
];

export default function ProcessPage() {
  return (
    <main className='min-h-screen'>
      <section className='bg-gradient-to-b from-muted/30 via-background to-muted/30 px-4 py-20'>
        <div className='container mx-auto max-w-4xl text-center'>
          <span className='mb-6 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary'>
            Our Engagement Model
          </span>
          <h1 className='mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl'>
            Pilot → Scale → Enable
          </h1>
          <p className='mb-8 text-lg leading-relaxed text-muted-foreground md:text-xl'>
            Three practical phases to go from concept to production automation,
            with capability-building woven throughout.
          </p>
        </div>
      </section>

      <section className='px-4 py-20'>
        <div className='container mx-auto max-w-6xl space-y-12'>
          {phases.map(phase => {
            const Icon = phase.icon;
            return (
              <Card key={phase.title} className='border-2'>
                <CardHeader>
                  <div className='flex flex-col gap-4 md:flex-row md:items-center'>
                    <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10'>
                      <Icon className='h-8 w-8 text-primary' />
                    </div>
                    <div className='flex-1'>
                      <div className='mb-1 flex items-center gap-3'>
                        <h2 className='text-2xl font-bold'>{phase.title}</h2>
                        <span className='rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
                          {phase.duration}
                        </span>
                      </div>
                      <p className='text-lg font-medium text-primary'>
                        {phase.tagline}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
                    <div className='lg:col-span-1'>
                      <p className='mb-6 text-muted-foreground'>
                        {phase.description}
                      </p>
                      <Button asChild variant='outline'>
                        <a href='/contact'>
                          Start a {phase.title}
                          <ArrowRight className='ml-2 h-4 w-4' />
                        </a>
                      </Button>
                    </div>
                    <div className='lg:col-span-1'>
                      <h3 className='mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider'>
                        <Target className='h-4 w-4' />
                        Key Activities
                      </h3>
                      <ul className='space-y-3'>
                        {phase.activities.map((activity, i) => (
                          <li key={i} className='flex items-start gap-3'>
                            <CheckCircle2 className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                            <span className='text-sm'>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className='lg:col-span-1'>
                      <h3 className='mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider'>
                        <FileText className='h-4 w-4' />
                        Deliverables
                      </h3>
                      <ul className='space-y-3'>
                        {phase.outcomes.map((outcome, i) => (
                          <li key={i} className='flex items-start gap-3'>
                            <ArrowRight className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                            <span className='text-sm'>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className='bg-muted/30 px-4 py-20'>
        <div className='container mx-auto max-w-4xl'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-extrabold md:text-4xl'>
              Our Principles
            </h2>
            <p className='text-lg text-muted-foreground'>
              What sets our engagements apart.
            </p>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {principles.map(principle => (
              <Card
                key={principle.title}
                className='border-2 transition-colors hover:border-primary/50'
              >
                <CardContent className='p-6'>
                  <h3 className='mb-2 text-lg font-bold'>{principle.title}</h3>
                  <p className='text-muted-foreground'>
                    {principle.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='px-4 py-20'>
        <div className='container mx-auto max-w-4xl text-center'>
          <h2 className='mb-6 text-3xl font-extrabold md:text-4xl'>
            Ready to Start?
          </h2>
          <p className='mb-8 text-lg text-muted-foreground'>
            Book a discovery call to discuss your specific context and see if we
            are a good fit.
          </p>
          <Button asChild size='lg'>
            <a href='/contact'>Book a Discovery Call</a>
          </Button>
        </div>
      </section>
    </main>
  );
}

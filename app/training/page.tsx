import type { Metadata } from 'next';
import {
  GraduationCap,
  Calendar,
  Users,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Training — AI Automated Systems | Workshops & Enablement',
  description:
    'Practical workshops to train your team on agentic automation, from fundamentals to advanced patterns.',
};

const workshops = [
  {
    title: 'Agentic Automation Bootcamp',
    duration: '1-2 days',
    format: 'In-person or virtual',
    price: 'From $5,000',
    description:
      'Comprehensive introduction to designing and operating agentic automation systems.',
    agenda: [
      'Systems thinking for automation',
      'Workflow design patterns',
      'State machines and error handling',
      'Observability fundamentals',
      'Hands-on: build your first workflow',
      'Governance and safety patterns',
    ],
    prerequisites: 'Basic familiarity with APIs and scripting recommended',
    outcomes: [
      'Understand when and how to apply automation',
      'Design reliable workflows with proper guardrails',
      'Implement basic monitoring and observability',
      'Contribute to automation projects in your org',
    ],
  },
  {
    title: 'Build & Ship Sprint',
    duration: '1 week',
    format: 'In-person intensive',
    price: 'From $15,000',
    description:
      'Fast-paced hands-on engagement to ship a production-ready automation.',
    agenda: [
      'Day 1: Requirements and design',
      'Day 2-4: Build and iterate',
      'Day 5: Testing, observability, and handoff',
      'Ongoing: Documentation and runbooks',
    ],
    prerequisites: 'Product owner and technical lead from your team',
    outcomes: [
      'Production-ready automation shipped',
      'Complete documentation and runbooks',
      'Trained team ready to maintain and extend',
      'Code ownership transferred to your team',
    ],
  },
  {
    title: 'Ops & Governance Clinic',
    duration: 'Half day',
    format: 'Virtual workshop',
    price: 'From $1,500',
    description:
      'Focused session on operational excellence and governance for existing automations.',
    agenda: [
      'Operational maturity assessment',
      'Error handling and retry policies',
      'Alerting and observability review',
      'Governance framework setup',
      'Action items and roadmap',
    ],
    prerequisites: 'At least one automation already running in production',
    outcomes: [
      'Improved reliability and error handling',
      'Alerting and monitoring improvements',
      'Governance policies documented',
      'Prioritized improvement roadmap',
    ],
  },
];

export default function TrainingPage() {
  return (
    <main className='min-h-screen'>
      <section className='bg-gradient-to-b from-muted/30 via-background to-muted/30 px-4 py-20'>
        <div className='container mx-auto max-w-4xl text-center'>
          <span className='mb-6 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary'>
            Training & Enablement
          </span>
          <h1 className='mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl'>
            Build Your Team's Automation Capability
          </h1>
          <p className='mb-8 text-lg leading-relaxed text-muted-foreground md:text-xl'>
            Practical workshops to train your team on designing, deploying, and
            operating reliable agentic automation systems.
          </p>
        </div>
      </section>

      <section className='px-4 py-20'>
        <div className='container mx-auto max-w-6xl'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8'>
            {workshops.map(workshop => (
              <Card
                key={workshop.title}
                className='flex h-full flex-col border-2 transition-colors hover:border-primary/50'
              >
                <CardHeader>
                  <div className='mb-2 flex items-center gap-2'>
                    <GraduationCap className='h-5 w-5 text-primary' />
                    <span className='text-sm font-medium text-primary'>
                      {workshop.duration}
                    </span>
                  </div>
                  <CardTitle className='text-xl'>{workshop.title}</CardTitle>
                  <CardDescription className='mt-2'>
                    {workshop.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex-1 space-y-6'>
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <span className='text-muted-foreground'>Format</span>
                      <p className='font-medium'>{workshop.format}</p>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>Price</span>
                      <p className='font-medium'>{workshop.price}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className='mb-3 flex items-center gap-2 text-sm font-semibold'>
                      <Calendar className='h-4 w-4' />
                      Agenda
                    </h4>
                    <ol className='space-y-2'>
                      {workshop.agenda.map((item, i) => (
                        <li key={i} className='flex items-start gap-2 text-sm'>
                          <span className='font-medium text-primary'>
                            {i + 1}.
                          </span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className='border-t pt-4'>
                    <p className='mb-3 text-xs text-muted-foreground'>
                      <span className='font-semibold'>Prerequisites:</span>{' '}
                      {workshop.prerequisites}
                    </p>
                    <div>
                      <p className='mb-2 text-xs text-muted-foreground'>
                        Attendees leave with:
                      </p>
                      <ul className='space-y-1'>
                        {workshop.outcomes.map((outcome, i) => (
                          <li
                            key={i}
                            className='flex items-center gap-2 text-xs'
                          >
                            <CheckCircle2 className='h-3 w-3 flex-shrink-0 text-primary' />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-muted/30 px-4 py-20'>
        <div className='container mx-auto max-w-4xl text-center'>
          <h2 className='mb-6 text-3xl font-extrabold md:text-4xl'>
            Custom Engagements Available
          </h2>
          <p className='mb-8 text-lg text-muted-foreground'>
            Need something tailored to your specific context? We design custom
            workshops and ongoing enablement programs.
          </p>
          <Button asChild size='lg'>
            <a href='/contact'>
              Discuss Your Needs
              <ArrowRight className='ml-2 h-4 w-4' />
            </a>
          </Button>
        </div>
      </section>

      <section className='px-4 py-20'>
        <div className='container mx-auto max-w-6xl'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10'>
                <Users className='h-8 w-8 text-primary' />
              </div>
              <h3 className='mb-2 text-xl font-bold'>Small Cohort Size</h3>
              <p className='text-muted-foreground'>
                Maximum 12 attendees per workshop for hands-on attention.
              </p>
            </div>
            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10'>
                <GraduationCap className='h-8 w-8 text-primary' />
              </div>
              <h3 className='mb-2 text-xl font-bold'>Practical Focus</h3>
              <p className='text-muted-foreground'>
                Real-world examples and hands-on exercises. No theory without
                practice.
              </p>
            </div>
            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10'>
                <Calendar className='h-8 w-8 text-primary' />
              </div>
              <h3 className='mb-2 text-xl font-bold'>Flexible Scheduling</h3>
              <p className='text-muted-foreground'>
                Virtual, in-person, or hybrid. Sessions customized to your
                timeline.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

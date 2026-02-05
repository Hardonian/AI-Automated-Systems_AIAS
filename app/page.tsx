import dynamic from 'next/dynamic';

import { ContentDrivenFAQ } from '@/components/content/ContentDrivenFAQ';
import { ContentDrivenHero } from '@/components/content/ContentDrivenHero';
import { TrustBadges } from '@/components/home/trust-badges';
import { Testimonials } from '@/components/home/testimonials';
import {
  FAQSchema,
  ProfessionalServiceSchema,
} from '@/components/seo/structured-data';
import { KeyboardNavEnhancement } from '@/components/accessibility/keyboard-nav';
import { loadAIASContent } from '@/lib/content/loader';

const FAQ = dynamic(
  () => import('@/components/home/faq').then(mod => ({ default: mod.FAQ })),
  {
    loading: () => <div aria-label='Loading FAQ' className='py-16' />,
  }
);

export default async function HomePage() {
  let content;
  try {
    content = await loadAIASContent();
  } catch (error) {
    content = null;
  }

  const homepageFAQs =
    content?.faq?.categories.flatMap(cat =>
      cat.questions.map(q => ({ question: q.question, answer: q.answer }))
    ) || [];

  return (
    <>
      <KeyboardNavEnhancement />
      <ProfessionalServiceSchema />
      <FAQSchema faqs={homepageFAQs} />
      {content ? <ContentDrivenHero content={content.hero} /> : <Hero />}
      <DeliverablesSection />
      <Testimonials />
      <EngagementModel />
      <TrustBadges />
      {content ? <ContentDrivenFAQ content={content.faq} /> : <FAQ />}
      <ConversionCTA />
    </>
  );
}

function Hero() {
  return (
    <section className='border-b border-border bg-background'>
      <div className='container mx-auto px-4 py-20 md:py-28 lg:py-32'>
        <div className='mx-auto max-w-4xl text-center'>
          <h1 className='mb-6 text-4xl font-bold leading-[1.15] tracking-tight text-foreground md:text-5xl lg:text-6xl'>
            We help organizations design, deploy, and operate reliable agentic
            automations
          </h1>
          <p className='mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl lg:text-2xl'>
            While training teams to run them safely and productively.
          </p>
          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <a
              href='/contact'
              className='inline-flex min-h-[44px] items-center justify-center rounded-md bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90'
            >
              Book a discovery call
            </a>
            <a
              href='/use-cases'
              className='inline-flex min-h-[44px] items-center justify-center rounded-md border border-border bg-background px-8 py-4 text-base font-medium text-foreground transition-colors hover:bg-muted'
            >
              View example workflows
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeliverablesSection() {
  const deliverables = [
    {
      title: 'Workflow Blueprints',
      description:
        'Complete documentation: triggers, states, tools, and human-in-the-loop gates.',
    },
    {
      title: 'Prompt Contracts',
      description:
        'Versioned prompts with evaluation criteria and expected output schemas.',
    },
    {
      title: 'Connector Maps',
      description:
        'APIs, queues, and webhooks defined with authentication and rate limiting.',
    },
    {
      title: 'Operational Runbooks',
      description:
        'Escalation procedures, failure handling, and rollback procedures documented.',
    },
    {
      title: 'Observability Setup',
      description:
        'Logs, alerts, and error budgets configured for production monitoring.',
    },
    {
      title: 'Governance Packs',
      description:
        'Permissions matrix, HITL configuration, and audit trail specifications.',
    },
  ];

  return (
    <section className='bg-muted/30 px-4 py-20'>
      <div className='container mx-auto max-w-6xl'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
            What We Deliver
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
            Concrete artifacts your team owns after every engagement.
          </p>
        </div>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
          {deliverables.map(item => (
            <div
              key={item.title}
              className='rounded-lg border bg-card p-6 transition-colors hover:border-primary/50'
            >
              <h3 className='mb-2 text-lg font-semibold'>{item.title}</h3>
              <p className='text-sm text-muted-foreground'>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EngagementModel() {
  const phases = [
    {
      step: '01',
      title: 'Pilot',
      duration: '2-4 weeks',
      description:
        'Ship your first production workflow. Focused engagement to prove value.',
    },
    {
      step: '02',
      title: 'Scale',
      duration: '6-12 weeks',
      description:
        'Expand to additional workflows and integrate with enterprise systems.',
    },
    {
      step: '03',
      title: 'Enable',
      duration: 'Ongoing',
      description:
        'Train your team and establish internal capability to build independently.',
    },
  ];

  return (
    <section className='px-4 py-20'>
      <div className='container mx-auto max-w-6xl'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
            Engagement Model
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
            Pilot → Scale → Enable. Practical phases with capability-building
            woven throughout.
          </p>
        </div>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8'>
          {phases.map(phase => (
            <div
              key={phase.title}
              className='rounded-lg border bg-card p-8 transition-colors hover:border-primary/50'
            >
              <div className='mb-4 text-4xl font-bold text-primary/30'>
                {phase.step}
              </div>
              <h3 className='mb-2 text-xl font-semibold'>{phase.title}</h3>
              <p className='mb-4 text-sm font-medium text-primary'>
                {phase.duration}
              </p>
              <p className='text-sm text-muted-foreground'>
                {phase.description}
              </p>
            </div>
          ))}
        </div>
        <div className='mt-12 text-center'>
          <a
            href='/process'
            className='inline-flex min-h-[44px] items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted'
          >
            Learn about our process
          </a>
        </div>
      </div>
    </section>
  );
}

function ConversionCTA() {
  return (
    <section className='border-t border-border bg-muted/30 px-4 py-20'>
      <div className='container mx-auto max-w-4xl text-center'>
        <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
          Ready to discuss your use case?
        </h2>
        <p className='mb-8 text-lg text-muted-foreground'>
          Book a discovery call. We will review your context and outline how we
          might help.
        </p>
        <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <a
            href='/contact'
            className='inline-flex min-h-[44px] items-center justify-center rounded-md bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90'
          >
            Book a discovery call
          </a>
          <a
            href='/services'
            className='inline-flex min-h-[44px] items-center justify-center rounded-md border border-border bg-background px-8 py-4 text-base font-medium text-foreground transition-colors hover:bg-muted'
          >
            View services
          </a>
        </div>
      </div>
    </section>
  );
}

import dynamic from 'next/dynamic';

import { ContentDrivenFAQ } from '@/components/content/ContentDrivenFAQ';
import { ContentDrivenFeatures } from '@/components/content/ContentDrivenFeatures';
import { ContentDrivenHero } from '@/components/content/ContentDrivenHero';
import { CTAEnhanced } from '@/components/home/cta-enhanced';
import { SettlerShowcase } from '@/components/home/settler-showcase';
import { StatsSection } from '@/components/home/stats-section';
import { TrustBadges } from '@/components/home/trust-badges';
import {
  FAQSchema,
  ProfessionalServiceSchema,
} from '@/components/seo/structured-data';
import { KeyboardNavEnhancement } from '@/components/accessibility/keyboard-nav';
import { loadAIASContent } from '@/lib/content/loader';

const Testimonials = dynamic(
  () =>
    import('@/components/home/testimonials').then(mod => ({
      default: mod.Testimonials,
    })),
  {
    loading: () => <div aria-label='Loading workflows' className='py-16' />,
  }
);
const CaseStudyPreview = dynamic(
  () =>
    import('@/components/home/case-study-preview').then(mod => ({
      default: mod.CaseStudyPreview,
    })),
  {
    loading: () => <div aria-label='Loading use cases' className='py-16' />,
  }
);
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
      <StatsSection />
      <TrustBadges />
      <CaseStudyPreview />
      <SettlerShowcase />
      {content ? (
        <ContentDrivenFeatures content={content.features} />
      ) : (
        <Features />
      )}
      <Testimonials />
      {content ? <ContentDrivenFAQ content={content.faq} /> : <FAQ />}
      <ConversionCTA />
      <div className='py-16'>
        <CTAEnhanced
          showSocialProof={false}
          showUrgency={false}
          urgency='low'
        />
      </div>
    </>
  );
}

function Hero() {
  return (
    <section className='relative overflow-hidden bg-gradient-to-b from-muted/30 via-background to-muted/30'>
      <div className='container mx-auto px-4 py-20 md:py-28 lg:py-32'>
        <div className='mx-auto max-w-4xl text-center'>
          <h1 className='mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-4xl font-extrabold leading-[1.1] tracking-tight text-transparent md:text-5xl lg:text-6xl xl:text-7xl'>
            Agentic Automation That Actually Ships Inside Your Org
          </h1>
          <p className='mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl lg:text-2xl'>
            We design, deploy, and train teams to run reliable automations and
            AI agents—without chaos.
          </p>
          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <a
              href='/contact'
              className='inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90'
            >
              Book a Discovery Call
            </a>
            <a
              href='/use-cases'
              className='inline-flex min-h-[44px] items-center justify-center rounded-full bg-muted px-8 py-4 text-base font-medium text-foreground transition-colors hover:bg-muted/80'
            >
              See Example Workflows
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      title: 'Workflow Design & Implementation',
      description:
        'End-to-end automation development with proper state machines, error handling, and monitoring.',
    },
    {
      title: 'Agent Training & Enablement',
      description:
        'Workshops and pair-building sessions to transfer knowledge to your team.',
    },
    {
      title: 'Governance & Compliance',
      description:
        'Policy frameworks, audit trails, and human-in-the-loop checkpoints built-in.',
    },
    {
      title: 'Reliability Engineering',
      description:
        'Circuit breakers, retries, and observability to keep automations running smoothly.',
    },
  ];

  return (
    <section className='px-4 py-20'>
      <div className='container mx-auto max-w-6xl'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-extrabold md:text-4xl lg:text-5xl'>
            Our Services
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
            Practical expertise in building and operating agentic systems.
          </p>
        </div>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8'>
          {features.map(feature => (
            <div
              key={feature.title}
              className='rounded-2xl border-2 bg-card p-6 transition-colors hover:border-primary/50 lg:p-8'
            >
              <h3 className='mb-3 text-xl font-bold md:text-2xl'>
                {feature.title}
              </h3>
              <p className='text-muted-foreground'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConversionCTA() {
  return (
    <section className='bg-muted/30 px-4 py-20'>
      <div className='container mx-auto max-w-4xl text-center'>
        <h2 className='mb-4 text-3xl font-extrabold md:text-4xl'>
          Ready to Ship Reliable Automation?
        </h2>
        <p className='mb-8 text-lg text-muted-foreground'>
          Book a discovery call to discuss your specific use case.
        </p>
        <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <a
            href='/contact'
            className='inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90'
          >
            Book a Discovery Call
          </a>
          <a
            href='/process'
            className='inline-flex min-h-[44px] items-center justify-center rounded-full bg-muted px-8 py-4 text-base font-medium text-foreground transition-colors hover:bg-muted/80'
          >
            See Our Process
          </a>
        </div>
      </div>
    </section>
  );
}

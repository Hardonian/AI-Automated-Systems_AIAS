import dynamic from 'next/dynamic';
import Link from 'next/link';

import { ContentDrivenHero } from '@/components/content/ContentDrivenHero';
import { HowWeWorkSection } from '@/components/content/how-we-work-section';
import { OutcomesPatternSection } from '@/components/content/outcomes-pattern-section';
import { OutcomesSection } from '@/components/home/outcomes-section';
import { ProofSection } from '@/components/home/proof-section';
import { ConversionCTA } from '@/components/home/conversion-cta';
import { FAQSchema, ServiceListSchema } from '@/components/seo/structured-data';
import FadeIn from '@/components/motion/fade-in';
import { CapabilityMap } from '@/components/visual/CapabilityMap';
import { DiagnosticTimeline } from '@/components/visual/DiagnosticTimeline';
import { ProblemDepthLadder } from '@/components/visual/ProblemDepthLadder';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

import { getPrimaryCtaHref, siteContent, SiteConfig } from '@/src/content/site';

const Testimonials = dynamic(
  () => import('@/components/home/testimonials').then(module => module.Testimonials)
);

export const metadata = {
  ...generateSEOMetadata({
    title: 'AI Automated Systems | AI Systems That Ship — And Stay Running',
    description: 'AIAS helps operations and engineering teams design, deploy, and govern production AI workflows — with measurable ROI, human-in-the-loop controls, and enterprise-grade reliability.',
    canonical: '/',
  }),
};

const mapHeroContent = (config: SiteConfig) => ({
  title: config.brand.tagline,
  subtitle: config.positioning.subheading,
  description: config.brand.description,
  backgroundVariant: 'gradient' as const,
  primaryCta: {
    visible: true,
    label: config.positioning.primaryCTA.label,
    href: getPrimaryCtaHref(),
  },
  secondaryCta: {
    visible: true,
    label: config.positioning.secondaryCTA.label,
    href: config.positioning.secondaryCTA.href,
  },
  badgeText: config.positioning.badgeText,
  impactCardsLabel: config.positioning.impactCardsLabel,
  socialProof: config.positioning.socialProof,
  trustBadges: config.positioning.trustBadges,
});

export default function HomePage() {
  const heroContent = mapHeroContent(siteContent);

  return (
    <>
      <ServiceListSchema
        services={siteContent.services.map(service => ({
          name: service.title,
          description: service.description,
          serviceType: 'AI automation consulting',
        }))}
      />
      <FAQSchema faqs={siteContent.faq.slice(0, 5)} />
      <ContentDrivenHero content={heroContent} />

      <section className='border-b bg-muted/30 py-12'>
        <div className='container mx-auto px-4'>
          <p className='mx-auto max-w-3xl text-center text-sm text-muted-foreground'>
            AIAS helps teams move from ad-hoc automations to deterministic delivery systems with clear ownership,
            governance, and measurable outcomes.
          </p>
          <div className='mt-6 flex flex-wrap justify-center gap-3 text-sm'>
            <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/services'>Services</Link>
            <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/how-it-works'>How it works</Link>
            <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/work'>Proof</Link>
            <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/contact'>Start intake</Link>
          </div>

          <OutcomesSection />
          <div className='mt-16'>
            <OutcomesPatternSection
              examples={[
                {
                  title: 'Manual effort reduction',
                  description: 'Teams shift repetitive triage and routing tasks into governed automation flows.',
                },
                {
                  title: 'Faster delivery cycles',
                  description: 'Delivery teams iterate with shared playbooks, guardrails, and review checkpoints.',
                },
                {
                  title: 'Stronger operational confidence',
                  description: 'Stakeholders gain clearer auditability through run logs, exceptions, and handoff artifacts.',
                },
              ]}
            />
          </div>
        </div>
      </section>

      <ProofSection />

      <section className='border-b bg-background py-14'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold'>What We Believe About AI Systems</h2>
          <ul className='mt-6 grid gap-3 text-sm text-muted-foreground md:grid-cols-2'>
            {[
              'AI failure is usually structural before technical.',
              'Model selection does not fix unclear decision boundaries.',
              'Cost and reliability are coupled decisions, not separate workstreams.',
              'Evaluation without business context creates misleading confidence.',
              'Governance must be designed into workflows, not retrofitted later.',
              'Discovery quality determines implementation quality.',
            ].map(item => (
              <li key={item} className='rounded-lg border bg-card p-4'>• {item}</li>
            ))}
          </ul>
          <div className='mt-6 flex flex-wrap gap-3 text-sm'>
            <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/point-of-view'>Read full point of view</Link>
            <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/framework'>View diagnostic framework</Link>
            <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/services'>See engagements</Link>
          </div>
        </div>
      </section>

      <FadeIn className='container py-14'>
        <div className='grid gap-8 lg:grid-cols-[1.2fr_1fr]'>
          <div>
            <h2 className='text-2xl font-bold'>Capability map</h2>
            <p className='mt-2 text-sm text-muted-foreground'>A practical view of where AIAS creates leverage across discovery, delivery, and governance.</p>
            <div className='mt-5'>
              <CapabilityMap />
            </div>
          </div>
          <div className='space-y-5'>
            <DiagnosticTimeline />
            <ProblemDepthLadder />
          </div>
        </div>
      </FadeIn>

      <Testimonials />

      <HowWeWorkSection steps={siteContent.process} />

      <ConversionCTA />
    </>
  );
}

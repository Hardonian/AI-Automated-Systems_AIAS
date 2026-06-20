import dynamic from 'next/dynamic';
import Link from 'next/link';

import { ContentDrivenHero } from '@/components/content/ContentDrivenHero';
import { HowWeWorkSection } from '@/components/content/how-we-work-section';
import { ProofSection } from '@/components/home/proof-section';
import { ConversionCTA } from '@/components/home/conversion-cta';
import { FAQSchema, ServiceListSchema } from '@/components/seo/structured-data';
import FadeIn from '@/components/motion/fade-in';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

import { getPrimaryCtaHref, siteContent, SiteConfig } from '@/src/content/site';

const Testimonials = dynamic(
  () => import('@/components/home/testimonials').then(module => module.Testimonials)
);

export const metadata = {
  ...generateSEOMetadata({
    title: 'AI Automated Systems | Agentic Automation Consultancy',
    description: 'AIAS designs and operationalizes deterministic, static-first automation systems that blend controlled AI assistance with measurable business outcomes.',
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

      {/* Problem Statement — Why AI Projects Fail */}
      <section className="border-b-2 border-border bg-background py-24 relative overflow-hidden">
        {/* Subtle grid accent */}
        <div className="absolute inset-0 z-0 opacity-5"
             style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
        <div className="container relative z-10 mx-auto max-w-5xl px-4">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-black uppercase tracking-tighter sm:text-5xl">
                MOST AI PROJECTS FAIL BEFORE THEY SHIP
              </h2>
              <p className="mx-auto mt-6 max-w-2xl font-mono text-lg text-muted-foreground">
                NOT BECAUSE THE MODEL IS WRONG — BECAUSE NOBODY OWNS THE WORKFLOW AROUND IT.
              </p>
            </div>
          </FadeIn>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                problem: 'NO DECISION BOUNDARIES',
                detail: 'Teams bolt AI onto existing processes without defining what the model should and shouldn\'t touch.',
                number: '01',
              },
              {
                problem: 'REACTIVE GOVERNANCE',
                detail: 'Audit trails, escalation paths, and approval flows get designed reactively instead of up front.',
                number: '02',
              },
              {
                problem: 'PROD REALITY CHECK',
                detail: 'The demo works, but nobody built the error handling, retry logic, or handoff procedures for operations.',
                number: '03',
              },
            ].map((item) => (
              <FadeIn key={item.number}>
                <div className="group relative border-2 border-border bg-card p-8 transition-all hover:-translate-y-2 hover:border-primary hover:shadow-[8px_8px_0px_0px_hsl(var(--primary))]">
                  <span className="block font-mono text-5xl font-black text-border transition-colors group-hover:text-primary">
                    {item.number}
                  </span>
                  <h3 className="mt-6 font-mono text-lg font-bold text-foreground">{item.problem}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="mt-16 text-center">
              <p className="font-mono text-base font-bold uppercase tracking-widest text-foreground">
                We fix the workflow, not just the model.{' '}
                <Link
                  className="text-primary underline decoration-2 underline-offset-4 transition-colors hover:text-foreground"
                  href="/how-it-works"
                >
                  [ SEE_HOW ]
                </Link>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Services — Quick scan */}
      <section className="border-b-2 border-border bg-surface-muted py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-black uppercase tracking-tighter sm:text-5xl">
                SYSTEMS ARCHITECTURE & DELIVERY
              </h2>
              <p className="mx-auto mt-6 max-w-2xl font-mono text-muted-foreground uppercase tracking-wider">
                EACH ENGAGEMENT INCLUDES CLEAR DELIVERABLES, DOCUMENTED HANDOFF, AND GOVERNANCE GUARDRAILS.
              </p>
            </div>
          </FadeIn>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {siteContent.services.map((service, index) => (
              <FadeIn key={service.title}>
                <div className="group flex h-full flex-col border-2 border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-foreground hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center border-2 border-border bg-black text-primary transition-colors group-hover:border-primary">
                    <span className="font-mono text-sm font-bold">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="mb-4 font-mono text-lg font-bold uppercase text-foreground">{service.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                  <div className="mt-6 border-t-2 border-border/50 pt-4">
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                      &gt; {service.deliverables.length} DELIVERABLES
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              className="font-mono text-sm font-bold uppercase tracking-widest text-primary underline decoration-2 underline-offset-8 transition-colors hover:text-foreground"
              href="/services"
            >
              VIEW_FULL_SPECS //
            </Link>
          </div>
        </div>
      </section>

      <ProofSection />

      <Testimonials />

      <HowWeWorkSection steps={siteContent.process} />

      <ConversionCTA />
    </>
  );
}

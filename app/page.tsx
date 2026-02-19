import dynamic from 'next/dynamic';

import { ContentDrivenHero } from '@/components/content/ContentDrivenHero';
import { HowWeWorkSection } from '@/components/content/how-we-work-section';
import { OutcomesPatternSection } from '@/components/content/outcomes-pattern-section';
import { OutcomesSection } from '@/components/home/outcomes-section';
import { ProofSection } from '@/components/home/proof-section';
import { ConversionCTA } from '@/components/home/conversion-cta';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { MESSAGING_CONTRACT, TAGLINE_TITLE_TEMPLATE } from '@/content/constants';

import { getPrimaryCtaHref, siteContent, SiteConfig } from '@/src/content/site';

const Testimonials = dynamic(
  () => import('@/components/home/testimonials').then(module => module.Testimonials)
);

export const metadata = {
  ...generateSEOMetadata({
    title: TAGLINE_TITLE_TEMPLATE,
    description: MESSAGING_CONTRACT.metadataDescription,
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
      <ContentDrivenHero content={heroContent} />
      
      <section className="border-b bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <OutcomesSection />
          <div className="mt-16">
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
      
      <Testimonials />

      <HowWeWorkSection steps={siteContent.process} />
      
      <ConversionCTA />
    </>
  );
}

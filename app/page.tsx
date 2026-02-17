import { ContentDrivenFAQ } from '@/components/content/ContentDrivenFAQ';
import { ContentDrivenHero } from '@/components/content/ContentDrivenHero';
import { OutcomesSection } from '@/components/home/outcomes-section';
import { ProofSection } from '@/components/home/proof-section';
import { SystemsSection } from '@/components/home/systems-section';
import { DeliverablesSection } from '@/components/home/deliverables-section';
import { EngagementModel } from '@/components/home/engagement-model';
import { ConversionCTA } from '@/components/home/conversion-cta';
import { TrustBadges } from '@/components/home/trust-badges';
import { Testimonials } from '@/components/home/testimonials';
import { SecretSauceSection } from '@/components/home/secret-sauce-section';
import { WorkflowSandbox } from '@/components/home/workflow-sandbox';
import { HeroIllustration } from '@/components/visual/HeroIllustration';
import { TrustBadgeStrip } from '@/components/visual/TrustBadgeStrip';

import { FAQSchema } from '@/components/seo/structured-data';

import { getPrimaryCtaHref, siteContent, SiteConfig } from '@/src/content/site';



// Mapper function to adapt SiteConfig to component props
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

const mapFAQContent = (config: SiteConfig) => ({
  sectionTitle: 'Frequently Asked Questions',
  sectionSubtitle: 'Everything you need to know about our agentic consulting services.',
  categories: [
    {
      category: 'General',
      questions: config.faq.map(q => ({
        question: q.question,
        answer: q.answer,
      })),
    },
  ],
});

export default function HomePage() {
  const heroContent = mapHeroContent(siteContent);
  const faqContent = mapFAQContent(siteContent);
  const homepageFAQs = siteContent.faq;

  return (
    <>
      <FAQSchema faqs={homepageFAQs} />
      <ContentDrivenHero content={heroContent} />
      
      {/* Visual trust section */}
      <section className="border-b bg-muted/30 py-8">
        <div className="container">
          <TrustBadgeStrip />
        </div>
      </section>
      
      <OutcomesSection />
      <ProofSection />
      <SystemsSection />
      <DeliverablesSection />
      <SecretSauceSection />
      
      {/* Visual workflow illustration */}
      <section className="border-y bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white">How It Works</h2>
            <p className="mt-4 text-slate-400">
              Our agentic workflow engine processes inputs through classification, 
              planning, and execution—with human oversight at every critical step.
            </p>
          </div>
          <div className="mt-12">
            <HeroIllustration />
          </div>
        </div>
      </section>
      
      <WorkflowSandbox />
      <Testimonials />
      <EngagementModel />
      <TrustBadges />
      <ContentDrivenFAQ content={faqContent} />
      <ConversionCTA />
    </>
  );
}

import dynamic from 'next/dynamic';

import { ContentDrivenFAQ } from '@/components/content/ContentDrivenFAQ';
import { HowWeWorkSection } from '@/components/content/how-we-work-section';
import { OutcomesPatternSection } from '@/components/content/outcomes-pattern-section';
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
import { TrustBadgeStrip } from '@/components/visual/TrustBadgeStrip';

import { FAQSchema } from '@/components/seo/structured-data';
import { ConversionPathsSection } from '@/components/home/conversion-paths-section';
import { TrustRiskSection } from '@/components/home/trust-risk-section';
import { WorkflowIllustrationSection } from '@/components/home/workflow-illustration-section';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

import { getPrimaryCtaHref, siteContent, SiteConfig } from '@/src/content/site';

const WorkflowSandbox = dynamic(
  () => import('@/components/home/workflow-sandbox').then(module => module.WorkflowSandbox)
);

export const metadata = {
  ...generateSEOMetadata({
    title: 'AI Automated Systems | Agentic Automation Consultancy',
    description:
      'Static-first AI consultancy site for agentic automation strategy, delivery, enablement, and governance support.',
    canonical: '/',
  }),
};



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
      <ProofSection />
      <SystemsSection />
      <DeliverablesSection />
      <SecretSauceSection />
      
      <WorkflowIllustrationSection />

      <HowWeWorkSection steps={siteContent.process} />
      <WorkflowSandbox />
      <Testimonials />
      <ConversionPathsSection />
      <TrustRiskSection />

      <EngagementModel />
      <TrustBadges />
      <ContentDrivenFAQ content={faqContent} />
      <ConversionCTA />
    </>
  );
}

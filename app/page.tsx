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
import {
  FAQSchema,
  ProfessionalServiceSchema,
} from '@/components/seo/structured-data';

import { siteContent, SiteConfig } from '@/src/content/site';



// Mapper function to adapt SiteConfig to component props
const mapHeroContent = (config: SiteConfig) => ({
  title: config.brand.tagline,
  subtitle: config.positioning.subheading,
  description: config.brand.description,
  backgroundVariant: 'gradient' as const,
  primaryCta: {
    visible: true,
    label: config.positioning.primaryCTA.label,
    href: config.positioning.primaryCTA.href,
  },
  secondaryCta: {
    visible: true,
    label: config.positioning.secondaryCTA.label,
    href: config.positioning.secondaryCTA.href,
  },
  badgeText: 'New: Agentic Workflow Engine',
  socialProof: [
    { icon: '🚀', text: '10x Faster Deployment' },
    { icon: '🔒', text: 'Enterprise Secure' },
  ],
  trustBadges: [
    { icon: 'shield', text: 'SOC 2 Ready' },
    { icon: 'globe', text: 'Global Scale' },
  ],
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
      <ProfessionalServiceSchema />
      <FAQSchema faqs={homepageFAQs} />
      <ContentDrivenHero content={heroContent} />
      <OutcomesSection />
      <ProofSection />
      <SystemsSection />
      <DeliverablesSection />
      <SecretSauceSection />
      <WorkflowSandbox />
      <Testimonials />
      <EngagementModel />
      <TrustBadges />
      <ContentDrivenFAQ content={faqContent} />
      <ConversionCTA />
    </>
  );
}

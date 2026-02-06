import dynamic from 'next/dynamic';

import { ContentDrivenFAQ } from '@/components/content/ContentDrivenFAQ';
import { ContentDrivenHero } from '@/components/content/ContentDrivenHero';
import { OutcomesSection } from '@/components/home/outcomes-section';
import { ProofSection } from '@/components/home/proof-section';
import { SimpleHero } from '@/components/home/simple-hero';
import { SystemsSection } from '@/components/home/systems-section';
import { DeliverablesSection } from '@/components/home/deliverables-section';
import { EngagementModel } from '@/components/home/engagement-model';
import { ConversionCTA } from '@/components/home/conversion-cta';
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
  } catch {
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
      {content ? <ContentDrivenHero content={content.hero} /> : <SimpleHero />}
      <OutcomesSection />
      <ProofSection />
      <SystemsSection />
      <DeliverablesSection />
      <Testimonials />
      <EngagementModel />
      <TrustBadges />
      {content ? <ContentDrivenFAQ content={content.faq} /> : <FAQ />}
      <ConversionCTA />
    </>
  );
}

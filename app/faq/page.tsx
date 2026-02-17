import type { Metadata } from 'next';

import { FAQSection } from '@/components/content/faq-section';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { siteContent } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'FAQ | AI Automated Systems',
  description:
    'Frequently asked questions about AIAS consulting engagements, delivery model, pricing, and onboarding.',
  canonical: '/faq',
});

export default function FAQPage() {
  return (
    <FAQSection
      entries={siteContent.faq}
      subtitle='Answers on engagement models, timelines, governance, and how we keep rollouts practical and low-risk.'
      title='Frequently asked questions'
    />
  );
}

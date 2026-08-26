import type { Metadata } from 'next';

import { PageHero, PageSection } from '@/components/ui/section-primitives';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PolicyStudioClient } from '@/components/tools/policy-studio-client';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Policy & Guardrail Studio | AI Automated Systems',
  description:
    'Test deterministic boundary rules, PII filters, and confidence escalation thresholds against AI prompts with instant schema export.',
  canonical: '/tools/policy-studio',
});

export default function PolicyStudioPage() {
  return (
    <>
      <div className="container pt-4">
        <Breadcrumbs
          items={[
            { label: 'Quick Tools', href: '/tools' },
            { label: 'Policy & Guardrail Studio' },
          ]}
        />
      </div>

      <PageHero
        eyebrow="Interactive Guardrail Studio"
        title="Policy & Guardrail Studio"
        description="Experience how AIAS builds deterministic boundaries around AI models. Test policy validation rules, PII masking, and confidence escalation gates in real time."
      />

      <PageSection>
        <PolicyStudioClient />
      </PageSection>
    </>
  );
}

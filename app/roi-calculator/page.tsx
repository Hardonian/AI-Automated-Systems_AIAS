import type { Metadata } from 'next';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { RoiCalculator } from '@/components/content/roi-calculator';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { siteContent } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'ROI Calculator | AI Automated Systems',
  description: 'Estimate annual time and cost savings from deterministic workflow automation.',
  canonical: '/roi-calculator',
});

export default function RoiCalculatorPage() {
  return (
    <>
      <PageHero
        eyebrow={siteContent.roiCalculatorPage.hero.eyebrow}
        title={siteContent.roiCalculatorPage.hero.title}
        description={siteContent.roiCalculatorPage.hero.description}
      />

      <PageSection>
        <RoiCalculator />
      </PageSection>

      <PageSection background='muted' width='narrow'>
        <SurfaceCard>
          <h2 className='text-xl font-bold'>Model assumptions</h2>
          <ul className='mt-4 space-y-2 text-sm text-muted-foreground'>
            {siteContent.roiCalculatorPage.assumptions.map(item => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </SurfaceCard>
      </PageSection>
    </>
  );
}

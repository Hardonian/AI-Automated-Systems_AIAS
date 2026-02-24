import type { Metadata } from 'next';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { Button } from '@/components/ui/button';
import { siteContent } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'AI Governance Readiness Checklist | AI Automated Systems',
  description: 'Download and score the AI Governance Readiness Checklist, then optionally share your stack context for architecture feedback.',
  canonical: '/readiness-checklist',
});

export default function ReadinessChecklistPage() {
  const subject = encodeURIComponent('AIAS Governance Checklist Follow-up');
  const body = encodeURIComponent('Team AIAS,\n\nHere is our current AI stack + model mix context:\n- AI stack:\n- Model mix:\n- Current failure modes:\n- Governance maturity:\n\nPlease recommend next steps.');

  return (
    <>
      <PageHero
        eyebrow='Lead magnet'
        title='AI Governance Readiness Checklist'
        description='Download the checklist instantly, score governance readiness qualitatively, and optionally send your context for feedback. This checklist is a starting point for internal decision clarity, not a sales pitch.'
      />
      <PageSection width='narrow'>
        <SurfaceCard>
          <h2 className='text-2xl font-bold'>Download + optional follow-up path</h2>
          <p className='mt-3 text-muted-foreground'>No forced gate. The file is static and immediate, while the optional email route is aligned to governance diagnostics.</p>
          <div className='mt-6 flex flex-wrap gap-3'>
            <Button asChild>
              <a download href='/downloads/ai-systems-readiness-checklist.md'>Download Governance Checklist (.md)</a>
            </Button>
            <Button asChild variant='outline'>
              <a href={`mailto:${siteContent.contact.email}?subject=${subject}&body=${body}`}>Email stack snapshot</a>
            </Button>
          </div>
        </SurfaceCard>
      </PageSection>
    </>
  );
}

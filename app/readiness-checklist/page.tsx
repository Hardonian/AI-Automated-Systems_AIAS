import type { Metadata } from 'next';
import { Download, Mail } from 'lucide-react';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { ReadinessScorecard } from '@/components/content/readiness-scorecard';
import { Button } from '@/components/ui/button';
import { siteContent } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'AI Governance Readiness Checklist & Scorecard | AIAS',
  description: 'Interactive 16-point audit scorecard and downloadable checklist to evaluate AI governance, deterministic boundaries, and error recovery maturity.',
  canonical: '/readiness-checklist',
});

export default function ReadinessChecklistPage() {
  const subject = encodeURIComponent('AIAS Governance Checklist Follow-up');
  const body = encodeURIComponent(
    'Team AIAS,\n\nHere is our current AI stack + model mix context:\n- AI stack:\n- Model mix:\n- Current failure modes:\n- Governance maturity:\n\nPlease recommend next steps.'
  );

  return (
    <>
      <PageHero
        eyebrow="Readiness Scorecard"
        title="AI Governance & Systems Readiness"
        description="Audit your production AI controls against deterministic engineering standards. Score your current posture in real time or export the markdown checklist."
      />

      {/* Main Interactive Scorecard */}
      <PageSection>
        <ReadinessScorecard />
      </PageSection>

      {/* Static Downloads & Direct Submission Options */}
      <PageSection background="muted">
        <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
          <SurfaceCard className="border-2 border-border p-6 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center border-2 border-border bg-black text-primary mb-4">
                <Download className="h-5 w-5" />
              </div>
              <h3 className="font-mono text-base font-bold uppercase text-foreground">
                Raw Markdown Checklist
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Download the raw checklist in markdown format for local repository storage, CI/CD policy tracking, or internal team audits.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t-2 border-border">
              <Button asChild variant="outline" className="w-full rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-wider hover:border-foreground">
                <a download href="/downloads/ai-systems-readiness-checklist.md">
                  Download Checklist (.md)
                </a>
              </Button>
            </div>
          </SurfaceCard>

          <SurfaceCard className="border-2 border-border p-6 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center border-2 border-border bg-black text-primary mb-4">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="font-mono text-base font-bold uppercase text-foreground">
                Email Stack Snapshot
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Prefer async feedback? Send your stack notes and failure modes directly to our lead architects for asynchronous review.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t-2 border-border">
              <Button asChild variant="outline" className="w-full rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-wider hover:border-foreground">
                <a href={`mailto:${siteContent.contact.email}?subject=${subject}&body=${body}`}>
                  Email Stack Snapshot
                </a>
              </Button>
            </div>
          </SurfaceCard>
        </div>
      </PageSection>
    </>
  );
}

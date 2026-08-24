import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Video, CheckCircle2, Shield } from 'lucide-react';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { InteractiveScheduler } from '@/components/content/interactive-scheduler';
import { Button } from '@/components/ui/button';
import { siteContent } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Book a Strategy Call | AI Automated Systems',
  description:
    'Schedule a 30-minute diagnostic session with an AIAS systems architect to map workflows, identify quick wins, and establish deterministic governance boundaries.',
  canonical: '/book',
});

const bookingGuarantees = [
  {
    icon: Shield,
    title: 'Strict Confidentiality',
    description: 'All workflow discussions are treated under strict NDA and PIPEDA privacy standards.',
  },
  {
    icon: Video,
    title: 'Direct Architect Access',
    description: 'You meet directly with a senior AI systems engineer—not an entry-level sales rep.',
  },
  {
    icon: CheckCircle2,
    title: 'Tailored Action Roadmap',
    description: 'Receive a clear diagnosis and structured engagement brief following our session.',
  },
];

export default function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Direct Architecture Booking"
        title="Schedule Your AI Systems Strategy Session"
        description="Select a time slot below to review your workflow bottlenecks, test feasibility, and evaluate deterministic automation architecture. Zero sales pressure—just technical clarity."
      />

      {/* Main Interactive Scheduler */}
      <PageSection>
        <InteractiveScheduler />
      </PageSection>

      {/* What to Expect & Guarantees */}
      <PageSection background="muted">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary mb-2">
            Engagement Standard
          </p>
          <h2 className="text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
            What Happens During Your Strategy Call
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {bookingGuarantees.map((item) => (
            <SurfaceCard key={item.title} className="border-2 border-border p-6 flex flex-col justify-between">
              <div>
                <div className="flex h-10 w-10 items-center justify-center border-2 border-border bg-black text-primary mb-4">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-mono text-base font-bold uppercase text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      {/* Alternative Options CTA */}
      <PageSection width="narrow">
        <SurfaceCard className="text-center p-8 border-2 border-border">
          <h2 className="text-xl font-bold uppercase text-foreground mb-3">
            Prefer an instant assessment before booking?
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Take our 2-minute interactive automation survey or evaluate your governance readiness score.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              className="rounded-none border-2 border-primary bg-primary font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card hover:-translate-y-0.5 transition-all"
            >
              <Link href="/survey">
                Take Automation Survey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-widest hover:border-foreground transition-all"
            >
              <Link href="/readiness-checklist">
                AI Readiness Scorecard
              </Link>
            </Button>
          </div>
        </SurfaceCard>
      </PageSection>
    </>
  );
}

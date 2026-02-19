import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Mail, Video, CheckCircle2 } from 'lucide-react';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { Button } from '@/components/ui/button';
import { getPrimaryCtaHref, siteContent } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Book a Call | AI Automated Systems',
  description:
    'Schedule a free 30-minute strategy call to discuss your automation needs and explore how we can help.',
  canonical: '/book',
});

const bookingSteps = [
  {
    icon: Calendar,
    title: 'Pick a time',
    description: 'Choose a 30-minute slot that works for your schedule.',
  },
  {
    icon: Video,
    title: 'Join the call',
    description: 'We will meet via video call to discuss your workflows.',
  },
  {
    icon: CheckCircle2,
    title: 'Get your roadmap',
    description: 'Receive a tailored automation recommendation within 24 hours.',
  },
];

export default function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Book a Call"
        title="Schedule your free 30-minute strategy session"
        description="Discuss your current workflows, identify quick wins, and get a clear roadmap for automation. No sales pressure—just practical advice."
      />

      <PageSection>
        <div className="grid gap-8 lg:grid-cols-2">
          <SurfaceCard className="p-8">
            <h2 className="text-xl font-semibold mb-6">What to expect</h2>
            <div className="space-y-6">
              {bookingSteps.map((step, index) => (
                <div key={step.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t">
              <h3 className="font-medium mb-3">During the call, we will:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  Review your current manual workflows and pain points
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  Identify high-ROI automation opportunities
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  Discuss governance, compliance, and risk considerations
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  Recommend the right engagement model for your needs
                </li>
              </ul>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium">30 minutes</span>
            </div>

            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6">
              <div className="text-center p-6">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">
                  Calendar embed placeholder
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  (Calendly, SavvyCal, or custom scheduler)
                </p>
              </div>
            </div>

            <Button 
              asChild 
              size="lg" 
              className="w-full transition-transform duration-200 hover:scale-105"
            >
              <a href={getPrimaryCtaHref()}>
                Open scheduling calendar
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>
            </Button>

            <p className="mt-4 text-xs text-muted-foreground text-center">
              Prefer email?{' '}
              <a 
                href={`mailto:${siteContent.contact.email}`}
                className="text-primary underline underline-offset-2 hover:no-underline transition-colors"
              >
                {siteContent.contact.email}
              </a>
            </p>
          </SurfaceCard>
        </div>
      </PageSection>

      <PageSection background="muted" width="narrow">
        <SurfaceCard className="text-center p-8">
          <h2 className="text-xl font-semibold mb-4">Not ready to book?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Take our 2-minute automation assessment to get an instant recommendation on the best approach for your needs.
          </p>
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            className="transition-all duration-200 hover:bg-muted"
          >
            <Link href="/survey">
              Take the automation survey
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </SurfaceCard>
      </PageSection>
    </>
  );
}

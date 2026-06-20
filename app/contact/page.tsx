import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, Mail } from 'lucide-react';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { Button } from '@/components/ui/button';
import { IntakeForm } from '@/components/IntakeForm';
import { getPrimaryCtaHref, siteContent } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Book a Free AI Automation Diagnostic Call | AIAS',
  description:
    'Book a diagnostic, request an architecture review, or submit your AI stack intake for governance-first implementation planning.',
  canonical: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow='Contact'
        title='Start with a focused automation conversation'
        description='Tell us what workflow is blocking your team. We will map options and recommend the right engagement shape without forcing fixed packages.'
      />

      <PageSection>
        <div className='grid gap-8 md:grid-cols-2'>
          <SurfaceCard>
            <Calendar className='h-6 w-6 text-primary' />
            <h2 className='mt-4 text-2xl font-semibold'>Book Diagnostic</h2>
            <p className='mt-3 text-muted-foreground'>
              Schedule a consult to review current workflows, constraints, and immediate quick wins.
            </p>
            <p className='mt-4 flex items-center gap-2 text-sm text-muted-foreground'>
              <Clock className='h-4 w-4' />
              30 minutes • no-pressure planning call
            </p>
            <Button asChild className='mt-6 w-full' size='lg'>
              <a href={getPrimaryCtaHref()}>Book Diagnostic</a>
            </Button>
          </SurfaceCard>

          <SurfaceCard>
            <Mail className='h-6 w-6 text-primary' />
            <h2 className='mt-4 text-2xl font-semibold'>Request architecture review</h2>
            <p className='mt-3 text-muted-foreground'>
              Share context asynchronously and we will reply with next steps and suggested scope.
            </p>
            <p className='mt-4 text-sm text-muted-foreground'>{siteContent.contact.responseTime}</p>
            <Button asChild className='mt-6 w-full' size='lg' variant='outline'>
              <a href={`mailto:${siteContent.contact.email}`}>{siteContent.contact.email}</a>
            </Button>
          </SurfaceCard>
        </div>
      </PageSection>


      <PageSection width='narrow'>
        <IntakeForm />
      </PageSection>

      <PageSection background='muted' width='narrow'>
        <SurfaceCard>
          <h2 className='text-2xl font-bold'>What you get after reaching out</h2>
          <ol className='mt-5 space-y-3 text-muted-foreground'>
            <li>1. Workflow discovery and constraint review.</li>
            <li>2. Recommended engagement shape (consultation, pilot, managed, or enablement).</li>
            <li>3. Clear next actions and ownership plan.</li>
          </ol>
          <Link className='mt-6 inline-block font-semibold text-primary underline underline-offset-4' href='/pricing'>
            Review engagement shapes
          </Link>
        </SurfaceCard>
      </PageSection>
    </>
  );
}

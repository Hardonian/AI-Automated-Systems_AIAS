import type { Metadata } from 'next';
import Link from 'next/link';

import { DiagnosticFrameworkDiagram } from '@/components/visual/DiagnosticFrameworkDiagram';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

const frameworkSteps = [
  'Decision Surface Mapping',
  'Constraint Identification',
  'Failure Mode Matrix',
  'Tradeoff Modeling',
  'Architecture Alignment',
];

export const metadata: Metadata = generateSEOMetadata({
  title: 'AIAS Diagnostic Framework | AI Automated Systems',
  description:
    'The AIAS five-step diagnostic framework used to map decisions, constraints, failure modes, and architecture tradeoffs before implementation.',
  canonical: '/framework',
});

export default function FrameworkPage() {
  return (
    <>
      <PageHero
        eyebrow='Signature framework'
        title='AIAS Diagnostic Architecture Framework'
        description='AIAS helps operations, product, and leadership teams move from AI uncertainty to governed execution. The outcome is a scoped architecture plan with clear tradeoffs, risk controls, and ownership. Discovery comes first because implementation quality depends on decision clarity.'
      />

      <PageSection>
        <DiagnosticFrameworkDiagram />
      </PageSection>

      <PageSection>
        <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
          {frameworkSteps.map(step => (
            <SurfaceCard key={step} className='p-6'>
              <h2 className='text-lg font-semibold'>{step}</h2>
              <p className='mt-2 text-sm text-muted-foreground'>
                This step defines operating boundaries before tooling decisions, reducing brittle workflows and expensive rework.
              </p>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection background='muted'>
        <SurfaceCard>
          <h2 className='text-2xl font-bold'>Related pages</h2>
          <div className='mt-4 flex flex-wrap gap-3 text-sm'>
            <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/how-it-works'>How We Work</Link>
            <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/services'>Services</Link>
            <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/diagnostic'>Diagnostic</Link>
            <Link className='font-medium text-primary underline-offset-4 hover:underline' href='/work'>Proof</Link>
          </div>
        </SurfaceCard>
      </PageSection>
    </>
  );
}

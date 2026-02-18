import type { Metadata } from 'next';

import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { certificationModules } from '@/src/content/moat';

const exercises = [
  {
    title: 'Exercise 1: Governance checklist draft',
    href: '/certification/exercise-1-governance-checklist.md',
  },
  {
    title: 'Exercise 2: Deterministic engagement brief template',
    href: '/certification/exercise-2-deterministic-brief-template.md',
  },
  {
    title: 'Exercise 3: Risk review prompt',
    href: '/certification/exercise-3-risk-review-prompt.md',
  },
];

export const metadata: Metadata = generateSEOMetadata({
  title: 'Certification Path | AI Automated Systems',
  description: 'Open-source certification path for deterministic AI operations with exercises and badge criteria.',
  canonical: '/certification',
});

export default function CertificationPage() {
  return (
    <>
      <PageHero
        eyebrow='OSS badge pathway'
        title='Certification Path'
        description='A lightweight curriculum for operators building deterministic, governable AI systems.'
      />

      <PageSection>
        <div className='grid gap-6 md:grid-cols-2'>
          <SurfaceCard>
            <h2 className='text-2xl font-bold'>Curriculum modules</h2>
            <ul className='mt-4 space-y-2 text-muted-foreground'>
              {certificationModules.map(module => <li key={module}>• {module}</li>)}
            </ul>
          </SurfaceCard>
          <SurfaceCard>
            <h2 className='text-2xl font-bold'>Badge criteria</h2>
            <ul className='mt-4 space-y-2 text-muted-foreground'>
              <li>• Submit completed exercises with deterministic controls documented.</li>
              <li>• Include one architecture diagram and one rollback/replay plan.</li>
              <li>• Provide a governance checklist that maps risks to owners.</li>
            </ul>
          </SurfaceCard>
        </div>
      </PageSection>

      <PageSection width='narrow'>
        <SurfaceCard>
          <h2 className='text-2xl font-bold'>Practical exercises</h2>
          <ul className='mt-4 space-y-2'>
            {exercises.map(exercise => (
              <li key={exercise.href}>
                <a className='text-primary underline underline-offset-4' href={exercise.href}>{exercise.title}</a>
              </li>
            ))}
          </ul>
          <p className='mt-4 text-sm text-muted-foreground'>Submission guidance: open a GitHub issue with your artifacts or email inquiries@aiautomatedsystems.ca with subject line “AIAS Certification Submission”.</p>
        </SurfaceCard>
      </PageSection>
    </>
  );
}

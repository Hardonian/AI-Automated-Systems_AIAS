import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { BreadcrumbSchema } from '@/components/seo/structured-data';
import { RelatedPages } from '@/components/content/related-pages';

const principles = [
  {
    title: 'AI failure is usually structural before technical',
    detail:
      'Most breakdowns start with unclear ownership, missing escalation paths, and undefined decision rights, not weak prompts.',
  },
  {
    title: 'Model selection does not fix unclear decision boundaries',
    detail:
      'A stronger model cannot compensate for ambiguous approvals, undefined handoffs, or absent operational constraints.',
  },
  {
    title: 'Cost and reliability are coupled decisions',
    detail:
      'Every reliability gain carries architecture and operating cost implications, so tradeoffs need to be explicit before rollout.',
  },
  {
    title: 'Evaluation without business context is noise',
    detail:
      'Quality metrics only matter when mapped to the workflows, risk classes, and outcomes that your operators are accountable for.',
  },
  {
    title: 'Governance must be designed, not retrofitted',
    detail:
      'Controls, approval boundaries, and audit traces need to exist before scale, otherwise they become expensive patchwork.',
  },
  {
    title: 'Discovery quality determines implementation quality',
    detail:
      'A disciplined diagnostic phase shortens delivery cycles by preventing high-cost rework after launch decisions are already locked in.',
  },
];

export const metadata: Metadata = generateSEOMetadata({
  title: 'What We Believe About AI Systems | AI Automated Systems',
  description:
    'The AIAS point of view on discovery-first AI execution, governance design, and reliability tradeoffs for consultancy engagements.',
  canonical: '/point-of-view',
});

export default function PointOfViewPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://aiautomatedsystems.ca/' },
          { name: 'Point of View', url: 'https://aiautomatedsystems.ca/point-of-view' },
        ]}
      />
      <PageHero
        eyebrow='AIAS doctrine'
        title='What We Believe About AI Systems'
        description='AIAS helps teams building or repairing AI-enabled operations where reliability, governance, and ownership cannot be optional. Our outcome is clearer decision architecture and safer implementation sequencing. Discovery comes first because execution quality depends on operational clarity.'
      />

      <PageSection>
        <div className='grid gap-5 md:grid-cols-2'>
          {principles.map(principle => (
            <SurfaceCard key={principle.title} className='p-6'>
              <h2 className='text-xl font-semibold'>{principle.title}</h2>
              <p className='mt-3 text-sm text-muted-foreground'>{principle.detail}</p>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection background='muted'>
        <RelatedPages
          navAriaLabel='Point of view related pages'
          linkAriaLabelPrefix='Point of view related page'
          links={[
            { label: 'Framework', href: '/framework' },
            { label: 'How We Work', href: '/how-it-works' },
            { label: 'Services', href: '/services' },
            { label: 'Diagnostic', href: '/diagnostic' },
          ]}
        />
      </PageSection>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageCta, PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { getPrimaryCtaHref } from '@/src/content/site';
import { caseStudies, getCaseStudyBySlug } from '@/src/content/caseStudies';

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const study = getCaseStudyBySlug(params.slug);

  if (!study) {
    return {
      title: 'Case study not found | AI Automated Systems',
    };
  }

  return {
    title: `${study.title} | AIAS Case Study`,
    description: study.summary,
  };
}

function SectionList({ title, items }: { title: string; items: string[] }) {
  return (
    <SurfaceCard>
      <h2 className='text-2xl font-bold'>{title}</h2>
      <ul className='mt-4 space-y-2 text-muted-foreground'>
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </SurfaceCard>
  );
}

export default function CaseStudyDetailPage({ params }: { params: { slug: string } }) {
  const study = getCaseStudyBySlug(params.slug);

  if (!study) {
    notFound();
  }

  return (
    <>
      <PageHero eyebrow='Case study' title={study.title} description={study.summary} />

      <PageSection width='narrow'>
        <SurfaceCard>
          <h2 className='text-2xl font-bold'>1) Client Problem</h2>
          <p className='mt-4 text-muted-foreground'>{study.clientProblem}</p>
        </SurfaceCard>
      </PageSection>

      <PageSection>
        <div className='grid gap-6 md:grid-cols-2'>
          <SectionList title='2) System Constraints' items={study.systemConstraints} />
          <SurfaceCard>
            <h2 className='text-2xl font-bold'>3) Architecture Chosen</h2>
            <p className='mt-4 text-muted-foreground'>{study.architectureChosen}</p>
          </SurfaceCard>
          <SectionList title='4) Automation Layer' items={study.automationLayer} />
          <SectionList title='5) AI Integration' items={study.aiIntegration} />
          <SectionList title='6) Governance & Determinism' items={study.governanceDeterminism} />
          <SectionList title='7) Performance Results' items={study.performanceResults} />
        </div>
      </PageSection>

      <PageSection width='narrow'>
        <SectionList title='8) Long-Term Scalability' items={study.longTermScalability} />
      </PageSection>

      <PageCta
        title='Want this architecture mapped to your environment?'
        description='We can scope advisory, co-build, managed refinement, or enterprise governance engagements.'
        primary={{ label: 'Book strategy call', href: getPrimaryCtaHref() }}
        secondary={{ label: 'Back to case studies', href: '/case-studies' }}
      />

      <PageSection width='narrow'>
        <Link className='text-sm font-semibold text-primary underline underline-offset-4' href='/ecosystem'>
          See ecosystem architecture
        </Link>
      </PageSection>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageCta, PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { getPrimaryCtaHref } from '@/src/content/site';
import { caseStudies, getCaseStudyBySlug } from '@/src/content/caseStudies';

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

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

function CaseDiagram({ slug }: { slug: string }) {
  return (
    <svg aria-label='Case study architecture diagram' className='h-auto w-full rounded-md border bg-background p-4' viewBox='0 0 600 220'>
      <rect fill='currentColor' fillOpacity='0.06' height='60' rx='10' width='140' x='20' y='80' />
      <text fontSize='12' textAnchor='middle' x='90' y='115'>Inputs</text>
      <line stroke='currentColor' strokeOpacity='0.5' x1='160' x2='230' y1='110' y2='110' />
      <rect fill='currentColor' fillOpacity='0.08' height='60' rx='10' width='170' x='230' y='80' />
      <text fontSize='12' textAnchor='middle' x='315' y='110'>Deterministic Control Layer</text>
      <line stroke='currentColor' strokeOpacity='0.5' x1='400' x2='470' y1='110' y2='110' />
      <rect fill='currentColor' fillOpacity='0.06' height='60' rx='10' width='110' x='470' y='80' />
      <text fontSize='12' textAnchor='middle' x='525' y='115'>Outcomes</text>
      <text fontSize='11' textAnchor='middle' x='300' y='30'>{slug}</text>
    </svg>
  );
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  return (
    <>
      <PageHero eyebrow='Case study deep dive' title={study.title} description={study.summary} />

      <PageSection width='narrow'>
        <SurfaceCard>
          <h2 className='text-2xl font-bold'>1) Problem</h2>
          <p className='mt-4 text-muted-foreground'>{study.clientProblem}</p>
        </SurfaceCard>
      </PageSection>

      <PageSection>
        <div className='grid gap-6 md:grid-cols-2'>
          <SectionList title='2) Constraints' items={study.systemConstraints} />
          <SurfaceCard>
            <h2 className='text-2xl font-bold'>3) Architecture</h2>
            <p className='mt-4 text-muted-foreground'>{study.architectureChosen}</p>
            <div className='mt-4'>
              <CaseDiagram slug={study.slug} />
            </div>
          </SurfaceCard>
          <SectionList title='4) Tradeoffs' items={study.tradeoffs} />
          <SectionList title='5) Governance model' items={study.governanceModel} />
          <SectionList title='6) Performance outcomes' items={study.performanceResults} />
          <SectionList title='7) What we would do next' items={study.whatNext} />
        </div>
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

import type { Metadata } from 'next';

import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import buildLogWeeks from '@/content/build-log.json';

const categoryStyles: Record<string, string> = {
  ship: 'bg-emerald-500/15 text-emerald-700',
  fix: 'bg-blue-500/15 text-blue-700',
  experiment: 'bg-violet-500/15 text-violet-700',
  kill: 'bg-rose-500/15 text-rose-700',
  learn: 'bg-amber-500/20 text-amber-800',
};

export const metadata: Metadata = generateSEOMetadata({
  title: 'Build Log | AI Automated Systems',
  description: 'Public weekly transparency ledger of shipped changes, fixes, experiments, and lessons.',
  canonical: '/build-log',
});

export default function BuildLogPage() {
  return (
    <>
      <PageHero
        eyebrow='Public transparency ledger'
        title='Build Log'
        description='What we shipped, changed, killed, and learned — published weekly with references.'
      />

      <PageSection width='narrow'>
        <p className='text-sm text-muted-foreground'>Prefer feed readers? Subscribe to <a className='underline underline-offset-4' href='/build-log-feed.xml'>our build log feed</a>.</p>
      </PageSection>

      {buildLogWeeks.map(week => (
        <PageSection key={week.weekOf}>
          <SurfaceCard>
            <h2 className='text-2xl font-bold'>Week of {week.weekOf}</h2>
            <div className='mt-6 space-y-4'>
              {week.entries.map(entry => (
                <article className='rounded-lg border p-4' key={`${entry.date}-${entry.title}`}>
                  <div className='flex flex-wrap items-center gap-2'>
                    <p className='text-sm font-semibold'>{entry.date}</p>
                    <span className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${categoryStyles[entry.category]}`}>{entry.category}</span>
                  </div>
                  <h3 className='mt-2 text-lg font-semibold'>{entry.title}</h3>
                  <p className='mt-1 text-sm text-muted-foreground'>{entry.summary}</p>
                  {entry.links?.length ? (
                    <ul className='mt-2 space-y-1 text-sm'>
                      {entry.links.map(link => (
                        <li key={link.href}>
                          <a className='font-medium text-primary underline underline-offset-4' href={link.href}>
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </SurfaceCard>
        </PageSection>
      ))}
    </>
  );
}

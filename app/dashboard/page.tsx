import type { Metadata } from 'next';
import Link from 'next/link';

import { getPrimaryCtaHref } from '@/src/content/site';

export const metadata: Metadata = {
  title: 'Dashboard | AI Automated Systems',
  description: 'Protected workspace entry for client and team operations.',
};

export default function DashboardPage() {
  return (
    <section className='container py-16'>
      <h1 className='text-4xl font-bold'>Dashboard</h1>
      <p className='mt-4 max-w-2xl text-muted-foreground'>
        This workspace is reserved for authenticated client and team sessions. Sign in to continue.
      </p>
      <div className='mt-6 rounded-xl border bg-card p-6'>
        <p className='text-sm text-muted-foreground'>No active session detected.</p>
        <Link className='mt-3 inline-block font-semibold text-primary underline' href={getPrimaryCtaHref()}>
          Request access / book a call
        </Link>
      </div>
    </section>
  );
}

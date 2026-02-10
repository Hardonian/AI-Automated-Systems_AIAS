import type { Metadata } from 'next';

import { ContentCalendarView } from '@/components/admin/content-calendar';

export const metadata: Metadata = {
  title: 'Content Calendar — AIAS Platform',
  description: 'Manage blog post publishing schedule and content generation.',
};

export default function ContentCalendarPage() {
  return (
    <div className='container py-16'>
      <div className='mb-8'>
        <h1 className='mb-2 text-4xl font-bold'>Content Calendar</h1>
        <p className='text-muted-foreground'>
          Manage blog post publishing schedule and content generation
        </p>
      </div>
      <ContentCalendarView />
    </div>
  );
}

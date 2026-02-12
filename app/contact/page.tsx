import type { Metadata } from 'next';
import Link from 'next/link';

import { FAQChatbot } from '@/components/content/faq-chatbot';
import { LeadCaptureForm } from '@/components/content/lead-capture-form';
import { getPrimaryCtaHref, siteContent } from '@/src/content/site';

export const metadata: Metadata = {
  title: 'Contact | AI Automated Systems',
  description:
    'Start a conversation with AIAS about agentic automation, workflow modernization, and implementation strategy.',
};

export default function ContactPage() {
  return (
    <section className='container py-16'>
      <h1 className='text-4xl font-bold'>Contact AI Automated Systems</h1>
      <p className='mt-4 max-w-2xl text-muted-foreground'>
        Tell us your highest-friction workflow. We will propose a practical path from discovery to pilot.
      </p>
      <div className='mt-8 space-y-3 rounded-xl border bg-card p-6'>
        <p>
          Email:{' '}
          <Link className='font-semibold text-primary underline' href={`mailto:${siteContent.contact.email}`}>
            {siteContent.contact.email}
          </Link>
        </p>
        <p className='text-sm text-muted-foreground'>{siteContent.contact.responseTime}</p>
        <Link className='font-semibold text-primary underline' href={getPrimaryCtaHref()}>
          {siteContent.positioning.primaryCTA.label}
        </Link>
      </div>

      <div className='mt-8 grid gap-6 lg:grid-cols-2'>
        <LeadCaptureForm />
        <FAQChatbot />
      </div>
    </section>
  );
}

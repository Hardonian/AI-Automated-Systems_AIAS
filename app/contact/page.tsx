import { Mail, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

import { ContactForm } from '@/components/contact-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Contact Us — AIAS Consultancy',
  description:
    'Get in touch with AIAS Consultancy. Discuss your automation needs, ask questions, or request support.',
};

export default function ContactPage() {
  return (
    <div className='container py-16'>
      <div className='mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-2'>
        <div>
          <h1 className='mb-6 text-4xl font-bold'>Get in Touch</h1>
          <p className='mb-8 text-lg text-muted-foreground'>
            Have a question about our services or platform? We're here to help.
            Fill out the form or reach out directly.
          </p>

          <div className='space-y-6'>
            <div className='flex items-start gap-4'>
              <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10'>
                <Mail className='h-5 w-5 text-primary' />
              </div>
              <div>
                <h3 className='mb-1 font-semibold'>Email Us</h3>
                <p className='mb-1 text-sm text-muted-foreground'>
                  General Inquiries
                </p>
                <a
                  className='text-primary hover:underline'
                  href='mailto:inquiries@aiautomatedsystems.ca'
                >
                  inquiries@aiautomatedsystems.ca
                </a>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10'>
                <MapPin className='h-5 w-5 text-primary' />
              </div>
              <div>
                <h3 className='mb-1 font-semibold'>Location</h3>
                <p className='text-sm text-muted-foreground'>
                  Toronto, Ontario
                  <br />
                  Canada
                </p>
              </div>
            </div>
          </div>

          <div className='mt-12 rounded-lg border bg-muted/50 p-6'>
            <h3 className='mb-2 font-semibold'>Looking for a Strategy Call?</h3>
            <p className='mb-4 text-sm text-muted-foreground'>
              If you're ready to discuss a specific project, booking a call is
              the fastest way to get started.
            </p>
            <a
              className='font-medium text-primary hover:underline'
              href='/demo'
            >
              Book a Strategy Call →
            </a>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>
                We typically respond within 1 business day.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

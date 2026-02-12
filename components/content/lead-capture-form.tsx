'use client';

import { FormEvent, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { siteContent } from '@/src/content/site';

export function LeadCaptureForm() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const mailtoLink = useMemo(() => {
    const subject = encodeURIComponent(`Consultation request from ${name || 'website visitor'}`);
    const body = encodeURIComponent(
      [
        `Name: ${name || 'N/A'}`,
        `Company: ${company || 'N/A'}`,
        `Email: ${email || 'N/A'}`,
        '',
        'Use case details:',
        message || 'N/A',
      ].join('\n')
    );
    return `mailto:${siteContent.contact.email}?subject=${subject}&body=${body}`;
  }, [company, email, message, name]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.href = mailtoLink;
  };

  return (
    <section className='rounded-xl border bg-card p-6'>
      <h2 className='text-2xl font-semibold'>Lead capture</h2>
      <p className='mt-2 text-sm text-muted-foreground'>
        Share your use case and we will follow up with a scoped next step.
      </p>
      <form className='mt-4 space-y-3' onSubmit={handleSubmit}>
        <Input aria-label='Name' onChange={e => setName(e.target.value)} placeholder='Name' value={name} />
        <Input aria-label='Company' onChange={e => setCompany(e.target.value)} placeholder='Company' value={company} />
        <Input aria-label='Work email' onChange={e => setEmail(e.target.value)} placeholder='Work email' type='email' value={email} />
        <Input
          aria-label='Use case'
          onChange={e => setMessage(e.target.value)}
          placeholder='What process should we improve first?'
          value={message}
        />
        <Button type='submit'>Send inquiry</Button>
      </form>
    </section>
  );
}

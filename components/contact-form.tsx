'use client';

import { CheckCircle, Copy, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const CONTACT_EMAIL = 'inquiries@aiautomatedsystems.ca';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setState('success');
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch (error) {
      setState('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong.'
      );
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: noop
    }
  };

  if (state === 'success') {
    return (
      <div
        className='space-y-4 py-8 text-center'
        role='status'
        aria-live='polite'
      >
        <CheckCircle className='mx-auto h-12 w-12 text-green-500' />
        <h3 className='text-xl font-semibold'>Message sent</h3>
        <p className='text-muted-foreground'>
          We typically respond within 1 business day.
        </p>
        <Button variant='outline' onClick={() => setState('idle')}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form className='space-y-4' onSubmit={handleSubmit} noValidate>
      <div className='space-y-2'>
        <Label htmlFor='contact-name'>Name</Label>
        <Input
          required
          id='contact-name'
          aria-label='Your name'
          placeholder='Your name'
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='contact-email'>Email</Label>
        <Input
          required
          id='contact-email'
          aria-label='Your email'
          placeholder='your@email.com'
          type='email'
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='contact-company'>
          Company{' '}
          <span className='text-xs text-muted-foreground'>(optional)</span>
        </Label>
        <Input
          id='contact-company'
          aria-label='Your company'
          placeholder='Company name'
          value={formData.company}
          onChange={e => setFormData({ ...formData, company: e.target.value })}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='contact-message'>Message</Label>
        <Textarea
          required
          id='contact-message'
          aria-label='Your message'
          placeholder='How can we help you?'
          rows={5}
          value={formData.message}
          onChange={e => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      {state === 'error' && (
        <div
          className='space-y-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4'
          role='alert'
        >
          <p className='text-sm font-medium text-destructive'>{errorMessage}</p>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <span>Or email us directly:</span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className='font-medium text-primary hover:underline'
            >
              {CONTACT_EMAIL}
            </a>
            <button
              type='button'
              onClick={handleCopyEmail}
              className='inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground'
              aria-label='Copy email address'
            >
              <Copy className='h-3 w-3' />
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      <Button
        className='w-full'
        disabled={state === 'submitting'}
        type='submit'
      >
        {state === 'submitting' && (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        )}
        Send Message
      </Button>
    </form>
  );
}

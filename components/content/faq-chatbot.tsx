'use client';

import { FormEvent, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { siteContent } from '@/src/content/site';

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
}

function bestFaqMatch(query: string): { question: string; answer: string } | null {
  const tokens = normalize(query)
    .split(/\s+/)
    .map(token => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) {
    return null;
  }

  let bestScore = 0;
  let bestItem: { question: string; answer: string } | null = null;

  for (const item of siteContent.faq) {
    const haystack = normalize(`${item.question} ${item.answer}`);
    const score = tokens.reduce((sum, token) => (haystack.includes(token) ? sum + 1 : sum), 0);
    if (score > bestScore) {
      bestScore = score;
      bestItem = item;
    }
  }

  return bestScore > 0 ? bestItem : null;
}

export function FAQChatbot() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');

  const match = useMemo(() => bestFaqMatch(submitted), [submitted]);
  const hasOpenAIKey = Boolean(process.env.NEXT_PUBLIC_OPENAI_API_KEY);
  const hasDocsKey = Boolean(process.env.NEXT_PUBLIC_GOOGLE_DOCS_KEY);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(query.trim());
  };

  return (
    <section className='rounded-xl border bg-card p-6'>
      <h2 className='text-2xl font-semibold'>FAQ assistant</h2>
      <p className='mt-2 text-sm text-muted-foreground'>
        Ask a question and get an instant answer from our local FAQ knowledge base.
      </p>

      <form className='mt-4 flex flex-col gap-3 sm:flex-row' onSubmit={onSubmit}>
        <Input
          aria-label='Ask a question'
          onChange={event => setQuery(event.target.value)}
          placeholder='e.g. How fast can we launch a pilot?'
          value={query}
        />
        <Button type='submit'>Ask</Button>
      </form>

      <div className='mt-4 rounded-lg bg-muted/40 p-4 text-sm'>
        {submitted.length === 0 && (
          <p className='text-muted-foreground'>
            No question yet. Try asking about timelines, deployment, or data privacy.
          </p>
        )}
        {submitted.length > 0 && !match && (
          <p>
            I could not find a direct FAQ match. Please email{' '}
            <a className='font-semibold text-primary underline' href={`mailto:${siteContent.contact.email}`}>
              {siteContent.contact.email}
            </a>{' '}
            and we will respond.
          </p>
        )}
        {match && (
          <div className='space-y-2'>
            <p className='font-semibold'>{match.question}</p>
            <p className='text-muted-foreground'>{match.answer}</p>
          </div>
        )}
      </div>

      <p className='mt-4 text-xs text-muted-foreground'>
        Integration readiness: OpenAI key {hasOpenAIKey ? 'configured' : 'not configured'} · Google Docs key{' '}
        {hasDocsKey ? 'configured' : 'not configured'}.
      </p>
    </section>
  );
}

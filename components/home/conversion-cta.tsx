'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Mail, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getPrimaryCtaHref, siteContent } from '@/src/content/site';
import { track } from '@/lib/analytics';

export function ConversionCTA() {
  const [status, setStatus] = useState('');

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteContent.contact.email);
      track('copy_email_clicked', { location: 'conversion_cta' });
      setStatus('Email copied to clipboard.');
    } catch {
      setStatus('Copy failed. Please use the email link.');
    }
  };

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-muted/30 via-primary/[0.03] to-muted/30 px-4 py-24"
      id="contact"
    >
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Let&apos;s talk about your workflow
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Pick the path that fits. No pressure, no sales deck — just a focused
            conversation about what&apos;s actually blocking your team.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-3">
          {/* Path 1: Quick Call */}
          <div className="group rounded-2xl border-2 border-primary/20 bg-card p-6 text-center transition-all hover:border-primary/40 hover:shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-white">
              <Calendar className="h-5 w-5 text-primary group-hover:text-white" />
            </div>
            <h3 className="text-lg font-bold">30-min call</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Walk through your workflows live. We&apos;ll map quick wins and flag risks.
            </p>
            <Button
              asChild
              className="hero-cta-glow mt-5 w-full font-semibold"
              size="lg"
              onClick={() => track('primary_cta_clicked', { location: 'conversion_cta', path: 'call' })}
            >
              <Link href={getPrimaryCtaHref()}>
                Book a Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Path 2: Async Email */}
          <div className="group rounded-2xl border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold">Send context async</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Share your stack and constraints by email. We reply with a scope recommendation.
            </p>
            <Button
              asChild
              className="mt-5 w-full font-semibold"
              size="lg"
              variant="outline"
              onClick={() => track('email_cta_clicked', { location: 'conversion_cta' })}
            >
              <Link href={`mailto:${siteContent.contact.email}?subject=AIAS%20Inquiry%20-%20Workflow%20Context`}>
                Email Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Path 3: Self-Serve */}
          <div className="group rounded-2xl border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold">Explore first</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Run our readiness checklist or ROI calculator before reaching out.
            </p>
            <Button
              asChild
              className="mt-5 w-full font-semibold"
              size="lg"
              variant="outline"
              onClick={() => track('self_serve_cta_clicked', { location: 'conversion_cta' })}
            >
              <Link href="/readiness-checklist">
                Start Checklist
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p>{siteContent.contact.responseTime}</p>
          <button
            className="mt-2 text-primary underline-offset-4 hover:underline"
            onClick={handleCopyEmail}
            type="button"
          >
            Copy email address
          </button>
          {status && <p className="mt-2 text-xs text-primary">{status}</p>}
        </div>
      </div>
    </section>
  );
}

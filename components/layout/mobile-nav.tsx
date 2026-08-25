'use client';
import { Menu, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { getPrimaryCtaHref, siteContent } from '@/src/content/site';

const MOBILE_TOOL_LINKS = [
  { label: 'Automation Simulator', href: '/automation-demo' },
  { label: 'Operations Dashboard', href: '/dashboard' },
  { label: 'ROI Calculator', href: '/roi-calculator' },
  { label: 'Readiness Scorecard', href: '/readiness-checklist' },
  { label: 'Scope Estimator', href: '/engagement-simulator' },
  { label: 'Book Diagnostic', href: '/book' },
];

const MOBILE_BLUEPRINT_LINKS = [
  { label: 'Blueprints Library', href: '/blueprints' },
  { label: 'Systems Framework', href: '/framework' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Build Log', href: '/build-log' },
  { label: 'Operational Metrics', href: '/metrics' },
  { label: 'FAQ', href: '/faq' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          aria-controls='mobile-navigation'
          aria-expanded={open}
          aria-label='Open navigation menu'
          className='min-h-[44px] min-w-[44px] rounded-none border-2 border-border bg-card hover:border-primary'
          data-testid='mobile-nav-trigger'
          size='sm'
          variant='ghost'
        >
          <Menu aria-hidden='true' className='h-5 w-5' />
        </Button>
      </SheetTrigger>
      <SheetContent
        aria-label='Mobile navigation'
        className='w-80 rounded-none border-l-2 border-primary bg-background p-6 shadow-2xl overflow-y-auto'
        id='mobile-navigation'
        side='right'
      >
        <div className="flex items-center gap-2 pb-4 border-b-2 border-border">
          <span className="flex h-7 w-7 items-center justify-center border border-primary bg-primary/10 text-xs font-mono font-bold text-primary">
            {'//'}
          </span>
          <span className="font-mono text-sm font-black uppercase tracking-wider text-foreground">
            AIAS Platform
          </span>
        </div>

        <nav
          aria-label='Mobile navigation menu'
          className='mt-6 flex flex-col gap-6'
          data-testid='mobile-nav-menu'
          role='navigation'
        >
          {/* Primary Navigation */}
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Main Navigation
            </p>
            <div className="space-y-1">
              {siteContent.navigation.primary.map(link => (
                <Link
                  key={link.href}
                  aria-label={`Navigate to ${link.label}`}
                  className='flex items-center justify-between p-2 font-mono text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-primary/10 hover:text-primary'
                  href={link.href}
                  onClick={() => setOpen(false)}
                >
                  <span>{link.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>

          {/* Interactive Tools */}
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
              Interactive Tools & Simulators
            </p>
            <div className="grid grid-cols-1 gap-1">
              {MOBILE_TOOL_LINKS.map(link => (
                <Link
                  key={link.href}
                  aria-label={`Navigate to ${link.label}`}
                  className='flex items-center justify-between p-2 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
                  href={link.href}
                  onClick={() => setOpen(false)}
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-[9px] border border-border px-1 py-0.2 bg-muted/40">TOOL</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Blueprints & Architecture */}
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Architecture & Reference
            </p>
            <div className="grid grid-cols-1 gap-1">
              {MOBILE_BLUEPRINT_LINKS.map(link => (
                <Link
                  key={link.href}
                  aria-label={`Navigate to ${link.label}`}
                  className='flex items-center justify-between p-2 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
                  href={link.href}
                  onClick={() => setOpen(false)}
                >
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className='space-y-2.5 border-t-2 border-border pt-4'>
            <Button
              asChild
              className='min-h-[44px] w-full rounded-none border-2 border-primary bg-primary font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card'
            >
              <Link
                aria-label={siteContent.positioning.primaryCTA.label}
                href={getPrimaryCtaHref()}
                onClick={() => setOpen(false)}
              >
                {siteContent.positioning.primaryCTA.label}
              </Link>
            </Button>
            <Button
              asChild
              className='min-h-[44px] w-full rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-widest'
              variant='outline'
            >
              <Link
                aria-label={siteContent.positioning.secondaryCTA.label}
                href={siteContent.positioning.secondaryCTA.href}
                onClick={() => setOpen(false)}
              >
                {siteContent.positioning.secondaryCTA.label}
              </Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}


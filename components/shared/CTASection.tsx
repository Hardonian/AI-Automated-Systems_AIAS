'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { getContainerClasses } from '@/lib/design-tokens';

interface CTASectionProps {
  title: string;
  subtitle?: string;
  primaryCta?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  secondaryCta?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  variant?: 'default' | 'gradient' | 'muted';
}

export function CTASection({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  variant = 'default',
}: CTASectionProps) {
  const bgClasses = {
    default: 'border-t border-border/50 bg-muted/30',
    gradient: 'bg-gradient-to-b from-transparent via-primary/5 to-transparent',
    muted: 'bg-muted/50',
  };

  return (
    <section className={`py-20 ${bgClasses[variant]}`}>
      <div className={`${getContainerClasses('narrow')} text-center`}>
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">{title}</h2>
        {subtitle && (
          <p className="mb-8 text-lg text-muted-foreground">{subtitle}</p>
        )}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {primaryCta && (
            <Button asChild size="lg" className="min-h-[48px] px-8">
              <Link href={primaryCta.href} onClick={primaryCta.onClick}>
                {primaryCta.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
          {secondaryCta && (
            <Button asChild size="lg" variant="outline" className="min-h-[48px] px-8">
              <Link href={secondaryCta.href} onClick={secondaryCta.onClick}>
                {secondaryCta.label}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

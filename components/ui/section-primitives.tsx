import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  BORDER_RADIUS,
  CARD_SHADOWS,
  GRID_GAPS,
  TYPOGRAPHY,
  getContainerClasses,
  getSectionClasses,
} from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

export function PageHero({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <section className={cn(getSectionClasses('large', 'gradient'), 'border-b', className)}>
      <div className={getContainerClasses('default')}>
        <header className='mx-auto max-w-3xl text-center'>
          {eyebrow && <p className={cn(TYPOGRAPHY.eyebrow, 'text-primary')}>{eyebrow}</p>}
          <h1 className={cn(TYPOGRAPHY.h2, 'mt-3')}>{title}</h1>
          <p className={cn(TYPOGRAPHY.body, 'mt-4 text-muted-foreground')}>{description}</p>
        </header>
      </div>
    </section>
  );
}

export function PageSection({
  children,
  className,
  background = 'default',
  width = 'default',
}: {
  children: ReactNode;
  className?: string;
  background?: 'default' | 'gradient' | 'gradientReverse' | 'muted' | 'card';
  width?: 'narrow' | 'default' | 'wide' | 'full';
}) {
  return (
    <section className={cn(getSectionClasses('default', background), className)}>
      <div className={getContainerClasses(width)}>{children}</div>
    </section>
  );
}

export function SurfaceCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <article className={cn(BORDER_RADIUS.card, CARD_SHADOWS.card, 'border bg-card p-8 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl', className)}>
      {children}
    </article>
  );
}

export function PageCta({
  title,
  description,
  primary,
  secondary,
}: {
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <PageSection width='narrow'>
      <SurfaceCard className='bg-gradient-to-br from-primary/10 to-accent/10 text-center'>
        <h2 className={TYPOGRAPHY.h4}>{title}</h2>
        <p className={cn(TYPOGRAPHY.bodySmall, 'mt-3 text-muted-foreground')}>{description}</p>
        <div className={cn('mt-6 flex flex-col justify-center sm:flex-row', GRID_GAPS.small)}>
          <Button asChild size='lg'>
            <Link href={primary.href}>
              {primary.label}
              <ArrowRight className='h-4 w-4' />
            </Link>
          </Button>
          {secondary && (
            <Button asChild size='lg' variant='outline'>
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          )}
        </div>
      </SurfaceCard>
    </PageSection>
  );
}

/**
 * Spacing System Component
 * Consistent spacing utilities for visual hierarchy
 */

'use client';

import { cn } from '@/lib/utils';

/**
 * Spacing scale: 4px base unit
 * 0 = 0px
 * 1 = 4px
 * 2 = 8px
 * 3 = 12px
 * 4 = 16px
 * 5 = 20px
 * 6 = 24px
 * 8 = 32px
 * 10 = 40px
 * 12 = 48px
 * 16 = 64px
 * 20 = 80px
 * 24 = 96px
 */

export const spacing = {
  xs: '0.5rem',    // 8px
  sm: '1rem',      // 16px
  md: '1.5rem',    // 24px
  lg: '2rem',      // 32px
  xl: '3rem',      // 48px
  '2xl': '4rem',   // 64px
  '3xl': '6rem',   // 96px
};

/**
 * Section spacing component
 */
const spacingValues = {
  xs: 'space-y-2',
  sm: 'space-y-4',
  md: 'space-y-6',
  lg: 'space-y-8',
  xl: 'space-y-12',
} as const;

export function Section({
  children,
  spacing = 'lg',
  className,
}: {
  children: React.ReactNode;
  spacing?: keyof typeof spacingValues;
  className?: string;
}) {
  return (
    <section
      className={cn(
        `py-${spacing === 'lg' ? '16' : spacing === 'xl' ? '20' : '12'}`,
        className
      )}
    >
      {children}
    </section>
  );
}

/**
 * Container with consistent padding
 */
export function Container({
  children,
  size = 'default',
  className,
}: {
  children: React.ReactNode;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'max-w-3xl',
    default: 'max-w-6xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[90rem]',
  };

  return (
    <div className={cn('container mx-auto px-4', sizeClasses[size], className)}>
      {children}
    </div>
  );
}

/**
 * Vertical rhythm component
 */
export function VerticalRhythm({
  children,
  gap = 'md',
  className,
}: {
  children: React.ReactNode;
  gap?: keyof typeof spacing;
  className?: string;
}) {
  return (
    <div className={cn(`space-y-${gap === 'md' ? '6' : gap === 'lg' ? '8' : '4'}`, className)}>
      {children}
    </div>
  );
}

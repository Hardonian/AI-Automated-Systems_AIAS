/**
 * Enhanced Button Component
 * CRO-optimized, accessible, with loading states and animations
 */

'use client';

import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackCTAClick } from '@/lib/cro/optimization';

interface EnhancedButtonProps extends ButtonProps {
  loading?: boolean;
  trackClick?: boolean;
  urgency?: 'low' | 'medium' | 'high';
  pulse?: boolean;
  shimmer?: boolean;
}

export function EnhancedButton({
  children,
  loading,
  trackClick = true,
  urgency,
  pulse,
  shimmer,
  className,
  onClick,
  ...props
}: EnhancedButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (trackClick && !loading) {
      const buttonId = props.id || props['aria-label'] || String(children);
      trackCTAClick(buttonId, 'button-click', urgency);
    }
    onClick?.(e);
  };

  return (
    <Button
      {...props}
      onClick={handleClick}
      disabled={props.disabled || loading}
      className={cn(
        'relative overflow-hidden',
        pulse && 'animate-pulse',
        shimmer && 'shimmer-effect',
        urgency === 'high' && 'ring-2 ring-primary ring-offset-2',
        className
      )}
      aria-busy={loading}
    >
      {loading && (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span className="sr-only">Loading</span>
        </>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>{children}</span>
    </Button>
  );
}

'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Sparkles, Clock } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { useRuntimeUiConfig } from '@/lib/runtime-ui/use-runtime-ui-config';

export function EnhancedStickyCTA() {
  const { data: uiConfig } = useRuntimeUiConfig();

  const enabled = uiConfig?.flags?.stickyCtaEnabled !== false;
  const sticky = uiConfig?.copy?.stickyCta;

  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!enabled) {
      setIsVisible(false);
      return;
    }

    // Calculate time until end of day for urgency
    const updateTime = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    if (sticky?.showCountdown !== false) {
      updateTime();
    }
    const interval = setInterval(() => {
      if (sticky?.showCountdown !== false) {
        updateTime();
      }
    }, 60000);

    const handleScroll = () => {
      const threshold = sticky?.showAfterScrollPx ?? 400;
      if (window.scrollY > threshold && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, [enabled, isDismissed, sticky?.showAfterScrollPx, sticky?.showCountdown]);

  // Check localStorage for dismissal
  useEffect(() => {
    if (sticky?.dismissible === false) {
      setIsDismissed(false);
      return;
    }
    const dismissed = localStorage.getItem('cta-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, [sticky?.dismissible]);

  const handleDismiss = () => {
    if (sticky?.dismissible === false) {
      return;
    }
    setIsDismissed(true);
    setIsVisible(false);
    localStorage.setItem('cta-dismissed', 'true');
    // Re-enable after 24 hours
    setTimeout(
      () => {
        localStorage.removeItem('cta-dismissed');
      },
      24 * 60 * 60 * 1000
    );
  };

  if (!enabled || !isVisible || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        initial={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        {...({
          className: 'fixed bottom-0 left-0 right-0 z-50 shadow-2xl',
        } as any)}
        aria-label='Call to action'
        role='banner'
      >
        <div className='container mx-auto px-3 py-3 md:px-4 md:py-4'>
          <div className='flex flex-col items-center justify-between gap-3 rounded-lg border-2 border-primary/50 bg-gradient-to-r from-primary/95 via-primary to-accent/95 p-3 shadow-2xl backdrop-blur-md sm:flex-row md:gap-4 md:rounded-xl md:p-4'>
            {/* Content */}
            <div className='flex-1 text-center sm:text-left'>
              <div className='mb-1 flex items-center justify-center gap-2 sm:justify-start'>
                <Sparkles
                  aria-hidden='true'
                  className='h-4 w-4 animate-pulse text-white'
                />
                <div className='text-sm font-bold text-white md:text-base'>
                  {sticky?.heading ?? 'Ready to Transform Your Business?'}
                </div>
              </div>
              <div className='flex flex-wrap items-center justify-center gap-2 text-xs text-white/90 sm:justify-start md:text-sm'>
                {(sticky?.items?.length
                  ? sticky.items
                  : ['Schedule a free strategy call', 'See our builds']
                ).map((item, idx, arr) => (
                  <span key={idx} className='flex items-center gap-2'>
                    <span>{item}</span>
                    {idx < arr.length - 1 ? (
                      <span className='hidden sm:inline'>•</span>
                    ) : null}
                  </span>
                ))}
                {sticky?.showCountdown !== false ? (
                  <>
                    <span className='hidden sm:inline'>•</span>
                    <span className='flex items-center gap-1'>
                      <Clock aria-hidden='true' className='h-3 w-3' />
                      {timeLeft} left today
                    </span>
                  </>
                ) : null}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className='flex w-full items-center gap-2 sm:w-auto md:gap-3'>
              <Button
                asChild
                className='h-9 min-h-[36px] flex-1 bg-white text-xs font-bold text-primary shadow-lg transition-all hover:scale-105 hover:bg-white/90 hover:shadow-xl sm:flex-none md:h-10 md:text-sm'
                size='sm'
              >
                <Link
                  aria-label={
                    sticky?.primaryCta?.label ?? 'Schedule a free strategy call'
                  }
                  href={sticky?.primaryCta?.href ?? '/demo'}
                >
                  <span className='flex items-center justify-center gap-1'>
                    {sticky?.primaryCta?.label ?? 'Schedule Call'}
                    <ArrowRight
                      aria-hidden='true'
                      className='h-3 w-3 md:h-4 md:w-4'
                    />
                  </span>
                </Link>
              </Button>
              {sticky?.dismissible === false ? null : (
                <Button
                  aria-label='Dismiss this message'
                  className='h-9 min-h-[36px] w-9 min-w-[36px] p-0 text-white hover:bg-white/20 hover:text-white md:h-10 md:w-10'
                  size='sm'
                  variant='ghost'
                  onClick={handleDismiss}
                >
                  <X aria-hidden='true' className='h-4 w-4 md:h-5 md:w-5' />
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

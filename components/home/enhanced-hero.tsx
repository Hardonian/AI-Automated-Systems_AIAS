'use client';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ParallaxBackground } from '@/components/ui/ParallaxBackground';
import { TextReveal } from '@/components/ui/TextReveal';
import {
  getContainerClasses,
  TYPOGRAPHY,
  ANIMATION,
} from '@/lib/design-tokens';

const socialProof = [
  { icon: '👥', text: '2,000+ Active Users' },
  { icon: '⭐', text: '4.9/5 Rating' },
  { icon: '🚀', text: '10+ Hours Saved/Week' },
  { icon: '💰', text: '40% ROI Increase' },
];

const trustBadges = [
  { icon: Shield, text: 'PIPEDA Compliant', color: 'text-blue-500' },
  { icon: Globe, text: '🇨🇦 Canadian Built', color: 'text-red-500' },
  { icon: CheckCircle2, text: '99.9% Uptime', color: 'text-green-500' },
  { icon: Zap, text: 'Enterprise Security', color: 'text-purple-500' },
];

export function EnhancedHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <ParallaxBackground className='relative flex min-h-[90vh] items-center overflow-hidden py-16 md:py-24 lg:py-32 xl:py-40'>
      <section aria-label='Hero section' className='relative w-full'>
        {/* Enhanced animated background */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-background via-50% to-accent/10' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.2),transparent_50%)]' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.15),transparent_50%)]' />
        <div className='grid-bg absolute inset-0' />

        <div
          className={getContainerClasses(
            'default',
            'relative z-10 space-y-6 text-center md:space-y-8'
          )}
        >
          {/* Social proof bar - mobile optimized */}
          <motion.div
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
            initial={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className='mb-4 flex flex-wrap items-center justify-center gap-3 text-xs font-medium md:gap-6 md:text-sm'
            {...({} as any)}
          >
            {socialProof.map((item, i) => (
              <motion.div
                key={i}
                animate={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                className='flex items-center gap-2 rounded-full border border-border/50 bg-card/80 px-3 py-2 shadow-sm backdrop-blur-sm transition-all hover:shadow-md md:px-4'
                {...({} as any)}
              >
                <span className='text-base md:text-lg'>{item.icon}</span>
                <span className='font-semibold text-foreground'>
                  {item.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust badge */}
          <motion.div
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='mb-6 inline-flex items-center gap-2 rounded-full border-2 border-primary/30 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 px-4 py-2.5 text-sm font-bold text-primary shadow-xl backdrop-blur-md md:px-6 md:py-3 md:text-base'
            {...({} as any)}
          >
            <Sparkles
              aria-hidden='true'
              className='h-4 w-4 animate-pulse md:h-5 md:w-5'
            />
            <span>Custom AI Platforms by AI Automated Systems</span>
          </motion.div>

          {/* Main headline - mobile responsive with TextReveal */}
          <div className={`${TYPOGRAPHY.h1} px-2`}>
            <TextReveal
              as='h1'
              className='block'
              delay={0.3}
              staggerDelay={0.05}
            >
              Custom AI Platforms
            </TextReveal>
            <TextReveal
              as='h1'
              className='animate-gradient mt-2 block bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent md:mt-4'
              delay={0.5}
              staggerDelay={0.05}
            >
              That Transform Your Business
            </TextReveal>
          </div>

          {/* Subheadline */}
          <motion.p
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`${TYPOGRAPHY.bodyLarge} mx-auto mb-8 max-w-4xl px-4 text-muted-foreground`}
            {...({} as any)}
          >
            Save 10+ hours per week with AI automation. Connect your tools,
            automate workflows, and focus on what matters.
          </motion.p>

          {/* Value propositions */}
          <motion.div
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className='flex flex-wrap items-center justify-center gap-3 px-4 pt-2 text-xs md:gap-6 md:text-sm'
            {...({} as any)}
          >
            {[
              {
                icon: Zap,
                text: 'Built TokPulse & Hardonia Suite',
                color: 'text-yellow-500',
              },
              {
                icon: Sparkles,
                text: 'Custom AI Agents & Workflows',
                color: 'text-purple-500',
              },
              {
                icon: TrendingUp,
                text: '40% Average ROI Increase',
                color: 'text-green-500',
              },
              {
                icon: Clock,
                text: '8-16 Week Delivery',
                color: 'text-blue-500',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  animate={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                  className='flex items-center gap-2 rounded-full border border-border/50 bg-card/80 px-3 py-2 shadow-sm backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-md md:px-4'
                  {...({} as any)}
                >
                  <Icon
                    aria-hidden='true'
                    className={`h-4 w-4 md:h-5 md:w-5 ${item.color}`}
                  />
                  <span className='whitespace-nowrap font-semibold text-foreground'>
                    {item.text}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Primary CTAs - mobile optimized */}
          <motion.div
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className='flex flex-col justify-center gap-3 px-4 pt-6 sm:flex-row md:gap-4 md:pt-8'
            {...({} as any)}
          >
            <Button
              asChild
              className='group h-12 min-h-[48px] w-full px-6 text-base font-bold shadow-xl transition-all hover:scale-105 hover:shadow-2xl sm:w-auto md:h-14 md:px-10 md:text-lg'
              size='lg'
            >
              <Link
                aria-label='Start your 30-day free trial - no credit card required'
                href='/signup'
              >
                <span className='flex items-center justify-center gap-2'>
                  Start 30-Day Free Trial
                  <ArrowRight
                    aria-hidden='true'
                    className='h-5 w-5 transition-transform group-hover:translate-x-1'
                  />
                </span>
              </Link>
            </Button>
            <Button
              asChild
              className='h-12 min-h-[48px] w-full border-2 px-6 text-base font-bold transition-all hover:scale-105 hover:border-primary/50 hover:bg-primary/5 sm:w-auto md:h-14 md:px-10 md:text-lg'
              size='lg'
              variant='outline'
            >
              <Link aria-label='Book a free demo call' href='/demo'>
                Book Free Demo
              </Link>
            </Button>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            animate={{ opacity: isVisible ? 1 : 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className='space-y-4 px-4 pt-8 md:pt-12'
            {...({} as any)}
          >
            <p
              className={`${TYPOGRAPHY.bodySmall} font-semibold text-muted-foreground`}
            >
              Trusted by e-commerce brands, agencies, and enterprises worldwide
            </p>
            <div className='flex flex-wrap items-center justify-center gap-3 md:gap-6'>
              {trustBadges.map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <motion.div
                    key={i}
                    animate={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                    className='flex items-center gap-2 rounded-full border border-border/50 bg-card/80 px-3 py-2 shadow-sm backdrop-blur-sm transition-all hover:shadow-md md:px-4'
                    {...({} as any)}
                  >
                    <Icon
                      aria-hidden='true'
                      className={`h-4 w-4 md:h-5 md:w-5 ${badge.color}`}
                    />
                    <span className='text-xs font-semibold text-foreground md:text-sm'>
                      {badge.text}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Urgency CTA - mobile friendly */}
          <motion.div
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className='px-4 pt-6 md:pt-8'
            {...({} as any)}
          >
            <div className='inline-flex flex-col items-center gap-2 rounded-xl border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 px-4 py-3 shadow-lg backdrop-blur-sm sm:flex-row md:gap-4 md:px-6 md:py-4'>
              <span className='text-xs font-semibold text-foreground md:text-sm'>
                🎁 Free Strategy Call + 30-Day Trial
              </span>
              <Button
                asChild
                className='h-8 text-xs font-bold md:h-9 md:text-sm'
                size='sm'
                variant='default'
              >
                <Link href='/signup'>Claim Offer</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </ParallaxBackground>
  );
}

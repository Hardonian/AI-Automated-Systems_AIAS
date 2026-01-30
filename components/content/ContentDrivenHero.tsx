'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ParallaxBackground } from '@/components/ui/ParallaxBackground';
import { TextReveal } from '@/components/ui/TextReveal';
import { getContainerClasses, TYPOGRAPHY } from '@/lib/design-tokens';
import type { Hero } from '@/lib/content/schemas';

// Icon mapping for trust badges
const iconMap: Record<string, any> = {
  shield: Shield,
  globe: Globe,
  check: CheckCircle2,
  zap: Zap,
};

interface ContentDrivenHeroProps {
  content: Hero;
}

export function ContentDrivenHero({ content }: ContentDrivenHeroProps) {
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
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]' />

        <div
          className={getContainerClasses(
            'default',
            'relative z-10 space-y-8 text-center'
          )}
        >
          {/* Social proof bar */}
          {content.socialProof && content.socialProof.length > 0 && (
            <motion.div
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              {...({
                className:
                  'flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs md:text-sm font-medium mb-4',
              } as any)}
            >
              {content.socialProof.map((item, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                  {...({
                    className:
                      'flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all',
                  } as any)}
                >
                  {item.icon && (
                    <span className='text-base md:text-lg'>{item.icon}</span>
                  )}
                  <span className='font-semibold text-foreground'>
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Trust badge */}
          {content.badgeText && (
            <motion.div
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              {...({
                className:
                  'inline-flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 text-primary text-sm md:text-base font-bold border-2 border-primary/30 shadow-xl backdrop-blur-md',
              } as any)}
            >
              <Sparkles
                aria-hidden='true'
                className='h-4 w-4 animate-pulse md:h-5 md:w-5'
              />
              <span>{content.badgeText}</span>
            </motion.div>
          )}

          {/* Main headline */}
          <div className={TYPOGRAPHY.h1}>
            <TextReveal
              as='h1'
              className='block'
              delay={0.3}
              staggerDelay={0.05}
            >
              {content.title}
            </TextReveal>
            {content.subtitle && (
              <TextReveal
                as='h1'
                className='mt-2 block animate-gradient bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent md:mt-4'
                delay={0.5}
                staggerDelay={0.05}
              >
                {content.subtitle}
              </TextReveal>
            )}
          </div>

          {/* Subheadline */}
          {content.description && (
            <motion.p
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              {...({
                className: `${TYPOGRAPHY.bodyLarge} text-muted-foreground max-w-4xl mx-auto px-4`,
              } as any)}
            >
              {content.description}
            </motion.p>
          )}

          {/* Primary CTAs */}
          {(content.primaryCta || content.secondaryCta) && (
            <motion.div
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              {...({
                className:
                  'flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-6 md:pt-8 px-4',
              } as any)}
            >
              {content.primaryCta?.visible && content.primaryCta && (
                <Button
                  asChild
                  className='group h-12 min-h-[48px] w-full px-6 text-base font-bold shadow-xl transition-all hover:scale-105 hover:shadow-2xl sm:w-auto md:h-14 md:px-10 md:text-lg'
                  size='lg'
                >
                  <Link href={content.primaryCta.href}>
                    <span className='flex items-center justify-center gap-2'>
                      {content.primaryCta.label}
                      <ArrowRight
                        aria-hidden='true'
                        className='h-5 w-5 transition-transform group-hover:translate-x-1'
                      />
                    </span>
                  </Link>
                </Button>
              )}
              {content.secondaryCta?.visible && content.secondaryCta && (
                <Button
                  asChild
                  className='h-12 min-h-[48px] w-full border-2 px-6 text-base font-bold transition-all hover:scale-105 hover:border-primary/50 hover:bg-primary/5 sm:w-auto md:h-14 md:px-10 md:text-lg'
                  size='lg'
                  variant='outline'
                >
                  <Link href={content.secondaryCta.href}>
                    {content.secondaryCta.label}
                  </Link>
                </Button>
              )}
            </motion.div>
          )}

          {/* Trust signals */}
          {content.trustBadges && content.trustBadges.length > 0 && (
            <motion.div
              animate={{ opacity: isVisible ? 1 : 0 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              {...({ className: 'pt-8 md:pt-12 space-y-4 px-4' } as any)}
            >
              <p
                className={`${TYPOGRAPHY.bodySmall} font-semibold text-muted-foreground`}
              >
                Trusted by e-commerce brands, agencies, and enterprises
                worldwide
              </p>
              <div className='flex flex-wrap items-center justify-center gap-3 md:gap-6'>
                {content.trustBadges.map((badge, i) => {
                  const Icon = badge.icon
                    ? iconMap[badge.icon.toLowerCase()]
                    : null;
                  return (
                    <motion.div
                      key={i}
                      animate={{ opacity: 1, scale: 1 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                      {...({
                        className:
                          'flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all',
                      } as any)}
                    >
                      {Icon && (
                        <Icon
                          aria-hidden='true'
                          className={`h-4 w-4 md:h-5 md:w-5 ${badge.color || ''}`}
                        />
                      )}
                      <span className='text-xs font-semibold text-foreground md:text-sm'>
                        {badge.text}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </ParallaxBackground>
  );
}

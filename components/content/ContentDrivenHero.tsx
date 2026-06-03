'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Clock, Shield, Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import type { HeroContent } from '@/components/content/types';
import { useSafeReducedMotion } from '@/lib/style/motion';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  clock: Clock,
  shield: Shield,
  zap: Zap,
  check: CheckCircle2,
  globe: Shield,
};

function MetricCard({ icon, text, index }: { icon: string; text: string; index: number }) {
  const Icon = iconMap[icon] || CheckCircle2;
  return (
    <motion.div
      className="group relative rounded-xl border border-border/60 bg-white/70 p-4 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-md dark:bg-slate-900/70"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 + index * 0.08, ease: 'easeOut' }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <p className="text-sm font-medium leading-snug text-foreground">{text}</p>
      </div>
    </motion.div>
  );
}

export function ContentDrivenHero({ content }: { content: HeroContent }) {
  const prefersReduced = useSafeReducedMotion();

  return (
    <section
      className="relative flex min-h-[75vh] items-center overflow-hidden py-16 md:min-h-[82vh] md:py-24"
      id="top"
    >
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-hero-glow absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="animate-hero-glow-delayed absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-blue-400/[0.05] blur-3xl" />
      </div>
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          {/* Main content — centered, strong hierarchy */}
          <div className="text-center">
            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={prefersReduced ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
            >
              <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block">{content.title}</span>
              </h1>
            </motion.div>

            <motion.p
              className="mx-auto mt-6 max-w-2xl text-lg font-medium text-primary sm:text-xl md:text-2xl"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={prefersReduced ? { duration: 0 } : { duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            >
              {content.subtitle}
            </motion.p>

            <motion.p
              className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={prefersReduced ? { duration: 0 } : { duration: 0.5, delay: 0.25, ease: 'easeOut' }}
            >
              {content.description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
              data-testid="hero-cta-group"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={prefersReduced ? { duration: 0 } : { duration: 0.5, delay: 0.35, ease: 'easeOut' }}
            >
              {content.primaryCta?.visible && (
                <Button
                  asChild
                  size="lg"
                  className="hero-cta-glow min-h-[52px] px-8 text-base font-bold shadow-lg transition-all hover:shadow-xl"
                >
                  <Link href={content.primaryCta.href}>
                    {content.primaryCta.label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              {content.secondaryCta?.visible && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="min-h-[52px] px-8 text-base font-semibold transition-all hover:bg-primary/5"
                >
                  <Link href={content.secondaryCta.href}>
                    {content.secondaryCta.label}
                  </Link>
                </Button>
              )}
            </motion.div>
          </div>

          {/* Metrics grid — below the fold, real numbers */}
          {content.socialProof && content.socialProof.length > 0 && (
            <div
              className="mx-auto mt-16 grid max-w-3xl gap-3 sm:grid-cols-2"
              data-testid="hero-social-proof-grid"
            >
              {content.socialProof.map((item, index) => (
                <MetricCard key={item.text} icon={item.icon} text={item.text} index={index} />
              ))}
            </div>
          )}

          {/* Trust badges — subtle, below metrics */}
          {content.trustBadges && content.trustBadges.length > 0 && (
            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground"
              data-testid="hero-trust-badge-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              {content.trustBadges.map((item) => {
                const Icon = iconMap[item.icon] || CheckCircle2;
                return (
                  <span key={item.text} className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground/70" />
                    {item.text}
                  </span>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

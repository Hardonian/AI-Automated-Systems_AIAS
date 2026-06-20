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
      className="group relative border-2 border-border bg-card p-5 transition-all hover:border-primary hover:shadow-card"
      initial={{ opacity: 0, y: 0, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, delay: 0.3 + index * 0.05, ease: 'easeOut' }}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-border bg-black">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <p className="font-mono text-sm leading-snug text-foreground uppercase tracking-tight">{text}</p>
      </div>
    </motion.div>
  );
}

export function ContentDrivenHero({ content }: { content: HeroContent }) {
  const prefersReduced = useSafeReducedMotion();

  return (
    <section
      className="relative flex min-h-[75vh] items-center overflow-hidden py-16 md:min-h-[82vh] md:py-24 bg-background"
      id="top"
    >
      {/* Brutalist Grid Background */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-10"
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} 
      />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="border-l-4 border-primary pl-6 md:pl-10">
            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={prefersReduced ? { duration: 0 } : { duration: 0.3, ease: 'linear' }}
            >
              <div className="mb-4 inline-flex items-center bg-primary px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground">
                [ {content.badgeText || 'SYS_INIT'} ]
              </div>
              <h1 className="max-w-4xl text-5xl font-black uppercase tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
                <span className="block text-foreground">{content.title}</span>
              </h1>
            </motion.div>

            <motion.p
              className="mt-8 max-w-2xl font-mono text-lg font-medium text-primary sm:text-xl md:text-2xl"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={prefersReduced ? { duration: 0 } : { duration: 0.3, delay: 0.1, ease: 'linear' }}
            >
              &gt; {content.subtitle}
            </motion.p>

            <motion.p
              className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={prefersReduced ? { duration: 0 } : { duration: 0.3, delay: 0.2, ease: 'linear' }}
            >
              {content.description}
            </motion.p>

            <motion.div
              className="mt-12 flex flex-wrap items-center gap-6"
              data-testid="hero-cta-group"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={prefersReduced ? { duration: 0 } : { duration: 0.3, delay: 0.3, ease: 'linear' }}
            >
              {content.primaryCta?.visible && (
                <Button
                  asChild
                  size="lg"
                  className="rounded-none border-2 border-primary bg-primary px-8 font-mono text-base font-bold uppercase tracking-wider text-primary-foreground shadow-card transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link href={content.primaryCta.href}>
                    {content.primaryCta.label}
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
              )}
              {content.secondaryCta?.visible && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-none border-2 border-border bg-transparent px-8 font-mono text-base font-bold uppercase tracking-wider text-foreground shadow-card transition-all hover:-translate-y-1 hover:border-foreground"
                >
                  <Link href={content.secondaryCta.href}>
                    {content.secondaryCta.label}
                  </Link>
                </Button>
              )}
            </motion.div>
          </div>

          {content.socialProof && content.socialProof.length > 0 && (
            <div
              className="mx-auto mt-20 grid max-w-4xl gap-4 sm:grid-cols-2 md:grid-cols-4"
              data-testid="hero-social-proof-grid"
            >
              {content.socialProof.map((item, index) => (
                <MetricCard key={item.text} icon={item.icon} text={item.text} index={index} />
              ))}
            </div>
          )}

          {content.trustBadges && content.trustBadges.length > 0 && (
            <motion.div
              className="mt-12 flex flex-wrap items-center gap-8 font-mono text-xs uppercase tracking-widest text-muted-foreground"
              data-testid="hero-trust-badge-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <span className="font-bold text-foreground">TRUSTED_BY //</span>
              {content.trustBadges.map((item) => {
                return (
                  <span key={item.text} className="flex items-center gap-2">
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

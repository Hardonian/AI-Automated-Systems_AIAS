"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Shield, Zap, CheckCircle2, Terminal, Activity } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { HeroContent } from "@/components/content/types";
import { useSafeReducedMotion } from "@/lib/style/motion";
import { InteractiveTerminal } from "@/components/ui/interactive-terminal";
import { MagneticButton } from "@/components/ui/magnetic-button";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  clock: Clock,
  shield: Shield,
  zap: Zap,
  check: CheckCircle2,
  globe: Shield,
};

function MetricCard({
  icon,
  text,
  index,
}: {
  icon: string;
  text: string;
  index: number;
}) {
  const Icon = iconMap[icon] || CheckCircle2;
  return (
    <motion.div
      className="group relative border-2 border-border bg-card p-4 transition-all hover:border-primary hover:shadow-[4px_4px_0px_0px_hsl(var(--primary))]"
      initial={{ opacity: 0, y: 0, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, delay: 0.2 + index * 0.05, ease: "easeOut" }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-border bg-black text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <p className="font-mono text-xs font-bold leading-snug text-foreground uppercase tracking-tight">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

export function ContentDrivenHero({ content }: { content: HeroContent }) {
  const prefersReduced = useSafeReducedMotion();

  return (
    <section
      className="relative overflow-hidden border-b-2 border-border bg-background py-12 md:py-20"
      id="top"
    >
      {/* Background Matrix Grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container relative z-10 mx-auto px-4">
        {/* Telemetry Ticker Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-3 border-2 border-border bg-card p-2 px-3 sm:px-4 text-xs font-mono"
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="font-black uppercase tracking-wider text-foreground">
              [ {content.badgeText || "SYS_INIT"} {"//"} CONTROL PLANE ONLINE ]
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-muted-foreground text-[11px]">
            <span>STATIC-FIRST: 100% PASS</span>
            <span>DATA RESIDENCY: CANADIAN PIPEDA</span>
            <span>RUNTIME: ZERO HARD-500s</span>
          </div>
        </motion.div>

        {/* Hero Two-Column Command Layout */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Mission Statement & Direct CTAs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.h1
              className="text-4xl font-black uppercase tracking-tighter sm:text-6xl md:text-7xl lg:text-7xl leading-[1.05]"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <span className="block text-foreground">{content.title}</span>
            </motion.h1>

            <motion.p
              className="mt-6 font-mono text-base font-bold text-primary sm:text-lg md:text-xl uppercase tracking-tight"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
            >
              {content.subtitle}
            </motion.p>

            <motion.p
              className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base font-sans"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
            >
              {content.description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="mt-8 flex flex-wrap items-center gap-4"
              data-testid="hero-cta-group"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
            >
              {content.primaryCta?.visible && (
                <MagneticButton strength={20}>
                  <Button
                    asChild
                    size="lg"
                    className="rounded-none border-2 border-primary bg-primary px-8 py-6 font-mono text-sm sm:text-base font-black uppercase tracking-wider text-primary-foreground shadow-[4px_4px_0px_0px_hsl(var(--text))] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_hsl(var(--text))]"
                  >
                    <Link href={content.primaryCta.href}>
                      {content.primaryCta.label}
                      <ArrowRight className="ml-2.5 h-4 w-4" />
                    </Link>
                  </Button>
                </MagneticButton>
              )}
              {content.secondaryCta?.visible && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-none border-2 border-border bg-card px-8 py-6 font-mono text-sm sm:text-base font-bold uppercase tracking-wider text-foreground shadow-[4px_4px_0px_0px_hsl(var(--text))] transition-all hover:-translate-y-0.5 hover:border-foreground"
                >
                  <Link href={content.secondaryCta.href}>
                    {content.secondaryCta.label}
                  </Link>
                </Button>
              )}
            </motion.div>
          </div>

          {/* Right Column: Interactive Developer Command Console (5 cols) */}
          <motion.div
            className="lg:col-span-5 w-full"
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
          >
            <InteractiveTerminal />
          </motion.div>
        </div>

        {/* Impact Metrics Strip */}
        {content.socialProof && content.socialProof.length > 0 && (
          <div
            className="mt-16 grid gap-4 grid-cols-2 md:grid-cols-4"
            data-testid="hero-social-proof-grid"
          >
            {content.socialProof.map((item, index) => (
              <MetricCard
                key={item.text}
                icon={item.icon}
                text={item.text}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Trust Badges */}
        {content.trustBadges && content.trustBadges.length > 0 && (
          <motion.div
            className="mt-12 flex flex-wrap items-center justify-center gap-6 font-mono text-xs uppercase tracking-widest text-muted-foreground border-t border-border/60 pt-6"
            data-testid="hero-trust-badge-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <span className="font-bold text-foreground">SYSTEM_TRUST //</span>
            {content.trustBadges.map((item) => (
              <span
                key={item.text}
                className="flex items-center gap-1.5 font-bold text-foreground"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                {item.text}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

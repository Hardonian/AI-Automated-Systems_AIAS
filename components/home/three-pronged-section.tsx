'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Wrench,
  Cpu,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

import { siteContent } from '@/src/content/site';
import { Button } from '@/components/ui/button';

const ICON_MAP = {
  Wrench,
  Cpu,
  ShoppingBag,
};

export function ThreeProngedSection() {
  const [activeTab, setActiveTab] = useState<'tools' | 'consultancy' | 'catalog'>('tools');

  const pillars = siteContent.triadPillars || [];
  const activePillar = pillars.find((p) => p.id === activeTab) || pillars[0];

  return (
    <section
      className="relative border-b-2 border-border bg-background py-24 overflow-hidden"
      id="ecosystem-tracks"
    >
      {/* Decorative background grid */}
      <div className="absolute inset-0 z-0 grid-bg opacity-40 pointer-events-none" />

      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 border-2 border-primary/40 bg-primary/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-primary mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Three-Pronged Architecture // Choose Your Track</span>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter sm:text-5xl">
            HOW YOU ENGAGE WITH AIAS
          </h2>
          <p className="mx-auto mt-4 max-w-3xl font-mono text-base text-muted-foreground">
            From instant browser-based simulation tools to bespoke enterprise systems engineering
            and ready-to-deploy software packages.
          </p>
        </div>

        {/* 3-Pillar Tab Switcher */}
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {pillars.map((pillar, idx) => {
            const Icon = ICON_MAP[pillar.iconName as keyof typeof ICON_MAP] || Wrench;
            const isSelected = activeTab === pillar.id;

            return (
              <button
                key={pillar.id}
                onClick={() => setActiveTab(pillar.id)}
                className={`group relative flex flex-col items-start border-2 p-5 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-card shadow-[4px_4px_0px_0px_hsl(var(--primary))] -translate-y-1'
                    : 'border-border bg-surface-muted/60 hover:border-foreground/60 hover:bg-card'
                }`}
                type="button"
              >
                <div className="flex w-full items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center border-2 ${
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-muted-foreground group-hover:border-foreground group-hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs font-black tracking-widest text-muted-foreground">
                    0{idx + 1}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                    {pillar.badge}
                  </p>
                  <h3 className="mt-1 font-mono text-base font-black uppercase text-foreground">
                    {pillar.title}
                  </h3>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {pillar.tagline}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Deep-Dive Display */}
        <AnimatePresence mode="wait">
          {activePillar && (
            <motion.div
              key={activePillar.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="mt-8 border-2 border-border bg-card p-6 md:p-10 shadow-card"
            >
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                {/* Left Column: Description & Highlights */}
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 border border-border bg-surface-muted px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span>{activePillar.badge}</span>
                  </div>

                  <h3 className="mt-4 text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
                    {activePillar.tagline}
                  </h3>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {activePillar.description}
                  </p>

                  <div className="mt-6 border-t-2 border-border/60 pt-6">
                    <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                      Included Capabilities & Artifacts:
                    </h4>
                    <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {activePillar.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2 text-xs font-medium text-muted-foreground"
                        >
                          <CheckCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTAs */}
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Button
                      asChild
                      className="rounded-none border-2 border-primary bg-primary px-6 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5"
                    >
                      <Link href={activePillar.ctaHref}>
                        {activePillar.ctaLabel}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>

                    {activePillar.secondaryLabel && activePillar.secondaryHref && (
                      <Button
                        asChild
                        variant="outline"
                        className="rounded-none border-2 border-border bg-background px-5 font-mono text-xs font-bold uppercase tracking-widest text-foreground hover:border-foreground"
                      >
                        <Link
                          href={activePillar.secondaryHref}
                          target={
                            activePillar.secondaryHref.startsWith('http') ? '_blank' : undefined
                          }
                          rel={
                            activePillar.secondaryHref.startsWith('http')
                              ? 'noopener noreferrer'
                              : undefined
                          }
                        >
                          {activePillar.secondaryLabel}
                          {activePillar.secondaryHref.startsWith('http') && (
                            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                          )}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Right Column: Live Context & Quick Navigation Box */}
                <div className="lg:col-span-5 border-2 border-border bg-surface-muted p-6">
                  <div className="flex items-center justify-between border-b-2 border-border pb-3">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Track Telemetry
                    </span>
                    <span className="border border-border bg-background px-2 py-0.5 font-mono text-[11px] font-bold text-primary">
                      {activePillar.stats.value}
                    </span>
                  </div>

                  {activePillar.id === 'tools' && (
                    <div className="mt-4 space-y-3">
                      <p className="font-mono text-xs text-muted-foreground">
                        Featured Quick Utilities:
                      </p>
                      <div className="space-y-2">
                        {siteContent.quickTools.slice(0, 3).map((tool) => (
                          <Link
                            key={tool.id}
                            href={tool.href}
                            className="group flex items-center justify-between border border-border bg-background p-2.5 transition-all hover:border-primary hover:bg-card"
                          >
                            <div>
                              <p className="font-mono text-xs font-bold uppercase text-foreground group-hover:text-primary">
                                {tool.title}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {tool.estimatedTime} runtime · {tool.category}
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {activePillar.id === 'consultancy' && (
                    <div className="mt-4 space-y-3">
                      <p className="font-mono text-xs text-muted-foreground">
                        Consultancy Engagement Tracks:
                      </p>
                      <div className="space-y-2">
                        {siteContent.consultancyTracks.slice(0, 3).map((track) => (
                          <Link
                            key={track.id}
                            href="/hire"
                            className="group flex items-center justify-between border border-border bg-background p-2.5 transition-all hover:border-primary hover:bg-card"
                          >
                            <div>
                              <p className="font-mono text-xs font-bold uppercase text-foreground group-hover:text-primary">
                                {track.title}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {track.timeline} · {track.eyebrow}
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {activePillar.id === 'catalog' && (
                    <div className="mt-4 space-y-3">
                      <p className="font-mono text-xs text-muted-foreground">
                        Featured Hardonia Store Products:
                      </p>
                      <div className="space-y-2">
                        {siteContent.catalogProducts.slice(0, 3).map((product) => (
                          <Link
                            key={product.id}
                            href="/catalog"
                            className="group flex items-center justify-between border border-border bg-background p-2.5 transition-all hover:border-primary hover:bg-card"
                          >
                            <div>
                              <p className="font-mono text-xs font-bold uppercase text-foreground group-hover:text-primary">
                                {product.title}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {product.category} · {product.license}
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-5 border-t border-border pt-4">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      <span>100% Policy-Gated · Zero Vendor Lock-in</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

import {
  ArrowRight,
  Clock,
  Shield,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { HeroContent } from "@/components/content/types";
import { InteractiveTerminal } from "@/components/ui/interactive-terminal";
import { MagneticButton } from "@/components/ui/magnetic-button";

const iconMap: Record<
  string,
  React.ComponentType<{
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
  }>
> = {
  clock: Clock,
  shield: Shield,
  zap: Zap,
  check: CheckCircle2,
  globe: ShieldCheck,
  cpu: Cpu,
};

function MetricCard({ icon, text }: { icon: string; text: string }) {
  const Icon = iconMap[icon] || CheckCircle2;
  return (
    <div className="research-panel group relative flex h-full flex-col justify-between p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/80 hover:shadow-lg bg-card/90">
      <div className="flex items-start gap-3.5">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center border border-primary/40 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <p className="font-mono text-xs font-bold leading-snug text-foreground uppercase tracking-tight">
            {text}
          </p>
          <span className="mt-1.5 inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            <span aria-hidden="true">✓</span> Verified Invariant
          </span>
        </div>
      </div>
    </div>
  );
}

export function ContentDrivenHero({ content }: { content: HeroContent }) {
  return (
    <section
      className="research-field relative overflow-hidden border-b border-border bg-background py-10 md:py-16"
      id="top"
      aria-labelledby="hero-title"
    >
      <div className="container relative z-10 mx-auto px-4">
        {/* Telemetry and System Readout Top Bar */}
        <div
          role="status"
          aria-label="System operational status and telemetry"
          className="research-readout mb-8 flex flex-wrap items-center justify-between gap-3 border border-border/70 bg-card/70 px-3.5 py-2.5 font-mono text-xs backdrop-blur-sm sm:px-4"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="sr-only">Operational status:</span>
            <span className="font-mono font-black uppercase tracking-[0.14em] text-foreground text-xs">
              INDEX_01 / {content.badgeText || "SYSTEMS RESEARCH"}
            </span>
            <span className="hidden sm:inline text-border" aria-hidden="true">
              |
            </span>
            <span className="hidden sm:inline font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
              Lab Status: Active Deployment
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] uppercase tracking-[0.13em] text-muted-foreground">
            <span className="hidden md:inline">Method: static systems</span>
            <span className="text-primary font-bold inline-flex items-center gap-1">
              <span className="text-[10px]" aria-hidden="true">
                ●
              </span>{" "}
              99.4% RELIABILITY
            </span>
            <span className="text-cyan-400 font-bold hidden sm:inline-flex items-center gap-1">
              <span className="text-[10px]" aria-hidden="true">
                ●
              </span>{" "}
              $1.4M+ ARR AUTOMATED
            </span>
          </div>
        </div>

        {/* Hero Main Content & Live Interactive Console */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Heading, Value Prop, High-Converting CTAs */}
          <div className="flex flex-col items-start text-left lg:col-span-7">
            <p className="research-kicker mb-4 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-primary">
              <span aria-hidden="true">{"//"}</span> Applied AI systems lab /
              field note 001
            </p>

            <h1
              id="hero-title"
              className="max-w-4xl font-heading text-4xl font-black uppercase tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-7xl leading-[0.98] text-foreground"
            >
              <span className="block">{content.title}</span>
            </h1>

            <p className="mt-6 max-w-3xl font-mono text-sm font-bold uppercase tracking-[0.04em] text-primary sm:text-base md:text-lg">
              {content.subtitle}
            </p>

            <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground sm:text-base">
              {content.description}
            </p>

            {/* Primary & Secondary Dual-Track CTAs */}
            <div
              className="mt-8 flex flex-wrap items-center gap-4"
              data-testid="hero-cta-group"
            >
              {content.primaryCta?.visible && (
                <MagneticButton strength={20}>
                  <Button
                    asChild
                    size="lg"
                    className="group rounded-none border-2 border-primary bg-primary px-8 py-6 font-mono text-sm font-black uppercase tracking-wider text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:text-base cursor-pointer"
                  >
                    <Link href={content.primaryCta.href}>
                      <span>{content.primaryCta.label}</span>
                      <ArrowRight
                        className="ml-2.5 h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </Button>
                </MagneticButton>
              )}

              {content.secondaryCta?.visible && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-none border-2 border-border bg-card/90 px-8 py-6 font-mono text-sm font-bold uppercase tracking-wider text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/80 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:text-base cursor-pointer"
                >
                  <Link href={content.secondaryCta.href}>
                    {content.secondaryCta.label}
                  </Link>
                </Button>
              )}
            </div>

            {/* Zero-Risk Reversal Micro-Proof */}
            <div
              className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-mono text-muted-foreground"
              aria-label="Diagnostic consultation commitments"
            >
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground/90">
                <CheckCircle2
                  className="h-3.5 w-3.5 text-emerald-400 shrink-0"
                  aria-hidden="true"
                />
                15-min direct engineer review
              </span>
              <span className="hidden sm:inline text-border" aria-hidden="true">
                •
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground/90">
                <CheckCircle2
                  className="h-3.5 w-3.5 text-emerald-400 shrink-0"
                  aria-hidden="true"
                />
                Zero pitch decks or sales reps
              </span>
              <span className="hidden sm:inline text-border" aria-hidden="true">
                •
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground/90">
                <CheckCircle2
                  className="h-3.5 w-3.5 text-emerald-400 shrink-0"
                  aria-hidden="true"
                />
                Actionable architecture blueprint
              </span>
            </div>

            {/* Interactive Self-Service Triad Fast-Tracks */}
            <div
              className="mt-7 w-full max-w-2xl border border-border/80 bg-card/50 p-3 sm:p-4 backdrop-blur-sm"
              role="region"
              aria-label="Self-service evaluation options"
            >
              <div className="mb-2.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span className="font-bold text-foreground">
                  Self-serve engineering paths {"//"} choose an objective:
                </span>
                <span className="hidden sm:inline text-primary font-bold">
                  zero-friction
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <Link
                  href="/#instant-roi"
                  className="group flex flex-col justify-between border border-border/70 bg-background/80 p-3 transition-all hover:-translate-y-0.5 hover:border-cyan-400/80 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  aria-label="Jump to capacity and ROI estimation calculator"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      01 {"//"} ROI
                    </span>
                    <span
                      className="text-xs text-muted-foreground transition-colors group-hover:text-cyan-400"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="font-mono text-xs font-bold uppercase tracking-tight text-foreground">
                      Capacity Sizer
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                      Simulate hour &amp; cost savings
                    </p>
                  </div>
                </Link>

                <Link
                  href="/diagnostic"
                  className="group flex flex-col justify-between border border-border/70 bg-background/80 p-3 transition-all hover:-translate-y-0.5 hover:border-primary/80 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Run two-minute system and risk diagnostic"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary">
                      02 {"//"} Diligence
                    </span>
                    <span
                      className="text-xs text-muted-foreground transition-colors group-hover:text-primary"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="font-mono text-xs font-bold uppercase tracking-tight text-foreground">
                      2-Min Diagnostic
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                      Score failure &amp; PII risks
                    </p>
                  </div>
                </Link>

                <Link
                  href="/catalog"
                  className="group flex flex-col justify-between border border-border/70 bg-background/80 p-3 transition-all hover:-translate-y-0.5 hover:border-emerald-400/80 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  aria-label="Explore pre-built turnkey modules in our catalog"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      03 {"//"} Turnkey
                    </span>
                    <span
                      className="text-xs text-muted-foreground transition-colors group-hover:text-emerald-400"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="font-mono text-xs font-bold uppercase tracking-tight text-foreground">
                      Module Catalog
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                      Pre-tested production kits
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Architecture Console */}
          <div className="w-full lg:col-span-5 lg:pl-4">
            <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"
                  aria-hidden="true"
                />
                Live research console
              </span>
              <span className="font-bold text-primary">
                signal {"//"} stable
              </span>
            </div>
            <InteractiveTerminal />
          </div>
        </div>

        {/* Social Proof & Operational Invariants Grid */}
        {content.socialProof && content.socialProof.length > 0 && (
          <div className="mt-14">
            <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span className="font-bold text-foreground">
                Guaranteed Operational Invariants {"//"} Field Verified
              </span>
              <span className="text-primary hidden sm:inline">
                100% audit pass rate
              </span>
            </div>
            <ul
              role="list"
              aria-label="Guaranteed operational invariants and benchmarks"
              className="grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-4 p-0 m-0 list-none"
              data-testid="hero-social-proof-grid"
            >
              {content.socialProof.map((item) => (
                <li key={item.text} className="list-none">
                  <MetricCard icon={item.icon} text={item.text} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Trust & Compliance Badges */}
        {content.trustBadges && content.trustBadges.length > 0 && (
          <ul
            role="list"
            aria-label="Compliance, security, and governance standards"
            className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-border/60 pt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground p-0 list-none"
            data-testid="hero-trust-badge-grid"
          >
            <li className="font-bold text-foreground list-none">
              Governance Standards {"//"}
            </li>
            {content.trustBadges.map((item) => (
              <li
                key={item.text}
                className="flex items-center gap-2 font-bold text-foreground list-none"
              >
                <CheckCircle2
                  className="h-4 w-4 text-primary shrink-0"
                  aria-hidden="true"
                />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

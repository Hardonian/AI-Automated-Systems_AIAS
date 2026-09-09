import { ArrowRight, Clock, Shield, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { HeroContent } from "@/components/content/types";
import { InteractiveTerminal } from "@/components/ui/interactive-terminal";
import { MagneticButton } from "@/components/ui/magnetic-button";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  clock: Clock,
  shield: Shield,
  zap: Zap,
  check: CheckCircle2,
  globe: Shield,
};

function MetricCard({ icon, text }: { icon: string; text: string }) {
  const Icon = iconMap[icon] || CheckCircle2;
  return (
    <div className="research-panel group relative p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-lg">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-primary/35 bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <p className="font-mono text-xs font-bold leading-snug text-foreground uppercase tracking-tight">
          {text}
        </p>
      </div>
    </div>
  );
}

export function ContentDrivenHero({ content }: { content: HeroContent }) {
  return (
    <section
      className="research-field relative overflow-hidden border-b border-border bg-background py-10 md:py-16"
      id="top"
    >
      <div className="container relative z-10 mx-auto px-4">
        <div className="research-readout mb-10 flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 text-xs font-mono sm:px-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="font-black uppercase tracking-[0.14em] text-foreground">
              INDEX_01 / {content.badgeText || "SYSTEMS RESEARCH"}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[10px] uppercase tracking-[0.13em] text-muted-foreground">
            <span>Method: static systems</span>
            <span>Region: Canada / remote</span>
            <span>Edition: 2026.09</span>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <p className="research-kicker mb-5">
              Applied AI systems lab / field note 001
            </p>
            <h1 className="max-w-4xl font-heading text-4xl font-black uppercase tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-7xl leading-[0.98]">
              <span className="block text-foreground">{content.title}</span>
            </h1>

            <p className="mt-7 max-w-3xl font-mono text-sm font-bold uppercase tracking-[0.04em] text-primary sm:text-base md:text-lg">
              {content.subtitle}
            </p>

            <p className="mt-5 max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground sm:text-base">
              {content.description}
            </p>

            <div
              className="mt-9 flex flex-wrap items-center gap-4"
              data-testid="hero-cta-group"
            >
              {content.primaryCta?.visible && (
                <MagneticButton strength={20}>
                  <Button
                    asChild
                    size="lg"
                    className="rounded-none border border-primary bg-primary px-8 py-6 font-mono text-sm font-black uppercase tracking-wider text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary-hover sm:text-base"
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
                  className="rounded-none border border-border bg-card/80 px-8 py-6 font-mono text-sm font-bold uppercase tracking-wider text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/70 sm:text-base"
                >
                  <Link href={content.secondaryCta.href}>
                    {content.secondaryCta.label}
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="w-full lg:col-span-5 lg:pl-4">
            <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              <span>Live research console</span>
              <span className="text-primary">signal / stable</span>
            </div>
            <InteractiveTerminal />
          </div>
        </div>

        {content.socialProof && content.socialProof.length > 0 && (
          <div
            className="mt-14 grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-4"
            data-testid="hero-social-proof-grid"
          >
            {content.socialProof.map((item) => (
              <MetricCard key={item.text} icon={item.icon} text={item.text} />
            ))}
          </div>
        )}

        {content.trustBadges && content.trustBadges.length > 0 && (
          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-border/60 pt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground"
            data-testid="hero-trust-badge-grid"
          >
            <span className="font-bold text-foreground">
              Research constraints //
            </span>
            {content.trustBadges.map((item) => (
              <span
                key={item.text}
                className="flex items-center gap-1.5 font-bold text-foreground"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                {item.text}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

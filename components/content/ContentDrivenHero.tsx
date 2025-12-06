"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Shield, Globe, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { TextReveal } from "@/components/ui/TextReveal";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";
import type { Hero } from "@/lib/content/schemas";

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
    <ParallaxBackground className="relative py-16 md:py-24 lg:py-32 xl:py-40 overflow-hidden min-h-[90vh] flex items-center">
      <section className="relative w-full" aria-label="Hero section">
        {/* Enhanced animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background via-50% to-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative container text-center space-y-8 max-w-6xl mx-auto z-10 px-4">
          {/* Social proof bar */}
          {content.socialProof && content.socialProof.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs md:text-sm font-medium mb-4"
            >
              {content.socialProof.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all"
                >
                  {item.icon && <span className="text-base md:text-lg">{item.icon}</span>}
                  <span className="text-foreground font-semibold">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Trust badge */}
          {content.badgeText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 text-primary text-sm md:text-base font-bold border-2 border-primary/30 shadow-xl backdrop-blur-md"
            >
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 animate-pulse" aria-hidden="true" />
              <span>{content.badgeText}</span>
            </motion.div>
          )}

          {/* Main headline */}
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.1] px-2">
            <TextReveal
              as="h1"
              className="block"
              delay={0.3}
              staggerDelay={0.05}
            >
              {content.title}
            </TextReveal>
            {content.subtitle && (
              <TextReveal
                as="h1"
                className="block mt-2 md:mt-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium px-4"
            >
              {content.description}
            </motion.p>
          )}

          {/* Primary CTAs */}
          {(content.primaryCta || content.secondaryCta) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-6 md:pt-8 px-4"
            >
              {content.primaryCta?.visible && content.primaryCta && (
                <Button
                  size="lg"
                  className="text-base md:text-lg px-6 md:px-10 h-12 md:h-14 font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 group min-h-[48px] w-full sm:w-auto"
                  asChild
                >
                  <Link href={content.primaryCta.href}>
                    <span className="flex items-center justify-center gap-2">
                      {content.primaryCta.label}
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </span>
                  </Link>
                </Button>
              )}
              {content.secondaryCta?.visible && content.secondaryCta && (
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base md:text-lg px-6 md:px-10 h-12 md:h-14 font-bold border-2 hover:bg-primary/5 hover:border-primary/50 transition-all hover:scale-105 min-h-[48px] w-full sm:w-auto"
                  asChild
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
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="pt-8 md:pt-12 space-y-4 px-4"
            >
              <p className="text-sm md:text-base text-muted-foreground font-semibold">
                Trusted by e-commerce brands, agencies, and enterprises worldwide
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
                {content.trustBadges.map((badge, i) => {
                  const Icon = badge.icon ? iconMap[badge.icon.toLowerCase()] : null;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                      className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all"
                    >
                      {Icon && <Icon className={`h-4 w-4 md:h-5 md:w-5 ${badge.color || ""}`} aria-hidden="true" />}
                      <span className="text-xs md:text-sm font-semibold text-foreground">{badge.text}</span>
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

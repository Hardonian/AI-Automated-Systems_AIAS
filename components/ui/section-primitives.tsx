import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as motion from "framer-motion/client";

import { Button } from "@/components/ui/button";
import {
  BORDER_RADIUS,
  CARD_SHADOWS,
  GRID_GAPS,
  TYPOGRAPHY,
  getContainerClasses,
  getSectionClasses,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        getSectionClasses("large", "gradient"),
        "border-b relative overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-background to-background pointer-events-none" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(getContainerClasses("default"), "relative z-10")}
      >
        <header className="mx-auto max-w-3xl text-center">
          {eyebrow && (
            <motion.p 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className={cn(TYPOGRAPHY.eyebrow, "text-primary")}
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={cn(TYPOGRAPHY.h2, "mt-3")}
          >
            {title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={cn(TYPOGRAPHY.body, "mt-4 text-muted-foreground")}
          >
            {description}
          </motion.p>
        </header>
      </motion.div>
    </section>
  );
}

export function PageSection({
  children,
  className,
  background = "default",
  width = "default",
}: {
  children: ReactNode;
  className?: string;
  background?: "default" | "gradient" | "gradientReverse" | "muted" | "card";
  width?: "narrow" | "default" | "wide" | "full";
}) {
  return (
    <section
      className={cn(getSectionClasses("default", background), "relative", className)}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={getContainerClasses(width)}
      >
        {children}
      </motion.div>
    </section>
  );
}

export function SurfaceCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        BORDER_RADIUS.card,
        CARD_SHADOWS.card,
        "border bg-card p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_hsl(var(--primary))] hover:border-primary backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </article>
  );
}

export function PageCta({
  title,
  description,
  primary,
  secondary,
}: {
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <PageSection width="narrow">
      <SurfaceCard className="bg-gradient-to-br from-primary/10 to-accent/10 text-center">
        <h2 className={TYPOGRAPHY.h4}>{title}</h2>
        <p className={cn(TYPOGRAPHY.bodySmall, "mt-3 text-muted-foreground")}>
          {description}
        </p>
        <div
          className={cn(
            "mt-6 flex flex-col justify-center sm:flex-row",
            GRID_GAPS.small,
          )}
        >
          <Button asChild size="lg">
            <Link href={primary.href}>
              {primary.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          {secondary && (
            <Button asChild size="lg" variant="outline">
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          )}
        </div>
      </SurfaceCard>
    </PageSection>
  );
}

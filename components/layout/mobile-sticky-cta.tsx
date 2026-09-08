"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Calendar, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getPrimaryCtaHref, siteContent } from "@/src/content/site";

interface MobileStickyCTAProps {
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function MobileStickyCTA({
  primaryLabel = siteContent.positioning.primaryCTA.label,
  primaryHref = getPrimaryCtaHref(),
  secondaryLabel = "Simulator",
  secondaryHref = "/automation-demo",
}: MobileStickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (approx 450px)
      const shouldShow = window.scrollY > 450;
      setIsVisible(shouldShow);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          initial={{ y: 80 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 p-3 bg-background/95 backdrop-blur-md border-t-2 border-border z-50 md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl"
          role="region"
          aria-label="Mobile Quick Navigation"
        >
          <div className="flex gap-2">
            <Button
              asChild
              className="flex-1 rounded-none border-2 border-primary bg-primary font-mono text-xs font-black uppercase tracking-wider text-primary-foreground shadow-[2px_2px_0px_0px_hsl(var(--text))] min-h-[44px]"
            >
              <Link href={primaryHref}>
                <Calendar className="mr-1.5 h-3.5 w-3.5" />
                {primaryLabel}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 rounded-none border-2 border-border bg-card font-mono text-xs font-bold uppercase tracking-wider text-foreground shadow-[2px_2px_0px_0px_hsl(var(--text))] min-h-[44px]"
            >
              <Link href={secondaryHref}>
                <Zap className="mr-1.5 h-3.5 w-3.5 text-primary" />
                {secondaryLabel}
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

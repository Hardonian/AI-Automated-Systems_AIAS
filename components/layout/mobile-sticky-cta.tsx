"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Calendar, Zap } from "lucide-react";

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
  secondaryLabel = "2-Min Audit",
  secondaryHref = "/diagnostic",
}: MobileStickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tickingRef = useRef(false);

  useEffect(() => {
    const updateScrollVisibility = () => {
      const shouldShow = window.scrollY > 450;
      setIsVisible((prev) => (prev !== shouldShow ? shouldShow : prev));
      tickingRef.current = false;
    };

    const handleScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        window.requestAnimationFrame(updateScrollVisibility);
      }
    };

    updateScrollVisibility();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 p-3 bg-background/95 backdrop-blur-md border-t-2 border-border z-50 md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl animate-in slide-in-from-bottom-4 duration-200"
      role="region"
      aria-label="Mobile Quick Navigation"
    >
      <div className="flex gap-2">
        <Button
          asChild
          className="flex-1 rounded-none border-2 border-primary bg-primary font-mono text-xs font-black uppercase tracking-wider text-primary-foreground shadow-[2px_2px_0px_0px_hsl(var(--text))] min-h-[44px]"
        >
          <Link href={primaryHref}>
            <Calendar className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            {primaryLabel}
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="flex-1 rounded-none border-2 border-border bg-card font-mono text-xs font-bold uppercase tracking-wider text-foreground shadow-[2px_2px_0px_0px_hsl(var(--text))] min-h-[44px]"
        >
          <Link href={secondaryHref}>
            <Zap
              className="mr-1.5 h-3.5 w-3.5 text-primary"
              aria-hidden="true"
            />
            {secondaryLabel}
          </Link>
        </Button>
      </div>
    </div>
  );
}

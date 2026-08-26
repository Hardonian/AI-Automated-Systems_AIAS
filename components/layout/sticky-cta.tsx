"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { getPrimaryCtaHref, siteContent } from "@/src/content/site";

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 300px
      if (window.scrollY > 300 && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 duration-300 animate-in slide-in-from-bottom">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 shadow-lg">
          <div className="flex-1">
            <div className="mb-1 text-sm font-semibold">
              Need control-plane clarity for your AI stack?
            </div>
            <div className="text-xs text-muted-foreground">
              Book diagnostic • Request architecture review • Download
              governance checklist
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" asChild>
              <Link href={getPrimaryCtaHref()}>
                {siteContent.positioning.primaryCTA.label}
                <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => setIsDismissed(true)}
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

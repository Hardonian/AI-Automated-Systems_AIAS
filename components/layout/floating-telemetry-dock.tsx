"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, Calendar, Sparkles, X } from "lucide-react";

const DOCK_DISMISSED_KEY = "aias_telemetry_dock_dismissed";

export function FloatingTelemetryDock() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const tickingRef = useRef(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(DOCK_DISMISSED_KEY) === "1") {
        queueMicrotask(() => setIsDismissed(true));
        return;
      }
    } catch {
      // Ignore storage access errors
    }

    const updateVisibility = () => {
      const shouldShow = window.scrollY > 350;
      setIsVisible((prev) => (prev !== shouldShow ? shouldShow : prev));
      tickingRef.current = false;
    };

    const handleScroll = () => {
      if (isDismissed || tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      window.sessionStorage.setItem(DOCK_DISMISSED_KEY, "1");
    } catch {
      // Ignore storage errors
    }
  };

  if (isDismissed || !isVisible) {
    return null;
  }

  return (
    <aside
      aria-label="Real-time Automation Dock"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-3 px-4 py-2 border-2 border-primary/40 bg-background/95 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(0,255,157,0.2)] font-mono text-xs text-foreground transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
    >
      {/* Live System Indicator */}
      <div className="flex items-center gap-2 pr-3 border-r border-border">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
        </span>
        <span className="font-bold tracking-wider text-[11px] uppercase text-primary">
          99.4% Deterministic
        </span>
      </div>

      {/* Instant Action Triggers */}
      <div className="flex items-center gap-2">
        <Link
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors border border-transparent hover:border-cyan-500/30"
          href="/#instant-roi"
        >
          <Calculator className="h-3 w-3 text-cyan-400" />
          <span>Instant ROI</span>
        </Link>

        <Link
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/30"
          href="/diagnostic"
        >
          <Sparkles className="h-3 w-3 text-primary" />
          <span>Diagnostic</span>
        </Link>

        <Link
          className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 shadow-[2px_2px_0px_0px_hsl(var(--text))] transition-transform active:translate-x-[1px] active:translate-y-[1px]"
          href="/book"
        >
          <Calendar className="h-3 w-3" />
          <span>Book Sprint</span>
          <ArrowRight className="h-3 w-3 ml-0.5" />
        </Link>
      </div>

      {/* Dismiss Button */}
      <button
        aria-label="Dismiss quick dock for session"
        className="ml-1 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        onClick={handleDismiss}
        type="button"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </aside>
  );
}

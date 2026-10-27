"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export interface ClientVitalsSnapshot {
  lcpMs: number | null;
  clsScore: number;
  maxEventDurationMs: number;
}

export function PerformanceRuntime() {
  const router = useRouter();

  useEffect(() => {
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (
      connection?.saveData ||
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g"
    ) {
      return;
    }

    const preload = () => {
      router.prefetch("/diagnostic");
      router.prefetch("/catalog");
      router.prefetch("/contact");
      router.prefetch("/tools");
      router.prefetch("/blueprints");
    };
    const windowWithIdle = window as Window & {
      requestIdleCallback?: (
        callback: () => void,
        options?: { timeout: number },
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const idleId = windowWithIdle.requestIdleCallback?.(preload, {
      timeout: 2_000,
    });
    const timeoutId =
      idleId === undefined ? window.setTimeout(preload, 1_500) : undefined;
    return () => {
      if (idleId !== undefined) windowWithIdle.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [router]);

  useEffect(() => {
    if (!("PerformanceObserver" in window)) return;

    const vitals: ClientVitalsSnapshot = {
      lcpMs: null,
      clsScore: 0,
      maxEventDurationMs: 0,
    };

    const emitVitals = () => {
      window.dispatchEvent(
        new CustomEvent<ClientVitalsSnapshot>("aias:vitals-update", {
          detail: { ...vitals },
        }),
      );
    };

    const observers: PerformanceObserver[] = [];

    try {
      const eventObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const duration = Math.round(entry.duration);
          if (duration > vitals.maxEventDurationMs) {
            vitals.maxEventDurationMs = duration;
            emitVitals();
          }
          if (duration > 50) {
            window.dispatchEvent(
              new CustomEvent("aias:slow-interaction", {
                detail: { duration, name: entry.name },
              }),
            );
          }
        }
      });
      eventObserver.observe({ type: "event", buffered: true });
      observers.push(eventObserver);
    } catch {
      // Ignore unsupported observer type
    }

    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) {
          vitals.lcpMs = Math.round(last.startTime);
          emitVitals();
        }
      });
      lcpObserver.observe({
        type: "largest-contentful-paint",
        buffered: true,
      });
      observers.push(lcpObserver);
    } catch {
      // Ignore unsupported observer type
    }

    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as Array<
          PerformanceEntry & { hadRecentInput?: boolean; value?: number }
        >) {
          if (!entry.hadRecentInput && typeof entry.value === "number") {
            vitals.clsScore = Number(
              (vitals.clsScore + entry.value).toFixed(4),
            );
            emitVitals();
          }
        }
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });
      observers.push(clsObserver);
    } catch {
      // Ignore unsupported observer type
    }

    return () => {
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function PerformanceRuntime() {
  const router = useRouter();

  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (connection?.saveData) return;
    const preload = () => {
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
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const duration = Math.round(entry.duration);
        if (duration > 50)
          window.dispatchEvent(
            new CustomEvent("aias:slow-interaction", {
              detail: { duration, name: entry.name },
            }),
          );
      }
    });
    try {
      observer.observe({
        type: "event",
        buffered: true,
      });
    } catch {
      return;
    }
    return () => observer.disconnect();
  }, []);

  return null;
}

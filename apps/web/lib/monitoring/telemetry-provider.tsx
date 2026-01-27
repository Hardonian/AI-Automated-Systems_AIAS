"use client";

import { usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";

import { telemetry } from "./enhanced-telemetry";

export function TelemetryProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Track page views
    telemetry.trackPageView(pathname);
  }, [pathname]);

  return <>{children}</>;
}

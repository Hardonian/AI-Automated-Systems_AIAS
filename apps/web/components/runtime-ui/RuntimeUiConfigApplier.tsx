"use client";

import { useEffect } from "react";

import { useRuntimeUiConfig } from "@/lib/runtime-ui/use-runtime-ui-config";

/**
 * Applies runtime UI config to CSS variables at runtime (no rebuild required).
 * This is intentionally side-effect only and must remain safe if config is missing.
 */
export function RuntimeUiConfigApplier() {
  const { data: config } = useRuntimeUiConfig();

  useEffect(() => {
    if (!config) {
      return;
    }

    const root = document.documentElement;

    // Design tokens (CSS variables)
    const radiusRem = config.tokens?.radiusRem ?? 0.5;
    root.style.setProperty("--radius", `${radiusRem}rem`);

    const shadowCard = config.tokens?.cardShadow ?? "0 6px 24px rgba(0,0,0,0.08)";
    root.style.setProperty("--shadow-card", shadowCard);

    // Density is exposed as a data attribute for optional styling hooks.
    root.dataset.uiDensity = config.tokens?.density ?? "comfortable";
  }, [config]);

  return null;
}


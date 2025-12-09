"use client";

import { useEffect } from "react";

import { getExperimentVariant } from "@/lib/experiments/feature-flags";
import { useExperimentTracking } from "@/lib/experiments/tracking";
import { logger } from "@/lib/logging/structured-logger";

interface PricingAnalyticsProps {
  userId?: string;
  sessionId?: string;
}

export function PricingAnalytics({ userId, sessionId }: PricingAnalyticsProps) {
  const tracking = useExperimentTracking();

  useEffect(() => {
    // Get experiment variant for value metric presentation test
    const variant = getExperimentVariant("exp_value_metric", userId, sessionId) || "control";
    
    // Track pricing page view
    tracking.trackPricingPageView(variant);
  }, [userId, sessionId, tracking]);

  return null; // This component doesn't render anything
}

/**
 * Track plan selection (call from plan selection buttons)
 */
export function trackPlanSelection(
  planName: string,
  price: number,
  billingPeriod: "month" | "year",
  userId?: string
) {
  if (typeof window === "undefined") {return;}

  const variant = getExperimentVariant("exp_price_starter", userId) || "control";

  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: "PlanSelected",
      properties: {
        plan_name: planName,
        price,
        billing_period: billingPeriod,
        variant,
      },
      userId,
    }),
  }).catch((err) => logger.error("Failed to track plan selection", err instanceof Error ? err : new Error(String(err)), {
    component: "PricingAnalytics",
    action: "trackPlanSelection",
  }));
}

/**
 * Track checkout started (call when user clicks CTA button)
 */
export function trackCheckoutStarted(
  planName: string,
  price: number,
  userId?: string
) {
  if (typeof window === "undefined") {return;}

  const variant = getExperimentVariant("exp_price_starter", userId) || "control";

  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: "CheckoutStarted",
      properties: {
        plan_name: planName,
        price,
        variant,
      },
      userId,
    }),
  }).catch((err) => logger.error("Failed to track plan selection", err instanceof Error ? err : new Error(String(err)), {
    component: "PricingAnalytics",
    action: "trackPlanSelection",
  }));
}

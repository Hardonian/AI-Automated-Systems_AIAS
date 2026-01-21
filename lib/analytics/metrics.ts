/**
 * Analytics Metrics Calculation
 * Calculates activation metrics from telemetry events
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";

// Lazy initialization to avoid build-time errors
function getSupabaseClient(): SupabaseClient | null {
  // Build-time safety: Don't create client during build
  if (process.env.NEXT_PHASE === 'phase-production-build' || 
      (process.env.SKIP_ENV_VALIDATION === 'true' && !process.env.VERCEL && !process.env.GITHUB_ACTIONS)) {
    return null;
  }

  const {url} = env.supabase;
  const key = env.supabase.serviceRoleKey;

  // Validate URLs are not placeholders or empty
  if (!url || url.includes('placeholder') || !key || key.includes('placeholder')) {
    return null;
  }

  try {
    return createClient(url, key);
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
    return null;
  }
}

export interface ActivationMetrics {
  activationRate: number;
  timeToActivation: number; // in milliseconds
  day7Retention: number;
  totalSignups: number;
  totalIntegrations: number;
  totalWorkflows: number;
  totalActivations: number;
  uniqueActiveUsers: number;
}

export interface FunnelMetrics {
  signups: number;
  integrations: number;
  workflows: number;
  activations: number;
}

/**
 * Calculate activation rate
 */
export async function calculateActivationRate(days: number = 30): Promise<number> {
  const supabase = getSupabaseClient();
  if (!supabase) {return 0;}

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: signups } = await supabase
    .from("telemetry_events")
    .select("user_id")
    .eq("type", "user_signed_up")
    .gte("created_at", startDate.toISOString());

  const { data: activations } = await supabase
    .from("telemetry_events")
    .select("user_id")
    .eq("type", "user_activated")
    .gte("created_at", startDate.toISOString());

  const signupCount = new Set(signups?.map((e: { user_id: string }) => e.user_id) || []).size;
  const activationCount = new Set(activations?.map((e: { user_id: string }) => e.user_id) || []).size;

  return signupCount > 0 ? (activationCount / signupCount) * 100 : 0;
}

/**
 * Calculate time to activation (median)
 */
export async function calculateTimeToActivation(days: number = 30): Promise<number> {
  const supabase = getSupabaseClient();
  if (!supabase) {return 0;}

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: signups } = await supabase
    .from("telemetry_events")
    .select("user_id, created_at")
    .eq("type", "user_signed_up")
    .gte("created_at", startDate.toISOString());

  const { data: activations } = await supabase
    .from("telemetry_events")
    .select("user_id, created_at")
    .eq("type", "user_activated")
    .gte("created_at", startDate.toISOString());

  const signupRows = (signups ?? []) as Array<{ user_id: string; created_at: string }>;
  const activationRows = (activations ?? []) as Array<{ user_id: string; created_at: string }>;

  // Create a Map for O(1) lookups instead of O(n) find() operations
  const signupMap = new Map(
    signupRows.map((s) => [s.user_id, s.created_at])
  );

  const activationTimes: number[] = [];

  for (const activation of activationRows) {
    const signupCreatedAt = signupMap.get(activation.user_id);
    if (signupCreatedAt) {
      const signupTime = new Date(signupCreatedAt).getTime();
      const activationTime = new Date(activation.created_at).getTime();
      activationTimes.push(activationTime - signupTime);
    }
  }

  if (activationTimes.length === 0) {return 0;}

  activationTimes.sort((a, b) => a - b);
  const median = activationTimes[Math.floor(activationTimes.length / 2)];
  return median ?? 0;
}

/**
 * Calculate Day 7 retention
 */
export async function calculateDay7Retention(): Promise<number> {
  const supabase = getSupabaseClient();
  if (!supabase) {return 0;}

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  // Get signups from 7-14 days ago
  const { data: signups } = await supabase
    .from("telemetry_events")
    .select("user_id")
    .eq("type", "user_signed_up")
    .gte("created_at", fourteenDaysAgo.toISOString())
    .lt("created_at", sevenDaysAgo.toISOString());

  // Get active users in the last 7 days
  const { data: activeUsers } = await supabase
    .from("telemetry_events")
    .select("user_id")
    .eq("type", "user_active")
    .gte("created_at", sevenDaysAgo.toISOString());

  const signupUserIds = new Set(signups?.map((e: { user_id: string }) => e.user_id) || []);
  const activeUserIds = new Set(activeUsers?.map((e: { user_id: string }) => e.user_id) || []);

  const retainedUsers = Array.from(signupUserIds).filter((id) => activeUserIds.has(id));

  return signupUserIds.size > 0 ? (retainedUsers.length / signupUserIds.size) * 100 : 0;
}

/**
 * Get funnel metrics
 */
export async function getFunnelMetrics(days: number = 30): Promise<FunnelMetrics> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { signups: 0, integrations: 0, workflows: 0, activations: 0 };
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [signups, integrations, workflows, activations] = await Promise.all([
    supabase
      .from("telemetry_events")
      .select("user_id")
      .eq("type", "user_signed_up")
      .gte("created_at", startDate.toISOString()),
    supabase
      .from("telemetry_events")
      .select("user_id")
      .eq("type", "integration_connected")
      .gte("created_at", startDate.toISOString()),
    supabase
      .from("telemetry_events")
      .select("user_id")
      .eq("type", "workflow_created")
      .gte("created_at", startDate.toISOString()),
    supabase
      .from("telemetry_events")
      .select("user_id")
      .eq("type", "user_activated")
      .gte("created_at", startDate.toISOString()),
  ]);

  return {
    signups: new Set(signups.data?.map((e: { user_id: string }) => e.user_id) || []).size,
    integrations: new Set(integrations.data?.map((e: { user_id: string }) => e.user_id) || []).size,
    workflows: new Set(workflows.data?.map((e: { user_id: string }) => e.user_id) || []).size,
    activations: new Set(activations.data?.map((e: { user_id: string }) => e.user_id) || []).size,
  };
}

/**
 * Get all activation metrics
 */
export async function getAllActivationMetrics(days: number = 30): Promise<ActivationMetrics> {
  const [activationRate, timeToActivation, day7Retention, funnel] = await Promise.all([
    calculateActivationRate(days),
    calculateTimeToActivation(days),
    calculateDay7Retention(),
    getFunnelMetrics(days),
  ]);

  // Get unique active users
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      activationRate,
      timeToActivation,
      day7Retention,
      totalSignups: funnel.signups,
      totalIntegrations: funnel.integrations,
      totalWorkflows: funnel.workflows,
      totalActivations: funnel.activations,
      uniqueActiveUsers: 0,
    };
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const { data: activeUsers } = await supabase
    .from("telemetry_events")
    .select("user_id")
    .eq("type", "user_active")
    .gte("created_at", startDate.toISOString());

  return {
    activationRate,
    timeToActivation,
    day7Retention,
    totalSignups: funnel.signups,
    totalIntegrations: funnel.integrations,
    totalWorkflows: funnel.workflows,
    totalActivations: funnel.activations,
    uniqueActiveUsers: new Set(activeUsers?.map((e: { user_id: string }) => e.user_id) || []).size,
  };
}

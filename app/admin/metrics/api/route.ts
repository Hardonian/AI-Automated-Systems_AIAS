import { NextResponse } from "next/server";
import { logger } from "@/lib/logging/structured-logger";
import { createGETHandler, RouteContext } from "@/lib/api/route-handler";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

// Lazy initialization to avoid build-time errors when env vars are not set
function getSupabaseClient() {
  const url = env.supabase.url;
  const key = env.supabase.serviceRoleKey;
  
  // Validate URLs are not placeholders (build-time safety)
  if (url.includes('placeholder') || key.includes('placeholder')) {
    throw new Error('Supabase credentials not configured. This route requires valid Supabase environment variables.');
  }
  
  try {
    return createClient(url, key);
  } catch (error) {
    logger.error("Failed to create Supabase client", error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}

export const runtime = "nodejs"; // Use Node.js runtime for route-handler compatibility
export const dynamic = "force-dynamic"; // Force dynamic rendering to avoid build-time execution
export const revalidate = 0; // Disable caching completely

/**
 * GET /api/admin/metrics
 * Get activation metrics for dashboard
 */
export const GET = createGETHandler(
  async (context: RouteContext) => {
    // Build-time safety: Return early if this is being executed during build
    if (process.env.NEXT_PHASE === 'phase-production-build' || 
        (process.env.SKIP_ENV_VALIDATION === 'true' && !process.env.VERCEL)) {
      return NextResponse.json(
        { error: "This route is not available during build time" },
        { status: 503 }
      );
    }

    const { request } = context;

    // Get date range from query params (default to last 30 days)
    const days = parseInt(request.nextUrl.searchParams.get("days") || "30");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
      // Query telemetry events for activation funnel
      // Note: This assumes telemetry events are stored in a 'telemetry_events' table
      // Adjust table name based on your actual schema

      const supabase = getSupabaseClient();

      // Get signups
      const { data: signups, error: signupsError } = await supabase
        .from("telemetry_events")
        .select("user_id, meta, created_at")
        .eq("type", "user_signed_up")
        .gte("created_at", startDate.toISOString());

      if (signupsError) {
        logger.warn("Failed to query signups", {
          component: "AdminMetricsAPI",
          action: "GET",
          error: signupsError.message,
        });
      }

      // Get integration connections
      const { data: integrations, error: integrationsError } = await supabase
        .from("telemetry_events")
        .select("user_id, meta, created_at")
        .eq("type", "integration_connected")
        .gte("created_at", startDate.toISOString());

      if (integrationsError) {
        logger.warn("Failed to query integrations", {
          component: "AdminMetricsAPI",
          action: "GET",
          error: integrationsError.message,
        });
      }

      // Get workflow creations
      const { data: workflows, error: workflowsError } = await supabase
        .from("telemetry_events")
        .select("user_id, meta, created_at")
        .eq("type", "workflow_created")
        .gte("created_at", startDate.toISOString());

      if (workflowsError) {
        logger.warn("Failed to query workflows", {
          component: "AdminMetricsAPI",
          action: "GET",
          error: workflowsError.message,
        });
      }

      // Get activations
      const { data: activations, error: activationsError } = await supabase
        .from("telemetry_events")
        .select("user_id, meta, created_at")
        .eq("type", "user_activated")
        .gte("created_at", startDate.toISOString());

      if (activationsError) {
        logger.warn("Failed to query activations", {
          component: "AdminMetricsAPI",
          action: "GET",
          error: activationsError.message,
        });
      }

      // Get active users (for retention)
      const { data: activeUsers, error: activeUsersError } = await supabase
        .from("telemetry_events")
        .select("user_id, created_at")
        .eq("type", "user_active")
        .gte("created_at", startDate.toISOString());

      if (activeUsersError) {
        logger.warn("Failed to query active users", {
          component: "AdminMetricsAPI",
          action: "GET",
          error: activeUsersError.message,
        });
      }

      // Calculate metrics
      const totalSignups = signups?.length || 0;
      const totalIntegrations = integrations?.length || 0;
      const totalWorkflows = workflows?.length || 0;
      const totalActivations = activations?.length || 0;
      const uniqueActiveUsers = new Set(activeUsers?.map((e: { user_id: string }) => e.user_id) || []).size;

      // Calculate activation rate
      const activationRate = totalSignups > 0 ? (totalActivations / totalSignups) * 100 : 0;

      // Calculate time-to-activation (median)
      const activationTimes: number[] = [];
      if (signups && activations) {
        for (const activation of activations) {
          const signup = signups.find((s: { user_id: string }) => s.user_id === activation.user_id);
          if (signup) {
            const signupTime = new Date(signup.created_at).getTime();
            const activationTime = new Date(activation.created_at).getTime();
            activationTimes.push(activationTime - signupTime);
          }
        }
      }
      const medianTimeToActivation = activationTimes.length > 0
        ? activationTimes.sort((a, b) => a - b)[Math.floor(activationTimes.length / 2)]
        : 0;

      // Calculate Day 7 retention (simplified - would need more complex query in production)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { data: signups7DaysAgo } = await supabase
        .from("telemetry_events")
        .select("user_id")
        .eq("type", "user_signed_up")
        .gte("created_at", sevenDaysAgo.toISOString())
        .lt("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const signupUserIds = new Set(signups7DaysAgo?.map((e: { user_id: string }) => e.user_id) || []);
      const activeUserIds = new Set(activeUsers?.map((e: { user_id: string }) => e.user_id) || []);
      const retainedUsers = Array.from(signupUserIds).filter((id) => activeUserIds.has(id));
      const day7Retention = signupUserIds.size > 0 ? (retainedUsers.length / signupUserIds.size) * 100 : 0;

      return NextResponse.json({
        metrics: {
          activation_rate: Math.round(activationRate * 100) / 100,
          time_to_activation_ms: medianTimeToActivation ?? 0,
          time_to_activation_hours: Math.round(((medianTimeToActivation ?? 0) / (1000 * 60 * 60)) * 100) / 100,
          day_7_retention: Math.round(day7Retention * 100) / 100,
          total_signups: totalSignups,
          total_integrations: totalIntegrations,
          total_workflows: totalWorkflows,
          total_activations: totalActivations,
          unique_active_users: uniqueActiveUsers,
        },
        funnel: {
          signups: totalSignups,
          integrations: totalIntegrations,
          workflows: totalWorkflows,
          activations: totalActivations,
        },
        period: {
          days,
          start_date: startDate.toISOString(),
          end_date: new Date().toISOString(),
        },
      });
    } catch (error) {
      logger.error("Error calculating metrics", error instanceof Error ? error : new Error(String(error)), {
        component: "AdminMetricsAPI",
        action: "GET",
      });
      return NextResponse.json(
        { error: "Failed to calculate metrics" },
        { status: 500 }
      );
    }
  },
  {
    requireAuth: true,
    cache: { enabled: true, ttl: 300 }, // Cache for 5 minutes
  }
);

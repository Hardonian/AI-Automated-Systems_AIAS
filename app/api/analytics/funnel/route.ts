import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/route-handler";
import { env } from "@/lib/env";
import { logger } from "@/lib/logging/structured-logger";

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);

export const dynamic = "force-dynamic";

/**
 * GET /api/analytics/funnel
 * Get activation funnel metrics
 */
export async function GET(request: NextRequest) {
  try {
    // Get user from auth
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : request.cookies.get("sb-access-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (for now, allow all authenticated users)
    // In production, add admin check

    // Get funnel data from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Batch all queries to avoid N+1 problem
    const [
      { count: signupCount, error: signupsError },
      { count: onboardingCount, error: onboardingError },
      { count: integrationCount, error: integrationsError },
      { count: workflowCount, error: workflowsError },
      { count: executionCount, error: executionsError },
      { count: activationCount, error: activationsError },
    ] = await Promise.all([
      supabase
        .from("app_events")
        .select("user_id", { count: "exact", head: true })
        .eq("event_type", "funnel_stage")
        .eq("meta->>stage", "signup")
        .gte("created_at", thirtyDaysAgo.toISOString()),
      supabase
        .from("app_events")
        .select("user_id", { count: "exact", head: true })
        .eq("event_type", "funnel_stage")
        .eq("meta->>stage", "onboarding_start")
        .gte("created_at", thirtyDaysAgo.toISOString()),
      supabase
        .from("app_events")
        .select("user_id", { count: "exact", head: true })
        .eq("event_type", "funnel_stage")
        .eq("meta->>stage", "integration_connect")
        .gte("created_at", thirtyDaysAgo.toISOString()),
      supabase
        .from("app_events")
        .select("user_id", { count: "exact", head: true })
        .eq("event_type", "funnel_stage")
        .eq("meta->>stage", "workflow_create")
        .gte("created_at", thirtyDaysAgo.toISOString()),
      supabase
        .from("app_events")
        .select("user_id", { count: "exact", head: true })
        .eq("event_type", "funnel_stage")
        .eq("meta->>stage", "workflow_execute")
        .gte("created_at", thirtyDaysAgo.toISOString()),
      supabase
        .from("app_events")
        .select("user_id", { count: "exact", head: true })
        .eq("event_type", "funnel_stage")
        .eq("meta->>stage", "activated")
        .gte("created_at", thirtyDaysAgo.toISOString()),
    ]);

    if (signupsError || onboardingError || integrationsError || workflowsError || executionsError || activationsError) {
      logger.error("Failed to get funnel data", new Error("Database query failed"), {
        errors: {
          signups: signupsError?.message,
          onboarding: onboardingError?.message,
          integrations: integrationsError?.message,
          workflows: workflowsError?.message,
          executions: executionsError?.message,
          activations: activationsError?.message,
        },
      });
    }

    // Calculate conversion rates with null safety
    const signup = signupCount ?? 0;
    const onboarding = onboardingCount ?? 0;
    const integration = integrationCount ?? 0;
    const workflow = workflowCount ?? 0;
    const execution = executionCount ?? 0;
    const activation = activationCount ?? 0;

    const conversionRates = {
      signupToOnboarding: signup > 0 ? (onboarding / signup) * 100 : 0,
      onboardingToIntegration: onboarding > 0 ? (integration / onboarding) * 100 : 0,
      integrationToWorkflow: integration > 0 ? (workflow / integration) * 100 : 0,
      workflowToExecute: workflow > 0 ? (execution / workflow) * 100 : 0,
      overallActivation: signup > 0 ? (activation / signup) * 100 : 0,
    };

    return NextResponse.json({
      period: "last_30_days",
      stages: {
        signup,
        onboarding_start: onboarding,
        integration_connect: integration,
        workflow_create: workflow,
        workflow_execute: execution,
        activated: activation,
      },
      conversionRates,
      dropOffPoints: {
        signupToOnboarding: signup - onboarding,
        onboardingToIntegration: onboarding - integration,
        integrationToWorkflow: integration - workflow,
        workflowToExecute: workflow - execution,
      },
    });
  } catch (error) {
    logger.error("Error in GET /api/analytics/funnel", error instanceof Error ? error : undefined);
    return handleApiError(error, "Failed to get funnel data");
  }
}

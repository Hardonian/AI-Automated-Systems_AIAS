import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { logger } from "@/lib/logging/structured-logger";
import { handleApiError } from "@/lib/api/route-handler";

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);

export const dynamic = "force-dynamic";

/**
 * GET /api/analytics/time-saved
 * Calculate time saved based on workflow executions
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

    // Get current month executions
    const month = new Date().toISOString().slice(0, 7);
    const monthStart = new Date(`${month}-01T00:00:00Z`);

    const { data: executions, error } = await supabase
      .from("workflow_executions")
      .select("status, meta")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .gte("started_at", monthStart.toISOString());

    if (error) {
      logger.error("Failed to get executions", error instanceof Error ? error : new Error(String(error)), {
        userId: user.id,
      });
    }

    // Estimate time saved: assume each successful automation saves 5 minutes on average
    // This is a conservative estimate - actual savings vary by workflow
    const completedExecutions = executions?.length || 0;
    const minutesPerExecution = 5;
    const hoursSaved = (completedExecutions * minutesPerExecution) / 60;

    // Default hourly rate: $50/hour (user can customize this)
    const hourlyRate = 50;
    const value = hoursSaved * hourlyRate;

    return NextResponse.json({
      hours: Math.round(hoursSaved * 10) / 10, // Round to 1 decimal
      value: Math.round(value * 100) / 100, // Round to 2 decimals
      hourlyRate,
      executions: completedExecutions,
    });
  } catch (error) {
    logger.error("Error in GET /api/analytics/time-saved", error instanceof Error ? error : undefined);
    return handleApiError(error, "Failed to calculate time saved");
  }
}

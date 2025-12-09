import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";
import { logger } from "@/lib/logging/structured-logger";

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);

export const dynamic = "force-dynamic";

/**
 * GET /api/analytics/execution-history
 * Get execution history for last 30 days
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

    // Get last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: executions, error } = await supabase
      .from("workflow_executions")
      .select("status, started_at")
      .eq("user_id", user.id)
      .gte("started_at", thirtyDaysAgo.toISOString())
      .order("started_at", { ascending: true });

    if (error) {
      logger.error("Failed to get execution history", error instanceof Error ? error : new Error(String(error)), {
        userId: user.id,
      });
    }

    // Group by date
    const grouped: Record<string, { completed: number; failed: number }> = {};

    executions?.forEach((execution: { started_at?: string; status?: string }) => {
      if (!execution.started_at) {return;}
      const dateStr = new Date(execution.started_at).toISOString().split("T")[0]; // YYYY-MM-DD
      if (!dateStr) {return;}
      if (!grouped[dateStr]) {
        grouped[dateStr] = { completed: 0, failed: 0 };
      }
      if (execution.status === "completed") {
        grouped[dateStr]!.completed++;
      } else if (execution.status === "failed") {
        grouped[dateStr]!.failed++;
      }
    });

    // Convert to array and fill missing dates with zeros
    const result: Array<{ date: string; completed: number; failed: number }> = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const groupData = dateStr ? grouped[dateStr] : undefined;
      const finalDateStr = dateStr || new Date().toISOString().split('T')[0] || '';
      result.push({
        date: finalDateStr,
        completed: groupData?.completed || 0,
        failed: groupData?.failed || 0,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    logger.error("Error in GET /api/analytics/execution-history", error instanceof Error ? error : new Error(String(error)), {
      component: "ExecutionHistoryAPI",
      action: "GET",
    });
    return NextResponse.json(
      { error: "Failed to get execution history" },
      { status: 500 }
    );
  }
}

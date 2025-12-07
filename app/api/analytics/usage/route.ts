import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);

export const dynamic = "force-dynamic";

/**
 * GET /api/analytics/usage
 * Get current month automation usage for authenticated user
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

    // Get current month
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM

    // Get usage
    const { data: usage, error } = await supabase
      .from("automation_usage")
      .select("*")
      .eq("user_id", user.id)
      .eq("month", month)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = not found, which is OK (will return defaults)
      logger.error("Failed to get usage", error instanceof Error ? error : new Error(String(error)), {
        userId: user.id,
      });
    }

    // If no usage record exists, get user plan and return defaults
    if (!usage) {
      // Get user plan
      const { data: subscription } = await supabase
        .from("user_subscriptions")
        .select("plan_id, subscription_plans(tier)")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      let plan = "free";
      if (subscription?.subscription_plans?.tier) {
        plan = subscription.subscription_plans.tier as string;
      }

      // Normalize plan
      if (plan === "professional") plan = "pro";
      if (plan === "starter" || plan === "standard") plan = "starter";

      const limits: Record<string, number> = {
        free: 100,
        starter: 10000,
        pro: 50000,
      };

      const limit = limits[plan] || limits.free;

      return NextResponse.json({
        plan,
        month,
        limit,
        used: 0,
        remaining: limit,
      });
    }

    return NextResponse.json(usage);
  } catch (error) {
    logger.error("Error in GET /api/analytics/usage", error instanceof Error ? error : undefined);
    return handleApiError(error, "Failed to get usage data");
  }
}

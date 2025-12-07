import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logging/structured-logger";
import { checkPremiumSubscription } from "@/lib/billing/subscription-check";
import { logger } from "@/lib/logging/structured-logger";
import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logging/structured-logger";
import { env } from "@/lib/env";
import { logger } from "@/lib/logging/structured-logger";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    // Verify user exists
    const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check subscription status
    const subscriptionStatus = await checkPremiumSubscription(userId);

    return NextResponse.json({
      success: true,
      ...subscriptionStatus,
    });
  } catch (error) {
    console.error("Failed to check subscription status:", error);
    return NextResponse.json(
      { error: "Failed to check subscription status" },
      { status: 500 }
    );
  }
}

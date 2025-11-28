/**
 * API Route: Get Experiment Variant
 * Returns the variant assignment for a user/session
 */

import { NextRequest, NextResponse } from "next/server";
import { getExperimentVariant } from "@/lib/experiments/feature-flags";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const experimentId = searchParams.get("experimentId");
    const userId = searchParams.get("userId") || undefined;
    
    // Get session ID from cookie or generate
    let sessionId = request.cookies.get("session_id")?.value;
    if (!sessionId) {
      sessionId = `session_${Math.random().toString(36).substr(2, 9)}`;
    }

    if (!experimentId) {
      return NextResponse.json(
        { error: "experimentId is required" },
        { status: 400 }
      );
    }

    const variant = getExperimentVariant(experimentId, userId, sessionId);

    return NextResponse.json({
      experimentId,
      variant,
      sessionId,
    });
  } catch (error) {
    console.error("Error getting experiment variant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

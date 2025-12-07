import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logging/structured-logger";
import { databasePMFTracker } from "@/lib/analytics/database-integration";
import { logger } from "@/lib/logging/structured-logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { affiliateId, product, sessionId, referrerUrl } = body;

    // Track affiliate click in database
    await databasePMFTracker.trackAffiliateClick(
      affiliateId,
      product,
      sessionId || "unknown",
      undefined, // userId if available from auth
      referrerUrl
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Affiliate click tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track affiliate click" },
      { status: 500 }
    );
  }
}

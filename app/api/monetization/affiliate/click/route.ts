import { NextRequest, NextResponse } from "next/server";
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
    logger.error("Affiliate click tracking error:", error instanceof Error ? error : new Error(String(error)), { component: "route", action: "unknown" });
    return NextResponse.json(
      { error: "Failed to track affiliate click" },
      { status: 500 }
    );
  }
}

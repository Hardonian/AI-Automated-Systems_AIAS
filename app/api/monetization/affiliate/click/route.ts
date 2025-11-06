import { NextRequest, NextResponse } from "next/server";

// Track affiliate click
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { affiliateId, product } = body;

    if (!affiliateId || !product) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: Store in database
    // Track: affiliateId, product, timestamp, user IP, referrer, etc.

    return NextResponse.json({
      success: true,
      tracked: true,
      message: "Affiliate click tracked",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to track affiliate click" },
      { status: 500 }
    );
  }
}

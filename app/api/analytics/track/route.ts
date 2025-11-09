import { NextRequest, NextResponse } from "next/server";
import { conversionTracker } from "@/lib/analytics/conversion-tracking";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Track the event
    conversionTracker.track(body.event, body.properties);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const funnelMetrics = conversionTracker.getFunnelMetrics();
    return NextResponse.json({ funnel: funnelMetrics });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}

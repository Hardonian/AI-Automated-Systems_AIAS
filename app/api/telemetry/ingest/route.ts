import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { SystemError, ValidationError, formatError } from "@/src/lib/errors";
import { telemetry } from "@/lib/monitoring/enhanced-telemetry";

export const runtime = "edge";

/**
 * Telemetry ingestion endpoint
 * Proxies to Supabase Edge Function
 * All configuration loaded dynamically from environment variables
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  
  try {
    const body = await req.text();
    
    // Validate body is not empty
    if (!body || body.length === 0) {
      const error = new ValidationError("Request body is required");
      const formatted = formatError(error);
      return NextResponse.json(
        { error: formatted.message },
        { status: formatted.statusCode }
      );
    }
    
    // Validate JSON format
    try {
      JSON.parse(body);
    } catch {
      const error = new ValidationError("Invalid JSON in request body");
      const formatted = formatError(error);
      return NextResponse.json(
        { error: formatted.message },
        { status: formatted.statusCode }
      );
    }
    
    const r = await fetch(`${env.supabase.url}/functions/v1/ingest-telemetry`, {
      method: "POST", 
      headers: { 
        "content-type": "application/json",
        "authorization": `Bearer ${env.supabase.anonKey}` 
      }, 
      body
    });
    
    const responseText = await r.text();
    const duration = Date.now() - startTime;
    
    // Track performance
    telemetry.trackPerformance({
      name: "telemetry_ingest",
      value: duration,
      unit: "ms",
      tags: { status: r.ok ? "success" : "error", statusCode: r.status.toString() },
    });
    
    return new NextResponse(responseText, { 
      status: r.status, 
      headers: { 
        "content-type": "application/json",
        "X-Response-Time": `${duration}ms`
      } 
    });
  } catch (error: unknown) {
    const systemError = new SystemError(
      "Telemetry ingestion failed",
      error instanceof Error ? error : new Error(String(error))
    );
    const formatted = formatError(systemError);
    
    // Track error
    telemetry.trackPerformance({
      name: "telemetry_ingest",
      value: Date.now() - startTime,
      unit: "ms",
      tags: { status: "error" },
    });
    
    return NextResponse.json(
      { error: formatted.message },
      { status: formatted.statusCode }
    );
  }
}

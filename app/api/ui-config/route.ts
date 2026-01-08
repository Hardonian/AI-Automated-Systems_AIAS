import { NextResponse } from "next/server";

import { getPublicRuntimeUiConfig } from "@/lib/runtime-ui/server";
import { addSecurityHeaders } from "@/lib/middleware/security";
import { logger } from "@/lib/logging/structured-logger";

export const runtime = "nodejs";

/**
 * GET /api/ui-config
 *
 * Public, runtime UI configuration (no secrets).
 * - Preferred source: Vercel Edge Config (`ui:public`)
 * - Local/dev fallback: `config/ui-config.json`
 * - Safe defaults if missing/invalid
 */
export async function GET() {
  try {
    const { config, source } = await getPublicRuntimeUiConfig();
    const response = NextResponse.json({
      config,
      timestamp: new Date().toISOString(),
      source,
    });
    response.headers.set(
      "Cache-Control",
      source === "edge-config"
        ? "public, max-age=0, s-maxage=30, stale-while-revalidate=300"
        : "public, max-age=0, s-maxage=5, stale-while-revalidate=30"
    );
    addSecurityHeaders(response);
    return response;
  } catch (error) {
    logger.error("Error in GET /api/ui-config", error instanceof Error ? error : new Error(String(error)), {
      component: "route",
      action: "GET",
    });
    const response = NextResponse.json({ error: "Failed to retrieve UI config" }, { status: 500 });
    addSecurityHeaders(response);
    return response;
  }
}


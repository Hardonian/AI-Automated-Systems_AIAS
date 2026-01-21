import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/admin-auth";
import { logger } from "@/lib/logging/structured-logger";
import { addSecurityHeaders } from "@/lib/middleware/security";
import { writeRuntimeUiConfigToDb } from "@/lib/runtime-ui/db";
import { coerceRuntimeUiConfig } from "@/lib/runtime-ui/runtime-ui-config";
import { getPublicRuntimeUiConfig } from "@/lib/runtime-ui/server";
import { getClientIP, rateLimit } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    return false;
  }
  return origin === new URL(request.url).origin;
}

function csrfOk(request: NextRequest): boolean {
  const headerToken = request.headers.get("x-csrf-token");
  const cookieToken = request.cookies.get("csrf-token")?.value;
  return !!headerToken && !!cookieToken && headerToken === cookieToken;
}

/**
 * GET /api/admin/ui-config
 * Admin-only view of the current runtime UI config (public values only).
 */
export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) {
    return admin.response || NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { config, source } = await getPublicRuntimeUiConfig();
  const response = NextResponse.json({ config, source, timestamp: new Date().toISOString() });
  addSecurityHeaders(response);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

/**
 * POST /api/admin/ui-config
 * Admin-only update of runtime UI config (stored in DB).
 */
export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) {
    return admin.response || NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const ip = getClientIP(request);
  const limit = rateLimit(`ui-config-write:${ip}`, 20, 60 * 1000);
  if (!limit.allowed) {
    const response = NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limit.resetTime - Date.now()) / 1000)) } }
    );
    addSecurityHeaders(response);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  // Basic CSRF protection (double-submit cookie pattern) and origin check.
  if (!isSameOrigin(request) || !csrfOk(request)) {
    const response = NextResponse.json({ error: "CSRF validation failed" }, { status: 403 });
    addSecurityHeaders(response);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    const response = NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    addSecurityHeaders(response);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const payload =
    typeof raw === "object" && raw !== null && "config" in raw
      ? (raw as { config: unknown }).config
      : raw;
  const config = coerceRuntimeUiConfig(payload);
  const result = await writeRuntimeUiConfigToDb(config);

  if (!result.ok) {
    logger.error("Failed to persist runtime UI config", new Error("DB write failed"), {
      component: "ui-config",
      action: "write",
    });
    const response = NextResponse.json({ error: "Failed to save UI config" }, { status: 500 });
    addSecurityHeaders(response);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const response = NextResponse.json({
    ok: true,
    updatedAt: result.updatedAt ?? new Date().toISOString(),
    config,
  });
  addSecurityHeaders(response);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

import { NextRequest, NextResponse } from "next/server";

import { addSecurityHeaders, generateCSRFToken } from "@/lib/middleware/security";

export const dynamic = "force-dynamic";

/**
 * GET /api/csrf
 *
 * Generates a CSRF token for same-site POSTs from internal tools.
 * Uses a double-submit cookie pattern:
 * - returns token in response JSON
 * - also sets `csrf-token` cookie (non-HttpOnly so client JS can read it if needed)
 */
export async function GET(request: NextRequest) {
  const token = generateCSRFToken();
  const response = NextResponse.json({ token });

  const isHttps = new URL(request.url).protocol === "https:";
  response.cookies.set("csrf-token", token, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" ? isHttps : false,
    path: "/",
  });

  addSecurityHeaders(response);
  response.headers.set("Cache-Control", "no-store");
  return response;
}


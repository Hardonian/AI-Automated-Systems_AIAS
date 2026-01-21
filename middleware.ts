/**
 * Next.js Middleware
 * 
 * Applies security headers, rate limiting, and other protections
 * to all routes.
 */

import { NextRequest, NextResponse } from "next/server";

import { adminGuard, financialAdminGuard } from "@/lib/middleware/admin-guard";
import { addSecurityHeaders , detectSuspiciousActivity } from "@/lib/middleware/security";
import { requireSession } from "@/lib/middleware/session-handler";
import { logger } from "@/lib/utils/logger";
import { rateLimit, getClientIP } from "@/lib/utils/rate-limit";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const ip = getClientIP(request);

  // Skip middleware for static files and API routes (handled separately)
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/static") ||
    path.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  try {
    // Check admin access first (before rate limiting)
    const adminCheck = await adminGuard(request);
    if (adminCheck) {return adminCheck;}

    // Check financial admin access
    const financialCheck = await financialAdminGuard(request);
    if (financialCheck) {return financialCheck;}

    // Check session for protected routes (dashboard, workflows, billing, etc.)
    const protectedPaths = [
      "/dashboard",
      "/workflows",
      "/billing",
      "/settings",
      "/admin",
      "/account",
      "/onboarding",
      "/journal",
      "/community",
      "/challenges",
      "/leaderboard",
      "/play",
      "/playground",
    ];
    const isProtectedPath = protectedPaths.some((protectedPath) => path.startsWith(protectedPath));
    
    if (isProtectedPath) {
      const sessionCheck = await requireSession(request);
      // Fail-closed if auth cannot be evaluated (e.g. missing env) for protected routes
      if (sessionCheck.missingEnv) {
        const response = NextResponse.json(
          { error: "Service temporarily unavailable" },
          { status: 503 }
        );
        addSecurityHeaders(response);
        return response;
      }
      if (sessionCheck.redirect) {
        return sessionCheck.redirect;
      }
      if (sessionCheck.expired && !sessionCheck.valid) {
        // Session expired, redirect to signin
        const url = request.nextUrl.clone();
        url.pathname = "/signin";
        url.searchParams.set("redirect", path);
        return NextResponse.redirect(url);
      }
    }
  } catch (error) {
    // Middleware errors should not crash public routes.
    // For protected/admin routes, we must fail-closed to avoid accidental auth bypass.
    logger.error("Middleware error", error instanceof Error ? error : new Error(String(error)), {
      path,
      ip,
    });
    const protectedPaths = [
      "/dashboard",
      "/workflows",
      "/billing",
      "/settings",
      "/admin",
      "/account",
      "/onboarding",
      "/journal",
      "/community",
      "/challenges",
      "/leaderboard",
      "/play",
      "/playground",
    ];
    const isProtectedPath = protectedPaths.some((protectedPath) => path.startsWith(protectedPath));
    if (isProtectedPath) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      addSecurityHeaders(response);
      return response;
    }
    // Continue with request (fail open for public routes only)
  }

  // Detect suspicious activity (wrap in try-catch)
  try {
    const suspicious = detectSuspiciousActivity(request);
    if (suspicious.suspicious) {
      logger.warn("Suspicious activity detected", undefined, {
        ip,
        path,
        reason: suspicious.reason,
      });
      // Optionally block or rate limit more aggressively
    }
  } catch (error) {
    // Don't fail on suspicious activity detection
    logger.warn("Suspicious activity detection failed", error instanceof Error ? error : new Error(String(error)));
  }

  // Global rate limiting for pages (more lenient than API)
  let limit;
  try {
    limit = rateLimit(ip, 200, 60 * 1000); // 200 requests per minute
  } catch (error) {
    // If rate limiting fails, allow request (fail open) but log
    logger.warn("Rate limiting failed", error instanceof Error ? error : new Error(String(error)), { ip, path });
    limit = { allowed: true, remaining: 200, resetTime: Date.now() + 60000 };
  }

  if (!limit.allowed) {
    const response = NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((limit.resetTime - Date.now()) / 1000)),
        },
      }
    );
    addSecurityHeaders(response);
    return response;
  }

  // Create response
  const response = NextResponse.next();

  // Add security headers
  addSecurityHeaders(response);

  // Ensure internal review routes are not indexed by crawlers
  if (path.startsWith("/_internal/review")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    response.headers.set("Cache-Control", "no-store");
  }

  // Add rate limit headers
  response.headers.set("X-RateLimit-Limit", "200");
  response.headers.set("X-RateLimit-Remaining", String(limit.remaining));
  response.headers.set("X-RateLimit-Reset", String(limit.resetTime));

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

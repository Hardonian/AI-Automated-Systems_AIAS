/**
 * Admin Route Guard
 * 
 * Middleware for protecting admin routes.
 */

import { NextRequest, NextResponse } from "next/server";

import { addSecurityHeaders } from "./security";

import { createMiddlewareSupabaseClient } from "@/lib/supabase/middleware";
import { logger } from "@/lib/utils/logger";

/**
 * Admin route guard middleware
 */
export async function adminGuard(
  request: NextRequest
): Promise<NextResponse | null> {
  const path = request.nextUrl.pathname;

  // Check if this is an admin route
  if (!path.startsWith("/admin")) {
    return null; // Not an admin route, continue
  }

  try {
    const { supabase, response, missingEnv } = createMiddlewareSupabaseClient(request);

    // Fail-closed for admin routes if auth cannot be evaluated
    if (!supabase || missingEnv) {
      const res = NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 }
      );
      addSecurityHeaders(res);
      return res;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("redirect", path);
      const res = NextResponse.redirect(signInUrl);
      addSecurityHeaders(res);
      return res;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      logger.warn("Admin role lookup failed in middleware", profileError as any, {
        path,
        userId: user.id,
      });
      const res = NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      addSecurityHeaders(res);
      return res;
    }

    const role = String((profile as any)?.role ?? "");
    const isAdmin = role === "admin" || role === "super_admin" || role === "financial_admin";

    if (!isAdmin) {
      const res = NextResponse.redirect(new URL("/signin?error=admin_access_required", request.url));
      addSecurityHeaders(res);
      return res;
    }

    // Return the response instance so auth cookies (if any) are preserved.
    addSecurityHeaders(response);
    // Avoid leaking user identifiers/roles in response headers.
    return response;
  } catch (error) {
    // Fail-closed for admin routes
    logger.error(
      "Admin guard middleware error",
      error instanceof Error ? error : new Error(String(error)),
      { path }
    );
    const res = NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    addSecurityHeaders(res);
    return res;
  }
}

/**
 * Financial admin route guard (for sensitive financial data)
 */
export async function financialAdminGuard(
  request: NextRequest
): Promise<NextResponse | null> {
  const path = request.nextUrl.pathname;

  // Check if this is a financial route
  if (!path.startsWith("/admin/financial") && !path.startsWith("/api/admin/financial")) {
    return null;
  }

  try {
    const { supabase, response, missingEnv } = createMiddlewareSupabaseClient(request);

    if (!supabase || missingEnv) {
      const res = NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 }
      );
      addSecurityHeaders(res);
      return res;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("redirect", path);
      const res = NextResponse.redirect(signInUrl);
      addSecurityHeaders(res);
      return res;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      logger.warn("Financial admin role lookup failed in middleware", profileError as any, {
        path,
        userId: user.id,
      });
      const res = NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      addSecurityHeaders(res);
      return res;
    }

    const role = String((profile as any)?.role ?? "");
    const hasFinancialAccess = role === "financial_admin" || role === "super_admin";

    if (!hasFinancialAccess) {
      const res = NextResponse.redirect(new URL("/admin?error=financial_access_required", request.url));
      addSecurityHeaders(res);
      return res;
    }

    addSecurityHeaders(response);
    return response;
  } catch (error) {
    logger.error(
      "Financial admin guard middleware error",
      error instanceof Error ? error : new Error(String(error)),
      { path }
    );
    const res = NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    addSecurityHeaders(res);
    return res;
  }
}

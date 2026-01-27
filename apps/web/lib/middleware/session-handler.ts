/**
 * Session Handler Middleware
 * Handles session expiry and refresh for authenticated users
 */

import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/utils/logger";
import { createMiddlewareSupabaseClient } from "@/lib/supabase/middleware";

export interface SessionCheckResult {
  valid: boolean;
  expired: boolean;
  needsRefresh: boolean;
  userId?: string;
  redirect?: NextResponse;
  /**
   * If middleware creates/updates cookies (e.g. auth cookies), callers should return this response.
   * For simple `getUser()` checks this is usually identical to `NextResponse.next()`.
   */
  response?: NextResponse;
  /**
   * True when auth could not be checked due to missing required env vars.
   * Callers should fail-closed for protected routes.
   */
  missingEnv?: boolean;
}

/**
 * Check if user session is valid and handle expiry
 */
export async function checkSession(request: NextRequest): Promise<SessionCheckResult> {
  try {
    const { supabase, response, missingEnv } = createMiddlewareSupabaseClient(request);

    if (!supabase) {
      return {
        valid: false,
        expired: false,
        needsRefresh: false,
        response,
        missingEnv,
      };
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // No user = not authenticated (not an error for public routes)
    if (!user || authError) {
      return {
        valid: false,
        expired: false,
        needsRefresh: false,
        response,
      };
    }

    // NOTE:
    // Middleware runs on the Edge runtime. Session refresh in middleware requires
    // carefully returning the response instance that received updated cookies.
    // To avoid subtle auth divergence between preview/prod (and to keep middleware
    // fast and deterministic), we treat "has user" as "authenticated" here and
    // let refresh happen in the normal app/auth flow.

    // Session is valid
    return {
      valid: true,
      expired: false,
      needsRefresh: false,
      userId: user.id,
      response,
    };
  } catch (error) {
    logger.error("Error checking session", error instanceof Error ? error : new Error(String(error)));
    return {
      valid: false,
      expired: false,
      needsRefresh: false,
    };
  }
}

/**
 * Require valid session for protected routes
 */
export async function requireSession(request: NextRequest): Promise<SessionCheckResult> {
  const sessionCheck = await checkSession(request);

  if (!sessionCheck.valid) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("redirect", request.nextUrl.pathname);

    return {
      ...sessionCheck,
      redirect: NextResponse.redirect(url),
    };
  }

  return sessionCheck;
}

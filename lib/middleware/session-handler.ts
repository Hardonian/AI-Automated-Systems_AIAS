/**
 * Session Handler Middleware
 * Handles session expiry and refresh for authenticated users
 */

import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";

export interface SessionCheckResult {
  valid: boolean;
  expired: boolean;
  needsRefresh: boolean;
  userId?: string;
  redirect?: NextResponse;
}

/**
 * Check if user session is valid and handle expiry
 */
export async function checkSession(request: NextRequest): Promise<SessionCheckResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // No user = not authenticated (not an error for public routes)
    if (!user || authError) {
      return {
        valid: false,
        expired: false,
        needsRefresh: false,
      };
    }

    // Check if session exists and is valid
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (!session || sessionError) {
      // Session expired or invalid
      return {
        valid: false,
        expired: true,
        needsRefresh: false,
        userId: user.id,
      };
    }

    // Check if session is close to expiry (within 5 minutes)
    const expiresAt = session.expires_at ? session.expires_at * 1000 : Date.now();
    const timeUntilExpiry = expiresAt - Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0) {
      // Try to refresh session
      try {
        const { data: refreshedSession, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshedSession?.session && !refreshError) {
          return {
            valid: true,
            expired: false,
            needsRefresh: true,
            userId: user.id,
          };
        }
      } catch (refreshErr) {
        logger.warn("Failed to refresh session", { userId: user.id, error: refreshErr });
      }
    }

    // Session is valid
    return {
      valid: true,
      expired: false,
      needsRefresh: false,
      userId: user.id,
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

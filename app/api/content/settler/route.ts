import { NextRequest, NextResponse } from "next/server";

import { loadSettlerContent, saveSettlerContent } from "@/lib/content/loader";
import type { SettlerContent } from "@/lib/content/schemas";
import { env } from "@/lib/env";
import { logger } from "@/lib/logging/structured-logger";
/**
 * GET /api/content/settler
 * Returns the current Settler content
 */
export async function GET() {
  try {
    const content = await loadSettlerContent();
    return NextResponse.json(content);
  } catch (error: unknown) {
    logger.error("Error loading Settler content:", error instanceof Error ? error : new Error(String(error)), { component: "route", action: "unknown" });
    return NextResponse.json(
      { error: "Failed to load content" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/content/settler
 * Updates Settler content (requires admin authentication)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication - support both admin token and legacy env token
    const authHeader = request.headers.get("authorization");
    const providedToken = authHeader?.replace("Bearer ", "");
    
    if (!providedToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // First, try to verify as admin token
    let isAuthorized = false;
    
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabaseAdmin = createClient(
        env.supabase.url,
        env.supabase.serviceRoleKey
      );

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("content_studio_token", providedToken)
        .single();

      if (profile) {
        // Verify user is still admin
        const { data: roleData } = await supabaseAdmin
          .from("user_roles")
          .select("role")
          .eq("user_id", profile.id)
          .eq("role", "admin")
          .single();

        if (roleData) {
          isAuthorized = true;
        }
      }
    } catch {
      // If verification fails, fall back to legacy env token
    }

    // Fallback to legacy env token if admin verification failed
    if (!isAuthorized) {
      const legacyToken = process.env.CONTENT_STUDIO_TOKEN;
      if (legacyToken && providedToken === legacyToken) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const content = body as SettlerContent;
    
    await saveSettlerContent(content);
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    logger.error("Error saving Settler content:", error instanceof Error ? error : new Error(String(error)), { component: "route", action: "unknown" });
    return NextResponse.json(
      { error: error.message || "Failed to save content" },
      { status: 500 }
    );
  }
}

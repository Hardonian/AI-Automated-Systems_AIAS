// [STAKE+TRUST:BEGIN:audit_api]
import { NextResponse } from "next/server";

import { logger } from "@/lib/logging/structured-logger";
import { createServerSupabaseClient } from "@/lib/supabase/server";
export const runtime = "edge";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("audit_log")
      .select("*")
      .eq("user_id", user.id)
      .order("ts", { ascending: false })
      .limit(100);

    if (error) {
      logger.error("Audit log query error:", error instanceof Error ? error : new Error(String(error)), { component: "route", action: "unknown" });
      return NextResponse.json(
        { error: "Failed to fetch audit log", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ rows: data || [] });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Missing required Supabase environment variables")) {
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error("Audit log API error:", error instanceof Error ? error : new Error(String(error)), { component: "route", action: "unknown" });
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}
// [STAKE+TRUST:END:audit_api]

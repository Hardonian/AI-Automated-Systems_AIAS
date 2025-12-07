import { NextResponse } from "next/server";
import { logger } from "@/lib/logging/structured-logger";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id } = await params;
    const workflowId = id;

    // Get workflow (public workflows only for embeds)
    const { data: workflow, error } = await supabase
      .from("workflows")
      .select("*")
      .eq("id", workflowId)
      .eq("is_public", true)
      .single();

    if (error || !workflow) {
      return NextResponse.json(
        { error: "Workflow not found or not public" },
        { status: 404 }
      );
    }

    return NextResponse.json(workflow);
  } catch (error) {
    logger.error("Error fetching workflow for embed", error instanceof Error ? error : new Error(String(error)), {
      component: "EmbedAPI",
      action: "GET",
    });
    return NextResponse.json(
      { error: "Failed to fetch workflow" },
      { status: 500 }
    );
  }
}

/**
 * Artifacts Download API
 * Download artifacts from workflow executions
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { handleApiError } from "@/lib/api/route-handler";
import { env } from "@/lib/env";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";

const supabaseAdmin = createClient(env.supabase.url, env.supabase.serviceRoleKey);

/**
 * GET /api/artifacts/[id]/download
 * Download artifact as file
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const supabase = await createSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const artifactId = params.id;

    // Get artifact
    const { data: artifact, error: artifactError } = await supabaseAdmin
      .from("artifacts")
      .select("*")
      .eq("id", artifactId)
      .single();

    if (artifactError || !artifact) {
      return NextResponse.json(
        { error: "Artifact not found" },
        { status: 404 }
      );
    }

    // Verify user is member of tenant
    const { data: membership, error: membershipError } = await supabase
      .from("tenant_members")
      .select("role")
      .eq("tenant_id", artifact.tenant_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: "Not authorized to download this artifact" },
        { status: 403 }
      );
    }

    // Determine content and content type
    let content: string | Uint8Array | Buffer;
    let contentType: string;
    let filename: string;

    if (artifact.artifact_type === "json" && artifact.content) {
      content = JSON.stringify(artifact.content, null, 2);
      contentType = "application/json";
      filename = `artifact-${artifactId}.json`;
    } else if (artifact.content_text) {
      content = artifact.content_text;
      contentType = "text/plain";
      filename = `artifact-${artifactId}.txt`;
    } else if (artifact.content_bytes) {
      // Buffer extends Uint8Array and is compatible with BodyInit
      content = Buffer.from(artifact.content_bytes);
      contentType = "application/octet-stream";
      filename = `artifact-${artifactId}.bin`;
    } else {
      return NextResponse.json(
        { error: "Artifact has no content" },
        { status: 400 }
      );
    }

    return new NextResponse(content as BodyInit, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return handleApiError(error, "Failed to download artifact");
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);

export const dynamic = "force-dynamic";

/**
 * GET /api/edge/artifacts/[id]/download
 * Download an artifact (increments download count)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : request.cookies.get("sb-access-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get artifact
    const { data: artifact, error: fetchError } = await supabase
      .from("edge_ai_artifacts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();

    if (fetchError || !artifact) {
      if (fetchError?.code === "PGRST116") {
        return NextResponse.json({ error: "Artifact not found" }, { status: 404 });
      }
      logger.error(
        "Failed to get artifact",
        fetchError instanceof Error ? fetchError : new Error(String(fetchError)),
        { userId: user.id, artifactId: id }
      );
      return handleApiError(fetchError, "Failed to retrieve artifact");
    }

    // Check expiration
    if (artifact.expires_at && new Date(artifact.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Artifact has expired" },
        { status: 410 }
      );
    }

    // Increment download count
    await supabase
      .from("edge_ai_artifacts")
      .update({
        download_count: (artifact.download_count || 0) + 1,
        last_downloaded_at: new Date().toISOString(),
      })
      .eq("id", id);

    // Generate signed URL for file download
    const { getArtifactDownloadUrl } = await import('@/lib/edge-ai/storage');
    const downloadResult = await getArtifactDownloadUrl(artifact.file_path, 3600); // 1 hour expiry

    if (!downloadResult.success || !downloadResult.url) {
      return NextResponse.json(
        { error: 'Failed to generate download URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      artifact: {
        id: artifact.id,
        name: artifact.name,
        file_path: artifact.file_path,
        file_size_bytes: artifact.file_size_bytes,
        mime_type: artifact.mime_type,
        download_url: downloadResult.url,
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour from now
      },
    });
  } catch (error) {
    logger.error(
      "Error in GET /api/edge/artifacts/[id]/download",
      error instanceof Error ? error : undefined
    );
    return handleApiError(error, "Failed to download artifact");
  }
}

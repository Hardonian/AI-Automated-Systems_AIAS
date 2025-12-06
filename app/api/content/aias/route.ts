import { NextRequest, NextResponse } from "next/server";
import { loadAIASContent, saveAIASContent } from "@/lib/content/loader";
import type { AIASContent } from "@/lib/content/schemas";

/**
 * GET /api/content/aias
 * Returns the current AIAS content
 */
export async function GET() {
  try {
    const content = await loadAIASContent();
    return NextResponse.json(content);
  } catch (error: any) {
    console.error("Error loading AIAS content:", error);
    return NextResponse.json(
      { error: "Failed to load content" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/content/aias
 * Updates AIAS content (requires authentication)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication token
    const authHeader = request.headers.get("authorization");
    const token = process.env.CONTENT_STUDIO_TOKEN;
    
    if (!token) {
      return NextResponse.json(
        { error: "Content Studio not configured" },
        { status: 500 }
      );
    }

    if (!authHeader || authHeader !== `Bearer ${token}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const content = body as AIASContent;
    
    await saveAIASContent(content);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error saving AIAS content:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save content" },
      { status: 500 }
    );
  }
}

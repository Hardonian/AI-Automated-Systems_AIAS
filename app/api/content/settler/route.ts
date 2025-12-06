import { NextRequest, NextResponse } from "next/server";
import { loadSettlerContent, saveSettlerContent } from "@/lib/content/loader";
import type { SettlerContent } from "@/lib/content/schemas";

/**
 * GET /api/content/settler
 * Returns the current Settler content
 */
export async function GET() {
  try {
    const content = await loadSettlerContent();
    return NextResponse.json(content);
  } catch (error: any) {
    console.error("Error loading Settler content:", error);
    return NextResponse.json(
      { error: "Failed to load content" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/content/settler
 * Updates Settler content (requires authentication)
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
    const content = body as SettlerContent;
    
    await saveSettlerContent(content);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error saving Settler content:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save content" },
      { status: 500 }
    );
  }
}

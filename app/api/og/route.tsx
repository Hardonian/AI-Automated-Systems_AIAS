import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "AI Automated Systems";
    const description =
      searchParams.get("description") ||
      "Custom AI Platform Development | Transform Your Business";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            backgroundImage: "linear-gradient(to bottom, #1a1a1a, #0a0a0a)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: "72px",
                fontWeight: "bold",
                color: "#ffffff",
                marginBottom: "24px",
                lineHeight: "1.2",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "32px",
                color: "#a0a0a0",
                lineHeight: "1.5",
                maxWidth: "900px",
              }}
            >
              {description}
            </p>
            <div
              style={{
                display: "flex",
                marginTop: "48px",
                fontSize: "24px",
                color: "#3b82f6",
              }}
            >
              aiautomatedsystems.ca
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : String(e);
    return new Response(`Failed to generate image: ${error}`, {
      status: 500,
    });
  }
}

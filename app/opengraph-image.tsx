import { ImageResponse } from "next/og";

export const alt =
  "AI Automated Systems — deterministic automation that stays running";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#020617",
        color: "#fafafa",
        display: "flex",
        fontFamily: "monospace",
        height: "100%",
        justifyContent: "center",
        padding: 72,
        width: "100%",
      }}
    >
      <div
        style={{
          border: "5px solid #ff4d1a",
          boxShadow: "16px 16px 0 #ff4d1a",
          display: "flex",
          flexDirection: "column",
          padding: 54,
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#ff4d1a",
            display: "flex",
            fontSize: 26,
            letterSpacing: 5,
          }}
        >
          AI AUTOMATED SYSTEMS
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.05,
            marginTop: 28,
          }}
        >
          AI systems that ship — and stay running.
        </div>
        <div
          style={{
            color: "#94a3b8",
            display: "flex",
            fontSize: 25,
            marginTop: 30,
          }}
        >
          Deterministic delivery · policy gates · measurable outcomes
        </div>
      </div>
    </div>,
    size,
  );
}

import { ImageResponse } from "next/og";
import { getCaseStudyBySlug, caseStudies } from "@/lib/case-studies-generator";

export const alt = "AIAS Case Study";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    return new ImageResponse(
      <div
        style={{
          fontSize: 48,
          background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        Case Study Not Found
      </div>,
      {
        ...size,
      },
    );
  }

  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(to bottom right, #020617, #0f172a)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            background: "#4f46e5",
            borderRadius: "8px",
          }}
        />
        <span
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "white",
            letterSpacing: "-0.025em",
          }}
        >
          AI AUTOMATED SYSTEMS
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <span
          style={{
            fontSize: "20px",
            fontWeight: "semibold",
            color: "#818cf8",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Case Study Deep Dive
        </span>
        <h1
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "white",
            lineHeight: "1.1",
            maxWidth: "900px",
            margin: "0",
          }}
        >
          {study.title}
        </h1>
        <p
          style={{
            fontSize: "28px",
            color: "#94a3b8",
            maxWidth: "800px",
            lineHeight: "1.4",
          }}
        >
          {study.problem.slice(0, 140)}...
        </p>
      </div>

      <div
        style={{
          display: "flex",
          marginTop: "60px",
          gap: "12px",
        }}
      >
        {study.technologies.slice(0, 4).map((tech) => (
          <div
            key={tech}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {tech}
          </div>
        ))}
      </div>
    </div>,
    {
      ...size,
    },
  );
}

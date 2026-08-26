import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  PageHero,
  PageSection,
  SurfaceCard,
} from "@/components/ui/section-primitives";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { blueprints } from "@/src/content/moat";

export function generateStaticParams() {
  return blueprints.map((blueprint) => ({ slug: blueprint.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blueprint = blueprints.find((item) => item.slug === slug);

  if (!blueprint) {
    return generateSEOMetadata({
      title: "Blueprint not found | AI Automated Systems",
      description: "The requested blueprint was not found.",
      canonical: "/blueprints",
    });
  }

  return generateSEOMetadata({
    title: `${blueprint.title} | AIAS Blueprint`,
    description: blueprint.summary,
    canonical: `/blueprints/${blueprint.slug}`,
  });
}

function ArchitectureDiagram({ nodes }: { nodes: string[] }) {
  return (
    <svg
      aria-label="Blueprint architecture diagram"
      className="h-auto w-full rounded-md border bg-background p-4"
      viewBox="0 0 640 220"
    >
      {nodes.map((node, index) => {
        const x = 30 + index * 150;
        return (
          <g key={node}>
            <rect
              fill="currentColor"
              fillOpacity="0.06"
              height="70"
              rx="10"
              width="130"
              x={x}
              y={75}
            />
            <text fontSize="13" textAnchor="middle" x={x + 65} y={110}>
              {node}
            </text>
            {index < nodes.length - 1 ? (
              <line
                stroke="currentColor"
                strokeOpacity="0.5"
                x1={x + 130}
                x2={x + 150}
                y1={110}
                y2={110}
              />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

export default async function BlueprintDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blueprint = blueprints.find((item) => item.slug === slug);

  if (!blueprint) {
    notFound();
  }

  return (
    <>
      <div className="container pt-4">
        <Breadcrumbs
          items={[
            { label: "Blueprints", href: "/blueprints" },
            { label: blueprint.title },
          ]}
        />
      </div>

      <PageHero
        eyebrow="Blueprint"
        title={blueprint.title}
        description={blueprint.summary}
      />

      <PageSection>
        <div className="grid gap-6 md:grid-cols-2">
          <SurfaceCard>
            <h2 className="text-2xl font-bold">Problem</h2>
            <p className="mt-3 text-muted-foreground">{blueprint.problem}</p>
          </SurfaceCard>
          <SurfaceCard>
            <h2 className="text-2xl font-bold">Constraints</h2>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              {blueprint.constraints.map((constraint) => (
                <li key={constraint}>• {constraint}</li>
              ))}
            </ul>
          </SurfaceCard>
        </div>
      </PageSection>
      <PageSection width="narrow">
        <SurfaceCard>
          <h2 className="text-2xl font-bold">Architecture diagram</h2>
          <div className="mt-4">
            <ArchitectureDiagram nodes={blueprint.architectureNodes} />
          </div>
        </SurfaceCard>
      </PageSection>
      <PageSection width="narrow">
        <SurfaceCard>
          <h2 className="text-2xl font-bold">Implementation notes</h2>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            {blueprint.implementationNotes.map((note) => (
              <li key={note}>• {note}</li>
            ))}
          </ul>
          <a
            className="mt-5 inline-flex text-sm font-semibold text-primary underline underline-offset-4"
            href={blueprint.downloadPath}
          >
            Download artifact
          </a>
        </SurfaceCard>
      </PageSection>
    </>
  );
}

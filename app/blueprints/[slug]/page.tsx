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
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Designed for
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {blueprint.audience}
            </p>
          </SurfaceCard>
          <SurfaceCard>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Operating model
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {blueprint.operatingModel}
            </p>
          </SurfaceCard>
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

      <PageSection background="muted">
        <div className="grid gap-6 md:grid-cols-2">
          <SurfaceCard>
            <h2 className="text-2xl font-bold">Design assumptions</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {blueprint.assumptions.map((assumption) => (
                <li className="flex gap-3" key={assumption}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" />
                  {assumption}
                </li>
              ))}
            </ul>
          </SurfaceCard>
          <SurfaceCard>
            <h2 className="text-2xl font-bold">Non-negotiable constraints</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {blueprint.constraints.map((constraint) => (
                <li className="flex gap-3" key={constraint}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" />
                  {constraint}
                </li>
              ))}
            </ul>
          </SurfaceCard>
        </div>
      </PageSection>
      <PageSection width="narrow">
        <SurfaceCard>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            System shape
          </p>
          <h2 className="mt-2 text-2xl font-bold">Architecture flow</h2>
          <div className="mt-4">
            <ArchitectureDiagram nodes={blueprint.architectureNodes} />
          </div>
        </SurfaceCard>
      </PageSection>

      <PageSection>
        <div className="mb-10 max-w-3xl">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            Control specification
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            Controls that make the model operable
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Each control has a defined purpose and an auditable evidence trail
            so operators can explain what happened, not merely observe an
            outcome.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {blueprint.controlPoints.map((point) => (
            <SurfaceCard className="flex flex-col" key={point.control}>
              <h3 className="text-lg font-bold">{point.control}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {point.purpose}
              </p>
              <div className="mt-5 border-t border-border pt-4">
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                  Evidence produced
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">
                  {point.evidence}
                </p>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection background="muted">
        <div className="mb-10 max-w-3xl">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            Boundary contracts
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            What crosses each boundary
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {blueprint.interfaceContracts.map((contract) => (
            <SurfaceCard key={contract.boundary}>
              <h3 className="text-lg font-bold">{contract.boundary}</h3>
              <div className="mt-5 space-y-4 text-sm leading-relaxed">
                <div>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                    Required contract
                  </p>
                  <p className="mt-1.5 text-muted-foreground">
                    {contract.contract}
                  </p>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                    Failure policy
                  </p>
                  <p className="mt-1.5 text-muted-foreground">
                    {contract.failurePolicy}
                  </p>
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <div className="mb-10 max-w-3xl">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            Delivery sequence
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            Build the control surface before scaling it
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {blueprint.implementationPlan.map((phase) => (
            <SurfaceCard key={phase.phase}>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                {phase.phase}
              </p>
              <h3 className="mt-3 text-xl font-bold">{phase.outcome}</h3>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {phase.activities.map((activity) => (
                  <li className="flex gap-3" key={activity}>
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" />
                    {activity}
                  </li>
                ))}
              </ul>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection background="muted" width="wide">
        <SurfaceCard>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            Verification model
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            Signals required to operate with confidence
          </h2>
          <div className="mt-7 divide-y divide-border border-y border-border">
            {blueprint.verificationSignals.map((signal) => (
              <div
                className="grid gap-3 py-5 md:grid-cols-[0.8fr_1.2fr_1.2fr] md:gap-6"
                key={signal.measure}
              >
                <h3 className="font-semibold">{signal.measure}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                    Target ·
                  </span>
                  {signal.target}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                    Response ·
                  </span>
                  {signal.action}
                </p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </PageSection>

      <PageSection width="wide">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <SurfaceCard>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Implementation guidance
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Decisions to retain through delivery
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {blueprint.implementationNotes.map((note) => (
                <li className="flex gap-3" key={note}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" />
                  {note}
                </li>
              ))}
            </ul>
          </SurfaceCard>
          <SurfaceCard className="border-primary">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Handoff pack
            </p>
            <h2 className="mt-2 text-2xl font-bold">What the team keeps</h2>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {blueprint.handoffArtifacts.map((artifact) => (
                <li className="flex gap-3" key={artifact}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" />
                  {artifact}
                </li>
              ))}
            </ul>
            <a
              className="mt-7 inline-flex text-sm font-semibold text-primary underline underline-offset-4"
              href={blueprint.downloadPath}
            >
              Download the full specification
            </a>
          </SurfaceCard>
        </div>
      </PageSection>
    </>
  );
}

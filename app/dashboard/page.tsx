import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import {
  PageHero,
  PageSection,
  SurfaceCard,
} from "@/components/ui/section-primitives";
import { ClientDashboardPreview } from "@/components/content/client-dashboard-preview";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { WebApplicationSchema } from "@/components/seo/structured-data";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = generateSEOMetadata({
  title: "Client Operations Dashboard | AI Automated Systems",
  description:
    "Interactive reference workspace demonstrating workload telemetry, evaluation scorecards, and audit runbooks.",
  canonical: "/dashboard",
});

export default function DashboardPage() {
  return (
    <>
      <WebApplicationSchema
        name="AIAS Client Operations Dashboard"
        description="Interactive reference workspace demonstrating workload telemetry, evaluation scorecards, and audit runbooks."
        url="https://aiautomatedsystems.ca/dashboard"
        applicationCategory="BusinessApplication"
      />

      <div className="container pt-4">
        <Breadcrumbs
          items={[
            { label: "Tools", href: "/automation-demo" },
            { label: "Operations Dashboard" },
          ]}
        />
      </div>

      <PageHero
        eyebrow="Client Control-Plane"
        title="Operations Workspace Reference"
        description="Explore how a governed client workspace can organize workload state, evaluation integrity, latency budgets, and audit-ready runbooks. The data shown here is illustrative."
      />

      {/* Interactive Workspace Preview */}
      <PageSection>
        <ClientDashboardPreview />
      </PageSection>

      {/* Access Provisioning CTA */}
      <PageSection background="muted" width="narrow">
        <SurfaceCard className="border-2 border-primary bg-card p-8 text-center shadow-card">
          <div className="mx-auto flex h-12 w-12 items-center justify-center border-2 border-primary bg-primary/10 text-primary mb-4">
            <Lock className="h-6 w-6" />
          </div>

          <h2 className="text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
            Request Provisioned Client Access
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm text-muted-foreground leading-relaxed">
            Production workspace boundaries, repositories, network controls,
            telemetry, and access policies are scoped to each client during the
            architecture diagnostic. This public route is an interactive design
            reference, not a connected production console.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-none border-2 border-primary bg-primary font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card hover:-translate-y-0.5 transition-all"
            >
              <Link href="/book">
                Book Strategy Session
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-widest hover:border-foreground transition-all"
            >
              <Link href="/contact">Contact Architecture Team</Link>
            </Button>
          </div>
        </SurfaceCard>
      </PageSection>
    </>
  );
}

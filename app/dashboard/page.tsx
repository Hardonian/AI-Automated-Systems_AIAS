import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { ClientDashboardPreview } from '@/components/content/client-dashboard-preview';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { WebApplicationSchema } from '@/components/seo/structured-data';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Client Operations Dashboard | AI Automated Systems',
  description: 'Protected client control-plane workspace showcasing live workload telemetry, evaluation scorecards, and audit runbooks.',
  canonical: '/dashboard',
});

export default function DashboardPage() {
  return (
    <>
      <WebApplicationSchema
        name="AIAS Client Operations Dashboard"
        description="Client control-plane workspace showcasing live workload telemetry, evaluation scorecards, and audit runbooks."
        url="https://aiautomatedsystems.ca/dashboard"
        applicationCategory="BusinessApplication"
      />

      <div className="container pt-4">
        <Breadcrumbs
          items={[
            { label: 'Tools', href: '/automation-demo' },
            { label: 'Operations Dashboard' },
          ]}
        />
      </div>

      <PageHero
        eyebrow="Client Control-Plane"
        title="Operations & Workload Dashboard"
        description="Monitor active deterministic agent fleets, continuous evaluation integrity, latency budgets, and compliance audit logs in real time."
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
            Dedicated multi-tenant client instances are provisioned alongside our architecture diagnostic. Every active workspace maps to your dedicated Git repositories and private VPC endpoints.
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
              <Link href="/contact">
                Contact Architecture Team
              </Link>
            </Button>
          </div>
        </SurfaceCard>
      </PageSection>
    </>
  );
}

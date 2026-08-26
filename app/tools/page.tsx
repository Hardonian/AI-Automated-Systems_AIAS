import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Cpu,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';

import { PageHero, PageSection } from '@/components/ui/section-primitives';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { siteContent } from '@/src/content/site';
import { ToolsDirectoryClient } from '@/components/tools/tools-directory-client';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Interactive AI Automation Tools & Simulators | AIAS',
  description:
    'Self-serve client-side AI tools, ROI calculators, deterministic workflow planners, and policy studios to model and test automation impact.',
  canonical: '/tools',
});

export default function ToolsHubPage() {
  const tools = siteContent.quickTools || [];

  return (
    <>
      <div className="container pt-4">
        <Breadcrumbs items={[{ label: 'Quick Tools' }]} />
      </div>

      <PageHero
        eyebrow="Prong 01 // Instant & Self-Serve"
        title="Interactive Automation Tools & Simulators"
        description="Experience deterministic systems thinking in action. Run browser-based simulations, model your annual labor ROI, audit governance readiness, and test policy boundaries with zero setup."
      />

      <PageSection>
        {/* Interactive Client-side Directory with Category Filters, Search, and Live Tool Cards */}
        <ToolsDirectoryClient tools={tools} />

        {/* Cross-Prong Launch Banner */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="border-2 border-border bg-card p-8 shadow-card transition-all hover:border-primary">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-2 border-primary bg-primary text-primary-foreground">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                  Prong 02 // Enterprise Engineering
                </p>
                <h2 className="font-mono text-lg font-black uppercase text-foreground">
                  Hire AIAS to Build Your System
                </h2>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Ready to turn simulation plans into production reality? Hire our systems architects
              for bespoke automation builds, stabilization sprints, and operator enablement.
            </p>
            <div className="mt-6">
              <Link
                href="/hire"
                className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-primary hover:text-foreground transition-colors underline underline-offset-4"
              >
                Explore Consultancy Tracks
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="border-2 border-border bg-card p-8 shadow-card transition-all hover:border-cyan-500">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-2 border-cyan-500 bg-cyan-500 text-white">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-500">
                  Prong 03 // Turnkey Software
                </p>
                <h2 className="font-mono text-lg font-black uppercase text-foreground">
                  Hardonia Store & Product Catalog
                </h2>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Looking for pre-built modules, deployment fabrics, or governance kits? Browse our
              tested catalog of ready-to-deploy software packages.
            </p>
            <div className="mt-6">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-cyan-500 hover:text-foreground transition-colors underline underline-offset-4"
              >
                Browse Product Catalog
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </PageSection>
    </>
  );
}

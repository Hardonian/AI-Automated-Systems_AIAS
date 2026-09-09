import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  PageHero,
  PageSection,
  SurfaceCard,
} from "@/components/ui/section-primitives";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateSEOMetadata({
  title: "Offline Workspace | AI Automated Systems",
  description:
    "Offline fallback for cached AIAS blueprints and browser-based planning tools.",
  canonical: "/offline",
});

export default function OfflinePage() {
  return (
    <>
      <PageHero
        eyebrow="Connection unavailable"
        title="Your local workspace is still available"
        description="AIAS tools are static-first. Reconnect for uncached pages, or continue with artifacts already saved in your browser."
      />
      <PageSection>
        <SurfaceCard>
          <h2 className="font-mono text-xl font-black uppercase">
            Offline actions
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/tools">Open cached tools</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/blueprints">Open blueprints</Link>
            </Button>
          </div>
        </SurfaceCard>
      </PageSection>
    </>
  );
}

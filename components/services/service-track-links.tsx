import Link from "next/link";

import { SurfaceCard } from "@/components/ui/section-primitives";

export function ServiceTrackLinks() {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2">
      <SurfaceCard>
        <h2 className="text-xl font-bold">Deep-dive service tracks</h2>
        <p className="mt-2 text-muted-foreground">
          Choose a focused architecture track for website automation or app
          orchestration systems.
        </p>
        <div className="mt-4 flex gap-4 text-sm font-semibold">
          <Link
            className="underline underline-offset-4"
            href="/services/automation-web"
          >
            Automation web systems
          </Link>
          <Link
            className="underline underline-offset-4"
            href="/services/app-ai-systems"
          >
            App + AI systems
          </Link>
        </div>
      </SurfaceCard>
    </div>
  );
}

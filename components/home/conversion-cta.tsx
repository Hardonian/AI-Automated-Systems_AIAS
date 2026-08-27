"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getPrimaryCtaHref, siteContent } from "@/src/content/site";
import { track } from "@/lib/analytics";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function ConversionCTA() {
  return (
    <section
      className="border-t-2 border-border bg-background px-4 py-24"
      id="contact"
    >
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="mb-6 text-3xl font-black uppercase tracking-tighter md:text-5xl">
          Book a 30-minute diagnostic — free, no strings
        </h2>
        <p className="mx-auto mb-4 max-w-2xl font-mono text-base text-muted-foreground md:text-lg">
          Tell us which workflow is blocking your team. We&apos;ll map the
          constraints, identify quick wins, and recommend next steps — whether
          that involves us or not.
        </p>
        <p className="mb-10 font-mono text-sm text-primary">
          {siteContent.contact.responseTime}
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticButton strength={25}>
            <Button
              asChild
              size="lg"
              className="rounded-none border-2 border-cyan-500 bg-cyan-500/10 px-10 font-mono text-base font-bold uppercase tracking-wider text-cyan-400 shadow-[4px_4px_0px_0px_rgba(6,182,212,0.5)] transition-all hover:bg-cyan-500 hover:text-white hover:shadow-[6px_6px_0px_0px_rgba(6,182,212,1)] backdrop-blur-sm"
            >
              <Link
                href={getPrimaryCtaHref()}
                onClick={() =>
                  track("primary_cta_clicked", { location: "conversion_cta" })
                }
              >
                {siteContent.positioning.primaryCTA.label}
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
          </MagneticButton>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-none border-2 border-border bg-transparent px-10 font-mono text-base font-bold uppercase tracking-wider text-foreground shadow-card transition-all hover:-translate-y-1 hover:border-foreground"
          >
            <Link
              href={`mailto:${siteContent.contact.email}`}
              onClick={() =>
                track("email_cta_clicked", { location: "conversion_cta" })
              }
            >
              Email your challenge directly
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

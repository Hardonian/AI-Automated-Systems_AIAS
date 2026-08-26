import type { Metadata } from "next";
import { MapPin, ShieldCheck, Users, ArrowRight } from "lucide-react";

import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import {
  PageCta,
  PageHero,
  PageSection,
  SurfaceCard,
} from "@/components/ui/section-primitives";
import { FeatureIllustration } from "@/components/visual/FeatureIllustration";
import { getPrimaryCtaHref } from "@/src/content/site";

export const metadata: Metadata = generateSEOMetadata({
  title: "About | AI Automated Systems",
  description:
    "Learn about AIAS - a Canadian consultancy building enterprise-grade agentic automation systems.",
  canonical: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A consultancy focused on reliable automation outcomes"
        description="AIAS partners with operations and product teams to map critical workflows, ship deterministic automation, and transfer capability into internal teams."
      />

      <PageSection>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <SurfaceCard>
            <h2 className="text-2xl font-bold">What you get from our team</h2>
            <p className="mt-4 text-muted-foreground">
              We combine technical implementation with operator-ready
              documentation. Every engagement is designed so your team can
              maintain and improve the system after handoff.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {[
                "Delivery plans grounded in your real process constraints",
                "Guardrails for security, governance, and quality control",
                "Practical training for leaders, operators, and builders",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <ArrowRight className="mt-0.5 h-4 w-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </SurfaceCard>
          <SurfaceCard>
            <div className="rounded-xl border bg-muted/30 p-4">
              <FeatureIllustration className="h-36" type="agents" />
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              Built in Canada, serving distributed teams.
            </p>
          </SurfaceCard>
        </div>
      </PageSection>

      <PageSection>
        <div className="grid gap-6 md:grid-cols-2">
          <SurfaceCard>
            <h2 className="text-2xl font-bold">Who we are</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              AIAS is a consultancy focused on discovery, constraint mapping,
              and governance clarity for AI-enabled operations. We are
              Canada-based and work remotely with distributed teams.
            </p>
          </SurfaceCard>
          <SurfaceCard>
            <h2 className="text-2xl font-bold">Is this for you?</h2>
            <div className="mt-3 grid gap-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">A fit:</span>{" "}
                teams with high-impact workflows, real governance requirements,
                and willingness to redesign decision boundaries.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Not a fit:
                </span>{" "}
                teams seeking one-click AI shortcuts without ownership,
                controls, or operational change.
              </p>
            </div>
          </SurfaceCard>
        </div>
      </PageSection>

      <PageSection background="muted">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Governance-first",
              description:
                "Controls and escalation paths are defined before volume increases.",
            },
            {
              icon: Users,
              title: "Human-in-the-loop",
              description:
                "Operators keep oversight at high-risk and low-confidence decision points.",
            },
            {
              icon: MapPin,
              title: "Operator enablement",
              description:
                "Runbooks and training are included so adoption is sustainable.",
            },
          ].map((item) => (
            <SurfaceCard key={item.title} className="p-6">
              <item.icon className="h-6 w-6 text-primary" />
              <h2 className="mt-4 text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.description}
              </p>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageCta
        title="Want to assess fit before a larger rollout?"
        description="Start with a strategy call and we will identify the best first workflow for measurable impact."
        primary={{ label: "Book a strategy call", href: getPrimaryCtaHref() }}
        secondary={{ label: "Contact team", href: "/contact" }}
      />
    </>
  );
}

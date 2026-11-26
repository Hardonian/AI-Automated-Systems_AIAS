import type { Metadata } from "next";

import {
  PageCta,
  PageHero,
  PageSection,
  SurfaceCard,
} from "@/components/ui/section-primitives";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { siteContent } from "@/src/content/site";

export const metadata: Metadata = generateSEOMetadata({
  title: "Private AI Workflow Proof Sprint | AI Automated Systems",
  description:
    "Measure whether AI-assisted support triage saves labor without lowering quality. One workflow, human review, and a decision brief from a fixed-scope pilot.",
  canonical: "/p/workflow-proof-sprint",
});

const steps = [
  {
    title: "Agree on what counts as a good outcome",
    text: "Choose one support queue, establish the manual baseline, and agree with the process owner and reviewer on what makes a case pass or fail.",
  },
  {
    title: "Compare the same cases",
    text: "Measure triage and internal draft preparation with and without assistance on at least 20 eligible paired cases. Count doing the work, human review, and rework in both arms.",
  },
  {
    title: "Decide before rolling it out",
    text: "Get an offline scoring kit and a decision brief showing observed labor, quality failures, limits, and whether a limited rollout is worth reviewing. Faster work does not override a quality failure.",
  },
];

export default function WorkflowProofSprintPage() {
  const subject = encodeURIComponent("Workflow Proof Sprint — fit check");
  const body = encodeURIComponent(
    "Workflow name:\nApproximate monthly case volume:\nCan a process owner and reviewer participate?\n\nPlease do not include tickets, customer information, or credentials.",
  );
  const emailHref = `mailto:${siteContent.contact.email}?subject=${subject}&body=${body}`;

  return (
    <>
      <PageHero
        eyebrow="Private AI Workflow Proof Sprint"
        title="Find out whether AI gives your support team time back"
        description="Evaluate one repeatable support workflow before investing in a wider rollout. Compare AI-assisted triage and internal drafting with the way your team already works. We report the result even when it says stop."
      />

      <PageSection>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <SurfaceCard key={step.title}>
              <h2 className="text-xl font-semibold">{step.title}</h2>
              <p className="mt-3 text-muted-foreground">{step.text}</p>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection background="muted" width="narrow">
        <div className="space-y-6">
          <SurfaceCard>
            <h2 className="text-xl font-semibold">CAD $1,500 founding pilot</h2>
            <p className="mt-3 text-muted-foreground">
              One workweek after scope, access approval, and a usable sample are
              agreed. Includes a kickoff, measurement protocol, reviewer rubric,
              offline scoring kit, decision brief, and handoff call. Your team
              provides an accountable owner, a reviewer, and approved cases.
              Integration and implementation are not included. No performance
              guarantee or payment at inquiry.
            </p>
          </SurfaceCard>
          <SurfaceCard>
            <h2 className="text-xl font-semibold">Your team keeps control</h2>
            <p className="mt-3 text-muted-foreground">
              Keep case content and individual identities in your approved
              environment. Run the scorer on your machine and share only an
              approved aggregate brief. No employee scoring, automated replies,
              production changes, or transfer of ticket content to us.
            </p>
          </SurfaceCard>
        </div>
      </PageSection>

      <PageCta
        title="Is your workflow a fit?"
        description="Ask for a fit check with only the workflow name, approximate monthly volume, and reviewer availability. Do not send tickets, personal data, or credentials."
        primary={{ label: "Email a fit request", href: emailHref }}
        secondary={{ label: "Other contact options", href: "/contact" }}
      />
    </>
  );
}

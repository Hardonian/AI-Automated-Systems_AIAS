import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Workflow,
  Layers,
  Shield,
  Clock,
} from "lucide-react";

import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import {
  PageHero,
  PageSection,
  SurfaceCard,
} from "@/components/ui/section-primitives";
import { Button } from "@/components/ui/button";
import { getPrimaryCtaHref } from "@/src/content/site";

export const metadata: Metadata = generateSEOMetadata({
  title: "Workflow Builder | AI Automated Systems",
  description:
    "Design, build, and deploy deterministic AI workflows with governance, guardrails, and operational reliability.",
  canonical: "/workflows",
});

const workflowFeatures = [
  {
    icon: Zap,
    title: "Agentic Automation",
    description:
      "AI agents that handle triage, routing, and decision support with clear escalation paths.",
  },
  {
    icon: Workflow,
    title: "Visual Workflow Design",
    description:
      "Map complex business processes with intuitive drag-and-drop workflow builders.",
  },
  {
    icon: Layers,
    title: "Multi-Step Orchestration",
    description:
      "Chain together APIs, databases, and AI models into coherent operational sequences.",
  },
  {
    icon: Shield,
    title: "Governance & Guardrails",
    description:
      "Built-in policy enforcement, audit trails, and human-in-the-loop checkpoints.",
  },
  {
    icon: Clock,
    title: "Reliable Execution",
    description:
      "Deterministic execution with retry logic, error handling, and operational visibility.",
  },
  {
    icon: CheckCircle2,
    title: "Quick Wins First",
    description:
      "Identify and automate high-ROI workflows within days, not months.",
  },
];

const workflowTypes = [
  {
    title: "Customer Support Automation",
    description:
      "Intelligent ticket routing, sentiment analysis, and automated response drafting.",
    outcome: "Reduce response time by 60-80%",
  },
  {
    title: "Document Processing",
    description:
      "Extract, classify, and route documents with AI-powered OCR and NLP.",
    outcome: "Process 10x more documents with same staff",
  },
  {
    title: "Lead Qualification",
    description: "Automated scoring, enrichment, and routing of inbound leads.",
    outcome: "2x conversion rate improvement",
  },
  {
    title: "Operations Monitoring",
    description: "Real-time system health checks with predictive alerts.",
    outcome: "Prevent issues before they impact customers",
  },
];

export default function WorkflowsPage() {
  return (
    <>
      <PageHero
        eyebrow="Workflow Builder"
        title="Design workflows that run themselves"
        description="From idea to deployment: build deterministic AI workflows with built-in governance, reliability, and operational visibility."
      />

      <PageSection>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workflowFeatures.map((feature) => (
            <SurfaceCard
              key={feature.title}
              className="p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              <feature.icon
                className="h-8 w-8 text-primary mb-4"
                aria-hidden="true"
              />
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection background="muted">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold">Common workflow patterns</h2>
          <p className="mt-4 text-muted-foreground">
            Proven automation patterns we have delivered across industries.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {workflowTypes.map((type) => (
            <SurfaceCard
              key={type.title}
              className="p-6 transition-all duration-300 hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold">{type.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {type.description}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                {type.outcome}
              </div>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection width="narrow">
        <SurfaceCard className="text-center p-8">
          <h2 className="text-2xl font-bold">
            Ready to automate your first workflow?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Schedule a free 30-minute discovery call. We will map your current
            process, identify quick wins, and recommend the right automation
            approach.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="transition-transform duration-200 hover:scale-105"
            >
              <a href={getPrimaryCtaHref()}>
                Book free discovery call
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="transition-all duration-200 hover:bg-muted"
            >
              <Link href="/case-studies">View case studies</Link>
            </Button>
          </div>
        </SurfaceCard>
      </PageSection>
    </>
  );
}

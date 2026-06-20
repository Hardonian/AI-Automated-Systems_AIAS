export interface RouteManifestEntry {
  path: string;
  title: string;
  description: string;
  canonical: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly";
  indexable?: boolean;
}

export const ROUTE_MANIFEST: RouteManifestEntry[] = [
  {
    path: "/",
    title: "AI Automated Systems | AI Systems That Ship — And Stay Running",
    description:
      "AIAS designs and operationalizes deterministic, static-first automation systems that blend controlled AI assistance with measurable business outcomes.",
    canonical: "/",
    priority: 1,
    changeFrequency: "weekly",
  },
  {
    path: "/about",
    title: "About | AI Automated Systems",
    description:
      "Learn about AIAS - a Canadian consultancy building enterprise-grade agentic automation systems.",
    canonical: "/about",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/approach",
    title: "Approach | AI Automated Systems",
    description:
      "How AIAS runs discovery, workflow design, deterministic implementation, and ongoing optimization for automation engagements.",
    canonical: "/approach",
    priority: 0.85,
    changeFrequency: "weekly",
  },
  {
    path: "/automation-demo",
    title: "Automation Demo | AI Automated Systems",
    description:
      "Safe static demo of intake classification, system execution flow, and governance checkpoints.",
    canonical: "/automation-demo",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/blog",
    title: "Blog — Systems Thinking + AI | Daily Articles | AIAS Platform",
    description:
      "Daily articles on systems thinking, AI automation, and business success. RSS feed of AI and tech news analyzed through systems thinking. AI-moderated comments for quality discussions.",
    canonical: "/blog",
    priority: 0.8,
    changeFrequency: "daily",
  },
  {
    path: "/blueprints",
    title: "Blueprint Library | AI Automated Systems",
    description:
      "Open implementation blueprints for governance, deterministic workflows, and execution fabric design.",
    canonical: "/blueprints",
    priority: 0.75,
    changeFrequency: "weekly",
  },
  {
    path: "/book",
    title: "Book a Call | AI Automated Systems",
    description:
      "Schedule a free 30-minute strategy call to discuss your automation needs and explore how we can help.",
    canonical: "/book",
    priority: 0.8,
    changeFrequency: "weekly",
  },
  {
    path: "/build-log",
    title: "Build Log | AI Automated Systems",
    description:
      "Public weekly transparency ledger of shipped changes, fixes, experiments, and lessons.",
    canonical: "/build-log",
    priority: 0.75,
    changeFrequency: "weekly",
  },
  {
    path: "/case-studies",
    title: "AI Automation Case Studies — Real Outcomes, Real Workflows | AIAS",
    description:
      "Implementation proof with metrics, before/after patterns, and governance maturity progression for AI control-plane programs.",
    canonical: "/case-studies",
    priority: 0.8,
    changeFrequency: "weekly",
  },
  {
    path: "/certification",
    title: "Certification Path | AI Automated Systems",
    description:
      "Open-source certification path for deterministic AI operations with exercises and badge criteria.",
    canonical: "/certification",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/contact",
    title: "Book a Free AI Automation Diagnostic Call | AIAS",
    description:
      "Book a diagnostic, request an architecture review, or submit your AI stack intake for governance-first implementation planning.",
    canonical: "/contact",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/diagnostic",
    title: "Diagnostic Engagement | AI Automated Systems",
    description:
      "What happens during an AIAS diagnostic, what your team receives, and how the engagement de-risks implementation decisions.",
    canonical: "/diagnostic",
    priority: 0.8,
    changeFrequency: "weekly",
  },
  {
    path: "/docs",
    title: "Documentation | AI Automated Systems",
    description:
      "Guides, references, and resources for building and operating AI-powered automation systems.",
    canonical: "/docs",
    priority: 0.55,
    changeFrequency: "monthly",
  },
  {
    path: "/ecosystem",
    title: "Ecosystem Architecture | AI Automated Systems",
    description:
      "AIAS ecosystem architecture connecting advisory, Reach, Zeo, and Settler with deterministic governance and deployment models.",
    canonical: "/ecosystem",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/engagement-simulator",
    title: "Engagement Simulator | AI Automated Systems",
    description:
      "Self-serve walkthrough to generate a deterministic AIAS engagement brief.",
    canonical: "/engagement-simulator",
    priority: 0.75,
    changeFrequency: "weekly",
  },
  {
    path: "/faq",
    title: "AI Automation FAQ — Pricing, Process, Security | AIAS",
    description:
      "Frequently asked questions about AIAS consulting engagements, delivery model, pricing, and onboarding.",
    canonical: "/faq",
    priority: 0.75,
    changeFrequency: "weekly",
  },
  {
    path: "/framework",
    title: "AIAS Diagnostic Framework | AI Automated Systems",
    description:
      "The AIAS five-step diagnostic framework used to map decisions, constraints, failure modes, and architecture tradeoffs before implementation.",
    canonical: "/framework",
    priority: 0.8,
    changeFrequency: "weekly",
  },
  {
    path: "/how-it-works",
    title: "How Our AI Automation Delivery Model Works | AIAS",
    description:
      "System transparency page covering tooling stack, governance, security, and deployment models.",
    canonical: "/how-it-works",
    priority: 0.85,
    changeFrequency: "weekly",
  },
  {
    path: "/methodology",
    title: "Methodology | AI Automated Systems",
    description:
      "Technical methodology for deterministic AI execution, governance, and deployment models.",
    canonical: "/methodology",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/metrics",
    title: "Automation Metrics | AI Automated Systems",
    description:
      "Automation benchmark metrics for latency, conversion, reliability, and governance coverage.",
    canonical: "/metrics",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/operator",
    title: "Operator Console | AI Automated Systems",
    description:
      "Internal operator console for lead intake, stage tracking, risk score management, and notes.",
    canonical: "/operator",
    priority: 0.65,
    changeFrequency: "monthly",
  },
  {
    path: "/operator-demo",
    title: "Operator Demo | AI Automated Systems",
    description:
      "Sanitized public demo of the AIAS operator console using mock pipeline data.",
    canonical: "/operator-demo",
    priority: 0.55,
    changeFrequency: "monthly",
  },
  {
    path: "/point-of-view",
    title: "What We Believe About AI Systems | AI Automated Systems",
    description:
      "The AIAS point of view on discovery-first AI execution, governance design, and reliability tradeoffs for consultancy engagements.",
    canonical: "/point-of-view",
    priority: 0.75,
    changeFrequency: "monthly",
  },
  {
    path: "/pricing",
    title:
      "AI Automation Consulting Pricing — Transparent Engagement Models | AIAS",
    description:
      "Clear monetization structure for AIAS: Audit, Implementation, and Ongoing Governance with range-based pricing philosophy and ROI framing.",
    canonical: "/pricing",
    priority: 0.8,
    changeFrequency: "weekly",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | AI Automated Systems",
    description:
      "Learn how AI Automated Systems collects, uses, and safeguards data for consulting engagements and website visitors.",
    canonical: "/privacy",
    priority: 0.3,
    changeFrequency: "monthly",
  },
  {
    path: "/process",
    title: "Process | AI Automated Systems",
    description:
      "Our proven methodology for delivering agentic automation: Discover, Map, Automate, Ship, Monitor.",
    canonical: "/process",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/readiness-checklist",
    title: "AI Governance Readiness Checklist | AI Automated Systems",
    description:
      "Download and score the AI Governance Readiness Checklist, then optionally share your stack context for architecture feedback.",
    canonical: "/readiness-checklist",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/roi-calculator",
    title: "ROI Calculator | AI Automated Systems",
    description:
      "Estimate annual time and cost savings from deterministic workflow automation.",
    canonical: "/roi-calculator",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/services",
    title: "AI Automation Consulting Services — Audit, Build, Govern | AIAS",
    description:
      "Explore AIAS consultancy services for agent architecture, workflow automation, and enterprise-grade implementation.",
    canonical: "/services",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  {
    path: "/services/app-ai-systems",
    title: "App + AI Systems | AI Automated Systems",
    description:
      "Deterministic app orchestration and AI advisory layers with enterprise governance controls.",
    canonical: "/services/app-ai-systems",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/services/automation-web",
    title: "Automation Web Systems | AI Automated Systems",
    description:
      "Static-first website automation architecture with governed intake, conversion routing, and performance-first delivery.",
    canonical: "/services/automation-web",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/survey",
    title: "Survey | AI Automated Systems",
    description:
      "Share your automation challenges and requirements so AIAS can scope a practical, tailored engagement.",
    canonical: "/survey",
    priority: 0.55,
    changeFrequency: "monthly",
  },
  {
    path: "/terms",
    title: "Terms of Service | AI Automated Systems",
    description:
      "Review the terms that govern AI Automated Systems consulting engagements and deliverables.",
    canonical: "/terms",
    priority: 0.3,
    changeFrequency: "monthly",
  },
  {
    path: "/what-aias-does",
    title: "What AIAS Actually Does | AI Automated Systems",
    description:
      "Concrete AIAS capability map and engagement formats for deterministic AI governance, control-plane architecture, evaluation integrity, and enterprise-safe operations.",
    canonical: "/what-aias-does",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  {
    path: "/what-we-measure",
    title: "What We Measure | AI Automated Systems",
    description:
      "How AIAS measures reliability, evaluation integrity, and cost discipline for governed AI systems.",
    canonical: "/what-we-measure",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/why-we-say-no",
    title: "Why We Say No | AI Automated Systems",
    description:
      "Our criteria for declining work, avoiding AI misuse, and recommending in-house execution when appropriate.",
    canonical: "/why-we-say-no",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/work",
    title: "Work | AI Automated Systems",
    description:
      "Explore our portfolio of successful automation engagements and client outcomes.",
    canonical: "/work",
    priority: 0.8,
    changeFrequency: "weekly",
  },
  {
    path: "/workflows",
    title: "Workflow Builder | AI Automated Systems",
    description:
      "Design, build, and deploy deterministic AI workflows with governance, guardrails, and operational reliability.",
    canonical: "/workflows",
    priority: 0.7,
    changeFrequency: "weekly",
  },
  {
    path: "/dashboard",
    title: "Dashboard | AI Automated Systems",
    description: "Protected workspace entry for client and team operations.",
    canonical: "/dashboard",
    priority: 0.1,
    changeFrequency: "monthly",
    indexable: false,
  },
];

export const INDEXABLE_ROUTE_MANIFEST = ROUTE_MANIFEST.filter(
  (route) => route.indexable !== false,
);

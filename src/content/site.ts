import { z } from "zod";

import { MESSAGING_CONTRACT } from "@/content/constants";

export interface TriadPillar {
  id: "tools" | "consultancy" | "catalog";
  title: string;
  badge: string;
  tagline: string;
  description: string;
  highlights: string[];
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  iconName: string;
  accentColor: string;
  stats: { label: string; value: string };
}

export interface QuickToolItem {
  id: string;
  title: string;
  category:
    | "Simulators"
    | "Calculators"
    | "Diagnostics"
    | "Builders"
    | "Studios";
  badge: string;
  description: string;
  outcome: string;
  estimatedTime: string;
  inputs: string[];
  outputs: string[];
  href: string;
  iconName: string;
  featured?: boolean;
}

export interface ConsultancyTrack {
  id: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  timeline: string;
  description: string;
  idealFor: string[];
  deliverables: string[];
  slaGuarantees: string[];
  architectureFocus: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface CatalogProduct {
  id: string;
  title: string;
  subtitle: string;
  category:
    | "Software Engines"
    | "Turnkey Workflows"
    | "Governance Kits"
    | "UI Kits"
    | "Starter Blueprints";
  badge: string;
  license: "Commercial" | "Open Source" | "Enterprise License";
  description: string;
  techStack: string[];
  keyFeatures: string[];
  architectureSummary: string;
  includedArtifacts: string[];
  liveDemoHref?: string;
  storeHref: string;
  featured?: boolean;
}

export interface SiteConfig {
  brand: {
    name: string;
    tagline: string;
    description: string;
  };
  navigation: {
    primary: Array<{
      label: string;
      href: string;
    }>;
    resources: Array<{
      label: string;
      href: string;
    }>;
  };
  positioning: {
    subheading: string;
    badgeText: string;
    impactCardsLabel: string;
    primaryCTA: {
      label: string;
      href: string;
    }; // Consult/Sales
    secondaryCTA: {
      label: string;
      href: string;
    }; // Demo/Sandbox
    socialProof: Array<{
      icon: string;
      text: string;
    }>;
    trustBadges: Array<{
      icon: string;
      text: string;
    }>;
  };
  contact: {
    email: string;
    responseTime: string;
  };
  triadPillars: TriadPillar[];
  quickTools: QuickToolItem[];
  consultancyTracks: ConsultancyTrack[];
  catalogProducts: CatalogProduct[];
  services: Array<{
    title: string;
    description: string;
    outcome: string;
    deliverables: string[];
    icon: string;
  }>;
  process: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  agenticWorkflow: {
    heroImage: string; // Path to image or placeholder
    steps: Array<{
      title: string;
      description: string;
      inputs: string[];
      outputs: string[];
    }>;
  };
  workflowSandbox: {
    title: string;
    description: string;
    ctaLabel: string;
    inputForm: {
      title: string;
      fields: Array<{
        id: string;
        label: string;
        type: "select" | "textarea" | "text";
        options?: string[];
      }>;
      submitLabel: string;
    };
    output: {
      title: string;
      markdownTemplate: string;
      checklistTemplate: string;
      artifactJsonTemplate: string;
    };
  };
  secretSauce: {
    title: string;
    description: string;
    pillars: Array<{
      title: string;
      description: string;
      highlights: string[];
    }>;
  };
  optimizationHotspots: {
    title: string;
    description: string;
    areas: Array<{
      title: string;
      impact: string;
      improvements: string[];
    }>;
  };
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
    company: string;
  }>;
  caseStudies: Array<{
    title: string;
    client: string;
    challenge: string;
    solution: string;
    results: string[];
    projectUrl: string;
    logoSrc: string;
    thumbnailSrc: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  routeFaqs: {
    ecosystem: Array<{ question: string; answer: string }>;
    services: Array<{ question: string; answer: string }>;
    automationWeb: Array<{ question: string; answer: string }>;
    appAiSystems: Array<{ question: string; answer: string }>;
  };
  servicesPage: {
    hero: {
      eyebrow: string;
      title: string;
      description: string;
    };
    engagementInclusions: {
      title: string;
      items: string[];
      processLinkLabel: string;
      processLinkHref: string;
    };
    workflowView: {
      title: string;
      description: string;
    };
    cta: {
      title: string;
      description: string;
      primaryLabel: string;
      secondaryLabel: string;
      secondaryHref: string;
    };
  };
  ecosystemPage: {
    hero: {
      eyebrow: string;
      title: string;
      description: string;
    };
    diagram: {
      title: string;
      nodes: string[];
    };
    lifecycle: string[];
    narrative: {
      determinismVsIntelligence: {
        title: string;
        body: string;
      };
      deploymentModels: {
        title: string;
        items: string[];
      };
      governancePrinciples: {
        title: string;
        items: string[];
      };
    };
  };
  metricsPage: {
    hero: {
      eyebrow: string;
      title: string;
      description: string;
    };
    statGroups: Array<{
      category: string;
      period: string;
      metrics: Array<{
        label: string;
        value: string;
        delta: string;
        note: string;
      }>;
    }>;
    efficiencyComparisons: Array<{
      workflow: string;
      before: string;
      after: string;
      impact: string;
    }>;
  };
  roiCalculatorPage: {
    hero: {
      eyebrow: string;
      title: string;
      description: string;
    };
    assumptions: string[];
  };
  howItWorksPage: {
    hero: {
      eyebrow: string;
      title: string;
      description: string;
    };
    sections: Array<{
      title: string;
      description: string;
      bullets: string[];
    }>;
    boundaryModel: Array<{
      layer: string;
      deterministicBoundary: string;
      aiBoundary: string;
    }>;
  };
  socials: {
    twitter: string;
    linkedin: string;
    github?: string;
  };
  footer: {
    tagline: string;
    copyright: string;
    legalLinks: Array<{ label: string; href: string }>;
  };
  legal: {
    privacy: {
      title: string;
      lastUpdated: string;
      sections: Array<{
        heading: string;
        body: string;
      }>;
    };
    terms: {
      title: string;
      lastUpdated: string;
      sections: Array<{
        heading: string;
        body: string;
      }>;
    };
  };
}

const rawSiteContent: SiteConfig = {
  brand: {
    name: "AIAS",
    tagline: MESSAGING_CONTRACT.primaryTagline,
    description: MESSAGING_CONTRACT.positioningSentence,
  },
  positioning: {
    subheading: MESSAGING_CONTRACT.heroSubheading,
    badgeText: "Production AI Workflows",
    impactCardsLabel: "Measured outcomes",
    primaryCTA: {
      label: "Book Free Diagnostic",
      href: "https://calendly.com/scottrmhardie",
    },
    secondaryCTA: {
      label: "See How It Works",
      href: "/how-it-works",
    },
    socialProof: [
      { icon: "zap", text: "78% faster lead triage across client cohorts" },
      { icon: "shield", text: "99.2% workflow success rate in production" },
      { icon: "clock", text: "2–4 week Discover-to-Pilot cycle" },
      { icon: "check", text: "Zero uncontrolled high-impact actions shipped" },
    ],
    trustBadges: [
      { icon: "shield", text: "SOC 2-aligned controls" },
      { icon: "globe", text: "Canada-based, globally delivered" },
      { icon: "check", text: "PIPEDA-informed data handling" },
    ],
  },
  navigation: {
    primary: [
      { label: "Services", href: "/services" },
      { label: "Hire Us", href: "/hire" },
      { label: "Quick Tools", href: "/tools" },
      { label: "Product Catalog", href: "/catalog" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    resources: [
      { label: "Quick Tools Hub", href: "/tools" },
      { label: "Policy Studio", href: "/tools/policy-studio" },
      { label: "Hardonia Store & Catalog", href: "/catalog" },
      { label: "Hire to Build", href: "/hire" },
      { label: "ROI Calculator", href: "/roi-calculator" },
      { label: "Readiness Scorecard", href: "/readiness-checklist" },
      { label: "Automation Simulator", href: "/automation-demo" },
      { label: "Blueprint Library", href: "/blueprints" },
      { label: "Systems Framework", href: "/framework" },
      { label: "Build Log", href: "/build-log" },
      { label: "About AIAS", href: "/about" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  contact: {
    email: "inquiries@aiautomatedsystems.ca",
    responseTime: "Replies within 1 business day.",
  },
  triadPillars: [
    {
      id: "tools",
      title: "Interactive Quick Tools",
      badge: "Prong 01 // Instant & Self-Serve",
      tagline: "Simulate, Calculate & Audit in Your Browser",
      description:
        "Run our client-side diagnostics, ROI calculators, deterministic workflow planners, and policy studios with zero setup.",
      highlights: [
        "Deterministic Workflow Simulator",
        "Automation ROI & Labor Savings Modeler",
        "Governance & Readiness Scorecard",
        "Policy & Guardrail Rule Studio",
      ],
      ctaLabel: "Explore Quick Tools",
      ctaHref: "/tools",
      secondaryLabel: "Try Policy Studio",
      secondaryHref: "/tools/policy-studio",
      iconName: "Wrench",
      accentColor: "text-amber-500 border-amber-500",
      stats: { label: "Self-Serve Utilities", value: "7 Active Tools" },
    },
    {
      id: "consultancy",
      title: "Hire AIAS to Build & Automate",
      badge: "Prong 02 // Enterprise Engineering",
      tagline: "Custom Architecture, Flaky AI Fixes & Modernization",
      description:
        "Hire our systems architects to map, build, stabilize, and govern enterprise-grade automation pipelines tailored to your operations.",
      highlights: [
        "AI Clarity Audits & Boundary Scoping",
        "Stabilization Sprints for Flaky Agents",
        "End-to-End Bespoke System Engineering",
        "Full Runbook & Operator Enablement Handoff",
      ],
      ctaLabel: "Hire Us to Build",
      ctaHref: "/hire",
      secondaryLabel: "Book Strategy Call",
      secondaryHref: "https://calendly.com/scottrmhardie",
      iconName: "Cpu",
      accentColor: "text-primary border-primary",
      stats: { label: "Production Success Rate", value: "99.2% Uptime" },
    },
    {
      id: "catalog",
      title: "Hardonia Store & Product Catalog",
      badge: "Prong 03 // Turnkey Software & Ecosystem",
      tagline: "Pre-Built Modules, Automation Packs & Starter Kits",
      description:
        "Browse our tested repository of deployable workflow packages, deterministic policy kits, and Hardonia ecosystem software.",
      highlights: [
        "Hardonia Suite Client Operations Fabric",
        "Settler Deployment & Rollback Fabric",
        "Deterministic Zod Guardrail Kits",
        "Turnkey Intake & Ingestion Engines",
      ],
      ctaLabel: "Browse Product Catalog",
      ctaHref: "/catalog",
      secondaryLabel: "Visit Hardonia Store",
      secondaryHref: "https://store.hardonia.com",
      iconName: "ShoppingBag",
      accentColor: "text-cyan-500 border-cyan-500",
      stats: { label: "Deployable Modules", value: "8 Ready Packs" },
    },
  ],
  quickTools: [
    {
      id: "policy-studio",
      title: "Policy & Guardrail Studio",
      category: "Studios",
      badge: "NEW // Interactive",
      description:
        "Test deterministic boundary rules, PII filters, and confidence escalation thresholds against live AI prompts.",
      outcome:
        "Validated JSON/TypeScript policy schema ready to drop into production.",
      estimatedTime: "2 mins",
      inputs: ["System Prompt", "Schema Rules", "Confidence Threshold"],
      outputs: ["Violation Interceptions", "Exportable Policy Zod Schema"],
      href: "/tools/policy-studio",
      iconName: "ShieldAlert",
      featured: true,
    },
    {
      id: "roi-calculator",
      title: "Automation ROI Calculator",
      category: "Calculators",
      badge: "Core Utility",
      description:
        "Model annual labor hours eliminated, net cost reductions, and break-even timelines based on your team size and volume.",
      outcome:
        "Auditable annual savings estimate and resource allocation breakdown.",
      estimatedTime: "3 mins",
      inputs: ["Team Size", "Manual Hours/Wk", "Baseline Burden Rate"],
      outputs: ["Annual Savings ($)", "Hours Saved/Yr", "Break-even Month"],
      href: "/roi-calculator",
      iconName: "Calculator",
      featured: true,
    },
    {
      id: "automation-demo",
      title: "Workflow Execution Simulator",
      category: "Simulators",
      badge: "Live Engine",
      description:
        "Simulate high-throughput invoice processing, lead triage, and exception routing across deterministic control layers.",
      outcome: "Step-by-step state transition graph and telemetry trace.",
      estimatedTime: "1 min",
      inputs: ["Payload Type", "Failure Probability", "Latency SLA"],
      outputs: ["Execution Trace", "Audit Log", "Telemetry Graph"],
      href: "/automation-demo",
      iconName: "Workflow",
      featured: true,
    },
    {
      id: "readiness-checklist",
      title: "AI Governance Readiness Scorecard",
      category: "Diagnostics",
      badge: "Self-Audit",
      description:
        "Evaluate your system maturity across 16 critical dimensions of error recovery, data privacy, and deterministic boundaries.",
      outcome:
        "Composite readiness grade (A-F) with prioritized gap remediation roadmap.",
      estimatedTime: "4 mins",
      inputs: ["16 Governance Checkpoints"],
      outputs: ["Maturity Score", "Risk Heatmap", "Action Checklist"],
      href: "/readiness-checklist",
      iconName: "CheckCircle2",
      featured: true,
    },
    {
      id: "engagement-simulator",
      title: "Scope & Architecture Estimator",
      category: "Simulators",
      badge: "Interactive Scoper",
      description:
        "Walk through an interactive scoping flow to determine the ideal engagement shape, timeline, and deliverable suite.",
      outcome:
        "Customized engagement specification brief ready for architectural review.",
      estimatedTime: "2 mins",
      inputs: ["Business Domain", "Current Tech Stack", "Autonomy Tier"],
      outputs: ["Architecture Map", "Deliverable Breakdown", "Timeline Scope"],
      href: "/engagement-simulator",
      iconName: "Sliders",
    },
    {
      id: "workflows",
      title: "Deterministic Workflow Builder",
      category: "Builders",
      badge: "Blueprint Engine",
      description:
        "Visually assemble agentic pipelines with policy gates, human checkpoints, and fallback routing nodes.",
      outcome: "Replayable DAG diagram and schema definition.",
      estimatedTime: "3 mins",
      inputs: ["Triggers", "Action Nodes", "Approval Gates"],
      outputs: ["Interactive DAG", "Pipeline JSON Spec"],
      href: "/workflows",
      iconName: "GitBranch",
    },
    {
      id: "blueprints",
      title: "Architecture Blueprint Explorer",
      category: "Builders",
      badge: "Reference Specs",
      description:
        "Browse production-grade architecture blueprints for high-throughput triage, ERP synchronization, and document ingestion.",
      outcome: "Reference implementation diagrams and security topology.",
      estimatedTime: "5 mins",
      inputs: ["Architecture Category"],
      outputs: ["System Diagram", "Sequence Specs", "Failure Matrix"],
      href: "/blueprints",
      iconName: "FileCode",
    },
  ],
  consultancyTracks: [
    {
      id: "clarity-audit",
      title: "AI Clarity Audit & Decision Mapping",
      eyebrow: "Track 01 // Discovery & Architecture",
      subtitle:
        "Map your decision surfaces before spending on custom development",
      timeline: "1 to 2 weeks",
      description:
        "We analyze your workflows, identify high-ROI automation targets, uncover hidden edge-case risks, and establish strict decision boundaries.",
      idealFor: [
        "Teams wanting to automate manual operations without wasting budget on hype",
        "Companies with complex multi-system handoffs (CRM, ERP, Billing, Support)",
        "Leaders who need clear build-vs-kill recommendations before greenlighting projects",
      ],
      deliverables: [
        "Decision Surface Map & Boundary Specifications",
        "Constraint & Failure Mode Risk Matrix",
        "System Architecture Blueprint with Schema Contracts",
        "Prioritized Implementation Brief & ROI Projection",
      ],
      slaGuarantees: [
        "100% Deterministic boundary definitions",
        "Zero vendor lock-in; open-standard architectural artifacts",
        "Executive & technical stakeholder sign-off alignment",
      ],
      architectureFocus:
        "Decision boundary identification, failure mode mapping, and constraint registries.",
      ctaLabel: "Book Clarity Audit Call",
      ctaHref: "https://calendly.com/scottrmhardie",
    },
    {
      id: "stabilization-sprint",
      title: "Stabilization & Hardening Sprint",
      eyebrow: "Track 02 // Reliability & Remediation",
      subtitle:
        "Transform flaky, hallucination-prone AI prototypes into robust production systems",
      timeline: "2 to 3 weeks",
      description:
        "If your existing AI workflows crash, fail silently, or produce unreliable outputs, we harden them with deterministic policy layers, retry logic, and exception escalation.",
      idealFor: [
        "Teams with existing AI automations that suffer from silent failures",
        "Workflows where hallucinations cause operational or financial risks",
        "Companies needing structured telemetry, alerting, and incident recovery runbooks",
      ],
      deliverables: [
        "Failure Triage & Edge-Case Root Cause Analysis",
        "Deterministic Control Layer & Zod Validation Gates",
        "Automated Retry & Human-in-the-Loop Fallback Paths",
        "Operational Runbooks & Incident Playbooks for Ops Teams",
      ],
      slaGuarantees: [
        "99%+ Workflow execution reliability target",
        "Zero unintercepted high-impact error transitions",
        "Replayable audit trails for all operations",
      ],
      architectureFocus:
        "Input schema validation, deterministic retry budgets, and human-in-the-loop exception routing.",
      ctaLabel: "Schedule Stabilization Review",
      ctaHref: "https://calendly.com/scottrmhardie",
    },
    {
      id: "custom-build",
      title: "Full-Stack Deterministic Automation Build",
      eyebrow: "Track 03 // Turnkey Engineering",
      subtitle:
        "End-to-end bespoke system engineering tailored to your exact business rules",
      timeline: "4 to 8 weeks",
      description:
        "Our senior systems architects design, build, test, and deploy customized automation pipelines embedded directly into your tech stack with enterprise governance.",
      idealFor: [
        "Enterprises needing custom intelligent workflows with zero off-the-shelf fit",
        "High-volume operations (e-commerce fulfillment, financial reconciliation, intake triage)",
        "Teams wanting turnkey delivery with complete source code ownership",
      ],
      deliverables: [
        "Custom Orchestration Fabric & AI Agent Modules",
        "Secure API Connectors to Internal ERP/CRM/Databases",
        "Operator Console & Exception Management Dashboard",
        "Automated CI/CD Test Suites & Verification Pipelines",
        "Hands-on Operator Enablement Sessions & Complete Documentation",
      ],
      slaGuarantees: [
        "100% Code & IP ownership transferred to your organization",
        "Policy-before-execution guarantees on all state transitions",
        "Full test suite coverage for automated regression prevention",
      ],
      architectureFocus:
        "Modular agent orchestration, deterministic state machines, and private connector infrastructure.",
      ctaLabel: "Scope a Custom Build",
      ctaHref: "https://calendly.com/scottrmhardie",
    },
    {
      id: "strategic-governance",
      title: "Strategic Advantage & Continuous Governance",
      eyebrow: "Track 04 // Embedded Advisory",
      subtitle:
        "Ongoing architectural guidance, model portfolio optimization, and system evolution",
      timeline: "Quarterly Partnership",
      description:
        "Act as your dedicated Fractional Chief Automation Architect. We continually review telemetry, benchmark new models, prevent architectural drift, and expand capabilities.",
      idealFor: [
        "Scaling organizations expanding AI across multiple operational departments",
        "Companies requiring ongoing compliance, security, and performance audits",
        "Leadership teams seeking strategic alignment on emerging AI capabilities",
      ],
      deliverables: [
        "Quarterly Architecture & Governance Reviews",
        "Model Portfolio Benchmarking & Cost-Performance Optimization",
        "Security & Data Handling Compliance Verification",
        "Quarterly Executive Briefings & Systems Roadmap Updates",
      ],
      slaGuarantees: [
        "Continuous architectural drift prevention",
        "Priority incident escalation advisory",
        "Proactive technology radar updates",
      ],
      architectureFocus:
        "Model portfolio governance, enterprise policy evolution, and cross-department automation alignment.",
      ctaLabel: "Discuss Advisory Partnership",
      ctaHref: "https://calendly.com/scottrmhardie",
    },
  ],
  catalogProducts: [
    {
      id: "hardonia-suite-ops",
      title: "Hardonia Suite Client Operations Fabric",
      subtitle:
        "Multi-channel e-commerce automation, inventory sync & reconciliation engine",
      category: "Software Engines",
      badge: "Flagship System",
      license: "Commercial",
      description:
        "Complete operational backbone connecting multi-channel storefronts, warehouse inventory feeds, order triage, and automated supplier routing with deterministic reconciliation.",
      techStack: [
        "TypeScript",
        "Next.js",
        "PostgreSQL / Supabase",
        "Zod",
        "Tailwind CSS",
      ],
      keyFeatures: [
        "Real-time multi-channel inventory synchronization",
        "Deterministic order classification and fraud rule evaluation",
        "Automated supplier purchase order generation with human approvals",
        "Comprehensive exception management dashboard with telemetry",
      ],
      architectureSummary:
        "Decoupled event-driven architecture with deterministic policy gates on stock allocation and supplier dispatch.",
      includedArtifacts: [
        "Full Source Repository",
        "Deployment Dockerfiles",
        "Architecture Blueprints",
        "Operator Runbooks",
      ],
      liveDemoHref: "/dashboard",
      storeHref: "https://store.hardonia.com/products/hardonia-suite-ops",
      featured: true,
    },
    {
      id: "settler-deployment-fabric",
      title: "Settler Deployment & Rollback Fabric",
      subtitle:
        "Deterministic release orchestrator with automated policy verification and health gating",
      category: "Software Engines",
      badge: "Ecosystem Partner",
      license: "Commercial",
      description:
        "Production deployment control plane built for static-first and edge-native applications. Enforces verification suites, schema integrity, and zero-downtime rollback triggers.",
      techStack: [
        "Node.js",
        "TypeScript",
        "Docker",
        "GitHub Actions",
        "Vercel / Cloudflare",
      ],
      keyFeatures: [
        "Automated pre-flight verification test suite execution",
        "Canary health telemetry with deterministic rollback triggers",
        "Environment variable validation and secret isolation",
        "Audit-ready changelog generation and deployment receipts",
      ],
      architectureSummary:
        "Stateful release orchestrator enforcing CI/CD gates and health probe telemetry before traffic routing.",
      includedArtifacts: [
        "CLI Tooling",
        "CI/CD Workflows",
        "Configuration Schemas",
        "Documentation",
      ],
      liveDemoHref: "/how-it-works",
      storeHref: "https://store.hardonia.com/products/settler-fabric",
      featured: true,
    },
    {
      id: "zeo-ingestion-engine",
      title: "Zeo High-Throughput Ingestion & ETL Engine",
      subtitle:
        "Unstructured document parser, schema normalizer and verified data pipeline",
      category: "Turnkey Workflows",
      badge: "High Throughput",
      license: "Commercial",
      description:
        "Transforms messy incoming invoices, shipping manifests, and PDF contracts into validated, strictly typed JSON records with human escalation on low-confidence extractions.",
      techStack: ["Python", "TypeScript", "Zod", "OCR Engine", "FastAPI"],
      keyFeatures: [
        "Multi-format ingestion (PDF, scan images, CSV, webhook streams)",
        "Deterministic schema extraction with strict Zod validation",
        "Confidence scoring with automatic routing to operator review queue",
        "Export connectors for ERPs, CRMs, and SQL data warehouses",
      ],
      architectureSummary:
        "Dual-phase pipeline: AI extraction followed by strict deterministic schema validation and policy gating.",
      includedArtifacts: [
        "FastAPI Service Code",
        "Schema Definitions",
        "Test Fixtures",
        "Integration Guides",
      ],
      liveDemoHref: "/automation-demo",
      storeHref: "https://store.hardonia.com/products/zeo-engine",
      featured: true,
    },
    {
      id: "reach-demand-accelerator",
      title: "Reach Demand Qualification & Intent Triage",
      subtitle:
        "Inbound lead enrichment, buying intent scoring, and deterministic routing system",
      category: "Turnkey Workflows",
      badge: "Conversion Booster",
      license: "Commercial",
      description:
        "Eliminates manual lead sorting by enriching inbound submissions, classifying project intent, evaluating constraints, and routing to the optimal sales architect instantly.",
      techStack: ["TypeScript", "Next.js App Router", "Zod", "CRM Webhooks"],
      keyFeatures: [
        "45-second inbound intake classification and enrichment",
        "Deterministic qualification score based on organizational constraints",
        "Automated calendar routing with pre-populated strategy dossiers",
        "Full PIPEDA/GDPR-compliant data handling with zero lead leakage",
      ],
      architectureSummary:
        "Web-native intake controller with deterministic scoring matrix and real-time CRM webhook dispatch.",
      includedArtifacts: [
        "Next.js Component Suite",
        "Scoring Matrices",
        "Webhook Connectors",
        "Setup Guide",
      ],
      liveDemoHref: "/contact",
      storeHref: "https://store.hardonia.com/products/reach-accelerator",
    },
    {
      id: "tokpulse-growth-core",
      title: "TokPulse Social Commerce Growth Core",
      subtitle:
        "E-commerce social campaign analytics, trend detection & automated content intelligence",
      category: "Software Engines",
      badge: "E-Commerce Core",
      license: "Commercial",
      description:
        "Autonomous analytics engine designed for modern e-commerce brands scaling TikTok and multi-channel social storefronts with predictive inventory recommendations.",
      techStack: ["Python", "TypeScript", "Next.js", "FastAPI", "PostgreSQL"],
      keyFeatures: [
        "Trend velocity scoring and social product interest tracking",
        "Automated content performance attribution and SKU linkage",
        "Inventory replenishment recommendations based on viral signal spikes",
        "Brand-safe content generation and copy suggestions",
      ],
      architectureSummary:
        "Stream processing analytics engine linked to social commerce APIs with automated trend alerts.",
      includedArtifacts: [
        "Full Web App Source",
        "API Microservice",
        "Docker Compose Setup",
        "Documentation",
      ],
      liveDemoHref: "/work",
      storeHref: "https://store.hardonia.com/products/tokpulse-core",
    },
    {
      id: "policy-guardrail-kit",
      title: "Deterministic Policy & Zod Guardrail Kit",
      subtitle:
        "Reusable TypeScript & Zod boundary layer for reliable AI orchestration",
      category: "Governance Kits",
      badge: "Open / Pro Pack",
      license: "Open Source",
      description:
        "The core governance architecture used by AIAS across all client deployments. Enforces policy validation before execution, scrubs PII, and generates replayable audit records.",
      techStack: ["TypeScript", "Zod", "Vitest"],
      keyFeatures: [
        "Pre-built Zod schemas for system inputs, actions, and outputs",
        "PII scrubbers with regex and semantic masking",
        "Confidence score evaluation with human-in-the-loop triggers",
        "Structured audit trail generator compatible with SIEM / logging tools",
      ],
      architectureSummary:
        "Zero-dependency TypeScript module designed to wrap any LLM or automation pipeline with deterministic gates.",
      includedArtifacts: [
        "TypeScript NPM Package Source",
        "Unit Test Suite",
        "Integration Examples",
        "MIT License",
      ],
      liveDemoHref: "/tools/policy-studio",
      storeHref: "https://store.hardonia.com/products/policy-guardrail-kit",
      featured: true,
    },
    {
      id: "operator-console-kit",
      title: "Human-in-the-Loop Operator Console Kit",
      subtitle:
        "Lightweight triage, exception management, and review dashboard UI component library",
      category: "UI Kits",
      badge: "UI / UX Kit",
      license: "Commercial",
      description:
        "High-contrast neo-brutalist dashboard components for operators managing AI exceptions, pipeline approvals, risk score reviews, and lead qualification queues.",
      techStack: [
        "React 19",
        "Next.js",
        "Tailwind CSS",
        "Radix UI",
        "Framer Motion",
      ],
      keyFeatures: [
        "Queue triage view with one-click approve/reject/escalate actions",
        "JSON payload diff viewer with anomaly highlighting",
        "Operator audit trail and notes timeline component",
        "Full dark/light mode with keyboard shortcut navigation",
      ],
      architectureSummary:
        "Accessible React UI components built with Radix primitives and Tailwind CSS token architecture.",
      includedArtifacts: [
        "React Components",
        "Tailwind Theme Config",
        "Storybook Stories",
        "Figma Tokens",
      ],
      liveDemoHref: "/operator-demo",
      storeHref: "https://store.hardonia.com/products/operator-console-kit",
    },
    {
      id: "invoice-document-parser",
      title: "Autonomous Invoice & Financial Doc Parser",
      subtitle:
        "Pre-configured n8n & LangGraph workflow pack for accounts payable automation",
      category: "Turnkey Workflows",
      badge: "Workflow Pack",
      license: "Commercial",
      description:
        "End-to-end accounts payable automation workflow. Ingests PDF invoices from email, extracts line items with 99%+ accuracy, reconciles with PO numbers, and drafts approval batches.",
      techStack: ["n8n / LangGraph", "TypeScript", "Zod", "ERP Webhooks"],
      keyFeatures: [
        "Multi-currency line item and tax extraction",
        "Three-way matching against purchase orders and receipts",
        "Automated ERP bill creation with draft status",
        "Slack / Teams notification bot for manager approvals",
      ],
      architectureSummary:
        "Event-driven workflow DAG with deterministic three-way matching logic and approval escalation.",
      includedArtifacts: [
        "n8n Workflow JSON",
        "LangGraph Python Code",
        "Test PDFs",
        "Setup Guide",
      ],
      liveDemoHref: "/blueprints",
      storeHref: "https://store.hardonia.com/products/invoice-parser",
    },
  ],
  services: [
    {
      title: "AI Clarity Audit",
      description:
        "We map where automation will actually work in your operations — and where it won't. You get a decision-ready roadmap before any build spend.",
      outcome:
        "A clear build-or-kill decision for every workflow under consideration.",
      deliverables: [
        "Decision Surface Map",
        "Constraint Register",
        "Failure Mode Matrix",
        "Implementation Brief",
      ],
      icon: "Cpu",
    },
    {
      title: "Stabilization Sprint",
      description:
        "Your AI workflows are live but flaky. We harden them with deterministic controls, retry logic, and incident playbooks your ops team can actually run.",
      outcome:
        "Fewer production fires, clearer ownership, measurable reliability.",
      deliverables: [
        "Failure Triage",
        "Control Layer Updates",
        "Escalation Paths",
        "Reliability Review",
      ],
      icon: "Workflow",
    },
    {
      title: "Governance Architecture",
      description:
        "We design the control plane — who approves what, how decisions get logged, and what happens when things go wrong. Built for auditors and operators.",
      outcome:
        "Auditable AI operations with clear accountability at every transition.",
      deliverables: [
        "Governance Blueprint",
        "Control Mapping",
        "Audit Logging Model",
        "Ownership Matrix",
      ],
      icon: "Database",
    },
    {
      title: "Strategic Advantage Program",
      description:
        "Ongoing advisory for teams scaling AI across operations. We run quarterly reviews, optimize your model portfolio, and keep your architecture ahead of your roadmap.",
      outcome: "Compounding gains tied to business priorities, not tool hype.",
      deliverables: [
        "Quarterly Architecture Reviews",
        "Capability Roadmap",
        "Model Portfolio Strategy",
        "Executive Briefings",
      ],
      icon: "ShieldCheck",
    },
  ],
  process: [
    {
      step: 1,
      title: "Discover",
      description:
        "We sit with your team, map the actual workflow, and find where time and money leak.",
    },
    {
      step: 2,
      title: "Architect",
      description:
        "We design every state transition, checkpoint, and fallback before touching code.",
    },
    {
      step: 3,
      title: "Build",
      description:
        "Targeted agents go into your stack. Each one scoped, tested, and documented.",
    },
    {
      step: 4,
      title: "Ship",
      description:
        "Staged rollout with your operators in the loop. No big-bang deploys.",
    },
    {
      step: 5,
      title: "Measure",
      description:
        "Live telemetry, exception tracking, and quarterly optimization reviews.",
    },
  ],
  agenticWorkflow: {
    heroImage: "/images/workflow-diagram.svg",
    steps: [
      {
        title: "Input Analysis",
        description:
          "The agent ingests unstructured data and classifies the intent.",
        inputs: ["Email", "PDF", "Form Data"],
        outputs: ["Structured JSON", "Intent Label"],
      },
      {
        title: "Plan Generation",
        description:
          "A deterministic planner selects the right tools for the job.",
        inputs: ["Intent", "Context"],
        outputs: ["Execution Plan", "Tool Selection"],
      },
      {
        title: "Execution & Verification",
        description: "Tools are executed with strict output validation.",
        inputs: ["Plan", "API Keys"],
        outputs: ["Verified Result", "Audit Log"],
      },
    ],
  },
  workflowSandbox: {
    title: "Experience the Workflow Engine",
    description:
      "Interact with a client-side simulation of our agentic planner. See how we turn vague inputs into structured action plans—deterministically.",
    ctaLabel: "Generate Plan",
    inputForm: {
      title: "Define the Challenge",
      fields: [
        {
          id: "problem",
          label: "Problem Domain",
          type: "select",
          options: [
            "Invoice Processing",
            "Customer Support Triaging",
            "Data Enrichment",
            "Quality Assurance Review",
          ],
        },
        {
          id: "constraints",
          label: 'Constraints (e.g. "Must keep human in loop")',
          type: "text",
        },
        {
          id: "stack",
          label: "Current Tech Stack",
          type: "text",
        },
      ],
      submitLabel: "Simulate Workflow",
    },
    output: {
      title: "Simulation Results",
      markdownTemplate: `
## Agentic Execution Plan

**Objective:** {{problem}}
**Constraints:** {{constraints}}

### Phase 1: Ingestion & Validation
- **Input:** Raw stream from configured source.
- **Action:** Validate schema compliance using Zod.
- **Guardrail:** Reject malformed data immediately.

### Phase 2: Processing
- **Agent:** {{problem}} Specialist
- **Tools:** {{stack}} connectors
- **Logic:**
  1. Parse intent
  2. Fetch context
  3. Execute primary operation

### Phase 3: Output & Handoff
- **Output:** Structured JSON
- **Handoff:** Notify human operator if confidence < 90%.

*Generated by AIAS Deterministic Sandbox*
`,
      checklistTemplate: `
- [ ] Configure Ingestion Webhook
- [ ] Define Zod Schema for Validation
- [ ] Authenticate {{stack}} Connectors
- [ ] Set up "Human-in-the-Loop" notification channel
`,
      artifactJsonTemplate: `
{
  "simulation_id": "sim_{{timestamp}}",
  "domain": "{{problem}}",
  "status": "success",
  "plan": {
    "steps": 3,
    "confidence": 0.98,
    "estimated_runtime_ms": 450
  }
      }
`,
    },
  },
  secretSauce: {
    title: "Our Secret Sauce: Determinism with Enterprise Craft",
    description:
      "Every engagement is anchored in predictable workflows, auditable decisions, and shared ownership. We build systems your team can trust, operate, and extend long after launch.",
    pillars: [
      {
        title: "Deterministic Planning Layer",
        description:
          "We map the workflow before automation starts, so every step has explicit inputs, gates, and fallbacks.",
        highlights: [
          "Workflow blueprints with state transitions",
          "Human-in-the-loop checkpoints",
          "Versioned decision logic and audit trails",
        ],
      },
      {
        title: "Operational Reliability",
        description:
          "We optimize for uptime, safety, and observability so leaders can track outcomes without guesswork.",
        highlights: [
          "Error budgets and escalation paths",
          "Telemetry dashboards and alerting",
          "Security-first data handling",
        ],
      },
      {
        title: "Client Enablement",
        description:
          "Your team receives playbooks, training, and artifacts to run the system without dependency on us.",
        highlights: [
          "Runbooks + SOPs tailored to each workflow",
          "Team training sessions and enablement decks",
          "Executive summaries for stakeholder alignment",
        ],
      },
    ],
  },
  optimizationHotspots: {
    title: "Hot Path Optimizations We Deliver",
    description:
      "We prioritize the highest-throughput workflows first, then harden the paths that unlock the most compounding ROI.",
    areas: [
      {
        title: "Intake & Data Quality",
        impact:
          "Reduce time-to-action by eliminating noisy or incomplete inputs.",
        improvements: [
          "Schema validation + enrichment rules",
          "Automated data deduplication",
          "Confidence scoring with escalation paths",
        ],
      },
      {
        title: "Decision & Routing Logic",
        impact:
          "Ensure every request hits the right workflow, tool, and human owner.",
        improvements: [
          "Deterministic routing matrices",
          "Fallback playbooks when confidence dips",
          "Cross-team handoff automation",
        ],
      },
      {
        title: "Execution & Monitoring",
        impact: "Protect against drift while keeping delivery timelines fast.",
        improvements: [
          "Execution guardrails with rollback paths",
          "Real-time metrics tied to outcomes",
          "Post-run reviews with improvement backlog",
        ],
      },
      {
        title: "Change Management",
        impact: "Keep humans aligned while systems scale.",
        improvements: [
          "Stakeholder-ready change logs",
          "Training and enablement checklists",
          "Quarterly optimization sprints",
        ],
      },
    ],
  },
  testimonials: [],
  caseStudies: [
    {
      title: "AI Content Workflows for Settler",
      client: "Settler",
      challenge:
        "Manual GTM and content workflows were slowing launches and follow-up cadence.",
      solution:
        "Implemented automation-ready operating patterns and advisory sprints for execution consistency.",
      results: [
        "40% fewer manual coordination touches",
        "GTM launch cadence cut from 3 weeks to 5 days",
        "Standardized playbooks adopted across 3 teams",
      ],
      projectUrl:
        "https://settler.dev/?utm_source=aias&utm_medium=case-study&utm_campaign=website",
      logoSrc: "/images/case-studies/settler-logo.svg",
      thumbnailSrc: "/images/case-studies/settler-thumb.svg",
    },
    {
      title: "Ready Layer Automation Enablement",
      client: "Ready Layer",
      challenge:
        "Needed a structured automation roadmap with practical implementation guardrails.",
      solution:
        "Delivered phased engagement planning, technical advisory, and prioritized workflow opportunities.",
      results: [
        "Automation backlog prioritized to 12 high-impact workflows",
        "60% improvement in delivery confidence scores",
        "Cross-team alignment achieved in under 2 weeks",
      ],
      projectUrl:
        "https://ready-layer.com/?utm_source=aias&utm_medium=case-study&utm_campaign=website",
      logoSrc: "/images/case-studies/ready-layer-logo.svg",
      thumbnailSrc: "/images/case-studies/ready-layer-thumb.svg",
    },
  ],
  faq: [
    {
      question: "How is this different from standard chatbots?",
      answer:
        "We build deterministic, workflow-centric agents. Unlike generic chatbots, our systems are designed to execute specific business processes reliably and repeatably.",
    },
    {
      question: "Do you require access to our private data?",
      answer:
        "We design systems that run within your infrastructure or using secure, compliant APIs. Data privacy and security are our top priorities.",
    },
    {
      question: "What is the typical engagement timeline?",
      answer:
        'Our "Discover to Pilot" cycle is typically 2-4 weeks. Full production rollout depends on complexity but usually follows within 4-8 weeks.',
    },
    {
      question: "Do you support on-premise deployment?",
      answer:
        "Yes. We specialize in containerized, edge-ready deployments for clients with strict data residency requirements.",
    },
  ],
  routeFaqs: {
    ecosystem: [
      {
        question: "How do Reach, Zeo, and Settler fit into ecosystem delivery?",
        answer:
          "Reach supports demand and strategy, Zeo executes implementation, and Settler operationalizes deployment and governance handoff.",
      },
      {
        question: "Do you treat AI models as system-of-record controllers?",
        answer:
          "No. Deterministic control layers own policy and state transitions. AI layers operate as constrained advisors with explicit guardrails.",
      },
      {
        question: "Can the ecosystem run in regulated deployment models?",
        answer:
          "Yes. We support self-hosted, managed, and federated operating models with policy inheritance and auditability requirements.",
      },
    ],
    services: [
      {
        question: "How do you scope services without fixed packages?",
        answer:
          "We scope from constraints, governance obligations, and expected outcomes, then define a smallest-safe rollout path.",
      },
      {
        question: "What happens after delivery?",
        answer:
          "Every engagement includes handoff artifacts, ownership clarity, and operational checkpoints for sustained reliability.",
      },
      {
        question: "Do service engagements stay static-first?",
        answer:
          "Yes. Public routes remain static-first while automation logic uses deterministic client-safe patterns unless explicit backend requirements are approved.",
      },
    ],
    automationWeb: [
      {
        question: "Why prioritize static-first website automation?",
        answer:
          "Static-first improves reliability, keeps performance predictable, and reduces operational surface area for marketing routes.",
      },
      {
        question: "How is intake governance enforced on web automation builds?",
        answer:
          "We use deterministic classification rules, policy checkpoints, and explicit escalation paths before high-impact transitions.",
      },
    ],
    appAiSystems: [
      {
        question:
          "How do you balance deterministic execution with AI flexibility?",
        answer:
          "Deterministic layers enforce contracts and policies; AI layers provide bounded recommendations that require validation before execution.",
      },
      {
        question: "Can app orchestration be audited after incidents?",
        answer:
          "Yes. We design replayable logs and governance artifacts to support post-incident review and enterprise reporting.",
      },
    ],
  },
  servicesPage: {
    hero: {
      eyebrow: "Services",
      title: "Deterministic automation services built for production teams",
      description:
        "Each service includes clear deliverables, documented handoff, and governance guardrails so your team can run confidently after launch.",
    },
    engagementInclusions: {
      title: "What you get in every engagement",
      items: [
        "Workflow map with decision points and fallback paths",
        "Implementation artifacts your operators can review and own",
        "Risk controls, observability baselines, and launch checklist",
        "Enablement session to transfer capability into your team",
      ],
      processLinkLabel: "Review delivery process",
      processLinkHref: "/process",
    },
    workflowView: {
      title: "Workflow view",
      description:
        "We standardize around input validation, deterministic routing, controlled execution, and human escalation on low-confidence branches.",
    },
    cta: {
      title: "Need a service mix tailored to your operating model?",
      description:
        "Start with a strategy call and we will scope the smallest practical rollout for your team.",
      primaryLabel: "Book a strategy call",
      secondaryLabel: "View engagement shapes",
      secondaryHref: "/pricing",
    },
  },
  ecosystemPage: {
    hero: {
      eyebrow: "Ecosystem architecture",
      title: "How AIAS connects strategy to reliable automation delivery",
      description:
        "The ecosystem aligns advisory, implementation, and deployment operations without sacrificing deterministic controls.",
    },
    diagram: {
      title: "Layered system diagram",
      nodes: ["Client", "AIAS Advisory", "Reach", "Zeo", "Settler"],
    },
    lifecycle: ["Strategy", "Design", "Build", "Automate", "Govern", "Scale"],
    narrative: {
      determinismVsIntelligence: {
        title: "Determinism vs intelligence",
        body: "Deterministic systems own state transitions, validation, and policy enforcement. Intelligence layers propose, summarize, and optimize within strict contracts. The result is explainable automation with controlled risk.",
      },
      deploymentModels: {
        title: "Deployment models",
        items: [
          "Self-hosted: full infrastructure control and custom compliance boundaries.",
          "Managed: AIAS operates delivery with agreed service and governance terms.",
          "Federated: shared control across teams or regulated entities with policy inheritance.",
        ],
      },
      governancePrinciples: {
        title: "Governance principles",
        items: [
          "Policy before execution.",
          "Human review for high-impact actions.",
          "Auditable run artifacts and deterministic replay.",
          "Explicit non-fit criteria to avoid unsafe deployments.",
        ],
      },
    },
  },
  metricsPage: {
    hero: {
      eyebrow: "Automation proof",
      title: "Measured outcomes from deterministic automation programs",
      description:
        "Representative benchmark data across delivery cohorts showing latency, conversion, reliability, and governance performance.",
    },
    statGroups: [
      {
        category: "Automation latency reduction",
        period: "Q1-Q4 benchmark cohort",
        metrics: [
          {
            label: "Lead intake-to-triage time",
            value: "42s median",
            delta: "-78%",
            note: "From 3m 10s manual review baseline",
          },
          {
            label: "Exception routing turnaround",
            value: "2.8 min",
            delta: "-64%",
            note: "Across finance and support automations",
          },
        ],
      },
      {
        category: "Conversion improvements",
        period: "90-day post-launch average",
        metrics: [
          {
            label: "Qualified form conversion",
            value: "11.4%",
            delta: "+3.6 pts",
            note: "Governed routing and intent enrichment",
          },
          {
            label: "Demo-to-opportunity progression",
            value: "37%",
            delta: "+9 pts",
            note: "Faster follow-up with deterministic handoff",
          },
        ],
      },
      {
        category: "Execution reliability stats",
        period: "Last 30 days",
        metrics: [
          {
            label: "Workflow success rate",
            value: "99.2%",
            delta: "+1.1 pts",
            note: "After fallback and retry hardening",
          },
          {
            label: "Mean time to recovery (MTTR)",
            value: "7m 40s",
            delta: "-52%",
            note: "Alerting + runbook automation applied",
          },
        ],
      },
      {
        category: "Governance coverage metrics",
        period: "Control framework v2",
        metrics: [
          {
            label: "Policy-gated transitions",
            value: "100%",
            delta: "+12 pts",
            note: "No uncontrolled high-impact actions",
          },
          {
            label: "Replayable audit artifacts",
            value: "98.7%",
            delta: "+18 pts",
            note: "Gap is legacy run payload normalization",
          },
        ],
      },
    ],
    efficiencyComparisons: [
      {
        workflow: "Revenue operations triage",
        before: "Manual queue sorting every 2 hours",
        after: "Deterministic triage with AI-assisted enrichment in 45 seconds",
        impact: "88% faster first-response loop and higher lead SLA adherence",
      },
      {
        workflow: "Invoice exception handling",
        before: "Spreadsheet reconciliation and email routing",
        after: "Rule-based exception classification with confidence thresholds",
        impact: "61% lower handling effort and fewer escalations",
      },
      {
        workflow: "Support escalation governance",
        before: "Ad-hoc analyst judgment and delayed approvals",
        after: "Policy-gated escalation paths with review checkpoints",
        impact:
          "43% reduction in escalation cycle time and full audit visibility",
      },
    ],
  },
  roiCalculatorPage: {
    hero: {
      eyebrow: "ROI calculator",
      title: "Estimate automation impact for your operating team",
      description:
        "Use your current workload and automation maturity to model annual time and cost savings.",
    },
    assumptions: [
      "Assumes 48 active working weeks per year.",
      "Cost baseline uses blended operations and management effort assumptions.",
      "Automation maturity applies fixed multipliers (35%, 55%, 75%) to manual hours eliminated.",
      "Break-even estimate uses a fixed $48,000 implementation baseline.",
    ],
  },
  howItWorksPage: {
    hero: {
      eyebrow: "System transparency",
      title: "How our automation delivery model works in production",
      description:
        "A transparent view of tooling, governance, security controls, and deployment patterns used in AIAS programs.",
    },
    sections: [
      {
        title: "Tooling stack",
        description:
          "Static-first web delivery, deterministic orchestration, and typed configuration ensure predictable releases.",
        bullets: [
          "Next.js App Router + TypeScript for static-first user routes",
          "Schema-validated content and route metadata checks in CI",
          "Playwright suites for visual, UX consistency, and accessibility regression",
        ],
      },
      {
        title: "Governance",
        description:
          "Controls are applied before execution, not after incidents, to keep automation bounded and auditable.",
        bullets: [
          "Policy gates on high-impact transitions",
          "Human-in-the-loop reviews for low-confidence actions",
          "Replayable run artifacts for post-incident analysis",
        ],
      },
      {
        title: "Security",
        description:
          "Security is designed into architecture, access paths, and operational playbooks from day one.",
        bullets: [
          "Least-privilege connector permissions",
          "Tenant-aware boundary and data handling conventions",
          "Structured escalation and incident response checkpoints",
        ],
      },
      {
        title: "Deployment models",
        description:
          "Delivery can be mapped to your risk profile and compliance posture without changing core governance controls.",
        bullets: [
          "Self-hosted for strict infrastructure control",
          "Managed for operator-light rollout paths",
          "Federated for multi-entity policy inheritance",
        ],
      },
    ],
    boundaryModel: [
      {
        layer: "Intake and classification",
        deterministicBoundary:
          "Schema validation, required fields, and policy checks run first.",
        aiBoundary:
          "AI enriches intent and context only within validated payload contracts.",
      },
      {
        layer: "Decision and orchestration",
        deterministicBoundary:
          "State transitions, approvals, and routing rules are explicit and replayable.",
        aiBoundary:
          "AI proposes ranked actions when confidence thresholds and policy allow.",
      },
      {
        layer: "Execution and reporting",
        deterministicBoundary:
          "Connector permissions, audit logs, and rollback paths are pre-defined.",
        aiBoundary:
          "AI summarizes outcomes and anomalies without bypassing control gates.",
      },
    ],
  },
  socials: {
    twitter: "https://twitter.com/aias_platform",
    linkedin: "https://linkedin.com/company/aias-platform",
    github: "https://github.com/shardie-github/aias",
  },
  footer: {
    tagline: MESSAGING_CONTRACT.primaryTagline,
    copyright: "© 2026 AI Automated Systems. All rights reserved.",
    legalLinks: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  legal: {
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "January 2026",
      sections: [
        {
          heading: "Overview",
          body: "We collect only the information needed to respond to inquiries, deliver consulting engagements, and improve our services. We do not sell personal data.",
        },
        {
          heading: "What We Collect",
          body: "Contact details you provide via email or scheduling links, plus usage analytics for our website. We avoid collecting sensitive data unless explicitly required for an engagement.",
        },
        {
          heading: "How We Use Data",
          body: "We use data to respond to requests, manage projects, and deliver operational insights. Data is retained only as long as needed for the engagement and compliance requirements.",
        },
        {
          heading: "Your Rights",
          body: "You can request access, updates, or deletion of your information by emailing inquiries@aiautomatedsystems.ca.",
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      lastUpdated: "January 2026",
      sections: [
        {
          heading: "Engagement Scope",
          body: "Consulting services are scoped per engagement statement and require mutual agreement before work begins. Deliverables and timelines are outlined in writing.",
        },
        {
          heading: "Client Responsibilities",
          body: "Clients provide timely access to required stakeholders, data, and systems. Delays in access may affect timelines and outcomes.",
        },
        {
          heading: "Confidentiality",
          body: "Both parties agree to keep confidential information private and secure. We handle data in line with PIPEDA-informed practices.",
        },
        {
          heading: "Liability",
          body: "We strive for reliable systems, but final deployment decisions remain with the client. Liability is limited to the fees paid for the applicable engagement.",
        },
      ],
    },
  },
};
const siteContentSchema = z.object({
  brand: z.object({
    name: z.string().min(1),
    tagline: z.string().min(1),
    description: z.string().min(1),
  }),
  positioning: z.object({
    subheading: z.string().min(1),
    badgeText: z.string().min(1),
    impactCardsLabel: z.string().min(1),
    primaryCTA: z.object({
      label: z.string().min(1),
      href: z.string().min(1),
    }),
    secondaryCTA: z.object({
      label: z.string().min(1),
      href: z.string().min(1),
    }),
    socialProof: z.array(
      z.object({
        icon: z.string().min(1),
        text: z.string().min(1),
      }),
    ),
    trustBadges: z.array(
      z.object({
        icon: z.string().min(1),
        text: z.string().min(1),
      }),
    ),
  }),
  contact: z.object({
    email: z.string().email(),
    responseTime: z.string().min(1),
  }),
  navigation: z.object({
    primary: z
      .array(z.object({ label: z.string().min(1), href: z.string().min(1) }))
      .min(1),
    resources: z
      .array(z.object({ label: z.string().min(1), href: z.string().min(1) }))
      .min(1),
  }),
});

const parsedSiteContent = siteContentSchema.safeParse(rawSiteContent);

if (!parsedSiteContent.success && process.env.NODE_ENV !== "production") {
  console.warn(
    "Invalid site content configuration detected.",
    parsedSiteContent.error.flatten(),
  );
}

export const siteContent: SiteConfig = parsedSiteContent.success
  ? rawSiteContent
  : {
      ...rawSiteContent,
      positioning: {
        ...rawSiteContent.positioning,
        primaryCTA: {
          ...rawSiteContent.positioning.primaryCTA,
          href: `mailto:${rawSiteContent.contact.email}`,
        },
      },
    };

export const getPrimaryCtaHref = (): string => {
  const calendlyHref = siteContent.positioning.primaryCTA.href.trim();

  if (calendlyHref.startsWith("https://calendly.com/")) {
    return calendlyHref;
  }

  if (
    calendlyHref.startsWith("http://") ||
    calendlyHref.startsWith("https://") ||
    calendlyHref.startsWith("mailto:")
  ) {
    return calendlyHref;
  }

  return `mailto:${siteContent.contact.email}`;
};

export const getContactEmailHref = (): string =>
  `mailto:${siteContent.contact.email}`;

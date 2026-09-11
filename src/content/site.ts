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
    "Simulators" | "Calculators" | "Diagnostics" | "Builders" | "Studios";
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
  operationalOutcome: string;
  bestFit: string[];
  techStack: string[];
  keyFeatures: string[];
  architectureSummary: string;
  inputs: string[];
  controlPoints: string[];
  outputs: string[];
  successSignals: string[];
  nonFit: string[];
  includedArtifacts: string[];
  liveDemoHref?: string;
  inquiryHref: string;
  featured?: boolean;
  thumbnailSrc?: string;
}

export interface CatalogPageContent {
  proofBar: Array<{ label: string; value: string }>;
  buyerPaths: Array<{
    id: string;
    title: string;
    description: string;
    signals: string[];
    productIds: string[];
  }>;
  deliverySteps: Array<{
    step: string;
    title: string;
    description: string;
    exitEvidence: string;
  }>;
  faqs: Array<{ question: string; answer: string }>;
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
  catalogPage: CatalogPageContent;
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
    heroImage: string; // Path to image asset
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
      artifactModel: {
        version: string;
        stateModel: Array<{
          state: string;
          purpose: string;
        }>;
        policyGates: string[];
        verificationCriteria: string[];
      };
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
  docsPage: {
    hero: {
      eyebrow: string;
      title: string;
      description: string;
    };
    categories: Array<{
      icon: "book" | "code" | "shield" | "evidence";
      title: string;
      description: string;
      links: Array<{
        label: string;
        description: string;
        href: string;
        format: "page" | "markdown";
      }>;
    }>;
    operatingModel: {
      eyebrow: string;
      title: string;
      description: string;
      commitments: Array<{
        title: string;
        detail: string;
      }>;
    };
    resources: Array<{
      title: string;
      description: string;
      href: string;
    }>;
  };
  socials: {
    github: string;
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
    badgeText: "Applied Systems Research",
    impactCardsLabel: "Observed outcomes",
    primaryCTA: {
      label: "Book Free Diagnostic",
      href: "https://calendly.com/scottrmhardie",
    },
    secondaryCTA: {
      label: "See How It Works",
      href: "/how-it-works",
    },
    socialProof: [
      { icon: "zap", text: "Operational baselines before automation" },
      { icon: "shield", text: "Policy gates before high-impact actions" },
      { icon: "clock", text: "Smallest-safe pilot scoped from discovery" },
      { icon: "check", text: "Named owners, fallbacks, and acceptance tests" },
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
      { label: "Systems Catalog", href: "/catalog" },
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
      stats: { label: "Release Standard", value: "Evidence Gated" },
    },
    {
      id: "catalog",
      title: "Systems & Module Catalog",
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
      secondaryLabel: "Discuss a Module",
      secondaryHref: "/contact?ref=catalog",
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
        "Deterministic boundary definitions for in-scope actions",
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
        "Contract-defined ownership of custom deliverables",
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
      operationalOutcome:
        "Create one reconciled operating picture across orders, inventory, exceptions, and supplier actions.",
      bestFit: [
        "Multi-channel commerce teams reconciling storefront and warehouse state",
        "Operators spending recurring time on stock, order, or supplier exceptions",
      ],
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
      inputs: [
        "Storefront orders, refunds, and fulfillment events",
        "Warehouse and inventory availability feeds",
        "Supplier rules, lead times, and catalog data",
      ],
      controlPoints: [
        "Idempotency and duplicate-event suppression",
        "Stock allocation and fraud policy gates",
        "Approval thresholds before supplier dispatch",
      ],
      outputs: [
        "Reconciled order and inventory state",
        "Approval-ready supplier purchase orders",
        "Owned exception queue with decision history",
      ],
      successSignals: [
        "Oversell and reconciliation-gap rate",
        "Manual exception minutes per order",
        "Traceable allocation and supplier decisions",
      ],
      nonFit: [
        "Single-store operations without recurring reconciliation volume",
      ],
      includedArtifacts: [
        "Full Source Repository",
        "Deployment Dockerfiles",
        "Architecture Blueprints",
        "Operator Runbooks",
      ],
      liveDemoHref: "/dashboard",
      inquiryHref: "/contact?ref=catalog&product=hardonia-suite-ops",
      featured: true,
      thumbnailSrc: "/images/catalog/hardonia_suite_ops.avif",
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
        "Production deployment control plane built for static-first and edge-native applications. Enforces verification suites, schema integrity, and rollback triggers designed to minimize disruption.",
      operationalOutcome:
        "Turn release policy into an enforceable path from verified artifact to observable rollback.",
      bestFit: [
        "Teams shipping multiple static, edge, or containerized services",
        "Platforms where failed releases require faster, evidence-backed recovery",
      ],
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
      inputs: [
        "Versioned build artifacts and provenance",
        "Test, schema, and security verification results",
        "Environment contracts and health telemetry",
      ],
      controlPoints: [
        "Preflight policy and artifact-integrity gates",
        "Canary health thresholds and observation windows",
        "Deterministic rollback and promotion conditions",
      ],
      outputs: [
        "Promotion or rollback decision",
        "Signed release receipt and changelog evidence",
        "Incident-ready deployment timeline",
      ],
      successSignals: [
        "Failed-deployment escape rate",
        "Mean time to detect and recover",
        "Manual release coordination minutes",
      ],
      nonFit: ["Low-change brochure sites without meaningful release risk"],
      includedArtifacts: [
        "CLI Tooling",
        "CI/CD Workflows",
        "Configuration Schemas",
        "Documentation",
      ],
      liveDemoHref: "/how-it-works",
      inquiryHref: "/contact?ref=catalog&product=settler-deployment-fabric",
      featured: true,
      thumbnailSrc: "/images/catalog/settler_deployment_fabric.avif",
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
      operationalOutcome:
        "Convert document variability into typed records with measurable extraction quality and owned exceptions.",
      bestFit: [
        "Teams processing recurring document families at operational volume",
        "Workflows with known schemas and reviewers for ambiguous fields",
      ],
      techStack: ["Python", "TypeScript", "Zod", "OCR Engine", "FastAPI"],
      keyFeatures: [
        "Multi-format ingestion (PDF, scan images, CSV, webhook streams)",
        "Deterministic schema extraction with strict Zod validation",
        "Confidence scoring with automatic routing to operator review queue",
        "Export connectors for ERPs, CRMs, and SQL data warehouses",
      ],
      architectureSummary:
        "Dual-phase pipeline: AI extraction followed by strict deterministic schema validation and policy gating.",
      inputs: [
        "PDFs, scans, CSVs, or webhook payloads",
        "Target schemas and field-level validation rules",
        "Representative fixtures and reviewer corrections",
      ],
      controlPoints: [
        "File, source, and duplicate validation",
        "Field confidence and cross-field consistency gates",
        "Schema rejection with human review routing",
      ],
      outputs: [
        "Typed and source-linked JSON records",
        "Low-confidence review queue",
        "ERP, CRM, or warehouse-ready exports",
      ],
      successSignals: [
        "Field accuracy by document family",
        "Touchless acceptance rate at approved thresholds",
        "Median review time per exception",
      ],
      nonFit: [
        "Unbounded document types without representative fixtures or ground truth",
      ],
      includedArtifacts: [
        "FastAPI Service Code",
        "Schema Definitions",
        "Test Fixtures",
        "Integration Guides",
      ],
      liveDemoHref: "/automation-demo",
      inquiryHref: "/contact?ref=catalog&product=zeo-ingestion-engine",
      featured: true,
      thumbnailSrc: "/images/catalog/zeo_ingestion_engine.avif",
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
        "Models how inbound submissions can be enriched, classified against explicit constraints, and routed to an accountable owner.",
      operationalOutcome:
        "Move qualified demand to the right owner faster while keeping scoring and enrichment explainable.",
      bestFit: [
        "Revenue teams with multiple lead sources and routing rules",
        "Organizations losing time to manual research and inconsistent qualification",
      ],
      techStack: ["TypeScript", "Next.js App Router", "Zod", "CRM Webhooks"],
      keyFeatures: [
        "Configurable intake classification and enrichment budget",
        "Deterministic qualification score based on organizational constraints",
        "Automated calendar routing with pre-populated strategy dossiers",
        "Privacy-requirement mapping with explicit retention and access controls",
      ],
      architectureSummary:
        "Web-native intake controller with a deterministic scoring matrix and client-approved CRM connector boundary.",
      inputs: [
        "Inbound forms, referrals, and campaign context",
        "Approved firmographic or intent enrichment sources",
        "Qualification rules, territories, and owner capacity",
      ],
      controlPoints: [
        "Explicit scoring weights and disqualification reasons",
        "Per-source enrichment budget and retention rules",
        "Owner, territory, and fallback routing constraints",
      ],
      outputs: [
        "Scored lead with decision explanation",
        "Research dossier and recommended next action",
        "CRM record assigned to an accountable owner",
      ],
      successSignals: [
        "Median speed to qualified owner",
        "Qualified-to-meeting conversion by source",
        "Routing exception and reassignment rate",
      ],
      nonFit: [
        "Teams without defined qualification criteria or follow-up ownership",
      ],
      includedArtifacts: [
        "Next.js Component Suite",
        "Scoring Matrices",
        "Webhook Connectors",
        "Setup Guide",
      ],
      liveDemoHref: "/contact",
      inquiryHref: "/contact?ref=catalog&product=reach-demand-accelerator",
      thumbnailSrc: "/images/catalog/reach_demand_accelerator.avif",
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
      operationalOutcome:
        "Connect content momentum to SKU demand and inventory decisions before signals disappear into channel dashboards.",
      bestFit: [
        "Commerce brands publishing consistent short-form campaign volume",
        "Teams linking social performance, product demand, and replenishment decisions",
      ],
      techStack: ["Python", "TypeScript", "Next.js", "FastAPI", "PostgreSQL"],
      keyFeatures: [
        "Trend velocity scoring and social product interest tracking",
        "Automated content performance attribution and SKU linkage",
        "Inventory replenishment recommendations based on viral signal spikes",
        "Brand-safe content generation and copy suggestions",
      ],
      architectureSummary:
        "Stream processing analytics engine linked to social commerce APIs with automated trend alerts.",
      inputs: [
        "Approved social performance and campaign metrics",
        "Product catalog, SKU mappings, and margin context",
        "Inventory position and replenishment constraints",
      ],
      controlPoints: [
        "Attribution windows and confidence thresholds",
        "Platform rate, spend, and access budgets",
        "Brand-policy checks for generated suggestions",
      ],
      outputs: [
        "Trend-velocity and anomaly alerts",
        "Content-to-SKU attribution views",
        "Inventory and campaign action recommendations",
      ],
      successSignals: [
        "Signal-to-decision latency",
        "Demand forecast error by SKU cohort",
        "Recommendation adoption and measured outcome rate",
      ],
      nonFit: [
        "Brands without stable content, catalog, or inventory identifiers",
      ],
      includedArtifacts: [
        "Full Web App Source",
        "API Microservice",
        "Docker Compose Setup",
        "Documentation",
      ],
      liveDemoHref: "/work",
      inquiryHref: "/contact?ref=catalog&product=tokpulse-growth-core",
      thumbnailSrc: "/images/catalog/tokpulse_growth_core_v2.avif",
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
        "Reusable governance reference architecture for validating actions before execution, reducing exposed sensitive data, and producing replayable decision records.",
      operationalOutcome:
        "Stop invalid or high-risk AI actions before execution and leave a replayable decision record.",
      bestFit: [
        "Engineering teams adding tools or actions to LLM workflows",
        "Operators who need consistent schemas, escalation, and audit evidence",
      ],
      techStack: ["TypeScript", "Zod", "Vitest"],
      keyFeatures: [
        "Pre-built Zod schemas for system inputs, actions, and outputs",
        "PII scrubbers with regex and semantic masking",
        "Confidence score evaluation with human-in-the-loop triggers",
        "Structured audit trail generator compatible with SIEM / logging tools",
      ],
      architectureSummary:
        "Zero-dependency TypeScript module designed to wrap any LLM or automation pipeline with deterministic gates.",
      inputs: [
        "Model requests, tool calls, and proposed actions",
        "Typed policy schemas and approval thresholds",
        "PII patterns, roles, and environment context",
      ],
      controlPoints: [
        "Input, action, and output schema validation",
        "Policy, confidence, and human-review gates",
        "PII detection, redaction, and deny rules",
      ],
      outputs: [
        "Allow, deny, transform, or escalate decision",
        "Validated or redacted payload",
        "Replayable audit event with reason codes",
      ],
      successSignals: [
        "Invalid actions blocked before execution",
        "Human override and false-positive rate",
        "Audit-record completeness across decision paths",
      ],
      nonFit: [
        "Organizations expecting a code library alone to confer compliance",
      ],
      includedArtifacts: [
        "TypeScript NPM Package Source",
        "Unit Test Suite",
        "Integration Examples",
        "MIT License",
      ],
      liveDemoHref: "/tools/policy-studio",
      inquiryHref: "/contact?ref=catalog&product=policy-guardrail-kit",
      featured: true,
      thumbnailSrc: "/images/catalog/policy_guardrail_kit_v2.avif",
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
      operationalOutcome:
        "Give every automation exception an owner, evidence trail, decision path, and service-level clock.",
      bestFit: [
        "Teams operating sustained review, approval, or exception queues",
        "Systems where human decisions must be attributable and replayable",
      ],
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
      inputs: [
        "Queue events, risk scores, and service-level timestamps",
        "Source payloads, diffs, and supporting evidence",
        "Operator roles, permissions, and escalation policy",
      ],
      controlPoints: [
        "Role-aware actions and decision permissions",
        "Dual-approval or escalation requirements",
        "Queue aging, timeout, and reassignment rules",
      ],
      outputs: [
        "Approve, reject, revise, or escalate decisions",
        "Timestamped notes and operator rationale",
        "Queue health and resolution telemetry",
      ],
      successSignals: [
        "Oldest-item age and service-level attainment",
        "Median resolution and escalation time",
        "Reopen, override, and reassignment rate",
      ],
      nonFit: [
        "Workflows without sustained exception volume or named reviewers",
      ],
      includedArtifacts: [
        "React Components",
        "Tailwind Theme Config",
        "Storybook Stories",
        "Figma Tokens",
      ],
      liveDemoHref: "/operator-demo",
      inquiryHref: "/contact?ref=catalog&product=operator-console-kit",
      thumbnailSrc: "/images/catalog/operator_console_kit_v2.avif",
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
        "Reference accounts-payable workflow for ingesting PDF invoices, validating extracted line items, reconciling purchase-order records, and drafting approval batches with confidence-based review.",
      operationalOutcome:
        "Turn incoming invoices into validated draft payables while keeping posting authority with accountable reviewers.",
      bestFit: [
        "Accounts-payable teams with repeatable PO-backed invoice volume",
        "Organizations measuring exception cost and approval-cycle time",
      ],
      techStack: ["n8n / LangGraph", "TypeScript", "Zod", "ERP Webhooks"],
      keyFeatures: [
        "Multi-currency line item and tax extraction",
        "Three-way matching against purchase orders and receipts",
        "Automated ERP bill creation with draft status",
        "Slack / Teams notification bot for manager approvals",
      ],
      architectureSummary:
        "Event-driven workflow DAG with deterministic three-way matching logic and approval escalation.",
      inputs: [
        "Invoices, credit notes, and vendor documents",
        "Purchase orders, receipts, and vendor master data",
        "Tax, currency, tolerance, and approval policy",
      ],
      controlPoints: [
        "Duplicate, vendor, tax, and total validation",
        "Confidence-gated three-way matching",
        "Approval limits before any ERP posting step",
      ],
      outputs: [
        "Validated invoice and normalized line items",
        "Draft bill or owned exception case",
        "Approval notification and decision record",
      ],
      successSignals: [
        "Touchless match rate at approved tolerances",
        "Cost and manual minutes per invoice",
        "Exception and approval cycle time",
      ],
      nonFit: [
        "Uncontrolled auto-posting without purchase records or approval owners",
      ],
      includedArtifacts: [
        "n8n Workflow JSON",
        "LangGraph Python Code",
        "Test PDFs",
        "Setup Guide",
      ],
      liveDemoHref: "/blueprints",
      inquiryHref: "/contact?ref=catalog&product=invoice-document-parser",
      thumbnailSrc: "/images/catalog/invoice_document_parser_v2.avif",
    },
  ],
  catalogPage: {
    proofBar: [
      { label: "Architecture", value: "Deterministic control boundaries" },
      { label: "Delivery", value: "Proof → hardening → transfer" },
      { label: "Ownership", value: "Source, tests, and runbooks" },
      { label: "Measurement", value: "Baseline before outcome claims" },
    ],
    buyerPaths: [
      {
        id: "operations",
        title: "Reduce operational load",
        description:
          "Normalize high-volume work, automate deterministic decisions, and route exceptions instead of hiding them.",
        signals: [
          "Teams reconcile the same records repeatedly",
          "Exceptions move through inboxes or spreadsheets",
          "Throughput depends on a few experienced operators",
        ],
        productIds: [
          "hardonia-suite-ops",
          "zeo-ingestion-engine",
          "invoice-document-parser",
          "operator-console-kit",
        ],
      },
      {
        id: "governance",
        title: "Govern AI actions",
        description:
          "Put typed policy, evidence, approvals, and replay around probabilistic model behavior.",
        signals: [
          "Tool-calling agents can change external systems",
          "Teams cannot explain why an action was allowed",
          "Review and escalation rules differ by workflow",
        ],
        productIds: [
          "policy-guardrail-kit",
          "operator-console-kit",
          "settler-deployment-fabric",
        ],
      },
      {
        id: "revenue",
        title: "Improve revenue operations",
        description:
          "Turn fragmented demand signals into explainable qualification, prioritization, and owned follow-up.",
        signals: [
          "Lead research and routing consume selling time",
          "Channel data does not connect to product decisions",
          "Conversion handoffs lack clear service levels",
        ],
        productIds: [
          "reach-demand-accelerator",
          "tokpulse-growth-core",
          "operator-console-kit",
        ],
      },
      {
        id: "reliability",
        title: "Ship and recover reliably",
        description:
          "Make verification, promotion, rollback, ownership, and incident evidence part of the delivery path.",
        signals: [
          "Release approval is mostly tribal knowledge",
          "Rollback decisions arrive after customer impact",
          "Build evidence is scattered across CI tools",
        ],
        productIds: [
          "settler-deployment-fabric",
          "policy-guardrail-kit",
          "hardonia-suite-ops",
        ],
      },
    ],
    deliverySteps: [
      {
        step: "01",
        title: "Fit and boundary review",
        description:
          "Map the workflow, decision owner, source systems, constraints, and the smallest valuable proof boundary.",
        exitEvidence:
          "Signed-off problem frame, source inventory, risk register, and measurement plan.",
      },
      {
        step: "02",
        title: "Representative proof",
        description:
          "Run real but controlled fixtures through the proposed path and expose every reject, escalation, and cost decision.",
        exitEvidence:
          "Reproducible fixtures, baseline comparison, failure evidence, and a build-or-stop decision.",
      },
      {
        step: "03",
        title: "Production hardening",
        description:
          "Add idempotency, policy gates, observability, access boundaries, runbooks, and rollback behavior around the core workflow.",
        exitEvidence:
          "Acceptance results, operator walkthrough, release plan, and owned incident paths.",
      },
      {
        step: "04",
        title: "Transfer and measured rollout",
        description:
          "Release against agreed thresholds, train accountable operators, and compare live results with the original baseline.",
        exitEvidence:
          "Source and artifact transfer, operating cadence, outcome review, and prioritized next decisions.",
      },
    ],
    faqs: [
      {
        question:
          "Are these finished SaaS products or reference implementations?",
        answer:
          "They are implementation-ready reference scopes: reusable architecture, controls, test patterns, and delivery artifacts adapted to your systems. They are not one-click subscriptions, and the site does not imply that an unconfigured module is production-ready for every environment.",
      },
      {
        question: "Can AIAS work with our existing stack?",
        answer:
          "Usually. The fit review identifies authoritative sources, integration contracts, identity boundaries, observability, and ownership before selecting adapters. A module is reshaped around those constraints rather than forcing a platform replacement.",
      },
      {
        question: "How do you prove value without inventing ROI?",
        answer:
          "We agree on a baseline and measurement contract first: volume, cycle time, exception rate, quality thresholds, operating cost, and who validates each result. Public examples are planning references; outcome claims belong to the measured engagement context.",
      },
      {
        question: "What remains human-owned?",
        answer:
          "Policy approval, exception resolution, sensitive access, material external actions, and go-live acceptance remain assigned to named people. Automation can prepare evidence and recommendations without obscuring accountability.",
      },
      {
        question: "What do you need for an initial fit review?",
        answer:
          "A representative workflow, approximate volume, current tools, the accountable owner, known failure modes, and any security or retention constraints. Sanitized examples are enough for the first conversation; do not submit production secrets or regulated data through the public site.",
      },
      {
        question: "What if the selected module is not the right fit?",
        answer:
          "We will say so. The shortlist starts the conversation, not the architecture decision. The appropriate next step may be a smaller diagnostic, a different module combination, process cleanup before automation, or no build at all.",
      },
    ],
  },
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
    heroImage: "/images/workflow_schema.avif",
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
# Controlled Workflow Specification

## Decision objective
**Workflow domain:** {{problem}}
**Operating constraint:** {{constraints}}
**Declared systems:** {{stack}}

## Authority boundary
The planner may prepare a typed action proposal. A deterministic control plane owns validation, policy evaluation, execution, and every write to an authoritative system. A human owner resolves ambiguity, low-confidence evidence, and policy conflicts.

## Execution path
1. **Capture & normalize** — accept only schema-valid source records; preserve source references and reject malformed fields with an actionable reason.
2. **Classify & enrich** — establish intent and fetch only declared contextual data required for the decision.
3. **Evaluate policy** — check ownership, data sensitivity, confidence, and action preconditions before an executable plan exists.
4. **Execute bounded command** — call approved {{stack}} connectors with idempotency keys and a defined timeout.
5. **Verify & hand off** — reconcile the result against the contract, create a replayable receipt, and route exceptions to the named operator.

## Escalation rules
- Missing required evidence, a schema error, or an unsupported action stops the workflow before execution.
- Confidence below the approved threshold produces a review task; it does not silently choose a fallback.
- A policy denial or failed verification returns the work to a safe state and records the exact rule, version, and owner.

## Completion evidence
The workflow is complete only when the output schema is valid, policy receipts are present, the target system acknowledges the bounded command, and the audit artifact can reconstruct the decision.
`,
      checklistTemplate: `
## Readiness checklist

### Inputs and contracts
- [ ] Define the input schema, required fields, and invalid-state responses for {{problem}}.
- [ ] Identify the authoritative source for each field and the retention rule for submitted data.
- [ ] Declare the allowed {{stack}} commands, idempotency behaviour, timeout, and compensating action.

### Controls and ownership
- [ ] Set the policy thresholds for confidence, sensitive data, and actions requiring human approval.
- [ ] Name the operator who owns stalled, denied, and low-confidence work.
- [ ] Persist schema, policy, connector, and workflow versions in every execution receipt.

### Verification and release
- [ ] Test valid, incomplete, duplicate, timeout, denied, and failed-verification fixture cases.
- [ ] Confirm the target system result can be reconciled against the requested action.
- [ ] Define an alert, service objective, and replay procedure before live traffic is enabled.
`,
      artifactModel: {
        version: "1.0",
        stateModel: [
          {
            state: "intake",
            purpose:
              "Validate and normalize source records before any classification or external call.",
          },
          {
            state: "policy_review",
            purpose:
              "Evaluate action preconditions, data handling, and required human approvals.",
          },
          {
            state: "bounded_execution",
            purpose:
              "Perform only approved, idempotent commands through declared connectors.",
          },
          {
            state: "verification_and_handoff",
            purpose:
              "Reconcile the result, preserve the receipt, and route exceptions to an owner.",
          },
        ],
        policyGates: [
          "Reject invalid or incomplete inputs before classification.",
          "Escalate low-confidence, sensitive, or ambiguous decisions to a named human owner.",
          "Block undeclared tools, unsupported commands, and failed output validation.",
        ],
        verificationCriteria: [
          "Output matches the declared schema and downstream contract.",
          "Policy, schema, workflow, and connector versions are recorded in the receipt.",
          "A replay contains enough evidence to reconstruct the decision and execution outcome.",
        ],
      },
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
        "Scenario measure: coordination touches per approved launch",
        "Scenario measure: elapsed time from brief approval to release",
        "Scenario evidence: playbook adoption and exception records",
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
        "Scenario measure: ranked workflows with owners and constraints",
        "Scenario measure: pre/post delivery-confidence rubric",
        "Scenario evidence: signed decisions and unresolved-risk log",
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
      eyebrow: "Measurement contract",
      title: "Prove automation outcomes with evidence you can audit",
      description:
        "A practical scorecard for defining baselines, targets, exclusions, owners, and review cadence before an automation claim is published.",
    },
    statGroups: [
      {
        category: "Reliability evidence",
        period: "Measured per workflow run",
        metrics: [
          {
            label: "Completion rate",
            value: "Per run",
            delta: "Required",
            note: "Successful eligible runs divided by attempted eligible runs, with exclusions documented.",
          },
          {
            label: "Recovery time",
            value: "Per incident",
            delta: "Owned",
            note: "Elapsed time from detection to restored service, with owner and severity recorded.",
          },
        ],
      },
      {
        category: "Outcome evidence",
        period: "Compared with an agreed baseline",
        metrics: [
          {
            label: "Cycle time",
            value: "Median + p95",
            delta: "Scoped",
            note: "Start and stop events, comparison window, and manual work are defined before measurement.",
          },
          {
            label: "Human effort",
            value: "Minutes / unit",
            delta: "Scoped",
            note: "Review, correction, and exception-handling effort are included—not hidden as automation.",
          },
        ],
      },
      {
        category: "Evaluation integrity",
        period: "Checked before every promotion",
        metrics: [
          {
            label: "Critical-path coverage",
            value: "Route mapped",
            delta: "Gated",
            note: "Happy paths, known failure modes, fallbacks, and high-impact transitions receive explicit checks.",
          },
          {
            label: "Change attribution",
            value: "Versioned",
            delta: "Gated",
            note: "Model, prompt, policy, tool, schema, and dataset versions travel with evaluation evidence.",
          },
        ],
      },
      {
        category: "Cost and governance",
        period: "Reviewed on an agreed cadence",
        metrics: [
          {
            label: "Unit cost",
            value: "Per success",
            delta: "Tracked",
            note: "Model, tool, infrastructure, and human-review costs are tied to successful business units.",
          },
          {
            label: "Trace completeness",
            value: "Required fields",
            delta: "Tracked",
            note: "Decision inputs, policy result, actor, outcome, and exception state are checked for completeness.",
          },
        ],
      },
    ],
    efficiencyComparisons: [
      {
        workflow: "Revenue operations triage",
        before: "Manual queue sorting every 2 hours",
        after: "Deterministic triage with bounded AI-assisted enrichment",
        impact: "Measure: median and p95 time to an owned next action",
      },
      {
        workflow: "Invoice exception handling",
        before: "Spreadsheet reconciliation and email routing",
        after: "Rule-based exception classification with confidence thresholds",
        impact:
          "Measure: human minutes and exception rate per approved invoice",
      },
      {
        workflow: "Support escalation governance",
        before: "Ad-hoc analyst judgment and delayed approvals",
        after: "Policy-gated escalation paths with review checkpoints",
        impact: "Measure: escalation cycle time and trace completeness",
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
  docsPage: {
    hero: {
      eyebrow: "Knowledge base",
      title: "The operating system behind reliable automation",
      description:
        "Use these field guides, working blueprints, governance notes, and evidence standards to evaluate an AIAS engagement before you commit to one.",
    },
    categories: [
      {
        icon: "book",
        title: "Start with the system",
        description:
          "Understand the AIAS point of view, delivery sequence, and diagnostic method before choosing tools or models.",
        links: [
          {
            label: "What AIAS actually does",
            description:
              "Capability map, engagement formats, outputs, and explicit non-fit criteria.",
            href: "/what-aias-does",
            format: "page",
          },
          {
            label: "How delivery works",
            description:
              "A transparent walkthrough of tooling, control boundaries, security, and deployment patterns.",
            href: "/how-it-works",
            format: "page",
          },
          {
            label: "Diagnostic framework",
            description:
              "Five steps for mapping decisions, constraints, failure modes, and acceptance criteria.",
            href: "/framework",
            format: "page",
          },
          {
            label: "Consulting methodology",
            description:
              "The discovery-to-handoff method used to keep implementation bounded and operable.",
            href: "/methodology",
            format: "page",
          },
        ],
      },
      {
        icon: "code",
        title: "Build from working patterns",
        description:
          "Inspect reusable architecture patterns and test the decision logic in client-side tools before implementation.",
        links: [
          {
            label: "Blueprint library",
            description:
              "Downloadable reference architectures for intake, control planes, and resilient agent releases.",
            href: "/blueprints",
            format: "page",
          },
          {
            label: "Workflow builder",
            description:
              "Model states, approvals, fallbacks, and verification criteria in the browser.",
            href: "/workflows",
            format: "page",
          },
          {
            label: "Policy studio",
            description:
              "Exercise deterministic rules, PII filters, and escalation thresholds against sample inputs.",
            href: "/tools/policy-studio",
            format: "page",
          },
          {
            label: "Public build log",
            description:
              "Review shipped changes, corrected assumptions, and operational lessons.",
            href: "/build-log",
            format: "page",
          },
        ],
      },
      {
        icon: "shield",
        title: "Trust and operational boundaries",
        description:
          "Read the control posture, support framework, continuity model, and claim limitations without marketing shorthand.",
        links: [
          {
            label: "Security posture",
            description:
              "Controls for the static public surface and the separate safeguards expected in client delivery environments.",
            href: "/docs/trust/SECURITY.md",
            format: "markdown",
          },
          {
            label: "Service-level framework",
            description:
              "Severity definitions, target acknowledgement windows, exclusions, and contractual boundaries.",
            href: "/docs/trust/SLO_SLA.md",
            format: "markdown",
          },
          {
            label: "Operational continuity",
            description:
              "Handoff, credential ownership, recovery artifacts, and key-person risk controls.",
            href: "/docs/trust/CONTINUITY.md",
            format: "markdown",
          },
          {
            label: "Trust and claims policy",
            description:
              "What is verified, what is contract-scoped, and what AIAS does not claim.",
            href: "/docs/trust/TRUST.md",
            format: "markdown",
          },
        ],
      },
      {
        icon: "evidence",
        title: "Evidence and decision support",
        description:
          "Evaluate outcomes, operating metrics, engagement boundaries, and supply-chain governance.",
        links: [
          {
            label: "Case studies",
            description:
              "Outcome narratives with evidence levels, constraints, governance changes, and reusable patterns.",
            href: "/case-studies",
            format: "page",
          },
          {
            label: "What we measure",
            description:
              "Reliability, evaluation integrity, cycle-time, cost, and governance coverage definitions.",
            href: "/what-we-measure",
            format: "page",
          },
          {
            label: "Why we say no",
            description:
              "Decline criteria, misuse boundaries, and cases where an internal hire is the better answer.",
            href: "/why-we-say-no",
            format: "page",
          },
          {
            label: "Dependency governance",
            description:
              "Release audit, SBOM, license review, and remediation cadence for the public surface.",
            href: "/docs/trust/DEPENDENCY_GOVERNANCE.md",
            format: "markdown",
          },
        ],
      },
    ],
    operatingModel: {
      eyebrow: "Published commitments",
      title: "Boundaries you can plan around",
      description:
        "Public documentation describes the baseline. Signed statements of work define the enforceable scope, service levels, data handling, acceptance tests, and ownership for each engagement.",
      commitments: [
        {
          title: "Static public surface",
          detail:
            "The consultancy site renders without a database, mandatory API, account, or hidden runtime service.",
        },
        {
          title: "Client-owned operation",
          detail:
            "Handoff includes source, runbooks, decision records, credential transfer, and operator training defined by scope.",
        },
        {
          title: "Contract-scoped service levels",
          detail:
            "Response targets and support windows apply only when a signed managed-service schedule names them.",
        },
        {
          title: "Control-oriented claims",
          detail:
            "AIAS does not imply third-party certification, guaranteed outcomes, or autonomous authority without evidence and written terms.",
        },
      ],
    },
    resources: [
      {
        title: "Readiness checklist",
        description:
          "A 16-point browser scorecard with a portable markdown checklist.",
        href: "/readiness-checklist",
      },
      {
        title: "Automation simulator",
        description:
          "Trace a request through policy gates, constrained model work, and deterministic fallbacks.",
        href: "/automation-demo",
      },
      {
        title: "Engagement simulator",
        description:
          "Generate a local, exportable engagement brief from your constraints.",
        href: "/engagement-simulator",
      },
      {
        title: "FAQ",
        description:
          "Direct answers about fit, timelines, data access, deployment, and ownership.",
        href: "/faq",
      },
    ],
  },
  socials: {
    github: "https://github.com/Hardonian/AI-Automated-Systems_AIAS",
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
      lastUpdated: "September 10, 2026",
      sections: [
        {
          heading: "Overview",
          body: "We collect only the information needed to respond to inquiries, deliver consulting engagements, and improve our services. We do not sell personal data.",
        },
        {
          heading: "What We Collect",
          body: "The public site does not require an account. We may receive contact details and business context you deliberately send through email, scheduling links, or the optional intake flow, plus limited website analytics when enabled. Do not submit sensitive, regulated, financial, or production data through public forms.",
        },
        {
          heading: "How We Use Data",
          body: "We use information to respond to requests, assess engagement fit, deliver contracted work, protect the service, and improve our materials. Public intake classification runs in the browser; if an optional third-party webhook is configured, the form identifies the downstream submission path before use.",
        },
        {
          heading: "Providers and Cross-Border Processing",
          body: "Hosting, analytics, email, scheduling, and client-approved delivery providers may process information under their own terms and in the regions they operate. Data residency, subprocessors, access controls, and transfer requirements for client work are defined in the signed engagement documents.",
        },
        {
          heading: "Retention and Security",
          body: "We keep inquiry and engagement records only as long as reasonably needed for communication, delivery, security, legal obligations, and defensible business records. Safeguards are proportionate to the data and contracted scope; no public-site statement should be read as a certification or guarantee of absolute security.",
        },
        {
          heading: "Cookies and Analytics",
          body: "The site may use essential browser storage for interface preferences and optional privacy-conscious analytics for aggregate performance. You can restrict storage and analytics through browser controls, although some preferences may no longer persist.",
        },
        {
          heading: "Your Rights",
          body: "Subject to applicable law and legitimate retention obligations, you can request access, correction, or deletion of information associated with you by emailing inquiries@aiautomatedsystems.ca. We may need to verify the request before acting.",
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      lastUpdated: "September 10, 2026",
      sections: [
        {
          heading: "Engagement Scope",
          body: "Consulting services are scoped per engagement statement and require mutual agreement before work begins. Deliverables and timelines are outlined in writing.",
        },
        {
          heading: "Client Responsibilities",
          body: "Clients provide accurate requirements, timely stakeholder and system access, and qualified review of outputs. Clients remain responsible for production deployment, policy acceptance, lawful data use, and high-impact decisions unless a signed agreement explicitly reallocates a responsibility.",
        },
        {
          heading: "Confidentiality",
          body: "Both parties agree to keep confidential information private and secure. We handle data in line with PIPEDA-informed practices.",
        },
        {
          heading: "Advisory and AI Output Boundary",
          body: "Public content, simulations, calculator results, and AI-assisted outputs are informational and may contain errors or context mismatch. They are not legal, financial, compliance, or production advice. Deterministic acceptance obligations exist only when a signed scope defines them.",
        },
        {
          heading: "Outcomes and Service Levels",
          body: "Case-study results, delivery timelines, performance examples, and modeled savings are context-dependent and not universal guarantees. Availability, response targets, remedies, and support windows apply only when they are written into an executed service schedule.",
        },
        {
          heading: "Intellectual Property",
          body: "Unless the parties agree otherwise in writing, the client owns bespoke deliverables developed and paid for under the engagement. AIAS retains pre-existing methods, reusable frameworks, templates, tools, and generalized know-how. Third-party and open-source materials remain subject to their respective licenses.",
        },
        {
          heading: "Security and Compliance Claims",
          body: "AIAS describes control-oriented practices but does not claim SOC 2, ISO 27001, PIPEDA certification, or another independent attestation unless a current verification is explicitly named. Client-specific compliance conclusions require the client's legal and compliance review.",
        },
        {
          heading: "Case Studies and Confidentiality",
          body: "AIAS does not publish confidential client details without permission or another lawful basis. Published examples may be sanitized, aggregated, or described as patterns; each case study should be read with its stated evidence level and constraints.",
        },
        {
          heading: "Liability",
          body: "To the maximum extent permitted by applicable law, liability is limited as defined in the executed agreement and non-waivable legal obligations continue to apply. Public website content does not create a warranty or service contract.",
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

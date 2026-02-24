import { z } from 'zod';

import { MESSAGING_CONTRACT } from '@/content/constants';

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
        type: 'select' | 'textarea' | 'text';
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
    name: 'AIAS',
    tagline: MESSAGING_CONTRACT.primaryTagline,
    description: MESSAGING_CONTRACT.positioningSentence,
  },
  positioning: {
    subheading: MESSAGING_CONTRACT.heroSubheading,
    badgeText: 'New: Agentic Workflow Engine',
    impactCardsLabel: 'At-a-glance impact',
    primaryCTA: {
      label: 'Book Diagnostic',
      href: 'https://calendly.com/scottrmhardie',
    },
    secondaryCTA: {
      label: 'What AIAS Actually Does',
      href: '/what-aias-does',
    },
    socialProof: [
      { icon: '🚀', text: 'Faster delivery through scoped automation' },
      { icon: '🔒', text: 'Security-first delivery posture' },
      { icon: '⚡', text: 'Operational time savings in qualified workflows' },
      { icon: '🎯', text: 'Deterministic Workflows' },
    ],
    trustBadges: [
      { icon: 'shield', text: 'SOC 2-aligned control practices' },
      { icon: 'globe', text: 'Global Scale' },
      { icon: 'check', text: 'PIPEDA-informed data handling' },
    ],
  },
  navigation: {
    primary: [
      { label: 'Services', href: '/services' },
      { label: 'Metrics', href: '/metrics' },
      { label: 'What AIAS Does', href: '/what-aias-does' },
      { label: 'How We Work', href: '/how-it-works' },
      { label: 'Framework', href: '/framework' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Ecosystem', href: '/ecosystem' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
    ],
    resources: [
      { label: 'About', href: '/about' },
      { label: 'Insights', href: '/blog' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Automation Demo', href: '/automation-demo' },
      { label: 'Diagnostic', href: '/diagnostic' },
      { label: 'Readiness Checklist', href: '/readiness-checklist' },
      { label: 'What We Measure', href: '/what-we-measure' },
      { label: 'ROI Calculator', href: '/roi-calculator' },
      { label: 'Build Log', href: '/build-log' },
      { label: 'Blueprints', href: '/blueprints' },
      { label: 'Engagement Simulator', href: '/engagement-simulator' },
      { label: 'Methodology', href: '/methodology' },
      { label: 'Certification', href: '/certification' },
      { label: 'Why We Say No', href: '/why-we-say-no' },
      { label: 'How It Works', href: '/how-it-works' },
    ],
  },
  contact: {
    email: 'scottrmhardie@gmail.com',
    responseTime: 'Replies within 2 business days.',
  },
  services: [
    {
      title: 'AI Clarity Audit',
      description: 'Decision-surface and constraint analysis to de-risk AI implementation before build execution.',
      outcome: 'A practical roadmap showing where automation should and should not be applied.',
      deliverables: ['Decision Surface Map', 'Constraint Register', 'Failure Mode Matrix', 'Implementation Brief'],
      icon: 'Cpu',
    },
    {
      title: 'Stabilization Sprint',
      description: 'Rapid hardening of fragile AI workflows with deterministic controls and incident playbooks.',
      outcome: 'Higher reliability with fewer production exceptions and clearer operator ownership.',
      deliverables: ['Failure Triage', 'Control Layer Updates', 'Escalation Paths', 'Reliability Review'],
      icon: 'Workflow',
    },
    {
      title: 'Governance Architecture',
      description: 'Control-plane design for policy enforcement, escalation design, and accountability boundaries.',
      outcome: 'Governed AI operations with auditability and decision transparency built in.',
      deliverables: ['Governance Blueprint', 'Control Mapping', 'Audit Logging Model', 'Ownership Matrix'],
      icon: 'Database',
    },
    {
      title: 'Strategic Advantage Program',
      description: 'Ongoing advisory and delivery support for teams scaling AI capabilities across core operations.',
      outcome: 'Compounding operational gains tied to business priorities, not tool hype.',
      deliverables: ['Quarterly Architecture Reviews', 'Capability Roadmap', 'Model Portfolio Strategy', 'Executive Briefings'],
      icon: 'ShieldCheck',
    },
  ],
  process: [
    {
      step: 1,
      title: 'Discover',
      description: 'We map your existing value stream and identify high-impact friction points.',
    },
    {
      step: 2,
      title: 'Map',
      description: 'We design a deterministic workflow architecture before writing a line of code.',
    },
    {
      step: 3,
      title: 'Automate',
      description: 'We build and deploy targeted agents to handle the heavy lifting.',
    },
    {
      step: 4,
      title: 'Ship',
      description: 'Rigorous testing and staged rollout to ensure zero disruption.',
    },
    {
      step: 5,
      title: 'Monitor',
      description: 'Real-time telemetry and feedback loops for continuous improvement.',
    },
  ],
  agenticWorkflow: {
    heroImage: '/images/workflow-diagram.svg',
    steps: [
      {
        title: 'Input Analysis',
        description: 'The agent ingests unstructured data and classifies the intent.',
        inputs: ['Email', 'PDF', 'Form Data'],
        outputs: ['Structured JSON', 'Intent Label'],
      },
      {
        title: 'Plan Generation',
        description: 'A deterministic planner selects the right tools for the job.',
        inputs: ['Intent', 'Context'],
        outputs: ['Execution Plan', 'Tool Selection'],
      },
      {
        title: 'Execution & Verification',
        description: 'Tools are executed with strict output validation.',
        inputs: ['Plan', 'API Keys'],
        outputs: ['Verified Result', 'Audit Log'],
      },
    ],
  },
  workflowSandbox: {
    title: 'Experience the Workflow Engine',
    description:
      'Interact with a client-side simulation of our agentic planner. See how we turn vague inputs into structured action plans—deterministically.',
    ctaLabel: 'Generate Plan',
    inputForm: {
      title: 'Define the Challenge',
      fields: [
        {
          id: 'problem',
          label: 'Problem Domain',
          type: 'select',
          options: [
            'Invoice Processing',
            'Customer Support Triaging',
            'Data Enrichment',
            'Quality Assurance Review',
          ],
        },
        {
          id: 'constraints',
          label: 'Constraints (e.g. "Must keep human in loop")',
          type: 'text',
        },
        {
          id: 'stack',
          label: 'Current Tech Stack',
          type: 'text',
        },
      ],
      submitLabel: 'Simulate Workflow',
    },
    output: {
      title: 'Simulation Results',
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
    title: 'Our Secret Sauce: Determinism with Enterprise Craft',
    description:
      'Every engagement is anchored in predictable workflows, auditable decisions, and shared ownership. We build systems your team can trust, operate, and extend long after launch.',
    pillars: [
      {
        title: 'Deterministic Planning Layer',
        description:
          'We map the workflow before automation starts, so every step has explicit inputs, gates, and fallbacks.',
        highlights: [
          'Workflow blueprints with state transitions',
          'Human-in-the-loop checkpoints',
          'Versioned decision logic and audit trails',
        ],
      },
      {
        title: 'Operational Reliability',
        description:
          'We optimize for uptime, safety, and observability so leaders can track outcomes without guesswork.',
        highlights: [
          'Error budgets and escalation paths',
          'Telemetry dashboards and alerting',
          'Security-first data handling',
        ],
      },
      {
        title: 'Client Enablement',
        description:
          'Your team receives playbooks, training, and artifacts to run the system without dependency on us.',
        highlights: [
          'Runbooks + SOPs tailored to each workflow',
          'Team training sessions and enablement decks',
          'Executive summaries for stakeholder alignment',
        ],
      },
    ],
  },
  optimizationHotspots: {
    title: 'Hot Path Optimizations We Deliver',
    description:
      'We prioritize the highest-throughput workflows first, then harden the paths that unlock the most compounding ROI.',
    areas: [
      {
        title: 'Intake & Data Quality',
        impact: 'Reduce time-to-action by eliminating noisy or incomplete inputs.',
        improvements: [
          'Schema validation + enrichment rules',
          'Automated data deduplication',
          'Confidence scoring with escalation paths',
        ],
      },
      {
        title: 'Decision & Routing Logic',
        impact: 'Ensure every request hits the right workflow, tool, and human owner.',
        improvements: [
          'Deterministic routing matrices',
          'Fallback playbooks when confidence dips',
          'Cross-team handoff automation',
        ],
      },
      {
        title: 'Execution & Monitoring',
        impact: 'Protect against drift while keeping delivery timelines fast.',
        improvements: [
          'Execution guardrails with rollback paths',
          'Real-time metrics tied to outcomes',
          'Post-run reviews with improvement backlog',
        ],
      },
      {
        title: 'Change Management',
        impact: 'Keep humans aligned while systems scale.',
        improvements: [
          'Stakeholder-ready change logs',
          'Training and enablement checklists',
          'Quarterly optimization sprints',
        ],
      },
    ],
  },
  testimonials: [
    {
      quote: "AIAS helped us reduce our manual data entry load by 80% in just three weeks. The system is rock solid.",
      author: "Sarah J.",
      role: "Operations Director",
      company: "Logistics Co.",
    },
    {
      quote: "Finally, an AI consultancy that understands engineering rigor. No hallucinations, just results.",
      author: "Michael T.",
      role: "CTO",
      company: "FinTech Corp.",
    }
  ],
  caseStudies: [
    {
      title: 'AI Content Workflows for Settler',
      client: 'Settler',
      challenge: 'Manual GTM and content workflows were slowing launches and follow-up cadence.',
      solution: 'Implemented automation-ready operating patterns and advisory sprints for execution consistency.',
      results: ['Faster campaign iterations', 'Clearer operating playbooks', 'Reduced manual coordination overhead'],
      projectUrl: 'https://settler.dev/?utm_source=aias&utm_medium=case-study&utm_campaign=website',
      logoSrc: '/images/case-studies/settler-logo.svg',
      thumbnailSrc: '/images/case-studies/settler-thumb.svg',
    },
    {
      title: 'Ready Layer Automation Enablement',
      client: 'Ready Layer',
      challenge: 'Needed a structured automation roadmap with practical implementation guardrails.',
      solution: 'Delivered phased engagement planning, technical advisory, and prioritized workflow opportunities.',
      results: ['Prioritized automation backlog', 'Improved delivery confidence', 'Stronger systems alignment'],
      projectUrl: 'https://ready-layer.com/?utm_source=aias&utm_medium=case-study&utm_campaign=website',
      logoSrc: '/images/case-studies/ready-layer-logo.svg',
      thumbnailSrc: '/images/case-studies/ready-layer-thumb.svg',
    }
  ],
  faq: [
    {
      question: 'How is this different from standard chatbots?',
      answer: 'We build deterministic, workflow-centric agents. Unlike generic chatbots, our systems are designed to execute specific business processes reliably and repeatably.',
    },
    {
      question: 'Do you require access to our private data?',
      answer: 'We design systems that run within your infrastructure or using secure, compliant APIs. Data privacy and security are our top priorities.',
    },
    {
      question: 'What is the typical engagement timeline?',
      answer: 'Our "Discover to Pilot" cycle is typically 2-4 weeks. Full production rollout depends on complexity but usually follows within 4-8 weeks.',
    },
    {
      question: 'Do you support on-premise deployment?',
      answer: 'Yes. We specialize in containerized, edge-ready deployments for clients with strict data residency requirements.',
    }
  ],
  routeFaqs: {
    ecosystem: [
      {
        question: 'How do Reach, Zeo, and Settler fit into ecosystem delivery?',
        answer: 'Reach supports demand and strategy, Zeo executes implementation, and Settler operationalizes deployment and governance handoff.',
      },
      {
        question: 'Do you treat AI models as system-of-record controllers?',
        answer: 'No. Deterministic control layers own policy and state transitions. AI layers operate as constrained advisors with explicit guardrails.',
      },
      {
        question: 'Can the ecosystem run in regulated deployment models?',
        answer: 'Yes. We support self-hosted, managed, and federated operating models with policy inheritance and auditability requirements.',
      },
    ],
    services: [
      {
        question: 'How do you scope services without fixed packages?',
        answer: 'We scope from constraints, governance obligations, and expected outcomes, then define a smallest-safe rollout path.',
      },
      {
        question: 'What happens after delivery?',
        answer: 'Every engagement includes handoff artifacts, ownership clarity, and operational checkpoints for sustained reliability.',
      },
      {
        question: 'Do service engagements stay static-first?',
        answer: 'Yes. Public routes remain static-first while automation logic uses deterministic client-safe patterns unless explicit backend requirements are approved.',
      },
    ],
    automationWeb: [
      {
        question: 'Why prioritize static-first website automation?',
        answer: 'Static-first improves reliability, keeps performance predictable, and reduces operational surface area for marketing routes.',
      },
      {
        question: 'How is intake governance enforced on web automation builds?',
        answer: 'We use deterministic classification rules, policy checkpoints, and explicit escalation paths before high-impact transitions.',
      },
    ],
    appAiSystems: [
      {
        question: 'How do you balance deterministic execution with AI flexibility?',
        answer: 'Deterministic layers enforce contracts and policies; AI layers provide bounded recommendations that require validation before execution.',
      },
      {
        question: 'Can app orchestration be audited after incidents?',
        answer: 'Yes. We design replayable logs and governance artifacts to support post-incident review and enterprise reporting.',
      },
    ],
  },
  servicesPage: {
    hero: {
      eyebrow: 'Services',
      title: 'Deterministic automation services built for production teams',
      description:
        'Each service includes clear deliverables, documented handoff, and governance guardrails so your team can run confidently after launch.',
    },
    engagementInclusions: {
      title: 'What you get in every engagement',
      items: [
        'Workflow map with decision points and fallback paths',
        'Implementation artifacts your operators can review and own',
        'Risk controls, observability baselines, and launch checklist',
        'Enablement session to transfer capability into your team',
      ],
      processLinkLabel: 'Review delivery process',
      processLinkHref: '/process',
    },
    workflowView: {
      title: 'Workflow view',
      description:
        'We standardize around input validation, deterministic routing, controlled execution, and human escalation on low-confidence branches.',
    },
    cta: {
      title: 'Need a service mix tailored to your operating model?',
      description:
        'Start with a strategy call and we will scope the smallest practical rollout for your team.',
      primaryLabel: 'Book a strategy call',
      secondaryLabel: 'View engagement shapes',
      secondaryHref: '/pricing',
    },
  },
  ecosystemPage: {
    hero: {
      eyebrow: 'Ecosystem architecture',
      title: 'How AIAS connects strategy to reliable automation delivery',
      description:
        'The ecosystem aligns advisory, implementation, and deployment operations without sacrificing deterministic controls.',
    },
    diagram: {
      title: 'Layered system diagram',
      nodes: ['Client', 'AIAS Advisory', 'Reach', 'Zeo', 'Settler'],
    },
    lifecycle: ['Strategy', 'Design', 'Build', 'Automate', 'Govern', 'Scale'],
    narrative: {
      determinismVsIntelligence: {
        title: 'Determinism vs intelligence',
        body: 'Deterministic systems own state transitions, validation, and policy enforcement. Intelligence layers propose, summarize, and optimize within strict contracts. The result is explainable automation with controlled risk.',
      },
      deploymentModels: {
        title: 'Deployment models',
        items: [
          'Self-hosted: full infrastructure control and custom compliance boundaries.',
          'Managed: AIAS operates delivery with agreed service and governance terms.',
          'Federated: shared control across teams or regulated entities with policy inheritance.',
        ],
      },
      governancePrinciples: {
        title: 'Governance principles',
        items: [
          'Policy before execution.',
          'Human review for high-impact actions.',
          'Auditable run artifacts and deterministic replay.',
          'Explicit non-fit criteria to avoid unsafe deployments.',
        ],
      },
    },
  },
  metricsPage: {
    hero: {
      eyebrow: 'Automation proof',
      title: 'Measured outcomes from deterministic automation programs',
      description:
        'Representative benchmark data across delivery cohorts showing latency, conversion, reliability, and governance performance.',
    },
    statGroups: [
      {
        category: 'Automation latency reduction',
        period: 'Q1-Q4 benchmark cohort',
        metrics: [
          {
            label: 'Lead intake-to-triage time',
            value: '42s median',
            delta: '-78%',
            note: 'From 3m 10s manual review baseline',
          },
          {
            label: 'Exception routing turnaround',
            value: '2.8 min',
            delta: '-64%',
            note: 'Across finance and support automations',
          },
        ],
      },
      {
        category: 'Conversion improvements',
        period: '90-day post-launch average',
        metrics: [
          {
            label: 'Qualified form conversion',
            value: '11.4%',
            delta: '+3.6 pts',
            note: 'Governed routing and intent enrichment',
          },
          {
            label: 'Demo-to-opportunity progression',
            value: '37%',
            delta: '+9 pts',
            note: 'Faster follow-up with deterministic handoff',
          },
        ],
      },
      {
        category: 'Execution reliability stats',
        period: 'Last 30 days',
        metrics: [
          {
            label: 'Workflow success rate',
            value: '99.2%',
            delta: '+1.1 pts',
            note: 'After fallback and retry hardening',
          },
          {
            label: 'Mean time to recovery (MTTR)',
            value: '7m 40s',
            delta: '-52%',
            note: 'Alerting + runbook automation applied',
          },
        ],
      },
      {
        category: 'Governance coverage metrics',
        period: 'Control framework v2',
        metrics: [
          {
            label: 'Policy-gated transitions',
            value: '100%',
            delta: '+12 pts',
            note: 'No uncontrolled high-impact actions',
          },
          {
            label: 'Replayable audit artifacts',
            value: '98.7%',
            delta: '+18 pts',
            note: 'Gap is legacy run payload normalization',
          },
        ],
      },
    ],
    efficiencyComparisons: [
      {
        workflow: 'Revenue operations triage',
        before: 'Manual queue sorting every 2 hours',
        after: 'Deterministic triage with AI-assisted enrichment in 45 seconds',
        impact: '88% faster first-response loop and higher lead SLA adherence',
      },
      {
        workflow: 'Invoice exception handling',
        before: 'Spreadsheet reconciliation and email routing',
        after: 'Rule-based exception classification with confidence thresholds',
        impact: '61% lower handling effort and fewer escalations',
      },
      {
        workflow: 'Support escalation governance',
        before: 'Ad-hoc analyst judgment and delayed approvals',
        after: 'Policy-gated escalation paths with review checkpoints',
        impact: '43% reduction in escalation cycle time and full audit visibility',
      },
    ],
  },
  roiCalculatorPage: {
    hero: {
      eyebrow: 'ROI calculator',
      title: 'Estimate automation impact for your operating team',
      description:
        'Use your current workload and automation maturity to model annual time and cost savings.',
    },
    assumptions: [
      'Assumes 48 active working weeks per year.',
      'Cost baseline uses blended operations and management effort assumptions.',
      'Automation maturity applies fixed multipliers (35%, 55%, 75%) to manual hours eliminated.',
      'Break-even estimate uses a fixed $48,000 implementation baseline.',
    ],
  },
  howItWorksPage: {
    hero: {
      eyebrow: 'System transparency',
      title: 'How our automation delivery model works in production',
      description:
        'A transparent view of tooling, governance, security controls, and deployment patterns used in AIAS programs.',
    },
    sections: [
      {
        title: 'Tooling stack',
        description:
          'Static-first web delivery, deterministic orchestration, and typed configuration ensure predictable releases.',
        bullets: [
          'Next.js App Router + TypeScript for static-first user routes',
          'Schema-validated content and route metadata checks in CI',
          'Playwright suites for visual, UX consistency, and accessibility regression',
        ],
      },
      {
        title: 'Governance',
        description:
          'Controls are applied before execution, not after incidents, to keep automation bounded and auditable.',
        bullets: [
          'Policy gates on high-impact transitions',
          'Human-in-the-loop reviews for low-confidence actions',
          'Replayable run artifacts for post-incident analysis',
        ],
      },
      {
        title: 'Security',
        description:
          'Security is designed into architecture, access paths, and operational playbooks from day one.',
        bullets: [
          'Least-privilege connector permissions',
          'Tenant-aware boundary and data handling conventions',
          'Structured escalation and incident response checkpoints',
        ],
      },
      {
        title: 'Deployment models',
        description:
          'Delivery can be mapped to your risk profile and compliance posture without changing core governance controls.',
        bullets: [
          'Self-hosted for strict infrastructure control',
          'Managed for operator-light rollout paths',
          'Federated for multi-entity policy inheritance',
        ],
      },
    ],
    boundaryModel: [
      {
        layer: 'Intake and classification',
        deterministicBoundary: 'Schema validation, required fields, and policy checks run first.',
        aiBoundary: 'AI enriches intent and context only within validated payload contracts.',
      },
      {
        layer: 'Decision and orchestration',
        deterministicBoundary: 'State transitions, approvals, and routing rules are explicit and replayable.',
        aiBoundary: 'AI proposes ranked actions when confidence thresholds and policy allow.',
      },
      {
        layer: 'Execution and reporting',
        deterministicBoundary: 'Connector permissions, audit logs, and rollback paths are pre-defined.',
        aiBoundary: 'AI summarizes outcomes and anomalies without bypassing control gates.',
      },
    ],
  },
  socials: {
    twitter: 'https://twitter.com/aias_platform',
    linkedin: 'https://linkedin.com/company/aias-platform',
    github: 'https://github.com/shardie-github/aias',
  },
  footer: {
    tagline: MESSAGING_CONTRACT.primaryTagline,
    copyright: '© 2026 AI Automated Systems. All rights reserved.',
    legalLinks: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
  legal: {
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'January 2026',
      sections: [
        {
          heading: 'Overview',
          body:
            'We collect only the information needed to respond to inquiries, deliver consulting engagements, and improve our services. We do not sell personal data.',
        },
        {
          heading: 'What We Collect',
          body:
            'Contact details you provide via email or scheduling links, plus usage analytics for our website. We avoid collecting sensitive data unless explicitly required for an engagement.',
        },
        {
          heading: 'How We Use Data',
          body:
            'We use data to respond to requests, manage projects, and deliver operational insights. Data is retained only as long as needed for the engagement and compliance requirements.',
        },
        {
          heading: 'Your Rights',
          body:
            'You can request access, updates, or deletion of your information by emailing scottrmhardie@gmail.com.',
        },
      ],
    },
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'January 2026',
      sections: [
        {
          heading: 'Engagement Scope',
          body:
            'Consulting services are scoped per engagement statement and require mutual agreement before work begins. Deliverables and timelines are outlined in writing.',
        },
        {
          heading: 'Client Responsibilities',
          body:
            'Clients provide timely access to required stakeholders, data, and systems. Delays in access may affect timelines and outcomes.',
        },
        {
          heading: 'Confidentiality',
          body:
            'Both parties agree to keep confidential information private and secure. We handle data in line with PIPEDA-informed practices.',
        },
        {
          heading: 'Liability',
          body:
            'We strive for reliable systems, but final deployment decisions remain with the client. Liability is limited to the fees paid for the applicable engagement.',
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
      })
    ),
    trustBadges: z.array(
      z.object({
        icon: z.string().min(1),
        text: z.string().min(1),
      })
    ),
  }),
  contact: z.object({
    email: z.string().email(),
    responseTime: z.string().min(1),
  }),
  navigation: z.object({
    primary: z.array(z.object({ label: z.string().min(1), href: z.string().min(1) })).min(1),
    resources: z.array(z.object({ label: z.string().min(1), href: z.string().min(1) })).min(1),
  }),
});

const parsedSiteContent = siteContentSchema.safeParse(rawSiteContent);

if (!parsedSiteContent.success && process.env.NODE_ENV !== 'production') {
  console.warn('Invalid site content configuration detected.', parsedSiteContent.error.flatten());
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

  if (calendlyHref.startsWith('https://calendly.com/')) {
    return calendlyHref;
  }

  if (
    calendlyHref.startsWith('http://') ||
    calendlyHref.startsWith('https://') ||
    calendlyHref.startsWith('mailto:')
  ) {
    return calendlyHref;
  }

  return `mailto:${siteContent.contact.email}`;
};

export const getContactEmailHref = (): string => `mailto:${siteContent.contact.email}`;

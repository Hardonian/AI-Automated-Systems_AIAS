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
    primaryCTA: {
      label: string;
      href: string;
    }; // Consult/Sales
    secondaryCTA: {
      label: string;
      href: string;
    }; // Demo/Sandbox
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
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
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

export const siteContent: SiteConfig = {
  brand: {
    name: 'AIAS Platform',
    tagline: 'Enterprise-Grade AI Automation. Built in Canada.',
    description:
      'We architect and deploy custom AI platforms that save Canadian businesses 10+ hours per week per employee.',
  },
  positioning: {
    subheading:
      'Stop playing with chatbots. Start building intelligent, deterministic workflows that drive real ROI.',
    primaryCTA: {
      label: 'Book a Strategy Call',
      href: 'https://calendly.com/aias-consulting/strategy-call',
    },
    secondaryCTA: {
      label: 'Try the Workflow Sandbox',
      href: '/#workflow-sandbox',
    },
  },
  navigation: {
    primary: [
      { label: 'Services', href: '/#services' },
      { label: 'Process', href: '/#process' },
      { label: 'Proof', href: '/#proof' },
      { label: 'Secret Sauce', href: '/#secret-sauce' },
      { label: 'FAQ', href: '/#faq' },
    ],
    resources: [
      { label: 'Workflow Sandbox', href: '/#workflow-sandbox' },
      { label: 'Example Engagements', href: '/#engagements' },
      { label: 'Insights', href: '/blog' },
    ],
  },
  contact: {
    email: 'hello@aiautomatedsystems.ca',
    responseTime: 'Replies within 2 business days.',
  },
  services: [
    {
      title: 'AI Agent Architecture',
      description: 'Custom-built agentic systems designed for your specific business logic.',
      outcome: 'Autonomous systems that handle complex tasks with human oversight.',
      deliverables: ['Agent Kernel', 'Tool Definitions', 'Guardrails Code', 'Deployment Pipeline'],
      icon: 'Cpu',
    },
    {
      title: 'Workflow Automation',
      description: 'End-to-end process orchestration connecting your existing tools.',
      outcome: 'Seamless data flow and reduced manual data entry.',
      deliverables: ['Process Map', 'Automation Scripts', 'Error Handling Protocols', 'Monitoring Dashboard'],
      icon: 'Workflow',
    },
    {
      title: 'Systems & Data Strategy',
      description: 'Preparing your data infrastructure for the AI era.',
      outcome: 'Clean, accessible data ready for high-performance retrieval.',
      deliverables: ['Data Schema Optimization', 'Vector Database Setup', 'Knowledge Graph Design'],
      icon: 'Database',
    },
    {
      title: 'Enterprise Security & Compliance',
      description: 'Ensuring your AI implementation meets strict regulatory standards.',
      outcome: 'Compliant, secure AI systems ready for enterprise deployment.',
      deliverables: ['Security Audit', 'PIPEDA/SOC 2 Artifacts', 'Access Control Policies'],
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
      quote: "Finally, an AI consultancy that understands engineering rigor. No halluncinations, just results.",
      author: "Michael T.",
      role: "CTO",
      company: "FinTech Corp.",
    }
  ],
  caseStudies: [
    {
      title: 'Automated Invoice Reconciliation',
      client: 'National Retailer',
      challenge: 'Manual processing of 5,000+ monthly invoices with 12% error rate.',
      solution: 'Deployed a multi-agent system to extract, validate, and sync invoice data to ERP.',
      results: ['99.8% Accuracy', '400 hours/month saved', 'Real-time fraud detection'],
    },
    {
      title: 'Intelligent Customer Triage',
      client: 'SaaS Platform',
      challenge: 'Support team overwhelmed by L1 tickets.',
      solution: 'Implemented an intent-classification agent with deterministic routing.',
      results: ['60% auto-resolution', '2min average response time', 'CSAT increased by 15 points'],
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
  socials: {
    twitter: 'https://twitter.com/aias_platform',
    linkedin: 'https://linkedin.com/company/aias-platform',
    github: 'https://github.com/shardie-github/aias',
  },
  footer: {
    tagline: 'Engineering the future of work, one workflow at a time.',
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
            'You can request access, updates, or deletion of your information by emailing hello@aiautomatedsystems.ca.',
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

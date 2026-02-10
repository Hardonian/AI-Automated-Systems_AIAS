export interface SiteConfig {
  brand: {
    name: string;
    tagline: string;
    description: string;
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
      href: '#workflow-sandbox',
    },
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
          options: ['Invoice Processing', 'Customer Support Triaging', 'Data Enrichment', 'c'],
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
};

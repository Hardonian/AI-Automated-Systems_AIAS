/**
 * Centralized content source for the static AIAS Platform website.
 * All user-facing copy, service descriptions, and example data are sourced here.
 */

export const siteContent = {
  brand: {
    name: 'AIAS Platform',
    tagline: 'Enterprise-Grade AI Automation. Built in Canada.',
  },
  positioning: {
    subheading:
      'We architect and deploy custom AI platforms that save Canadian businesses 10+ hours per week.',
    primaryCTA: {
      label: 'Book a Strategy Call',
      href: 'https://calendly.com/aias-consulting/strategy-call', // External link for consultancy
    },
    secondaryCTA: {
      label: 'Explore Our Workflow Sandbox',
      href: '/workflow-sandbox', // Internal route for deterministic demo
    },
  },
  services: [
    {
      title: 'AI Agent Design & Deployment',
      outcome: 'Intelligent automation that understands your business context.',
      deliverables:
        'Custom AI Agent Kernel, Tool Integration Blueprint, Performance Benchmarks',
      icon: 'Sparkles', // Placeholder for icon name
    },
    {
      title: 'Holistic Workflow Automation',
      outcome: 'End-to-end process optimization across all your tools.',
      deliverables:
        '6-Perspective Process Map, Automated Workflow Suite, Error Recovery Plan',
      icon: 'Workflow',
    },
    {
      title: 'Systems Thinking Consulting',
      outcome: 'Strategic clarity to solve root causes, not symptoms.',
      deliverables:
        'Value Stream Map (VSM), Causal Loop Diagrams, Leverage Point Analysis',
      icon: 'BrainCircuit',
    },
    {
      title: 'Enterprise Security & Compliance',
      outcome: 'PIPEDA/SOC 2 ready infrastructure and audit trails.',
      deliverables:
        'Security Audit Report, RLS Policy Blueprint, Compliance Documentation',
      icon: 'ShieldCheck',
    },
  ],
  workflowSandbox: {
    title: 'See Our Agentic Workflow in Action',
    description:
      'Interact with a deterministic, client-side simulation of our core workflow engine. No backend calls are made.',
    ctaLabel: 'Run Sandbox Demo',
    inputForm: {
      title: 'Describe Your Problem',
      fields: [
        {
          id: 'problem',
          label: 'Problem Type',
          type: 'select',
          options: ['Data Sync', 'Lead Qualification', 'Report Generation'],
        },
        { id: 'constraints', label: 'Key Constraints', type: 'textarea' },
        { id: 'stack', label: 'Current Tools', type: 'text' },
      ],
      submitLabel: 'Generate Plan Outline',
    },
    output: {
      title: 'Deterministic Plan Outline',
      markdownTemplate: `
## Generated Plan Outline

Based on your input, here is a high-level, deterministic plan outline:

**Problem Type:** {{problem}}

**Key Insight:** This issue requires a multi-dimensional approach addressing Process, Technology, and Data.

**Recommended Next Steps:**
1. **Process:** Simplify the input gathering process.
2. **Technology:** Integrate a dedicated validation tool (Zod-like).
3. **Automation:** Implement a 3-step workflow: Intake → Validate → Report.

**Artifacts Generated (Client-Side):**
- **Plan Outline:** This markdown report.
- **Checklist:** A checklist of next steps.
- **Export:** JSON configuration for a hypothetical workflow.
`,
      checklistTemplate:
        '1. Validate Inputs\n2. Execute Core Logic\n3. Generate Output Artifact',
      artifactJsonTemplate: JSON.stringify(
        {
          plan_id: 'sandbox-{{timestamp}}',
          status: 'generated',
          output_type: '{{problem}}',
        },
        null,
        2
      ),
    },
  },
  faq: [
    {
      question: 'What is Systems Thinking?',
      answer:
        "Systems Thinking is the methodology of analyzing problems by looking at the whole system and its interconnections, rather than just isolated parts. It's the critical skill for designing robust automation.",
    },
    {
      question: 'Is this platform Canadian?',
      answer:
        'Yes, AIAS Platform is built in Canada, adheres to PIPEDA compliance, and focuses on Canadian integrations like Shopify and Wave Accounting.',
    },
    {
      question: 'How does the workflow engine work?',
      answer:
        'The workflow engine uses a deterministic, node-based execution model with built-in error handling, retries, and circuit breakers to ensure reliability.',
    },
    {
      question: 'What is the primary CTA?',
      answer:
        "The primary call-to-action is 'Book a Strategy Call' to engage high-intent consultancy leads.",
    },
  ],
  socials: {
    twitter: 'aias_platform',
    linkedin: 'aias-platform-inc',
    website: 'https://aias-platform.com',
  },
  footer: {
    tagline: 'Built in Canada. Designed for Global Scale.',
    legalLinks: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Security', href: '/security' },
    ],
  },
};

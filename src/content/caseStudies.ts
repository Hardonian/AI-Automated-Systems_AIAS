export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  clientProblem: string;
  systemConstraints: string[];
  architectureChosen: string;
  automationLayer: string[];
  aiIntegration: string[];
  governanceDeterminism: string[];
  performanceResults: string[];
  longTermScalability: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'website-automation-system',
    title: 'Website Automation System',
    summary: 'Static-first website automation platform with deterministic intake and governed conversion flows.',
    clientProblem:
      'A consultancy website generated leads, but each inquiry required manual triage and inconsistent follow-up. Leadership needed a system that qualified demand without adding operational risk.',
    systemConstraints: [
      'Static-first build with no backend lock-in',
      'Deterministic intake routing with auditable rules',
      'No hydration mismatches across marketing routes',
      'Governance checkpoints for every transition from inquiry to engagement',
    ],
    architectureChosen:
      'AIAS implemented a static-first Next.js architecture with a client-safe intake classifier, structured JSON export, and conversion paths tied to Reach campaigns and Zeo implementation tracks.',
    automationLayer: [
      'Multi-step intake captures organization and scope signals',
      'Deterministic classifier maps requests to advisory, co-build, managed, or enterprise paths',
      'Structured payload export supports downstream execution in Settler',
    ],
    aiIntegration: [
      'AI is constrained to recommendation copy and planning suggestions',
      'Deterministic scorecard remains source of truth for engagement routing',
      'Confidence-based escalation keeps human review in loop',
    ],
    governanceDeterminism: [
      'Policy gates enforce acceptable deployment patterns',
      'Explicit fallback path when email is missing',
      'Run artifacts include timestamped JSON for compliance review',
    ],
    performanceResults: [
      'Reduced manual triage time through deterministic classification',
      'Improved conversion quality by matching requests to clear engagement models',
      'Maintained static-safe rendering and predictable build output',
    ],
    longTermScalability: [
      'Reach uses these case patterns for demand generation and qualification',
      'Zeo consumes structured outputs for system build planning',
      'Settler handles repeatable deployment and governance handoff',
    ],
  },
  {
    slug: 'app-orchestration-platform',
    title: 'App Orchestration Platform',
    summary: 'Policy-aware orchestration fabric with deterministic replay for critical workflows.',
    clientProblem:
      'A product team ran fragmented automations across tools. Reliability dropped as integrations grew, and leaders lacked confidence in replaying incidents or proving policy compliance.',
    systemConstraints: [
      'Multi-agent coordination with deterministic replay',
      'Policy enforcement before tool execution',
      'Modular deployment across self-hosted and managed environments',
    ],
    architectureChosen:
      'AIAS split orchestration into a deterministic control plane and an intelligence advisory plane. Reach handled adoption strategy, Zeo implemented agent modules, and Settler standardized deployment.',
    automationLayer: [
      'Workflow graph with explicit state transitions',
      'Execution logs stored as replayable event streams',
      'Automated retries with bounded backoff and human override',
    ],
    aiIntegration: [
      'LLM agents propose plans and enrich context only after policy checks',
      'Deterministic validators gate every generated action',
      'Fallback to deterministic path when confidence drops',
    ],
    governanceDeterminism: [
      'Central policy registry for data residency and access scopes',
      'Replay tooling for incident analysis and audit evidence',
      'Change management protocol with versioned orchestration contracts',
    ],
    performanceResults: [
      'Stabilized execution consistency across interconnected workflows',
      'Lowered incident recovery time with deterministic replay',
      'Increased trust from security and compliance stakeholders',
    ],
    longTermScalability: [
      'Modular architecture enabled phased expansion by business unit',
      'Policy model supported managed and federated operating modes',
      'Governance artifacts simplified enterprise procurement reviews',
    ],
  },
  {
    slug: 'hybrid-deterministic-ai-saas',
    title: 'Hybrid Deterministic + AI SaaS',
    summary: 'SaaS platform pairing deterministic execution engines with explainable intelligence layers.',
    clientProblem:
      'An enterprise SaaS team needed AI capabilities without compromising explainability, latency, or contractual guarantees.',
    systemConstraints: [
      'Core business logic must remain deterministic',
      'AI advisory layer cannot mutate authoritative records directly',
      'Performance budgets and p95 latency commitments enforced',
    ],
    architectureChosen:
      'AIAS designed a deterministic transaction engine with a separate AI advisory service. Reach provided go-to-market alignment, Zeo delivered platform engineering, and Settler packaged deployment controls.',
    automationLayer: [
      'Deterministic rules engine handles all committed writes',
      'AI-generated recommendations pass through validation contracts',
      'Event-driven orchestration synchronizes retries and notifications',
    ],
    aiIntegration: [
      'Advisory prompts include strict schema and confidence thresholds',
      'Explanations are generated alongside recommendation outputs',
      'Human operators approve high-impact actions',
    ],
    governanceDeterminism: [
      'Immutable audit logs track recommendation-to-action lifecycle',
      'Explainability artifacts included in customer success workflows',
      'Known limitations documented in customer-facing governance docs',
    ],
    performanceResults: [
      'Maintained deterministic latency profile under increased load',
      'Expanded product capability without breaching reliability SLAs',
      'Improved enterprise confidence through transparent guardrails',
    ],
    longTermScalability: [
      'Architecture supports federated deployments for regulated clients',
      'Deterministic core simplifies future model upgrades',
      'Shared ecosystem patterns keep Reach and Zeo services aligned',
    ],
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

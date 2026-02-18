export type BuildLogCategory = 'ship' | 'fix' | 'experiment' | 'kill' | 'learn';

export interface BuildLogEntry {
  date: string;
  title: string;
  summary: string;
  category: BuildLogCategory;
  links?: Array<{ label: string; href: string }>;
}

export interface BuildLogWeek {
  weekOf: string;
  entries: BuildLogEntry[];
}

export interface Blueprint {
  slug: string;
  title: string;
  summary: string;
  tags: Array<'governance' | 'deterministic workflows' | 'agent orchestration' | 'execution fabric' | 'system hardening'>;
  problem: string;
  constraints: string[];
  architectureNodes: string[];
  implementationNotes: string[];
  downloadPath: string;
}

export interface OperatorLead {
  account: string;
  stage: 'intake' | 'scoping' | 'pilot' | 'governance-review' | 'active';
  riskScore: number;
  owner: string;
  notes: string;
}

export const buildLogWeeks: BuildLogWeek[] = [
  {
    weekOf: '2026-02-10',
    entries: [
      {
        date: '2026-02-14',
        title: 'Released public engagement simulator',
        summary: 'Shipped self-serve qualification flow that produces deterministic engagement briefs.',
        category: 'ship',
        links: [{ label: 'Engagement simulator', href: '/engagement-simulator' }],
      },
      {
        date: '2026-02-13',
        title: 'Removed non-deterministic copy from CTA stack',
        summary: 'Killed language that implied unsupervised autonomy and aligned to governance-first framing.',
        category: 'kill',
      },
      {
        date: '2026-02-12',
        title: 'Improved metadata coverage for resource routes',
        summary: 'Fixed metadata gaps to prevent SEO drift across new moat pages.',
        category: 'fix',
      },
      {
        date: '2026-02-11',
        title: 'Tested onboarding question order variants',
        summary: 'Experiment showed risk-profile prompts early in the flow improve qualified intent signal quality.',
        category: 'experiment',
      },
      {
        date: '2026-02-10',
        title: 'Codified risk communication pattern',
        summary: 'Learned that explicit downside language increases enterprise stakeholder trust during discovery.',
        category: 'learn',
      },
    ],
  },
  {
    weekOf: '2026-02-03',
    entries: [
      {
        date: '2026-02-07',
        title: 'Published methodology whitepaper',
        summary: 'Shipped a rigorous methodology document clarifying deterministic boundaries and deployment models.',
        category: 'ship',
        links: [{ label: 'Methodology', href: '/methodology' }],
      },
      {
        date: '2026-02-05',
        title: 'Retired duplicated service narrative blocks',
        summary: 'Killed repeated messaging that created terminology drift between services and ecosystem pages.',
        category: 'kill',
      },
      {
        date: '2026-02-04',
        title: 'Added messaging consistency contract checks',
        summary: 'Learned that fail-fast copy checks prevent regressions without slowing static builds.',
        category: 'learn',
      },
    ],
  },
];

export const blueprints: Blueprint[] = [
  {
    slug: 'governed-intake-router',
    title: 'Governed Intake Router',
    summary: 'Deterministic qualification and engagement routing for advisory, co-build, and managed modes.',
    tags: ['governance', 'deterministic workflows', 'agent orchestration'],
    problem:
      'Lead qualification often collapses into manual interpretation, delaying response times and creating inconsistent engagement recommendations.',
    constraints: [
      'No backend dependency for first-pass qualification',
      'Deterministic classification with transparent scoring',
      'Human override for edge cases and high-risk accounts',
    ],
    architectureNodes: ['Inbound form', 'Deterministic scorer', 'Risk policy gates', 'Engagement recommendation'],
    implementationNotes: [
      'Use weighted criteria with explicit thresholds to avoid opaque recommendations.',
      'Emit JSON artifacts for downstream operator workflows and reproducible audit trails.',
      'Keep channel and risk questions near the beginning of flows for better branch precision.',
    ],
    downloadPath: '/blueprints/governed-intake-router.md',
  },
  {
    slug: 'execution-fabric-control-plane',
    title: 'Execution Fabric Control Plane',
    summary: 'Control-plane reference for deterministic orchestration with AI advisory overlays.',
    tags: ['execution fabric', 'agent orchestration', 'system hardening'],
    problem: 'Teams scale agents quickly but lack repeatable controls for replay, rollback, and policy enforcement.',
    constraints: [
      'Deterministic core execution path',
      'Replay logs and immutable event traces',
      'Policy checks before every agent action',
    ],
    architectureNodes: ['Policy registry', 'Deterministic orchestrator', 'AI advisor', 'Replay/audit store'],
    implementationNotes: [
      'Separate planning from execution so AI cannot directly mutate authoritative state.',
      'Replay traces should include policy versions and confidence metadata for every decision.',
      'Use bounded retries and deterministic fallback paths to maintain SLA behavior.',
    ],
    downloadPath: '/blueprints/execution-fabric-control-plane.md',
  },
  {
    slug: 'resilient-agent-release-pipeline',
    title: 'Resilient Agent Release Pipeline',
    summary: 'Release pipeline blueprint for safe agent rollouts under governance controls.',
    tags: ['system hardening', 'governance', 'deterministic workflows'],
    problem: 'Agent updates can introduce silent behavior drift when promotion and evaluation are not codified.',
    constraints: [
      'Versioned prompts and policy packs',
      'Canary with deterministic rollback triggers',
      'Public-facing impact summary for trust transparency',
    ],
    architectureNodes: ['Versioned artifacts', 'Canary evaluator', 'Rollback controller', 'Transparency log'],
    implementationNotes: [
      'Gate production promotion on deterministic checks before subjective quality ratings.',
      'Document every rollback with root cause and follow-up controls in the build log.',
      'Cross-link release records to customer-facing post-implementation guidance.',
    ],
    downloadPath: '/blueprints/resilient-agent-release-pipeline.md',
  },
];

export const operatorMockLeads: OperatorLead[] = [
  {
    account: 'Northline Logistics',
    stage: 'intake',
    riskScore: 38,
    owner: 'R. Kim',
    notes: 'Needs deterministic dispatch handoff before pilot approval.',
  },
  {
    account: 'Beacon Manufacturing',
    stage: 'scoping',
    riskScore: 24,
    owner: 'S. Patel',
    notes: 'Security review complete; waiting on plant-level data access matrix.',
  },
  {
    account: 'Atlas Financial Ops',
    stage: 'governance-review',
    riskScore: 61,
    owner: 'C. Nguyen',
    notes: 'Escalated for model explainability validation and legal sign-off.',
  },
];

export const methodologySections = [
  {
    title: 'Systems-first consulting',
    body: 'AIAS starts from system boundaries, operating constraints, and measurable obligations. Recommendations are framed as architecture decisions rather than tool selections.',
  },
  {
    title: 'Determinism vs probabilistic systems',
    body: 'Deterministic components own contractual workflows and authoritative state transitions. Probabilistic components operate as advisory layers where uncertainty is acceptable and measurable.',
  },
  {
    title: 'Governance before scale',
    body: 'Governance controls are defined before broad automation rollout. Policy checks, replayability, and escalation paths are treated as launch prerequisites.',
  },
  {
    title: 'Execution fabric thinking',
    body: 'Execution fabric design integrates orchestration, observability, and human intervention paths so that the operating model remains reliable as scope expands.',
  },
  {
    title: 'Anti-patterns and mitigations',
    body: 'We avoid black-box autonomy claims, unversioned prompt changes, and direct write access from model outputs. Mitigations include policy gates, staged rollout, and deterministic fallback paths.',
  },
  {
    title: 'Deployment models',
    body: 'Engagements support self-hosted, managed, and federated models. Selection depends on data residency, operating maturity, and governance burden allocation.',
  },
  {
    title: 'What we measure and why',
    body: 'Primary metrics include cycle time, defect escape, replay success, policy exception rate, and operator overhead. These indicators determine readiness for expansion.',
  },
] as const;

export const whyWeSayNoSections = [
  {
    title: 'Projects we decline',
    points: [
      'Engagements that cannot define deterministic ownership of critical workflows.',
      'Requests that treat governance as post-launch paperwork.',
      'Scopes that require hidden data practices or undisclosed model behavior.',
    ],
  },
  {
    title: 'AI misuse patterns',
    points: [
      'Replacing accountable decision owners with model outputs.',
      'Deploying automations without incident replay capability.',
      'Using synthetic content systems for deceptive communication.',
    ],
  },
  {
    title: 'Governance anti-patterns',
    points: [
      'Single prompt updates pushed directly to production with no version history.',
      'Security controls documented but unenforced at runtime.',
      'No threshold-based escalation path when confidence drops.',
    ],
  },
  {
    title: 'When you should hire internally instead',
    points: [
      'If your team already has senior platform and governance depth, internal execution may be the faster path.',
      'If the initiative requires full-time embedded domain ownership, in-house operators usually outperform advisory support.',
      'If budget only supports tactical automation with no governance investment, internal experimentation is more appropriate first.',
    ],
  },
] as const;

export const certificationModules = [
  'Module 1: Deterministic workflow design fundamentals',
  'Module 2: Governance controls and policy gating',
  'Module 3: Execution fabric orchestration patterns',
  'Module 4: Reliability testing, replay, and rollback',
] as const;

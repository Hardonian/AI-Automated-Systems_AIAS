export type BuildLogCategory = "ship" | "fix" | "experiment" | "kill" | "learn";

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
  audience: string;
  operatingModel: string;
  tags: Array<
    | "governance"
    | "deterministic workflows"
    | "agent orchestration"
    | "execution fabric"
    | "system hardening"
  >;
  problem: string;
  assumptions: string[];
  constraints: string[];
  architectureNodes: string[];
  controlPoints: Array<{
    control: string;
    purpose: string;
    evidence: string;
  }>;
  interfaceContracts: Array<{
    boundary: string;
    contract: string;
    failurePolicy: string;
  }>;
  implementationPlan: Array<{
    phase: string;
    outcome: string;
    activities: string[];
  }>;
  verificationSignals: Array<{
    measure: string;
    target: string;
    action: string;
  }>;
  handoffArtifacts: string[];
  implementationNotes: string[];
  downloadPath: string;
}

export interface OperatorLead {
  account: string;
  stage: "intake" | "scoping" | "pilot" | "governance-review" | "active";
  riskScore: number;
  owner: string;
  notes: string;
}

export const buildLogWeeks: BuildLogWeek[] = [
  {
    weekOf: "2026-02-10",
    entries: [
      {
        date: "2026-02-14",
        title: "Released public engagement simulator",
        summary:
          "Shipped self-serve qualification flow that produces deterministic engagement briefs.",
        category: "ship",
        links: [
          { label: "Engagement simulator", href: "/engagement-simulator" },
        ],
      },
      {
        date: "2026-02-13",
        title: "Removed non-deterministic copy from CTA stack",
        summary:
          "Killed language that implied unsupervised autonomy and aligned to governance-first framing.",
        category: "kill",
      },
      {
        date: "2026-02-12",
        title: "Improved metadata coverage for resource routes",
        summary:
          "Fixed metadata gaps to prevent SEO drift across new moat pages.",
        category: "fix",
      },
      {
        date: "2026-02-11",
        title: "Tested onboarding question order variants",
        summary:
          "Experiment showed risk-profile prompts early in the flow improve qualified intent signal quality.",
        category: "experiment",
      },
      {
        date: "2026-02-10",
        title: "Codified risk communication pattern",
        summary:
          "Learned that explicit downside language increases enterprise stakeholder trust during discovery.",
        category: "learn",
      },
    ],
  },
  {
    weekOf: "2026-02-03",
    entries: [
      {
        date: "2026-02-07",
        title: "Published methodology whitepaper",
        summary:
          "Shipped a rigorous methodology document clarifying deterministic boundaries and deployment models.",
        category: "ship",
        links: [{ label: "Methodology", href: "/methodology" }],
      },
      {
        date: "2026-02-05",
        title: "Retired duplicated service narrative blocks",
        summary:
          "Killed repeated messaging that created terminology drift between services and ecosystem pages.",
        category: "kill",
      },
      {
        date: "2026-02-04",
        title: "Added messaging consistency contract checks",
        summary:
          "Learned that fail-fast copy checks prevent regressions without slowing static builds.",
        category: "learn",
      },
    ],
  },
];

export const blueprints: Blueprint[] = [
  {
    slug: "governed-intake-router",
    title: "Governed Intake Router",
    summary:
      "Deterministic qualification and engagement routing for advisory, co-build, and managed modes.",
    audience:
      "Operations and revenue leaders who need fast, explainable intake decisions without turning a first-pass assessment into an opaque lead-scoring system.",
    operatingModel:
      "A browser-safe intake captures a bounded set of facts, a versioned rubric calculates the recommendation, and a named operator owns every exception or policy-sensitive account. The model may summarize context, but it never changes the score or sends an external commitment.",
    tags: ["governance", "deterministic workflows", "agent orchestration"],
    problem:
      "Lead qualification often collapses into manual interpretation, delaying response times and creating inconsistent engagement recommendations.",
    assumptions: [
      "The organization can define its target engagement modes and disqualifying conditions before launch.",
      "Required intake fields are available at the point of submission or can be explicitly marked unknown.",
      "A qualified owner is available to review high-risk, low-confidence, or incomplete submissions.",
    ],
    constraints: [
      "No backend dependency for first-pass qualification",
      "Deterministic classification with transparent scoring",
      "Human override for edge cases and high-risk accounts",
    ],
    architectureNodes: [
      "Inbound form",
      "Deterministic scorer",
      "Risk policy gates",
      "Engagement recommendation",
    ],
    controlPoints: [
      {
        control: "Required-field gate",
        purpose:
          "Prevents a recommendation when the minimum decision context is absent.",
        evidence:
          "Field-completeness receipt with the rubric version and missing-field list.",
      },
      {
        control: "Versioned scoring matrix",
        purpose:
          "Makes the engagement recommendation reproducible and reviewable.",
        evidence:
          "Score breakdown, threshold band, and matrix version stored with the brief.",
      },
      {
        control: "Risk escalation rule",
        purpose:
          "Routes regulated, sensitive, or ambiguous requests to a human before outreach.",
        evidence:
          "Escalation reason, assigned owner, and resolution decision recorded in the operator queue.",
      },
    ],
    interfaceContracts: [
      {
        boundary: "Intake form → deterministic scorer",
        contract:
          "Normalized organization profile, stated objective, systems context, risk flags, and a schema version.",
        failurePolicy:
          "Reject invalid payloads; keep the user-facing draft intact and identify the field that needs correction.",
      },
      {
        boundary: "Scorer → policy gate",
        contract:
          "Score band, triggered rules, and the complete decision trace; no free-text rationale is authoritative.",
        failurePolicy:
          "Default to review when the trace is incomplete, the rubric version is unknown, or two policy rules conflict.",
      },
      {
        boundary: "Policy gate → operator handoff",
        contract:
          "Recommendation, evidence summary, escalation reason, and next permissible action.",
        failurePolicy:
          "Create a non-sendable review item; no automatic calendar booking or commercial commitment is made.",
      },
    ],
    implementationPlan: [
      {
        phase: "01 · Calibrate",
        outcome:
          "An agreed rubric with explicit inclusion, exclusion, and escalation thresholds.",
        activities: [
          "Map current intake decisions and identify disagreement patterns.",
          "Define required facts, score weights, and high-risk conditions with accountable owners.",
        ],
      },
      {
        phase: "02 · Build the bounded path",
        outcome:
          "A schema-validated intake and deterministic recommendation artifact.",
        activities: [
          "Implement form validation, score calculation, and policy evaluation as separate functions.",
          "Generate a reviewable JSON brief with a stable rubric version and timestamp.",
        ],
      },
      {
        phase: "03 · Prove and release",
        outcome:
          "A controlled launch with measurable consistency and operator ownership.",
        activities: [
          "Replay historical examples and compare system decisions with approved dispositions.",
          "Run a monitored pilot, then publish an exception-review cadence and change-control rule.",
        ],
      },
    ],
    verificationSignals: [
      {
        measure: "Recommendation trace completeness",
        target:
          "100% of submitted recommendations carry a rubric version, score breakdown, and route.",
        action:
          "Block delivery and create an implementation defect when any trace field is absent.",
      },
      {
        measure: "High-risk escalation capture",
        target:
          "No submission matching a risk rule bypasses the named review queue.",
        action:
          "Review rule misses weekly and add test fixtures before changing thresholds.",
      },
      {
        measure: "Operator override rate",
        target:
          "Overrides are explained, categorized, and used to improve the rubric rather than silently replace it.",
        action:
          "Investigate sustained category-specific overrides before expanding automation coverage.",
      },
    ],
    handoffArtifacts: [
      "Versioned scoring rubric and policy rule register",
      "Intake schema with invalid-state examples",
      "Decision-trace JSON specification and operator queue contract",
      "Pilot fixture set, override taxonomy, and change-control checklist",
    ],
    implementationNotes: [
      "Use weighted criteria with explicit thresholds to avoid opaque recommendations.",
      "Emit JSON artifacts for downstream operator workflows and reproducible audit trails.",
      "Keep channel and risk questions near the beginning of flows for better branch precision.",
    ],
    downloadPath: "/blueprints/governed-intake-router.md",
  },
  {
    slug: "execution-fabric-control-plane",
    title: "Execution Fabric Control Plane",
    summary:
      "Control-plane reference for deterministic orchestration with AI advisory overlays.",
    audience:
      "Platform, operations, and risk teams operating multi-step automations where an AI proposal must never become an unreviewed write to an authoritative system.",
    operatingModel:
      "The control plane separates advisory reasoning from execution. A model can propose a typed plan; a deterministic orchestrator validates it against policy, performs allowed state transitions, and emits a replayable receipt for every consequential action.",
    tags: ["execution fabric", "agent orchestration", "system hardening"],
    problem:
      "Teams scale agents quickly but lack repeatable controls for replay, rollback, and policy enforcement.",
    assumptions: [
      "Authoritative systems expose a bounded command surface or adapter layer.",
      "Each workflow has an accountable owner for policy changes and exception disposition.",
      "Critical actions can be expressed as idempotent commands with explicit preconditions.",
    ],
    constraints: [
      "Deterministic core execution path",
      "Replay logs and immutable event traces",
      "Policy checks before every agent action",
    ],
    architectureNodes: [
      "Policy registry",
      "Deterministic orchestrator",
      "AI advisor",
      "Replay/audit store",
    ],
    controlPoints: [
      {
        control: "Typed plan validation",
        purpose:
          "Converts a proposed workflow into a bounded command sequence before execution starts.",
        evidence:
          "Validated plan ID, schema version, declared tools, and rejected-field report.",
      },
      {
        control: "Policy decision gate",
        purpose:
          "Checks authorization, tenant scope, data class, and action preconditions at the write boundary.",
        evidence:
          "Allow, deny, or escalate receipt with policy pack and rule IDs.",
      },
      {
        control: "Immutable execution ledger",
        purpose:
          "Makes every command, retry, and compensating action reconstructable after an incident.",
        evidence:
          "Append-only event stream correlated by workflow, command, actor, and artifact versions.",
      },
    ],
    interfaceContracts: [
      {
        boundary: "AI advisor → plan validator",
        contract:
          "A schema-bound proposal containing intent, permitted command candidates, evidence references, and confidence metadata.",
        failurePolicy:
          "Discard unparseable or unsupported proposals; return a structured reason and request human clarification where needed.",
      },
      {
        boundary: "Plan validator → orchestrator",
        contract:
          "An approved command graph with idempotency keys, preconditions, and an execution deadline.",
        failurePolicy:
          "Do not start partial execution without a complete graph; route policy conflicts to a named owner.",
      },
      {
        boundary: "Orchestrator → system adapters",
        contract:
          "Narrow typed commands and normalized responses; adapters cannot accept raw model text.",
        failurePolicy:
          "Use bounded retries only for declared transient errors, then issue a compensating command or create an operator task.",
      },
    ],
    implementationPlan: [
      {
        phase: "01 · Define the authority boundary",
        outcome:
          "A command inventory that makes prohibited, review-only, and automatable actions explicit.",
        activities: [
          "Map systems of record, state transitions, owners, and data classifications.",
          "Write typed command schemas with preconditions and idempotency behaviour.",
        ],
      },
      {
        phase: "02 · Establish the control plane",
        outcome:
          "Policy enforcement, plan validation, and replayable execution receipts on one bounded workflow.",
        activities: [
          "Implement policy evaluation before every external write and normalise adapter responses.",
          "Persist correlated event records with policy, schema, and artifact versions.",
        ],
      },
      {
        phase: "03 · Harden operations",
        outcome:
          "An operator-ready release path with tested compensation and incident procedures.",
        activities: [
          "Exercise fail, timeout, duplicate, and policy-denied paths with fixture-driven tests.",
          "Define service objectives, alert thresholds, on-call ownership, and a controlled expansion gate.",
        ],
      },
    ],
    verificationSignals: [
      {
        measure: "Policy receipt coverage",
        target:
          "Every authoritative write is paired with an allow, deny, or escalate receipt.",
        action:
          "Treat missing receipts as a release-blocking observability defect.",
      },
      {
        measure: "Replay fidelity",
        target:
          "A sampled execution can be reconstructed from the ledger using the original versions and inputs.",
        action:
          "Freeze affected command types when replay cannot explain a production outcome.",
      },
      {
        measure: "Compensation success",
        target:
          "Failed multi-step actions reach a documented safe state within the workflow service objective.",
        action:
          "Escalate to an operator with the failed command, state snapshot, and recommended recovery path.",
      },
    ],
    handoffArtifacts: [
      "Authority-boundary map and command registry",
      "Policy pack with traceable rule identifiers",
      "Event ledger schema, replay procedure, and incident runbook",
      "Failure-mode fixture suite and expansion readiness checklist",
    ],
    implementationNotes: [
      "Separate planning from execution so AI cannot directly mutate authoritative state.",
      "Replay traces should include policy versions and confidence metadata for every decision.",
      "Use bounded retries and deterministic fallback paths to maintain SLA behavior.",
    ],
    downloadPath: "/blueprints/execution-fabric-control-plane.md",
  },
  {
    slug: "resilient-agent-release-pipeline",
    title: "Resilient Agent Release Pipeline",
    summary:
      "Release pipeline blueprint for safe agent rollouts under governance controls.",
    audience:
      "Product, platform, and governance teams releasing AI-assisted features that need a repeatable promotion decision, rapid containment, and a clear public record of material changes.",
    operatingModel:
      "Every release is a versioned bundle of model configuration, prompts, tools, policies, and evaluations. The pipeline promotes only measured bundles through staged traffic, and the rollback controller can return traffic to the last verified bundle without waiting for a new model decision.",
    tags: ["system hardening", "governance", "deterministic workflows"],
    problem:
      "Agent updates can introduce silent behavior drift when promotion and evaluation are not codified.",
    assumptions: [
      "Release candidates can be identified as immutable bundles rather than untracked prompt or model changes.",
      "Representative deterministic fixtures and an approved evaluation baseline exist for the workflow.",
      "Traffic can be segmented or shadowed long enough to observe release health before broad promotion.",
    ],
    constraints: [
      "Versioned prompts and policy packs",
      "Canary with deterministic rollback triggers",
      "Public-facing impact summary for trust transparency",
    ],
    architectureNodes: [
      "Versioned artifacts",
      "Canary evaluator",
      "Rollback controller",
      "Transparency log",
    ],
    controlPoints: [
      {
        control: "Immutable release manifest",
        purpose:
          "Prevents a promoted configuration from changing underneath its evaluation result.",
        evidence:
          "Signed bundle ID containing prompt, model, tool, policy, schema, and evaluation versions.",
      },
      {
        control: "Deterministic promotion gate",
        purpose:
          "Requires non-negotiable safety and contract checks to pass before subjective quality review.",
        evidence:
          "Test report with fixture coverage, contract failures, policy exceptions, and promotion decision.",
      },
      {
        control: "Independent rollback trigger",
        purpose:
          "Contains drift or reliability regressions without relying on the released agent to diagnose itself.",
        evidence:
          "Threshold breach, traffic change receipt, affected cohort, and linked incident record.",
      },
    ],
    interfaceContracts: [
      {
        boundary: "Source changes → artifact registry",
        contract:
          "A complete release manifest with immutable identifiers and change notes for every behavior-affecting asset.",
        failurePolicy:
          "Reject unversioned artifacts or manifests missing a prior verified baseline.",
      },
      {
        boundary: "Registry → canary evaluator",
        contract:
          "A release bundle, deterministic fixture suite, quality rubric, and cohort configuration.",
        failurePolicy:
          "Hold the candidate when coverage is incomplete, the cohort cannot be isolated, or evaluation results are not reproducible.",
      },
      {
        boundary: "Canary evaluator → traffic controller",
        contract:
          "A signed promote, hold, or rollback decision with the observed measures and release IDs.",
        failurePolicy:
          "Default to hold; automatically route a threshold breach to rollback and open an owner-assigned incident.",
      },
    ],
    implementationPlan: [
      {
        phase: "01 · Establish the baseline",
        outcome:
          "A release definition and evaluation set that represent the existing verified behaviour.",
        activities: [
          "Inventory all behavior-affecting assets and make the bundle immutable.",
          "Build deterministic fixtures from accepted, rejected, and historical incident cases.",
        ],
      },
      {
        phase: "02 · Automate the decision path",
        outcome:
          "A pipeline that distinguishes required contract checks from human quality review.",
        activities: [
          "Run schema, policy, security, and replay checks before subjective scoring.",
          "Publish a single promotion receipt that names thresholds, evaluators, cohort, and release bundle.",
        ],
      },
      {
        phase: "03 · Operate staged releases",
        outcome:
          "A measurable canary process with independent containment and transparent learning.",
        activities: [
          "Configure cohort ramps, error and policy-exception thresholds, and rollback ownership.",
          "Review each rollback for root cause, corrective controls, and fixture additions before re-promotion.",
        ],
      },
    ],
    verificationSignals: [
      {
        measure: "Manifest completeness",
        target:
          "Every release can be reconstructed from one immutable bundle and an approved baseline reference.",
        action:
          "Reject promotion when any model, prompt, policy, tool, or schema version is absent.",
      },
      {
        measure: "Canary contract parity",
        target:
          "The candidate preserves mandatory policy, schema, and tool-call contracts for the canary cohort.",
        action:
          "Hold at the current cohort and open a targeted defect when parity drops below threshold.",
      },
      {
        measure: "Rollback time to safe state",
        target:
          "Traffic returns to the last verified bundle inside the documented containment objective.",
        action:
          "Treat a missed rollback objective as an incident and suspend further expansion until remediated.",
      },
    ],
    handoffArtifacts: [
      "Release manifest schema and change classification rules",
      "Fixture library with baseline results and regression ownership",
      "Canary scorecard, threshold register, and rollback runbook",
      "Transparency-log template and post-incident follow-up checklist",
    ],
    implementationNotes: [
      "Gate production promotion on deterministic checks before subjective quality ratings.",
      "Document every rollback with root cause and follow-up controls in the build log.",
      "Cross-link release records to customer-facing post-implementation guidance.",
    ],
    downloadPath: "/blueprints/resilient-agent-release-pipeline.md",
  },
];

export const operatorMockLeads: OperatorLead[] = [
  {
    account: "Northline Logistics",
    stage: "intake",
    riskScore: 38,
    owner: "R. Kim",
    notes: "Needs deterministic dispatch handoff before pilot approval.",
  },
  {
    account: "Beacon Manufacturing",
    stage: "scoping",
    riskScore: 24,
    owner: "S. Patel",
    notes:
      "Security review complete; waiting on plant-level data access matrix.",
  },
  {
    account: "Atlas Financial Ops",
    stage: "governance-review",
    riskScore: 61,
    owner: "C. Nguyen",
    notes: "Escalated for model explainability validation and legal sign-off.",
  },
];

export const methodologySections = [
  {
    title: "Systems-first consulting",
    body: "AIAS starts from system boundaries, operating constraints, and measurable obligations. Recommendations are framed as architecture decisions rather than tool selections.",
  },
  {
    title: "Determinism vs probabilistic systems",
    body: "Deterministic components own contractual workflows and authoritative state transitions. Probabilistic components operate as advisory layers where uncertainty is acceptable and measurable.",
  },
  {
    title: "Governance before scale",
    body: "Governance controls are defined before broad automation rollout. Policy checks, replayability, and escalation paths are treated as launch prerequisites.",
  },
  {
    title: "Execution fabric thinking",
    body: "Execution fabric design integrates orchestration, observability, and human intervention paths so that the operating model remains reliable as scope expands.",
  },
  {
    title: "Anti-patterns and mitigations",
    body: "We avoid black-box autonomy claims, unversioned prompt changes, and direct write access from model outputs. Mitigations include policy gates, staged rollout, and deterministic fallback paths.",
  },
  {
    title: "Deployment models",
    body: "Engagements support self-hosted, managed, and federated models. Selection depends on data residency, operating maturity, and governance burden allocation.",
  },
  {
    title: "What we measure and why",
    body: "Primary metrics include cycle time, defect escape, replay success, policy exception rate, and operator overhead. These indicators determine readiness for expansion.",
  },
] as const;

export const whyWeSayNoSections = [
  {
    title: "Projects we decline",
    points: [
      "Engagements that cannot define deterministic ownership of critical workflows.",
      "Requests that treat governance as post-launch paperwork.",
      "Scopes that require hidden data practices or undisclosed model behavior.",
    ],
  },
  {
    title: "AI misuse patterns",
    points: [
      "Replacing accountable decision owners with model outputs.",
      "Deploying automations without incident replay capability.",
      "Using synthetic content systems for deceptive communication.",
    ],
  },
  {
    title: "Governance anti-patterns",
    points: [
      "Single prompt updates pushed directly to production with no version history.",
      "Security controls documented but unenforced at runtime.",
      "No threshold-based escalation path when confidence drops.",
    ],
  },
  {
    title: "When you should hire internally instead",
    points: [
      "If your team already has senior platform and governance depth, internal execution may be the faster path.",
      "If the initiative requires full-time embedded domain ownership, in-house operators usually outperform advisory support.",
      "If budget only supports tactical automation with no governance investment, internal experimentation is more appropriate first.",
    ],
  },
] as const;

export const certificationModules = [
  "Module 1: Deterministic workflow design fundamentals",
  "Module 2: Governance controls and policy gating",
  "Module 3: Execution fabric orchestration patterns",
  "Module 4: Reliability testing, replay, and rollback",
] as const;

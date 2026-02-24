export const ORG_TYPES = [
  'startup',
  'smb',
  'enterprise',
  'nonprofit',
  'public-sector',
] as const;

export const PROBLEM_CATEGORIES = [
  'manual-operations',
  'data-fragmentation',
  'compliance-risk',
  'customer-experience',
  'ai-readiness',
] as const;

export const AI_STACK_OPTIONS = ['none', 'pilot', 'production', 'multi-system'] as const;
export const MODEL_MIX_OPTIONS = ['single-model', 'multi-model', 'open-and-closed', 'unknown'] as const;
export const FAILURE_MODE_OPTIONS = ['hallucination', 'latency', 'cost-drift', 'unsafe-actions', 'evaluation-gaps'] as const;
export const GOVERNANCE_MATURITY_OPTIONS = ['ad-hoc', 'repeatable', 'defined', 'controlled'] as const;

export const URGENCY_LEVELS = ['this-month', 'this-quarter', 'this-year'] as const;

export const ENGAGEMENT_SCOPES = ['one-off', 'build-with', 'managed-refinement'] as const;

export const BUDGET_FLEXIBILITY_RANGES = [
  'constrained',
  'moderate',
  'strategic',
] as const;

export type OrgType = (typeof ORG_TYPES)[number];
export type ProblemCategory = (typeof PROBLEM_CATEGORIES)[number];
export type AiStack = (typeof AI_STACK_OPTIONS)[number];
export type ModelMix = (typeof MODEL_MIX_OPTIONS)[number];
export type FailureMode = (typeof FAILURE_MODE_OPTIONS)[number];
export type GovernanceMaturity = (typeof GOVERNANCE_MATURITY_OPTIONS)[number];
export type UrgencyLevel = (typeof URGENCY_LEVELS)[number];
export type EngagementScope = (typeof ENGAGEMENT_SCOPES)[number];
export type BudgetFlexibilityRange = (typeof BUDGET_FLEXIBILITY_RANGES)[number];

export interface IntakeSubmission {
  orgType: OrgType;
  problemCategory: ProblemCategory;
  aiStack: AiStack;
  modelMix: ModelMix;
  failureMode: FailureMode;
  governanceMaturity: GovernanceMaturity;
  urgency: UrgencyLevel;
  scope: EngagementScope;
  budgetFlexibility: BudgetFlexibilityRange;
  email?: string;
}

export type EngagementTier = 'advisory' | 'co-build-sprint' | 'managed-system-refinement' | 'enterprise-engagement';

export interface ClassificationResult {
  tier: EngagementTier;
  score: number;
  rationale: string[];
  recommendedPath: {
    title: string;
    summary: string;
    nextStep: string;
  };
}

const tierCopy: Record<EngagementTier, ClassificationResult['recommendedPath']> = {
  advisory: {
    title: 'Advisory',
    summary:
      'Best for focused diagnosis and architecture planning when the team needs a deterministic plan before implementation.',
    nextStep: 'We will run a short architecture sprint and provide a concrete rollout blueprint.',
  },
  'co-build-sprint': {
    title: 'Co-build Sprint',
    summary:
      'Best for teams that want to implement with shared ownership and measurable checkpoints.',
    nextStep: 'We will propose a phased sprint plan with shared delivery responsibilities.',
  },
  'managed-system-refinement': {
    title: 'Managed System Refinement',
    summary:
      'Best for teams requiring ongoing optimization, governance reviews, and run-time reliability improvements.',
    nextStep: 'We will design an operating cadence with monthly refinement and governance checkpoints.',
  },
  'enterprise-engagement': {
    title: 'Enterprise Engagement',
    summary:
      'Best for complex, regulated, or multi-team environments requiring strict controls and federated delivery.',
    nextStep: 'We will align stakeholders, define risk boundaries, and set enterprise governance milestones.',
  },
};

export function classifyIntake(submission: IntakeSubmission): ClassificationResult {
  let score = 0;
  const rationale: string[] = [];

  if (submission.scope === 'managed-refinement') {
    score += 3;
    rationale.push('Selected scope indicates ongoing optimization needs.');
  } else if (submission.scope === 'build-with') {
    score += 2;
    rationale.push('Selected scope indicates collaborative implementation.');
  } else {
    rationale.push('Selected scope favors a focused one-off engagement.');
  }

  if (submission.urgency === 'this-month') {
    score += 2;
    rationale.push('Urgency requires rapid planning and execution.');
  } else if (submission.urgency === 'this-quarter') {
    score += 1;
    rationale.push('Urgency supports near-term phased delivery.');
  }

  if (submission.budgetFlexibility === 'strategic') {
    score += 2;
    rationale.push('Budget flexibility supports deeper implementation options.');
  } else if (submission.budgetFlexibility === 'moderate') {
    score += 1;
    rationale.push('Budget flexibility supports phased outcomes.');
  }

  if (submission.problemCategory === 'compliance-risk' || submission.problemCategory === 'data-fragmentation') {
    score += 2;
    rationale.push('Problem category indicates cross-system complexity and governance needs.');
  }

  if (submission.aiStack === 'production' || submission.aiStack === 'multi-system') {
    score += 2;
    rationale.push('Current AI stack indicates active production constraints to stabilize.');
  }

  if (submission.modelMix === 'multi-model' || submission.modelMix === 'open-and-closed') {
    score += 1;
    rationale.push('Model mix indicates orchestration and routing complexity.');
  }

  if (submission.failureMode === 'unsafe-actions' || submission.failureMode === 'evaluation-gaps') {
    score += 2;
    rationale.push('Failure mode requires governance controls and evaluation hardening.');
  }

  if (submission.governanceMaturity === 'ad-hoc') {
    score += 2;
    rationale.push('Governance maturity is ad-hoc, so control-plane foundation is needed first.');
  } else if (submission.governanceMaturity === 'repeatable') {
    score += 1;
    rationale.push('Governance maturity is repeatable with room for stronger controls.');
  }

  const enterpriseProfile = submission.orgType === 'enterprise' || submission.orgType === 'public-sector';
  if (enterpriseProfile) {
    score += 2;
    rationale.push('Organization type indicates enterprise governance and coordination requirements.');
  }

  const tier: EngagementTier = enterpriseProfile && score >= 6
    ? 'enterprise-engagement'
    : score >= 7
      ? 'managed-system-refinement'
      : score >= 4
        ? 'co-build-sprint'
        : 'advisory';

  return {
    tier,
    score,
    rationale,
    recommendedPath: tierCopy[tier],
  };
}

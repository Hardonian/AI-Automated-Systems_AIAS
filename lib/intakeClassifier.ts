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

export const URGENCY_LEVELS = ['this-month', 'this-quarter', 'this-year'] as const;

export const ENGAGEMENT_SCOPES = ['one-off', 'build-with', 'managed-refinement'] as const;

export const BUDGET_FLEXIBILITY_RANGES = [
  'constrained',
  'moderate',
  'strategic',
] as const;

export type OrgType = (typeof ORG_TYPES)[number];
export type ProblemCategory = (typeof PROBLEM_CATEGORIES)[number];
export type UrgencyLevel = (typeof URGENCY_LEVELS)[number];
export type EngagementScope = (typeof ENGAGEMENT_SCOPES)[number];
export type BudgetFlexibilityRange = (typeof BUDGET_FLEXIBILITY_RANGES)[number];

export interface IntakeSubmission {
  orgType: OrgType;
  problemCategory: ProblemCategory;
  urgency: UrgencyLevel;
  scope: EngagementScope;
  budgetFlexibility: BudgetFlexibilityRange;
}

export type EngagementTier = 'advisory-sprint' | 'build-partnership' | 'managed-program';

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
  'advisory-sprint': {
    title: 'Advisory Sprint',
    summary:
      'Best for fast discovery or constrained initiatives where a tight plan and implementation map are the immediate priority.',
    nextStep: 'We will start with a focused diagnostic, define the workflow map, and hand over an execution-ready blueprint.',
  },
  'build-partnership': {
    title: 'Build-With Partnership',
    summary:
      'Best for teams that want a collaborative implementation with shared ownership, milestones, and measurable adoption outcomes.',
    nextStep: 'We will propose a phased roadmap with sprint checkpoints and a jointly owned delivery cadence.',
  },
  'managed-program': {
    title: 'Managed Refinement Program',
    summary:
      'Best for ongoing optimization, risk control, and workflow evolution across multiple systems and stakeholder groups.',
    nextStep: 'We will recommend a rolling operating model with governance reviews, optimization cycles, and escalation paths.',
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

  if (submission.orgType === 'enterprise' || submission.orgType === 'public-sector') {
    score += 1;
    rationale.push('Organization type often requires additional coordination and controls.');
  }

  const tier: EngagementTier = score >= 7 ? 'managed-program' : score >= 4 ? 'build-partnership' : 'advisory-sprint';

  return {
    tier,
    score,
    rationale,
    recommendedPath: tierCopy[tier],
  };
}

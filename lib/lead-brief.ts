import type { IntakeSubmission } from "@/lib/intakeClassifier";
import type { classifyIntake } from "@/lib/intakeClassifier";

export interface LeadAttribution {
  landingPath: string;
  referrer: string;
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
}

export interface LeadBriefInput {
  contact: { name: string; organization: string; email: string };
  workflowSummary: string;
  catalogTitles: string[];
  intake: IntakeSubmission;
  classification: ReturnType<typeof classifyIntake>;
  attribution: LeadAttribution;
}

const MAX_ATTRIBUTION_LENGTH = 160;

const clean = (value: string | null) =>
  (value ?? "").trim().slice(0, MAX_ATTRIBUTION_LENGTH);

export function readLeadAttribution({
  search,
  referrer,
  landingPath,
}: {
  search: string;
  referrer: string;
  landingPath: string;
}): LeadAttribution {
  const params = new URLSearchParams(search);

  return {
    landingPath: clean(landingPath),
    referrer: clean(referrer),
    source: clean(params.get("utm_source") ?? params.get("ref")),
    medium: clean(params.get("utm_medium")),
    campaign: clean(params.get("utm_campaign")),
    content: clean(params.get("utm_content")),
    term: clean(params.get("utm_term")),
  };
}

export function buildLeadBriefMarkdown(input: LeadBriefInput): string {
  const shortlist =
    input.catalogTitles.length > 0
      ? input.catalogTitles.map((title) => `- ${title}`).join("\n")
      : "- Open to recommendation";
  const rationale = input.classification.rationale
    .map((item) => `- ${item}`)
    .join("\n");

  return `# AIAS Workflow Fit Brief

Generated: ${new Date().toISOString()}

## Contact

- Name: ${input.contact.name}
- Organization: ${input.contact.organization}
- Email: ${input.contact.email}

## Workflow

${input.workflowSummary}

## Catalog shortlist

${shortlist}

## Operating context

- Organization type: ${input.intake.orgType}
- Problem category: ${input.intake.problemCategory}
- AI stack: ${input.intake.aiStack}
- Model mix: ${input.intake.modelMix}
- Current failure mode: ${input.intake.failureMode}
- Governance maturity: ${input.intake.governanceMaturity}
- Urgency: ${input.intake.urgency}
- Engagement scope: ${input.intake.scope}
- Budget flexibility: ${input.intake.budgetFlexibility}

## Deterministic recommendation

### ${input.classification.recommendedPath.title}

${input.classification.recommendedPath.summary}

${rationale}

## Attribution

- Landing path: ${input.attribution.landingPath || "Direct"}
- Referrer: ${input.attribution.referrer || "Direct"}
- Source: ${input.attribution.source || "Direct"}
- Medium: ${input.attribution.medium || "Not supplied"}
- Campaign: ${input.attribution.campaign || "Not supplied"}

## Next decision

Validate the workflow boundary, baseline the current failure and handling cost, identify the accountable owner, and choose the smallest proof that can produce decision-grade evidence.

> This brief is a discovery artifact, not a production architecture, security approval, compliance determination, or guaranteed outcome.
`;
}

export function downloadTextArtifact({
  content,
  filename,
  type = "text/markdown",
}: {
  content: string;
  filename: string;
  type?: string;
}) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

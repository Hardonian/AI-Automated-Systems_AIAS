export interface CaseStudy {
  slug: string;
  title: string;
  problem: string;
  architecture: string[];
  implementationHighlights: string[];
  automationWins: string[];
  measurableImpact: string[];
  technologies: string[];
  evidence: {
    level: "representative" | "client-approved";
    basis: string;
    sources: string[];
    reviewedAt: string;
    approvedBy?: string;
  };
}

export interface ProjectMetadata {
  name: string;
  role: string;
  focus: string[];
  capabilities: string[];
  impactSignals: string[];
}

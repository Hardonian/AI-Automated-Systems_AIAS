export interface CaseStudy {
  slug: string;
  title: string;
  problem: string;
  architecture: string[];
  implementationHighlights: string[];
  automationWins: string[];
  measurableImpact: string[];
  technologies: string[];
}

export interface ProjectMetadata {
  name: string;
  role: string;
  focus: string[];
  capabilities: string[];
  impactSignals: string[];
}

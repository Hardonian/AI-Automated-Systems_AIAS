import reachMeta from '../content/reach.json';
import zeoMeta from '../content/zeo.json';
import settlerMeta from '../content/settler-metadata.json';
import { CaseStudy } from '../types/case-study';
import { caseStudies as legacyCaseStudies } from '../src/content/caseStudies';

/**
 * Automated Case Study Generator
 * Transforms legacy case study data and enriches it with project metadata 
 * from Reach, Zeo, and Settler.
 */
export const caseStudies: CaseStudy[] = [
  ...legacyCaseStudies.map(legacy => {
    const involvedProjects = [];
    if (legacy.slug.includes('reach') || legacy.architectureChosen.toLowerCase().includes('reach')) involvedProjects.push(reachMeta);
    if (legacy.slug.includes('zeo') || legacy.architectureChosen.toLowerCase().includes('zeo')) involvedProjects.push(zeoMeta);
    if (legacy.slug.includes('settler') || legacy.architectureChosen.toLowerCase().includes('settler')) involvedProjects.push(settlerMeta);

    // If no projects explicitly found, assume all are involved as per AIAS ecosystem
    const metadataToUse = involvedProjects.length > 0 ? involvedProjects : [reachMeta, zeoMeta, settlerMeta];

    return {
      slug: legacy.slug,
      title: legacy.title,
      problem: legacy.clientProblem,
      architecture: [
        legacy.architectureChosen,
        ...legacy.systemConstraints
      ],
      implementationHighlights: [
        ...legacy.automationLayer,
        ...legacy.aiIntegration
      ],
      automationWins: [
        ...legacy.whatNext,
        ...metadataToUse.flatMap(m => m.impactSignals).slice(0, 3) // Add top 3 signals from metadata
      ],
      measurableImpact: legacy.performanceResults,
      technologies: Array.from(new Set([
        ...metadataToUse.map(m => m.name),
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'Framer Motion'
      ]))
    };
  }),
  {
    slug: 'deterministic-settlement-engine',
    title: 'Deterministic Settlement Engine',
    problem: 'Financial services provider required a replayable, auditable settlement layer for high-volume transactions.',
    architecture: [
      'Settler-driven transaction orchestration',
      'Immutable event store for deterministic replay',
      'Zeo agent cluster for automated exception handling'
    ],
    implementationHighlights: [
      'Multi-region deployment with Settler guardrails',
      'Governance-locked execution paths',
      'Real-time compliance monitoring'
    ],
    automationWins: [
      ...settlerMeta.impactSignals,
      'Reduction in audit time by 90%',
      'Elimination of manual settlement errors'
    ],
    measurableImpact: [
      'Zero loss incidents since deployment',
      'p99 latency < 200ms',
      'Audit compliance achieved in 2 weeks'
    ],
    technologies: ['Settler', 'Zeo', 'Next.js', 'PostgreSQL', 'Redis']
  }
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find(study => study.slug === slug);
}

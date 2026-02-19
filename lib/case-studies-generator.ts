import reachMeta from '../content/reach.json';
import zeoMeta from '../content/zeo.json';
import settlerMeta from '../content/settler-metadata.json';
import { CaseStudy, ProjectMetadata } from '../types/case-study';
import { caseStudies as legacyCaseStudies } from '../src/content/caseStudies';

/**
 * Transforms project metadata into a structured CaseStudy
 */
function transformProjectToCaseStudy(meta: any): CaseStudy {
  const pMeta = meta as ProjectMetadata & { impactSignals: string[] };
  return {
    slug: pMeta.name.toLowerCase(),
    title: `${pMeta.name} — ${pMeta.role}`,
    problem: `Enterprises face significant friction in ${pMeta.focus.join(', ').toLowerCase()}. This fragmentation creates operational risk and slows delivery cycles.`,
    architecture: pMeta.capabilities,
    implementationHighlights: pMeta.focus,
    automationWins: pMeta.impactSignals,
    measurableImpact: [
      `100% adherence to ${pMeta.name} governance protocols`,
      `Validated impact in ${pMeta.focus[0]}`,
      `Zero-downtime deployment capability`
    ],
    technologies: [pMeta.name, 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion']
  };
}

/**
 * Automated Case Study Generator
 * Transforms legacy case study data and enriches it with project metadata 
 * from Reach, Zeo, and Settler.
 */
export const caseStudies: CaseStudy[] = [
  // Generate directly from project configs
  transformProjectToCaseStudy(reachMeta),
  transformProjectToCaseStudy(zeoMeta),
  transformProjectToCaseStudy(settlerMeta),
  
  // Map legacy case studies
  ...legacyCaseStudies.map(legacy => {
    const involvedProjects = [];
    const lowerArch = legacy.architectureChosen.toLowerCase();
    const lowerSlug = legacy.slug.toLowerCase();

    if (lowerSlug.includes('reach') || lowerArch.includes('reach')) involvedProjects.push(reachMeta);
    if (lowerSlug.includes('zeo') || lowerArch.includes('zeo')) involvedProjects.push(zeoMeta);
    if (lowerSlug.includes('settler') || lowerArch.includes('settler')) involvedProjects.push(settlerMeta);

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
        ...metadataToUse.flatMap(m => (m as any).impactSignals).slice(0, 3) 
      ],
      measurableImpact: legacy.performanceResults,
      technologies: Array.from(new Set([
        ...metadataToUse.map(m => (m as any).name),
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'Framer Motion'
      ]))
    };
  })
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find(study => study.slug === slug);
}


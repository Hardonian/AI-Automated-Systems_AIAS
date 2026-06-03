export const MESSAGING_CONTRACT = {
  brandName: 'AI Automated Systems',
  shortBrandName: 'AIAS',
  positioningSentence:
    'We help operations teams replace fragile AI experiments with production-grade automation that actually ships — governed, measurable, and built to hand off.',
  primaryTagline: 'Agentic Automation Consultancy',
  heroSubheading:
    'Your AI pilots stall because nobody owns the workflow. We fix that.',
  metadataDescription:
    'AIAS helps organizations design, deploy, and operate deterministic automation systems with controlled AI assistance, governance guardrails, and measurable outcomes.',
  ecosystemAlignment:
    'AIAS leads architecture and governance while Reach, Zeo, and Settler execute aligned demand, implementation, and deployment operations.',
  canonicalTerms: {
    offering: 'agentic automation consultancy',
    systemModel: 'deterministic automation systems',
    deliveryModel: 'static-first delivery',
    controlPlane: 'deterministic control layer',
    intelligencePlane: 'constrained AI advisory layer',
  },
} as const;

export const CANONICAL_TAGLINES = [MESSAGING_CONTRACT.primaryTagline] as const;

export const TAGLINE_TITLE_TEMPLATE = `${MESSAGING_CONTRACT.brandName} | ${MESSAGING_CONTRACT.primaryTagline}`;

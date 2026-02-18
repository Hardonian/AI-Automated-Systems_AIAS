export const MESSAGING_CONTRACT = {
  brandName: 'AI Automated Systems',
  shortBrandName: 'AIAS',
  positioningSentence:
    'AIAS designs and operationalizes deterministic, static-first automation systems that blend controlled AI assistance with measurable business outcomes.',
  primaryTagline: 'Agentic Automation Consultancy',
  heroSubheading:
    'Move from AI experimentation to deterministic workflow automation with measurable ROI and governance-ready delivery.',
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

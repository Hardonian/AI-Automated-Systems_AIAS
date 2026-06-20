export const MESSAGING_CONTRACT = {
  brandName: 'AI Automated Systems',
  shortBrandName: 'AIAS',
  positioningSentence:
    'AIAS is a systems consultancy that turns brittle AI experiments into production-grade automation with clear ownership, audit trails, and measurable operational ROI.',
  primaryTagline: 'AI Systems That Ship — And Stay Running',
  heroSubheading:
    'We design, build, and operate production AI workflows for operations teams — with governance baked in from day one.',
  metadataDescription:
    'AIAS helps operations and engineering teams design, deploy, and govern production AI workflows — with measurable ROI, human-in-the-loop controls, and enterprise-grade reliability.',
  ecosystemAlignment:
    'AIAS leads architecture and governance while Reach, Zeo, and Settler execute aligned demand, implementation, and deployment operations.',
  canonicalTerms: {
    offering: 'AI automation consultancy',
    systemModel: 'production-grade automation systems',
    deliveryModel: 'governance-first delivery',
    controlPlane: 'deterministic control layer',
    intelligencePlane: 'constrained AI advisory layer',
  },
} as const;

export const CANONICAL_TAGLINES = [MESSAGING_CONTRACT.primaryTagline] as const;

export const TAGLINE_TITLE_TEMPLATE = `${MESSAGING_CONTRACT.brandName} | ${MESSAGING_CONTRACT.primaryTagline}`;

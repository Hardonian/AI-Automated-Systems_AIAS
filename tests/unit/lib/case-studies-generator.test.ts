import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the imports BEFORE importing the module to ensure predictable test environment
vi.mock("../../../content/reach.json", () => ({
  default: {
    name: "Reach",
    role: "Demand Shaping",
    focus: ["GTM strategy", "Lead gen"],
    capabilities: ["Campaign orchestration"],
    impactSignals: ["Lower CAC"],
  },
}));

vi.mock("../../../content/zeo.json", () => ({
  default: {
    name: "Zeo",
    role: "Platform Execution",
    focus: ["Agentic workflow"],
    capabilities: ["Multi-agent"],
    impactSignals: ["Reduced overhead"],
  },
}));

vi.mock("../../../content/settler-metadata.json", () => ({
  default: {
    name: "Settler",
    role: "Deployment Ops",
    focus: ["Secure deployment"],
    capabilities: ["PCI compliant"],
    impactSignals: ["Bank-grade security"],
  },
}));

vi.mock("../../../src/content/caseStudies", () => ({
  caseStudies: [
    {
      slug: "mock-legacy-case",
      title: "Mock Legacy Case",
      summary: "Summary",
      clientProblem: "Mock problem",
      systemConstraints: ["Constraint 1"],
      architectureChosen: "Reach and Zeo architecture",
      automationLayer: ["Auto 1"],
      aiIntegration: ["AI 1"],
      tradeoffs: ["Tradeoff 1"],
      governanceModel: ["Gov 1"],
      performanceResults: ["Perf 1"],
      whatNext: ["Next 1"],
    },
    {
      slug: "another-legacy-case",
      title: "Another Legacy Case",
      summary: "Summary",
      clientProblem: "Problem",
      systemConstraints: [],
      architectureChosen: "Some architecture", // Does not mention reach, zeo, or settler explicitly
      automationLayer: [],
      aiIntegration: [],
      tradeoffs: [],
      governanceModel: [],
      performanceResults: [],
      whatNext: [],
    },
  ],
}));

import {
  caseStudies,
  getCaseStudyBySlug,
} from "../../../lib/case-studies-generator";

describe("caseStudies generator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should generate case studies directly from project configs", () => {
    const reach = caseStudies.find((c) => c.slug === "reach");
    expect(reach).toBeDefined();
    expect(reach?.title).toBe("Reach — Demand Shaping");
    expect(reach?.problem).toContain("Enterprises face significant friction");
    expect(reach?.architecture).toEqual(["Campaign orchestration"]);
    expect(reach?.implementationHighlights).toEqual([
      "GTM strategy",
      "Lead gen",
    ]);
    expect(reach?.automationWins).toEqual(["Lower CAC"]);
    expect(reach?.technologies).toContain("Reach");
    expect(reach?.technologies).toContain("Next.js");

    const zeo = caseStudies.find((c) => c.slug === "zeo");
    expect(zeo).toBeDefined();
    expect(zeo?.title).toBe("Zeo — Platform Execution");

    const settler = caseStudies.find((c) => c.slug === "settler");
    expect(settler).toBeDefined();
    expect(settler?.title).toBe("Settler — Deployment Ops");
  });

  it("should map legacy case studies and merge arrays based on architecture mentions", () => {
    const mockCase = caseStudies.find((c) => c.slug === "mock-legacy-case");
    expect(mockCase).toBeDefined();
    expect(mockCase?.title).toBe("Mock Legacy Case");
    expect(mockCase?.problem).toBe("Mock problem");
    expect(mockCase?.architecture).toEqual([
      "Reach and Zeo architecture",
      "Constraint 1",
    ]);
    expect(mockCase?.implementationHighlights).toEqual(["Auto 1", "AI 1"]);

    // It should include 'whatNext' from legacy and 'impactSignals' from Reach and Zeo (since it mentions them)
    expect(mockCase?.automationWins).toEqual([
      "Next 1",
      "Lower CAC",
      "Reduced overhead",
    ]);
    expect(mockCase?.measurableImpact).toEqual(["Perf 1"]);

    // It should include technologies Reach and Zeo
    expect(mockCase?.technologies).toContain("Reach");
    expect(mockCase?.technologies).toContain("Zeo");
    expect(mockCase?.technologies).toContain("Next.js");
    expect(mockCase?.technologies).not.toContain("Settler");
  });

  it("should assume all projects are involved if no explicit mentions are found", () => {
    const anotherCase = caseStudies.find(
      (c) => c.slug === "another-legacy-case",
    );
    expect(anotherCase).toBeDefined();

    // Since architecture and slug do not mention Reach, Zeo, Settler, it falls back to including all of them
    // so automationWins should have impactSignals from all three
    expect(anotherCase?.automationWins).toEqual([
      "Lower CAC",
      "Reduced overhead",
      "Bank-grade security",
    ]);

    expect(anotherCase?.technologies).toContain("Reach");
    expect(anotherCase?.technologies).toContain("Zeo");
    expect(anotherCase?.technologies).toContain("Settler");
  });

  it("should retrieve a case study by slug", () => {
    const study = getCaseStudyBySlug("reach");
    expect(study).toBeDefined();
    expect(study?.slug).toBe("reach");

    const notFound = getCaseStudyBySlug("non-existent");
    expect(notFound).toBeUndefined();
  });
});

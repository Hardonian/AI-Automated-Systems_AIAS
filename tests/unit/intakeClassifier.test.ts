import { describe, expect, it } from "vitest";
import { classifyIntake, IntakeSubmission } from "../../lib/intakeClassifier";

const defaultSubmission: IntakeSubmission = {
  orgType: "startup",
  problemCategory: "manual-operations",
  aiStack: "none",
  modelMix: "single-model",
  failureMode: "hallucination",
  governanceMaturity: "controlled",
  urgency: "this-year",
  scope: "one-off",
  budgetFlexibility: "constrained",
};

describe("classifyIntake", () => {
  it("returns a base score of 0 and Advisory tier for a minimal submission", () => {
    const result = classifyIntake(defaultSubmission);
    expect(result.score).toBe(0);
    expect(result.tier).toBe("advisory");
    expect(result.rationale).toContain(
      "Selected scope favors a focused one-off engagement.",
    );
  });

  describe("Scoring Factors", () => {
    it("increases score for managed-refinement scope", () => {
      const result = classifyIntake({
        ...defaultSubmission,
        scope: "managed-refinement",
      });
      expect(result.score).toBe(3);
      expect(result.rationale).toContain(
        "Selected scope indicates ongoing optimization needs.",
      );
    });

    it("increases score for build-with scope", () => {
      const result = classifyIntake({
        ...defaultSubmission,
        scope: "build-with",
      });
      expect(result.score).toBe(2);
      expect(result.rationale).toContain(
        "Selected scope indicates collaborative implementation.",
      );
    });

    it("increases score for high urgency (this-month)", () => {
      const result = classifyIntake({
        ...defaultSubmission,
        urgency: "this-month",
      });
      expect(result.score).toBe(2);
      expect(result.rationale).toContain(
        "Urgency requires rapid planning and execution.",
      );
    });

    it("increases score for medium urgency (this-quarter)", () => {
      const result = classifyIntake({
        ...defaultSubmission,
        urgency: "this-quarter",
      });
      expect(result.score).toBe(1);
      expect(result.rationale).toContain(
        "Urgency supports near-term phased delivery.",
      );
    });

    it("increases score for strategic budget flexibility", () => {
      const result = classifyIntake({
        ...defaultSubmission,
        budgetFlexibility: "strategic",
      });
      expect(result.score).toBe(2);
      expect(result.rationale).toContain(
        "Budget flexibility supports deeper implementation options.",
      );
    });

    it("increases score for moderate budget flexibility", () => {
      const result = classifyIntake({
        ...defaultSubmission,
        budgetFlexibility: "moderate",
      });
      expect(result.score).toBe(1);
      expect(result.rationale).toContain(
        "Budget flexibility supports phased outcomes.",
      );
    });

    it("increases score for complex problem categories", () => {
      const result1 = classifyIntake({
        ...defaultSubmission,
        problemCategory: "compliance-risk",
      });
      expect(result1.score).toBe(2);
      expect(result1.rationale).toContain(
        "Problem category indicates cross-system complexity and governance needs.",
      );

      const result2 = classifyIntake({
        ...defaultSubmission,
        problemCategory: "data-fragmentation",
      });
      expect(result2.score).toBe(2);
    });

    it("increases score for advanced AI stack", () => {
      const result1 = classifyIntake({
        ...defaultSubmission,
        aiStack: "production",
      });
      expect(result1.score).toBe(2);
      expect(result1.rationale).toContain(
        "Current AI stack indicates active production constraints to stabilize.",
      );

      const result2 = classifyIntake({
        ...defaultSubmission,
        aiStack: "multi-system",
      });
      expect(result2.score).toBe(2);
    });

    it("increases score for complex model mix", () => {
      const result1 = classifyIntake({
        ...defaultSubmission,
        modelMix: "multi-model",
      });
      expect(result1.score).toBe(1);
      expect(result1.rationale).toContain(
        "Model mix indicates orchestration and routing complexity.",
      );

      const result2 = classifyIntake({
        ...defaultSubmission,
        modelMix: "open-and-closed",
      });
      expect(result2.score).toBe(1);
    });

    it("increases score for critical failure modes", () => {
      const result1 = classifyIntake({
        ...defaultSubmission,
        failureMode: "unsafe-actions",
      });
      expect(result1.score).toBe(2);
      expect(result1.rationale).toContain(
        "Failure mode requires governance controls and evaluation hardening.",
      );

      const result2 = classifyIntake({
        ...defaultSubmission,
        failureMode: "evaluation-gaps",
      });
      expect(result2.score).toBe(2);
    });

    it("increases score for low governance maturity", () => {
      const result1 = classifyIntake({
        ...defaultSubmission,
        governanceMaturity: "ad-hoc",
      });
      expect(result1.score).toBe(2);
      expect(result1.rationale).toContain(
        "Governance maturity is ad-hoc, so control-plane foundation is needed first.",
      );

      const result2 = classifyIntake({
        ...defaultSubmission,
        governanceMaturity: "repeatable",
      });
      expect(result2.score).toBe(1);
      expect(result2.rationale).toContain(
        "Governance maturity is repeatable with room for stronger controls.",
      );
    });

    it("increases score for enterprise/public-sector org types", () => {
      const result1 = classifyIntake({
        ...defaultSubmission,
        orgType: "enterprise",
      });
      expect(result1.score).toBe(2);
      expect(result1.rationale).toContain(
        "Organization type indicates enterprise governance and coordination requirements.",
      );

      const result2 = classifyIntake({
        ...defaultSubmission,
        orgType: "public-sector",
      });
      expect(result2.score).toBe(2);
    });
  });

  describe("Tier Transitions", () => {
    it("assigns Advisory tier for score < 4", () => {
      const result = classifyIntake({
        ...defaultSubmission,
        scope: "managed-refinement",
      }); // score 3
      expect(result.score).toBe(3);
      expect(result.tier).toBe("advisory");
    });

    it("assigns Co-build Sprint tier for score 4-6 (non-enterprise)", () => {
      const result = classifyIntake({
        ...defaultSubmission,
        scope: "managed-refinement", // 3
        urgency: "this-quarter", // 1
      }); // total 4
      expect(result.score).toBe(4);
      expect(result.tier).toBe("co-build-sprint");
    });

    it("assigns Managed System Refinement tier for score >= 7 (non-enterprise)", () => {
      const result = classifyIntake({
        ...defaultSubmission,
        scope: "managed-refinement", // 3
        urgency: "this-month", // 2
        aiStack: "production", // 2
      }); // total 7
      expect(result.score).toBe(7);
      expect(result.tier).toBe("managed-system-refinement");
    });

    it("assigns Enterprise Engagement tier for enterprise profile and score >= 6", () => {
      const result = classifyIntake({
        ...defaultSubmission,
        orgType: "enterprise", // 2 + enterprise flag
        scope: "managed-refinement", // 3
        urgency: "this-quarter", // 1
      }); // total 6
      expect(result.score).toBe(6);
      expect(result.tier).toBe("enterprise-engagement");
    });

    it("assigns Managed System Refinement even for enterprise if score >= 7 but not matching enterprise-engagement conditions (hypothetical since enterprise adds score)", () => {
      // Actually if it's enterprise AND score >= 6, it IS enterprise-engagement.
      // The code says: tier = enterpriseProfile && score >= 6 ? 'enterprise-engagement' : score >= 7 ? 'managed-system-refinement' ...
      // So enterprise with score 7 will be 'enterprise-engagement'.
      const result = classifyIntake({
        ...defaultSubmission,
        orgType: "enterprise", // 2
        scope: "managed-refinement", // 3
        urgency: "this-month", // 2
      }); // total 7
      expect(result.score).toBe(7);
      expect(result.tier).toBe("enterprise-engagement");
    });
  });
});

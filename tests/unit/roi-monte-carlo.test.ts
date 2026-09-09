import { describe, expect, it } from "vitest";

import { simulateRoi } from "@/lib/calculators/roi-monte-carlo";

describe("ROI Monte Carlo simulation", () => {
  it("is reproducible and returns ordered percentiles", () => {
    const input = {
      annualSavings: 120_000,
      maturityPercent: 65,
      repetitionPercent: 70,
    };
    const first = simulateRoi(input);
    const second = simulateRoi(input);
    expect(first).toEqual(second);
    expect(first.p10).toBeLessThanOrEqual(first.p50);
    expect(first.p50).toBeLessThanOrEqual(first.p90);
    expect(first.probabilityPositive).toBeGreaterThanOrEqual(0);
    expect(first.probabilityPositive).toBeLessThanOrEqual(100);
  });
});

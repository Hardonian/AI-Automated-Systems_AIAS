export interface RoiMonteCarloInput {
  annualSavings: number;
  maturityPercent: number;
  repetitionPercent: number;
  trials?: number;
}

export interface RoiMonteCarloResult {
  trials: number;
  p10: number;
  p50: number;
  p90: number;
  probabilityPositive: number;
}

const seededRandom = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
  return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
};

const percentile = (values: number[], proportion: number) =>
  values[
    Math.min(values.length - 1, Math.floor((values.length - 1) * proportion))
  ] ?? 0;

/** Deterministic Monte Carlo sensitivity model for client-side reproducibility. */
export function simulateRoi(input: RoiMonteCarloInput): RoiMonteCarloResult {
  const trials = Math.max(500, Math.min(input.trials ?? 5_000, 20_000));
  const seed = Math.round(
    input.annualSavings +
      input.maturityPercent * 101 +
      input.repetitionPercent * 997,
  );
  const random = seededRandom(seed);
  const uncertainty = 0.42 - Math.min(input.maturityPercent, 100) * 0.0025;
  const results = Array.from({ length: trials }, () => {
    // Average three draws to approximate an operational outcome distribution.
    const outcome = (random() + random() + random()) / 3;
    const multiplier = 1 + (outcome - 0.5) * 2 * uncertainty;
    return Math.max(0, input.annualSavings * multiplier - 48_000);
  }).sort((a, b) => a - b);

  return {
    trials,
    p10: Math.round(percentile(results, 0.1)),
    p50: Math.round(percentile(results, 0.5)),
    p90: Math.round(percentile(results, 0.9)),
    probabilityPositive: Math.round(
      (results.filter((result) => result > 0).length / trials) * 100,
    ),
  };
}

/**
 * Feature Flag System — AIAS Platform
 * Simple feature flag system for running experiments
 * Can be replaced with LaunchDarkly, Split.io, or similar service
 */

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  variant?: string;
  variants?: string[];
  rollout?: number; // Percentage of users (0-100)
}

export interface ExperimentConfig {
  id: string;
  name: string;
  enabled: boolean;
  variants: {
    name: string;
    key: string;
    rollout: number; // Percentage (0-100)
  }[];
}

/**
 * In-memory feature flag store
 * TODO: Replace with database or external service (LaunchDarkly, Split.io)
 */
class FeatureFlagStore {
  private flags: Map<string, FeatureFlag> = new Map();
  private experiments: Map<string, ExperimentConfig> = new Map();

  /**
   * Initialize with experiment configurations from experiments.yaml
   */
  initialize() {
    // Experiment: Price Point Test (Starter Plan)
    this.setExperiment({
      id: "exp_price_starter",
      name: "Price Point Test (Starter Plan)",
      enabled: false, // Start disabled, enable when ready
      variants: [
        { name: "Lower Price", key: "variant_a_lower", rollout: 33 },
        { name: "Current Price (Control)", key: "variant_b_control", rollout: 34 },
        { name: "Higher Price", key: "variant_c_higher", rollout: 33 },
      ],
    });

    // Experiment: Free Tier vs Trial
    this.setExperiment({
      id: "exp_free_tier",
      name: "Free Tier vs Limited-Time Trial",
      enabled: false,
      variants: [
        { name: "Free Tier (Current)", key: "variant_a_free_tier", rollout: 33 },
        { name: "14-Day Trial", key: "variant_b_trial", rollout: 33 },
        { name: "Hybrid (Free + Trial)", key: "variant_c_hybrid", rollout: 34 },
      ],
    });

    // Experiment: Value Metric Presentation
    this.setExperiment({
      id: "exp_value_metric",
      name: "Value Metric Presentation",
      enabled: false,
      variants: [
        { name: "Agent-Focused (Current)", key: "variant_a_agent_focused", rollout: 33 },
        { name: "Automation-Focused", key: "variant_b_automation_focused", rollout: 33 },
        { name: "Outcome-Focused", key: "variant_c_outcome_focused", rollout: 34 },
      ],
    });

    // Experiment: Annual Discount
    this.setExperiment({
      id: "exp_annual_discount",
      name: "Annual Discount Test",
      enabled: true, // Currently enabled (20% discount)
      variants: [
        { name: "10% Discount", key: "variant_a_10_percent", rollout: 0 },
        { name: "20% Discount (Current)", key: "variant_b_20_percent", rollout: 100 },
        { name: "No Discount", key: "variant_c_none", rollout: 0 },
      ],
    });

    // Experiment: Onboarding
    this.setExperiment({
      id: "exp_onboarding",
      name: "Done-for-You Onboarding vs Self-Serve",
      enabled: false,
      variants: [
        { name: "Self-Serve (Current)", key: "variant_a_self_serve", rollout: 50 },
        { name: "Done-for-You", key: "variant_b_done_for_you", rollout: 25 },
        { name: "Hybrid", key: "variant_c_hybrid", rollout: 25 },
      ],
    });

    // Experiment: Feature Gating
    this.setExperiment({
      id: "exp_feature_gating",
      name: "Feature Gating Test (Starter vs Pro)",
      enabled: false,
      variants: [
        { name: "Restrictive Starter (Current)", key: "variant_a_restrictive", rollout: 50 },
        { name: "Generous Starter", key: "variant_b_generous", rollout: 50 },
      ],
    });
  }

  /**
   * Set experiment configuration
   */
  setExperiment(config: ExperimentConfig) {
    this.experiments.set(config.id, config);
    
    // Create feature flags for each variant
    config.variants.forEach((variant) => {
      this.flags.set(`${config.id}_${variant.key}`, {
        key: `${config.id}_${variant.key}`,
        enabled: config.enabled && variant.rollout > 0,
        variant: variant.key,
        rollout: variant.rollout,
      });
    });
  }

  /**
   * Get experiment variant for a user
   */
  getExperimentVariant(
    experimentId: string,
    userId?: string,
    sessionId?: string
  ): string | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment || !experiment.enabled) {
      return null;
    }

    // Use consistent hashing for stable assignment
    const identifier = userId || sessionId || Math.random().toString();
    const hash = this.hashString(identifier + experimentId);
    const random = Math.abs(hash) % 100;

    // Assign to variant based on rollout percentages
    let cumulative = 0;
    for (const variant of experiment.variants) {
      cumulative += variant.rollout;
      if (random < cumulative) {
        return variant.key;
      }
    }

    // Fallback to first variant
    return experiment.variants[0]?.key || null;
  }

  /**
   * Check if feature flag is enabled
   */
  isEnabled(flagKey: string, userId?: string, sessionId?: string): boolean {
    const flag = this.flags.get(flagKey);
    if (!flag) {
      return false;
    }

    if (!flag.enabled) {
      return false;
    }

    // If rollout is less than 100%, check if user is in rollout
    if (flag.rollout && flag.rollout < 100) {
      const identifier = userId || sessionId || Math.random().toString();
      const hash = this.hashString(identifier + flagKey);
      const random = Math.abs(hash) % 100;
      return random < flag.rollout;
    }

    return true;
  }

  /**
   * Get feature flag value
   */
  getFlag(flagKey: string): FeatureFlag | null {
    return this.flags.get(flagKey) || null;
  }

  /**
   * Simple hash function for consistent assignment
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  /**
   * Get all experiments
   */
  getAllExperiments(): ExperimentConfig[] {
    return Array.from(this.experiments.values());
  }

  /**
   * Enable/disable experiment
   */
  setExperimentEnabled(experimentId: string, enabled: boolean) {
    const experiment = this.experiments.get(experimentId);
    if (experiment) {
      experiment.enabled = enabled;
      // Update feature flags
      experiment.variants.forEach((variant) => {
        const flag = this.flags.get(`${experimentId}_${variant.key}`);
        if (flag) {
          flag.enabled = enabled && variant.rollout > 0;
        }
      });
    }
  }
}

// Singleton instance
export const featureFlags = new FeatureFlagStore();

// Initialize on import
featureFlags.initialize();

/**
 * Server-side helper to get experiment variant
 */
export function getExperimentVariant(
  experimentId: string,
  userId?: string,
  sessionId?: string
): string | null {
  return featureFlags.getExperimentVariant(experimentId, userId, sessionId);
}

/**
 * Client-side helper (for use in React components)
 */
export function useFeatureFlag(flagKey: string, userId?: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  // Get session ID from storage
  let sessionId = sessionStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = `session_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("session_id", sessionId);
  }

  return featureFlags.isEnabled(flagKey, userId, sessionId);
}

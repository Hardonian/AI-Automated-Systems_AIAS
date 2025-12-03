/**
 * Enhanced Feature Flags System
 * 
 * Supports:
 * - Simple feature toggles
 * - Percentage rollouts
 * - Segment-based targeting
 * - Experiment variants
 * 
 * Usage:
 *   import { isFeatureEnabled, getExperimentVariant } from '@/lib/flags/flags';
 *   const enabled = isFeatureEnabled('new_dashboard', userId);
 *   const variant = getExperimentVariant('dashboard_layout_test', userId);
 */

import flagsConfig from '@/config/flags.json';

// ============================================================================
// Types
// ============================================================================

export type FlagKey = string;
export type ExperimentKey = string;
export type Variant = string;
export type UserId = string;
export type Segment = string;

export type RolloutType = 'static' | 'percentage' | 'segment' | 'experiment';

export interface FeatureFlag {
  enabled: boolean;
  env?: 'development' | 'staging' | 'production';
  description?: string;
  created?: string;
  // Rollout configuration
  rolloutType?: RolloutType;
  rolloutPercentage?: number; // 0-100
  rolloutSegments?: string[]; // Segment names
  // Experiment configuration (if rolloutType is 'experiment')
  experimentKey?: string;
}

export interface ExperimentConfig {
  key: string;
  description?: string;
  enabled: boolean;
  startDate?: string; // ISO date
  endDate?: string; // ISO date
  variants: {
    name: string;
    percentage: number; // 0-100, must sum to 100
  }[];
  // Targeting
  segments?: string[]; // Only run for these segments
  excludeSegments?: string[]; // Exclude these segments
  // Metadata
  created?: string;
  primaryMetric?: string; // Metric to track (e.g., 'conversion_rate')
}

export interface FlagsConfig {
  flags: Record<string, FeatureFlag>;
  experiments?: Record<string, ExperimentConfig>;
  environments: {
    development: { default: boolean };
    staging: { default: boolean };
    production: { default: boolean };
  };
}

// ============================================================================
// Environment Detection
// ============================================================================

function getCurrentEnv(): 'development' | 'staging' | 'production' {
  if (typeof process !== 'undefined') {
    const env = process.env.NODE_ENV || process.env.NEXT_PUBLIC_APP_ENV || 'production';
    if (env === 'development') return 'development';
    if (env === 'staging' || env === 'preview') return 'staging';
  }
  return 'production';
}

// ============================================================================
// Stable Hashing for Consistent Assignment
// ============================================================================

/**
 * Generate a stable hash from a string
 * Used for consistent user-to-variant assignment
 */
function stableHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Get stable bucket number (0-99) for a user/experiment combination
 */
function getStableBucket(userId: string, experimentKey: string): number {
  const combined = `${userId}:${experimentKey}`;
  return stableHash(combined) % 100;
}

// ============================================================================
// Segment Detection
// ============================================================================

/**
 * Get user segments
 * Override this function to integrate with your user segmentation system
 */
function getUserSegments(userId?: string): string[] {
  if (!userId) return [];
  
  // Check for segment indicators
  const segments: string[] = [];
  
  // Example: Check if user is internal/beta
  // You can extend this to check user properties, org membership, etc.
  if (typeof window !== 'undefined') {
    const userData = sessionStorage.getItem('user_segments');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (Array.isArray(parsed)) {
          segments.push(...parsed);
        }
      } catch {
        // Ignore parse errors
      }
    }
  }
  
  return segments;
}

// ============================================================================
// Flag Resolution
// ============================================================================

/**
 * Check if a feature flag is enabled for a user
 */
export function isFeatureEnabled(
  flagKey: FlagKey,
  userId?: UserId
): boolean {
  const config = flagsConfig as FlagsConfig;
  const flag = config.flags[flagKey];
  
  if (!flag) {
    // Flag doesn't exist, return false (safe default)
    return false;
  }
  
  const currentEnv = getCurrentEnv();
  
  // Check environment restriction
  if (flag.env && flag.env !== currentEnv) {
    return false;
  }
  
  // If flag is disabled, return false
  if (!flag.enabled) {
    return false;
  }
  
  // Handle different rollout types
  const rolloutType = flag.rolloutType || 'static';
  
  switch (rolloutType) {
    case 'static':
      return flag.enabled;
      
    case 'percentage':
      if (!userId || !flag.rolloutPercentage) {
        return false; // Require userId for percentage rollouts
      }
      const bucket = stableHash(`${userId}:${flagKey}`) % 100;
      return bucket < flag.rolloutPercentage;
      
    case 'segment':
      if (!userId || !flag.rolloutSegments) {
        return false;
      }
      const userSegments = getUserSegments(userId);
      return flag.rolloutSegments.some(seg => userSegments.includes(seg));
      
    case 'experiment':
      // If flag is tied to an experiment, check experiment variant
      if (flag.experimentKey) {
        const variant = getExperimentVariant(flag.experimentKey, userId);
        return variant !== 'control'; // Enable if not control variant
      }
      return false;
      
    default:
      return flag.enabled;
  }
}

/**
 * Get flag configuration
 */
export function getFlag(flagKey: FlagKey): FeatureFlag | null {
  const config = flagsConfig as FlagsConfig;
  return config.flags[flagKey] || null;
}

/**
 * Get all flags for current environment
 */
export function getAllFlags(userId?: UserId): Record<string, boolean> {
  const config = flagsConfig as FlagsConfig;
  const result: Record<string, boolean> = {};
  
  for (const key of Object.keys(config.flags)) {
    result[key] = isFeatureEnabled(key, userId);
  }
  
  return result;
}

// ============================================================================
// Experiment Resolution
// ============================================================================

/**
 * Get experiment variant for a user
 * Returns 'control' if experiment is not active or user is not eligible
 */
export function getExperimentVariant(
  experimentKey: ExperimentKey,
  userId?: UserId
): Variant {
  const config = flagsConfig as FlagsConfig;
  const experiment = config.experiments?.[experimentKey];
  
  if (!experiment) {
    return 'control'; // Safe default
  }
  
  // Check if experiment is enabled
  if (!experiment.enabled) {
    return 'control';
  }
  
  // Check date range
  const now = new Date();
  if (experiment.startDate && new Date(experiment.startDate) > now) {
    return 'control'; // Not started yet
  }
  if (experiment.endDate && new Date(experiment.endDate) < now) {
    return 'control'; // Already ended
  }
  
  // Check segment targeting
  if (userId) {
    const userSegments = getUserSegments(userId);
    
    // Exclude segments
    if (experiment.excludeSegments?.some(seg => userSegments.includes(seg))) {
      return 'control';
    }
    
    // Require segments (if specified)
    if (experiment.segments && experiment.segments.length > 0) {
      const hasRequiredSegment = experiment.segments.some(seg => userSegments.includes(seg));
      if (!hasRequiredSegment) {
        return 'control';
      }
    }
  } else {
    // Require userId for segment-based experiments
    if (experiment.segments && experiment.segments.length > 0) {
      return 'control';
    }
  }
  
  // Assign variant based on stable hash
  if (!userId) {
    // Fallback to random assignment if no userId
    const random = Math.random() * 100;
    let cumulative = 0;
    for (const variant of experiment.variants) {
      cumulative += variant.percentage;
      if (random < cumulative) {
        return variant.name;
      }
    }
    return experiment.variants[0]?.name || 'control';
  }
  
  // Stable assignment based on user ID
  const bucket = getStableBucket(userId, experimentKey);
  let cumulative = 0;
  for (const variant of experiment.variants) {
    cumulative += variant.percentage;
    if (bucket < cumulative) {
      return variant.name;
    }
  }
  
  // Fallback to first variant
  return experiment.variants[0]?.name || 'control';
}

/**
 * Get experiment configuration
 */
export function getExperiment(experimentKey: ExperimentKey): ExperimentConfig | null {
  const config = flagsConfig as FlagsConfig;
  return config.experiments?.[experimentKey] || null;
}

/**
 * Get all active experiments for a user
 */
export function getActiveExperiments(userId?: UserId): Record<string, Variant> {
  const config = flagsConfig as FlagsConfig;
  const result: Record<string, Variant> = {};
  
  if (!config.experiments) return result;
  
  for (const key of Object.keys(config.experiments)) {
    const variant = getExperimentVariant(key, userId);
    if (variant !== 'control') {
      result[key] = variant;
    }
  }
  
  return result;
}

// ============================================================================
// Metadata & Debugging
// ============================================================================

/**
 * Get flag metadata (for debugging/admin)
 */
export function getFlagMetadata(userId?: UserId): {
  currentEnv: string;
  flags: Record<string, FeatureFlag>;
  enabledFlags: string[];
  experiments: Record<string, ExperimentConfig>;
  activeExperiments: Record<string, Variant>;
} {
  const currentEnv = getCurrentEnv();
  const config = flagsConfig as FlagsConfig;
  const enabledFlags: string[] = [];
  
  for (const key of Object.keys(config.flags)) {
    if (isFeatureEnabled(key, userId)) {
      enabledFlags.push(key);
    }
  }
  
  return {
    currentEnv,
    flags: config.flags,
    enabledFlags,
    experiments: config.experiments || {},
    activeExperiments: getActiveExperiments(userId),
  };
}

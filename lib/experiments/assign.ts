/**
 * Experiment Assignment & Tracking
 * 
 * Handles experiment variant assignment and automatically tracks
 * assignment events to analytics.
 * 
 * Usage:
 *   import { assignExperimentVariant } from '@/lib/experiments/assign';
 *   const variant = await assignExperimentVariant('onboarding_flow_v2', userId);
 */

import { getExperimentVariant, getExperiment } from '@/lib/flags/flags';
import { trackExperimentAssigned } from '@/lib/telemetry/events';

/**
 * Assign experiment variant to user and track assignment
 * 
 * This function:
 * 1. Gets the variant for the user (stable assignment)
 * 2. Tracks the assignment event to analytics
 * 3. Returns the variant
 */
export async function assignExperimentVariant(
  experimentKey: string,
  userId: string
): Promise<string> {
  const variant = getExperimentVariant(experimentKey, userId);
  const experiment = getExperiment(experimentKey);
  
  // Track assignment event
  try {
    await trackExperimentAssigned({
      experimentKey,
      variant,
      userId,
      assignmentMethod: 'stable_hash',
    });
  } catch (error) {
    console.error(`Failed to track experiment assignment for ${experimentKey}:`, error);
    // Don't fail assignment if tracking fails
  }
  
  return variant;
}

/**
 * Get experiment variant without tracking (for read-only checks)
 */
export function getExperimentVariantSync(
  experimentKey: string,
  userId?: string
): string {
  return getExperimentVariant(experimentKey, userId);
}

/**
 * Check if user is in an experiment
 */
export function isInExperiment(
  experimentKey: string,
  userId?: string
): boolean {
  const variant = getExperimentVariant(experimentKey, userId);
  return variant !== 'control';
}

/**
 * Get all experiments user is in
 */
export function getUserExperiments(userId?: string): Record<string, string> {
  const experiments: Record<string, string> = {};
  
  // This would need access to experiment config
  // For now, return empty - this can be enhanced
  return experiments;
}

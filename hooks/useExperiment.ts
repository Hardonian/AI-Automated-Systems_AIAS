/**
 * React Hook for Experiments
 * 
 * Usage:
 *   const variant = useExperimentVariant('dashboard_layout_test');
 *   if (variant === 'variant_a') return <DashboardLayoutA />;
 *   if (variant === 'variant_b') return <DashboardLayoutB />;
 *   return <DashboardLayoutControl />;
 */

import { useState, useEffect } from 'react';
import { getExperimentVariant, ExperimentKey, Variant, UserId } from '@/lib/flags/flags';
import { trackExperimentViewed } from '@/lib/telemetry/events';

/**
 * Get current user ID from context/session
 */
function getCurrentUserId(): UserId | undefined {
  if (typeof window === 'undefined') return undefined;
  
  const userId = sessionStorage.getItem('user_id');
  if (userId) return userId;
  
  return sessionStorage.getItem('analytics_session_id') || undefined;
}

/**
 * Hook to get experiment variant for current user
 * Automatically tracks view event when variant is displayed
 */
export function useExperimentVariant(experimentKey: ExperimentKey): Variant {
  const [variant, setVariant] = useState<Variant>('control');
  const [hasTrackedView, setHasTrackedView] = useState(false);
  
  useEffect(() => {
    const userId = getCurrentUserId();
    const assignedVariant = getExperimentVariant(experimentKey, userId);
    setVariant(assignedVariant);
    
    // Track view event once when variant is assigned
    if (!hasTrackedView && assignedVariant !== 'control') {
      trackExperimentViewed({
        experimentKey,
        variant: assignedVariant,
      }).catch(error => {
        console.error(`Failed to track experiment view for ${experimentKey}:`, error);
      });
      setHasTrackedView(true);
    }
  }, [experimentKey, hasTrackedView]);
  
  return variant;
}

/**
 * Hook to check if user is in an experiment
 */
export function useIsInExperiment(experimentKey: ExperimentKey): boolean {
  const variant = useExperimentVariant(experimentKey);
  return variant !== 'control';
}

/**
 * Hook to get multiple experiment variants at once
 */
export function useExperimentVariants(
  experimentKeys: ExperimentKey[]
): Record<string, Variant> {
  const [variants, setVariants] = useState<Record<string, Variant>>({});
  
  useEffect(() => {
    const userId = getCurrentUserId();
    const result: Record<string, Variant> = {};
    
    for (const key of experimentKeys) {
      result[key] = getExperimentVariant(key, userId);
      
      // Track view for non-control variants
      if (result[key] !== 'control') {
        trackExperimentViewed({
          experimentKey: key,
          variant: result[key],
        }).catch(error => {
          console.error(`Failed to track experiment view for ${key}:`, error);
        });
      }
    }
    
    setVariants(result);
  }, [experimentKeys.join(',')]);
  
  return variants;
}

/**
 * React Hook for Feature Flags
 * 
 * Usage:
 *   const isEnabled = useFeatureFlag('new_dashboard');
 *   if (isEnabled) return <NewDashboard />;
 */

import { useState, useEffect } from 'react';
import { isFeatureEnabled, FlagKey, UserId } from '@/lib/flags/flags';

/**
 * Get current user ID from context/session
 * Override this based on your auth setup
 */
function getCurrentUserId(): UserId | undefined {
  if (typeof window === 'undefined') return undefined;
  
  // Try to get from session storage
  const userId = sessionStorage.getItem('user_id');
  if (userId) return userId;
  
  // Fallback to session ID
  return sessionStorage.getItem('analytics_session_id') || undefined;
}

/**
 * Hook to check if a feature flag is enabled
 */
export function useFeatureFlag(flagKey: FlagKey): boolean {
  const [enabled, setEnabled] = useState(false);
  
  useEffect(() => {
    const userId = getCurrentUserId();
    const isEnabled = isFeatureEnabled(flagKey, userId);
    setEnabled(isEnabled);
  }, [flagKey]);
  
  return enabled;
}

/**
 * Hook to get multiple feature flags at once
 */
export function useFeatureFlags(flagKeys: FlagKey[]): Record<string, boolean> {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    const userId = getCurrentUserId();
    const result: Record<string, boolean> = {};
    
    for (const key of flagKeys) {
      result[key] = isFeatureEnabled(key, userId);
    }
    
    setFlags(result);
  }, [flagKeys.join(',')]); // Re-run if keys change
  
  return flags;
}

/**
 * Edge AI Feature Flags
 * Check user entitlements for Edge AI features based on subscription plan
 */

import { isFeatureEnabled } from '@/lib/flags/flags';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);

/**
 * Check if user can upload models
 */
export async function canUploadModels(userId: string): Promise<boolean> {
  // Check feature flag
  if (!isFeatureEnabled('edge_ai_models', userId)) {
    return false;
  }

  // Check subscription plan limits
  const limits = await getUserLimits(userId);
  return limits.maxModels === -1 || limits.currentModels < limits.maxModels;
}

/**
 * Check if user can create optimization jobs
 */
export async function canCreateOptimizationJobs(userId: string): Promise<boolean> {
  if (!isFeatureEnabled('edge_ai_optimization', userId)) {
    return false;
  }

  const limits = await getUserLimits(userId);
  return limits.maxOptimizations === -1 || limits.currentOptimizations < limits.maxOptimizations;
}

/**
 * Check if user can run benchmarks
 */
export async function canRunBenchmarks(userId: string): Promise<boolean> {
  if (!isFeatureEnabled('edge_ai_benchmarking', userId)) {
    return false;
  }

  const limits = await getUserLimits(userId);
  return limits.maxBenchmarks === -1 || limits.currentBenchmarks < limits.maxBenchmarks;
}

/**
 * Check if user can download artifacts
 */
export async function canDownloadArtifacts(userId: string): Promise<boolean> {
  return isFeatureEnabled('edge_ai_artifacts', userId);
}

/**
 * Get user limits based on subscription plan
 */
export async function getUserLimits(userId: string): Promise<{
  maxModels: number;
  currentModels: number;
  maxOptimizations: number;
  currentOptimizations: number;
  maxBenchmarks: number;
  currentBenchmarks: number;
  maxModelSizeBytes: number;
}> {
  // Get user's subscription plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  // TODO: Get actual subscription plan from subscriptions table
  // For now, return default limits
  const planLimits: Record<string, {
    maxModels: number;
    maxOptimizations: number;
    maxBenchmarks: number;
    maxModelSizeBytes: number;
  }> = {
    free: {
      maxModels: 3,
      maxOptimizations: 5,
      maxBenchmarks: 10,
      maxModelSizeBytes: 100 * 1024 * 1024, // 100MB
    },
    starter: {
      maxModels: 20,
      maxOptimizations: 50,
      maxBenchmarks: 100,
      maxModelSizeBytes: 500 * 1024 * 1024, // 500MB
    },
    pro: {
      maxModels: 100,
      maxOptimizations: 500,
      maxBenchmarks: 1000,
      maxModelSizeBytes: 2 * 1024 * 1024 * 1024, // 2GB
    },
    enterprise: {
      maxModels: -1, // Unlimited
      maxOptimizations: -1,
      maxBenchmarks: -1,
      maxModelSizeBytes: 10 * 1024 * 1024 * 1024, // 10GB
    },
  };

  // Default to free plan if no subscription found
  const plan = 'free'; // TODO: Get from subscription
  const limits = planLimits[plan] || planLimits.free;

  // Get current usage
  const { count: modelCount } = await supabase
    .from('edge_ai_models')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .neq('status', 'archived');

  const { count: optimizationCount } = await supabase
    .from('edge_ai_optimization_jobs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .in('status', ['pending', 'queued', 'running', 'completed']);

  const { count: benchmarkCount } = await supabase
    .from('edge_ai_benchmark_runs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .in('status', ['pending', 'queued', 'running', 'completed']);

  return {
    ...limits,
    currentModels: modelCount || 0,
    currentOptimizations: optimizationCount || 0,
    currentBenchmarks: benchmarkCount || 0,
  };
}

/**
 * Check if model size is within limits
 */
export async function isModelSizeAllowed(userId: string, sizeBytes: number): Promise<boolean> {
  const limits = await getUserLimits(userId);
  return limits.maxModelSizeBytes === -1 || sizeBytes <= limits.maxModelSizeBytes;
}

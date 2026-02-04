import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/lib/api/route-handler';
import { env } from '@/lib/env';
import { logger } from '@/lib/logging/structured-logger';
import { cacheService } from '@/lib/performance/cache';

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);

export const dynamic = 'force-dynamic';
const inFlight = new Map<string, Promise<FunnelMetrics>>();

type FunnelMetrics = {
  signup: number;
  onboarding: number;
  integration: number;
  workflow: number;
  execution: number;
  activation: number;
};

async function fetchFunnelMetrics(
  startDateIso: string
): Promise<FunnelMetrics> {
  const { data, error } = await supabase.rpc('get_funnel_metrics', {
    start_ts: startDateIso,
  });

  if (!error && data && Array.isArray(data) && data.length > 0) {
    const row = data[0] as Record<string, number>;
    return {
      signup: row.signup ?? 0,
      onboarding: row.onboarding_start ?? 0,
      integration: row.integration_connect ?? 0,
      workflow: row.workflow_create ?? 0,
      execution: row.workflow_execute ?? 0,
      activation: row.activated ?? 0,
    };
  }

  if (error) {
    logger.warn('Funnel RPC failed, falling back to per-stage counts', {
      error: error.message,
    });
  }

  const [
    { count: signupCount },
    { count: onboardingCount },
    { count: integrationCount },
    { count: workflowCount },
    { count: executionCount },
    { count: activationCount },
  ] = await Promise.all([
    supabase
      .from('app_events')
      .select('user_id', { count: 'exact', head: true })
      .eq('event_type', 'funnel_stage')
      .eq('meta->>stage', 'signup')
      .gte('created_at', startDateIso),
    supabase
      .from('app_events')
      .select('user_id', { count: 'exact', head: true })
      .eq('event_type', 'funnel_stage')
      .eq('meta->>stage', 'onboarding_start')
      .gte('created_at', startDateIso),
    supabase
      .from('app_events')
      .select('user_id', { count: 'exact', head: true })
      .eq('event_type', 'funnel_stage')
      .eq('meta->>stage', 'integration_connect')
      .gte('created_at', startDateIso),
    supabase
      .from('app_events')
      .select('user_id', { count: 'exact', head: true })
      .eq('event_type', 'funnel_stage')
      .eq('meta->>stage', 'workflow_create')
      .gte('created_at', startDateIso),
    supabase
      .from('app_events')
      .select('user_id', { count: 'exact', head: true })
      .eq('event_type', 'funnel_stage')
      .eq('meta->>stage', 'workflow_execute')
      .gte('created_at', startDateIso),
    supabase
      .from('app_events')
      .select('user_id', { count: 'exact', head: true })
      .eq('event_type', 'funnel_stage')
      .eq('meta->>stage', 'activated')
      .gte('created_at', startDateIso),
  ]);

  return {
    signup: signupCount ?? 0,
    onboarding: onboardingCount ?? 0,
    integration: integrationCount ?? 0,
    workflow: workflowCount ?? 0,
    execution: executionCount ?? 0,
    activation: activationCount ?? 0,
  };
}

async function getCachedFunnelMetrics(
  startDateIso: string
): Promise<FunnelMetrics> {
  const cacheKey = `analytics:funnel:${startDateIso.slice(0, 10)}`;
  const cached = await cacheService.get<FunnelMetrics>(cacheKey);
  if (cached) {
    return cached;
  }

  const existing = inFlight.get(cacheKey);
  if (existing) {
    return existing;
  }

  const promise = (async () => {
    try {
      const metrics = await fetchFunnelMetrics(startDateIso);
      await cacheService.set(cacheKey, metrics, {
        ttl: 60,
        tags: ['analytics:funnel'],
      });
      return metrics;
    } finally {
      inFlight.delete(cacheKey);
    }
  })();

  inFlight.set(cacheKey, promise);
  return promise;
}

/**
 * GET /api/analytics/funnel
 * Get activation funnel metrics
 */
export async function GET(request: NextRequest) {
  try {
    // Get user from auth
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : request.cookies.get('sb-access-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (for now, allow all authenticated users)
    // In production, add admin check

    // Get funnel data from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const startDateIso = thirtyDaysAgo.toISOString();

    const { signup, onboarding, integration, workflow, execution, activation } =
      await getCachedFunnelMetrics(startDateIso);

    const conversionRates = {
      signupToOnboarding: signup > 0 ? (onboarding / signup) * 100 : 0,
      onboardingToIntegration:
        onboarding > 0 ? (integration / onboarding) * 100 : 0,
      integrationToWorkflow:
        integration > 0 ? (workflow / integration) * 100 : 0,
      workflowToExecute: workflow > 0 ? (execution / workflow) * 100 : 0,
      overallActivation: signup > 0 ? (activation / signup) * 100 : 0,
    };

    return NextResponse.json(
      {
        period: 'last_30_days',
        stages: {
          signup,
          onboarding_start: onboarding,
          integration_connect: integration,
          workflow_create: workflow,
          workflow_execute: execution,
          activated: activation,
        },
        conversionRates,
        dropOffPoints: {
          signupToOnboarding: signup - onboarding,
          onboardingToIntegration: onboarding - integration,
          integrationToWorkflow: integration - workflow,
          workflowToExecute: workflow - execution,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    logger.error(
      'Error in GET /api/analytics/funnel',
      error instanceof Error ? error : undefined
    );
    return handleApiError(error, 'Failed to get funnel data');
  }
}

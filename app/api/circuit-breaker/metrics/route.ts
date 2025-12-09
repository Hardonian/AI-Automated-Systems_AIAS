/**
 * Circuit Breaker Metrics Endpoint
 * Returns current state of all circuit breakers
 */

import { NextResponse } from 'next/server';

import { createGETHandler } from '@/lib/api/route-handler';
import { circuitBreakerRegistry } from '@/lib/resilience/circuit-breaker';

export const GET = createGETHandler(
  async () => {
    const metrics = circuitBreakerRegistry.getAllMetrics();
    
    return NextResponse.json({
      circuitBreakers: metrics,
      timestamp: new Date().toISOString(),
    });
  },
  {
    requireAuth: true,
    cache: {
      enabled: true,
      ttl: 10, // Cache for 10 seconds
    },
  }
);

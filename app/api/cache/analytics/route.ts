/**
 * Cache Analytics Endpoint
 * Provides detailed cache performance metrics
 */

import { NextResponse } from 'next/server';
import { createGETHandler } from '@/lib/api/route-handler';
import { cacheService } from '@/lib/performance/cache';

export const GET = createGETHandler(
  async () => {
    const stats = cacheService.getStats();
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      cache: {
        provider: stats.provider,
        size: stats.size,
        maxSize: stats.maxSize,
        utilization: {
          percentage: (stats.size / stats.maxSize) * 100,
          used: stats.size,
          available: stats.maxSize - stats.size,
        },
        performance: {
          // These would be tracked over time in a real implementation
          hitRate: null,
          missRate: null,
          evictions: null,
        },
        recommendations: [
          stats.size / stats.maxSize > 0.8
            ? 'Cache is nearly full, consider increasing maxSize or implementing eviction policy'
            : 'Cache utilization is healthy',
          stats.provider === 'in-memory'
            ? 'Consider configuring Redis or Vercel KV for distributed caching in production'
            : 'Distributed caching is configured',
        ],
      },
    });
  },
  {
    requireAuth: true,
    cache: {
      enabled: true,
      ttl: 60, // Cache for 1 minute
    },
  }
);

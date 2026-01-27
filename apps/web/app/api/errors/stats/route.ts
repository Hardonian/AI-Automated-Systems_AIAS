/**
 * Error Statistics Endpoint
 * Returns error tracking statistics and analytics
 */

import { NextResponse } from 'next/server';

import { createGETHandler } from '@/lib/api/route-handler';
import { errorTracker } from '@/lib/monitoring/enhanced-error-tracker';

export const GET = createGETHandler(
  async () => {
    const stats = errorTracker.getErrorStats();
    const grouped = errorTracker.getErrorsByFingerprint();
    
    // Calculate top errors
    const topErrors = Object.entries(grouped)
      .map(([fingerprint, errors]) => ({
        fingerprint,
        count: errors.length,
        latest: errors[errors.length - 1],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      summary: {
        total: stats.total,
        bySeverity: stats.bySeverity,
        byCode: stats.byCode,
      },
      topErrors,
      recentErrors: stats.recentErrors,
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

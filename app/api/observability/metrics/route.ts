/**
 * Observability Metrics Endpoint
 * 
 * Provides system metrics for monitoring dashboards
 * Accessible at /api/observability/metrics
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

interface SystemMetrics {
  timestamp: string;
  database: {
    connections: number;
    queryTime: number;
    health: "healthy" | "degraded" | "unhealthy";
  };
  api: {
    requestsPerMinute: number;
    averageResponseTime: number;
    errorRate: number;
  };
  storage: {
    used: number;
    available: number;
    buckets: number;
  };
  cache: {
    hitRate: number;
    size: number;
  };
}

export async function GET() {
  try {
    const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);
    const timestamp = new Date().toISOString();

    // Get database metrics
    const dbStart = Date.now();
    const { error: dbError } = await supabase.from("app_events").select("count").limit(1);
    const dbQueryTime = Date.now() - dbStart;

    // Get storage metrics
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();

    const metrics: SystemMetrics = {
      timestamp,
      database: {
        connections: 0, // Would need connection pool metrics
        queryTime: dbQueryTime,
        health: dbError ? "unhealthy" : dbQueryTime > 1000 ? "degraded" : "healthy",
      },
      api: {
        requestsPerMinute: 0, // Would need to track from middleware
        averageResponseTime: 0,
        errorRate: 0,
      },
      storage: {
        used: 0, // Would need storage usage API
        available: 0,
        buckets: buckets?.length || 0,
      },
      cache: {
        hitRate: 0, // Would need cache metrics
        size: 0,
      },
    };

    return NextResponse.json(metrics, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch metrics",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

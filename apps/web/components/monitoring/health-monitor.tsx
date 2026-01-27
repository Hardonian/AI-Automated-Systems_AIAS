"use client";

import { Activity, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Health Monitor Component
 * 
 * Monitors the health status endpoint and displays KPI status.
 * Can be embedded in admin dashboards or status pages.
 */

interface HealthStatus {
  status: "loud_and_high" | "needs_attention";
  timestamp: string;
  kpis: {
    newUsersWeek: {
      value: number;
      threshold: number;
      met: boolean;
    };
    avgPostViews: {
      value: number;
      threshold: number;
      met: boolean;
    };
    actionsLastHour: {
      value: number;
      threshold: number;
      met: boolean;
    };
  };
  allCylindersFiring: boolean;
  message: string;
}

export function HealthMonitor({ autoRefresh = true, refreshInterval = 60000 }: { autoRefresh?: boolean; refreshInterval?: number }) {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/status/health");
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`);
      }

      const data = await response.json();
      setHealth(data);
      setLastChecked(new Date());
    } catch (err: any) {
      setError(err.message);
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();

    if (autoRefresh) {
      const interval = setInterval(fetchHealth, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  if (loading && !health) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 animate-pulse" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading health status...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-destructive" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive mb-4">{error}</p>
          <Button size="sm" variant="outline" onClick={fetchHealth}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!health) {
    return null;
  }

  const allMet = health.allCylindersFiring;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {allMet ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-yellow-500" />
          )}
          System Health
        </CardTitle>
        <CardDescription>
          {health.message}
          {lastChecked && (
            <span className="block text-xs mt-1">
              Last checked: {lastChecked.toLocaleTimeString()}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* KPI 1 */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">New Users This Week</p>
              <p className="text-sm text-muted-foreground">KPI 1: Growth Momentum</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{health.kpis.newUsersWeek.value}</p>
              <Badge variant={health.kpis.newUsersWeek.met ? "default" : "secondary"}>
                {health.kpis.newUsersWeek.met ? "✓ Met" : "Needs Growth"}
              </Badge>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Average Post Views</p>
              <p className="text-sm text-muted-foreground">KPI 2: Content Engagement</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{Math.round(health.kpis.avgPostViews.value)}</p>
              <Badge variant={health.kpis.avgPostViews.met ? "default" : "secondary"}>
                {health.kpis.avgPostViews.met ? "✓ Met" : "Building"}
              </Badge>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Actions Last Hour</p>
              <p className="text-sm text-muted-foreground">KPI 3: Real-Time Engagement</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{health.kpis.actionsLastHour.value}</p>
              <Badge variant={health.kpis.actionsLastHour.met ? "default" : "secondary"}>
                {health.kpis.actionsLastHour.met ? "✓ Met" : "Active"}
              </Badge>
            </div>
          </div>

          {/* Overall Status */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Status</span>
              <Badge className="text-lg px-3 py-1" variant={allMet ? "default" : "secondary"}>
                {allMet ? "Loud and High ✓" : "Needs Attention"}
              </Badge>
            </div>
          </div>

          {/* Refresh Button */}
          <Button className="w-full" size="sm" variant="outline" onClick={fetchHealth}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

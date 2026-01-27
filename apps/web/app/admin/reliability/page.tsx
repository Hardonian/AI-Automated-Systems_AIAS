"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { logger } from "@/lib/logging/structured-logger";

interface ReliabilityDashboard {
  timestamp: string;
  uptime: {
    current: number;
    target: number;
    status: 'healthy' | 'degraded' | 'critical';
    trend: 'improving' | 'degrading' | 'stable';
  };
  performance: {
    latency_p95: number;
    error_rate: number;
    throughput: number;
  };
  dependencies: {
    outdated: number;
    vulnerabilities: number;
    critical_vulnerabilities: number;
  };
  cost: {
    current_monthly: number;
    projected_monthly: number;
    budget: number;
    status: 'within_budget' | 'over_budget';
  };
  security: {
    secrets_exposed: number;
    rls_enabled: boolean;
    tls_enforced: boolean;
    compliance_score: number;
  };
  trends: {
    last_7_days: {
      uptime: number[];
      latency: number[];
      cost: number[];
    };
  };
  recommendations: string[];
}

export default function ReliabilityDashboardPage() {
  const [dashboard, setDashboard] = useState<ReliabilityDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchDashboard();
    const interval = setInterval(() => {
      void fetchDashboard();
    }, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  async function fetchDashboard() {
    try {
      const response = await fetch("/api/admin/reliability");
      if (!response.ok) {throw new Error(`HTTP ${response.status}`);}
      const data = await response.json();
      setDashboard(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      logger.error("Failed to fetch reliability dashboard", err instanceof Error ? err : new Error(String(err)), {
        component: "ReliabilityPage",
        action: "fetchDashboard",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading reliability dashboard...</div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle>Error Loading Dashboard</CardTitle>
            <CardDescription>{error || "No data available"}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const statusColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600"
  }[dashboard.uptime.status];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reliability Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Autonomous monitoring and forecasting
          </p>
        </div>
        <div className="text-right">
          <div className={`text-lg font-semibold ${statusColor}`}>
            Status: {dashboard.uptime.status.toUpperCase()}
          </div>
          <div className="text-sm text-muted-foreground">
            Updated: {new Date(dashboard.timestamp).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Uptime */}
      <Card>
        <CardHeader>
          <CardTitle>Uptime</CardTitle>
          <CardDescription>Service availability metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              good={dashboard.uptime.current >= dashboard.uptime.target}
              label="Current Uptime"
              unit="%"
              value={dashboard.uptime.current.toFixed(2)}
            />
            <MetricCard
              label="Target"
              unit="%"
              value={dashboard.uptime.target.toFixed(1)}
            />
            <MetricCard
              good={dashboard.uptime.status === 'healthy'}
              label="Status"
              value={dashboard.uptime.status}
            />
            <MetricCard
              label="Trend"
              value={dashboard.uptime.trend}
            />
          </div>
        </CardContent>
      </Card>

      {/* Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance</CardTitle>
          <CardDescription>Latency, error rate, and throughput</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              good={dashboard.performance.latency_p95 < 2000}
              label="P95 Latency"
              unit="ms"
              value={dashboard.performance.latency_p95.toFixed(0)}
            />
            <MetricCard
              good={dashboard.performance.error_rate < 1}
              label="Error Rate"
              unit="%"
              value={dashboard.performance.error_rate.toFixed(2)}
            />
            <MetricCard
              label="Throughput"
              unit="req/min"
              value={dashboard.performance.throughput.toFixed(0)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dependencies */}
      <Card>
        <CardHeader>
          <CardTitle>Dependencies</CardTitle>
          <CardDescription>Package health and vulnerabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              good={dashboard.dependencies.outdated === 0}
              label="Outdated Packages"
              value={dashboard.dependencies.outdated}
            />
            <MetricCard
              good={dashboard.dependencies.vulnerabilities === 0}
              label="Vulnerabilities"
              value={dashboard.dependencies.vulnerabilities}
            />
            <MetricCard
              good={dashboard.dependencies.critical_vulnerabilities === 0}
              label="Critical Vulnerabilities"
              value={dashboard.dependencies.critical_vulnerabilities}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cost */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Forecast</CardTitle>
          <CardDescription>Monthly infrastructure costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              label="Current Monthly"
              value={`$${dashboard.cost.current_monthly.toFixed(2)}`}
            />
            <MetricCard
              label="Projected Monthly"
              value={`$${dashboard.cost.projected_monthly.toFixed(2)}`}
            />
            <MetricCard
              label="Budget"
              value={`$${dashboard.cost.budget}`}
            />
            <MetricCard
              good={dashboard.cost.status === 'within_budget'}
              label="Status"
              value={dashboard.cost.status === 'over_budget' ? '⚠️ Over Budget' : '✅ Within Budget'}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security & Compliance</CardTitle>
          <CardDescription>Security posture and compliance status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              good={dashboard.security.secrets_exposed === 0}
              label="Secrets Exposed"
              value={dashboard.security.secrets_exposed}
            />
            <MetricCard
              good={dashboard.security.rls_enabled}
              label="RLS Enabled"
              value={dashboard.security.rls_enabled ? '✅' : '❌'}
            />
            <MetricCard
              good={dashboard.security.tls_enforced}
              label="TLS Enforced"
              value={dashboard.security.tls_enforced ? '✅' : '❌'}
            />
            <MetricCard
              good={dashboard.security.compliance_score >= 80}
              label="Compliance Score"
              unit="/100"
              value={dashboard.security.compliance_score}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {dashboard.recommendations && dashboard.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Action items from orchestrator</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {dashboard.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  unit,
  good,
}: {
  label: string;
  value: string | number;
  unit?: string;
  good?: boolean;
}) {
  const colorClass =
    good === undefined
      ? "text-foreground"
      : good
      ? "text-green-600"
      : "text-red-600";

  return (
    <div className="p-4 border rounded-lg">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={`text-2xl font-bold mt-2 ${colorClass}`}>
        {value}
        {unit && <span className="text-lg ml-1">{unit}</span>}
      </div>
    </div>
  );
}

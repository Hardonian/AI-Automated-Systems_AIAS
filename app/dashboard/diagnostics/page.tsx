/**
 * Diagnostics Page
 * Tenant-admin only page showing system health, last webhook, last run, entitlements
 */

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface DiagnosticsData {
  lastWebhook: {
    id: string;
    received_at: string;
    tenant_id: string;
    status: string;
  } | null;
  lastRun: {
    id: string;
    workflow_id: string;
    status: string;
    started_at: string;
    completed_at: string | null;
  } | null;
  entitlements: {
    plan: string;
    maxSystems: number;
    maxWebhooks: number;
    maxRunsPerMonth: number;
    systemsUsed: number;
    webhooksUsed: number;
    runsUsedThisMonth: number;
  };
  queueHealth: {
    pending: number;
    running: number;
    failed: number;
  };
}

export default function DiagnosticsPage() {
  const [data, setData] = useState<DiagnosticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchDiagnostics = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Not authenticated");
        return;
      }

      // Get user's tenant
      const { data: membership } = await supabase
        .from("tenant_members")
        .select("tenant_id, role")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      if (!membership || membership.role !== "admin") {
        setError("Admin access required");
        return;
      }

      const tenantId = membership.tenant_id;

      // Fetch last webhook
      const { data: lastWebhook } = await supabase
        .from("workflow_executions")
        .select("id, started_at, tenant_id, status, metadata")
        .eq("tenant_id", tenantId)
        .eq("metadata->>trigger_type", "webhook")
        .order("started_at", { ascending: false })
        .limit(1)
        .single();

      // Fetch last run
      const { data: lastRun } = await supabase
        .from("workflow_executions")
        .select("id, workflow_id, status, started_at, completed_at")
        .eq("tenant_id", tenantId)
        .order("started_at", { ascending: false })
        .limit(1)
        .single();

      // Fetch entitlements (simplified - would use server-side gates in production)
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("tier")
        .eq("tenant_id", tenantId)
        .eq("status", "active")
        .single();

      const plan = subscription?.tier || "free";
      const planLimits = {
        free: { maxSystems: 3, maxWebhooks: 5, maxRunsPerMonth: 100 },
        starter: { maxSystems: 20, maxWebhooks: 50, maxRunsPerMonth: 10000 },
        pro: { maxSystems: 100, maxWebhooks: 500, maxRunsPerMonth: 50000 },
        enterprise: { maxSystems: -1, maxWebhooks: -1, maxRunsPerMonth: -1 },
      };
      const limits = planLimits[plan as keyof typeof planLimits] || planLimits.free;

      // Count usage
      const { count: systemsCount } = await supabase
        .from("workflows")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", tenantId)
        .eq("enabled", true);

      const { count: webhooksCount } = await supabase
        .from("webhook_endpoints")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", tenantId)
        .eq("enabled", true);

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const { count: runsCount } = await supabase
        .from("workflow_executions")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", tenantId)
        .gte("started_at", monthStart.toISOString());

      // Queue health
      const { count: pendingCount } = await supabase
        .from("workflow_executions")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", tenantId)
        .eq("status", "pending");

      const { count: runningCount } = await supabase
        .from("workflow_executions")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", tenantId)
        .eq("status", "running");

      const { count: failedCount } = await supabase
        .from("workflow_executions")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", tenantId)
        .eq("status", "failed");

      setData({
        lastWebhook: lastWebhook ? {
          id: lastWebhook.id,
          received_at: lastWebhook.started_at,
          tenant_id: lastWebhook.tenant_id,
          status: lastWebhook.status,
        } : null,
        lastRun: lastRun ? {
          id: lastRun.id,
          workflow_id: lastRun.workflow_id,
          status: lastRun.status,
          started_at: lastRun.started_at,
          completed_at: lastRun.completed_at,
        } : null,
        entitlements: {
          plan,
          maxSystems: limits.maxSystems,
          maxWebhooks: limits.maxWebhooks,
          maxRunsPerMonth: limits.maxRunsPerMonth,
          systemsUsed: systemsCount || 0,
          webhooksUsed: webhooksCount || 0,
          runsUsedThisMonth: runsCount || 0,
        },
        queueHealth: {
          pending: pendingCount || 0,
          running: runningCount || 0,
          failed: failedCount || 0,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load diagnostics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading diagnostics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">System Diagnostics</h1>
        <Button onClick={fetchDiagnostics} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Last Webhook</CardTitle>
            <CardDescription>Most recent webhook received</CardDescription>
          </CardHeader>
          <CardContent>
            {data.lastWebhook ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={data.lastWebhook.status === "completed" ? "default" : "secondary"}>
                    {data.lastWebhook.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Received: {new Date(data.lastWebhook.received_at).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {data.lastWebhook.id}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No webhooks received yet</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Last Run</CardTitle>
            <CardDescription>Most recent workflow execution</CardDescription>
          </CardHeader>
          <CardContent>
            {data.lastRun ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={data.lastRun.status === "completed" ? "default" : "secondary"}>
                    {data.lastRun.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Started: {new Date(data.lastRun.started_at).toLocaleString()}
                </div>
                {data.lastRun.completed_at && (
                  <div className="text-sm text-muted-foreground">
                    Completed: {new Date(data.lastRun.completed_at).toLocaleString()}
                  </div>
                )}
                <div className="text-xs text-muted-foreground font-mono">
                  {data.lastRun.id}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No runs yet</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entitlements</CardTitle>
            <CardDescription>Current plan and usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Plan</span>
                <Badge>{data.entitlements.plan}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Systems</span>
                  <span>
                    {data.entitlements.systemsUsed} / {data.entitlements.maxSystems === -1 ? "∞" : data.entitlements.maxSystems}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Webhooks</span>
                  <span>
                    {data.entitlements.webhooksUsed} / {data.entitlements.maxWebhooks === -1 ? "∞" : data.entitlements.maxWebhooks}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Runs (this month)</span>
                  <span>
                    {data.entitlements.runsUsedThisMonth} / {data.entitlements.maxRunsPerMonth === -1 ? "∞" : data.entitlements.maxRunsPerMonth}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Queue Health</CardTitle>
            <CardDescription>Current execution queue status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Pending</span>
                <Badge variant="secondary">{data.queueHealth.pending}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Running</span>
                <Badge variant="default">{data.queueHealth.running}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Failed</span>
                <Badge variant="destructive">{data.queueHealth.failed}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

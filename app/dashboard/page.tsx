import { createClient } from "@supabase/supabase-js";
import { TrendingUp, Users, Eye, Activity, MessageSquare, Zap } from "lucide-react";

import { DashboardClient } from "./dashboard-client";

import { DashboardUpgradeSection } from "@/components/dashboard/dashboard-upgrade-section";
import { RealtimeDashboard } from "@/components/dashboard/realtime-dashboard";
import { HealthMonitor } from "@/components/monitoring/health-monitor";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { enrichWithExternalData, generateSampleMetrics, getIndustryBenchmarks } from "@/lib/data-enrichment";
import type { Database } from "@/src/integrations/supabase/types";
/**
 * Public Dashboard: "Loud & High" Social Proof Metrics
 * 
 * Server Component that displays real-time aggregated metrics from Supabase.
 * This acts as "smoke signals" showing the ecosystem is alive and active.
 * 
 * Now includes Supabase Realtime subscriptions for live updates.
 */

async function getKPIData(): Promise<{
  newUsersThisWeek: number;
  totalUsers: number;
  avgPostViews: number;
  actionsLastHour: number;
  totalPosts: number;
  engagementRate: string;
  periodStart: string;
  periodEnd: string;
  note: string;
  kpi1Met: boolean;
  kpi2Met: boolean;
  kpi3Met: boolean;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    // Return sample data if Supabase not configured
    const sample = generateSampleMetrics();
    return {
      ...sample,
      kpi1Met: false,
      kpi2Met: false,
      kpi3Met: false,
    };
  }

  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Fetch KPI views
    const [kpi1, kpi2, kpi3, profilesCount, postsCount] = await Promise.all([
      supabase.from("kpi_new_users_week").select("*").single(),
      supabase.from("kpi_avg_post_views").select("*").single(),
      supabase.from("kpi_actions_last_hour").select("*").single(),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("posts").select("id", { count: "exact", head: true }),
    ]);

    interface KPIResult {
      new_users_count?: number;
      avg_post_views?: number;
      actions_count?: number;
      threshold_met?: boolean;
    }
    const kpi1Data = kpi1.data as KPIResult | null;
    const kpi2Data = kpi2.data as KPIResult | null;
    const kpi3Data = kpi3.data as KPIResult | null;
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return {
      newUsersThisWeek: kpi1Data?.new_users_count || 0,
      avgPostViews: Number(kpi2Data?.avg_post_views || 0),
      actionsLastHour: kpi3Data?.actions_count || 0,
      totalUsers: profilesCount.count || 0,
      totalPosts: postsCount.count || 0,
      engagementRate: "0.00",
      periodStart: oneWeekAgo.toISOString(),
      periodEnd: now.toISOString(),
      note: "Live metrics from Supabase",
      kpi1Met: kpi1Data?.threshold_met || false,
      kpi2Met: kpi2Data?.threshold_met || false,
      kpi3Met: kpi3Data?.threshold_met || false,
    };
  } catch (error) {
    console.error("Error fetching KPI data", error);
    // Return sample data on error with KPI met flags
    const sample = generateSampleMetrics();
    return {
      ...sample,
      kpi1Met: false,
      kpi2Met: false,
      kpi3Met: false,
    };
  }
}

async function getRecentActivity() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return [];
  }

  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data } = await supabase
      .from("activity_log")
      .select("activity_type, created_at, metadata")
      .order("created_at", { ascending: false })
      .limit(10);

    return data || [];
  } catch {
    return [];
  }
}

async function getTopPosts() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return [];
  }

  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data } = await supabase
      .from("posts")
      .select("id, title, view_count, created_at")
      .order("view_count", { ascending: false })
      .limit(5);

    return data || [];
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const kpiData = await getKPIData();
  const recentActivity = await getRecentActivity();
  const topPosts = await getTopPosts();
  const benchmarks = getIndustryBenchmarks();
  
  // Enrich with external data
  const techNews = await enrichWithExternalData("tech_news");

  const allCylindersFiring =
    kpiData.kpi1Met &&
    kpiData.kpi2Met &&
    kpiData.kpi3Met;

  // TODO: Get user plan from session/database
  const userPlan: "free" | "trial" | "starter" | "pro" = "trial"; // Placeholder
  const isFirstVisit = false; // TODO: Check from database

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Upgrade prompts and welcome dashboard */}
      <DashboardUpgradeSection isFirstVisit={isFirstVisit} userPlan={userPlan} />
      
      {/* Quick Links */}
      <div className="mb-6 flex gap-4">
        <a
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          href="/dashboard/analytics"
        >
          View Analytics
        </a>
        <a
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
          href="/workflows"
        >
          Manage Workflows
        </a>
      </div>
      
      {/* Client-side components for upgrade nudges and checklist */}
      <DashboardClient />
      
      {/* Show empty state for first-time users */}
      {isFirstVisit && (
        <div className="mb-8">
          {/* Welcome dashboard will be shown by DashboardUpgradeSection if isFirstVisit is true */}
        </div>
      )}

      <div className="mb-8 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Ecosystem Dashboard</h1>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          Real-time metrics showing our living, breathing community
        </p>
        {allCylindersFiring && (
          <Badge className="mt-4" variant="default">
            <Zap className="w-4 h-4 mr-1" />
            All Cylinders Firing ✓
          </Badge>
        )}
      </div>

      {/* Health Monitor */}
      <div className="mb-8">
        <HealthMonitor autoRefresh={true} refreshInterval={60000} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-4">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5" />
              New Users This Week
            </CardTitle>
            <CardDescription className="text-sm mt-1">KPI 1: Growth Momentum</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold mb-3">{kpiData.newUsersThisWeek}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Threshold: 50+ users
              {kpiData.kpi1Met ? (
                <Badge className="ml-2" variant="default">
                  ✓ Met
                </Badge>
              ) : (
                <Badge className="ml-2" variant="secondary">
                  Needs Growth
                </Badge>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="w-5 h-5" />
              Average Post Views
            </CardTitle>
            <CardDescription className="text-sm mt-1">KPI 2: Content Engagement</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold mb-3">
              {Math.round(kpiData.avgPostViews)}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Threshold: 100+ views
              {kpiData.kpi2Met ? (
                <Badge className="ml-2" variant="default">
                  ✓ Met
                </Badge>
              ) : (
                <Badge className="ml-2" variant="secondary">
                  Building
                </Badge>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5" />
              Actions Last Hour
            </CardTitle>
            <CardDescription className="text-sm mt-1">KPI 3: Real-Time Engagement</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold mb-3">{kpiData.actionsLastHour}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Threshold: 20+ actions
              {kpiData.kpi3Met ? (
                <Badge className="ml-2" variant="default">
                  ✓ Met
                </Badge>
              ) : (
                <Badge className="ml-2" variant="secondary">
                  Active
                </Badge>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Dashboard Component */}
      <div className="mb-8">
        <RealtimeDashboard />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 px-4">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Community Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Users</span>
                <span className="font-semibold">{kpiData.totalUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Posts</span>
                <span className="font-semibold">{kpiData.totalPosts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Industry Avg Sign-Up</span>
                <span className="font-semibold">{benchmarks.avgSignUpRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5" />
              Most Engaged Posts
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {topPosts.length > 0 ? (
              <div className="space-y-3">
                {topPosts.map((post: { id: string; title?: string; view_count?: number }) => (
                  <div key={post.id} className="flex justify-between items-center">
                    <span className="text-sm truncate flex-1">
                      {post.title || `Post #${post.id}`}
                    </span>
                    <Badge className="ml-2" variant="secondary">
                      {post.view_count} views
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No posts yet. Be the first to create content!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card className="mx-4">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription className="text-sm mt-1">Live engagement signals from the community</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {recentActivity.length > 0 ? (
            <div className="space-y-2">
              {recentActivity.map((activity: { activity_type?: string; created_at: string }, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                >
                  <span className="text-sm capitalize">
                    {activity.activity_type?.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Activity feed will appear here as users engage with the platform.
            </p>
          )}
        </CardContent>
      </Card>

      {/* External Data Enrichment */}
      {techNews && 'articles' in techNews && (
        <Card className="mt-6 mx-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Tech Community Insights</CardTitle>
            <CardDescription className="text-sm mt-1">
              Enriched with data from {techNews.source === "dev.to" ? "Dev.to API" : "sample data"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {techNews.articles && techNews.articles.length > 0 ? (
              <div className="space-y-2">
                {techNews.articles.slice(0, 3).map((article: { title?: string; url?: string; description?: string; author?: string }, idx: number) => (
                  <div key={idx} className="text-sm">
                    <a
                      className="text-primary hover:underline"
                      href={article.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {article.title}
                    </a>
                    <span className="text-muted-foreground ml-2">
                      by {article.author}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
            {'note' in techNews && typeof techNews.note === 'string' && techNews.note && (
              <p className="text-xs text-muted-foreground mt-2">{techNews.note as string}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

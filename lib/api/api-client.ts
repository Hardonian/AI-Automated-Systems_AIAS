/**
 * API Client
 * 
 * Type-safe API client for making requests to the API
 * Auto-generated from OpenAPI spec (see scripts/generate-api-client.ts)
 */

import { env } from "@/lib/env";

export interface ApiError {
  error: string;
  message?: string;
  details?: Record<string, unknown>;
}

export class ApiClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrl = baseUrl || `${env.app.siteUrl || "http://localhost:3000"}/api`;
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: "Unknown error",
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw error;
    }

    return response.json();
  }

  // Health endpoints
  async healthCheck() {
    return this.request<{
      ok: boolean;
      timestamp: string;
      db?: { ok: boolean; latency_ms: number | null; error: string | null };
      rest?: { ok: boolean; latency_ms: number | null; error: string | null };
      auth?: { ok: boolean; latency_ms: number | null; error: string | null };
      rls?: { ok: boolean; note?: string; error?: string };
      storage?: { ok: boolean; latency_ms: number | null; buckets_count?: number; error: string | null };
      total_latency_ms?: number;
      error?: string;
    }>("/healthz");
  }

  // Analytics endpoints
  async trackAnalytics(event: {
    event: string;
    properties?: Record<string, unknown>;
    userId?: string;
    sessionId?: string;
  }) {
    return this.request<{ success: boolean }>("/analytics/track", {
      method: "POST",
      body: JSON.stringify(event),
    });
  }

  async getFunnelMetrics() {
    return this.request<{ funnel: Record<string, number> }>("/analytics/track");
  }

  // Settings endpoints
  async getSettings() {
    return this.request<{
      theme?: "light" | "dark" | "system";
      notifications?: { email?: boolean; push?: boolean };
      preferences?: Record<string, unknown>;
    }>("/settings");
  }

  async updateSettings(settings: {
    theme?: "light" | "dark" | "system";
    notifications?: { email?: boolean; push?: boolean };
    preferences?: Record<string, unknown>;
  }) {
    return this.request<{ success: boolean }>("/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  }

  // Notifications endpoints
  async getNotifications() {
    return this.request<
      Array<{
        id: string;
        title: string;
        message: string;
        type: "info" | "success" | "warning" | "error";
        read: boolean;
        createdAt: string;
      }>
    >("/notifications");
  }

  async markNotificationsRead(notificationIds: string[]) {
    return this.request<{ success: boolean }>("/notifications/mark-read", {
      method: "POST",
      body: JSON.stringify({ notificationIds }),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

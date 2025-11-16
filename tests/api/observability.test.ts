/**
 * Observability Endpoints Tests
 */

import { describe, it, expect, beforeAll } from "vitest";

const API_BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

describe("Observability Endpoints", () => {
  describe("GET /api/observability/metrics", () => {
    it("should return metrics", async () => {
      const response = await fetch(`${API_BASE}/api/observability/metrics`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty("timestamp");
      expect(data).toHaveProperty("database");
      expect(data).toHaveProperty("api");
      expect(data).toHaveProperty("storage");
    });

    it("should have valid database health status", async () => {
      const response = await fetch(`${API_BASE}/api/observability/metrics`);
      const data = await response.json();

      expect(["healthy", "degraded", "unhealthy"]).toContain(data.database.health);
    });
  });

  describe("GET /api/observability/traces", () => {
    it("should return traces endpoint info", async () => {
      const response = await fetch(`${API_BASE}/api/observability/traces`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty("message");
    });
  });
});

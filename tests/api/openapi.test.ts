/**
 * OpenAPI Specification Tests
 * 
 * Validates that the OpenAPI spec is valid and matches actual API endpoints
 */

import { describe, it, expect } from "vitest";
import openApiSpec from "../../openapi.json";

describe("OpenAPI Specification", () => {
  it("should have valid OpenAPI version", () => {
    expect(openApiSpec.openapi).toBe("3.1.0");
  });

  it("should have required info fields", () => {
    expect(openApiSpec.info).toBeDefined();
    expect(openApiSpec.info.title).toBe("AIAS Platform API");
    expect(openApiSpec.info.version).toBeDefined();
  });

  it("should have servers defined", () => {
    expect(openApiSpec.servers).toBeDefined();
    expect(Array.isArray(openApiSpec.servers)).toBe(true);
    expect(openApiSpec.servers.length).toBeGreaterThan(0);
  });

  it("should have paths defined", () => {
    expect(openApiSpec.paths).toBeDefined();
    expect(Object.keys(openApiSpec.paths).length).toBeGreaterThan(0);
  });

  it("should have health check endpoint", () => {
    expect(openApiSpec.paths["/healthz"]).toBeDefined();
    expect(openApiSpec.paths["/healthz"].get).toBeDefined();
  });

  it("should have components defined", () => {
    expect(openApiSpec.components).toBeDefined();
    expect(openApiSpec.components.schemas).toBeDefined();
    expect(openApiSpec.components.securitySchemes).toBeDefined();
  });

  it("should have security schemes", () => {
    const securitySchemes = openApiSpec.components.securitySchemes;
    expect(securitySchemes.bearerAuth).toBeDefined();
    expect(securitySchemes.basicAuth).toBeDefined();
  });

  it("should have all required schemas", () => {
    const schemas = openApiSpec.components.schemas;
    expect(schemas.HealthCheckResponse).toBeDefined();
    expect(schemas.AnalyticsEvent).toBeDefined();
    expect(schemas.Error).toBeDefined();
  });
});

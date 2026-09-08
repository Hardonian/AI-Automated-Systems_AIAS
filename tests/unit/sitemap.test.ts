import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockExecSync, mockExistsSync, mockStatSync } = vi.hoisted(() => ({
  mockExecSync: vi.fn(),
  mockExistsSync: vi.fn(),
  mockStatSync: vi.fn(),
}));

vi.mock("node:child_process", async () => {
  const actual = await vi.importActual<typeof import("node:child_process")>(
    "node:child_process",
  );

  return {
    ...actual,
    execSync: mockExecSync,
  };
});

vi.mock("node:fs", async () => {
  const actual = await vi.importActual<typeof import("node:fs")>("node:fs");

  return {
    ...actual,
    existsSync: mockExistsSync,
    statSync: mockStatSync,
  };
});

vi.mock("@/lib/blog/articles", () => ({
  getLatestArticles: vi.fn(() => []),
}));

vi.mock("@/lib/seo/metadata", () => ({
  SITE_URL: "https://example.com",
}));

vi.mock("@/lib/seo/route-manifest", () => ({
  INDEXABLE_ROUTE_MANIFEST: [
    { path: "/", priority: 1, changeFrequency: "daily" },
  ],
}));

vi.mock("@/src/content/caseStudies", () => ({
  caseStudies: [],
}));

vi.mock("@/src/content/moat", () => ({
  blueprints: [],
}));

describe("sitemap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("should handle execSync throwing an error and fallback gracefully", async () => {
    mockExecSync.mockImplementation(() => {
      throw new Error("Command failed");
    });

    mockExistsSync.mockReturnValue(true);
    mockStatSync.mockReturnValue({
      mtime: new Date("2024-01-01"),
    });

    // Dynamic import to ensure module is evaluated AFTER mocks are set up,
    // because `resolveLastModified` is called during module execution
    const sitemapModule = await import("@/app/sitemap");
    const sitemap = sitemapModule.default;

    const result = sitemap();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(mockExecSync).toHaveBeenCalled();
    expect(result?.[0]?.lastModified).toEqual(new Date("2024-01-01"));
  });
});

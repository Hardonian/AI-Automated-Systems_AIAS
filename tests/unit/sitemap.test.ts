import { describe, it, expect, vi, beforeEach } from "vitest";
import * as child_process from "node:child_process";
import * as fs from "node:fs";

vi.mock("node:child_process", () => ({
  execSync: vi.fn(),
}));

vi.mock("node:fs", () => ({
  existsSync: vi.fn(),
  statSync: vi.fn(),
}));

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
    vi.mocked(child_process.execSync).mockImplementation(() => {
      throw new Error("Command failed");
    });

    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.statSync).mockReturnValue({
      mtime: new Date("2024-01-01"),
    } as any);

    // Dynamic import to ensure module is evaluated AFTER mocks are set up,
    // because `resolveLastModified` is called during module execution
    const sitemapModule = await import("@/app/sitemap");
    const sitemap = sitemapModule.default;

    const result = sitemap();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(child_process.execSync).toHaveBeenCalled();
    expect(result?.[0]?.lastModified).toEqual(new Date("2024-01-01"));
  });
});

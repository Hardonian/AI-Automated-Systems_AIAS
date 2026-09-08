import { describe, expect, it, vi } from "vitest";

import { resolveLastModified } from "@/lib/seo/last-modified";

describe("resolveLastModified", () => {
  const fallback = new Date("2024-01-01T00:00:00.000Z");

  it("prefers a valid Git timestamp", () => {
    const fileExists = vi.fn(() => true);
    const readFileTimestamp = vi.fn(() => fallback);

    const result = resolveLastModified("app/page.tsx", fallback, {
      readGitTimestamp: () => "2026-08-22T14:47:32-04:00\n",
      fileExists,
      readFileTimestamp,
    });

    expect(result).toEqual(new Date("2026-08-22T18:47:32.000Z"));
    expect(fileExists).not.toHaveBeenCalled();
    expect(readFileTimestamp).not.toHaveBeenCalled();
  });

  it("uses the filesystem timestamp when Git lookup fails", () => {
    const fileTimestamp = new Date("2025-05-27T00:40:23.000Z");

    const result = resolveLastModified("app/page.tsx", fallback, {
      readGitTimestamp: () => {
        throw new Error("Command failed");
      },
      fileExists: () => true,
      readFileTimestamp: () => fileTimestamp,
    });

    expect(result).toEqual(fileTimestamp);
  });

  it("uses the deterministic fallback when no source is available", () => {
    const result = resolveLastModified("missing.ts", fallback, {
      readGitTimestamp: () => "",
      fileExists: () => false,
      readFileTimestamp: () => {
        throw new Error("File is missing");
      },
    });

    expect(result).toEqual(fallback);
  });
});

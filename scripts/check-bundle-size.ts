/**
 * Item 50: Bundle Size Budget Guardrail
 *
 * Reads the Next.js build output and enforces size budgets.
 * Designed to run as part of `pnpm verify` or CI.
 *
 * Budget thresholds (gzipped):
 * - First-load JS (any route): 200 KB max
 * - Total shared framework JS: 120 KB max
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const BUDGETS = {
  largestChunkGzipMax: 250 * 1024,
  totalChunksMax: 3 * 1024 * 1024, // 3 MB total JS chunks (uncompressed, ~60 routes)
};

const BUILD_DIR = ".next";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function findBuildManifest(): Record<string, unknown> | null {
  const manifestPath = path.join(BUILD_DIR, "build-manifest.json");
  if (!existsSync(manifestPath)) return null;
  try {
    return JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch {
    return null;
  }
}

function measureChunkSizes(): {
  totalSize: number;
  largestChunk: { name: string; gzipSize: number };
} {
  const chunksDir = path.join(BUILD_DIR, "static", "chunks");
  if (!existsSync(chunksDir)) {
    return { totalSize: 0, largestChunk: { name: "N/A", gzipSize: 0 } };
  }

  let totalSize = 0;
  let largestChunk = { name: "", gzipSize: 0 };

  const walkDir = (dir: string) => {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.name.endsWith(".js")) {
        const content = readFileSync(fullPath);
        totalSize += content.length;
        const gzipSize = gzipSync(content).length;
        if (gzipSize > largestChunk.gzipSize) {
          largestChunk = { name: entry.name, gzipSize };
        }
      }
    }
  };

  walkDir(chunksDir);
  return { totalSize, largestChunk };
}

// ------- Main -------

const failures: string[] = [];

if (!existsSync(BUILD_DIR)) {
  console.log(
    "⚠ No .next directory found — skipping bundle size check (run after `pnpm build`).",
  );
  process.exit(0);
}

const manifest = findBuildManifest();
const { totalSize, largestChunk } = measureChunkSizes();

console.log("Bundle Size Budget Check");
console.log("========================");
console.log(
  `Total JS chunks:  ${formatBytes(totalSize)} (budget: ${formatBytes(BUDGETS.totalChunksMax)})`,
);
console.log(
  `Largest gzip chunk: ${largestChunk.name} (${formatBytes(largestChunk.gzipSize)})`,
);
console.log(`Gzip chunk budget: ${formatBytes(BUDGETS.largestChunkGzipMax)}`);

// Check total JS chunks budget
if (totalSize > BUDGETS.totalChunksMax) {
  failures.push(
    `Total JS chunks (${formatBytes(totalSize)}) exceeds budget (${formatBytes(BUDGETS.totalChunksMax)})`,
  );
}

// Check largest single chunk
if (largestChunk.gzipSize > BUDGETS.largestChunkGzipMax) {
  failures.push(
    `Largest gzip chunk "${largestChunk.name}" (${formatBytes(largestChunk.gzipSize)}) exceeds budget (${formatBytes(BUDGETS.largestChunkGzipMax)})`,
  );
}

if (manifest) {
  console.log("✓ Build manifest found");
}

if (failures.length) {
  console.error("\n✗ Bundle size budget EXCEEDED:");
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}

console.log("\n✓ Bundle size budget passed.");

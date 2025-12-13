#!/usr/bin/env tsx
/**
 * Type Safety Audit Script
 * Finds 'any' types and suggests improvements
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

interface TypeIssue {
  file: string;
  line: number;
  type: "any" | "unknown" | "as any" | "as unknown";
  context: string;
  suggestion?: string;
}

const issues: TypeIssue[] = [];

/**
 * Check file for type safety issues
 */
function checkFile(filePath: string, content: string): void {
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // Check for 'any' type
    if (trimmed.includes(": any") && !trimmed.includes("// TODO:")) {
      issues.push({
        file: filePath,
        line: lineNum,
        type: "any",
        context: trimmed.substring(0, 100),
        suggestion: "Replace with specific type or 'unknown' with type guard",
      });
    }

    // Check for 'as any' assertions
    if (trimmed.includes("as any") && !trimmed.includes("// TODO:")) {
      issues.push({
        file: filePath,
        line: lineNum,
        type: "as any",
        context: trimmed.substring(0, 100),
        suggestion: "Use proper type assertion or type guard",
      });
    }

    // Check for 'unknown' without type guard (less critical)
    if (
      trimmed.includes(": unknown") &&
      !trimmed.includes("is ") &&
      !trimmed.includes("typeof") &&
      !trimmed.includes("instanceof")
    ) {
      // This is informational only
    }
  });
}

/**
 * Recursively scan directory
 */
function scanDirectory(dir: string, baseDir: string = dir): void {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    // Skip node_modules, .next, dist, and test files
    if (
      entry === "node_modules" ||
      entry === ".next" ||
      entry === "dist" ||
      entry.startsWith(".") ||
      entry.includes(".test.") ||
      entry.includes(".spec.")
    ) {
      continue;
    }

    if (stat.isDirectory()) {
      scanDirectory(fullPath, baseDir);
    } else if (extname(entry) === ".ts" || extname(entry) === ".tsx") {
      try {
        const content = readFileSync(fullPath, "utf-8");
        checkFile(fullPath.replace(baseDir + "/", ""), content);
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }
}

/**
 * Run type safety audit
 */
function runAudit(): void {
  console.log("🔍 Running type safety audit...\n");

  const libDir = join(process.cwd(), "lib");
  const appDir = join(process.cwd(), "app");
  const componentsDir = join(process.cwd(), "components");

  if (statSync(libDir).isDirectory()) {
    scanDirectory(libDir);
  }
  if (statSync(appDir).isDirectory()) {
    scanDirectory(appDir);
  }
  if (statSync(componentsDir).isDirectory()) {
    scanDirectory(componentsDir);
  }

  // Group by type
  const anyTypes = issues.filter((i) => i.type === "any");
  const asAny = issues.filter((i) => i.type === "as any");

  console.log("📊 Type Safety Audit Results\n");
  console.log(`'any' types: ${anyTypes.length}`);
  console.log(`'as any' assertions: ${asAny.length}`);
  console.log(`Total issues: ${issues.length}\n`);

  if (anyTypes.length > 0) {
    console.log("❌ 'any' TYPES:\n");
    anyTypes.slice(0, 20).forEach((issue) => {
      console.log(`  ${issue.file}:${issue.line}`);
      console.log(`    ${issue.context}`);
      if (issue.suggestion) {
        console.log(`    💡 ${issue.suggestion}`);
      }
      console.log("");
    });
    if (anyTypes.length > 20) {
      console.log(`  ... and ${anyTypes.length - 20} more\n`);
    }
  }

  if (asAny.length > 0) {
    console.log("⚠️  'as any' ASSERTIONS:\n");
    asAny.slice(0, 10).forEach((issue) => {
      console.log(`  ${issue.file}:${issue.line}`);
      console.log(`    ${issue.context}`);
      if (issue.suggestion) {
        console.log(`    💡 ${issue.suggestion}`);
      }
      console.log("");
    });
    if (asAny.length > 10) {
      console.log(`  ... and ${asAny.length - 10} more\n`);
    }
  }

  console.log("\n💡 Recommendations:");
  console.log("1. Replace 'any' with specific types");
  console.log("2. Use 'unknown' with type guards when type is truly unknown");
  console.log("3. Use type assertions sparingly");
  console.log("4. Enable strict TypeScript mode");
  console.log("5. Use type utilities from lib/types/strict.ts");

  // Exit with error if too many issues
  const criticalIssues = anyTypes.length + asAny.length;
  process.exit(criticalIssues > 50 ? 1 : 0);
}

if (require.main === module) {
  runAudit();
}

export { runAudit };

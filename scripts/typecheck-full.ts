#!/usr/bin/env tsx
/**
 * Full TypeScript Check Script
 * Checks all TypeScript files for errors that would affect Vercel build
 */

import { execSync } from "child_process";
import { readFileSync } from "fs";
import { join } from "path";

console.log("🔍 Running full TypeScript check...\n");

try {
  // Run TypeScript compiler check
  console.log("Step 1: Running tsc --noEmit...");
  execSync("pnpm exec tsc --noEmit", {
    stdio: "inherit",
    cwd: process.cwd(),
  });
  console.log("✅ TypeScript check passed\n");

  // Check for any remaining 'any' types in critical files
  console.log("Step 2: Checking for 'any' types in critical files...");
  const criticalFiles = [
    "app/api/workflows/route.ts",
    "app/dashboard/page.tsx",
    "app/workflows/page.tsx",
    "middleware.ts",
  ];

  let foundAny = false;
  for (const file of criticalFiles) {
    try {
      const content = readFileSync(join(process.cwd(), file), "utf-8");
      const anyMatches = content.match(/:\s*any\b/g);
      if (anyMatches && anyMatches.length > 0) {
        console.warn(`⚠️  Found ${anyMatches.length} 'any' type(s) in ${file}`);
        foundAny = true;
      }
    } catch (error) {
      // File might not exist, skip
    }
  }

  if (!foundAny) {
    console.log("✅ No 'any' types found in critical files\n");
  }

  // Check for common TypeScript issues
  console.log("Step 3: Checking for common TypeScript issues...");
  const issues: string[] = [];

  // Check tsconfig.json
  try {
    const tsconfig = JSON.parse(readFileSync(join(process.cwd(), "tsconfig.json"), "utf-8"));
    if (!tsconfig.compilerOptions.strict) {
      issues.push("⚠️  TypeScript strict mode is not enabled");
    }
    if (!tsconfig.compilerOptions.noImplicitAny) {
      issues.push("⚠️  noImplicitAny is not enabled");
    }
  } catch (error) {
    issues.push("⚠️  Could not read tsconfig.json");
  }

  if (issues.length > 0) {
    console.warn("Issues found:");
    issues.forEach((issue) => console.warn(`  ${issue}`));
  } else {
    console.log("✅ TypeScript configuration looks good\n");
  }

  console.log("✅ All TypeScript checks completed successfully!");
  process.exit(0);
} catch (error) {
  console.error("\n❌ TypeScript check failed!");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

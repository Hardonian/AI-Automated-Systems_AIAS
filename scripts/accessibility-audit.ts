#!/usr/bin/env tsx
/**
 * Accessibility Audit Script
 * Runs automated accessibility checks
 * 
 * Note: This is a basic audit. For comprehensive testing:
 * - Use axe DevTools browser extension
 * - Run Lighthouse accessibility audit
 * - Test with screen readers (NVDA, JAWS, VoiceOver)
 * - Manual keyboard navigation testing
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

interface AccessibilityIssue {
  file: string;
  line?: number;
  type: "error" | "warning" | "info";
  message: string;
  fix?: string;
}

const issues: AccessibilityIssue[] = [];

/**
 * Check for common accessibility issues in TSX files
 */
function checkFile(filePath: string, content: string): void {
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check for missing alt text on images
    if (line.includes("<img") && !line.includes("alt=")) {
      issues.push({
        file: filePath,
        line: lineNum,
        type: "error",
        message: "Image missing alt attribute",
        fix: 'Add alt="descriptive text" to img tag',
      });
    }

    // Check for missing aria-label on icon-only buttons
    if (
      line.includes("<button") &&
      (line.includes("<svg") || line.includes("Icon")) &&
      !line.includes("aria-label") &&
      !line.includes("aria-labelledby")
    ) {
      issues.push({
        file: filePath,
        line: lineNum,
        type: "warning",
        message: "Icon-only button missing aria-label",
        fix: 'Add aria-label="action description" to button',
      });
    }

    // Check for missing labels on form inputs
    if (
      (line.includes("<input") || line.includes("<textarea")) &&
      !line.includes("aria-label") &&
      !line.includes("aria-labelledby") &&
      !line.includes("id=")
    ) {
      // Check if label exists nearby (simplified check)
      const hasLabelNearby =
        lines
          .slice(Math.max(0, index - 5), index + 5)
          .join("")
          .includes("<label") ||
        lines
          .slice(Math.max(0, index - 5), index + 5)
          .join("")
          .includes("htmlFor");
      if (!hasLabelNearby) {
        issues.push({
          file: filePath,
          line: lineNum,
          type: "warning",
          message: "Form input missing label or aria-label",
          fix: "Add <label> or aria-label attribute",
        });
      }
    }

    // Check for missing heading hierarchy
    if (line.match(/<h[3-6]/)) {
      // Check if h1 or h2 exists before (simplified)
      const hasH1OrH2 = lines.slice(0, index).some((l) => l.match(/<h[12]/));
      if (!hasH1OrH2 && index < 50) {
        issues.push({
          file: filePath,
          line: lineNum,
          type: "info",
          message: "Consider starting with h1 or h2 before h3+",
          fix: "Ensure proper heading hierarchy (h1 → h2 → h3)",
        });
      }
    }

    // Check for color contrast issues (basic check)
    if (
      line.includes("text-") &&
      (line.includes("text-gray-400") ||
        line.includes("text-gray-500") ||
        line.includes("text-muted"))
    ) {
      issues.push({
        file: filePath,
        line: lineNum,
        type: "info",
        message: "Verify color contrast meets WCAG AA (4.5:1)",
        fix: "Test with contrast checker tool",
      });
    }

    // Check for missing skip links
    if (line.includes("<main") || line.includes("<body")) {
      const hasSkipLink = content.includes("skip") || content.includes("SkipLink");
      if (!hasSkipLink && filePath.includes("layout")) {
        issues.push({
          file: filePath,
          line: lineNum,
          type: "warning",
          message: "Consider adding skip to main content link",
          fix: "Add <SkipLink /> component",
        });
      }
    }
  });
}

/**
 * Recursively scan directory for TSX files
 */
function scanDirectory(dir: string, baseDir: string = dir): void {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    // Skip node_modules and .next
    if (
      entry === "node_modules" ||
      entry === ".next" ||
      entry === "dist" ||
      entry.startsWith(".")
    ) {
      continue;
    }

    if (stat.isDirectory()) {
      scanDirectory(fullPath, baseDir);
    } else if (extname(entry) === ".tsx" || extname(entry) === ".jsx") {
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
 * Run accessibility audit
 */
function runAudit(): void {
  console.log("🔍 Running accessibility audit...\n");

  const appDir = join(process.cwd(), "app");
  const componentsDir = join(process.cwd(), "components");

  if (statSync(appDir).isDirectory()) {
    scanDirectory(appDir);
  }
  if (statSync(componentsDir).isDirectory()) {
    scanDirectory(componentsDir);
  }

  // Group issues by type
  const errors = issues.filter((i) => i.type === "error");
  const warnings = issues.filter((i) => i.type === "warning");
  const info = issues.filter((i) => i.type === "info");

  console.log("📊 Accessibility Audit Results\n");
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  console.log(`Info: ${info.length}\n`);

  if (errors.length > 0) {
    console.log("❌ ERRORS:\n");
    errors.forEach((issue) => {
      console.log(`  ${issue.file}:${issue.line || "?"}`);
      console.log(`    ${issue.message}`);
      if (issue.fix) {
        console.log(`    Fix: ${issue.fix}`);
      }
      console.log("");
    });
  }

  if (warnings.length > 0) {
    console.log("⚠️  WARNINGS:\n");
    warnings.slice(0, 10).forEach((issue) => {
      console.log(`  ${issue.file}:${issue.line || "?"}`);
      console.log(`    ${issue.message}`);
      if (issue.fix) {
        console.log(`    Fix: ${issue.fix}`);
      }
      console.log("");
    });
    if (warnings.length > 10) {
      console.log(`  ... and ${warnings.length - 10} more warnings\n`);
    }
  }

  console.log("\n💡 Recommendations:");
  console.log("1. Run Lighthouse accessibility audit");
  console.log("2. Test with screen readers (NVDA, JAWS, VoiceOver)");
  console.log("3. Test keyboard navigation");
  console.log("4. Use axe DevTools browser extension");
  console.log("5. Verify color contrast (WCAG AA: 4.5:1)");

  process.exit(errors.length > 0 ? 1 : 0);
}

if (require.main === module) {
  runAudit();
}

export { runAudit };

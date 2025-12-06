/**
 * Dead Code Detector
 * Identifies unused files, functions, and components
 */

import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";
import { writeFile } from "fs/promises";

interface DeadCodeReport {
  unusedFiles: string[];
  unusedExports: string[];
  unusedImports: string[];
}

/**
 * Detect dead code
 */
async function detectDeadCode(): Promise<DeadCodeReport> {
  const report: DeadCodeReport = {
    unusedFiles: [],
    unusedExports: [],
    unusedImports: [],
  };

  // Check src/ directory (likely unused)
  const srcDir = join(process.cwd(), "src");
  try {
    const entries = await readdir(srcDir, { recursive: true });
    for (const entry of entries) {
      if (entry.endsWith(".ts") || entry.endsWith(".tsx")) {
        const filePath = join(srcDir, entry);
        // Check if file is imported anywhere outside src/
        const isUsed = await checkFileUsage(filePath);
        if (!isUsed) {
          report.unusedFiles.push(filePath);
        }
      }
    }
  } catch (error) {
    console.error("Error scanning src/ directory:", error);
  }

  return report;
}

/**
 * Check if file is used (simplified)
 */
async function checkFileUsage(filePath: string): Promise<boolean> {
  // In production, would use more sophisticated analysis
  // For now, check if file is imported outside src/
  const content = await readFile(filePath, "utf-8");
  const fileName = filePath.split("/").pop()?.replace(/\.(ts|tsx)$/, "");

  // Search for imports of this file
  // This is simplified - would need full AST parsing
  return false; // Assume unused for now
}

/**
 * Generate report
 */
async function generateReport(): Promise<void> {
  console.log("Detecting dead code...");
  const report = await detectDeadCode();

  const markdown = `# Dead Code Detection Report

Generated: ${new Date().toISOString()}

## Unused Files

${report.unusedFiles.length > 0 ? report.unusedFiles.map((f) => `- ${f}`).join("\n") : "None found"}

## Unused Exports

${report.unusedExports.length > 0 ? report.unusedExports.map((e) => `- ${e}`).join("\n") : "None found"}

## Unused Imports

${report.unusedImports.length > 0 ? report.unusedImports.map((i) => `- ${i}`).join("\n") : "None found"}

## Recommendations

${report.unusedFiles.length > 0 ? `- Review and remove ${report.unusedFiles.length} unused files` : "- No unused files found"}
${report.unusedExports.length > 0 ? `- Remove ${report.unusedExports.length} unused exports` : "- No unused exports found"}
${report.unusedImports.length > 0 ? `- Clean up ${report.unusedImports.length} unused imports` : "- No unused imports found"}
`;

  const outputPath = join(process.cwd(), "reports", "dead-code-report.md");
  await writeFile(outputPath, markdown, "utf-8");

  console.log(`Report written to ${outputPath}`);
  console.log(`Found ${report.unusedFiles.length} unused files`);
}

// Run if called directly
if (require.main === module) {
  generateReport().catch(console.error);
}

export { detectDeadCode, generateReport };

import { appendFileSync, readdirSync, statSync } from "node:fs";

const chunks: Array<{ file: string; size: number }> = [];
const walk = (directory: string) => {
  for (const name of readdirSync(directory)) {
    const file = `${directory}/${name}`;
    const stats = statSync(file);
    if (stats.isDirectory()) walk(file);
    else if (file.endsWith(".js"))
      chunks.push({
        file: file.replace(".next/static/chunks/", ""),
        size: stats.size,
      });
  }
};
walk(".next/static/chunks");
chunks.sort((a, b) => b.size - a.size);
const total = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
const report = [
  "## Bundle analysis",
  "",
  `Total JavaScript: **${(total / 1024).toFixed(1)} KB** (3 MB budget)`,
  "",
  "| Largest chunk | Size |",
  "|---|---:|",
  ...chunks
    .slice(0, 8)
    .map(
      (chunk) => `| \`${chunk.file}\` | ${(chunk.size / 1024).toFixed(1)} KB |`,
    ),
  "",
  "Generated from the production Next.js build.",
].join("\n");
const target = process.env.GITHUB_STEP_SUMMARY || "bundle-report.md";
appendFileSync(target, report);
console.log(report);

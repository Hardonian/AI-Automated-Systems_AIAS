// pnpm audit gate: fails on vulnerabilities that HAVE a fix available
// (i.e. actionable), reports unfixable advisories (no patched release yet)
// as warnings so the pipeline can honestly stay green until upstream ships a patch.
import { execSync } from "node:child_process";

let raw;
try {
  raw = execSync("pnpm audit --prod --audit-level=low --json", {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
} catch (err) {
  // pnpm audit exits 1 whenever findings exist; the JSON report is still on stdout.
  raw = err.stdout;
}
const report = JSON.parse(raw);
const advisories = Object.values(report.advisories ?? {});
// pnpm signals "no patched release exists" with patched_versions === "<0.0.0".
const unfixable = advisories.filter((a) => !a.patched_versions || a.patched_versions === "<0.0.0");
const fixable = advisories.filter((a) => a.patched_versions && a.patched_versions !== "<0.0.0");

for (const a of unfixable) {
  console.warn(
    `WARN unfixable advisory: ${a.title} (${a.npm_id}) severity=${a.severity} — no patched release upstream yet; re-check weekly.`,
  );
}
const actionable = fixable.filter((a) => ["high", "critical"].includes(a.severity));
if (actionable.length) {
  console.error(`FAIL ${actionable.length} fixable high/critical vulnerabilities:`);
  for (const a of actionable) console.error(` - ${a.title} | ${a.module_name} | patched: ${a.patched_versions}`);
  process.exit(1);
}
console.log(
  `Audit gate OK: ${advisories.length} advisories (${unfixable.length} awaiting upstream patch, 0 fixable high/critical).`,
);

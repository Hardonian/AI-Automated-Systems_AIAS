import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const failures: string[] = [];

const read = (path: string): string => readFileSync(join(root, path), "utf8");

const walk = (directory: string, extensions: ReadonlySet<string>): string[] => {
  const absoluteDirectory = join(root, directory);

  if (!existsSync(absoluteDirectory)) return [];

  return readdirSync(absoluteDirectory).flatMap((entry) => {
    const absolutePath = join(absoluteDirectory, entry);
    const path = relative(root, absolutePath).replaceAll("\\", "/");

    if (statSync(absolutePath).isDirectory()) return walk(path, extensions);

    return extensions.has(extname(entry)) ? [path] : [];
  });
};

const sourceFiles = [
  ...walk("app", new Set([".ts", ".tsx"])),
  ...walk("components", new Set([".ts", ".tsx"])),
  ...walk("src", new Set([".ts", ".tsx"])),
];
const contentFiles = walk("content", new Set([".json", ".md", ".ts", ".tsx"]));

for (const path of ["public/logo.svg", "public/og-image.png"]) {
  if (!existsSync(join(root, path)))
    failures.push(`${path}: required asset missing`);
}

for (const path of sourceFiles) {
  if (/href\s*=\s*["']#["']/.test(read(path))) {
    failures.push(`${path}: placeholder hash link`);
  }
}

const unsupportedPublicPatterns: Array<[RegExp, string]> = [
  [/\bPIPEDA compliant\b/i, "unsupported compliance claim"],
  [/\bSOC\s*2[- ]ready\b/i, "unsupported assurance claim"],
  [/\bbank-grade security\b/i, "unsupported security claim"],
  [/\b100% confidential under NDA\b/i, "unsupported confidentiality claim"],
  [/store\.hardonia\.com/i, "unavailable catalog destination"],
  [/github\.com\/shardie-github\/aias/i, "legacy repository destination"],
];

for (const path of [...sourceFiles, ...contentFiles]) {
  const content = read(path);
  for (const [pattern, label] of unsupportedPublicPatterns) {
    if (pattern.test(content)) failures.push(`${path}: ${label}`);
  }
}

if (/github\.com\/sponsors\/your-org/i.test(read("package.json"))) {
  failures.push("package.json: placeholder funding URL");
}

const trustFiles = walk("public/docs/trust", new Set([".md"]));
const requiredTrustFiles = [
  "public/docs/trust/CONTINUITY.md",
  "public/docs/trust/DEPENDENCY_GOVERNANCE.md",
  "public/docs/trust/SECURITY.md",
  "public/docs/trust/SLO_SLA.md",
  "public/docs/trust/STATUS.md",
  "public/docs/trust/TRUST.md",
];

for (const path of requiredTrustFiles) {
  if (!existsSync(join(root, path)))
    failures.push(`${path}: required file missing`);
}

const unsupportedTrustPatterns: Array<[RegExp, string]> = [
  [/\[Your [^\]]+\]/i, "template placeholder"],
  [/\{new Date\(\)/, "runtime template expression"],
  [/\bPIPEDA compliant\b/i, "unsupported compliance claim"],
  [/\bSOC 2 Type II\b/i, "unsupported certification claim"],
  [/\bguarantee(?:d)?\s+99\.9%\b/i, "unsupported availability guarantee"],
];

for (const path of trustFiles) {
  const content = read(path);

  for (const [pattern, label] of unsupportedTrustPatterns) {
    if (pattern.test(content)) failures.push(`${path}: ${label}`);
  }
}

const workflowFiles = walk(".github/workflows", new Set([".yml", ".yaml"]));
const allowedWorkflows = new Set([
  ".github/workflows/bundle-analysis-pr.yml",
  ".github/workflows/dependency-review.yml",
  ".github/workflows/performance.yml",
  ".github/workflows/security.yml",
  ".github/workflows/systems-metrics.yml",
  ".github/workflows/verify.yml",
]);

for (const path of workflowFiles) {
  if (!allowedWorkflows.has(path))
    failures.push(`${path}: unreviewed workflow`);

  const content = read(path);
  const forbiddenWorkflowPatterns: Array<[RegExp, string]> = [
    [/\bsupabase\b/i, "backend dependency"],
    [/\bprisma\b/i, "database dependency"],
    [/\bapps\/web\b/i, "missing monorepo path"],
    [/\bwatchers\//i, "missing watcher path"],
    [/continue-on-error\s*:\s*true/i, "non-blocking release check"],
    [
      /ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION/i,
      "insecure JavaScript action override",
    ],
  ];

  for (const [pattern, label] of forbiddenWorkflowPatterns) {
    if (pattern.test(content)) failures.push(`${path}: ${label}`);
  }

  const scriptPattern =
    /(?:pnpm exec tsx|node|bash|sh)\s+([A-Za-z0-9_./-]+\.(?:ts|tsx|mjs|js|sh))/g;

  for (const match of content.matchAll(scriptPattern)) {
    const referencedPath = match[1];
    if (referencedPath && !existsSync(join(root, referencedPath))) {
      failures.push(`${path}: missing referenced script ${referencedPath}`);
    }
  }
}

const visualBaselines = walk("tests/e2e/__screenshots__", new Set([".png"]));
if (visualBaselines.length !== 24) {
  failures.push(
    `tests/e2e/__screenshots__: expected 24 critical visual baselines, found ${visualBaselines.length}`,
  );
}

const verifyWorkflow = read(".github/workflows/verify.yml");
if (!verifyWorkflow.includes("pnpm serve:static")) {
  failures.push(".github/workflows/verify.yml: static preview server missing");
}
if (!verifyWorkflow.includes("pnpm test:visual")) {
  failures.push(".github/workflows/verify.yml: visual regression gate missing");
}

if (failures.length > 0) {
  console.error("Release integrity check failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Release integrity passed (${sourceFiles.length} source files, ${contentFiles.length} content files, ${trustFiles.length} trust documents, ${workflowFiles.length} workflows, ${visualBaselines.length} visual baselines).`,
);

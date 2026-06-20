import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

import { ROUTE_MANIFEST } from "@/lib/seo/route-manifest";

const ROUTE_MANIFEST_PATH = "lib/seo/route-manifest.ts";
const args = new Set(process.argv.slice(2));
const isDryRun = args.has("--dry-run");

const sortedRoutes = [...ROUTE_MANIFEST].sort((a, b) => {
  if (a.path === "/") return -1;
  if (b.path === "/") return 1;

  const aIndexable = a.indexable !== false;
  const bIndexable = b.indexable !== false;

  if (aIndexable !== bIndexable) {
    return aIndexable ? -1 : 1;
  }

  return a.path.localeCompare(b.path);
});

const routeEntries = sortedRoutes
  .map((route) => {
    const fields = [
      `path: ${JSON.stringify(route.path)}`,
      `title: ${JSON.stringify(route.title)}`,
      `description: ${JSON.stringify(route.description)}`,
      `canonical: ${JSON.stringify(route.canonical)}`,
      `priority: ${route.priority}`,
      `changeFrequency: ${JSON.stringify(route.changeFrequency)}`,
      ...(route.indexable === false ? ["indexable: false"] : []),
    ];

    return `  {\n    ${fields.join(",\n    ")},\n  }`;
  })
  .join(",\n");

const nextSource = `export interface RouteManifestEntry {
  path: string;
  title: string;
  description: string;
  canonical: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly";
  indexable?: boolean;
}

export const ROUTE_MANIFEST: RouteManifestEntry[] = [
${routeEntries}
];

export const INDEXABLE_ROUTE_MANIFEST = ROUTE_MANIFEST.filter(
  (route) => route.indexable !== false,
);
`;

const formatted = execSync(
  "pnpm exec prettier --stdin-filepath lib/seo/route-manifest.ts",
  {
    input: nextSource,
    encoding: "utf8",
  },
);

const current = readFileSync(ROUTE_MANIFEST_PATH, "utf8");

if (current === formatted) {
  console.log("Route manifest is already canonically ordered.");
  process.exit(0);
}

if (isDryRun) {
  console.error(
    'Route manifest ordering drift detected. Run "pnpm fix:route-manifest" to normalize it.',
  );
  process.exit(1);
}

writeFileSync(ROUTE_MANIFEST_PATH, formatted, "utf8");
console.log("Route manifest normalized successfully.");

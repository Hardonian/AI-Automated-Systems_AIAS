import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { INDEXABLE_ROUTE_MANIFEST } from "@/lib/seo/route-manifest";

import { countPrimaryHeadingSignals } from "./validate-seo-utils";

function getRouteFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name === "page.tsx")
    .map((entry) =>
      path.join(
        (entry as any).parentPath || (entry as any).path || "",
        entry.name,
      ),
    );
}

const routeFiles = getRouteFiles("app");
const failures: string[] = [];

const titleSeen = new Map<string, string>();
const descriptionSeen = new Map<string, string>();
const canonicalSeen = new Map<string, string>();

for (const route of INDEXABLE_ROUTE_MANIFEST) {
  if (!route.title.trim())
    failures.push(`${route.path}: missing title in route manifest`);
  if (!route.description.trim())
    failures.push(`${route.path}: missing description in route manifest`);
  if (!route.canonical.trim())
    failures.push(`${route.path}: missing canonical in route manifest`);

  if (titleSeen.has(route.title)) {
    failures.push(
      `${route.path}: duplicate title with ${titleSeen.get(route.title)}`,
    );
  }
  if (descriptionSeen.has(route.description)) {
    failures.push(
      `${route.path}: duplicate description with ${descriptionSeen.get(route.description)}`,
    );
  }
  if (canonicalSeen.has(route.canonical)) {
    failures.push(
      `${route.path}: duplicate canonical with ${canonicalSeen.get(route.canonical)}`,
    );
  }

  titleSeen.set(route.title, route.path);
  descriptionSeen.set(route.description, route.path);
  canonicalSeen.set(route.canonical, route.path);

  const normalizedPath =
    route.path === "/" ? "app/page.tsx" : `app${route.path}/page.tsx`;
  if (!existsSync(normalizedPath)) {
    failures.push(
      `${route.path}: route manifest points to missing file ${normalizedPath}`,
    );
    continue;
  }

  const source = readFileSync(normalizedPath, "utf8");
  const headingSignalCount = countPrimaryHeadingSignals(source);
  if (headingSignalCount !== 1) {
    failures.push(
      `${route.path}: expected exactly one primary heading signal (<h1>, <PageHero>, <ContentDrivenHero>, or <SurveyFlow>) but found ${headingSignalCount}`,
    );
  }
}

for (const routeFile of routeFiles) {
  const source = readFileSync(routeFile, "utf8");

  const hasMetadataExport =
    source.includes("generateSEOMetadata(") ||
    source.includes("export const metadata: Metadata") ||
    source.includes("export const metadata =") ||
    source.includes("export async function generateMetadata(");

  if (!hasMetadataExport) {
    failures.push(`${routeFile}: missing metadata export`);
  }

  if (
    source.includes("generateSEOMetadata(") &&
    !source.includes("canonical:")
  ) {
    failures.push(
      `${routeFile}: generateSEOMetadata used without explicit canonical`,
    );
  }
}

if (failures.length) {
  console.error("SEO validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `SEO validation passed for ${INDEXABLE_ROUTE_MANIFEST.length} indexable routes and ${routeFiles.length} route files.`,
);

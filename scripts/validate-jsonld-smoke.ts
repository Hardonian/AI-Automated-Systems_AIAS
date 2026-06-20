import { existsSync, readdirSync, readFileSync } from "node:fs";

const keyRoutes: Array<{ route: string; markers?: string[] }> = [
  { route: "/", markers: ["service-list-schema", "faq-schema"] },
  { route: "/services" },
  { route: "/how-it-works", markers: ["faq-schema"] },
  { route: "/work", markers: ["case-study-schema-"] },
  { route: "/faq", markers: ["faq-schema"] },
];

const schemaCriticalRoutes: Array<{ route: string; markers: string[] }> = [
  { route: "/blog", markers: ["blog-collection-schema"] },
];

const failures: string[] = [];

function routeToOutFile(route: string): string {
  if (route === "/") return "out/index.html";
  return `out${route}.html`;
}

function assertJsonLdMarkers(
  file: string,
  routeLabel: string,
  markers: string[] = [],
) {
  if (!existsSync(file)) {
    failures.push(
      `${routeLabel}: missing built file ${file} (run pnpm build first)`,
    );
    return;
  }

  const html = readFileSync(file, "utf8");
  const hasJsonLdScriptTag =
    /<script[^>]+type=['"]application\/ld\+json['"][^>]*>/.test(html);
  const hasSerializedJsonLd =
    html.includes("application/ld+json") ||
    html.includes("application\\/ld+json");

  if (!hasJsonLdScriptTag && !hasSerializedJsonLd) {
    failures.push(`${routeLabel}: missing JSON-LD marker in built HTML`);
    return;
  }

  for (const marker of markers) {
    if (!html.includes(marker)) {
      failures.push(
        `${routeLabel}: missing expected JSON-LD marker '${marker}'`,
      );
    }
  }
}

for (const { route, markers } of [...keyRoutes, ...schemaCriticalRoutes]) {
  assertJsonLdMarkers(routeToOutFile(route), route, markers ?? []);
}

const caseStudyOutDir = "out/case-studies";
if (!existsSync(caseStudyOutDir)) {
  failures.push(
    `/case-studies/[slug]: missing built directory ${caseStudyOutDir} (run pnpm build first)`,
  );
} else {
  const caseStudyFiles = readdirSync(caseStudyOutDir)
    .filter((entry) => entry !== "index.html" && entry.endsWith(".html"))
    .map((entry) => `${caseStudyOutDir}/${entry}`);

  if (caseStudyFiles.length === 0) {
    failures.push(
      "/case-studies/[slug]: no prerendered case-study HTML files found",
    );
  } else {
    for (const file of caseStudyFiles) {
      const slug = file.replace(`${caseStudyOutDir}/`, "").replace(".html", "");
      assertJsonLdMarkers(file, `/case-studies/${slug}`, [
        "case-study-schema-",
      ]);
    }
  }
}

if (failures.length) {
  console.error("JSON-LD smoke validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `JSON-LD smoke validation passed for ${keyRoutes.length + schemaCriticalRoutes.length} key routes and all prerendered case-study detail pages.`,
);

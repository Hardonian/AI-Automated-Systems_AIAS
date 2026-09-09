import { getBuiltPages, jsonLdObjects } from "./lib/built-html";

const failures: string[] = [];
const pages = getBuiltPages();

for (const page of pages) {
  const schemas = jsonLdObjects(page.html);
  const breadcrumbs = schemas.filter(
    (schema) => schema["@type"] === "BreadcrumbList",
  );
  if (breadcrumbs.length !== 1) {
    failures.push(
      `${page.route}: expected one BreadcrumbList, found ${breadcrumbs.length}`,
    );
  } else {
    const elements = breadcrumbs[0].itemListElement;
    if (!Array.isArray(elements) || elements.length === 0) {
      failures.push(
        `${page.route}: BreadcrumbList has no itemListElement values`,
      );
    }
  }

  const requiredType =
    page.route === "/faq"
      ? "FAQPage"
      : page.route === "/workflows"
        ? "HowTo"
        : null;
  if (
    requiredType &&
    !schemas.some((schema) => schema["@type"] === requiredType)
  ) {
    failures.push(`${page.route}: missing required ${requiredType} schema`);
  }

  for (const schema of schemas) {
    if (schema["@context"] !== "https://schema.org") {
      failures.push(`${page.route}: JSON-LD object has an invalid @context`);
    }
    if (
      typeof schema["@type"] !== "string" &&
      !Array.isArray(schema["@graph"])
    ) {
      failures.push(
        `${page.route}: JSON-LD object has neither @type nor @graph`,
      );
    }
  }
}

if (failures.length) {
  console.error(
    "Schema.org validation failed:\n" +
      failures.map((failure) => `- ${failure}`).join("\n"),
  );
  process.exit(1);
}

console.log(`Schema.org validation passed for ${pages.length} built routes.`);

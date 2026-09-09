import { attributeValues, getBuiltPages } from "./lib/built-html";

const failures: string[] = [];
const pages = getBuiltPages();
const fields = [
  "twitter:card",
  "twitter:title",
  "twitter:description",
  "twitter:image",
];

for (const page of pages) {
  for (const field of fields) {
    const values = attributeValues(page.html, "meta", "name", field, "content");
    if (values.length !== 1 || !values[0].trim()) {
      failures.push(`${page.route}: expected one non-empty ${field} meta tag`);
    }
    if (
      field === "twitter:image" &&
      values[0] &&
      !values[0].startsWith("https://")
    ) {
      failures.push(
        `${page.route}: twitter:image must be an absolute HTTPS URL`,
      );
    }
  }
}

if (failures.length) {
  console.error(
    "Twitter/X card audit failed:\n" +
      failures.map((failure) => `- ${failure}`).join("\n"),
  );
  process.exit(1);
}

console.log(`Twitter/X card audit passed for ${pages.length} built routes.`);

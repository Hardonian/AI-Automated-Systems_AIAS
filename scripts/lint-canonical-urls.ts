import { attributeValues, getBuiltPages } from "./lib/built-html";
import { SITE_URL } from "../lib/seo/metadata";

const failures: string[] = [];
const pages = getBuiltPages();

for (const page of pages) {
  const canonicals = attributeValues(
    page.html,
    "link",
    "rel",
    "canonical",
    "href",
  );
  if (canonicals.length !== 1) {
    failures.push(
      `${page.route}: expected exactly one canonical URL, found ${canonicals.length}`,
    );
    continue;
  }

  const expected = `${SITE_URL}${page.route === "/" ? "" : page.route}`;
  if (canonicals[0] !== expected) {
    failures.push(
      `${page.route}: canonical '${canonicals[0]}' does not equal '${expected}'`,
    );
  }
}

if (failures.length) {
  console.error(
    "Canonical URL invariant failed:\n" +
      failures.map((failure) => `- ${failure}`).join("\n"),
  );
  process.exit(1);
}

console.log(`Canonical URL invariant passed for ${pages.length} built routes.`);

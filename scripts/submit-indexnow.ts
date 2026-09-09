import { readFileSync } from "node:fs";

import { INDEXABLE_ROUTE_MANIFEST } from "../lib/seo/route-manifest";
import { SITE_URL } from "../lib/seo/metadata";

const key = process.env.INDEXNOW_KEY?.trim();
if (!key) {
  console.log("INDEXNOW_KEY is not set; dry-run only.");
  console.log(
    `${INDEXABLE_ROUTE_MANIFEST.length} URLs are ready for submission.`,
  );
  process.exit(0);
}
const payload = {
  host: new URL(SITE_URL).host,
  key,
  keyLocation: `${SITE_URL}/${key}.txt`,
  urlList: INDEXABLE_ROUTE_MANIFEST.map(
    (route) => `${SITE_URL}${route.path === "/" ? "" : route.path}`,
  ),
};
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(payload),
});
if (!response.ok)
  throw new Error(
    `IndexNow submission failed (${response.status}): ${readFileSync ? await response.text() : ""}`,
  );
console.log(`IndexNow accepted ${payload.urlList.length} URLs.`);

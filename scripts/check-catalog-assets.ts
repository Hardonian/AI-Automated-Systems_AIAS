import { existsSync } from "node:fs";
import path from "node:path";

import { siteContent } from "../src/content/site";

const catalogAssets = siteContent.catalogProducts
  .map((product) => product.thumbnailSrc)
  .filter((thumbnailSrc): thumbnailSrc is string => Boolean(thumbnailSrc));

const missingAssets = catalogAssets.filter((asset) => {
  if (!asset.startsWith("/images/catalog/")) {
    return true;
  }

  return !existsSync(path.join(process.cwd(), "public", asset));
});

if (missingAssets.length > 0) {
  console.error("Missing catalog image assets:");
  missingAssets.forEach((asset) => console.error(`- ${asset}`));
  process.exit(1);
}

console.log(
  `Catalog asset check passed for ${catalogAssets.length} thumbnails.`,
);

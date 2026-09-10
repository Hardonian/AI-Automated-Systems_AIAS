import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

import { siteContent } from "../src/content/site";

const catalogAssets = siteContent.catalogProducts
  .map((product) => product.thumbnailSrc)
  .filter((thumbnailSrc): thumbnailSrc is string => Boolean(thumbnailSrc));

const releasableAssets = new Set(
  execFileSync(
    "git",
    [
      "ls-files",
      "--cached",
      "--others",
      "--exclude-standard",
      "--",
      "public/images/catalog",
    ],
    { cwd: process.cwd(), encoding: "utf8" },
  )
    .split(/\r?\n/)
    .filter(Boolean)
    .map((asset) => asset.replaceAll("\\", "/")),
);

const invalidAssets = catalogAssets.filter((asset) => {
  const publicPath = `public${asset}`;

  return (
    !asset.startsWith("/images/catalog/") ||
    path.extname(asset).toLowerCase() !== ".avif" ||
    !existsSync(path.join(process.cwd(), publicPath)) ||
    !releasableAssets.has(publicPath)
  );
});

if (invalidAssets.length > 0) {
  console.error("Catalog images must be present, releasable AVIF assets:");
  invalidAssets.forEach((asset) => console.error(`- ${asset}`));
  process.exit(1);
}

console.log(
  `Catalog asset check passed for ${catalogAssets.length} thumbnails.`,
);

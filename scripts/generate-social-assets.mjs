import { existsSync } from "node:fs";

import sharp from "sharp";

const source = "public/og-image.svg";
const output = "public/og-image.png";

if (!existsSync(source)) {
  console.error(`Missing social image source: ${source}`);
  process.exit(1);
}

await sharp(source)
  .resize(1200, 630)
  .png({ compressionLevel: 9 })
  .toFile(output);
console.log(`${source} -> ${output}`);

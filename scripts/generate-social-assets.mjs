import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";

import sharp from "sharp";

const source = "public/og-image.svg";
const output = "public/og-image.png";
const iconSource = "public/favicon.svg";

if (!existsSync(source)) {
  console.error(`Missing social image source: ${source}`);
  process.exit(1);
}

await sharp(source)
  .resize(1200, 630)
  .png({ compressionLevel: 9 })
  .toFile(output);
console.log(`${source} -> ${output}`);

if (!existsSync(iconSource)) {
  console.error(`Missing icon source: ${iconSource}`);
  process.exit(1);
}

const iconTargets = [
  { output: "public/apple-touch-icon.png", size: 180 },
  { output: "public/icon-192.png", size: 192 },
  { output: "public/icon-512.png", size: 512 },
];

for (const target of iconTargets) {
  await sharp(iconSource)
    .resize(target.size, target.size)
    .png({ compressionLevel: 9 })
    .toFile(target.output);
  console.log(`${iconSource} -> ${target.output}`);
}

const faviconPng = await sharp(iconSource)
  .resize(32, 32)
  .png({ compressionLevel: 9 })
  .toBuffer();
const icoHeader = Buffer.alloc(22);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(1, 4);
icoHeader.writeUInt8(32, 6);
icoHeader.writeUInt8(32, 7);
icoHeader.writeUInt8(0, 8);
icoHeader.writeUInt8(0, 9);
icoHeader.writeUInt16LE(1, 10);
icoHeader.writeUInt16LE(32, 12);
icoHeader.writeUInt32LE(faviconPng.length, 14);
icoHeader.writeUInt32LE(icoHeader.length, 18);
await writeFile("public/favicon.ico", Buffer.concat([icoHeader, faviconPng]));
console.log(`${iconSource} -> public/favicon.ico`);

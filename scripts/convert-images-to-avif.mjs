import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const roots = ["public/images/catalog", "public/images"];
const files = roots.flatMap((root) =>
  existsSync(root)
    ? readdirSync(root, { withFileTypes: true })
        .filter((entry) => entry.isFile() && /\.(?:png|jpe?g)$/i.test(entry.name))
        .map((entry) => path.join(root, entry.name))
    : [],
);

for (const file of [...new Set(files)]) {
  const output = file.replace(/\.(?:png|jpe?g)$/i, ".avif");
  await sharp(file).avif({ quality: 62, effort: 6 }).toFile(output);
  console.log(`${file} -> ${output}`);
}

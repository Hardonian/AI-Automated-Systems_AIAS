import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const failures: string[] = [];
const referencedAssets = new Map<string, Set<string>>();
const sourceExtensions = new Set([".ts", ".tsx", ".css", ".json", ".md"]);
const assetPattern =
  /(?<!\/)\/(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.(?:avif|webp|png|jpe?g|svg|ico)/g;

function walk(directory: string): string[] {
  const absoluteDirectory = join(root, directory);
  if (!existsSync(absoluteDirectory)) return [];

  return readdirSync(absoluteDirectory).flatMap((entry) => {
    const absolutePath = join(absoluteDirectory, entry);
    const path = relative(root, absolutePath).replaceAll("\\", "/");
    return statSync(absolutePath).isDirectory() ? walk(path) : [path];
  });
}

for (const path of ["app", "components", "content", "lib", "src"].flatMap(
  walk,
)) {
  if (!sourceExtensions.has(extname(path))) continue;
  const content = readFileSync(join(root, path), "utf8");
  for (const match of content.matchAll(assetPattern)) {
    const asset = match[0];
    const references = referencedAssets.get(asset) ?? new Set<string>();
    references.add(path);
    referencedAssets.set(asset, references);
  }
}

const releasable = new Set(
  execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "--", "public"],
    { cwd: root, encoding: "utf8" },
  )
    .split(/\r?\n/)
    .filter(Boolean)
    .map((path) => path.replaceAll("\\", "/")),
);

for (const [asset, references] of referencedAssets) {
  const publicPath = `public${asset}`;
  if (!existsSync(join(root, publicPath))) {
    failures.push(
      `${asset}: missing (referenced by ${[...references].join(", ")})`,
    );
  } else if (!releasable.has(publicPath)) {
    failures.push(`${asset}: exists locally but is ignored/unreleasable`);
  }
}

if (failures.length > 0) {
  console.error("Public asset check failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `Public asset check passed for ${referencedAssets.size} referenced files.`,
);

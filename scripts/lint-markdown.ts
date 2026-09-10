import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const files = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard", "*.md"],
  { encoding: "utf8" },
)
  .split(/\r?\n/)
  .filter((file) => Boolean(file) && existsSync(file));
const failures: string[] = [];
for (const file of files) {
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, index) => {
    if (/\s+$/.test(line))
      failures.push(`${file}:${index + 1}: trailing whitespace`);
    if (/\t/.test(line)) failures.push(`${file}:${index + 1}: tab character`);
  });
  const links = lines
    .join("\n")
    .matchAll(/\[[^\]]*\]\((?!https?:|mailto:|#|\/)([^)]+)\)/g);
  for (const link of links) {
    const target = link[1]?.split("#")[0];
    if (target && !existsSync(path.resolve(path.dirname(file), target)))
      failures.push(`${file}: missing local link ${target}`);
  }
}
if (failures.length) {
  console.error(
    "Markdown lint failed:\n" +
      failures
        .slice(0, 50)
        .map((failure) => `- ${failure}`)
        .join("\n"),
  );
  process.exit(1);
}
console.log(`Markdown lint passed for ${files.length} files.`);

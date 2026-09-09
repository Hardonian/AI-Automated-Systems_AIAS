import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const stagedOnly = process.argv.includes("--staged");
const output = execFileSync(
  "git",
  stagedOnly
    ? ["diff", "--cached", "--name-only", "--diff-filter=ACMR"]
    : ["ls-files"],
  { encoding: "utf8" },
);
const files = output
  .split(/\r?\n/)
  .filter(
    (file) =>
      file &&
      existsSync(file) &&
      !/\.(?:png|jpe?g|gif|ico|woff2?|pdf|lock)$/i.test(file),
  );
const patterns = [
  {
    name: "private key",
    expression: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  },
  { name: "GitHub token", expression: /gh[pousr]_[A-Za-z0-9]{30,}/ },
  { name: "AWS access key", expression: /AKIA[0-9A-Z]{16}/ },
  {
    name: "assigned secret",
    expression:
      /(?:api[_-]?key|secret|password)\s*[:=]\s*["'][A-Za-z0-9+/_=-]{20,}["']/i,
  },
];
const failures: string[] = [];
for (const file of files) {
  const content = readFileSync(file, "utf8");
  for (const pattern of patterns)
    if (pattern.expression.test(content))
      failures.push(`${file}: possible ${pattern.name}`);
}
if (failures.length) {
  console.error(
    "Secret scan failed:\n" +
      failures.map((failure) => `- ${failure}`).join("\n"),
  );
  process.exit(1);
}
console.log(`Secret scan passed for ${files.length} files.`);

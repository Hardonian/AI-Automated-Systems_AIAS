import { readFileSync, readdirSync, statSync } from "node:fs";

const vercel = JSON.parse(readFileSync("vercel.json", "utf8")) as {
  headers?: Array<{ headers?: Array<{ key: string; value: string }> }>;
};
const headers =
  vercel.headers?.find((entry) =>
    entry.headers?.some((header) => header.key === "Content-Security-Policy"),
  )?.headers ?? [];
const get = (name: string) =>
  headers.find((header) => header.key.toLowerCase() === name.toLowerCase())
    ?.value;
const failures: string[] = [];
if (get("X-Frame-Options") !== "DENY")
  failures.push("X-Frame-Options must be DENY");
if (!get("Content-Security-Policy")?.includes("frame-ancestors 'none'"))
  failures.push("CSP must deny frame ancestors");

const sources = execSources(["app", "components"]);
for (const source of sources) {
  for (const match of source.content.matchAll(
    /<script\b[^>]*\bsrc=["'](https?:\/\/[^"']+)["'][^>]*>/gi,
  )) {
    if (!/\bintegrity=["'][^"']+["']/i.test(match[0]))
      failures.push(
        `${source.file}: external script ${match[1]} is missing SRI`,
      );
  }
}
if (failures.length) {
  console.error(
    "Security invariant check failed:\n" +
      failures.map((failure) => `- ${failure}`).join("\n"),
  );
  process.exit(1);
}
console.log(
  `Security headers, clickjacking defense, and CDN SRI invariants passed (${sources.length} source files).`,
);

function execSources(roots: string[]) {
  const files: Array<{ file: string; content: string }> = [];
  const walk = (target: string) => {
    for (const name of readdirSync(target)) {
      const file = `${target}/${name}`;
      if (statSync(file).isDirectory()) walk(file);
      else if (/\.(?:tsx?|jsx?)$/.test(file))
        files.push({ file, content: readFileSync(file, "utf8") });
    }
  };
  roots.forEach(walk);
  return files;
}

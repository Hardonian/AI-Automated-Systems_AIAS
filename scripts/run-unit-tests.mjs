import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const vitestPackage = fileURLToPath(import.meta.resolve("vitest/package.json"));
const vitestEntry = join(dirname(vitestPackage), "vitest.mjs");
const result = spawnSync(
  process.execPath,
  [vitestEntry, "run", ...process.argv.slice(2)],
  {
    env: { ...process.env, NODE_ENV: "test" },
    stdio: "inherit",
  },
);

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);

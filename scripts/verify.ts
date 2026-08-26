#!/usr/bin/env tsx
import { spawnSync } from "node:child_process";

const steps: Array<[string, string[]]> = [
  ["pnpm", ["doctor"]],
  ["pnpm", ["audit:ci"]],
  ["pnpm", ["lint"]],
  ["pnpm", ["typecheck"]],
  ["pnpm", ["test"]],
  ["pnpm", ["build"]],
];

for (const [cmd, args] of steps) {
  const label = `${cmd} ${args.join(" ")}`;
  console.log(`\n▶ ${label}`);
  const result = spawnSync(cmd, args, { stdio: "inherit" });
  if (result.status !== 0) {
    console.error(`\n❌ verify failed at: ${label}`);
    process.exit(result.status ?? 1);
  }
}

console.log("\n✅ verify passed: doctor, audit, lint, typecheck, test, build");

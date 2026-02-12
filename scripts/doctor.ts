#!/usr/bin/env tsx
import { existsSync, readFileSync } from 'node:fs';
import { execSync, spawnSync } from 'node:child_process';
import path from 'node:path';

import { validateEnvMode, type EnvMode } from '../lib/env';

const categories: Record<string, string[]> = {
  toolchain: [],
  env: [],
  config: [],
  assets: [],
  checks: [],
};

function run(cmd: string, args: string[], category: keyof typeof categories): boolean {
  const result = spawnSync(cmd, args, { stdio: 'pipe', encoding: 'utf8' });
  if (result.status !== 0) {
    categories[category].push(`${cmd} ${args.join(' ')} failed`);
    return false;
  }
  return true;
}

console.log('🩺 AIAS Doctor\n');

const nodeVersion = process.version;
const pnpmVersion = execSync('pnpm -v', { encoding: 'utf8' }).trim();
const workspaceMode = existsSync('pnpm-workspace.yaml') ? 'workspace' : 'single-package';
console.log(`Toolchain: Node ${nodeVersion}, pnpm ${pnpmVersion}, mode=${workspaceMode}`);

for (const mode of ['local', 'preview', 'production'] as EnvMode[]) {
  const { missing, invalid } = validateEnvMode(mode);
  console.log(
    `env:${mode} -> missing=[${missing.length ? missing.join(', ') : 'none'}] invalid=[${invalid.length ? invalid.join(', ') : 'none'}]`,
  );
  if (missing.length || invalid.length) {
    categories.env.push(`${mode} env validation failed`);
  }
}

if (!existsSync('next.config.mjs')) categories.config.push('next.config.mjs missing');
if (!existsSync('vercel.json')) categories.config.push('vercel.json missing');
run('node', ['-e', "import('./next.config.mjs').then(()=>process.exit(0)).catch(()=>process.exit(1))"], 'config');
run('node', ['-e', "import('./eslint.config.mjs').then(()=>process.exit(0)).catch(()=>process.exit(1))"], 'config');

const tsconfigExists = existsSync('tsconfig.json');
if (!tsconfigExists) categories.config.push('tsconfig.json missing');

const layoutPath = path.join('app', 'layout.tsx');
if (existsSync(layoutPath)) {
  const layout = readFileSync(layoutPath, 'utf8');
  for (const match of layout.matchAll(/href=['\"](\/[^'\"]+)['\"]/g)) {
    const asset = path.join('public', match[1]);
    if (!existsSync(asset)) categories.assets.push(`missing public asset: ${match[1]}`);
  }
}

let clientFiles: string[] = [];
const clientScan = spawnSync(
  'rg',
  ['-l', "'use client'", 'app', 'components', 'lib', 'src', '--glob', '*.tsx', '--glob', '*.ts'],
  { encoding: 'utf8' },
);
if (clientScan.status === 0 && clientScan.stdout) {
  clientFiles = clientScan.stdout.split('\n').filter(Boolean);
}

for (const file of clientFiles) {
  const content = readFileSync(file, 'utf8');
  if (content.includes("from 'server-only'") || content.includes('from \"server-only\"')) {
    categories.config.push(`server-only imported by client module: ${file}`);
  }
}

for (const [cmd, args] of [
  ['pnpm', ['lint']],
  ['pnpm', ['typecheck']],
  ['pnpm', ['test']],
  ['pnpm', ['build']],
] as const) {
  console.log(`running ${cmd} ${args.join(' ')}`);
  run(cmd, [...args], 'checks');
}

const failures = Object.entries(categories).filter(([, issues]) => issues.length > 0);
if (failures.length) {
  console.error('\n❌ Root-cause summary:');
  for (const [category, issues] of failures) {
    console.error(`- ${category}:`);
    for (const issue of issues) console.error(`  • ${issue}`);
  }
  process.exit(1);
}

console.log('\n✅ Doctor completed with no blocking issues.');

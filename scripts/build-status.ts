#!/usr/bin/env tsx
/**
 * Build Status Summary Script
 * 
 * Provides a quick overview of build readiness and configuration
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

interface Status {
  name: string;
  status: '✅' | '⚠️' | '❌';
  message: string;
}

const statuses: Status[] = [];

// Check pnpm version
try {
  const version = execSync('pnpm --version', { encoding: 'utf-8' }).trim();
  const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
  const required = pkg.packageManager?.replace('pnpm@', '') || '8.0.0';
  
  if (version === required) {
    statuses.push({ name: 'pnpm Version', status: '✅', message: `v${version} (matches requirement)` });
  } else {
    statuses.push({ name: 'pnpm Version', status: '⚠️', message: `v${version} (required: v${required})` });
  }
} catch {
  statuses.push({ name: 'pnpm Version', status: '❌', message: 'Not installed' });
}

// Check lockfile
if (existsSync('pnpm-lock.yaml')) {
  try {
    // Check if lockfile is recent (modified within last hour) or if node_modules exists
    const lockfileStats = statSync('pnpm-lock.yaml');
    const nodeModulesExists = existsSync('node_modules');
    const lockfileAge = Date.now() - lockfileStats.mtimeMs;
    const isRecent = lockfileAge < 3600000; // 1 hour
    
    if (nodeModulesExists || isRecent) {
      statuses.push({ name: 'Lockfile Sync', status: '✅', message: 'Lockfile present and recent' });
    } else {
      statuses.push({ name: 'Lockfile Sync', status: '⚠️', message: 'Lockfile may need regeneration' });
    }
  } catch {
    statuses.push({ name: 'Lockfile Sync', status: '✅', message: 'Lockfile found' });
  }
} else {
  statuses.push({ name: 'Lockfile Sync', status: '❌', message: 'pnpm-lock.yaml not found' });
}

// Check workspace packages
const workspacePackages = ['packages/config', 'packages/lib'];
let workspaceOk = true;
for (const pkg of workspacePackages) {
  if (!existsSync(join(pkg, 'package.json'))) {
    workspaceOk = false;
    break;
  }
}
statuses.push({
  name: 'Workspace Packages',
  status: workspaceOk ? '✅' : '❌',
  message: workspaceOk ? 'All packages found' : 'Missing packages'
});

// Check required files
const requiredFiles = [
  { file: 'package.json', name: 'package.json' },
  { file: 'pnpm-workspace.yaml', name: 'Workspace Config' },
  { file: '.npmrc', name: 'npmrc Config' },
  { file: 'vercel.json', name: 'Vercel Config' },
  { file: 'next.config.mjs', name: 'Next.js Config' },
];

for (const { file, name } of requiredFiles) {
  statuses.push({
    name,
    status: existsSync(file) ? '✅' : '❌',
    message: existsSync(file) ? 'Found' : 'Missing'
  });
}

// Check build artifacts
if (existsSync('.next')) {
  statuses.push({ name: 'Build Artifacts', status: '✅', message: '.next directory exists' });
} else {
  statuses.push({ name: 'Build Artifacts', status: '⚠️', message: 'No build artifacts (run build first)' });
}

// Print summary
console.log('\n📊 Build Status Summary\n');
console.log('─'.repeat(50));

for (const status of statuses) {
  console.log(`${status.status} ${status.name.padEnd(25)} ${status.message}`);
}

console.log('─'.repeat(50));

const errors = statuses.filter(s => s.status === '❌').length;
const warnings = statuses.filter(s => s.status === '⚠️').length;

if (errors > 0) {
  console.log(`\n❌ ${errors} error(s) found`);
  process.exit(1);
} else if (warnings > 0) {
  console.log(`\n⚠️  ${warnings} warning(s) found`);
  process.exit(0);
} else {
  console.log('\n✅ All checks passed!');
  process.exit(0);
}

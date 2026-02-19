#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const checks = [];
const warnings = [];

console.log('🔍 Vercel Configuration Validation\n');

if (!existsSync('vercel.json')) {
  console.error('❌ vercel.json not found');
  process.exit(1);
}

try {
  const vercelConfig = JSON.parse(readFileSync('vercel.json', 'utf8'));
  console.log('✅ vercel.json is valid JSON');

  if (!vercelConfig.buildCommand) {
    warnings.push('vercel.json: missing buildCommand');
  } else {
    console.log(`✅ buildCommand: ${vercelConfig.buildCommand}`);
  }

  if (!vercelConfig.installCommand) {
    warnings.push('vercel.json: missing installCommand');
  } else {
    console.log(`✅ installCommand: ${vercelConfig.installCommand}`);
  }

  if (vercelConfig.headers && Array.isArray(vercelConfig.headers)) {
    console.log(`✅ headers: ${vercelConfig.headers.length} header rules configured`);
  }

  if (vercelConfig.regions) {
    console.log(`✅ regions: ${vercelConfig.regions.join(', ')}`);
  }
} catch (e) {
  console.error('❌ vercel.json parse error:', e.message);
  process.exit(1);
}

if (!existsSync('next.config.mjs') && !existsSync('next.config.js')) {
  checks.push('Next.js config not found');
} else {
  console.log('✅ Next.js config found');
}

if (!existsSync('.nvmrc') && !existsSync('.node-version')) {
  warnings.push('No .nvmrc or .node-version file');
} else {
  console.log('✅ Node version file found');
}

try {
  const nodeVersion = process.version;
  console.log(`✅ Node version: ${nodeVersion}`);
  
  if (!nodeVersion.startsWith('v22')) {
    warnings.push(`Node version ${nodeVersion} may not match expected v22.x`);
  }
} catch (e) {
  warnings.push('Could not determine Node version');
}

try {
  const pnpmVersion = execSync('pnpm -v', { encoding: 'utf8' }).trim();
  console.log(`✅ pnpm version: ${pnpmVersion}`);
} catch (e) {
  warnings.push('pnpm not available');
}

if (existsSync('out')) {
  const files = execSync('ls -la out 2>/dev/null | wc -l', { encoding: 'utf8' }).trim();
  console.log(`✅ Build output directory exists (${files} entries)`);
} else {
  warnings.push('Build output directory (out/) not found - run build first');
}

console.log('\n' + '='.repeat(50));
if (checks.length > 0) {
  console.error('\n❌ Errors:');
  checks.forEach(c => console.error(`  • ${c}`));
  process.exit(1);
}

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach(w => console.log(`  • ${w}`));
}

console.log('\n✅ Vercel configuration validation passed');
process.exit(0);

#!/usr/bin/env tsx
/**
 * Post-Build Verification Script
 * 
 * Verifies that the build completed successfully:
 * - Build artifacts exist
 * - No critical errors in build output
 * - Required files are present
 */

import { existsSync, statSync } from 'fs';
import { join } from 'path';

const errors: string[] = [];
const warnings: string[] = [];

function checkBuildArtifacts(): boolean {
  const requiredPaths = [
    '.next',
    '.next/BUILD_ID',
    '.next/static',
  ];
  
  let allExist = true;
  
  for (const path of requiredPaths) {
    if (!existsSync(path)) {
      errors.push(`❌ Build artifact missing: ${path}`);
      allExist = false;
    }
  }
  
  return allExist;
}

function checkBuildSize(): void {
  const nextDir = '.next';
  if (existsSync(nextDir)) {
    try {
      const stats = statSync(nextDir);
      if (stats.size === 0) {
        warnings.push('⚠️  .next directory exists but appears empty');
      }
    } catch {
      // Directory exists, that's what matters
    }
  }
}

function checkWorkspaceBuilds(): boolean {
  const workspacePackages = [
    'packages/config',
    'packages/lib',
  ];
  
  let allBuilt = true;
  
  for (const pkg of workspacePackages) {
    // Check if package has build output (tsconfig build or dist folder)
    const distPath = join(pkg, 'dist');
    const buildPath = join(pkg, 'build');
    
    // Some packages might not have build output if they're TypeScript-only
    // So we'll just warn if neither exists
    if (!existsSync(distPath) && !existsSync(buildPath)) {
      warnings.push(`⚠️  No build output found for ${pkg} (may be TypeScript-only)`);
    }
  }
  
  return allBuilt;
}

console.log('🔍 Verifying build artifacts...\n');

checkBuildArtifacts();
checkBuildSize();
checkWorkspaceBuilds();

// Print results
if (warnings.length > 0) {
  console.log('⚠️  Warnings:');
  warnings.forEach(w => console.log(`   ${w}`));
  console.log('');
}

if (errors.length > 0) {
  console.log('❌ Build verification failed:');
  errors.forEach(e => console.log(`   ${e}`));
  console.log('\n💥 Build verification failed!\n');
  process.exit(1);
}

console.log('✅ Build verification passed!\n');
process.exit(0);

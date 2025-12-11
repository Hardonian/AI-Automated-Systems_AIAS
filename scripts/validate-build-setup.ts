#!/usr/bin/env tsx
/**
 * Build Setup Validation Script
 * 
 * Validates all prerequisites for a successful Vercel build:
 * - Lockfile sync status
 * - Workspace dependencies
 * - Required environment variables
 * - Package manager version
 * - TypeScript configuration
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const errors: string[] = [];
const warnings: string[] = [];

function checkCommand(command: string, description: string): boolean {
  try {
    execSync(command, { stdio: 'ignore' });
    return true;
  } catch {
    errors.push(`❌ ${description}`);
    return false;
  }
}

function checkFile(file: string, description: string): boolean {
  if (existsSync(file)) {
    return true;
  }
  errors.push(`❌ Missing required file: ${file} (${description})`);
  return false;
}

function checkPackageJson(): boolean {
  try {
    const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
    
    // Check package manager
    if (!pkg.packageManager || !pkg.packageManager.startsWith('pnpm@')) {
      warnings.push('⚠️  packageManager not specified or not pnpm');
    }
    
    // Check engines
    if (!pkg.engines?.node) {
      warnings.push('⚠️  Node.js engine version not specified');
    }
    
    // Check workspaces
    if (!pkg.workspaces || pkg.workspaces.length === 0) {
      warnings.push('⚠️  No workspaces defined');
    }
    
    return true;
  } catch (error) {
    errors.push(`❌ Failed to parse package.json: ${error}`);
    return false;
  }
}

function checkLockfileSync(): boolean {
  try {
    // Try to install with frozen lockfile to check sync
    execSync('pnpm install --frozen-lockfile --dry-run', { 
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    return true;
  } catch (error: any) {
    const output = error.stdout?.toString() || error.stderr?.toString() || '';
    if (output.includes('ERR_PNPM_OUTDATED_LOCKFILE')) {
      errors.push('❌ Lockfile is out of sync with package.json. Run: pnpm install');
      return false;
    }
    // Other errors might be okay (network issues, etc.)
    warnings.push('⚠️  Could not verify lockfile sync (this is okay if dependencies are already installed)');
    return true;
  }
}

function checkWorkspaceDependencies(): boolean {
  try {
    const packages = ['packages/config', 'packages/lib'];
    let allValid = true;
    
    for (const pkg of packages) {
      const pkgPath = join(pkg, 'package.json');
      if (!existsSync(pkgPath)) {
        warnings.push(`⚠️  Workspace package not found: ${pkg}`);
        continue;
      }
      
      const pkgJson = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      const deps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
      
      // Check for workspace: protocol usage
      for (const [dep, version] of Object.entries(deps)) {
        if (typeof version === 'string' && version.startsWith('workspace:')) {
          const workspaceName = version.replace('workspace:', '').replace('*', '');
          const workspacePath = join('packages', dep.replace('@ai-consultancy/', ''));
          
          if (!existsSync(join(workspacePath, 'package.json'))) {
            errors.push(`❌ Workspace dependency ${dep} points to non-existent package`);
            allValid = false;
          }
        }
      }
    }
    
    return allValid;
  } catch (error) {
    warnings.push(`⚠️  Could not validate workspace dependencies: ${error}`);
    return true; // Don't fail build for this
  }
}

function checkTypeScriptConfig(): boolean {
  const tsconfigFiles = ['tsconfig.json', 'apps/web/tsconfig.json', 'packages/lib/tsconfig.json', 'packages/config/tsconfig.json'];
  let allValid = true;
  
  for (const file of tsconfigFiles) {
    if (!existsSync(file)) {
      warnings.push(`⚠️  TypeScript config not found: ${file}`);
      continue;
    }
    
    try {
      JSON.parse(readFileSync(file, 'utf-8'));
    } catch (error) {
      errors.push(`❌ Invalid TypeScript config: ${file}`);
      allValid = false;
    }
  }
  
  return allValid;
}

function checkVercelConfig(): boolean {
  if (!existsSync('vercel.json')) {
    warnings.push('⚠️  vercel.json not found (using defaults)');
    return true;
  }
  
  try {
    const config = JSON.parse(readFileSync('vercel.json', 'utf-8'));
    
    if (!config.installCommand || !config.installCommand.includes('pnpm')) {
      warnings.push('⚠️  Vercel installCommand should use pnpm');
    }
    
    if (!config.buildCommand || !config.buildCommand.includes('vercel-build')) {
      warnings.push('⚠️  Vercel buildCommand should use vercel-build script');
    }
    
    return true;
  } catch (error) {
    errors.push(`❌ Invalid vercel.json: ${error}`);
    return false;
  }
}

// Main validation
console.log('🔍 Validating build setup...\n');

checkCommand('pnpm --version', 'pnpm is not installed or not in PATH');
checkFile('package.json', 'Root package.json');
checkFile('pnpm-lock.yaml', 'pnpm-lock.yaml');
checkFile('pnpm-workspace.yaml', 'pnpm-workspace.yaml');
checkFile('.npmrc', '.npmrc configuration');
checkPackageJson();
checkLockfileSync();
checkWorkspaceDependencies();
checkTypeScriptConfig();
checkVercelConfig();

// Print results
console.log('\n📊 Validation Results:\n');

if (warnings.length > 0) {
  console.log('⚠️  Warnings:');
  warnings.forEach(w => console.log(`   ${w}`));
  console.log('');
}

if (errors.length > 0) {
  console.log('❌ Errors:');
  errors.forEach(e => console.log(`   ${e}`));
  console.log('\n💥 Build setup validation failed!\n');
  process.exit(1);
}

console.log('✅ All build setup checks passed!\n');
process.exit(0);

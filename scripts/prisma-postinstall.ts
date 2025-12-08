/**
 * Prisma Postinstall Hook
 * 
 * Optimized Prisma client generation for Vercel builds.
 * Only runs prisma generate if necessary and guards against
 * running in incompatible environments.
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const isVercel = process.env.VERCEL === '1';
const isCI = process.env.CI === 'true' || isVercel;
const skipPrisma = process.env.SKIP_PRISMA_GENERATE === 'true';

// Check if we're in a build environment where Prisma should run
const shouldRunPrisma = () => {
  if (skipPrisma) {
    console.log('⏭️  Skipping Prisma generate (SKIP_PRISMA_GENERATE=true)');
    return false;
  }

  // In Vercel/CI, always try to generate
  if (isCI) {
    return true;
  }

  // In local development, check if schema exists
  const schemaPath = join(process.cwd(), 'apps/web/prisma/schema.prisma');
  if (!existsSync(schemaPath)) {
    console.log('⏭️  Skipping Prisma generate (schema.prisma not found)');
    return false;
  }

  return true;
};

// Check if Prisma client is already generated
const isPrismaGenerated = () => {
  try {
    const clientPath = join(process.cwd(), 'node_modules/.prisma/client/index.js');
    return existsSync(clientPath);
  } catch {
    return false;
  }
};

try {
  if (!shouldRunPrisma()) {
    process.exit(0);
  }

  // Check if already generated (skip if exists and not in CI)
  if (!isCI && isPrismaGenerated()) {
    console.log('✓ Prisma client already generated');
    process.exit(0);
  }

  console.log('🔄 Generating Prisma client...');
  
  // Use NODE_OPTIONS to prevent memory issues
  const nodeOptions = process.env.NODE_OPTIONS || '--max-old-space-size=4096';
  process.env.NODE_OPTIONS = nodeOptions;

  // Run prisma generate with error handling
  try {
    execSync('npx prisma generate', {
      stdio: 'inherit',
      cwd: join(process.cwd(), 'apps/web'),
      env: {
        ...process.env,
        NODE_OPTIONS: nodeOptions,
      },
    });
    console.log('✓ Prisma client generated successfully');
    process.exit(0);
  } catch (error) {
    // In CI/Vercel, fail the build
    if (isCI) {
      console.error('❌ Prisma generate failed in CI environment');
      process.exit(1);
    }
    
    // In local development, warn but don't fail
    console.warn('⚠️  Prisma generate failed (non-blocking in local dev)');
    console.warn(error instanceof Error ? error.message : String(error));
    process.exit(0);
  }
} catch (error) {
  console.error('Error in Prisma postinstall hook:', error);
  // Don't fail the build if postinstall hook fails
  process.exit(0);
}

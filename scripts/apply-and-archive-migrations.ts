#!/usr/bin/env tsx
/**
 * Apply and Archive Migrations
 * Applies unmigrated migrations via GitHub Actions, then archives them
 */

import { execSync } from 'child_process';
import { existsSync, readdirSync, renameSync, mkdirSync } from 'fs';
import { join } from 'path';

const MIGRATIONS_DIR = join(process.cwd(), 'supabase', 'migrations');
const ARCHIVE_DIR = join(process.cwd(), 'supabase', 'migrations_archive');

// Unmigrated migrations that need to be applied
const UNMIGRATED_MIGRATIONS = [
  '20250130000000_agents_and_workflows.sql',
  '20250130000001_billing_and_usage.sql',
  '20250130000002_observability.sql',
];

async function triggerMigrationWorkflow() {
  console.log('\n🚀 Triggering Migration Workflow\n');
  console.log('='.repeat(60));

  try {
    // Check if gh CLI is available
    try {
      execSync('gh --version', { stdio: 'ignore' });
    } catch {
      console.log('⚠️  GitHub CLI (gh) not found.');
      console.log('\n📋 To apply migrations manually:\n');
      console.log('1. Go to: https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/apply-migrations.yml');
      console.log('2. Click "Run workflow"');
      console.log('3. Type "apply" in confirmation field');
      console.log('4. Click "Run workflow"');
      console.log('\n5. After migrations complete, run: pnpm run migrate:archive\n');
      return false;
    }

    console.log('✅ GitHub CLI found\n');
    console.log('📋 Triggering workflow: apply-migrations.yml\n');

    execSync('gh workflow run apply-migrations.yml -f confirm=apply', {
      stdio: 'inherit',
    });

    console.log('\n✅ Workflow triggered successfully!');
    console.log('\n⏳ Waiting for workflow to complete...');
    console.log('   (This may take a few minutes)\n');
    
    // Wait a bit and check status
    console.log('📊 Monitor progress at:');
    console.log('   https://github.com/YOUR_ORG/YOUR_REPO/actions\n');
    
    return true;
  } catch (error: any) {
    console.error('\n❌ Failed to trigger workflow:', error.message);
    console.log('\n💡 Alternative: Trigger manually via GitHub Actions UI\n');
    return false;
  }
}

function archiveAppliedMigrations() {
  console.log('\n📦 Archiving Applied Migrations\n');
  console.log('='.repeat(60));

  // Create archive directory if it doesn't exist
  if (!existsSync(ARCHIVE_DIR)) {
    mkdirSync(ARCHIVE_DIR, { recursive: true });
    console.log(`✅ Created archive directory: ${ARCHIVE_DIR}\n`);
  }

  // Get current migrations
  const currentMigrations = readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`📋 Found ${currentMigrations.length} migrations in migrations directory\n`);

  // Archive the unmigrated migrations (assuming they've been applied)
  let archivedCount = 0;
  let errorCount = 0;

  for (const migration of UNMIGRATED_MIGRATIONS) {
    const sourcePath = join(MIGRATIONS_DIR, migration);
    const destPath = join(ARCHIVE_DIR, migration);

    if (existsSync(sourcePath)) {
      try {
        renameSync(sourcePath, destPath);
        console.log(`✅ Archived: ${migration}`);
        archivedCount++;
      } catch (error: any) {
        console.error(`❌ Failed to archive ${migration}: ${error.message}`);
        errorCount++;
      }
    } else {
      console.log(`⏭️  Skipped (not found): ${migration}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Successfully archived ${archivedCount} migrations`);
  if (errorCount > 0) {
    console.log(`❌ Failed to archive ${errorCount} migrations`);
  }
  console.log(`\n📁 Remaining migrations: ${readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql')).length}`);
  console.log(`📦 Total archived: ${readdirSync(ARCHIVE_DIR).filter(f => f.endsWith('.sql')).length}\n`);
}

async function main() {
  console.log('\n🚀 Apply and Archive Migrations\n');
  console.log('='.repeat(60));
  console.log('\nThis script will:');
  console.log('1. Trigger GitHub Actions to apply migrations');
  console.log('2. Archive the applied migrations\n');

  // Step 1: Trigger migration workflow
  const triggered = await triggerMigrationWorkflow();

  if (triggered) {
    console.log('\n⏳ Please wait for migrations to complete in GitHub Actions.');
    console.log('   Then run: pnpm run migrate:archive\n');
    console.log('Or if migrations are already applied, archive them now:\n');
    
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question('Archive migrations now? (y/n): ', (answer: string) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        archiveAppliedMigrations();
      } else {
        console.log('\n💡 Run "pnpm run migrate:archive" later to archive migrations.\n');
      }
      readline.close();
    });
  } else {
    // If workflow wasn't triggered, ask if migrations are already applied
    console.log('\n💡 If migrations are already applied, archive them now:\n');
    archiveAppliedMigrations();
  }
}

// Allow direct archiving without workflow trigger
if (process.argv.includes('--archive-only')) {
  archiveAppliedMigrations();
} else {
  main().catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
}

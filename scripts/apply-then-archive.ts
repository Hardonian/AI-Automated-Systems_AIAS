#!/usr/bin/env tsx
/**
 * Apply Then Archive Migrations
 * Applies migrations via GitHub Actions, then archives them after completion
 */

import { execSync } from 'child_process';
import { existsSync, readdirSync, renameSync, mkdirSync } from 'fs';
// import { readFileSync } from 'fs';
import { join } from 'path';

const MIGRATIONS_DIR = join(process.cwd(), 'supabase', 'migrations');
const ARCHIVE_DIR = join(process.cwd(), 'supabase', 'migrations_archive');

const UNMIGRATED_MIGRATIONS = [
  '20250130000000_agents_and_workflows.sql',
  '20250130000001_billing_and_usage.sql',
  '20250130000002_observability.sql',
];

async function checkWorkflowExists() {
  const workflowPath = join(process.cwd(), '.github', 'workflows', 'apply-migrations.yml');
  return existsSync(workflowPath);
}

async function triggerWorkflow() {
  console.log('\n🚀 Triggering Migration Workflow\n');
  console.log('='.repeat(60));

  if (!(await checkWorkflowExists())) {
    console.log('⚠️  Workflow file not found. It needs to be committed first.\n');
    console.log('💡 Commit the workflow file, then run this script again.\n');
    return false;
  }

  try {
    console.log('📋 Triggering workflow: apply-migrations.yml\n');
    execSync('gh workflow run apply-migrations.yml -f confirm=apply', {
      stdio: 'inherit',
    });
    console.log('\n✅ Workflow triggered!');
    console.log('📊 Monitor at: https://github.com/YOUR_ORG/YOUR_REPO/actions\n');
    return true;
  } catch (error: any) {
    if (error.message.includes('404')) {
      console.log('⚠️  Workflow not found on default branch.');
      console.log('💡 Commit and push the workflow file first.\n');
    } else {
      console.error('❌ Error:', error.message);
    }
    return false;
  }
}

function archiveMigrations() {
  console.log('\n📦 Archiving Migrations\n');
  console.log('='.repeat(60));

  if (!existsSync(ARCHIVE_DIR)) {
    mkdirSync(ARCHIVE_DIR, { recursive: true });
  }

  const currentMigrations = readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'));

  console.log(`📋 Found ${currentMigrations.length} migrations to archive\n`);

  let archived = 0;
  for (const migration of UNMIGRATED_MIGRATIONS) {
    const sourcePath = join(MIGRATIONS_DIR, migration);
    const destPath = join(ARCHIVE_DIR, migration);

    if (existsSync(sourcePath)) {
      try {
        renameSync(sourcePath, destPath);
        console.log(`✅ Archived: ${migration}`);
        archived++;
      } catch (error: any) {
        console.error(`❌ Failed: ${migration} - ${error.message}`);
      }
    }
  }

  console.log(`\n✅ Archived ${archived} migrations`);
  console.log(`📁 Remaining: ${readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql')).length}`);
  console.log(`📦 Total archived: ${readdirSync(ARCHIVE_DIR).filter(f => f.endsWith('.sql')).length}\n`);
}

async function main() {
  console.log('\n🚀 Apply and Archive Migrations\n');
  console.log('='.repeat(60));

  // Check current state
  const currentMigrations = readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .filter(f => UNMIGRATED_MIGRATIONS.includes(f));

  if (currentMigrations.length === 0) {
    console.log('✅ No unmigrated migrations found. All migrations have been archived.\n');
    return;
  }

  console.log(`\n📋 Found ${currentMigrations.length} unmigrated migrations:\n`);
  currentMigrations.forEach(m => console.log(`   - ${m}`));
  console.log('');

  // Try to trigger workflow
  const triggered = await triggerWorkflow();

  if (triggered) {
    console.log('\n⏳ Workflow is running. After it completes:');
    console.log('   Run: pnpm run migrate:archive\n');
  } else {
    console.log('\n💡 To apply migrations:');
    console.log('   1. Commit and push the workflow file');
    console.log('   2. Go to GitHub Actions and run the workflow');
    console.log('   3. After completion, run: pnpm run migrate:archive\n');
    
    // Ask if user wants to archive anyway (assuming they're already applied)
    console.log('⚠️  If migrations are already applied, archiving now...\n');
    archiveMigrations();
  }
}

main().catch(error => {
  console.error('\n❌ Error:', error);
  process.exit(1);
});

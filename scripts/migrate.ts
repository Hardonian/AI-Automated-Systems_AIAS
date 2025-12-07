#!/usr/bin/env tsx
/**
 * Migrate Database
 * Triggers GitHub Actions workflow to apply migrations using GitHub secrets
 * 
 * Usage: pnpm tsx scripts/migrate.ts
 */

import { execSync } from 'child_process';

async function triggerMigration() {
  console.log('\n🚀 Triggering Migration via GitHub Actions\n');
  console.log('='.repeat(60));

  try {
    // Check if gh CLI is available
    try {
      execSync('gh --version', { stdio: 'ignore' });
    } catch {
      console.log('⚠️  GitHub CLI (gh) not found.');
      console.log('\nTo apply migrations, use one of these methods:\n');
      console.log('Method 1: GitHub Actions (Recommended)');
      console.log('  1. Go to: https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/apply-migrations.yml');
      console.log('  2. Click "Run workflow"');
      console.log('  3. Type "apply" in the confirmation field');
      console.log('  4. Click "Run workflow"\n');
      console.log('Method 2: GitHub CLI');
      console.log('  gh workflow run apply-migrations.yml -f confirm=apply\n');
      console.log('Method 3: Manual via Supabase CLI');
      console.log('  export SUPABASE_PROJECT_REF="your-project-ref"');
      console.log('  export SUPABASE_ACCESS_TOKEN="your-access-token"');
      console.log('  pnpm exec supabase link --project-ref $SUPABASE_PROJECT_REF');
      console.log('  pnpm exec supabase db push\n');
      return;
    }

    console.log('✅ GitHub CLI found\n');
    console.log('📋 Triggering workflow: apply-migrations.yml\n');

    execSync('gh workflow run apply-migrations.yml -f confirm=apply', {
      stdio: 'inherit',
    });

    console.log('\n✅ Workflow triggered successfully!');
    console.log('\n📊 Monitor progress at:');
    console.log('   https://github.com/YOUR_ORG/YOUR_REPO/actions\n');
  } catch (error: any) {
    console.error('\n❌ Failed to trigger workflow:', error.message);
    console.log('\n💡 Make sure you are:');
    console.log('  1. Authenticated with GitHub CLI: gh auth login');
    console.log('  2. Have permission to trigger workflows');
    console.log('  3. In the correct repository\n');
  }
}

triggerMigration();

#!/usr/bin/env tsx
/**
 * Auto-Apply Migrations
 * Automatically applies migrations using GitHub secrets or environment variables
 * This script is designed to work in CI/CD environments where credentials are available
 */

import { execSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

const MIGRATIONS_DIR = join(process.cwd(), 'supabase', 'migrations');

// Check multiple environment variable sources
const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 
                              process.env.VITE_SUPABASE_PROJECT_ID?.replace(/"/g, '') ||
                              process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF ||
                              process.env.GITHUB_SUPABASE_PROJECT_REF;

const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || 
                              process.env.SUPABASE_TOKEN ||
                              process.env.GITHUB_SUPABASE_TOKEN;

async function applyMigrations() {
  console.log('\n🚀 Auto-Applying Migrations\n');
  console.log('='.repeat(60));

  // Check for migrations
  if (!existsSync(MIGRATIONS_DIR)) {
    console.error('❌ Migrations directory not found:', MIGRATIONS_DIR);
    process.exit(1);
  }

  const migrations = readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`📋 Found ${migrations.length} migration files:\n`);
  migrations.forEach(m => console.log(`   - ${m}`));
  console.log('');

  // Check credentials
  if (!SUPABASE_PROJECT_REF) {
    console.error('❌ SUPABASE_PROJECT_REF not found in environment variables.');
    console.log('\nChecked variables:');
    console.log('  - SUPABASE_PROJECT_REF');
    console.log('  - VITE_SUPABASE_PROJECT_ID');
    console.log('  - NEXT_PUBLIC_SUPABASE_PROJECT_REF');
    console.log('  - GITHUB_SUPABASE_PROJECT_REF');
    console.log('\n💡 In GitHub Actions, these are typically set as secrets.');
    process.exit(1);
  }

  if (!SUPABASE_ACCESS_TOKEN) {
    console.error('❌ SUPABASE_ACCESS_TOKEN not found in environment variables.');
    console.log('\nChecked variables:');
    console.log('  - SUPABASE_ACCESS_TOKEN');
    console.log('  - SUPABASE_TOKEN');
    console.log('  - GITHUB_SUPABASE_TOKEN');
    console.log('\n💡 In GitHub Actions, these are typically set as secrets.');
    process.exit(1);
  }

  console.log(`✅ Found SUPABASE_PROJECT_REF: ${SUPABASE_PROJECT_REF.substring(0, 8)}...`);
  console.log(`✅ Found SUPABASE_ACCESS_TOKEN: ${SUPABASE_ACCESS_TOKEN.substring(0, 8)}...`);
  console.log('');

  try {
    // Link to Supabase project
    console.log('🔗 Linking to Supabase project...\n');
    try {
      execSync(
        `pnpm exec supabase link --project-ref ${SUPABASE_PROJECT_REF} --token ${SUPABASE_ACCESS_TOKEN}`,
        { 
          stdio: 'inherit',
          env: {
            ...process.env,
            SUPABASE_PROJECT_REF,
            SUPABASE_ACCESS_TOKEN,
          },
        }
      );
      console.log('✅ Project linked successfully\n');
    } catch (error: any) {
      if (error.message.includes('already linked')) {
        console.log('✅ Project already linked\n');
      } else {
        throw error;
      }
    }

    // Apply migrations
    console.log('📦 Applying migrations...\n');
    execSync(
      'pnpm exec supabase db push',
      {
        stdio: 'inherit',
        env: {
          ...process.env,
          SUPABASE_PROJECT_REF,
          SUPABASE_ACCESS_TOKEN,
        },
      }
    );

    console.log('\n' + '='.repeat(60));
    console.log('✅ Migrations applied successfully!\n');
    return true;
  } catch (error: any) {
    console.error('\n❌ Failed to apply migrations:', error.message);
    console.log('\nTroubleshooting:');
    console.log('  1. Verify credentials are correct');
    console.log('  2. Check Supabase project is accessible');
    console.log('  3. Ensure migrations are valid SQL');
    console.log('  4. Check for conflicting migrations\n');
    process.exit(1);
  }
}

applyMigrations();

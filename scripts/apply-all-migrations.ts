#!/usr/bin/env tsx
/**
 * Apply All Migrations
 * Validates and applies all Supabase migrations
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const MIGRATIONS_DIR = join(process.cwd(), 'supabase', 'migrations');
const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF;
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const SUPABASE_DB_URL = process.env.SUPABASE_DB_URL;

interface MigrationFile {
  name: string;
  path: string;
  timestamp: string;
}

function getMigrationFiles(): MigrationFile[] {
  if (!existsSync(MIGRATIONS_DIR)) {
    console.error('❌ Migrations directory not found:', MIGRATIONS_DIR);
    process.exit(1);
  }

  const files = readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .map(f => ({
      name: f,
      path: join(MIGRATIONS_DIR, f),
      timestamp: f.replace('.sql', '').replace(/[^0-9]/g, ''),
    }))
    .sort((a, b) => {
      const aTime = a.timestamp.padStart(20, '0');
      const bTime = b.timestamp.padStart(20, '0');
      return aTime.localeCompare(bTime);
    });

  return files;
}

function validateMigration(migrationPath: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  try {
    const content = readFileSync(migrationPath, 'utf-8');
    
    // Basic SQL validation
    if (!content.trim()) {
      errors.push('Migration file is empty');
    }
    
    // Check for common SQL issues
    if (content.includes('CREATE TABLE IF NOT EXISTS') && content.includes('CREATE TABLE')) {
      // This is fine, but we note it
    }
    
    return { valid: errors.length === 0, errors };
  } catch (error: any) {
    errors.push(`Failed to read file: ${error.message}`);
    return { valid: false, errors };
  }
}

async function applyViaSupabaseCLI(): Promise<boolean> {
  console.log('\n🔄 Attempting to apply migrations via Supabase CLI...\n');

  if (!SUPABASE_PROJECT_REF) {
    console.log('⚠️  SUPABASE_PROJECT_REF not set. Skipping Supabase CLI method.');
    return false;
  }

  try {
    // Link project if needed
    if (SUPABASE_ACCESS_TOKEN) {
      try {
        console.log('🔗 Linking Supabase project...');
        execSync(
          `pnpm exec supabase link --project-ref ${SUPABASE_PROJECT_REF} ${SUPABASE_ACCESS_TOKEN ? `--token ${SUPABASE_ACCESS_TOKEN}` : ''}`,
          { stdio: 'inherit' }
        );
      } catch (error: any) {
        if (!error.message.includes('already linked')) {
          console.log('⚠️  Could not link project (may already be linked)');
        }
      }
    }

    // Apply migrations
    console.log('\n📦 Applying migrations...\n');
    execSync('pnpm exec supabase db push', {
      stdio: 'inherit',
      env: {
        ...process.env,
        SUPABASE_PROJECT_REF,
        ...(SUPABASE_ACCESS_TOKEN && { SUPABASE_ACCESS_TOKEN }),
      },
    });

    console.log('\n✅ Migrations applied successfully via Supabase CLI!\n');
    return true;
  } catch (error: any) {
    console.log('\n⚠️  Supabase CLI method failed:', error.message);
    return false;
  }
}

async function applyViaDirectScript(): Promise<boolean> {
  console.log('\n🔄 Attempting to apply migrations via direct script...\n');

  if (!SUPABASE_DB_URL) {
    console.log('⚠️  SUPABASE_DB_URL not set. Skipping direct script method.');
    return false;
  }

  try {
    execSync('pnpm run migrate:apply', {
      stdio: 'inherit',
      env: {
        ...process.env,
        SUPABASE_DB_URL,
      },
    });

    console.log('\n✅ Migrations applied successfully via direct script!\n');
    return true;
  } catch (error: any) {
    console.log('\n⚠️  Direct script method failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('\n🚀 Apply All Migrations\n');
  console.log('='.repeat(60));

  // Get all migration files
  const migrationFiles = getMigrationFiles();
  console.log(`📋 Found ${migrationFiles.length} migration files\n`);

  // Validate all migrations
  console.log('🔍 Validating migrations...\n');
  let allValid = true;
  const newMigrations = [
    '20250130000000_agents_and_workflows.sql',
    '20250130000001_billing_and_usage.sql',
    '20250130000002_observability.sql',
  ];

  for (const migration of migrationFiles) {
    const validation = validateMigration(migration.path);
    const isNew = newMigrations.includes(migration.name);
    
    if (!validation.valid) {
      console.log(`❌ ${migration.name}: ${validation.errors.join(', ')}`);
      allValid = false;
    } else if (isNew) {
      console.log(`✅ ${migration.name} (NEW)`);
    } else {
      console.log(`✅ ${migration.name}`);
    }
  }

  if (!allValid) {
    console.error('\n❌ Some migrations failed validation. Please fix them before applying.\n');
    process.exit(1);
  }

  console.log('\n✅ All migrations validated successfully!\n');

  // Try to apply migrations
  let applied = false;

  // Method 1: Try Supabase CLI
  if (SUPABASE_PROJECT_REF) {
    applied = await applyViaSupabaseCLI();
  }

  // Method 2: Try direct script if CLI failed
  if (!applied && SUPABASE_DB_URL) {
    applied = await applyViaDirectScript();
  }

  if (!applied) {
    console.log('\n' + '='.repeat(60));
    console.log('⚠️  Could not apply migrations automatically.');
    console.log('\nTo apply migrations manually, use one of these methods:\n');
    console.log('Method 1: Supabase CLI');
    console.log('  export SUPABASE_PROJECT_REF="your-project-ref"');
    console.log('  export SUPABASE_ACCESS_TOKEN="your-access-token"');
    console.log('  pnpm exec supabase link --project-ref $SUPABASE_PROJECT_REF');
    console.log('  pnpm exec supabase db push\n');
    console.log('Method 2: Direct Database Connection');
    console.log('  export SUPABASE_DB_URL="postgresql://user:pass@host:5432/dbname"');
    console.log('  pnpm run migrate:apply\n');
    console.log('Method 3: Manual Application');
    console.log('  Apply each migration file in order from:');
    console.log(`  ${MIGRATIONS_DIR}\n`);
    console.log('New migrations to apply:');
    newMigrations.forEach(m => console.log(`  - ${m}`));
    console.log('');
  } else {
    console.log('\n' + '='.repeat(60));
    console.log('✅ Migration process completed!\n');
  }
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

#!/usr/bin/env tsx
/**
 * Archive Migrated/Redundant Migrations
 * Moves all migrations except the 3 new unmigrated ones to archive
 */

import { readdirSync, renameSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const MIGRATIONS_DIR = join(process.cwd(), 'supabase', 'migrations');
const ARCHIVE_DIR = join(process.cwd(), 'supabase', 'migrations_archive');

// Unmigrated migrations to keep
const UNMIGRATED_MIGRATIONS = [
  '20250130000000_agents_and_workflows.sql',
  '20250130000001_billing_and_usage.sql',
  '20250130000002_observability.sql',
];

function archiveMigrations() {
  console.log('\n📦 Archiving Migrated/Redundant Migrations\n');
  console.log('='.repeat(60));

  // Create archive directory if it doesn't exist
  if (!existsSync(ARCHIVE_DIR)) {
    mkdirSync(ARCHIVE_DIR, { recursive: true });
    console.log(`✅ Created archive directory: ${ARCHIVE_DIR}\n`);
  }

  // Get all migration files
  const allMigrations = readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`📋 Found ${allMigrations.length} total migration files\n`);

  // Separate migrations to keep vs archive
  const migrationsToKeep: string[] = [];
  const migrationsToArchive: string[] = [];

  for (const migration of allMigrations) {
    if (UNMIGRATED_MIGRATIONS.includes(migration)) {
      migrationsToKeep.push(migration);
    } else {
      migrationsToArchive.push(migration);
    }
  }

  console.log(`✅ Migrations to keep (${migrationsToKeep.length}):`);
  migrationsToKeep.forEach(m => console.log(`   - ${m}`));
  console.log('');

  console.log(`📦 Migrations to archive (${migrationsToArchive.length}):`);
  migrationsToArchive.forEach(m => console.log(`   - ${m}`));
  console.log('');

  // Archive migrations
  let archivedCount = 0;
  let errorCount = 0;

  for (const migration of migrationsToArchive) {
    try {
      const sourcePath = join(MIGRATIONS_DIR, migration);
      const destPath = join(ARCHIVE_DIR, migration);
      
      renameSync(sourcePath, destPath);
      console.log(`✅ Archived: ${migration}`);
      archivedCount++;
    } catch (error: any) {
      console.error(`❌ Failed to archive ${migration}: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n${  '='.repeat(60)}`);
  console.log(`✅ Successfully archived ${archivedCount} migrations`);
  if (errorCount > 0) {
    console.log(`❌ Failed to archive ${errorCount} migrations`);
  }
  console.log(`\n📁 Remaining migrations in: ${MIGRATIONS_DIR}`);
  console.log(`📦 Archived migrations in: ${ARCHIVE_DIR}\n`);
}

archiveMigrations();

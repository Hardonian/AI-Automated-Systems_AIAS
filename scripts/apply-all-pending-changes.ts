#!/usr/bin/env tsx
/**
 * Apply all pending changes:
 * 1. Apply all Supabase migrations
 * 2. Check for missing GitHub Actions workflows
 * 3. Run scripts flagged for manual execution
 */

import { execSync } from 'child_process';
import { readdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

const SUPABASE_PROJECT_REF =
  process.env.SUPABASE_PROJECT_REF ||
  process.env.VITE_SUPABASE_PROJECT_ID?.replace(/"/g, '');
const { SUPABASE_ACCESS_TOKEN } = process.env;
const MIGRATIONS_DIR = join(process.cwd(), 'supabase', 'migrations');
const WORKFLOWS_DIR = join(process.cwd(), '.github', 'workflows');

interface ScriptInfo {
  path: string;
  name: string;
  needsManualRun: boolean;
  hasWorkflow: boolean;
}

async function applySupabaseMigrations() {
  console.log('\n📦 Step 1: Applying Supabase Migrations\n');
  console.log('='.repeat(60));

  if (!SUPABASE_PROJECT_REF) {
    console.log(
      '⚠️  SUPABASE_PROJECT_REF not set. Skipping migration application.'
    );
    console.log(
      '   Set SUPABASE_PROJECT_REF or VITE_SUPABASE_PROJECT_ID to apply migrations.\n'
    );
    return false;
  }

  try {
    // Check if migrations directory exists
    if (!existsSync(MIGRATIONS_DIR)) {
      console.log('⚠️  Migrations directory not found. Skipping.\n');
      return false;
    }

    const migrationFiles = readdirSync(MIGRATIONS_DIR).filter(f =>
      f.endsWith('.sql')
    ).length;

    console.log(`📋 Found ${migrationFiles} migration files`);

    // Try to apply migrations via Supabase CLI
    console.log('\n🔄 Attempting to apply migrations via Supabase CLI...\n');

    let command = 'npx supabase db push';

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || 'development',
    };

    if (SUPABASE_PROJECT_REF) {
      env.SUPABASE_PROJECT_REF = SUPABASE_PROJECT_REF;
    }

    if (SUPABASE_ACCESS_TOKEN) {
      env.SUPABASE_ACCESS_TOKEN = SUPABASE_ACCESS_TOKEN;
      command += ` --token ${SUPABASE_ACCESS_TOKEN}`;
    }

    // Try linking first if we have project ref
    if (SUPABASE_PROJECT_REF && SUPABASE_ACCESS_TOKEN) {
      try {
        console.log('🔗 Linking Supabase project...');
        execSync(
          `npx supabase link --project-ref ${SUPABASE_PROJECT_REF} --token ${SUPABASE_ACCESS_TOKEN}`,
          {
            stdio: 'inherit',
            env,
          }
        );
      } catch (error: any) {
        console.log(
          '⚠️  Could not link project (may already be linked or need manual setup)'
        );
      }
    }

    // Apply migrations
    try {
      execSync(command, {
        stdio: 'inherit',
        env,
        cwd: process.cwd(),
      });
      console.log('\n✅ Migrations applied successfully!\n');
      return true;
    } catch (error: any) {
      console.log(
        '\n⚠️  Supabase CLI migration failed. This might be expected if:'
      );
      console.log('   - Migrations are already applied');
      console.log('   - Database connection is not configured');
      console.log('   - Manual intervention is required\n');
      return false;
    }
  } catch (error: any) {
    console.error(`❌ Error applying migrations: ${error.message}\n`);
    return false;
  }
}

function checkForMissingWorkflows() {
  console.log('\n🔍 Step 2: Checking for Missing GitHub Actions Workflows\n');
  console.log('='.repeat(60));

  const scriptsDir = join(process.cwd(), 'scripts');
  const workflowsDir = WORKFLOWS_DIR;

  if (!existsSync(scriptsDir)) {
    console.log('⚠️  Scripts directory not found.\n');
    return;
  }

  if (!existsSync(workflowsDir)) {
    console.log('⚠️  Workflows directory not found.\n');
    return;
  }

  // Find scripts that might need workflows
  const scripts: ScriptInfo[] = [];
  const scriptFiles = readdirSync(scriptsDir, { recursive: true })
    .filter(
      (f): f is string =>
        typeof f === 'string' &&
        (f.endsWith('.ts') || f.endsWith('.js') || f.endsWith('.mjs'))
    )
    .map((f: string) => join(scriptsDir, f));

  for (const scriptPath of scriptFiles) {
    try {
      const content = readFileSync(scriptPath, 'utf-8');
      const scriptName = scriptPath.split('/').pop() || '';

      // Check if script mentions manual running or GitHub Actions
      const needsManualRun =
        /manual|MANUAL|run manually|TODO.*run|FIXME.*run/i.test(content);
      const mentionsWorkflow = /github.*action|workflow|\.github/i.test(
        content
      );

      scripts.push({
        path: scriptPath,
        name: scriptName,
        needsManualRun,
        hasWorkflow: mentionsWorkflow,
      });
    } catch (error) {
      // Skip files we can't read
    }
  }

  // Check existing workflows
  const existingWorkflows = readdirSync(workflowsDir)
    .filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
    .map(f => f.toLowerCase());

  console.log(`📋 Found ${scripts.length} scripts`);
  console.log(`📋 Found ${existingWorkflows.length} existing workflows\n`);

  // Find scripts that need workflows but don't have them
  const scriptsNeedingWorkflows = scripts.filter(
    s => s.needsManualRun && !s.hasWorkflow
  );

  if (scriptsNeedingWorkflows.length > 0) {
    console.log('⚠️  Scripts that may need GitHub Actions workflows:\n');
    scriptsNeedingWorkflows.forEach(s => {
      console.log(`   - ${s.name}`);
      console.log(`     Path: ${s.path}\n`);
    });
  } else {
    console.log('✅ All scripts that need workflows appear to have them.\n');
  }

  return scriptsNeedingWorkflows;
}

function runManualScripts() {
  console.log('\n🚀 Step 3: Running Scripts Flagged for Manual Execution\n');
  console.log('='.repeat(60));

  const scriptsToRun = [
    // Regenerate types after migrations
    {
      name: 'Regenerate Supabase Types',
      command: 'npm run regenerate-types',
      condition: () => true, // Always run after migrations
    },
    {
      name: 'Verify Database',
      command: 'npm run verify:db',
      condition: () => existsSync('scripts/agents/verify_db.ts'),
    },
  ];

  for (const script of scriptsToRun) {
    if (!script.condition()) {
      continue;
    }

    console.log(`\n🔄 Running: ${script.name}`);
    try {
      execSync(script.command, {
        stdio: 'inherit',
        cwd: process.cwd(),
      });
      console.log(`✅ ${script.name} completed successfully\n`);
    } catch (error: any) {
      console.log(`⚠️  ${script.name} failed or skipped: ${error.message}\n`);
    }
  }
}

async function main() {
  console.log('\n🚀 Starting Comprehensive Change Application\n');
  console.log('='.repeat(60));
  console.log(`Project Ref: ${SUPABASE_PROJECT_REF || 'Not set'}`);
  console.log(`Access Token: ${SUPABASE_ACCESS_TOKEN ? 'Set' : 'Not set'}\n`);

  // Step 1: Apply migrations
  const migrationsApplied = await applySupabaseMigrations();

  // Step 2: Check for missing workflows
  const missingWorkflows = checkForMissingWorkflows();

  // Step 3: Run manual scripts (only if migrations were applied)
  if (migrationsApplied) {
    runManualScripts();
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Process Complete!\n');

  if (missingWorkflows && missingWorkflows.length > 0) {
    console.log('📝 Note: Some scripts may need GitHub Actions workflows.');
    console.log('   Review the list above and create workflows as needed.\n');
  }
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

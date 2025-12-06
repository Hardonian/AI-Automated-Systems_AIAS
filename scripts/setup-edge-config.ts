/**
 * Edge Config Setup and Migration Script
 * 
 * This script helps you:
 * 1. Migrate feature flags from featureflags/flags.json to Edge Config
 * 2. Validate Edge Config connection
 * 3. List current Edge Config values
 * 
 * Usage:
 *   pnpm tsx scripts/setup-edge-config.ts migrate    # Migrate flags from file
 *   pnpm tsx scripts/setup-edge-config.ts validate    # Test connection
 *   pnpm tsx scripts/setup-edge-config.ts list        # List all values
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { get } from '@vercel/edge-config';

const EDGE_CONFIG_URL = process.env.EDGE_CONFIG;

if (!EDGE_CONFIG_URL) {
  console.error('❌ EDGE_CONFIG environment variable is not set');
  console.error('');
  console.error('To set up Edge Config:');
  console.error('1. Go to Vercel Dashboard → Your Project → Storage → Edge Config');
  console.error('2. Create a new Edge Config');
  console.error('3. Copy the connection string');
  console.error('4. Add it to your .env.local and Vercel environment variables as EDGE_CONFIG');
  process.exit(1);
}

async function validateConnection() {
  console.log('🔍 Validating Edge Config connection...');
  
  try {
    // Try to read a test key (this will fail if connection is invalid)
    await get('__test__');
    console.log('✅ Edge Config connection is valid!');
    return true;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('EDGE_CONFIG')) {
        console.error('❌ Edge Config connection failed');
        console.error('   Make sure EDGE_CONFIG environment variable is set correctly');
      } else {
        console.error('❌ Error:', error.message);
      }
    }
    return false;
  }
}

async function listValues() {
  console.log('📋 Listing Edge Config values...');
  console.log('');
  console.log('Note: Edge Config API doesn\'t support listing all keys directly.');
  console.log('You can view all values in the Vercel Dashboard:');
  console.log('https://vercel.com/dashboard → Your Project → Storage → Edge Config');
  console.log('');
  
  // Try to get some common keys
  const commonKeys = [
    'feature:trust_audit_enabled',
    'feature:trust_ledger_enabled',
    'feature:trust_scoring_enabled',
    'feature:trust_badges_enabled',
    'feature:trust_verification_enabled',
  ];

  console.log('Checking common feature flags:');
  for (const key of commonKeys) {
    try {
      const value = await get(key);
      console.log(`  ${key}: ${JSON.stringify(value)}`);
    } catch (error) {
      // Key doesn't exist, skip
    }
  }
}

async function migrateFlags() {
  console.log('🔄 Migrating feature flags from file to Edge Config...');
  
  const flagsPath = join(process.cwd(), 'featureflags', 'flags.json');
  
  if (!existsSync(flagsPath)) {
    console.error('❌ Feature flags file not found at:', flagsPath);
    console.error('   Create featureflags/flags.json with your flags first');
    process.exit(1);
  }

  const flagsContent = readFileSync(flagsPath, 'utf-8');
  let flags: Record<string, unknown>;
  
  try {
    flags = JSON.parse(flagsContent);
  } catch (error) {
    console.error('❌ Failed to parse flags.json:', error);
    process.exit(1);
  }

  if (Object.keys(flags).length === 0) {
    console.log('⚠️  flags.json is empty, nothing to migrate');
    return;
  }

  console.log('');
  console.log('📝 Flags to migrate:');
  for (const [key, value] of Object.entries(flags)) {
    console.log(`  feature:${key}: ${JSON.stringify(value)}`);
  }
  console.log('');

  console.log('⚠️  IMPORTANT: Edge Config values must be set manually in the Vercel Dashboard.');
  console.log('');
  console.log('To complete the migration:');
  console.log('1. Go to: https://vercel.com/dashboard → Your Project → Storage → Edge Config');
  console.log('2. Add the following key-value pairs:');
  console.log('');
  
  for (const [key, value] of Object.entries(flags)) {
    console.log(`   Key: feature:${key}`);
    console.log(`   Value: ${JSON.stringify(value)}`);
    console.log('');
  }

  console.log('💡 Tip: You can also use the Vercel CLI:');
  console.log('   vercel env pull .env.local');
  console.log('   # Then use the Vercel Dashboard to set values');
}

async function main() {
  const command = process.argv[2] || 'help';

  switch (command) {
    case 'validate':
      await validateConnection();
      break;
    
    case 'list':
      await validateConnection();
      await listValues();
      break;
    
    case 'migrate':
      await validateConnection();
      await migrateFlags();
      break;
    
    case 'help':
    default:
      console.log('Edge Config Setup Script');
      console.log('');
      console.log('Usage:');
      console.log('  pnpm tsx scripts/setup-edge-config.ts <command>');
      console.log('');
      console.log('Commands:');
      console.log('  validate  - Test Edge Config connection');
      console.log('  list      - List current Edge Config values');
      console.log('  migrate   - Show migration guide for feature flags');
      console.log('  help      - Show this help message');
      break;
  }
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});

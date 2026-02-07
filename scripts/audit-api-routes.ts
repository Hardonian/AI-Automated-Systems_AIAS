#!/usr/bin/env tsx
/**
 * API Route Schema Audit Script
 * Identifies routes that need to be migrated to use standardized schemas
 */

import * as fs from 'fs';
import * as path from 'path';

interface RouteAudit {
  file: string;
  hasCustomSchema: boolean;
  usesRouteHandler: boolean;
  issues: string[];
}

const API_ROUTES_DIR = path.join(process.cwd(), 'app', 'api');
const results: RouteAudit[] = [];

function scanRouteFile(filePath: string): RouteAudit {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues: string[] = [];

  // Check if using standardized route handlers
  const usesRouteHandler =
    content.includes('createRouteHandler') ||
    content.includes('createPOSTHandler') ||
    content.includes('createGETHandler');

  // Check if defining custom Zod schemas
  const hasCustomSchema =
    content.includes('z.object') ||
    content.includes('z.string') ||
    content.includes('z.number');

  // Check if importing from standardized schemas
  const usesStandardizedSchemas = content.includes('@/lib/api/schemas');

  if (!usesRouteHandler && !usesStandardizedSchemas) {
    issues.push('Not using standardized route handlers or schemas');
  }

  if (hasCustomSchema && !usesStandardizedSchemas) {
    issues.push('Defining custom Zod schemas without using standardized ones');
  }

  // Check for proper error handling
  if (!content.includes('handleApiError') && !usesRouteHandler) {
    issues.push('Missing standardized error handling');
  }

  return {
    file: filePath,
    hasCustomSchema,
    usesRouteHandler,
    issues,
  };
}

function scanDirectory(dir: string): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
      results.push(scanRouteFile(fullPath));
    }
  }
}

console.log('🔍 Auditing API routes for schema standardization...\n');

scanDirectory(API_ROUTES_DIR);

// Group results
const compliant = results.filter(r => r.issues.length === 0);
const nonCompliant = results.filter(r => r.issues.length > 0);
const needsRouteHandler = nonCompliant.filter(r => !r.usesRouteHandler);
const needsStandardizedSchemas = nonCompliant.filter(
  r => r.hasCustomSchema && !r.usesRouteHandler
);

console.log(`📊 Audit Results:`);
console.log(`   Total routes: ${results.length}`);
console.log(`   ✅ Compliant: ${compliant.length}`);
console.log(`   ⚠️  Needs migration: ${nonCompliant.length}\n`);

if (needsRouteHandler.length > 0) {
  console.log(
    `📝 Routes not using standardized route handlers (${needsRouteHandler.length}):`
  );
  for (const route of needsRouteHandler) {
    console.log(`   - ${path.relative(process.cwd(), route.file)}`);
    for (const issue of route.issues) {
      console.log(`     • ${issue}`);
    }
  }
  console.log();
}

if (needsStandardizedSchemas.length > 0) {
  console.log(
    `📝 Routes with custom schemas (${needsStandardizedSchemas.length}):`
  );
  for (const route of needsStandardizedSchemas) {
    console.log(`   - ${path.relative(process.cwd(), route.file)}`);
  }
  console.log();
}

console.log('✨ Recommendations:');
console.log(
  '   1. Migrate routes to use createRouteHandler/createPOSTHandler from @/lib/api/route-handler'
);
console.log('   2. Use standardized schemas from @/lib/api/schemas.ts');
console.log('   3. Use handleApiError for consistent error handling');
console.log(
  '   4. Add validateBody option to route handlers for automatic validation\n'
);

// Exit with error if there are non-compliant routes
if (nonCompliant.length > 0) {
  console.log(
    `⚠️  ${nonCompliant.length} routes need migration to use standardized patterns`
  );
  process.exit(1);
} else {
  console.log('✅ All routes are using standardized patterns!');
  process.exit(0);
}

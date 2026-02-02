/**
 * Database Migration Runner (Runtime Router)
 *
 * Provides an edge-safe wrapper that delegates to the Node.js implementation
 * when running in the Node runtime. Edge runtimes receive safe no-op behavior.
 *
 * SERVER-ONLY: This module should never be imported in client components.
 */

import 'server-only';

interface MigrationFile {
  name: string;
  path: string;
  version: string;
}

interface MigrationResult {
  success: boolean;
  applied: number;
  skipped: number;
  failed: number;
  errors: string[];
}

type NodeMigrationModule = typeof import('./migrations.node');

async function loadNodeModule(): Promise<NodeMigrationModule | null> {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return null;
  }
  return import('./migrations.node');
}

export async function getMigrationFiles(): Promise<MigrationFile[]> {
  const nodeModule = await loadNodeModule();
  if (!nodeModule) {
    return [];
  }
  return nodeModule.getMigrationFiles();
}

export async function getAppliedMigrations(dbUrl: string): Promise<string[]> {
  const nodeModule = await loadNodeModule();
  if (!nodeModule) {
    return [];
  }
  return nodeModule.getAppliedMigrations(dbUrl);
}

export async function runMigrationsOnStartup(): Promise<MigrationResult> {
  const nodeModule = await loadNodeModule();
  if (!nodeModule) {
    return { success: true, applied: 0, skipped: 0, failed: 0, errors: [] };
  }
  return nodeModule.runMigrationsOnStartup();
}

export async function runMigrationsInCI(): Promise<MigrationResult> {
  const nodeModule = await loadNodeModule();
  if (!nodeModule) {
    return { success: true, applied: 0, skipped: 0, failed: 0, errors: [] };
  }
  return nodeModule.runMigrationsInCI();
}

export async function validateSchemaAfterMigrations(): Promise<boolean> {
  const nodeModule = await loadNodeModule();
  if (!nodeModule) {
    return false;
  }
  return nodeModule.validateSchemaAfterMigrations();
}

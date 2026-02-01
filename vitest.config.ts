/**
 * Vitest Configuration
 * Test configuration for the AIAS platform
 */

import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['tests/setup/vitest-env.ts'],
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      'node_modules/**',
      '**/node_modules/**',
      'dist/**',
      '.idea/**',
      '.git/**',
      '.cache/**',
      '**/*.d.ts',
      '**/dist/**',
      '**/build/**',
      '.next/**',
      'archive/**',
      '**/apps/web/node_modules/**',
      '**/packages/*/node_modules/**',
    ],
    env: {
      SKIP_ENV_VALIDATION: 'true',
      NODE_ENV: 'test',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/**',
        '**/build/**',
        '**/node_modules/**',
      ],
    },
    // Retry flaky tests once
    retry: 1,
    // Timeout for long-running tests
    testTimeout: 30000,
    // Isolate tests to prevent state leakage
    isolate: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
} as any);

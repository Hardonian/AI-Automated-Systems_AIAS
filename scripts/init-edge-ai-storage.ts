/**
 * Initialize Edge AI Storage Buckets
 * Run this script to create the necessary storage buckets for Edge AI
 */

import { initializeEdgeAIStorage } from '@/lib/edge-ai/storage';
import { logger } from '@/lib/logging/structured-logger';

async function main() {
  try {
    logger.info('Initializing Edge AI storage buckets...');
    await initializeEdgeAIStorage();
    logger.info('Edge AI storage buckets initialized successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Failed to initialize Edge AI storage', error instanceof Error ? error : new Error(String(error)));
    process.exit(1);
  }
}

main();

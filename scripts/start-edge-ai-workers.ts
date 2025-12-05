/**
 * Start Edge AI Queue Workers
 * Run this script to start background workers for optimization and benchmarking
 */

import { startEdgeAIWorkers } from '@/lib/edge-ai/queue';
import { logger } from '@/lib/logging/structured-logger';

async function main() {
  try {
    logger.info('Starting Edge AI queue workers...');
    startEdgeAIWorkers();
    logger.info('Edge AI queue workers started successfully');
    
    // Keep process alive
    process.on('SIGTERM', () => {
      logger.info('Received SIGTERM, shutting down gracefully...');
      process.exit(0);
    });
    
    process.on('SIGINT', () => {
      logger.info('Received SIGINT, shutting down gracefully...');
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to start Edge AI workers', error instanceof Error ? error : new Error(String(error)));
    process.exit(1);
  }
}

main();

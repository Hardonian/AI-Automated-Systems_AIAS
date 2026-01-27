/**
 * Edge AI Job Queue Integration
 * Handles background processing for optimization and benchmarking jobs
 */

import { createClient } from '@supabase/supabase-js';
import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

import { processOptimizationJob, processBenchmarkJob } from './optimization-engine';

import { env } from '@/lib/env';
import { logger } from '@/lib/logging/structured-logger';


// Redis connection (use existing or create new)
const getRedisConnection = () => {
  const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL || 'redis://localhost:6379';
  return new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
  });
};

const connection = getRedisConnection();

// Queue definitions
export const edgeAIOptimizationQueue = new Queue('edge-ai:optimization', { connection });
export const edgeAIBenchmarkQueue = new Queue('edge-ai:benchmark', { connection });

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);

// Job types
export interface EdgeAIOptimizationJobData {
  jobId: string;
  userId: string;
  modelId: string;
  deviceProfileId: string;
  targetFormat: string;
  quantizationType?: string;
  optimizationLevel: string;
  additionalConfig?: Record<string, unknown>;
}

export interface EdgeAIBenchmarkJobData {
  benchmarkId: string;
  userId: string;
  modelId?: string;
  optimizationJobId?: string;
  deviceProfileId: string;
  batchSize: number;
  numIterations: number;
  warmupIterations: number;
  testDatasetPath?: string;
}

/**
 * Add optimization job to queue
 */
export async function queueOptimizationJob(data: EdgeAIOptimizationJobData): Promise<void> {
  try {
    await edgeAIOptimizationQueue.add(
      'optimize-model',
      data,
      {
        jobId: data.jobId,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: {
          age: 24 * 3600, // Keep for 24 hours
          count: 1000, // Keep last 1000 jobs
        },
        removeOnFail: {
          age: 7 * 24 * 3600, // Keep failed jobs for 7 days
        },
      }
    );

    logger.info('Optimization job queued', {
      jobId: data.jobId,
      userId: data.userId,
      modelId: data.modelId,
    });
  } catch (error) {
    logger.error('Failed to queue optimization job', error instanceof Error ? error : new Error(String(error)), {
      jobId: data.jobId,
    });
    throw error;
  }
}

/**
 * Add benchmark job to queue
 */
export async function queueBenchmarkJob(data: EdgeAIBenchmarkJobData): Promise<void> {
  try {
    await edgeAIBenchmarkQueue.add(
      'benchmark-model',
      data,
      {
        jobId: data.benchmarkId,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: {
          age: 24 * 3600,
          count: 1000,
        },
        removeOnFail: {
          age: 7 * 24 * 3600,
        },
      }
    );

    logger.info('Benchmark job queued', {
      benchmarkId: data.benchmarkId,
      userId: data.userId,
    });
  } catch (error) {
    logger.error('Failed to queue benchmark job', error instanceof Error ? error : new Error(String(error)), {
      benchmarkId: data.benchmarkId,
    });
    throw error;
  }
}

/**
 * Process optimization job
 */
async function processOptimizationJobWorker(job: Job<EdgeAIOptimizationJobData>): Promise<void> {
  const { jobId, userId } = job.data;

  try {
    // Update job status to running
    await supabase
      .from('edge_ai_optimization_jobs')
      .update({
        status: 'running',
        started_at: new Date().toISOString(),
        progress: 10,
      })
      .eq('id', jobId)
      .eq('user_id', userId);

    // Process the optimization
    const result = await processOptimizationJob(job.data);

    // Update job with results
    await supabase
      .from('edge_ai_optimization_jobs')
      .update({
        status: 'completed',
        progress: 100,
        completed_at: new Date().toISOString(),
        duration_seconds: Math.floor((Date.now() - new Date(job.timestamp).getTime()) / 1000),
        optimized_model_path: result.optimizedModelPath,
        optimized_size_bytes: result.optimizedSizeBytes,
        compression_ratio: result.compressionRatio,
      })
      .eq('id', jobId)
      .eq('user_id', userId);

    logger.info('Optimization job completed', {
      jobId,
      userId,
      compressionRatio: result.compressionRatio,
    });

    // TODO: Send webhook notification if configured
  } catch (error) {
    logger.error('Optimization job failed', error instanceof Error ? error : new Error(String(error)), {
      jobId,
      userId,
    });

    // Update job with error
    await supabase
      .from('edge_ai_optimization_jobs')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        error_details: {
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString(),
        },
      })
      .eq('id', jobId)
      .eq('user_id', userId);

    throw error;
  }
}

/**
 * Process benchmark job
 */
async function processBenchmarkJobWorker(job: Job<EdgeAIBenchmarkJobData>): Promise<void> {
  const { benchmarkId, userId } = job.data;

  try {
    // Update benchmark status to running
    await supabase
      .from('edge_ai_benchmark_runs')
      .update({
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .eq('id', benchmarkId)
      .eq('user_id', userId);

    // Process the benchmark
    const result = await processBenchmarkJob(job.data);

    // Update benchmark with results
    await supabase
      .from('edge_ai_benchmark_runs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        duration_seconds: Math.floor((Date.now() - new Date(job.timestamp).getTime()) / 1000),
        latency_ms: result.latencyMs,
        throughput_ops_per_sec: result.throughputOpsPerSec,
        memory_usage_mb: result.memoryUsageMb,
        cpu_utilization_percent: result.cpuUtilizationPercent,
        gpu_utilization_percent: result.gpuUtilizationPercent,
        npu_utilization_percent: result.npuUtilizationPercent,
        power_consumption_watts: result.powerConsumptionWatts,
        accuracy_metrics: result.accuracyMetrics,
      })
      .eq('id', benchmarkId)
      .eq('user_id', userId);

    logger.info('Benchmark job completed', {
      benchmarkId,
      userId,
      latency: result.latencyMs?.mean,
    });

    // TODO: Send webhook notification if configured
  } catch (error) {
    logger.error('Benchmark job failed', error instanceof Error ? error : new Error(String(error)), {
      benchmarkId,
      userId,
    });

    // Update benchmark with error
    await supabase
      .from('edge_ai_benchmark_runs')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })
      .eq('id', benchmarkId)
      .eq('user_id', userId);

    throw error;
  }
}

/**
 * Start Edge AI workers
 */
export function startEdgeAIWorkers(): void {
  // Optimization worker
  new Worker('edge-ai:optimization', processOptimizationJobWorker, {
    connection,
    concurrency: 2, // Process 2 optimization jobs concurrently
  });

  // Benchmark worker
  new Worker('edge-ai:benchmark', processBenchmarkJobWorker, {
    connection,
    concurrency: 4, // Process 4 benchmark jobs concurrently
  });

  logger.info('Edge AI queue workers started');
}

/**
 * Get job status
 */
export async function getJobStatus(jobId: string, queueName: 'optimization' | 'benchmark'): Promise<{
  status: string;
  progress: number;
  error?: string;
} | null> {
  try {
    const queue = queueName === 'optimization' ? edgeAIOptimizationQueue : edgeAIBenchmarkQueue;
    const job = await queue.getJob(jobId);

    if (!job) {
      return null;
    }

    const state = await job.getState();
    const progress = job.progress || 0;

    return {
      status: state,
      progress: typeof progress === 'number' ? progress : 0,
      error: job.failedReason || undefined,
    };
  } catch (error) {
    logger.error('Error getting job status', error instanceof Error ? error : new Error(String(error)), { jobId });
    return null;
  }
}

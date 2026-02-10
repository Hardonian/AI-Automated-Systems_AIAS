import { Gauge, TrendingUp, Clock, Zap } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Edge AI Benchmarks — Performance Metrics | AIAS',
  description:
    'View benchmark results for your optimized models. Compare latency, throughput, and hardware utilization across devices.',
};

export default function EdgeAIBenchmarksPage() {
  return (
    <div className='container py-12 md:py-16'>
      <div className='mb-12 text-center'>
        <h1 className='mb-4 text-4xl font-bold md:text-5xl'>
          Benchmark Results
        </h1>
        <p className='mb-8 text-xl text-muted-foreground'>
          Performance metrics for your optimized models across different devices
          and configurations.
        </p>
        <Button asChild>
          <Link href='/edge-ai/benchmarks/new'>Run New Benchmark</Link>
        </Button>
      </div>

      {/* Benchmark Cards */}
      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* Example Benchmark Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span>ResNet-50 Optimized</span>
              <Gauge className='h-5 w-5 text-primary' />
            </CardTitle>
            <CardDescription>Jetson Nano • INT8 Quantization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Clock className='h-4 w-4' />
                  Latency
                </span>
                <span className='font-semibold'>12.3 ms</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <TrendingUp className='h-4 w-4' />
                  Throughput
                </span>
                <span className='font-semibold'>81 ops/sec</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Zap className='h-4 w-4' />
                  Memory
                </span>
                <span className='font-semibold'>245 MB</span>
              </div>
              <div className='border-t pt-3'>
                <Button asChild className='w-full' size='sm' variant='outline'>
                  <Link href='/edge-ai/benchmarks/example'>View Details</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Section */}
      <Card>
        <CardHeader>
          <CardTitle>Compare Optimizations</CardTitle>
          <CardDescription>
            Compare performance across different quantization levels and
            optimization strategies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='py-8 text-center text-muted-foreground'>
            <p>Run multiple benchmarks to see comparison charts</p>
            <Button asChild className='mt-4' variant='outline'>
              <Link href='/edge-ai/benchmarks/new'>Start Benchmarking</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

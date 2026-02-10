import { Upload, FileText, Settings, Download } from 'lucide-react';
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
  title: 'Edge AI Models — Upload & Manage | AIAS',
  description:
    'Upload and manage your AI models for edge optimization. Support for ONNX, TensorFlow Lite, GGUF, and more.',
};

export default function EdgeAIModelsPage() {
  return (
    <div className='container py-12 md:py-16'>
      <div className='mb-12 text-center'>
        <h1 className='mb-4 text-4xl font-bold md:text-5xl'>
          Model Management
        </h1>
        <p className='mb-8 text-xl text-muted-foreground'>
          Upload, analyze, and manage your AI models for edge optimization.
        </p>
      </div>

      {/* Upload Section */}
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Upload className='h-5 w-5' />
            Upload New Model
          </CardTitle>
          <CardDescription>
            Supported formats: ONNX, TensorFlow Lite, GGUF, CoreML, TensorRT,
            OpenVINO, NCNN
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center'>
            <Upload className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
            <p className='mb-2 text-lg font-semibold'>
              Drag and drop your model file
            </p>
            <p className='mb-4 text-sm text-muted-foreground'>
              or click to browse (Max file size: 2GB)
            </p>
            <Button asChild>
              <Link href='/edge-ai/models/upload'>Select File</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Model List Placeholder */}
      <div className='mb-8'>
        <h2 className='mb-4 text-2xl font-bold'>Your Models</h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {/* Placeholder for model cards */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <span>Example Model</span>
                <Settings className='h-4 w-4 text-muted-foreground' />
              </CardTitle>
              <CardDescription>ONNX • 45.2 MB</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='text-sm'>
                  <span className='text-muted-foreground'>Status:</span>{' '}
                  <span className='font-medium'>Ready</span>
                </div>
                <div className='text-sm'>
                  <span className='text-muted-foreground'>Uploaded:</span>{' '}
                  <span className='font-medium'>2 days ago</span>
                </div>
                <div className='mt-4 flex gap-2'>
                  <Button asChild size='sm' variant='outline'>
                    <Link href='/edge-ai/models/example/optimize'>
                      Optimize
                    </Link>
                  </Button>
                  <Button asChild size='sm' variant='outline'>
                    <Link href='/edge-ai/models/example/benchmark'>
                      Benchmark
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <Button
              asChild
              className='flex h-auto flex-col items-center gap-2 py-4'
              variant='outline'
            >
              <Link href='/edge-ai/device-analyzer'>
                <Settings className='h-6 w-6' />
                <span>Analyze Device</span>
              </Link>
            </Button>
            <Button
              asChild
              className='flex h-auto flex-col items-center gap-2 py-4'
              variant='outline'
            >
              <Link href='/edge-ai/benchmarks'>
                <FileText className='h-6 w-6' />
                <span>View Benchmarks</span>
              </Link>
            </Button>
            <Button
              asChild
              className='flex h-auto flex-col items-center gap-2 py-4'
              variant='outline'
            >
              <Link href='/edge-ai/sdk-export'>
                <Download className='h-6 w-6' />
                <span>Download SDKs</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Check, ArrowRight } from 'lucide-react';
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
  title: 'Edge AI Accelerator Studio — Deep Dive | AIAS',
  description:
    'Comprehensive edge AI optimization platform. Model quantization, device profiling, benchmarking, and deployment tools.',
};

const capabilities = [
  {
    title: 'Model Upload & Analysis',
    features: [
      'Support for ONNX, TensorFlow Lite, GGUF, CoreML, TensorRT, OpenVINO, NCNN',
      'Automatic model structure analysis',
      'Input/output shape detection',
      'Model metadata extraction',
    ],
  },
  {
    title: 'Optimization & Quantization',
    features: [
      'INT8, INT4, FP8, FP16 quantization',
      'GGUF-style compression',
      'Format conversion (ONNX → TFLite, etc.)',
      'Optimization levels: speed, balanced, size',
    ],
  },
  {
    title: 'Device Profiling',
    features: [
      'Pre-configured templates for Jetson, AI PCs, Android, iOS',
      'Custom device profile creation',
      'NPU/GPU capability detection',
      'Hardware constraint analysis',
    ],
  },
  {
    title: 'Benchmarking Engine',
    features: [
      'Latency measurement (mean, p50, p95, p99)',
      'Throughput testing',
      'Memory usage profiling',
      'CPU/GPU/NPU utilization tracking',
      'Power consumption analysis',
    ],
  },
  {
    title: 'Export & Deployment',
    features: [
      'Optimized model bundles',
      'SDK scaffolds (TypeScript, Python, Java, Swift)',
      'Docker images and compose templates',
      'APK modules for Android',
      'WASM bundles for web',
      'Deployment documentation',
    ],
  },
  {
    title: 'Integration & Support',
    features: [
      'REST API for automation',
      'Webhook notifications for job completion',
      'Integration with AIAS automation workflows',
      'Consulting services for custom deployments',
    ],
  },
];

const workflow = [
  {
    step: 1,
    title: 'Upload Your Model',
    description:
      "Upload your AI model in any supported format. We'll analyze its structure and capabilities.",
  },
  {
    step: 2,
    title: 'Select Target Device',
    description:
      'Choose from pre-configured device profiles or create a custom profile for your hardware.',
  },
  {
    step: 3,
    title: 'Configure Optimization',
    description:
      'Set quantization type, optimization level, and target format based on your requirements.',
  },
  {
    step: 4,
    title: 'Run Optimization',
    description:
      'Our system processes your model and generates optimized versions for your target device.',
  },
  {
    step: 5,
    title: 'Benchmark Performance',
    description:
      'Test optimized models with our benchmarking engine to verify latency and throughput.',
  },
  {
    step: 6,
    title: 'Download & Deploy',
    description:
      'Download optimized bundles, SDKs, and deployment templates. Integrate into your application.',
  },
];

export default function AcceleratorStudioPage() {
  return (
    <div className='container py-12 md:py-16'>
      <div className='mx-auto mb-16 max-w-3xl text-center'>
        <h1 className='mb-6 text-4xl font-bold md:text-5xl'>
          Edge AI Accelerator Studio
        </h1>
        <p className='mb-8 text-xl text-muted-foreground'>
          A comprehensive platform for optimizing and deploying AI models at the
          edge. From model upload to deployment-ready bundles.
        </p>
      </div>

      {/* Workflow */}
      <div className='mb-16'>
        <h2 className='mb-8 text-center text-3xl font-bold'>How It Works</h2>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {workflow.map(item => (
            <Card key={item.step} className='relative'>
              <CardHeader>
                <div className='absolute -left-4 -top-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground'>
                  {item.step}
                </div>
                <CardTitle className='mt-4'>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className='text-base'>
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Capabilities */}
      <div className='mb-16'>
        <h2 className='mb-8 text-center text-3xl font-bold'>Capabilities</h2>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {capabilities.map(capability => (
            <Card key={capability.title} className='h-full'>
              <CardHeader>
                <CardTitle>{capability.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2'>
                  {capability.features.map((feature, idx) => (
                    <li key={idx} className='flex items-start gap-2'>
                      <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                      <span className='text-sm'>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className='rounded-lg bg-muted/50 p-8 text-center'>
        <h2 className='mb-4 text-2xl font-bold'>Get Started Today</h2>
        <p className='mb-6 text-muted-foreground'>
          Start optimizing your models for edge deployment. No credit card
          required.
        </p>
        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <Button asChild size='lg'>
            <Link href='/edge-ai/models'>
              Upload Your First Model
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
          <Button asChild size='lg' variant='outline'>
            <Link href='/edge-ai/device-analyzer'>Analyze Your Device</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

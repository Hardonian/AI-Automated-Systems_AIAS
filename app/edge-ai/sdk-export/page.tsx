import { Download, Code, Package, FileCode } from 'lucide-react';
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
  title: 'SDK Export — Download Bundles & SDKs | AIAS',
  description:
    'Download optimized model bundles, SDK scaffolds, Docker images, and deployment templates for your platform.',
};

const exportTypes = [
  {
    type: 'optimized_model',
    title: 'Optimized Models',
    description: 'Download optimized model files in your target format',
    icon: Package,
    formats: ['ONNX', 'TensorFlow Lite', 'GGUF', 'CoreML', 'TensorRT'],
  },
  {
    type: 'sdk_scaffold',
    title: 'SDK Scaffolds',
    description: 'Starter code for integrating optimized models',
    icon: Code,
    languages: ['TypeScript', 'Python', 'Java', 'Swift', 'C++'],
  },
  {
    type: 'docker_image',
    title: 'Docker Images',
    description: 'Containerized deployment templates',
    icon: Package,
    platforms: ['Linux', 'Jetson', 'Edge Server'],
  },
  {
    type: 'deployment_template',
    title: 'Deployment Templates',
    description: 'Ready-to-use deployment configurations',
    icon: FileCode,
    templates: ['Kubernetes', 'Docker Compose', 'Systemd'],
  },
];

export default function SDKExportPage() {
  return (
    <div className='container py-12 md:py-16'>
      <div className='mb-12 text-center'>
        <h1 className='mb-4 text-4xl font-bold md:text-5xl'>
          SDK Export & Downloads
        </h1>
        <p className='mb-8 text-xl text-muted-foreground'>
          Download optimized bundles, SDKs, and deployment templates for your
          platform.
        </p>
      </div>

      {/* Export Types */}
      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2'>
        {exportTypes.map(exportType => {
          const Icon = exportType.icon;
          return (
            <Card key={exportType.type} className='h-full'>
              <CardHeader>
                <div className='mb-2 flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10'>
                    <Icon className='h-5 w-5 text-primary' />
                  </div>
                  <CardTitle>{exportType.title}</CardTitle>
                </div>
                <CardDescription>{exportType.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {'formats' in exportType && (
                    <div>
                      <p className='mb-2 text-sm font-medium'>
                        Supported Formats:
                      </p>
                      <div className='flex flex-wrap gap-2'>
                        {(exportType.formats || []).map(format => (
                          <span
                            key={format}
                            className='rounded bg-muted px-2 py-1 text-xs'
                          >
                            {format}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {'languages' in exportType && (
                    <div>
                      <p className='mb-2 text-sm font-medium'>Languages:</p>
                      <div className='flex flex-wrap gap-2'>
                        {(exportType.languages || []).map(lang => (
                          <span
                            key={lang}
                            className='rounded bg-muted px-2 py-1 text-xs'
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {'platforms' in exportType && (
                    <div>
                      <p className='mb-2 text-sm font-medium'>Platforms:</p>
                      <div className='flex flex-wrap gap-2'>
                        {(exportType.platforms || []).map(platform => (
                          <span
                            key={platform}
                            className='rounded bg-muted px-2 py-1 text-xs'
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {'templates' in exportType && (
                    <div>
                      <p className='mb-2 text-sm font-medium'>Templates:</p>
                      <div className='flex flex-wrap gap-2'>
                        {(exportType.templates || []).map(template => (
                          <span
                            key={template}
                            className='rounded bg-muted px-2 py-1 text-xs'
                          >
                            {template}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <Button
                    asChild
                    className='mt-4 w-full'
                    size='sm'
                    variant='outline'
                  >
                    <Link href={`/edge-ai/sdk-export/${exportType.type}`}>
                      <Download className='mr-2 h-4 w-4' />
                      Browse Downloads
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Available Downloads */}
      <Card>
        <CardHeader>
          <CardTitle>Available Downloads</CardTitle>
          <CardDescription>
            Your generated artifacts and bundles ready for download.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='py-8 text-center text-muted-foreground'>
            <p>Complete an optimization job to see available downloads</p>
            <Button asChild className='mt-4' variant='outline'>
              <Link href='/edge-ai/models'>Upload a Model</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

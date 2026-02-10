import { Code, Book, Key, Zap } from 'lucide-react';
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
  title: 'API Documentation — AIAS Platform | Developer Resources',
  description:
    'API documentation for AIAS Platform. Integrate with our platform using REST APIs, webhooks, and SDKs.',
};

export default function APIPage() {
  return (
    <div className='container max-w-4xl py-16'>
      <div className='mb-12 text-center'>
        <div className='mb-4 flex items-center justify-center gap-2'>
          <Code className='h-8 w-8 text-primary' />
          <h1 className='text-4xl font-bold md:text-5xl'>API Documentation</h1>
        </div>
        <p className='text-lg text-muted-foreground'>
          Integrate AIAS Platform with your applications using our REST API
        </p>
      </div>

      <div className='mb-12 grid grid-cols-1 gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <div className='mb-2 flex items-center gap-2'>
              <Key className='h-5 w-5 text-primary' />
              <CardTitle>Authentication</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className='mb-4'>
              Learn how to authenticate API requests using API keys and OAuth
            </CardDescription>
            <Button asChild variant='outline'>
              <Link href='/api/openapi'>View API Spec</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className='mb-2 flex items-center gap-2'>
              <Zap className='h-5 w-5 text-primary' />
              <CardTitle>Workflows API</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className='mb-4'>
              Create, execute, and manage workflows programmatically
            </CardDescription>
            <Button asChild variant='outline'>
              <Link href='/api/v1/workflows'>View Endpoints</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className='mb-2 flex items-center gap-2'>
              <Book className='h-5 w-5 text-primary' />
              <CardTitle>OpenAPI Spec</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className='mb-4'>
              Complete API specification in OpenAPI format
            </CardDescription>
            <Button asChild variant='outline'>
              <Link href='/api/openapi'>View Specification</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className='mb-2 flex items-center gap-2'>
              <Code className='h-5 w-5 text-primary' />
              <CardTitle>Swagger UI</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className='mb-4'>
              Interactive API documentation and testing interface
            </CardDescription>
            <Button asChild variant='outline'>
              <Link href='/api/swagger'>Open Swagger</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className='bg-muted'>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Quick start guide for integrating with AIAS Platform API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className='list-decimal space-y-3 pl-6'>
            <li>Generate an API key from your account settings</li>
            <li>
              Include the API key in the Authorization header:{' '}
              <code className='rounded bg-background px-2 py-1'>
                Bearer YOUR_API_KEY
              </code>
            </li>
            <li>Make requests to our REST API endpoints</li>
            <li>Handle webhooks for real-time event notifications</li>
          </ol>
          <div className='mt-6 flex flex-col gap-4 sm:flex-row'>
            <Button asChild>
              <Link href='/settings'>Get API Key</Link>
            </Button>
            <Button asChild variant='outline'>
              <Link href='/help'>View Documentation</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className='mt-8 text-center'>
        <Link className='text-primary hover:underline' href='/integrations'>
          View Available Integrations →
        </Link>
      </div>
    </div>
  );
}

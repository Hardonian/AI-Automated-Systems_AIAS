import { Download, Shield, FileJson } from 'lucide-react';
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
  title: 'Export Your Data — AIAS Platform | Data Portability',
  description:
    'Export your data from AIAS Platform in a machine-readable format. PIPEDA compliant data portability.',
};

export default function ExportDataPage() {
  return (
    <div className='container max-w-3xl py-16'>
      <div className='mb-12 text-center'>
        <div className='mb-4 flex items-center justify-center gap-2'>
          <Download className='h-8 w-8 text-primary' />
          <h1 className='text-4xl font-bold md:text-5xl'>Export Your Data</h1>
        </div>
        <p className='text-lg text-muted-foreground'>
          Download your data in a machine-readable format
        </p>
      </div>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Data Export Options</CardTitle>
          <CardDescription>
            Choose what data you&apos;d like to export
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-start gap-4 rounded-lg border p-4'>
            <FileJson className='mt-0.5 h-5 w-5 text-primary' />
            <div className='flex-1'>
              <h3 className='mb-1 font-semibold'>Complete Data Export</h3>
              <p className='mb-3 text-sm text-muted-foreground'>
                Export all your account data including workflows, agents,
                settings, and activity logs in JSON format
              </p>
              <Button size='sm'>Request Export</Button>
            </div>
          </div>
          <div className='flex items-start gap-4 rounded-lg border p-4'>
            <FileJson className='mt-0.5 h-5 w-5 text-primary' />
            <div className='flex-1'>
              <h3 className='mb-1 font-semibold'>Workflows Only</h3>
              <p className='mb-3 text-sm text-muted-foreground'>
                Export only your workflow configurations and templates
              </p>
              <Button size='sm' variant='outline'>
                Request Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='bg-muted'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Shield className='h-5 w-5 text-primary' />
            <CardTitle>Your Data Rights</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className='mb-4 text-sm text-muted-foreground'>
            Under PIPEDA and GDPR, you have the right to:
          </p>
          <ul className='list-disc space-y-2 pl-6 text-sm'>
            <li>Access your personal data</li>
            <li>Export your data in a machine-readable format</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
          </ul>
          <div className='mt-6'>
            <Link
              className='text-sm text-primary hover:underline'
              href='/privacy'
            >
              Learn more about our Privacy Policy →
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className='mt-8 text-center'>
        <Link
          className='text-primary hover:underline'
          href='/account/audit-log'
        >
          View Audit Log →
        </Link>
      </div>
    </div>
  );
}

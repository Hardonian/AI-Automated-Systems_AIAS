import { Sparkles, Plus, Play, Settings } from 'lucide-react';
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
import { WorkflowsEmptyState } from '@/components/ui/empty-state-enhanced';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Workflows — AIAS Platform | Manage Your Automations',
  description:
    'Manage and monitor your AI workflows and automations. Create, execute, and optimize your business processes.',
};

export const dynamic = 'force-dynamic';

async function getWorkflows() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data: workflows, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('enabled', true)
      .eq('deprecated', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workflows:', error);
      return [];
    }

    return workflows || [];
  } catch (error) {
    console.error('Error in getWorkflows:', error);
    return [];
  }
}

export default async function WorkflowsPage() {
  const workflows = await getWorkflows();
  return (
    <div className='container py-16'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-12 flex items-center justify-between'>
          <div>
            <div className='mb-4 flex items-center gap-2'>
              <Sparkles className='h-8 w-8 text-primary' />
              <h1 className='text-4xl font-bold md:text-5xl'>Your Workflows</h1>
            </div>
            <p className='text-lg text-muted-foreground'>
              Manage and monitor your automation workflows
            </p>
          </div>
          <Button asChild size='lg'>
            <Link href='/onboarding/create-workflow'>
              <Plus className='mr-2 h-5 w-5' />
              Create Workflow
            </Link>
          </Button>
        </div>

        {/* Workflows list or empty state */}
        {workflows.length === 0 ? (
          <WorkflowsEmptyState />
        ) : (
          <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {workflows.map(
              (workflow: {
                id: string;
                name?: string;
                description?: string;
                category?: string;
              }) => (
                <Card
                  key={workflow.id}
                  className='transition-shadow hover:shadow-lg'
                >
                  <CardHeader>
                    <CardTitle className='text-lg'>
                      {workflow.name || 'Unnamed Workflow'}
                    </CardTitle>
                    <CardDescription className='line-clamp-2'>
                      {workflow.description || 'No description'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>
                        {workflow.category || 'Uncategorized'}
                      </span>
                      <Button asChild size='sm' variant='outline'>
                        <Link href={`/workflows/${workflow.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Create your first workflow to start automating your business
              processes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='rounded-lg border p-4'>
                <div className='mb-2 flex items-center gap-2'>
                  <Play className='h-5 w-5 text-primary' />
                  <h3 className='font-semibold'>Start with Templates</h3>
                </div>
                <p className='mb-4 text-sm text-muted-foreground'>
                  Choose from pre-built templates for common workflows
                </p>
                <Button asChild size='sm' variant='outline'>
                  <Link href='/templates'>Browse Templates</Link>
                </Button>
              </div>
              <div className='rounded-lg border p-4'>
                <div className='mb-2 flex items-center gap-2'>
                  <Plus className='h-5 w-5 text-primary' />
                  <h3 className='font-semibold'>Build Custom</h3>
                </div>
                <p className='mb-4 text-sm text-muted-foreground'>
                  Create a workflow from scratch tailored to your needs
                </p>
                <Button asChild size='sm' variant='outline'>
                  <Link href='/onboarding/create-workflow'>Create Custom</Link>
                </Button>
              </div>
              <div className='rounded-lg border p-4'>
                <div className='mb-2 flex items-center gap-2'>
                  <Settings className='h-5 w-5 text-primary' />
                  <h3 className='font-semibold'>Learn More</h3>
                </div>
                <p className='mb-4 text-sm text-muted-foreground'>
                  Explore our documentation and guides
                </p>
                <Button asChild size='sm' variant='outline'>
                  <Link href='/help'>View Help</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='mt-8'>
          <Card className='bg-muted'>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                Our team is here to help you get the most out of AIAS Platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col gap-4 sm:flex-row'>
                <Button asChild>
                  <Link href='/demo'>Schedule Demo</Link>
                </Button>
                <Button asChild variant='outline'>
                  <Link href='/help'>Visit Help Center</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

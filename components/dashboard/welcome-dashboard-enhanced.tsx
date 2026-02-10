'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles, Zap, Target, ArrowRight, Users, Clock } from 'lucide-react';
import type { PlanTier } from '@/config/plans';

interface WelcomeDashboardProps {
  userPlan?: PlanTier;
  trialDaysRemaining?: number;
  hasCompletedPretest?: boolean;
  hasConnectedEmail?: boolean;
  hasCreatedWorkflow?: boolean;
  workflowCount?: number;
  integrationCount?: number;
}

export function WelcomeDashboardEnhanced({
  userPlan = 'trial',
  trialDaysRemaining,
  hasCompletedPretest: _hasCompletedPretest = false,
  hasConnectedEmail: _hasConnectedEmail = false,
  hasCreatedWorkflow = false,
  workflowCount: _workflowCount = 0,
  integrationCount: _integrationCount = 0,
}: WelcomeDashboardProps) {
  return (
    <Card className='mb-8 border-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Sparkles className='h-6 w-6 text-primary' />
          Welcome to your dashboard!
        </CardTitle>
        <CardDescription>
          This is your command center for automation. Here's what you'll see:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div className='rounded-lg bg-white p-4 dark:bg-gray-900'>
            <h4 className='mb-2 flex items-center gap-2 font-semibold'>
              <Zap className='h-4 w-4 text-primary' />
              Workflows
            </h4>
            <p className='text-sm text-muted-foreground'>
              All your automation workflows
            </p>
          </div>
          <div className='rounded-lg bg-white p-4 dark:bg-gray-900'>
            <h4 className='mb-2 flex items-center gap-2 font-semibold'>
              <Target className='h-4 w-4 text-primary' />
              Analytics
            </h4>
            <p className='text-sm text-muted-foreground'>
              Performance metrics and insights
            </p>
          </div>
          <div className='rounded-lg bg-white p-4 dark:bg-gray-900'>
            <h4 className='mb-2 flex items-center gap-2 font-semibold'>
              <Users className='h-4 w-4 text-primary' />
              Integrations
            </h4>
            <p className='text-sm text-muted-foreground'>
              Connected tools and services
            </p>
          </div>
        </div>

        <div className='mb-6 space-y-3'>
          <h4 className='font-semibold'>Get started in 3 steps:</h4>
          <ol className='list-inside list-decimal space-y-2 text-sm text-muted-foreground'>
            <li>
              <strong className='text-foreground'>
                Create your first workflow
              </strong>{' '}
              — Use a template or build from scratch
            </li>
            <li>
              <strong className='text-foreground'>
                Connect an integration
              </strong>{' '}
              — Link your favorite tools
            </li>
            <li>
              <strong className='text-foreground'>Test and activate</strong> —
              See your automation in action
            </li>
          </ol>
        </div>

        <div className='mb-6 flex flex-col gap-3 sm:flex-row'>
          <Button asChild size='lg'>
            <Link href='/onboarding/create-workflow'>
              Create Your First Workflow
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
          <Button variant='outline' asChild size='lg'>
            <Link href='/templates'>Browse Templates</Link>
          </Button>
        </div>

        {userPlan === 'trial' && trialDaysRemaining !== undefined && (
          <div className='mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950'>
            <p className='flex items-center gap-2 text-sm'>
              <Clock className='h-4 w-4 text-yellow-600 dark:text-yellow-400' />
              <strong>Your trial:</strong> You have{' '}
              <strong className='text-yellow-700 dark:text-yellow-300'>
                {trialDaysRemaining} {trialDaysRemaining === 1 ? 'day' : 'days'}
              </strong>{' '}
              left. Upgrade to unlock unlimited workflows and advanced features.
            </p>
          </div>
        )}

        {!hasCreatedWorkflow && (
          <div className='mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-950'>
            <p className='text-sm text-muted-foreground'>
              💡 <strong>Pro Tip:</strong> Create your first workflow in the
              next 5 minutes to see the power of automation. Most users save 10+
              hours per week after setting up just 3-5 workflows.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

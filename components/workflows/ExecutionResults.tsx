'use client';

import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ExecutionResult {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  error?: string;
  results?: Record<string, unknown>;
}

interface ExecutionResultsProps {
  execution?: ExecutionResult;
  loading?: boolean;
}

export function ExecutionResults({
  execution,
  loading,
}: ExecutionResultsProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center py-8'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <span className='ml-2'>Executing workflow...</span>
        </CardContent>
      </Card>
    );
  }

  if (!execution) {
    return (
      <Card>
        <CardContent className='py-8 text-center text-muted-foreground'>
          No execution results yet
        </CardContent>
      </Card>
    );
  }

  const isSuccess = execution.status === 'completed';
  const isFailed = execution.status === 'failed';
  const isRunning = execution.status === 'running';

  return (
    <Card
      className={
        isSuccess ? 'border-green-500' : isFailed ? 'border-red-500' : ''
      }
    >
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>Execution Results</CardTitle>
          <Badge
            className='flex items-center gap-1'
            variant={
              isSuccess ? 'default' : isFailed ? 'destructive' : 'secondary'
            }
          >
            {isSuccess && <CheckCircle2 className='h-3 w-3' />}
            {isFailed && <XCircle className='h-3 w-3' />}
            {isRunning && <Loader2 className='h-3 w-3 animate-spin' />}
            {execution.status}
          </Badge>
        </div>
        <CardDescription>
          Started: {new Date(execution.startedAt).toLocaleString()}
          {execution.completedAt && (
            <>
              {' '}
              • Completed: {new Date(execution.completedAt).toLocaleString()}
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {isSuccess && (
          <div className='rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950'>
            <div className='mb-2 flex items-center gap-2'>
              <CheckCircle2 className='h-5 w-5 text-green-600' />
              <div className='font-semibold text-green-900 dark:text-green-100'>
                Workflow Executed Successfully
              </div>
            </div>
            <div className='text-sm text-green-800 dark:text-green-200'>
              All steps completed without errors.
            </div>
          </div>
        )}

        {isFailed && (
          <div className='rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950'>
            <div className='mb-2 flex items-center gap-2'>
              <XCircle className='h-5 w-5 text-red-600' />
              <div className='font-semibold text-red-900 dark:text-red-100'>
                Workflow Execution Failed
              </div>
            </div>
            <div className='text-sm text-red-800 dark:text-red-200'>
              {execution.error || 'An error occurred during execution'}
            </div>
          </div>
        )}

        {execution.results && Object.keys(execution.results).length > 0 && (
          <div>
            <div className='mb-2 text-sm font-medium'>Step Results:</div>
            <div className='space-y-2'>
              {Object.entries(execution.results).map(([stepId, result]) => (
                <div
                  key={stepId}
                  className='rounded-lg bg-muted p-3 font-mono text-sm'
                >
                  <div className='mb-1 font-semibold'>{stepId}:</div>
                  <pre className='overflow-auto text-xs'>
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

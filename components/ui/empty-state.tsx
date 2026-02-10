/**
 * Empty State Component
 * Displays helpful empty states with retry functionality
 */

'use client';

import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  variant?: 'default' | 'error' | 'loading';
  children?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = 'No data available',
  description = "There's nothing here yet. Try again or check back later.",
  icon,
  action,
  secondaryAction,
  variant = 'default',
  children,
  className,
}: EmptyStateProps) {
  const defaultIcon =
    variant === 'error' ? (
      <AlertCircle className='h-12 w-12 text-destructive' />
    ) : (
      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
        <AlertCircle className='h-6 w-6 text-muted-foreground' />
      </div>
    );

  return (
    <Card className={cn('border-dashed', className)}>
      <CardHeader className='text-center'>
        <div className='mb-4 flex justify-center'>{icon || defaultIcon}</div>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {(action || secondaryAction) && (
        <CardContent className='flex flex-col justify-center gap-2 sm:flex-row'>
          {action && (
            <Button
              onClick={action.onClick}
              variant={variant === 'error' ? 'default' : 'outline'}
            >
              {variant === 'error' && <RefreshCw className='mr-2 h-4 w-4' />}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button asChild variant='outline'>
              <Link href={secondaryAction.href}>
                {secondaryAction.label === 'Go home' && (
                  <Home className='mr-2 h-4 w-4' />
                )}
                {secondaryAction.label}
              </Link>
            </Button>
          )}
        </CardContent>
      )}
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
}

/**
 * Error State Component
 * Specialized empty state for errors
 */
interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: Error | string;
  onRetry?: () => void;
  showDetails?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We encountered an error. Please try again.',
  error,
  onRetry,
  showDetails = process.env.NODE_ENV === 'development',
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <EmptyState
      title={title}
      description={description}
      variant='error'
      action={
        onRetry
          ? {
              label: 'Try again',
              onClick: onRetry,
            }
          : undefined
      }
      secondaryAction={{
        label: 'Go home',
        href: '/',
      }}
    >
      {showDetails && errorMessage && (
        <CardContent className='mt-4'>
          <details className='text-sm'>
            <summary className='cursor-pointer text-muted-foreground'>
              Error details
            </summary>
            <pre className='mt-2 overflow-auto rounded bg-muted p-2 text-xs'>
              {errorMessage}
            </pre>
          </details>
        </CardContent>
      )}
    </EmptyState>
  );
}

/**
 * Loading State Component
 * Shows loading indicator
 */
interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className='flex min-h-[200px] flex-col items-center justify-center space-y-4'>
      <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-primary'></div>
      <p className='text-sm text-muted-foreground'>{message}</p>
    </div>
  );
}

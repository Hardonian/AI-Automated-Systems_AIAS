'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class EnhancedErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error details for debugging - never swallow silently
        if (process.env.NODE_ENV !== 'production') {
            console.error('EnhancedErrorBoundary caught error:', error);
            console.error('Component stack:', errorInfo.componentStack);
        }
        
        // In production, could send to error tracking service here
        // e.g., Sentry, LogRocket, etc.
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }
            
            return (
                <div className='flex min-h-[50vh] flex-col items-center justify-center p-8 text-center'>
                    <div className='rounded-full bg-destructive/10 p-4'>
                        <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className='mt-4 text-2xl font-bold'>Something went wrong</h2>
                    <p className='mt-2 max-w-md text-muted-foreground'>
                        We&apos;re sorry, but something unexpected happened. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className='mt-6 rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors'
                    >
                        Refresh Page
                    </button>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details className='mt-6 max-w-lg rounded-lg border bg-muted p-4 text-left text-sm'>
                            <summary className="cursor-pointer font-medium">Error details (development only)</summary>
                            <pre className='mt-2 overflow-auto whitespace-pre-wrap text-xs text-destructive'>
                                {this.state.error.message}
                                {'\n'}
                                {this.state.error.stack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

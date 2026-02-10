'use client';

import React from 'react';

export class EnhancedErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className='p-8 text-center'>
                    <h2 className='text-2xl font-bold'>Something went wrong.</h2>
                    <p className='mt-2 text-muted-foreground'>Please refresh the page.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

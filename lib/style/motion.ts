'use client';

import * as React from 'react';

export const motionTransitions = {
    default: { duration: 0.2, ease: 'easeInOut' },
    spring: { type: 'spring', stiffness: 300, damping: 20 },
    standard: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
    entrance: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] },
};

export const motionScale = {
    hover: 1.02,
    active: 0.98,
};

export const motionTranslate = {
    lift: -4,
};

export const motionVariants = {
    fadeIn: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 },
    },
};

export const prefersReducedMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Hook for safe SSR: always renders without motion on initial pass,
// then updates to user preference after hydration on client
export const useSafeReducedMotion = () => {
    const [prefersReduced, setPrefersReduced] = React.useState(false);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            setPrefersReduced(prefersReducedMotion());
        }
    }, []);

    return prefersReduced;
};

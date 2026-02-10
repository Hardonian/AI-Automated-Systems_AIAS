'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export default function FadeIn({
    children,
    className,
    delay = 0,
    duration = 0.5,
    ...props
}: HTMLMotionProps<'div'> & { delay?: number; duration?: number; children: ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={cn(className)}
            {...props}
        >
            {children}
        </motion.div>
    );
}

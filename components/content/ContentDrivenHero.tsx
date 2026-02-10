'use client';

import { motion } from 'framer-motion';
import {
    ArrowRight,
    Sparkles,
    Zap,
    Shield,
    Globe,
    CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';

export function ContentDrivenHero({ content }: any) {
    return (
        <section className='relative flex min-h-[80vh] items-center overflow-hidden py-16 md:py-24'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10' />
            <div className='container relative z-10 mx-auto px-4 text-center'>
                {content.badgeText && (
                    <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary'>
                        <Sparkles className='h-4 w-4' />
                        <span>{content.badgeText}</span>
                    </div>
                )}
                <h1 className='mb-6 text-5xl font-bold tracking-tight md:text-7xl'>
                    {content.title}
                    <span className='block text-primary'>{content.subtitle}</span>
                </h1>
                <p className='mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl'>
                    {content.description}
                </p>
                <div className='flex flex-wrap justify-center gap-4'>
                    {content.primaryCta?.visible && (
                        <Button asChild size='lg' className='h-14 px-8 text-lg font-bold'>
                            <Link href={content.primaryCta.href}>
                                {content.primaryCta.label}
                                <ArrowRight className='ml-2 h-5 w-5' />
                            </Link>
                        </Button>
                    )}
                    {content.secondaryCta?.visible && (
                        <Button asChild size='lg' variant='outline' className='h-14 px-8 text-lg font-bold'>
                            <Link href={content.secondaryCta.href}>
                                {content.secondaryCta.label}
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
}

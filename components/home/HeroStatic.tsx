'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { siteContent } from '@/src/content/site';
import { Button } from '@/components/ui/button';

export function HeroStatic() {
  const { brand, positioning } = siteContent;

  return (
    <section className='relative overflow-hidden py-20 lg:py-32'>
      {/* Background Elements */}
      <div className='absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(59,130,246,0.1),transparent)]' />
      <div className='absolute inset-0 -z-10 bg-[radial-gradient(35%_30%_at_80%_20%,rgba(139,92,246,0.05),transparent)]' />

      <div className='container mx-auto px-4 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary'
        >
          <Sparkles className='h-4 w-4' />
          {brand.tagline}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl'
        >
          {brand.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='mx-auto mb-10 max-w-3xl text-xl text-muted-foreground md:text-2xl'
        >
          {positioning.subheading}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='flex flex-col items-center justify-center gap-4 sm:flex-row'
        >
          <Button
            asChild
            size='lg'
            className='h-12 w-full px-8 text-lg font-semibold sm:w-auto'
          >
            <Link href={positioning.primaryCTA.href}>
              {positioning.primaryCTA.label}
              <ArrowRight className='ml-2 h-5 w-5' />
            </Link>
          </Button>
          <Button
            asChild
            variant='outline'
            size='lg'
            className='h-12 w-full px-8 text-lg font-semibold sm:w-auto'
          >
            <Link href={positioning.secondaryCTA.href}>
              {positioning.secondaryCTA.label}
            </Link>
          </Button>
        </motion.div>

        {/* Credibility Band */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className='mt-20 border-t border-border/50 pt-10'
        >
          <p className='mb-8 text-sm font-medium uppercase tracking-wider text-muted-foreground'>
            Built for High-Growth Canadian Enterprises
          </p>
          <div className='flex flex-wrap items-center justify-center gap-8 opacity-50 grayscale md:gap-16'>
            <div className='flex items-center gap-2 text-xl font-bold'>
              <Globe className='h-6 w-6' /> Shopify
            </div>
            <div className='flex items-center gap-2 text-xl font-bold'>
              <Zap className='h-6 w-6' /> Stripe
            </div>
            <div className='flex items-center gap-2 text-xl font-bold'>
              <Shield className='h-6 w-6' /> Wave
            </div>
            <div className='flex items-center gap-2 text-xl font-bold'>
              <CheckCircle2 className='h-6 w-6' /> PIPEDA
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

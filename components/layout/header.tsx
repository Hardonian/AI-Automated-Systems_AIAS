'use client';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

import { MobileNav } from '@/components/layout/mobile-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header
      className='sticky top-0 z-50 border-b border-border/50 bg-bg/80 shadow-sm backdrop-blur-md'
      role='banner'
    >
      <div className='container flex h-16 items-center justify-between'>
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            aria-label='AI Automated Systems - Home'
            className='group flex items-center gap-2 text-xl font-bold transition-opacity hover:opacity-80'
            href='/'
          >
            <Sparkles
              aria-hidden='true'
              className='h-5 w-5 text-primary transition-transform group-hover:rotate-12'
            />
            <span className='bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
              AI Automated Systems
            </span>
          </Link>
        </motion.div>

        <nav aria-label='Primary' className='hidden items-center gap-1 md:flex'>
          {[
            { href: '/services', label: 'Services' },
            { href: '/process', label: 'Process' },
            { href: '/use-cases', label: 'Use Cases' },
            { href: '/training', label: 'Training' },
            { href: '/responsible-ai', label: 'Responsible AI' },
            { href: '/saas', label: 'SaaS' },
          ].map((item, index) => (
            <motion.div
              key={item.href}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                aria-label={`Navigate to ${item.label}`}
                className='group relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground'
                href={item.href}
              >
                {item.label}
                <span
                  aria-hidden='true'
                  className='absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform group-hover:scale-x-100'
                />
              </Link>
            </motion.div>
          ))}

          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Button
              asChild
              className='ml-2 min-h-[44px] font-semibold shadow-md transition-all hover:scale-105 hover:shadow-lg'
              size='sm'
            >
              <Link aria-label='Book a discovery call' href='/contact'>
                Book a Call
              </Link>
            </Button>
          </motion.div>

          <ThemeToggle />
        </nav>

        <div className='flex items-center gap-2 md:hidden'>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

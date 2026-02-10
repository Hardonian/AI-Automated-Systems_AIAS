'use client';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          aria-controls='mobile-navigation'
          aria-expanded={open}
          aria-label='Open navigation menu'
          className='min-h-[44px] min-w-[44px]'
          size='sm'
          variant='ghost'
        >
          <Menu aria-hidden='true' className='h-5 w-5' />
        </Button>
      </SheetTrigger>
      <SheetContent
        aria-label='Mobile navigation'
        className='w-64'
        id='mobile-navigation'
        side='right'
      >
        <nav
          aria-label='Mobile navigation menu'
          className='mt-8 flex flex-col gap-4'
          role='navigation'
        >
          <Link
            aria-label='Navigate to Services'
            className='flex min-h-[44px] items-center text-lg font-medium hover:underline'
            href='/services'
            onClick={() => setOpen(false)}
          >
            Services
          </Link>
          <Link
            aria-label='Navigate to Process'
            className='flex min-h-[44px] items-center text-lg font-medium hover:underline'
            href='/process'
            onClick={() => setOpen(false)}
          >
            Process
          </Link>
          <Link
            aria-label='Navigate to Use Cases'
            className='flex min-h-[44px] items-center text-lg font-medium hover:underline'
            href='/use-cases'
            onClick={() => setOpen(false)}
          >
            Use Cases
          </Link>
          <Link
            aria-label='Navigate to Work'
            className='flex min-h-[44px] items-center text-lg font-medium hover:underline'
            href='/work'
            onClick={() => setOpen(false)}
          >
            Our Work
          </Link>
          <Link
            aria-label='Navigate to Systems'
            className='flex min-h-[44px] items-center text-lg font-medium hover:underline'
            href='/systems'
            onClick={() => setOpen(false)}
          >
            Systems
          </Link>
          <Link
            aria-label='Navigate to Training'
            className='flex min-h-[44px] items-center text-lg font-medium hover:underline'
            href='/training'
            onClick={() => setOpen(false)}
          >
            Training
          </Link>
          <Link
            aria-label='Navigate to Blog'
            className='flex min-h-[44px] items-center text-lg font-medium hover:underline'
            href='/blog'
            onClick={() => setOpen(false)}
          >
            Blog
          </Link>
          <Link
            aria-label='Navigate to About'
            className='flex min-h-[44px] items-center text-lg font-medium hover:underline'
            href='/about'
            onClick={() => setOpen(false)}
          >
            About
          </Link>
          <div className='space-y-3 border-t pt-4'>
            <Button
              asChild
              className='min-h-[48px] w-full text-base font-bold shadow-lg'
            >
              <Link
                aria-label='Start your 30-day free trial - no credit card required'
                href='/signup'
                onClick={() => setOpen(false)}
              >
                Request Access
              </Link>
            </Button>
            <Button
              asChild
              className='min-h-[48px] w-full text-base font-semibold'
              variant='outline'
            >
              <Link
                aria-label='Schedule a free strategy call'
                href='/demo'
                onClick={() => setOpen(false)}
              >
                Schedule Call
              </Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

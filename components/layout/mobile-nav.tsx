'use client';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { getPrimaryCtaHref, siteContent } from '@/src/content/site';

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
          {siteContent.navigation.primary.map(link => (
            <Link
              key={link.href}
              aria-label={`Navigate to ${link.label}`}
              className='flex min-h-[44px] items-center text-lg font-medium hover:underline'
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {siteContent.navigation.resources.map(link => (
            <Link
              key={link.href}
              aria-label={`Navigate to ${link.label}`}
              className='flex min-h-[44px] items-center text-lg font-medium hover:underline'
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className='space-y-3 border-t pt-4'>
            <Button
              asChild
              className='min-h-[48px] w-full text-base font-bold shadow-lg'
            >
              <Link
                aria-label={siteContent.positioning.primaryCTA.label}
                href={getPrimaryCtaHref()}
                onClick={() => setOpen(false)}
              >
                {siteContent.positioning.primaryCTA.label}
              </Link>
            </Button>
            <Button
              asChild
              className='min-h-[48px] w-full text-base font-semibold'
              variant='outline'
            >
              <Link
                aria-label={siteContent.positioning.secondaryCTA.label}
                href={siteContent.positioning.secondaryCTA.href}
                onClick={() => setOpen(false)}
              >
                {siteContent.positioning.secondaryCTA.label}
              </Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

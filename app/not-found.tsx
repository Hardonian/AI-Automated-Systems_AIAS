import { Search, Home, FileQuestion, MessageCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { siteContent } from '@/src/content/site';

export default function NotFound() {
  return (
    <div className='container flex min-h-[70vh] flex-col items-center justify-center py-16'>
      <div className='w-full max-w-2xl space-y-8 text-center'>
        <div className='space-y-4'>
          <h1 className='text-6xl font-extrabold text-primary'>404</h1>
          <h2 className='text-3xl font-bold'>Page not found</h2>
          <p className='mx-auto max-w-md text-lg text-muted-foreground'>
            The page you're looking for doesn't exist or has been moved. Here
            are some helpful links to get you back on track.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-4 text-left sm:grid-cols-2'>
          <Link className='group' href='/'>
            <Card className='h-full border-primary/20 transition-all hover:border-primary/50 hover:shadow-md'>
              <CardContent className='flex items-center gap-4 p-4'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20'>
                  <Home className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <h3 className='font-semibold'>Homepage</h3>
                  <p className='text-sm text-muted-foreground'>
                    Return to the start
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link className='group' href='/#services'>
            <Card className='h-full border-primary/20 transition-all hover:border-primary/50 hover:shadow-md'>
              <CardContent className='flex items-center gap-4 p-4'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20'>
                  <Search className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <h3 className='font-semibold'>Our Services</h3>
                  <p className='text-sm text-muted-foreground'>
                    Explore what we do
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link className='group' href='/#faq'>
            <Card className='h-full border-primary/20 transition-all hover:border-primary/50 hover:shadow-md'>
              <CardContent className='flex items-center gap-4 p-4'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20'>
                  <FileQuestion className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <h3 className='font-semibold'>Help Center</h3>
                  <p className='text-sm text-muted-foreground'>
                    Find answers & guides
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link className='group' href={`mailto:${siteContent.contact.email}`}>
            <Card className='h-full border-primary/20 transition-all hover:border-primary/50 hover:shadow-md'>
              <CardContent className='flex items-center gap-4 p-4'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20'>
                  <MessageCircle className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <h3 className='font-semibold'>Contact Us</h3>
                  <p className='text-sm text-muted-foreground'>
                    Get in touch directly
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className='border-t pt-8'>
          <p className='mb-4 text-muted-foreground'>
            Looking for something specific?
          </p>
          <Button asChild className='w-full sm:w-auto' size='lg'>
            <Link href={siteContent.positioning.primaryCTA.href}>
              {siteContent.positioning.primaryCTA.label}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

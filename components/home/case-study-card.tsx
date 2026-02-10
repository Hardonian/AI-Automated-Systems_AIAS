'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Clock, DollarSign, TrendingUp } from 'lucide-react';

interface CaseStudyCardProps {
  title: string;
  company: string;
  industry: string;
  location: string;
  challenge: string;
  solution: string;
  results: {
    hoursSaved: number;
    revenueIncrease?: number;
    errorReduction?: number;
  };
  testimonial?: string;
  author?: string;
  slug?: string;
}

export function CaseStudyCard({
  title,
  company,
  industry,
  location,
  challenge,
  solution,
  results,
  testimonial,
  author,
  slug,
}: CaseStudyCardProps) {
  return (
    <Card className='flex h-full flex-col'>
      <CardHeader>
        <div className='mb-2 flex items-start justify-between'>
          <div>
            <CardTitle className='mb-1 text-xl'>{title}</CardTitle>
            <CardDescription>
              {company} • {industry} • {location}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col'>
        <div className='flex-1 space-y-4'>
          <div>
            <h4 className='mb-1 font-semibold'>Challenge</h4>
            <p className='text-sm text-muted-foreground'>{challenge}</p>
          </div>
          <div>
            <h4 className='mb-1 font-semibold'>Solution</h4>
            <p className='text-sm text-muted-foreground'>{solution}</p>
          </div>
          <div className='grid grid-cols-2 gap-4 border-t pt-4'>
            <div className='flex items-center gap-2'>
              <Clock className='h-5 w-5 text-primary' />
              <div>
                <div className='text-2xl font-bold'>{results.hoursSaved}</div>
                <div className='text-xs text-muted-foreground'>
                  Hours/Week Saved
                </div>
              </div>
            </div>
            {results.revenueIncrease && (
              <div className='flex items-center gap-2'>
                <TrendingUp className='h-5 w-5 text-green-600' />
                <div>
                  <div className='text-2xl font-bold text-green-600'>
                    +{results.revenueIncrease}%
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    Revenue Increase
                  </div>
                </div>
              </div>
            )}
            {results.errorReduction && (
              <div className='col-span-2 flex items-center gap-2'>
                <DollarSign className='h-5 w-5 text-primary' />
                <div>
                  <div className='text-lg font-bold'>
                    {results.errorReduction}%
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    Error Reduction
                  </div>
                </div>
              </div>
            )}
          </div>
          {testimonial && (
            <div className='rounded-lg bg-muted/50 p-4'>
              <p className='mb-2 text-sm italic'>"{testimonial}"</p>
              {author && (
                <p className='text-xs text-muted-foreground'>— {author}</p>
              )}
            </div>
          )}
        </div>
        {slug && (
          <Button variant='outline' className='mt-4 w-full' asChild>
            <Link href={`/case-studies/${slug}`}>
              Read Full Case Study <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

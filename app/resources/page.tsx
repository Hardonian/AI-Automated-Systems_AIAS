import type { Metadata } from 'next';
import { BookOpen, FileText, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Resources — AI Automated Systems',
  description:
    'Guides, articles, and resources on agentic automation, workflow design, and responsible AI operations.',
};

const resources = [
  {
    icon: FileText,
    title: 'Workflow Design Guide',
    description:
      'A practical guide to designing reliable automation workflows with proper state machines and error handling.',
    link: '/automation-guide',
  },
  {
    icon: BookOpen,
    title: 'Systems Thinking for Automation',
    description:
      'How to analyze your organization as a system to identify the highest-value automation opportunities.',
    link: '/systems-thinking',
  },
  {
    icon: FileText,
    title: 'Responsible AI Operations',
    description:
      'Best practices for governance, safety patterns, and human-in-the-loop design.',
    link: '/responsible-ai',
  },
  {
    icon: FileText,
    title: 'Blog',
    description:
      'Articles on automation patterns, case studies, and industry insights.',
    link: '/blog',
  },
];

export default function ResourcesPage() {
  return (
    <main className='min-h-screen'>
      <section className='bg-muted/30 px-4 py-20'>
        <div className='container mx-auto max-w-4xl text-center'>
          <h1 className='mb-6 text-4xl font-bold md:text-5xl'>Resources</h1>
          <p className='mb-8 text-lg text-muted-foreground'>
            Guides, articles, and resources on agentic automation, workflow
            design, and responsible AI operations.
          </p>
        </div>
      </section>

      <section className='px-4 py-20'>
        <div className='container mx-auto max-w-6xl'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {resources.map(resource => {
              const Icon = resource.icon;
              return (
                <Card
                  key={resource.title}
                  className='h-full border transition-all hover:border-primary/50'
                >
                  <CardHeader>
                    <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                      <Icon className='h-6 w-6 text-primary' />
                    </div>
                    <CardTitle className='text-xl'>{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='mb-6 text-sm text-muted-foreground'>
                      {resource.description}
                    </p>
                    <Button asChild variant='outline' className='w-full'>
                      <a href={resource.link}>
                        Read more
                        <ArrowRight className='ml-2 h-4 w-4' />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className='border-t border-border bg-muted/30 px-4 py-20'>
        <div className='container mx-auto max-w-4xl text-center'>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
            Need personalized guidance?
          </h2>
          <p className='mb-8 text-lg text-muted-foreground'>
            Book a discovery call to discuss your specific context and
            challenges.
          </p>
          <Button asChild size='lg'>
            <a href='/contact'>Book a discovery call</a>
          </Button>
        </div>
      </section>
    </main>
  );
}

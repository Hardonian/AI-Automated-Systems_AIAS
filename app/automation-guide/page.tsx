import {
  Check,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  Clock,
  BookOpen,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Business Automation: Complete Guide | AIAS Platform',
  description:
    'Complete guide to business automation. Learn how to automate workflows, save 10+ hours per week, and scale your business with AI-powered automation.',
  keywords: [
    'business automation',
    'workflow automation',
    'automation guide',
    'automation best practices',
    'workflow automation tools',
    'business process automation',
    'automation templates',
    'automation ROI',
  ],
};

export default function AutomationGuidePage() {
  return (
    <div className='container px-4 py-12 md:py-16'>
      {/* Hero Section */}
      <div className='mx-auto mb-12 max-w-4xl text-center'>
        <div className='mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary'>
          <Zap className='h-4 w-4' />
          <span>Content Pillar: Business Automation</span>
        </div>
        <h1 className='mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl lg:text-6xl'>
          Business Automation: Complete Guide
        </h1>
        <p className='mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl'>
          Learn how to automate your business processes, save 10+ hours per
          week, and scale without hiring. From workflows to ROI, this guide
          covers everything you need to know.
        </p>
      </div>

      {/* What is Automation */}
      <div className='mx-auto mb-12 max-w-4xl'>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>
              What is Business Automation?
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              Business automation is using technology to perform repetitive
              tasks automatically, freeing up time for strategic work. Instead
              of manually processing orders, sending emails, or updating
              spreadsheets, automation handles these tasks for you.
            </p>
            <div className='rounded-lg bg-muted p-4'>
              <h3 className='mb-2 font-semibold'>Example Workflow:</h3>
              <ol className='list-inside list-decimal space-y-1 text-sm text-muted-foreground'>
                <li>
                  <strong>Trigger:</strong> New order in Shopify
                </li>
                <li>
                  <strong>Action 1:</strong> Send notification to Slack
                </li>
                <li>
                  <strong>Action 2:</strong> Update inventory in database
                </li>
                <li>
                  <strong>Action 3:</strong> Send confirmation email to customer
                </li>
              </ol>
            </div>
            <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='rounded-lg bg-primary/5 p-4 text-center'>
                <Clock className='mx-auto mb-2 h-8 w-8 text-primary' />
                <div className='font-semibold'>10+ Hours/Week</div>
                <div className='text-sm text-muted-foreground'>
                  Time saved on average
                </div>
              </div>
              <div className='rounded-lg bg-primary/5 p-4 text-center'>
                <TrendingUp className='mx-auto mb-2 h-8 w-8 text-primary' />
                <div className='font-semibold'>90% Reduction</div>
                <div className='text-sm text-muted-foreground'>
                  In manual errors
                </div>
              </div>
              <div className='rounded-lg bg-primary/5 p-4 text-center'>
                <Target className='mx-auto mb-2 h-8 w-8 text-primary' />
                <div className='font-semibold'>3x Increase</div>
                <div className='text-sm text-muted-foreground'>
                  In lead conversion
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <div className='mx-auto mb-12 max-w-4xl'>
        <h2 className='mb-6 text-3xl font-bold'>
          Getting Started with Automation
        </h2>
        <div className='space-y-4'>
          {[
            {
              step: 1,
              title: 'Identify Repetitive Tasks',
              description:
                'List tasks you do daily or weekly that follow the same pattern. These are prime candidates for automation.',
              icon: Target,
            },
            {
              step: 2,
              title: 'Choose a Template or Build Custom',
              description:
                'Start with a pre-built template to save time, or build a custom workflow from scratch.',
              icon: BookOpen,
            },
            {
              step: 3,
              title: 'Connect Your Tools',
              description:
                'Link your favorite tools (Shopify, Wave, Stripe, etc.) to enable powerful automations.',
              icon: Zap,
            },
            {
              step: 4,
              title: 'Test and Activate',
              description:
                'Test your workflow to ensure it works correctly, then activate it to run automatically.',
              icon: Check,
            },
          ].map(item => {
            const Icon = item.icon;
            return (
              <Card key={item.step}>
                <CardHeader>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                      <span className='font-bold text-primary'>
                        {item.step}
                      </span>
                    </div>
                    <div className='flex-1'>
                      <CardTitle className='flex items-center gap-2'>
                        <Icon className='h-5 w-5 text-primary' />
                        {item.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Best Practices */}
      <div className='mx-auto mb-12 max-w-4xl'>
        <Card className='bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20'>
          <CardHeader>
            <CardTitle className='text-2xl'>
              Automation Best Practices
            </CardTitle>
            <CardDescription>
              Follow these guidelines to maximize your automation success
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='space-y-3'>
              {[
                'Start small with one workflow, then scale',
                'Test thoroughly before activating',
                'Monitor performance and optimize regularly',
                'Use templates as starting points',
                'Connect all your tools for maximum power',
                'Apply systems thinking to find optimal solutions',
              ].map((practice, index) => (
                <li key={index} className='flex items-start gap-2'>
                  <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                  <span>{practice}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className='mx-auto max-w-4xl text-center'>
        <Card className='bg-primary/5'>
          <CardContent className='p-8'>
            <h2 className='mb-4 text-2xl font-bold'>
              Ready to Automate Your Business?
            </h2>
            <p className='mb-6 text-muted-foreground'>
              Start your free trial and create your first automation in 5
              minutes. No credit card required.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Button asChild size='lg'>
                <Link href='/signup'>
                  Start Free Trial
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
              <Button asChild size='lg' variant='outline'>
                <Link href='/templates'>Browse Templates</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Calendar, CheckCircle2, Rocket, Target } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Showcase — AIAS Consultancy | Upcoming Builds & Case Studies',
  description:
    'See what AIAS Consultancy is building next. TokPulse TikTok analytics platform and Hardonia Suite ecosystems showcase our custom AI agent development and workflow automation expertise.',
};

const upcomingTasks = [
  {
    id: 'tokpulse',
    title: 'TokPulse — TikTok Analytics Platform',
    type: 'Custom AI Platform Build',
    status: 'In Development',
    timeline: 'Days 1-15',
    description:
      'A comprehensive TikTok analytics and optimization platform built by AIAS Consultancy. Features advanced ad performance analytics, creative optimization, and AI-powered trend detection.',
    features: [
      'Real-time TikTok ad performance analytics',
      'AI-powered creative optimization',
      'Trend detection and prediction',
      'Automated ad workflow management',
      'Multi-account dashboard',
      'Custom AI agents for campaign optimization',
    ],
    technologies: [
      'Custom AI Agents',
      'TikTok Business API Integration',
      'Real-time Analytics Engine',
      'Workflow Automation',
      'Predictive Analytics',
    ],
    value:
      'Empowers e-commerce brands and agencies to optimize TikTok ad spend and improve ROI through intelligent automation.',
    showcase: true,
  },
  {
    id: 'hardonia-suite',
    title: 'Hardonia Suite Ecosystems',
    type: 'E-Commerce Automation Suite',
    status: 'In Development',
    timeline: 'Days 16-30',
    description:
      'A comprehensive e-commerce automation ecosystem built by AIAS Consultancy. Includes Shopify-focused automation, order processing, inventory management, and multi-channel integration capabilities.',
    features: [
      'Shopify store automation',
      'Intelligent order processing',
      'Automated inventory management',
      'Multi-channel integration',
      'Custom workflow builders',
      'AI-powered customer support agents',
    ],
    technologies: [
      'Shopify API Integration',
      'Custom Workflow Engine',
      'AI Agents for E-Commerce',
      'Multi-Channel Sync',
      'Real-time Inventory Management',
    ],
    value:
      'Enables e-commerce businesses to automate operations, reduce manual work, and scale efficiently across multiple sales channels.',
    showcase: true,
  },
];

const consultancyBuilds = [
  {
    title: 'TokPulse — Built by AIAS Consultancy',
    client: 'E-Commerce & Agency Partners',
    industry: 'Social Media Analytics',
    challenge:
      'TikTok advertising requires constant monitoring, optimization, and creative testing. Manual management is time-consuming and inefficient.',
    solution:
      'AIAS Consultancy designed and built TokPulse as a complete TikTok analytics platform with custom AI agents that automate campaign optimization, creative testing, and performance analysis.',
    results: [
      'Automated campaign optimization reduces manual work by 80%',
      'AI-powered trend detection identifies opportunities 3x faster',
      'Creative optimization improves ad performance by 40%',
      'Real-time analytics enable instant decision-making',
      "Custom workflows adapt to each brand's unique needs",
    ],
    technologies:
      'Custom AI Agents • TikTok Business API • Real-time Analytics • Workflow Automation',
    testimonial:
      "AIAS Consultancy didn't just integrate TikTok—they built us a complete platform that thinks and optimizes on its own. The custom AI agents they developed have transformed how we manage TikTok campaigns.",
    author: 'Marketing Director',
    company: 'Leading E-Commerce Brand',
  },
  {
    title: 'Hardonia Suite Ecosystems — Built by AIAS Consultancy',
    client: 'E-Commerce Businesses',
    industry: 'E-Commerce Automation',
    challenge:
      "E-commerce operations require coordination across multiple channels, inventory systems, and customer touchpoints. Manual processes don't scale.",
    solution:
      'AIAS Consultancy architected and built the Hardonia Suite as a comprehensive e-commerce automation ecosystem. Custom AI agents handle order processing, inventory sync, customer support, and multi-channel coordination.',
    results: [
      'Automated order processing saves 15+ hours per week',
      'Multi-channel inventory sync eliminates overselling',
      'AI customer support agents handle 70% of inquiries',
      'Custom workflows adapt to business-specific needs',
      'Scalable architecture supports growth from startup to enterprise',
    ],
    technologies:
      'Custom AI Agents • Shopify Integration • Workflow Engine • Multi-Channel Sync • Inventory Management',
    testimonial:
      "AIAS Consultancy built us an entire automation ecosystem, not just integrations. Their custom AI agents understand our business logic and make decisions autonomously. It's like having a team of experts working 24/7.",
    author: 'Operations Manager',
    company: 'Multi-Channel E-Commerce Business',
  },
];

export default function ShowcasePage() {
  return (
    <div className='container py-16'>
      <div className='mb-12 text-center'>
        <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary'>
          <Rocket className='h-4 w-4' />
          AIAS Consultancy — Custom Builds
        </div>
        <h1 className='mb-4 text-4xl font-bold md:text-5xl'>
          Next 30 Days: Showcasing Our Builds
        </h1>
        <p className='mx-auto max-w-3xl text-lg text-muted-foreground'>
          AIAS Consultancy specializes in building custom AI platforms, workflow
          automation systems, and intelligent agents. See what we're building
          next and explore case studies of platforms we've built for our
          clients.
        </p>
      </div>

      {/* Upcoming Tasks Section */}
      <section className='mb-16'>
        <div className='mb-6 flex items-center gap-2'>
          <Target className='h-5 w-5 text-primary' />
          <h2 className='text-2xl font-bold'>Upcoming Builds (Next 30 Days)</h2>
        </div>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {upcomingTasks.map(task => (
            <Card key={task.id} className='overflow-hidden border-2'>
              <CardHeader className='bg-gradient-to-r from-primary/10 to-primary/5'>
                <div className='mb-2 flex items-start justify-between'>
                  <div className='flex-1'>
                    <CardTitle className='mb-2 text-2xl'>
                      {task.title}
                    </CardTitle>
                    <CardDescription className='mb-3 text-base'>
                      {task.type}
                    </CardDescription>
                  </div>
                  <Badge className='ml-2' variant='outline'>
                    {task.status}
                  </Badge>
                </div>
                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-1'>
                    <Calendar className='h-4 w-4' />
                    {task.timeline}
                  </div>
                </div>
              </CardHeader>
              <CardContent className='pt-6'>
                <p className='mb-6 text-muted-foreground'>{task.description}</p>

                <div className='mb-6'>
                  <h3 className='mb-3 flex items-center gap-2 font-semibold'>
                    <CheckCircle2 className='h-4 w-4 text-primary' />
                    Key Features
                  </h3>
                  <ul className='space-y-2'>
                    {task.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className='flex items-start gap-2 text-sm text-muted-foreground'
                      >
                        <span className='mt-1 text-primary'>•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className='mb-6'>
                  <h3 className='mb-3 flex items-center gap-2 font-semibold'>
                    <Rocket className='h-4 w-4 text-primary' />
                    Technologies
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {task.technologies.map((tech, idx) => (
                      <Badge key={idx} className='text-xs' variant='secondary'>
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className='rounded-lg bg-muted/50 p-4'>
                  <p className='mb-1 text-sm font-medium'>Value Driver:</p>
                  <p className='text-sm text-muted-foreground'>{task.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Consultancy Builds Case Studies */}
      <section className='mb-16'>
        <div className='mb-8 text-center'>
          <h2 className='mb-4 text-3xl font-bold'>
            Consultancy Builds: Case Studies
          </h2>
          <p className='mx-auto max-w-3xl text-lg text-muted-foreground'>
            These aren't backend integrations—they're complete platforms built
            by AIAS Consultancy. See how we design, architect, and deliver
            custom AI solutions for our clients.
          </p>
        </div>

        <div className='mx-auto max-w-4xl space-y-12'>
          {consultancyBuilds.map(build => (
            <Card key={build.title} className='overflow-hidden'>
              <CardHeader className='bg-muted/50'>
                <div className='flex items-start justify-between'>
                  <div>
                    <CardTitle className='mb-2 text-2xl'>
                      {build.title}
                    </CardTitle>
                    <CardDescription className='flex items-center gap-2 text-base'>
                      {build.client} • {build.industry}
                    </CardDescription>
                  </div>
                  <Badge className='bg-primary'>Consultancy Build</Badge>
                </div>
              </CardHeader>
              <CardContent className='pt-6'>
                <div className='space-y-6'>
                  <div>
                    <h3 className='mb-2 font-semibold'>The Challenge</h3>
                    <p className='text-muted-foreground'>{build.challenge}</p>
                  </div>
                  <div>
                    <h3 className='mb-2 font-semibold'>Our Solution</h3>
                    <p className='text-muted-foreground'>{build.solution}</p>
                  </div>
                  <div>
                    <h3 className='mb-2 font-semibold'>Results Delivered</h3>
                    <ul className='space-y-2'>
                      {build.results.map((result, index) => (
                        <li key={index} className='flex items-start gap-2'>
                          <span className='mt-1 text-primary'>✓</span>
                          <span className='text-muted-foreground'>
                            {result}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className='mb-2 font-semibold'>Technologies Built</h3>
                    <p className='text-muted-foreground'>
                      {build.technologies}
                    </p>
                  </div>
                  <div className='border-t pt-6'>
                    <blockquote className='mb-4 text-lg italic text-muted-foreground'>
                      &ldquo;{build.testimonial}&rdquo;
                    </blockquote>
                    <div>
                      <p className='font-semibold'>{build.author}</p>
                      <p className='text-sm text-muted-foreground'>
                        {build.company}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <div className='mt-12 space-y-4 rounded-lg bg-muted/50 p-8 text-center'>
        <h2 className='text-2xl font-bold'>Need a Custom AI Platform Built?</h2>
        <p className='text-muted-foreground'>
          AIAS Consultancy specializes in building custom AI agents, workflow
          automation systems, and intelligent platforms. Let's discuss your
          project.
        </p>
        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <Button asChild size='lg'>
            <Link href='/demo'>Book Consultation</Link>
          </Button>
          <Button asChild size='lg' variant='outline'>
            <Link href='/case-studies'>View All Case Studies</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

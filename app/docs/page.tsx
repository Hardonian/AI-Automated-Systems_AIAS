import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, FileText, Video, Code, HelpCircle, Zap, Shield } from 'lucide-react';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { PageHero, PageSection, SurfaceCard } from '@/components/ui/section-primitives';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Documentation | AI Automated Systems',
  description:
    'Guides, references, and resources for building and operating AI-powered automation systems.',
  canonical: '/docs',
});

const docCategories = [
  {
    icon: BookOpen,
    title: 'Getting Started',
    description: 'Learn the fundamentals of agentic automation and how to get started with your first workflow.',
    links: [
      { label: 'What is Agentic Automation?', href: '#' },
      { label: 'Understanding Workflows', href: '#' },
      { label: 'Quick Start Guide', href: '#' },
    ],
  },
  {
    icon: Code,
    title: 'Developer Guides',
    description: 'Technical documentation for developers building custom automation solutions.',
    links: [
      { label: 'API Reference', href: '#' },
      { label: 'Webhook Integration', href: '#' },
      { label: 'Custom Actions', href: '#' },
    ],
  },
  {
    icon: Shield,
    title: 'Governance & Security',
    description: 'Best practices for securing your automation systems and maintaining compliance.',
    links: [
      { label: 'Security Overview', href: '#' },
      { label: 'Access Control', href: '#' },
      { label: 'Audit Logging', href: '#' },
    ],
  },
  {
    icon: Zap,
    title: 'Workflow Patterns',
    description: 'Common automation patterns and how to implement them effectively.',
    links: [
      { label: 'Approval Workflows', href: '#' },
      { label: 'Data Processing Pipelines', href: '#' },
      { label: 'Error Handling Strategies', href: '#' },
    ],
  },
];

const resources = [
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Step-by-step video guides for common automation tasks.',
  },
  {
    icon: FileText,
    title: 'Case Studies',
    description: 'Real-world examples of successful automation implementations.',
  },
  {
    icon: HelpCircle,
    title: 'FAQ',
    description: 'Answers to frequently asked questions about our services.',
  },
];

export default function DocsPage() {
  return (
    <>
      <PageHero
        eyebrow="Documentation"
        title="Learn how to build reliable automation"
        description="Comprehensive guides, references, and resources for designing, building, and operating AI-powered workflows."
      />

      <PageSection>
        <div className="grid gap-6 md:grid-cols-2">
          {docCategories.map((category) => (
            <SurfaceCard key={category.title} className="p-6 transition-all duration-300 hover:shadow-lg">
              <category.icon className="h-8 w-8 text-primary mb-4" aria-hidden="true" />
              <h2 className="text-lg font-semibold">{category.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground mb-4">
                {category.description}
              </p>
              <ul className="space-y-2">
                {category.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary underline underline-offset-2 hover:no-underline transition-colors inline-flex items-center gap-1"
                    >
                      {link.label}
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection background="muted">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold">Additional Resources</h2>
          <p className="mt-4 text-muted-foreground">
            Explore more ways to learn about agentic automation.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {resources.map((resource) => (
            <SurfaceCard key={resource.title} className="p-6 text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              <resource.icon className="h-8 w-8 text-primary mx-auto mb-4" aria-hidden="true" />
              <h3 className="font-semibold">{resource.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{resource.description}</p>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection width="narrow">
        <SurfaceCard className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Need personalized guidance?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Our team is here to help you navigate the documentation and find the right solutions for your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="transition-transform duration-200 hover:scale-105">
              <Link href="/contact">
                Contact Support
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="transition-all duration-200 hover:bg-muted">
              <Link href="/book">Book a consultation</Link>
            </Button>
          </div>
        </SurfaceCard>
      </PageSection>
    </>
  );
}

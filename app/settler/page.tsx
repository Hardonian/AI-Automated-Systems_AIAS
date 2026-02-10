import {
  Building2,
  Zap,
  Shield,
  Globe,
  CheckCircle2,
  ArrowRight,
  Code,
  Database,
  Lock,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { ContentDrivenHero } from '@/components/content/ContentDrivenHero';
import { DashboardPreviewWrapper } from '@/components/dashboard/dashboard-preview-wrapper';
import { ServiceSchema } from '@/components/seo/structured-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { loadSettlerContent } from '@/lib/content/loader';

export const metadata: Metadata = {
  title: 'Settler — Enterprise Settlement & Payment Platform | AIAS Partner',
  description:
    'Settler is a powerful enterprise settlement and payment processing platform. Built by AI Automated Systems, designed for high-volume transactions, compliance, and seamless integrations.',
};

// Icon mapping for features
const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  shield: Shield,
  database: Database,
  code: Code,
  lock: Lock,
  'trending-up': TrendingUp,
};

export default async function SettlerPage() {
  // Load content from config (with defaults if file doesn't exist)
  let content;
  try {
    content = await loadSettlerContent();
  } catch (error) {
    // Use server logger for server-side rendering
    const { serverLogger } = await import('@/lib/utils/logger');
    serverLogger.error(
      'Error loading Settler content, using defaults',
      error as Error
    );
    content = null;
  }

  // Fallback to defaults if content loading failed
  const features = content?.features?.items || [];
  const useCases = content?.useCases || [];
  return (
    <>
      <ServiceSchema />
      <div className='min-h-screen'>
        {/* Hero Section - Use content-driven hero if content is loaded */}
        {content ? (
          <ContentDrivenHero content={content.hero} />
        ) : (
          <section className='relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20 md:py-32'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]' />
            <div className='container relative z-10'>
              <div className='mx-auto max-w-4xl space-y-8 text-center'>
                <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'>
                  <Building2 className='h-4 w-4' />
                  <span>Enterprise Payment Platform</span>
                  <Badge
                    className='ml-2 border-blue-300 dark:border-blue-700'
                    variant='outline'
                  >
                    AIAS Partner Product
                  </Badge>
                </div>

                <h1 className='bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-5xl font-extrabold text-transparent md:text-7xl'>
                  Settler
                </h1>

                <p className='mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl'>
                  Enterprise-grade settlement and payment processing platform.
                  Built for scale, security, and seamless integration.
                </p>

                <div className='flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row'>
                  <Button asChild className='px-8 text-lg' size='lg'>
                    <Link href='/demo'>
                      Schedule Demo
                      <ArrowRight className='ml-2 h-5 w-5' />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className='px-8 text-lg'
                    size='lg'
                    variant='outline'
                  >
                    <Link href='#features'>Explore Features</Link>
                  </Button>
                </div>

                <div className='flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-500' />
                    <span>Enterprise Ready</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Globe className='h-5 w-5 text-blue-500' />
                    <span>🇨🇦 Canadian Built</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Shield className='h-5 w-5 text-purple-500' />
                    <span>Bank-Grade Security</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Dashboard Preview Section */}
        <section className='bg-muted/30 py-20'>
          <div className='container'>
            <div className='mx-auto mb-12 max-w-3xl text-center'>
              <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
                Real-Time Analytics & Insights
              </h2>
              <p className='text-xl text-muted-foreground'>
                Get comprehensive visibility into your payment operations with
                our advanced dashboard.
              </p>
            </div>
            <DashboardPreviewWrapper
              description='Transaction monitoring, settlement tracking, and performance metrics'
              scrollTargetId='demo-cta'
              title='Settler Analytics Dashboard'
              variant='settler'
            />
          </div>
        </section>

        {/* Features Section */}
        <section className='bg-background py-20' id='features'>
          <div className='container'>
            <div className='mx-auto mb-16 max-w-3xl text-center'>
              <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
                {content?.features?.sectionTitle ||
                  'Built for Enterprise Scale'}
              </h2>
              <p className='text-xl text-muted-foreground'>
                {content?.features?.sectionSubtitle ||
                  'Everything you need for high-volume payment processing, settlement, and financial operations.'}
              </p>
            </div>

            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {features.map(feature => {
                const Icon = feature.icon
                  ? iconMap[feature.icon.toLowerCase()] || Zap
                  : Zap;
                const color =
                  typeof feature.gradient === 'string' &&
                  feature.gradient.startsWith('text-')
                    ? feature.gradient
                    : feature.gradient || 'text-primary';
                return (
                  <Card
                    key={feature.title}
                    className='h-full transition-shadow hover:shadow-lg'
                  >
                    <CardHeader>
                      <div
                        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10`}
                      >
                        <Icon className={`h-6 w-6 ${color}`} />
                      </div>
                      <CardTitle className='mb-2 text-xl'>
                        {feature.title}
                      </CardTitle>
                      <CardDescription className='text-base'>
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className='bg-muted/50 py-20'>
          <div className='container'>
            <div className='mx-auto mb-16 max-w-3xl text-center'>
              <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
                Perfect For
              </h2>
              <p className='text-xl text-muted-foreground'>
                Trusted by marketplaces, SaaS platforms, and financial services
                companies.
              </p>
            </div>

            <div className='mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2'>
              {useCases.map(useCase => (
                <Card key={useCase.title} className='h-full'>
                  <CardHeader>
                    <CardTitle className='mb-2 text-xl'>
                      {useCase.title}
                    </CardTitle>
                    <CardDescription className='text-base'>
                      {useCase.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Section */}
        {content?.partnership && (
          <section className='bg-background py-20'>
            <div className='container'>
              <Card className='mx-auto max-w-4xl border-2 bg-gradient-to-br from-primary/5 to-accent/5'>
                <CardHeader className='text-center'>
                  <div className='mb-4 flex items-center justify-center gap-3'>
                    <Building2 className='h-8 w-8 text-primary' />
                    <h2 className='text-3xl font-bold md:text-4xl'>
                      {content.partnership.title ||
                        'Built by AI Automated Systems'}
                    </h2>
                  </div>
                  <CardDescription className='text-lg'>
                    {content.partnership.description ||
                      'Settler is a product of AI Automated Systems, leveraging our expertise in enterprise platform development, payment systems, and financial technology.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    {content.partnership.whyItems &&
                      content.partnership.whyItems.length > 0 && (
                        <div>
                          <h3 className='mb-2 font-semibold'>Why Settler?</h3>
                          <ul className='space-y-2 text-muted-foreground'>
                            {content.partnership.whyItems.map((item, i) => (
                              <li key={i} className='flex items-start gap-2'>
                                <CheckCircle2 className='mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                                <span>{item.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {content.partnership.synergyItems &&
                      content.partnership.synergyItems.length > 0 && (
                        <div>
                          <h3 className='mb-2 font-semibold'>
                            Synergy with AIAS Platform
                          </h3>
                          <ul className='space-y-2 text-muted-foreground'>
                            {content.partnership.synergyItems.map((item, i) => (
                              <li key={i} className='flex items-start gap-2'>
                                <CheckCircle2 className='mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500' />
                                <span>{item.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                  {content.partnership.ctas &&
                    content.partnership.ctas.length > 0 && (
                      <div className='border-t pt-6'>
                        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                          {content.partnership.ctas.map(
                            (cta, i) =>
                              cta.visible && (
                                <Button
                                  key={i}
                                  asChild
                                  size='lg'
                                  variant={
                                    cta.variant as
                                      | 'default'
                                      | 'secondary'
                                      | 'outline'
                                      | 'ghost'
                                      | 'destructive'
                                      | 'cta'
                                      | 'trust'
                                      | 'premium'
                                  }
                                >
                                  <Link href={cta.href}>
                                    {cta.label}
                                    {i === 0 && (
                                      <ArrowRight className='ml-2 h-5 w-5' />
                                    )}
                                  </Link>
                                </Button>
                              )
                          )}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* CTA Section */}
        {content?.cta && (
          <section
            className='bg-gradient-to-br from-blue-600 to-purple-600 py-20 text-white'
            id='demo-cta'
          >
            <div className='container'>
              <div className='mx-auto max-w-3xl space-y-8 text-center'>
                <h2 className='text-4xl font-bold md:text-5xl'>
                  {content.cta.title ||
                    'Ready to Scale Your Payment Operations?'}
                </h2>
                {content.cta.description && (
                  <p className='text-xl text-blue-100'>
                    {content.cta.description}
                  </p>
                )}
                {content.cta.ctas && content.cta.ctas.length > 0 && (
                  <div className='flex flex-col justify-center gap-4 pt-4 sm:flex-row'>
                    {content.cta.ctas.map(
                      (cta, i) =>
                        cta.visible && (
                          <Button
                            key={i}
                            asChild
                            className='px-8 text-lg'
                            size='lg'
                            variant={
                              cta.variant as
                                | 'default'
                                | 'secondary'
                                | 'outline'
                                | 'ghost'
                                | 'destructive'
                                | 'cta'
                                | 'trust'
                                | 'premium'
                            }
                          >
                            <Link href={cta.href}>
                              {cta.label}
                              {i === 0 && (
                                <ArrowRight className='ml-2 h-5 w-5' />
                              )}
                            </Link>
                          </Button>
                        )
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

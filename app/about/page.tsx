import type { Metadata } from 'next';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { MapPin, Award, Users, ArrowRight } from 'lucide-react';

import { FeatureIllustration } from '@/components/visual/FeatureIllustration';
import { getPrimaryCtaHref, siteContent } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'About | AI Automated Systems',
  description:
    'Learn about AIAS - a Canadian consultancy building enterprise-grade agentic automation systems.',
  canonical: '/about',
});

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm font-medium">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Built in Canada 🇨🇦</span>
              </div>
              <h1 className="text-4xl font-bold md:text-5xl">
                Engineering the future of work
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                AIAS is a consultancy specializing in agentic automation for Canadian enterprises. 
                We architect and deploy AI infrastructure that teams can own, operate, and scale.
              </p>
              <p className="mt-4 text-muted-foreground">
                We engage through Foundation, Build + Empower, and Build + Manage + Scale
                so teams can choose the right balance of speed, ownership, and ongoing iteration.
              </p>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl border bg-card p-8">
                <FeatureIllustration type="agents" className="h-48" />
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-muted p-4 text-center">
                    <div className="text-2xl font-bold text-primary">10x</div>
                    <div className="text-sm text-muted-foreground">Faster Deployment</div>
                  </div>
                  <div className="rounded-xl bg-muted p-4 text-center">
                    <div className="text-2xl font-bold text-primary">10+</div>
                    <div className="text-sm text-muted-foreground">Hours Saved/Week</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">Our Principles</h2>
          <p className="mt-4 text-muted-foreground">
            Every engagement is anchored in predictable workflows, auditable decisions, 
            and shared ownership.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {siteContent.secretSauce.pillars.map((pillar, index) => (
            <article
              key={pillar.title}
              className="rounded-2xl border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-lg font-bold text-primary">{index + 1}</span>
              </div>
              <h3 className="text-xl font-semibold">{pillar.title}</h3>
              <p className="mt-3 text-muted-foreground">{pillar.description}</p>
              <ul className="mt-4 space-y-2">
                {pillar.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-0.5 text-primary">•</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold">Enterprise Ready</h2>
            <p className="mt-4 text-muted-foreground">
              We build systems that meet the highest standards of security and compliance.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Award, title: 'SOC 2 Ready', desc: 'Audit-compliant controls' },
              { icon: MapPin, title: 'PIPEDA Aligned', desc: 'Canadian privacy standards' },
              { icon: Users, title: 'Human-in-Loop', desc: 'Designed for oversight' },
              { icon: Award, title: 'Open Source', desc: 'Transparent, auditable code' },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded-xl border bg-card p-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16">
        <div className="mx-auto max-w-2xl rounded-2xl border bg-gradient-to-br from-primary/5 to-accent/5 p-8 text-center md:p-12">
          <h2 className="text-2xl font-bold md:text-3xl">
            Let&apos;s build something together
          </h2>
          <p className="mt-4 text-muted-foreground">
            Ready to transform your operations with agentic automation? 
            We&apos;d love to hear about your challenges.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={getPrimaryCtaHref()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Book a Strategy Call
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${siteContent.contact.email}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border bg-background px-6 py-3 font-semibold transition-colors hover:bg-muted"
            >
              Email Us
            </a>
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Proudly built in Canada 🇨🇦 • Serving clients worldwide 🌍
          </p>
        </div>
      </section>
    </>
  );
}

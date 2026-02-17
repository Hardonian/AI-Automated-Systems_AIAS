import type { Metadata } from 'next';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { Mail, MapPin, Clock, Calendar, ArrowRight } from 'lucide-react';

import { getPrimaryCtaHref, siteContent } from '@/src/content/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Contact | AI Automated Systems',
  description:
    'Get in touch with AIAS for agentic automation consulting. Book a strategy call or email us directly.',
  canonical: '/contact',
});

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Contact
            </p>
            <h1 className="mt-4 text-4xl font-bold md:text-5xl">
              Let&apos;s talk automation
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Ready to explore how agentic automation can transform your operations? 
              Book a free strategy call or send us an email.
            </p>
            <div className="mt-6 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm font-medium">
                <MapPin className="h-4 w-4 text-primary" />
                Serving clients worldwide 🌍
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="container py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Book a Call */}
          <a
            href={getPrimaryCtaHref()}
            className="group relative overflow-hidden rounded-2xl border bg-card p-8 transition-all hover:border-primary/20 hover:shadow-lg"
          >
            <div className="absolute right-4 top-4 rounded-full bg-primary/10 p-3">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Book a Strategy Call</h2>
            <p className="mt-4 text-muted-foreground">
              Schedule a 30-minute discovery call to discuss your workflows 
              and identify high-impact automation opportunities.
            </p>
            <div className="mt-6 flex items-center gap-2 font-semibold text-primary">
              <span>Schedule now</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>30 minutes • Free consultation</span>
            </div>
          </a>

          {/* Email */}
          <a
            href={`mailto:${siteContent.contact.email}`}
            className="group relative overflow-hidden rounded-2xl border bg-card p-8 transition-all hover:border-primary/20 hover:shadow-lg"
          >
            <div className="absolute right-4 top-4 rounded-full bg-primary/10 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Send us an Email</h2>
            <p className="mt-4 text-muted-foreground">
              Prefer to write? Send us a detailed message about your project 
              and we&apos;ll get back to you within 2 business days.
            </p>
            <div className="mt-6 flex items-center gap-2 font-semibold text-primary">
              <span>Email us</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              {siteContent.contact.email}
            </div>
          </a>
        </div>
      </section>

      {/* What to Expect */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold md:text-3xl">
              What to expect
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                {
                  step: '1',
                  title: 'Discovery',
                  desc: 'We\'ll discuss your current workflows, pain points, and goals.',
                },
                {
                  step: '2',
                  title: 'Assessment',
                  desc: 'We\'ll identify high-impact automation opportunities.',
                },
                {
                  step: '3',
                  title: 'Roadmap',
                  desc: 'You\'ll receive a prioritized implementation plan.',
                },
              ].map((item) => (
                <div key={item.step} className="rounded-xl border bg-card p-6 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="mt-4 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="container py-16">
        <div className="mx-auto max-w-2xl rounded-2xl border bg-gradient-to-br from-primary/5 to-accent/5 p-8 text-center">
          <h2 className="text-xl font-bold">Have questions?</h2>
          <p className="mt-2 text-muted-foreground">
            Check our FAQ section for answers to common questions about our process, 
            timeline, and approach.
          </p>
          <a
            href="/#faq"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View FAQ
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </>
  );
}

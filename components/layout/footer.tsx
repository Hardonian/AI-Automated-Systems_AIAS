'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Shield, Lock, MapPin, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { getPrimaryCtaHref, siteContent } from '@/src/content/site';

const trustSignals = [
  { icon: Lock, text: 'PIPEDA Practices' },
  { icon: Shield, text: 'Security Focused' },
  { icon: MapPin, text: 'Canadian Operations' },
  { icon: ClipboardCheck, text: 'Audit Ready' },
];

const FOOTER_COLUMNS = [
  {
    title: 'Interactive Tools',
    links: [
      { label: 'Automation Simulator', href: '/automation-demo' },
      { label: 'Operations Dashboard', href: '/dashboard' },
      { label: 'ROI Calculator', href: '/roi-calculator' },
      { label: 'Readiness Scorecard', href: '/readiness-checklist' },
      { label: 'Scope Estimator', href: '/engagement-simulator' },
      { label: 'Book Diagnostic', href: '/book' },
    ],
  },
  {
    title: 'Services & Blueprints',
    links: [
      { label: 'Services Overview', href: '/services' },
      { label: 'Blueprints Library', href: '/blueprints' },
      { label: 'Governed Intake Router', href: '/blueprints/governed-intake-router' },
      { label: 'Execution Fabric', href: '/blueprints/execution-fabric-control-plane' },
      { label: 'Release Pipeline', href: '/blueprints/resilient-agent-release-pipeline' },
      { label: 'App & AI Systems', href: '/services/app-ai-systems' },
    ],
  },
  {
    title: 'Proof & Methodology',
    links: [
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Systems Framework', href: '/framework' },
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Operational Metrics', href: '/metrics' },
      { label: 'Public Build Log', href: '/build-log' },
      { label: 'Certification Path', href: '/certification' },
    ],
  },
  {
    title: 'Company & Legal',
    links: [
      { label: 'About AIAS', href: '/about' },
      { label: 'Why We Say No', href: '/why-we-say-no' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact Team', href: '/contact' },
      ...siteContent.footer.legalLinks,
    ],
  },
];

export function Footer() {
  return (
    <footer
      aria-label="Site footer"
      className="mt-auto border-t-2 border-border bg-gradient-to-b from-background to-muted/30 py-12 text-sm text-muted-foreground md:py-16"
      data-testid="footer-legal-cluster"
      role="contentinfo"
    >
      <div className="container">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 md:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center border-2 border-border bg-black text-xs font-mono font-black text-primary">
                {'//'}
              </span>
              <h3 className="font-mono text-base font-black uppercase tracking-wider text-foreground">
                AIAS Platform
              </h3>
            </div>
            <p className="mb-6 max-w-sm text-xs leading-relaxed text-muted-foreground">
              {siteContent.brand.description}
            </p>

            <div className="mb-6 space-y-2.5">
              <Button
                asChild
                className="w-full rounded-none border-2 border-primary bg-primary font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card hover:-translate-y-0.5 transition-all"
              >
                <Link href={getPrimaryCtaHref()}>
                  <Calendar className="mr-2 h-3.5 w-3.5" />
                  {siteContent.positioning.primaryCTA.label}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-wider hover:border-foreground transition-all"
              >
                <Link href="/contact">
                  Request Proposal
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
              <span className="border border-border bg-card px-2 py-0.5 font-bold uppercase text-foreground">
                Deterministic
              </span>
              <span className="border border-border bg-card px-2 py-0.5 font-bold uppercase text-foreground">
                Static-First
              </span>
              <span className="border border-border bg-card px-2 py-0.5 font-bold uppercase text-foreground">
                Zero Hard-500s
              </span>
            </div>
          </motion.div>

          {FOOTER_COLUMNS.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: (index + 1) * 0.08 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h4 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                {section.title}
              </h4>
              <ul className="space-y-2" role="list">
                {section.links.map((link) => (
                  <li key={link.href} role="listitem">
                    <Link
                      aria-label={`Navigate to ${link.label}`}
                      className="inline-block font-mono text-xs text-muted-foreground transition-colors hover:text-primary hover:underline"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
          className="mt-12 border-t border-border pt-8"
        >
          <div
            className="mb-8 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground"
            data-testid="footer-legal-links"
          >
            {[
              ...siteContent.footer.legalLinks,
              {
                href: `mailto:${siteContent.contact.email}`,
                label: 'Support',
              },
            ].map(link => (
              <Link
                key={link.href}
                aria-label={`Navigate to ${link.label}`}
                className="flex min-h-[44px] items-center transition-colors hover:text-foreground hover:underline"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Trust signals — clean icons, no emoji */}
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            {trustSignals.map((badge, index) => (
              <motion.div
                key={badge.text}
                initial={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
              >
                <badge.icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">
                  {badge.text}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <a
                aria-label="Visit our GitHub repository"
                className="text-muted-foreground transition-colors hover:text-foreground"
                href="https://github.com/shardie-github/aias"
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    fillRule="evenodd"
                  />
                </svg>
              </a>
            </div>
            <div className="text-center text-xs leading-relaxed text-muted-foreground md:text-sm">
              {siteContent.footer.copyright}
              <br />
              <span className="mt-2 inline-block">
                Built in Canada · Serving globally
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

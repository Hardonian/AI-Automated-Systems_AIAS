"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getContainerClasses, TYPOGRAPHY } from "@/lib/design-tokens";
import { getPrimaryCtaHref, siteContent } from "@/src/content/site";

export function Testimonials() {
  const studies = siteContent.caseStudies;

  if (!studies || studies.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden border-b bg-gradient-to-b from-background via-muted/10 to-background py-20"
      id="engagements"
    >
      <div className={getContainerClasses("wide")}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-14 text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Real work, real clients
          </span>
          <h2 className={`${TYPOGRAPHY.h2} mb-4 mt-3`}>Recent Engagements</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Actual projects with named clients. Each one shipped with governance
            artifacts, documented handoff, and measurable outcomes.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {studies.map((study, index) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="group h-full rounded-2xl border bg-card p-7 transition-all hover:border-primary/30 hover:shadow-xl">
                {/* Client header */}
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Client
                    </p>
                    <p className="mt-0.5 text-lg font-bold">{study.client}</p>
                  </div>
                  {study.projectUrl && (
                    <a
                      href={study.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      Live
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                <h3 className="text-xl font-bold">{study.title}</h3>

                {/* Challenge / Solution */}
                <div className="mt-5 space-y-3">
                  <div className="rounded-xl bg-destructive/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-destructive/70">
                      Challenge
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">
                      {study.challenge}
                    </p>
                  </div>
                  <div className="rounded-xl bg-primary/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary/70">
                      What we did
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">
                      {study.solution}
                    </p>
                  </div>
                </div>

                {/* Results */}
                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Outcomes
                  </p>
                  <ul className="space-y-1.5">
                    {study.results.map((result) => (
                      <li
                        key={result}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-14 text-center"
        >
          <p className="mb-6 text-muted-foreground">
            Want to see how this maps to your systems and constraints?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="px-8">
              <Link href={getPrimaryCtaHref()}>
                {siteContent.positioning.primaryCTA.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/case-studies">
                View all case studies
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

'use client';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Target, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  getContainerClasses,
  TYPOGRAPHY,
  GRID_GAPS,
} from '@/lib/design-tokens';
import { getPrimaryCtaHref, siteContent } from '@/src/content/site';

export function Testimonials() {
  return (
    <section
      className='relative overflow-hidden bg-muted/20 py-20'
      id='engagements'
    >
      <div className={getContainerClasses('wide')}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          className='mb-12 text-center'
        >
          <span className='rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary'>
            Example engagements
          </span>
          <h2 className={`${TYPOGRAPHY.h2} mb-4 mt-6`}>
            Practical Patterns We Can Build With You
          </h2>
          <p
            className={`${TYPOGRAPHY.body} mx-auto max-w-3xl text-muted-foreground`}
          >
            These are representative examples, not guaranteed outcomes. We adapt
            each engagement to your constraints and review checkpoints.
          </p>
        </motion.div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${GRID_GAPS.default}`}
        >
          {siteContent.caseStudies.map((example, index) => (
            <motion.div
              key={example.title}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Card className='h-full border-2 transition-all hover:border-primary/50 hover:shadow-lg'>
                <CardContent className='px-6 pb-6 pt-6'>
                  <div className='mb-4 flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10'>
                      <Target className='h-5 w-5 text-primary' />
                    </div>
                    <h3 className={`${TYPOGRAPHY.h4}`}>{example.title}</h3>
                  </div>

                  <div className='mb-4'>
                    <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                      Client profile
                    </span>
                    <p className='mt-1 text-sm'>{example.client}</p>
                  </div>

                  <div className='mb-4 rounded-lg bg-muted/30 p-4'>
                    <p className='text-sm'><strong>Challenge:</strong> {example.challenge}</p>
                  </div>

                  <div className='mb-4 rounded-lg bg-primary/5 p-4'>
                    <p className='text-sm'><strong>Approach:</strong> {example.solution}</p>
                  </div>

                  <div className='mb-4'>
                    <span className='mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                      Example outcomes
                    </span>
                    <ul className='space-y-2'>
                      {example.results.map(result => (
                        <li
                          key={result}
                          className='flex items-center gap-2 text-sm'
                        >
                          <CheckCircle2 className='h-4 w-4 text-primary' />
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className='rounded-lg border border-primary/20 bg-primary/5 p-3'>
                    <div className='mb-2 flex items-center gap-2'>
                      <FileText className='h-4 w-4 text-primary' />
                      <span className='text-xs font-semibold uppercase tracking-wider text-primary'>
                        Deliverables
                      </span>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      Discovery map, workflow blueprint, runbook, and handoff plan.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          className='mt-12 text-center'
        >
          <p className='mb-6 text-muted-foreground'>
            Want a version mapped to your own systems and risk profile?
          </p>
          <Button asChild size='lg' className='px-8'>
            <Link href={getPrimaryCtaHref()}>
              {siteContent.positioning.primaryCTA.label}
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

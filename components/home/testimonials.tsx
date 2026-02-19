'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TestimonialCard } from '@/components/shared/TestimonialCard';
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
            <TestimonialCard
              key={example.title}
              title={example.title}
              client={example.client}
              challenge={example.challenge}
              solution={example.solution}
              results={example.results}
              index={index}
            />
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

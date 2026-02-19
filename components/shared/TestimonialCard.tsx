'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, FileText, Target } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { TYPOGRAPHY } from '@/lib/design-tokens';

interface TestimonialCardProps {
  title: string;
  client: string;
  challenge: string;
  solution: string;
  results: string[];
  deliverables?: string;
  index?: number;
}

export function TestimonialCard({
  title,
  client,
  challenge,
  solution,
  results,
  deliverables = 'Discovery map, workflow blueprint, runbook, and handoff plan.',
  index = 0,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Card className="h-full border-2 transition-all hover:border-primary/50 hover:shadow-lg">
        <CardContent className="px-6 pb-6 pt-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <h3 className={TYPOGRAPHY.h4}>{title}</h3>
          </div>

          <div className="mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Client profile
            </span>
            <p className="mt-1 text-sm">{client}</p>
          </div>

          <div className="mb-4 rounded-lg bg-muted/30 p-4">
            <p className="text-sm">
              <strong>Challenge:</strong> {challenge}
            </p>
          </div>

          <div className="mb-4 rounded-lg bg-primary/5 p-4">
            <p className="text-sm">
              <strong>Approach:</strong> {solution}
            </p>
          </div>

          <div className="mb-4">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Example outcomes
            </span>
            <ul className="space-y-2">
              {results.map((result) => (
                <li key={result} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {result}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Deliverables
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{deliverables}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

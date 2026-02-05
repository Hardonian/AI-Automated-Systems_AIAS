'use client';
import { motion } from 'framer-motion';
import {
  Shield,
  Award,
  CheckCircle2,
  Users,
  Clock,
  Globe,
  Lock,
  Target,
  FileText,
  Zap,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import {
  getSectionClasses,
  getContainerClasses,
  TYPOGRAPHY,
  GRID_GAPS,
} from '@/lib/design-tokens';

const deliverables = [
  {
    icon: FileText,
    title: 'Automation Blueprint',
    description: 'FSM + triggers + guardrails documented',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Target,
    title: 'Agent Runbooks',
    description: 'Prompt contracts and operational procedures',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Zap,
    title: 'Connector Map',
    description: 'APIs, webhooks, and queues defined',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Observability Pack',
    description: 'Logs, alerts, and error budgets',
    gradient: 'from-orange-500 to-red-500',
  },
];

const guardrails = [
  {
    icon: Lock,
    title: 'Least Privilege',
    description: 'Agents access only what they need',
  },
  {
    icon: Shield,
    title: 'PII Handling',
    description: 'Sensitive data properly masked',
  },
  {
    icon: CheckCircle2,
    title: 'Audit Logs',
    description: 'Every action is traceable',
  },
  {
    icon: Users,
    title: 'Human-in-the-Loop',
    description: 'Critical decisions reviewed by humans',
  },
];

const reliability = [
  {
    icon: Clock,
    title: 'Retries + Backoff',
    description: 'Graceful degradation on failures',
  },
  {
    icon: Award,
    title: 'Circuit Breakers',
    description: 'Prevent cascade failures',
  },
  {
    icon: Target,
    title: 'Idempotency Keys',
    description: 'Safe retry without duplication',
  },
];

export function TrustBadges() {
  return (
    <section
      aria-label='Deliverables and responsible AI practices'
      className={getSectionClasses('default', 'default')}
    >
      <div className={getContainerClasses('wide')}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          {...({ className: 'mb-16' } as any)}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
            {...({ className: `${TYPOGRAPHY.h2} text-center mb-4` } as any)}
          >
            What We Deliver
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
            {...({
              className: `text-center text-muted-foreground ${TYPOGRAPHY.body}`,
            } as any)}
          >
            Concrete artifacts you own after every engagement
          </motion.p>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${GRID_GAPS.default}`}
          >
            {deliverables.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <Card className='h-full border-2 text-center transition-all hover:border-primary/50 hover:shadow-lg'>
                    <CardContent className='px-4 pb-6 pt-6'>
                      <div
                        className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${item.gradient}`}
                      >
                        <Icon
                          aria-hidden='true'
                          className='h-6 w-6 text-white'
                        />
                      </div>
                      <div className={`font-bold ${TYPOGRAPHY.bodySmall} mb-1`}>
                        {item.title}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {item.description}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          {...({ className: 'mb-16' } as any)}
        >
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
            {...({ className: `${TYPOGRAPHY.h3} text-center mb-8` } as any)}
          >
            Responsible Agentic Ops
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
            {...({
              className: `text-center text-muted-foreground ${TYPOGRAPHY.body} mb-8`,
            } as any)}
          >
            Built-in guardrails and reliability patterns for every deployment
          </motion.p>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${GRID_GAPS.default}`}
          >
            {guardrails.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <Card className='h-full border-2 transition-all hover:border-primary/50 hover:shadow-lg'>
                    <CardContent className='px-4 pb-6 pt-6'>
                      <div className='flex items-center gap-4'>
                        <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10'>
                          <Icon
                            aria-hidden='true'
                            className='h-6 w-6 text-primary'
                          />
                        </div>
                        <div className='flex-1'>
                          <div
                            className={`font-bold ${TYPOGRAPHY.bodySmall} mb-1`}
                          >
                            {item.title}
                          </div>
                          <div className='text-sm text-muted-foreground'>
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          {...({ className: 'mb-12' } as any)}
        >
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
            {...({ className: `${TYPOGRAPHY.h4} text-center mb-6` } as any)}
          >
            Reliability Engineering
          </motion.h4>
          <div
            className={`grid grid-cols-1 sm:grid-cols-3 ${GRID_GAPS.default}`}
          >
            {reliability.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <Card className='h-full border-2 text-center transition-all hover:border-primary/50 hover:shadow-lg'>
                    <CardContent className='px-4 pb-6 pt-6'>
                      <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                        <Icon
                          aria-hidden='true'
                          className='h-6 w-6 text-primary'
                        />
                      </div>
                      <div className={`font-bold ${TYPOGRAPHY.bodySmall} mb-1`}>
                        {item.title}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {item.description}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          {...({ className: 'mt-12 pt-8 border-t border-border' } as any)}
        >
          <div
            className={`flex flex-wrap items-center justify-center gap-4 md:gap-6 ${TYPOGRAPHY.bodySmall}`}
          >
            <div className='flex items-center gap-2 font-semibold text-foreground'>
              <Globe aria-hidden='true' className='h-5 w-5 text-primary' />
              <span>🇨🇦 Canadian Operations</span>
            </div>
            <div className='flex items-center gap-2 font-semibold text-foreground'>
              <Lock aria-hidden='true' className='h-5 w-5 text-primary' />
              <span>Privacy-First Approach</span>
            </div>
            <div className='flex items-center gap-2 font-semibold text-foreground'>
              <Award aria-hidden='true' className='h-5 w-5 text-primary' />
              <span>Systems Thinking Methodology</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

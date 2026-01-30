'use client';
import { motion } from 'framer-motion';
import { Sparkles, Zap, DollarSign, Lock, FileText } from 'lucide-react';

import FadeIn from '@/components/motion/fade-in';
import { StaggerList, StaggerItem } from '@/components/motion/stagger-list';
import { BentoGrid, BentoGridItem } from '@/components/ui/BentoGrid';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { TextReveal } from '@/components/ui/TextReveal';
import {
  getSectionClasses,
  getContainerClasses,
  TYPOGRAPHY,
  GRID_GAPS,
} from '@/lib/design-tokens';

const features = [
  {
    title: 'No-Code AI Agents',
    description:
      'Build custom AI agents with drag-and-drop interface. No coding required. Deploy in 30 minutes.',
    icon: Sparkles,
    gradient: 'from-blue-500 to-cyan-500',
    highlight: true,
  },
  {
    title: 'Canadian Integrations',
    description:
      '20+ Canadian-first integrations: Shopify, Wave Accounting, Stripe CAD, RBC, TD, Interac. Built for Canadian businesses.',
    icon: Zap,
    gradient: 'from-red-500 to-pink-500',
  },
  {
    title: 'Save 10+ Hours/Week',
    description:
      'Automate repetitive tasks automatically. Reduce manual errors by 90%. Focus on high-value work.',
    icon: Zap,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Affordable CAD Pricing',
    description:
      'CAD $49/month (vs. $150+ competitors). Transparent GST/HST. Annual discounts available. Cancel anytime.',
    icon: DollarSign,
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    title: 'PIPEDA Compliant',
    description:
      'Canadian data residency. PIPEDA-compliant privacy policy. Enterprise security. Your data stays in Canada.',
    icon: Lock,
    gradient: 'from-purple-500 to-indigo-500',
  },
  {
    title: '50+ Pre-Built Templates',
    description:
      'E-commerce automation, customer support, invoice processing, lead qualification. Industry-specific templates.',
    icon: FileText,
    gradient: 'from-pink-500 to-rose-500',
  },
];

export function Features() {
  return (
    <section className={getSectionClasses('default', 'gradient')}>
      {/* Background decoration */}
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent' />

      <div className={getContainerClasses('default', 'relative z-10')}>
        <FadeIn>
          <div className='mb-16 text-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
              {...({ className: 'inline-block mb-4' } as any)}
            >
              <span
                className={`rounded-full bg-primary/10 px-4 py-2 text-primary ${TYPOGRAPHY.badge} border border-primary/20`}
              >
                Powerful Features
              </span>
            </motion.div>
            <TextReveal
              as='h2'
              className={`${TYPOGRAPHY.h2} mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent`}
              delay={0.1}
              staggerDelay={0.03}
            >
              Automate Your Workflows. Save Time. Grow Your Business.
            </TextReveal>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
              {...({
                className: `${TYPOGRAPHY.body} text-muted-foreground max-w-3xl mx-auto`,
              } as any)}
            >
              Connect your tools, automate repetitive tasks, and get insights
              that help you make better decisions. No coding required. Start in
              minutes.
            </motion.p>
          </div>
        </FadeIn>

        <StaggerList>
          <BentoGrid className='relative z-10' columns={3}>
            {features.map(feature => {
              const Icon = feature.icon;
              const isWide = feature.highlight;
              return (
                <BentoGridItem
                  key={feature.title}
                  colSpan={isWide ? 2 : 1}
                  rowSpan={1}
                >
                  <StaggerItem>
                    <SpotlightCard
                      className='h-full'
                      spotlightColor={
                        isWide
                          ? 'rgba(6, 182, 212, 0.2)'
                          : 'rgba(168, 85, 247, 0.15)'
                      }
                    >
                      <Card
                        className={`h-full border-0 bg-transparent shadow-none ${
                          feature.highlight
                            ? 'bg-gradient-to-br from-primary/5 to-transparent'
                            : ''
                        }`}
                      >
                        <CardHeader className='pb-4'>
                          <motion.div
                            transition={{ type: 'spring', stiffness: 300 }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            {...({
                              className: `inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 shadow-lg`,
                            } as any)}
                          >
                            <Icon className='h-7 w-7 text-white' />
                          </motion.div>
                          <CardTitle
                            className={`mb-2 text-xl ${feature.highlight ? 'text-primary' : ''}`}
                          >
                            {feature.title}
                          </CardTitle>
                          <CardDescription className='text-base leading-relaxed'>
                            {feature.description}
                          </CardDescription>
                        </CardHeader>
                        {feature.highlight && (
                          <CardContent className='pt-0'>
                            <div
                              className={`flex items-center gap-2 ${TYPOGRAPHY.badge} text-primary`}
                            >
                              <Sparkles className='h-4 w-4' />
                              <span>Most Popular</span>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    </SpotlightCard>
                  </StaggerItem>
                </BentoGridItem>
              );
            })}
          </BentoGrid>
        </StaggerList>
      </div>
    </section>
  );
}

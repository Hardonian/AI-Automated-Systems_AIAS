'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import FadeIn from '@/components/motion/fade-in';
import { Sparkles, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export function CTASection() {
  return (
    <section className='relative overflow-hidden py-24 md:py-32'>
      {/* Enhanced background */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]' />

      <FadeIn>
        <div className='container relative z-10 mx-auto max-w-5xl'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className='border-2 border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 shadow-2xl backdrop-blur-sm'>
              <CardHeader className='pb-8 text-center'>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  {...({
                    className:
                      'inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-6 shadow-xl',
                  } as any)}
                >
                  <Sparkles className='h-10 w-10 text-white' />
                </motion.div>
                <CardTitle className='mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl lg:text-6xl'>
                  Start Saving 10+ Hours/Week Today
                </CardTitle>
                <CardDescription className='mx-auto max-w-2xl text-lg md:text-xl'>
                  Join 2,000+ businesses worldwide automating with AIAS
                  Platform. No credit card required. 30-day free trial. Cancel
                  anytime.
                </CardDescription>
              </CardHeader>

              <CardContent className='space-y-8'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                  {[
                    {
                      icon: Zap,
                      title: '30-Minute Setup',
                      desc: 'Get started in minutes, not days',
                    },
                    {
                      icon: Sparkles,
                      title: '100+ Integrations',
                      desc: 'Connect your existing tools',
                    },
                    {
                      icon: Shield,
                      title: 'PIPEDA Compliant',
                      desc: 'Enterprise security & privacy',
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      {...({
                        className:
                          'flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all',
                      } as any)}
                    >
                      <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent'>
                        <item.icon className='h-5 w-5 text-white' />
                      </div>
                      <div>
                        <div className='mb-1 font-bold text-foreground'>
                          {item.title}
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  {...({
                    className:
                      'bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 p-6 rounded-xl border-2 border-primary/20',
                  } as any)}
                >
                  <div className='mb-4 flex items-center justify-center gap-2'>
                    <span className='bg-gradient-to-r from-primary to-accent bg-clip-text text-3xl font-extrabold text-transparent'>
                      CAD $49/month
                    </span>
                  </div>
                  <p className='mb-3 text-center font-semibold text-foreground'>
                    Transparent pricing, no hidden fees
                  </p>
                  <p className='mb-3 text-center text-sm text-muted-foreground'>
                    Save 10+ hours/week • Reduce errors by 90% • Focus on
                    high-value work
                  </p>
                  <div className='flex flex-wrap items-center justify-center gap-3 text-sm'>
                    <span className='rounded-full border border-border bg-card px-3 py-1 font-medium'>
                      🇨🇦 Built in Canada
                    </span>
                    <span className='rounded-full border border-border bg-card px-3 py-1 font-medium'>
                      🌍 Trusted Worldwide
                    </span>
                    <span className='rounded-full border border-border bg-card px-3 py-1 font-medium'>
                      🔒 Enterprise Security
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  {...({
                    className: 'flex flex-col sm:flex-row gap-4 justify-center',
                  } as any)}
                >
                  <Button
                    size='lg'
                    className='group h-14 px-10 text-lg font-bold shadow-xl transition-all hover:scale-105 hover:shadow-2xl'
                    asChild
                  >
                    <Link href='/signup'>
                      Start 30-Day Free Trial
                      <Sparkles className='ml-2 h-5 w-5 transition-transform group-hover:rotate-12' />
                    </Link>
                  </Button>
                  <Button
                    size='lg'
                    variant='outline'
                    className='h-14 border-2 px-10 text-lg font-bold transition-all hover:scale-105 hover:border-primary/50 hover:bg-primary/5'
                    asChild
                  >
                    <Link href='/demo'>Book Demo</Link>
                  </Button>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  {...({
                    className:
                      'text-sm text-muted-foreground text-center font-medium',
                  } as any)}
                >
                  ✨ No credit card required • 🎁 30-day free trial • 🔄 Cancel
                  anytime
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </FadeIn>
    </section>
  );
}

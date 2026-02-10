import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Calculator } from 'lucide-react';

// import { Play } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className='bg-gradient-hero relative flex min-h-screen items-center justify-center overflow-hidden'
    >
      {/* Animated mesh background */}
      <motion.div
        className='bg-gradient-mesh absolute inset-0'
        style={{ opacity }}
      />

      {/* Floating orbs */}
      <div className='absolute inset-0 overflow-hidden'>
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          className='absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl'
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          className='absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/20 blur-3xl'
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      <motion.div
        className='container relative z-10 mx-auto px-4 py-32'
        style={{ y }}
      >
        <div className='mx-auto max-w-5xl space-y-8 text-center'>
          {/* Badge */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className='shadow-glow inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/50 px-6 py-3 backdrop-blur-sm'>
              <Sparkles className='h-5 w-5 animate-pulse text-primary' />
              <span className='bg-gradient-accent bg-clip-text text-sm font-semibold text-transparent'>
                We Build Intelligent Systems That Think For You
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1 className='text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl'>
              <span className='mb-2 block sm:mb-4'>AI Agent &</span>
              <span className='bg-gradient-accent block animate-shimmer bg-[length:200%_100%] bg-clip-text text-transparent'>
                Automation Consultancy
              </span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className='mx-auto max-w-3xl px-4 text-lg leading-relaxed text-muted-foreground sm:text-xl md:text-2xl lg:text-3xl'
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Stop scaling chaos. Start scaling intelligence.
            <span className='mt-2 block text-foreground/90'>
              Out-of-the-box solutions or fully customized agentic workflows.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className='flex flex-col items-stretch justify-center gap-3 px-4 pt-6 sm:flex-row sm:items-center sm:gap-4 sm:pt-8'
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div
              className='w-full sm:w-auto'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                className='bg-gradient-primary shadow-glow group min-h-[48px] w-full px-8 py-6 text-base transition-all hover:shadow-accent sm:w-auto sm:px-10 sm:py-7 sm:text-lg'
                size='lg'
              >
                Schedule Consultation
                <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5' />
              </Button>
            </motion.div>

            <Link className='w-full sm:w-auto' to='/roi-calculator'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className='min-h-[48px] w-full border-primary/30 bg-card/30 px-8 py-6 text-base backdrop-blur-sm hover:border-accent hover:text-accent sm:w-auto sm:px-10 sm:py-7 sm:text-lg'
                  size='lg'
                  variant='outline'
                >
                  <Calculator className='mr-2 h-4 w-4 sm:h-5 sm:w-5' />
                  Calculate ROI
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Enhanced Stats with Proof Points */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className='mx-auto grid max-w-5xl grid-cols-1 gap-4 px-4 pt-12 sm:grid-cols-2 sm:gap-6 sm:pt-16 md:gap-8 md:pt-24 lg:grid-cols-4'
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {[
              {
                value: '42+',
                label: 'Active Workflows',
                subtext: 'Across 15+ Industries',
                delay: 0,
                icon: '⚡',
              },
              {
                value: '10k+',
                label: 'Hours Saved',
                subtext: 'Monthly for Clients',
                delay: 0.1,
                icon: '⏱️',
              },
              {
                value: '24/7',
                label: 'AI Operations',
                subtext: 'Zero Downtime',
                delay: 0.2,
                icon: '🤖',
              },
              {
                value: '99.9%',
                label: 'Uptime',
                subtext: 'Enterprise SLA',
                delay: 0.3,
                icon: '🛡️',
              },
            ].map((stat, index) => (
              <motion.div
                key={`stat-${index}`}
                animate={{ opacity: 1, scale: 1 }}
                className='group relative'
                initial={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 1.2 + stat.delay }}
                whileHover={{ scale: 1.05, y: -8 }}
              >
                <div className='rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 group-hover:border-primary/50 sm:p-6'>
                  <motion.div className='bg-gradient-primary absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-5' />
                  <div className='relative text-center'>
                    <div className='mb-2 text-2xl'>{stat.icon}</div>
                    <div className='bg-gradient-accent bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl'>
                      {stat.value}
                    </div>
                    <div className='mt-1 text-sm font-semibold text-foreground'>
                      {stat.label}
                    </div>
                    <div className='mt-1 text-xs text-muted-foreground'>
                      {stat.subtext}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ opacity: 1 }}
            className='pt-16'
            initial={{ opacity: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              className='inline-flex flex-col items-center gap-2 text-muted-foreground'
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className='text-sm'>Explore Solutions</span>
              <div className='flex h-10 w-6 items-start justify-center rounded-full border-2 border-primary/30 p-2'>
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  className='h-1.5 w-1.5 rounded-full bg-primary'
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Gradient overlay at bottom */}
      <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent' />
    </section>
  );
};

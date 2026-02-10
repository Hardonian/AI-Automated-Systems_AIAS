import { motion, useInView } from 'framer-motion';
import {
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Zap,
  Shield,
  CheckCircle,
} from 'lucide-react';
import { useRef, useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';

export const InteractiveProofPoints = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const proofPoints = [
    {
      icon: TrendingUp,
      value: '300%',
      label: 'Average ROI',
      description: 'Clients see 3x return on investment within 6 months',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      delay: 0,
    },
    {
      icon: Clock,
      value: '80%',
      label: 'Time Saved',
      description: 'Automated workflows reduce manual work by 80%',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      delay: 0.1,
    },
    {
      icon: DollarSign,
      value: '$2M+',
      label: 'Cost Savings',
      description: 'Combined operational cost savings for our clients',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      delay: 0.2,
    },
    {
      icon: Users,
      value: '50+',
      label: 'Enterprise Clients',
      description: 'Fortune 500 companies trust our solutions',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      delay: 0.3,
    },
    {
      icon: Zap,
      value: '24h',
      label: 'Deployment',
      description: 'Rapid deployment in 24 hours, not months',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      delay: 0.4,
    },
    {
      icon: Shield,
      value: '99.9%',
      label: 'Uptime',
      description: 'Enterprise-grade reliability and security',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      delay: 0.5,
    },
  ];

  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background Elements */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5' />

      <div className='container relative z-10 mx-auto px-4'>
        <motion.div
          className='mb-16 text-center'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className='mb-6 text-4xl font-bold sm:text-5xl md:text-6xl'>
            Numbers That
            <span className='bg-gradient-accent mt-2 block bg-clip-text text-transparent'>
              Don&apos;t Lie
            </span>
          </h2>
          <p className='mx-auto max-w-3xl text-xl text-muted-foreground'>
            Real results from real clients. See why enterprises choose AIAS for
            their automation needs.
          </p>
        </motion.div>

        <div
          ref={ref}
          className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
        >
          {proofPoints.map((point, index) => (
            <motion.div
              key={point.label}
              animate={
                isInView
                  ? {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }
                  : {}
              }
              className='group cursor-pointer'
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              transition={{
                duration: 0.6,
                delay: point.delay,
                type: 'spring',
                stiffness: 100,
              }}
              whileHover={{
                scale: 1.05,
                y: -10,
                transition: { duration: 0.2 },
              }}
              onHoverEnd={() => setHoveredCard(null)}
              onHoverStart={() => setHoveredCard(index)}
            >
              <Card
                className={`bg-gradient-card h-full border backdrop-blur-sm ${point.borderColor} transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 ${hoveredCard === index ? 'ring-2 ring-primary/20' : ''}`}
              >
                <CardContent className='relative overflow-hidden p-6 text-center'>
                  {/* Animated Background */}
                  <motion.div
                    animate={
                      hoveredCard === index ? { scale: 1 } : { scale: 0 }
                    }
                    className={`absolute inset-0 ${point.bgColor} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                    initial={{ scale: 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Icon */}
                  <motion.div
                    className={`relative z-10 rounded-full p-4 ${point.bgColor} mx-auto mb-4 w-fit transition-transform duration-300 group-hover:scale-110`}
                    transition={{ duration: 0.6 }}
                    whileHover={{ rotate: 360 }}
                  >
                    <point.icon className={`h-8 w-8 ${point.color}`} />
                  </motion.div>

                  {/* Value */}
                  <motion.div
                    animate={
                      hoveredCard === index ? { scale: 1.1 } : { scale: 1 }
                    }
                    className={`relative z-10 text-4xl font-bold ${point.color} mb-2`}
                    transition={{ duration: 0.2 }}
                  >
                    {point.value}
                  </motion.div>

                  {/* Label */}
                  <h3 className='relative z-10 mb-2 text-lg font-semibold transition-colors group-hover:text-primary'>
                    {point.label}
                  </h3>

                  {/* Description */}
                  <p className='relative z-10 text-sm leading-relaxed text-muted-foreground'>
                    {point.description}
                  </p>

                  {/* Animated Border */}
                  <motion.div
                    animate={
                      hoveredCard === index ? { scale: 1 } : { scale: 0.8 }
                    }
                    className='absolute inset-0 rounded-lg border-2 border-primary/20 opacity-0 group-hover:opacity-100'
                    initial={{ scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Pulse Effect */}
                  {hoveredCard === index && (
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      className='absolute inset-0 rounded-lg border-2 border-primary/40'
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className='mt-16 text-center'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className='bg-gradient-primary/10 hover:bg-gradient-primary/20 group inline-flex cursor-pointer items-center gap-3 rounded-full border border-primary/20 px-8 py-4 transition-all duration-300'>
            <CheckCircle className='h-5 w-5 text-primary transition-transform group-hover:scale-110' />
            <span className='text-sm font-semibold text-primary'>
              Ready to achieve these results for your business?
            </span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              className='text-primary'
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

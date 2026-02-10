import { motion } from 'framer-motion';
import {
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Star,
  CheckCircle,
  Zap,
  Shield,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const InfoCards = () => {
  const proofPoints = [
    {
      icon: TrendingUp,
      title: '300% Average ROI',
      description: 'Clients see 3x return on investment within 6 months',
      metric: '6 months',
      color: 'text-green-500',
    },
    {
      icon: Clock,
      title: '80% Time Savings',
      description: 'Automated workflows reduce manual work by 80%',
      metric: '80%',
      color: 'text-blue-500',
    },
    {
      icon: DollarSign,
      title: '$2M+ Saved',
      description: 'Combined operational cost savings for our clients',
      metric: '$2M+',
      color: 'text-emerald-500',
    },
    {
      icon: Users,
      title: '50+ Enterprises',
      description: 'Fortune 500 companies trust our solutions',
      metric: '50+',
      color: 'text-purple-500',
    },
  ];

  const testimonials = [
    {
      quote:
        'AIAS transformed our entire workflow. What used to take our team 40 hours now takes 2 hours with their AI automation.',
      author: 'Sarah Chen',
      role: 'VP of Operations',
      company: 'TechCorp Inc.',
      rating: 5,
      avatar: '👩‍💼',
    },
    {
      quote:
        "The ROI was immediate. We saved $500K in the first quarter alone. Best investment we've made in years.",
      author: 'Michael Rodriguez',
      role: 'CTO',
      company: 'FinanceFlow',
      rating: 5,
      avatar: '👨‍💻',
    },
    {
      quote:
        'Their AI agents work 24/7 without breaks. Our customer satisfaction increased by 40% since implementation.',
      author: 'Emily Johnson',
      role: 'Head of Customer Success',
      company: 'ServicePro',
      rating: 5,
      avatar: '👩‍🎓',
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast Setup',
      description: 'Deploy in 24 hours, not months',
      highlight: '24h',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2, GDPR, HIPAA compliant',
      highlight: 'SOC 2',
    },
    {
      icon: CheckCircle,
      title: '99.9% Uptime',
      description: 'Reliable operations guaranteed',
      highlight: '99.9%',
    },
  ];

  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background Elements */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5' />

      <div className='container relative z-10 mx-auto px-4'>
        {/* Proof Points */}
        <motion.div
          className='mb-20'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-4xl font-bold sm:text-5xl'>
              Proven Results
              <span className='bg-gradient-accent mt-2 block bg-clip-text text-transparent'>
                That Speak for Themselves
              </span>
            </h2>
            <p className='mx-auto max-w-3xl text-xl text-muted-foreground'>
              Real metrics from real clients. See why enterprises choose AIAS
              for their automation needs.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {proofPoints.map((point, index) => (
              <motion.div
                key={point.title}
                className='group'
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -8 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className='bg-gradient-card h-full border border-border backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 group-hover:border-primary/50'>
                  <CardContent className='p-6 text-center'>
                    <div
                      className={`mx-auto mb-4 w-fit rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20`}
                    >
                      <point.icon className={`h-8 w-8 ${point.color}`} />
                    </div>
                    <div className={`mb-2 text-4xl font-bold ${point.color}`}>
                      {point.metric}
                    </div>
                    <h3 className='mb-2 text-lg font-semibold'>
                      {point.title}
                    </h3>
                    <p className='text-sm text-muted-foreground'>
                      {point.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          className='mb-20'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-4xl font-bold sm:text-5xl'>
              What Our Clients
              <span className='bg-gradient-accent mt-2 block bg-clip-text text-transparent'>
                Are Saying
              </span>
            </h2>
            <p className='mx-auto max-w-3xl text-xl text-muted-foreground'>
              Don&apos;t just take our word for it. Hear from the leaders
              who&apos;ve transformed their businesses with AIAS.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                className='group'
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className='bg-gradient-card h-full border border-border backdrop-blur-sm transition-all duration-300 hover:shadow-xl group-hover:border-primary/50'>
                  <CardContent className='p-6'>
                    <div className='mb-4 flex items-center gap-1'>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={`star-${i}`}
                          className='h-4 w-4 fill-yellow-400 text-yellow-400'
                        />
                      ))}
                    </div>
                    <blockquote className='mb-6 italic text-muted-foreground'>
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div className='flex items-center gap-3'>
                      <div className='text-2xl'>{testimonial.avatar}</div>
                      <div>
                        <div className='font-semibold'>
                          {testimonial.author}
                        </div>
                        <div className='text-sm text-muted-foreground'>
                          {testimonial.role}, {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-4xl font-bold sm:text-5xl'>
              Why Choose
              <span className='bg-gradient-accent mt-2 block bg-clip-text text-transparent'>
                AIAS?
              </span>
            </h2>
            <p className='mx-auto max-w-3xl text-xl text-muted-foreground'>
              We combine cutting-edge AI technology with enterprise-grade
              reliability and security.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className='group'
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className='bg-gradient-card h-full border border-border backdrop-blur-sm transition-all duration-300 hover:shadow-xl group-hover:border-primary/50'>
                  <CardContent className='p-6 text-center'>
                    <div className='mx-auto mb-4 w-fit rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20'>
                      <feature.icon className='h-8 w-8 text-primary' />
                    </div>
                    <Badge
                      className='mb-4 px-3 py-1 text-sm'
                      variant='secondary'
                    >
                      {feature.highlight}
                    </Badge>
                    <h3 className='mb-2 text-xl font-semibold'>
                      {feature.title}
                    </h3>
                    <p className='text-muted-foreground'>
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

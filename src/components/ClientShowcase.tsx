import { motion, useInView } from 'framer-motion';
import { Building2, TrendingUp, Users, Award, CheckCircle } from 'lucide-react';
import { useRef } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const ClientShowcase = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const clients = [
    {
      name: 'TechCorp Inc.',
      industry: 'Technology',
      logo: '🏢',
      size: 'Fortune 500',
    },
    {
      name: 'FinanceFlow',
      industry: 'Financial Services',
      logo: '💼',
      size: 'Enterprise',
    },
    {
      name: 'ServicePro',
      industry: 'Professional Services',
      logo: '⚡',
      size: 'Mid-Market',
    },
    { name: 'RetailMax', industry: 'Retail', logo: '🛍️', size: 'Enterprise' },
    {
      name: 'HealthTech',
      industry: 'Healthcare',
      logo: '🏥',
      size: 'Fortune 500',
    },
    { name: 'EduSoft', industry: 'Education', logo: '🎓', size: 'Mid-Market' },
  ];

  const caseStudies = [
    {
      client: 'TechCorp Inc.',
      industry: 'Technology',
      challenge: 'Manual data processing taking 40+ hours weekly',
      solution: 'AI-powered data pipeline automation',
      results: [
        '95% reduction in processing time',
        '$500K annual cost savings',
        '99.9% accuracy improvement',
      ],
      logo: '🏢',
      color: 'text-blue-500',
    },
    {
      client: 'FinanceFlow',
      industry: 'Financial Services',
      challenge: 'Compliance reporting consuming 60% of team time',
      solution: 'Automated compliance monitoring system',
      results: [
        '80% time savings on reporting',
        '100% compliance rate maintained',
        'Real-time risk monitoring',
      ],
      logo: '💼',
      color: 'text-green-500',
    },
    {
      client: 'ServicePro',
      industry: 'Professional Services',
      challenge: 'Client onboarding taking 2+ weeks per client',
      solution: 'Intelligent workflow automation platform',
      results: [
        '70% faster onboarding',
        '40% increase in client satisfaction',
        '50% reduction in manual errors',
      ],
      logo: '⚡',
      color: 'text-purple-500',
    },
  ];

  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background Elements */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5' />

      <div className='container relative z-10 mx-auto px-4'>
        {/* Section Header */}
        <motion.div
          className='mb-16 text-center'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className='mb-6 text-4xl font-bold sm:text-5xl md:text-6xl'>
            Trusted by Industry
            <span className='bg-gradient-accent mt-2 block bg-clip-text text-transparent'>
              Leaders
            </span>
          </h2>
          <p className='mx-auto max-w-3xl text-xl text-muted-foreground'>
            From Fortune 500 companies to growing startups, see who&apos;s
            transforming their operations with AIAS.
          </p>
        </motion.div>

        {/* Client Logos */}
        <motion.div
          ref={ref}
          className='mb-20'
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className='grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6'>
            {clients.map((client, index) => (
              <motion.div
                key={client.name}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                className='group'
                initial={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <Card className='bg-gradient-card h-full border border-border backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl'>
                  <CardContent className='p-6 text-center'>
                    <div className='mb-3 text-4xl transition-transform duration-300 group-hover:scale-110'>
                      {client.logo}
                    </div>
                    <h3 className='mb-1 text-sm font-semibold'>
                      {client.name}
                    </h3>
                    <p className='mb-2 text-xs text-muted-foreground'>
                      {client.industry}
                    </p>
                    <Badge className='text-xs' variant='outline'>
                      {client.size}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Case Studies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className='mb-12 text-center'>
            <h3 className='mb-4 text-3xl font-bold'>Success Stories</h3>
            <p className='text-lg text-muted-foreground'>
              Real transformations from real clients
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.client}
                className='group'
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className='bg-gradient-card h-full border border-border backdrop-blur-sm transition-all duration-300 hover:shadow-2xl group-hover:border-primary/50'>
                  <CardContent className='p-6'>
                    {/* Header */}
                    <div className='mb-4 flex items-center gap-3'>
                      <div className='text-3xl'>{study.logo}</div>
                      <div>
                        <h4 className='text-lg font-bold'>{study.client}</h4>
                        <p className='text-sm text-muted-foreground'>
                          {study.industry}
                        </p>
                      </div>
                    </div>

                    {/* Challenge */}
                    <div className='mb-4'>
                      <h5 className='mb-2 text-sm font-semibold text-muted-foreground'>
                        Challenge
                      </h5>
                      <p className='text-sm'>{study.challenge}</p>
                    </div>

                    {/* Solution */}
                    <div className='mb-4'>
                      <h5 className='mb-2 text-sm font-semibold text-muted-foreground'>
                        Solution
                      </h5>
                      <p className='text-sm'>{study.solution}</p>
                    </div>

                    {/* Results */}
                    <div>
                      <h5 className='mb-3 text-sm font-semibold text-muted-foreground'>
                        Results
                      </h5>
                      <div className='space-y-2'>
                        {study.results.map((result, idx) => (
                          <div
                            key={`${study.client}-result-${idx}`}
                            className='flex items-center gap-2'
                          >
                            <CheckCircle
                              className={`h-4 w-4 ${study.color} flex-shrink-0`}
                            />
                            <span className='text-sm'>{result}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className='absolute inset-0 rounded-lg border-2 border-primary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          className='mt-20'
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
            {[
              { icon: Building2, value: '50+', label: 'Enterprise Clients' },
              { icon: TrendingUp, value: '300%', label: 'Average ROI' },
              { icon: Users, value: '10k+', label: 'Hours Saved' },
              { icon: Award, value: '99.9%', label: 'Client Satisfaction' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className='text-center'
                initial={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileInView={{ opacity: 1, scale: 1 }}
              >
                <Card className='bg-gradient-card border border-border backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl'>
                  <CardContent className='p-6'>
                    <div className='mx-auto mb-4 w-fit rounded-full bg-primary/10 p-3'>
                      <stat.icon className='h-6 w-6 text-primary' />
                    </div>
                    <div className='bg-gradient-accent mb-2 bg-clip-text text-3xl font-bold text-transparent'>
                      {stat.value}
                    </div>
                    <div className='text-sm font-semibold'>{stat.label}</div>
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

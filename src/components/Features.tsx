import { motion } from 'framer-motion';
import {
  Bot,
  Zap,
  Shield,
  Clock,
  BarChart,
  Code,
  Brain,
  Workflow,
  Database,
  TrendingUp,
} from 'lucide-react';

// import { Globe, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: Bot,
    title: 'Advanced AI Engine',
    description:
      'Powered by state-of-the-art language models for intelligent automation and insights.',
    highlight: 'GPT-4 Powered',
    color: 'text-blue-500',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Real-time responses with optimized performance for enterprise-scale operations.',
    highlight: '< 100ms',
    color: 'text-yellow-500',
    gradient: 'from-yellow-500/20 to-orange-500/20',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA standards.',
    highlight: 'SOC 2',
    color: 'text-green-500',
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description:
      'Your AI assistant never sleeps, providing round-the-clock support and automation.',
    highlight: '99.9% Uptime',
    color: 'text-purple-500',
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    icon: BarChart,
    title: 'Analytics Dashboard',
    description:
      'Comprehensive insights and metrics to track performance and ROI.',
    highlight: 'Real-time',
    color: 'text-indigo-500',
    gradient: 'from-indigo-500/20 to-blue-500/20',
  },
  {
    icon: Code,
    title: 'API Integration',
    description:
      'Seamlessly integrate with your existing tools and workflows via REST API.',
    highlight: '100+ APIs',
    color: 'text-red-500',
    gradient: 'from-red-500/20 to-rose-500/20',
  },
  {
    icon: Brain,
    title: 'Machine Learning',
    description:
      'Self-improving algorithms that learn from your data and optimize over time.',
    highlight: 'Self-Learning',
    color: 'text-teal-500',
    gradient: 'from-teal-500/20 to-cyan-500/20',
  },
  {
    icon: Workflow,
    title: 'Workflow Automation',
    description:
      'Create complex multi-step workflows with drag-and-drop visual builder.',
    highlight: 'Visual Builder',
    color: 'text-orange-500',
    gradient: 'from-orange-500/20 to-yellow-500/20',
  },
  {
    icon: Database,
    title: 'Data Processing',
    description:
      'Handle massive datasets with advanced processing and real-time analytics.',
    highlight: 'Big Data',
    color: 'text-pink-500',
    gradient: 'from-pink-500/20 to-rose-500/20',
  },
];

export const Features = () => {
  return (
    <section className='relative overflow-hidden py-24' id='features'>
      {/* Background Elements */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5' />
      <div className='absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl' />
      <div className='absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl' />

      <div className='container relative z-10 mx-auto px-4'>
        {/* Section Header */}
        <motion.div
          className='mx-auto mb-16 max-w-4xl space-y-4 text-center'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className='px-4 text-4xl font-bold sm:text-5xl md:text-6xl'>
            Powerful Features for
            <span className='bg-gradient-accent mt-2 block bg-clip-text text-transparent'>
              Modern Enterprises
            </span>
          </h2>
          <p className='px-4 text-xl text-muted-foreground'>
            Everything you need to supercharge your business with AI-powered
            automation
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className='group relative'
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -8 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className='bg-gradient-card h-full rounded-2xl border border-border p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10'>
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div className='relative z-10'>
                  {/* Icon and Badge */}
                  <div className='mb-4 flex items-center justify-between'>
                    <div
                      className={`rounded-xl bg-gradient-to-br p-3 ${feature.gradient} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <Badge className='px-3 py-1 text-xs' variant='secondary'>
                      {feature.highlight}
                    </Badge>
                  </div>

                  {/* Title and Description */}
                  <h3 className='mb-3 text-xl font-semibold transition-colors group-hover:text-primary'>
                    {feature.title}
                  </h3>
                  <p className='leading-relaxed text-muted-foreground'>
                    {feature.description}
                  </p>

                  {/* Hover Effect Indicator */}
                  <div className='mt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                    <div className='h-0.5 w-full rounded-full bg-gradient-to-r from-primary to-accent' />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className='mt-16 text-center'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className='bg-gradient-primary/10 inline-flex items-center gap-2 rounded-full border border-primary/20 px-6 py-3'>
            <TrendingUp className='h-5 w-5 text-primary' />
            <span className='text-sm font-semibold text-primary'>
              Ready to see these features in action?
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

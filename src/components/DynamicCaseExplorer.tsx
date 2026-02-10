import { motion } from 'framer-motion';
import {
  Zap,
  TrendingUp,
  Users,
  Database,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { useState } from 'react';

const cases = [
  {
    icon: MessageSquare,
    title: 'Customer Support Automation',
    industry: 'E-commerce',
    metric: '85% ticket reduction',
    description:
      'AI agent handles tier-1 support inquiries, reducing response time from hours to seconds.',
    tags: ['Chatbot', 'NLP', 'Workflow'],
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    icon: FileText,
    title: 'Invoice Processing System',
    industry: 'Finance',
    metric: '40 hrs saved/week',
    description:
      'Automated invoice extraction, validation, and routing across multiple departments.',
    tags: ['OCR', 'Automation', 'Integration'],
    gradient: 'from-purple-500 to-pink-400',
  },
  {
    icon: Users,
    title: 'Lead Qualification Agent',
    industry: 'B2B SaaS',
    metric: '94% accuracy',
    description:
      'AI scores and routes leads automatically, prioritizing high-value prospects.',
    tags: ['ML', 'CRM', 'Sales'],
    gradient: 'from-green-500 to-emerald-400',
  },
  {
    icon: Database,
    title: 'Data Pipeline Optimization',
    industry: 'Healthcare',
    metric: '3x faster processing',
    description:
      'Intelligent data aggregation from 12+ sources with real-time validation.',
    tags: ['ETL', 'Integration', 'Analytics'],
    gradient: 'from-orange-500 to-red-400',
  },
  {
    icon: TrendingUp,
    title: 'Predictive Analytics Dashboard',
    industry: 'Retail',
    metric: '22% revenue increase',
    description:
      'AI-powered forecasting system predicting inventory needs and sales trends.',
    tags: ['ML', 'Forecasting', 'BI'],
    gradient: 'from-yellow-500 to-amber-400',
  },
  {
    icon: Zap,
    title: 'Workflow Orchestration Platform',
    industry: 'Manufacturing',
    metric: '60% process efficiency',
    description:
      'Multi-system automation coordinating supply chain and production scheduling.',
    tags: ['Automation', 'Integration', 'IoT'],
    gradient: 'from-indigo-500 to-purple-400',
  },
];

export const DynamicCaseExplorer = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {cases.map((caseStudy, index) => {
        const isActive = activeIndex === index;

        return (
          <motion.div
            key={`case-${index}`}
            className='relative'
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
            onHoverEnd={() => setActiveIndex(null)}
            onHoverStart={() => setActiveIndex(index)}
          >
            <motion.div
              animate={{
                scale: isActive ? 1.05 : 1,
                y: isActive ? -8 : 0,
              }}
              className='hover:shadow-glow h-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow'
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Gradient overlay */}
              <motion.div
                animate={{ opacity: isActive ? 0.1 : 0 }}
                className={`absolute inset-0 bg-gradient-to-br ${caseStudy.gradient}`}
                transition={{ duration: 0.3 }}
              />

              <div className='relative z-10 space-y-4'>
                {/* Icon */}
                <div
                  className={`bg-gradient-to-br p-3 ${caseStudy.gradient} w-fit rounded-xl`}
                >
                  <caseStudy.icon className='h-6 w-6 text-white' />
                </div>

                {/* Content */}
                <div>
                  <div className='mb-2 flex items-start justify-between'>
                    <h3 className='line-clamp-2 text-xl font-bold'>
                      {caseStudy.title}
                    </h3>
                  </div>

                  <div className='mb-3 text-sm text-muted-foreground'>
                    {caseStudy.industry}
                  </div>

                  <motion.div
                    animate={{
                      height: isActive ? 'auto' : 0,
                      opacity: isActive ? 1 : 0,
                    }}
                    className='overflow-hidden'
                    initial={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className='mb-4 text-sm text-foreground/80'>
                      {caseStudy.description}
                    </p>
                  </motion.div>
                </div>

                {/* Metric */}
                <div className='rounded-lg border border-primary/20 bg-primary/10 p-3'>
                  <div className='bg-gradient-accent bg-clip-text text-2xl font-bold text-transparent'>
                    {caseStudy.metric}
                  </div>
                  <div className='mt-1 text-xs text-muted-foreground'>
                    Key Result
                  </div>
                </div>

                {/* Tags */}
                <div className='flex flex-wrap gap-2'>
                  {caseStudy.tags.map((tag, tagIndex) => (
                    <span
                      key={`${caseStudy.title}-tag-${tagIndex}`}
                      className='rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Animated border */}
              <motion.div
                animate={{
                  opacity: isActive ? 1 : 0,
                }}
                className={`absolute inset-0 rounded-2xl border-2 bg-gradient-to-br ${caseStudy.gradient} opacity-50`}
                style={{ padding: '2px' }}
                transition={{ duration: 0.3 }}
              >
                <div className='h-full w-full rounded-2xl bg-card' />
              </motion.div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

const questions = [
  {
    question: "What's your biggest operational challenge?",
    options: [
      { text: 'Repetitive manual tasks', value: 'automation' },
      { text: 'Data scattered across systems', value: 'integration' },
      { text: 'Slow customer response times', value: 'customer-service' },
      { text: 'Inefficient decision-making', value: 'analytics' },
    ],
  },
  {
    question: 'How large is your team?',
    options: [
      { text: '1-10 people', value: 'small' },
      { text: '11-50 people', value: 'medium' },
      { text: '51-200 people', value: 'large' },
      { text: '200+ people', value: 'enterprise' },
    ],
  },
  {
    question: 'What level of customization do you need?',
    options: [
      { text: 'Quick plug-and-play solution', value: 'out-of-box' },
      { text: 'Some customization needed', value: 'semi-custom' },
      { text: 'Fully tailored to our workflow', value: 'custom' },
      { text: 'Not sure yet', value: 'unsure' },
    ],
  },
];

const recommendations = {
  automation: {
    title: 'Workflow Automation Suite',
    description:
      'Eliminate repetitive tasks with intelligent automation agents that handle data entry, reporting, and routine operations.',
    features: [
      'Task automation',
      'Smart scheduling',
      'Process optimization',
      'Integration ready',
    ],
    roi: '40-60 hours saved per month',
  },
  integration: {
    title: 'Data Integration Platform',
    description:
      'Unify your data sources with AI-powered integration that syncs information across all your systems in real-time.',
    features: [
      'Multi-source sync',
      'Real-time updates',
      'Data validation',
      'Custom workflows',
    ],
    roi: '70% reduction in data errors',
  },
  'customer-service': {
    title: 'AI Customer Service Agent',
    description:
      'Deploy intelligent chatbots and automation to handle customer inquiries 24/7 with human-like understanding.',
    features: [
      '24/7 availability',
      'Multi-language support',
      'Smart routing',
      'Human handoff',
    ],
    roi: '10x faster response times',
  },
  analytics: {
    title: 'Decision Intelligence System',
    description:
      'Turn your data into actionable insights with AI-powered analytics that predict trends and recommend actions.',
    features: [
      'Predictive analytics',
      'Automated reports',
      'Trend detection',
      'Action recommendations',
    ],
    roi: '3x faster decision making',
  },
};

export const SolutionQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value });

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const reset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const primaryChallenge = answers[0] as keyof typeof recommendations;
  const recommendation =
    recommendations[primaryChallenge] || recommendations.automation;

  return (
    <div className='relative'>
      <AnimatePresence mode='wait'>
        {!showResults ? (
          <motion.div
            key={currentQuestion}
            animate={{ opacity: 1, x: 0 }}
            className='space-y-8'
            exit={{ opacity: 0, x: -20 }}
            initial={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Progress */}
            <div className='space-y-2'>
              <div className='flex justify-between text-sm text-muted-foreground'>
                <span>
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span>
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}
                  %
                </span>
              </div>
              <div className='h-2 overflow-hidden rounded-full bg-muted'>
                <motion.div
                  animate={{
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  }}
                  className='bg-gradient-primary h-full'
                  initial={{ width: 0 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Question */}
            <div>
              <h3 className='mb-4 px-2 text-xl font-bold sm:mb-6 sm:text-2xl md:text-3xl'>
                {questions[currentQuestion].question}
              </h3>

              <div className='grid gap-3'>
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={`option-${index}`}
                    className='group min-h-[48px] rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/50 sm:p-4'
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option.value)}
                  >
                    <div className='flex items-center justify-between'>
                      <span className='text-base transition-colors group-hover:text-primary sm:text-lg'>
                        {option.text}
                      </span>
                      <ArrowRight className='h-4 w-4 flex-shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100 sm:h-5 sm:w-5' />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            {currentQuestion > 0 && (
              <Button
                className='gap-2'
                variant='ghost'
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
              >
                <ArrowLeft className='h-4 w-4' />
                Back
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className='space-y-6'
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            {/* Success indicator */}
            <motion.div
              animate={{ scale: 1 }}
              className='flex justify-center'
              initial={{ scale: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <div className='rounded-full bg-primary/10 p-4'>
                <CheckCircle className='h-12 w-12 text-primary' />
              </div>
            </motion.div>

            {/* Recommendation */}
            <div className='space-y-4 text-center'>
              <div className='inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2'>
                <Sparkles className='h-4 w-4 text-accent' />
                <span className='text-sm font-semibold text-accent'>
                  Recommended Solution
                </span>
              </div>

              <h3 className='px-4 text-2xl font-bold sm:text-3xl md:text-4xl'>
                {recommendation.title}
              </h3>

              <p className='mx-auto max-w-2xl px-4 text-base text-muted-foreground sm:text-lg'>
                {recommendation.description}
              </p>
            </div>

            {/* Features */}
            <div className='grid gap-3 pt-4 sm:grid-cols-2 sm:gap-4'>
              {recommendation.features.map((feature, index) => (
                <motion.div
                  key={`feature-${index}`}
                  animate={{ opacity: 1, y: 0 }}
                  className='flex items-center gap-3 rounded-lg border border-border bg-card/50 p-4'
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className='h-2 w-2 rounded-full bg-primary' />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* ROI highlight */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className='bg-gradient-card rounded-xl border border-primary/20 p-6 text-center'
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.7 }}
            >
              <div className='mb-2 text-sm text-muted-foreground'>
                Expected Impact
              </div>
              <div className='bg-gradient-accent bg-clip-text text-2xl font-bold text-transparent'>
                {recommendation.roi}
              </div>
            </motion.div>

            {/* Actions */}
            <div className='flex flex-col justify-center gap-4 pt-4 sm:flex-row'>
              <Button className='bg-gradient-primary shadow-glow' size='lg'>
                Schedule Consultation
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
              <Button size='lg' variant='outline' onClick={reset}>
                Retake Quiz
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

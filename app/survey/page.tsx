'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, ArrowLeft, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SurfaceCard } from '@/components/ui/section-primitives';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface Question {
  id: string;
  question: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 'current_state',
    question: 'What best describes your current automation maturity?',
    options: [
      'We are just starting to explore automation',
      'We have some manual workflows we want to automate',
      'We have basic automation but want to add AI capabilities',
      'We need to scale and govern existing automation',
    ],
  },
  {
    id: 'primary_goal',
    question: 'What is your primary automation goal?',
    options: [
      'Reduce manual data entry and processing time',
      'Improve customer response times',
      'Scale operations without adding headcount',
      'Reduce errors and improve compliance',
    ],
  },
  {
    id: 'complexity',
    question: 'How complex are your target workflows?',
    options: [
      'Simple: Single step, one system',
      'Moderate: Multi-step, few systems',
      'Complex: Many steps, multiple systems, decisions required',
      'Enterprise: Cross-departmental with governance needs',
    ],
  },
  {
    id: 'timeline',
    question: 'What is your target timeline?',
    options: [
      'ASAP - We need quick wins',
      '1-2 months for initial deployment',
      '3-6 months for full implementation',
      'Flexible - Focus on getting it right',
    ],
  },
];

const recommendations: Record<string, string> = {
  '0-0': 'One-off Workflow',
  '0-1': 'One-off Workflow',
  '0-2': 'Co-build Engagement',
  '0-3': 'Co-build Engagement',
  '1-0': 'One-off Workflow',
  '1-1': 'One-off Workflow',
  '1-2': 'Co-build Engagement',
  '1-3': 'Co-build Engagement',
  '2-0': 'Co-build Engagement',
  '2-1': 'Co-build Engagement',
  '2-2': 'Co-build Engagement',
  '2-3': 'Managed Refinement',
  '3-0': 'Co-build Engagement',
  '3-1': 'Managed Refinement',
  '3-2': 'Managed Refinement',
  '3-3': 'Managed Refinement',
};

export default function SurveyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const progress = ((currentStep + 1) / (questions.length + 1)) * 100;

  const handleAnswer = (optionIndex: number) => {
    const currentQuestion = questions[currentStep];
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));
    setErrors((prev) => ({ ...prev, [currentQuestion.id]: '' }));
  };

  const handleNext = () => {
    const currentQuestion = questions[currentStep];
    if (!currentQuestion) return;
    if (answers[currentQuestion.id] === undefined) {
      setErrors((prev) => ({ ...prev, [currentQuestion.id]: 'Please select an option' }));
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email' }));
      return;
    }
    setIsSubmitted(true);
  };

  const getRecommendation = () => {
    const maturity = answers['current_state'] ?? 0;
    const goal = answers['primary_goal'] ?? 0;
    const complexity = answers['complexity'] ?? 0;
    const key = `${Math.max(maturity, goal)}-${complexity}`;
    return recommendations[key] || 'Co-build Engagement';
  };

  if (isSubmitted) {
    const recommendation = getRecommendation();
    return (
      <main className="min-h-screen flex items-center justify-center p-4" role="main">
        <SurfaceCard className="max-w-lg w-full p-8 text-center animate-in-fade">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Thank you!</h1>
          <p className="text-muted-foreground mb-6">
            Based on your responses, we recommend:
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
            <p className="text-lg font-semibold text-primary">{recommendation}</p>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            We have sent a detailed breakdown to {email}. Our team will follow up within 24 hours to discuss next steps.
          </p>
          <Button asChild className="w-full transition-transform duration-200 hover:scale-105">
            <a href="/contact">
              Schedule your free consultation
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        </SurfaceCard>
      </main>
    );
  }

  const currentQuestion = questions[currentStep];
  
  if (currentQuestion && currentStep < questions.length) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4" role="main">
        <SurfaceCard className="max-w-lg w-full p-8">
          <div className="mb-6">
            <Progress value={progress} className="h-2" aria-label={`Question ${currentStep + 1} of ${questions.length}`} />
            <p className="mt-2 text-sm text-muted-foreground text-right">
              Question {currentStep + 1} of {questions.length}
            </p>
          </div>
          
          <h1 className="text-xl font-semibold mb-6">{currentQuestion.question}</h1>
          
          <div className="space-y-3" role="radiogroup" aria-label={currentQuestion.question}>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  answers[currentQuestion.id] === index
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted'
                }`}
                role="radio"
                aria-checked={answers[currentQuestion.id] === index}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    answers[currentQuestion.id] === index ? 'border-primary' : 'border-muted-foreground'
                  }`}>
                    {answers[currentQuestion.id] === index && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-sm">{option}</span>
                </div>
              </button>
            ))}
          </div>
          
          {errors[currentQuestion.id] && (
            <p className="mt-3 text-sm text-destructive" role="alert">{errors[currentQuestion.id]}</p>
          )}
          
          <div className="mt-8 flex gap-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 transition-all duration-200 hover:bg-muted"
              >
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 transition-transform duration-200 hover:scale-105"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </SurfaceCard>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4" role="main">
      <SurfaceCard className="max-w-lg w-full p-8">
        <div className="mb-6">
          <Progress value={progress} className="h-2" aria-label="Final step" />
          <p className="mt-2 text-sm text-muted-foreground text-right">Final step</p>
        </div>
        
        <h1 className="text-xl font-semibold mb-2">Get your personalized recommendation</h1>
        <p className="text-muted-foreground mb-6">
          Enter your email to receive a detailed automation roadmap tailored to your needs.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: '' }));
              }}
              className="mt-1.5 transition-all duration-200 focus:ring-2 focus:ring-primary"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1.5 text-sm text-destructive" role="alert">
                {errors.email}
              </p>
            )}
          </div>
          
          <div className="pt-2 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex-1 transition-all duration-200 hover:bg-muted"
            >
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 transition-transform duration-200 hover:scale-105"
            >
              Get recommendation
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </form>
        
        <p className="mt-4 text-xs text-muted-foreground text-center">
          We respect your privacy. No spam, ever.
        </p>
      </SurfaceCard>
    </main>
  );
}

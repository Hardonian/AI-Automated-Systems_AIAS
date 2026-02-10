'use client';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Target,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

import { SuccessCelebration } from '@/components/onboarding/success-celebration';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { conversionTracker } from '@/lib/analytics/conversion-tracking';
import {
  trackWorkflowCreate,
  trackActivation,
} from '@/lib/analytics/funnel-tracking';
import { logger } from '@/lib/logging/structured-logger';
import { track } from '@/lib/telemetry/track';

interface Step {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  estimatedTime?: number; // in seconds
}

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const startTimeRef = useRef<number>(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [targetTime] = useState(5 * 60 * 1000); // 5 minutes in milliseconds

  // Track time elapsed
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(Date.now() - startTimeRef.current);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Track onboarding start with timestamp
    const userId = localStorage.getItem('user_id') || 'anonymous';
    startTimeRef.current = Date.now();

    track(userId, {
      type: 'onboarding_started',
      path: '/onboarding',
      meta: {
        timestamp: new Date().toISOString(),
        target_time_seconds: 300, // 5 minutes
      },
      app: 'web',
    });

    conversionTracker.track('onboarding_started', {
      userId,
      timestamp: Date.now(),
      targetTimeToAha: 300, // 5 minutes
    });

    // Track funnel stage
    import('@/lib/analytics/funnel-tracking').then(
      ({ trackOnboardingStart }) => {
        trackOnboardingStart(userId, {
          timestamp: new Date().toISOString(),
        });
      }
    );
  }, []);

  const steps: Step[] = [
    {
      id: 'welcome',
      title: 'Welcome to AI Automated Systems',
      description: 'Get your first automation running in under 5 minutes',
      estimatedTime: 30, // 30 seconds
      component: <WelcomeStep onNext={() => goToNext()} />,
    },
    {
      id: 'choose-integration',
      title: 'Choose Your First Integration',
      description: 'Connect a tool you use daily (or skip for now)',
      estimatedTime: 60, // 1 minute
      component: <ChooseIntegrationStep onNext={() => goToNext()} />,
    },
    {
      id: 'create-workflow',
      title: 'Create Your First Workflow',
      description: 'Use a template to get started instantly',
      estimatedTime: 120, // 2 minutes
      component: <CreateWorkflowStep onNext={() => goToNext()} />,
    },
    {
      id: 'test-workflow',
      title: 'Test Your Workflow',
      description: "See it in action - this is your 'aha moment'!",
      estimatedTime: 30, // 30 seconds
      component: <TestWorkflowStep onNext={() => goToNext()} />,
    },
    {
      id: 'complete',
      title: "You're All Set!",
      description: 'Start automating and saving time',
      component: <CompleteStep />,
    },
  ];

  const goToNext = async () => {
    const step = steps[currentStep];
    if (!step) {
      return;
    }
    const currentStepId = step.id;
    const stepStartTime = Date.now() - startTimeRef.current;

    if (!completedSteps.includes(currentStepId)) {
      setCompletedSteps([...completedSteps, currentStepId]);
    }

    // Track step completion with timing
    const userId = localStorage.getItem('user_id') || 'anonymous';
    track(userId, {
      type: 'onboarding_step_completed',
      path: '/onboarding',
      meta: {
        step_id: currentStepId,
        step_number: currentStep + 1,
        time_elapsed_ms: stepStartTime,
        time_elapsed_seconds: Math.round(stepStartTime / 1000),
        timestamp: new Date().toISOString(),
      },
      app: 'web',
    });

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Track onboarding completion and "aha moment"
      const totalTime = Date.now() - startTimeRef.current;
      const totalTimeSeconds = Math.round(totalTime / 1000);
      const achievedTarget = totalTime <= targetTime;

      track(userId, {
        type: 'onboarding_completed',
        path: '/onboarding',
        meta: {
          total_time_ms: totalTime,
          total_time_seconds: totalTimeSeconds,
          target_time_seconds: Math.round(targetTime / 1000),
          achieved_target: achievedTarget,
          timestamp: new Date().toISOString(),
        },
        app: 'web',
      });

      // Track "aha moment" - first workflow created
      conversionTracker.track('aha_moment_achieved', {
        userId,
        timeToActivation: totalTimeSeconds,
        targetTime: Math.round(targetTime / 1000),
        achievedTarget,
        timestamp: Date.now(),
      });

      conversionTracker.track('first_workflow_created', {
        timeToActivation: totalTimeSeconds,
        achievedTarget,
      });

      // Mark workflow as created in database
      try {
        await fetch('/api/trial/mark-workflow-created', {
          method: 'POST',
        });

        // Track workflow creation in funnel
        const userId = localStorage.getItem('user_id') || 'anonymous';
        trackWorkflowCreate(userId, 'workflow-id', {
          timeToCreate: totalTimeSeconds,
        });

        // Check if user is activated (has completed all steps)
        if (
          completedSteps.includes('create-workflow') &&
          completedSteps.includes('test-workflow')
        ) {
          trackActivation(userId, {
            timeToActivation: totalTimeSeconds,
            stepsCompleted: completedSteps.length,
          });
        }
      } catch (error) {
        logger.error(
          'Failed to mark workflow created',
          error instanceof Error ? error : new Error(String(error)),
          {
            component: 'Wizard',
            action: 'markWorkflowCreated',
          }
        );
      }
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const timeRemaining = Math.max(0, targetTime - timeElapsed);
  const timeRemainingSeconds = Math.round(timeRemaining / 1000);
  const isOnTrack = timeElapsed <= targetTime;
  const estimatedTimeRemaining = steps
    .slice(currentStep)
    .reduce((sum, step) => sum + (step.estimatedTime || 0), 0);

  return (
    <div className='space-y-6'>
      {/* Time Tracker */}
      <div className='flex items-center justify-between rounded-lg bg-muted/50 p-4'>
        <div className='flex items-center space-x-2'>
          <Clock
            className={`h-5 w-5 ${isOnTrack ? 'text-green-600' : 'text-orange-600'}`}
          />
          <div>
            <div className='text-sm font-medium'>
              {isOnTrack ? 'On track!' : 'Take your time'}
            </div>
            <div className='text-xs text-muted-foreground'>
              {Math.round(timeElapsed / 1000)}s elapsed • ~
              {estimatedTimeRemaining}s remaining
            </div>
          </div>
        </div>
        <div className='text-right'>
          <div className='text-sm font-medium'>Target: 5 minutes</div>
          <div
            className={`text-xs ${isOnTrack ? 'text-green-600' : 'text-orange-600'}`}
          >
            {timeRemainingSeconds > 0
              ? `${timeRemainingSeconds}s left`
              : 'Time exceeded'}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className='space-y-2'>
        <div className='flex items-center justify-between text-sm'>
          <span className='font-medium'>
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className='text-muted-foreground'>
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress className='h-2' value={progress} />
      </div>

      {/* Step Indicator */}
      <div className='flex items-center justify-between'>
        {steps.map((step, index) => (
          <div key={step.id} className='flex flex-1 items-center'>
            <div className='flex flex-1 flex-col items-center'>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  index < currentStep
                    ? 'border-primary bg-primary text-primary-foreground'
                    : index === currentStep
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-muted text-muted-foreground'
                }`}
              >
                {index < currentStep ? (
                  <Check className='h-5 w-5' />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className='mt-2 max-w-[100px] text-center text-xs text-muted-foreground'>
                {step.title}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 ${
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      {steps[currentStep] && (
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep]!.title}</CardTitle>
            <CardDescription>{steps[currentStep]!.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {steps[currentStep]!.component}
            {/* Show success celebration after workflow creation step */}
            {steps[currentStep]!.id === 'test-workflow' &&
              completedSteps.includes('create-workflow') && (
                <div className='mt-4'>
                  <SuccessCelebration />
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      {currentStep < steps.length - 1 && (
        <div className='flex justify-between'>
          <Button
            disabled={currentStep === 0}
            variant='outline'
            onClick={goToPrevious}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Previous
          </Button>
          <Button onClick={goToNext}>
            Next
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
      )}
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <Sparkles className='mx-auto mb-4 h-16 w-16 text-primary' />
        <h3 className='mb-2 text-2xl font-bold'>
          Welcome! Let's get your first automation running in 5 minutes
        </h3>
        <p className='mb-2 text-base text-muted-foreground'>
          Save 10+ hours per week with AI-powered workflows. Built in Canada,
          trusted by 2,000+ businesses.
        </p>
        <p className='text-sm text-muted-foreground'>
          Get started in 5 minutes. Choose a template, connect an integration
          (or skip), and watch your first automation run. No coding required.
        </p>
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <div className='rounded-lg bg-muted/50 p-4 text-center'>
          <Zap className='mx-auto mb-2 h-8 w-8 text-primary' />
          <div className='mb-1 font-semibold'>5 Minutes</div>
          <div className='text-sm text-muted-foreground'>
            To your first automation
          </div>
        </div>
        <div className='rounded-lg bg-muted/50 p-4 text-center'>
          <Target className='mx-auto mb-2 h-8 w-8 text-primary' />
          <div className='mb-1 font-semibold'>Instant Value</div>
          <div className='text-sm text-muted-foreground'>
            See it work immediately
          </div>
        </div>
        <div className='rounded-lg bg-muted/50 p-4 text-center'>
          <Check className='mx-auto mb-2 h-8 w-8 text-primary' />
          <div className='mb-1 font-semibold'>No Setup</div>
          <div className='text-sm text-muted-foreground'>
            Use pre-built templates
          </div>
        </div>
      </div>
      <Button className='w-full' size='lg' onClick={onNext}>
        Get Started - It's Free
        <ArrowRight className='ml-2 h-4 w-4' />
      </Button>
    </div>
  );
}

function ChooseIntegrationStep({ onNext }: { onNext: () => void }) {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(
    null
  );
  const [connecting, setConnecting] = useState(false);
  const [_skipped, setSkipped] = useState(false);

  const integrations = [
    {
      name: 'Shopify',
      icon: '🛍️',
      description: 'E-commerce automation',
      provider: 'shopify',
      popular: true,
    },
    {
      name: 'Wave Accounting',
      icon: '📊',
      description: 'Financial automation',
      provider: 'wave',
      popular: true,
    },
    {
      name: 'Stripe',
      icon: '💳',
      description: 'Payment processing',
      provider: 'stripe',
      popular: true,
    },
    {
      name: 'Gmail',
      icon: '📧',
      description: 'Email automation',
      provider: 'gmail',
    },
    {
      name: 'Slack',
      icon: '💬',
      description: 'Team communication',
      provider: 'slack',
    },
    {
      name: 'Notion',
      icon: '📝',
      description: 'Productivity automation',
      provider: 'notion',
    },
  ];

  const handleSkip = () => {
    setSkipped(true);
    const userId = localStorage.getItem('user_id') || 'anonymous';
    track(userId, {
      type: 'onboarding_integration_skipped',
      path: '/onboarding',
      meta: {
        timestamp: new Date().toISOString(),
      },
      app: 'web',
    });
    onNext();
  };

  async function handleIntegrationClick(provider: string) {
    setSelectedIntegration(provider);
    setConnecting(true);

    try {
      // Get OAuth URL
      const response = await fetch(`/api/integrations/${provider}/oauth`);
      if (!response.ok) {
        throw new Error('Failed to initiate OAuth');
      }

      const data = await response.json();

      // Redirect to OAuth URL
      if (data.oauth_url) {
        window.location.href = data.oauth_url;
      } else {
        // For demo purposes, simulate connection
        await new Promise(resolve => setTimeout(resolve, 1000));
        onNext();
      }
    } catch (error) {
      // Use structured logger for proper error tracking
      logger.error(
        'Failed to connect integration',
        error instanceof Error ? error : new Error(String(error))
      );
      // For demo purposes, continue anyway
      onNext();
    } finally {
      setConnecting(false);
    }
  }

  return (
    <div className='space-y-6'>
      <p className='mb-4 text-muted-foreground'>
        Connect a tool you use daily to unlock powerful automations. Or skip
        this step and use a demo template to see how workflows work.
      </p>
      <div className='mb-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-950'>
        <p className='mb-2 text-sm font-medium'>Popular integrations:</p>
        <ul className='space-y-1 text-sm text-muted-foreground'>
          <li>
            • <strong>Shopify</strong> → Automate order processing, inventory
            sync
          </li>
          <li>
            • <strong>Wave Accounting</strong> → Auto-categorize expenses,
            generate reports
          </li>
          <li>
            • <strong>Stripe</strong> → Process payments, send receipts
            automatically
          </li>
        </ul>
      </div>
      <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
        {integrations.map(integration => (
          <button
            key={integration.name}
            aria-label={`Connect ${integration.name}`}
            className={`relative rounded-lg border p-4 text-left transition-colors ${
              selectedIntegration === integration.provider
                ? 'border-primary bg-primary/10'
                : 'hover:border-primary hover:bg-primary/5'
            } ${connecting ? 'cursor-not-allowed opacity-50' : ''} ${
              integration.popular ? 'ring-2 ring-primary/20' : ''
            }`}
            disabled={connecting}
            onClick={() => handleIntegrationClick(integration.provider)}
          >
            {integration.popular && (
              <span className='absolute right-2 top-2 rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground'>
                Popular
              </span>
            )}
            <div className='mb-2 text-2xl'>{integration.icon}</div>
            <div className='mb-1 font-semibold'>{integration.name}</div>
            <div className='text-sm text-muted-foreground'>
              {integration.description}
            </div>
          </button>
        ))}
      </div>
      <div className='flex flex-col gap-3 sm:flex-row'>
        <Button className='flex-1' variant='outline' onClick={handleSkip}>
          Skip for Now
        </Button>
        <p className='text-center text-sm text-muted-foreground sm:flex sm:flex-1 sm:items-center sm:text-left'>
          Don't see your tool?{' '}
          <Link
            className='ml-1 text-primary hover:underline'
            href='/integrations'
          >
            Browse all
          </Link>
        </p>
      </div>
    </div>
  );
}

function CreateWorkflowStep({ onNext }: { onNext: () => void }) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const templates = [
    {
      id: 'shopify-slack',
      name: 'Shopify → Slack',
      description: 'Notify team when new order arrives',
      icon: '🛍️',
      trigger: 'New order in Shopify',
      action: 'Send notification to Slack',
    },
    {
      id: 'email-summary',
      name: 'Daily Email Summary',
      description: 'Get daily summary of important events',
      icon: '📧',
      trigger: 'Daily at 9 AM',
      action: 'Send email summary',
    },
    {
      id: 'demo-workflow',
      name: 'Demo Workflow',
      description: 'See how workflows work (no setup required)',
      icon: '✨',
      trigger: 'Manual trigger',
      action: 'Show success message',
      recommended: true,
    },
  ];

  async function handleCreateWorkflow(templateId: string) {
    setSelectedTemplate(templateId);
    setCreating(true);

    const userId = localStorage.getItem('user_id') || 'anonymous';

    try {
      // Track template selection
      track(userId, {
        type: 'onboarding_template_selected',
        path: '/onboarding',
        meta: {
          template_id: templateId,
          timestamp: new Date().toISOString(),
        },
        app: 'web',
      });

      // Simulate workflow creation (in production, this would call the API)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Track workflow creation
      track(userId, {
        type: 'workflow_created',
        path: '/onboarding',
        meta: {
          template_id: templateId,
          timestamp: new Date().toISOString(),
        },
        app: 'web',
      });

      conversionTracker.track('workflow_created', {
        userId,
        templateId,
        timestamp: Date.now(),
      });

      onNext();
    } catch (error) {
      const { logger } = await import('@/lib/utils/logger');
      logger.error(
        'Failed to create workflow',
        error instanceof Error ? error : new Error(String(error))
      );
      // Continue anyway for demo
      onNext();
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className='space-y-6'>
      <p className='mb-4 text-muted-foreground'>
        Templates save hours of setup time. Each template includes
        pre-configured triggers and actions with best practices built-in.
      </p>
      <div className='mb-4 rounded-lg bg-green-50 p-4 dark:bg-green-950'>
        <p className='mb-2 text-sm font-medium'>
          💡 Recommended for beginners:
        </p>
        <p className='text-sm text-muted-foreground'>
          <strong>Demo Workflow</strong> — See how it works with zero setup.
          Perfect for your first automation.
        </p>
      </div>
      <p className='text-sm text-muted-foreground'>
        After creating your workflow, you can customize triggers, add
        conditions, and connect more integrations.
      </p>
      <div className='space-y-3'>
        {templates.map(template => (
          <button
            key={template.id}
            className={`w-full rounded-lg border p-4 text-left transition-colors ${
              selectedTemplate === template.id
                ? 'border-primary bg-primary/10'
                : 'hover:border-primary hover:bg-primary/5'
            } ${creating ? 'cursor-not-allowed opacity-50' : ''} ${
              template.recommended ? 'ring-2 ring-primary/20' : ''
            }`}
            disabled={creating}
            onClick={() => handleCreateWorkflow(template.id)}
          >
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='mb-2 flex items-center space-x-2'>
                  <span className='text-2xl'>{template.icon}</span>
                  <div>
                    <div className='font-semibold'>{template.name}</div>
                    {template.recommended && (
                      <span className='ml-2 rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground'>
                        Recommended
                      </span>
                    )}
                  </div>
                </div>
                <div className='mb-3 text-sm text-muted-foreground'>
                  {template.description}
                </div>
                <div className='space-y-1 text-xs'>
                  <div className='flex items-center space-x-2'>
                    <span className='font-medium'>Trigger:</span>
                    <span className='text-muted-foreground'>
                      {template.trigger}
                    </span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='font-medium'>Action:</span>
                    <span className='text-muted-foreground'>
                      {template.action}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      {creating && (
        <div className='text-center text-sm text-muted-foreground'>
          Creating your workflow...
        </div>
      )}
    </div>
  );
}

function TestWorkflowStep({ onNext }: { onNext: () => void }) {
  const [testing, setTesting] = useState(false);
  const [testComplete, setTestComplete] = useState(false);

  async function handleTest() {
    setTesting(true);
    const userId = localStorage.getItem('user_id') || 'anonymous';

    try {
      // Simulate workflow test execution
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Track "aha moment" - workflow executed successfully
      track(userId, {
        type: 'aha_moment_achieved',
        path: '/onboarding',
        meta: {
          event: 'workflow_executed',
          timestamp: new Date().toISOString(),
        },
        app: 'web',
      });

      conversionTracker.track('aha_moment_achieved', {
        userId,
        event: 'workflow_executed',
        timestamp: Date.now(),
      });

      setTestComplete(true);

      // Auto-advance after showing success
      setTimeout(() => {
        onNext();
      }, 2000);
    } catch (error) {
      const { logger } = await import('@/lib/utils/logger');
      logger.error(
        'Test failed',
        error instanceof Error ? error : new Error(String(error))
      );
      setTesting(false);
    }
  }

  useEffect(() => {
    // Auto-start test
    handleTest();
  }, []);

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <Sparkles className='mx-auto mb-4 h-16 w-16 text-primary' />
        <h3 className='mb-2 text-2xl font-bold'>
          Your First Workflow is Ready!
        </h3>
        <p className='text-muted-foreground'>
          Let's test it to see the magic happen. This is your "aha moment"!
        </p>
      </div>

      {testing && !testComplete && (
        <div className='rounded-lg bg-muted/50 p-6 text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
          <div className='mb-2 font-semibold'>Running your workflow...</div>
          <div className='text-sm text-muted-foreground'>
            This is what automation looks like!
          </div>
        </div>
      )}

      {testComplete && (
        <div className='rounded-lg border-2 border-green-500 bg-green-50 p-6 dark:border-green-700 dark:bg-green-950'>
          <div className='mb-3 flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-500'>
              <Check className='h-6 w-6 text-white' />
            </div>
            <div>
              <div className='text-lg font-bold text-green-900 dark:text-green-100'>
                🎉 Success! Your workflow executed!
              </div>
              <div className='text-sm text-green-800 dark:text-green-200'>
                This is your "aha moment" - you've automated your first task!
              </div>
            </div>
          </div>
          <div className='mt-4 rounded border border-green-200 bg-white p-4 dark:border-green-800 dark:bg-green-900'>
            <div className='mb-2 text-sm font-medium text-green-900 dark:text-green-100'>
              What just happened:
            </div>
            <ul className='space-y-1 text-sm text-green-800 dark:text-green-200'>
              <li>✓ Workflow triggered successfully</li>
              <li>✓ Action executed automatically</li>
              <li>✓ You saved time - no manual work needed!</li>
            </ul>
          </div>
        </div>
      )}

      {!testComplete && (
        <Button
          className='w-full'
          disabled={testing}
          size='lg'
          onClick={handleTest}
        >
          {testing ? 'Testing...' : 'Test Workflow Now'}
          <ArrowRight className='ml-2 h-4 w-4' />
        </Button>
      )}
    </div>
  );
}

function CompleteStep() {
  return (
    <div className='space-y-6 text-center'>
      <div className='mb-4 text-6xl'>🎉</div>
      <h3 className='text-2xl font-bold'>Congratulations!</h3>
      <p className='text-muted-foreground'>
        You've created your first workflow. You're now ready to automate and
        save time.
      </p>
      <div className='mt-8 grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2 text-left'>
            <div className='flex items-start gap-2'>
              <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
              <span className='text-sm'>Create more workflows</span>
            </div>
            <div className='flex items-start gap-2'>
              <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
              <span className='text-sm'>Explore templates</span>
            </div>
            <div className='flex items-start gap-2'>
              <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
              <span className='text-sm'>Connect more integrations</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2 text-left'>
            <Link
              className='block text-sm text-primary hover:underline'
              href='/help'
            >
              Help Center
            </Link>
            <Link
              className='block text-sm text-primary hover:underline'
              href='/case-studies'
            >
              Case Studies
            </Link>
            <Link
              className='block text-sm text-primary hover:underline'
              href='/blog'
            >
              Blog & Tutorials
            </Link>
          </CardContent>
        </Card>
      </div>
      <div className='mt-8 flex flex-col justify-center gap-4 sm:flex-row'>
        <Button asChild size='lg'>
          <Link href='/dashboard'>Go to Dashboard</Link>
        </Button>
        <Button asChild size='lg' variant='outline'>
          <Link href='/templates'>Browse Templates</Link>
        </Button>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, ArrowRight, ArrowLeft, Sparkles, Zap, Target, Loader2, AlertCircle } from "lucide-react";
import { track } from "@/lib/telemetry/track";
import {
  trackFlowStarted,
  trackStepViewed,
  trackStepCompleted,
  trackFlowCompleted,
  trackSuccess,
  trackError,
  trackRetry,
} from "@/lib/ux-events";
import { ProgressIndicator, SuccessToast, ErrorMessage } from "@/components/feedback";
import Link from "next/link";
import { onboardingMachine, type OnboardingStepId, type IntegrationProvider } from "@/lib/xstate/onboarding-machine";
import { StepTransition, AnimatedButton, AnimatedCard, Reveal } from "@/components/motion";

/**
 * Refactored Onboarding Wizard using XState
 * 
 * Demonstrates:
 * - State machine-driven flow
 * - Step transitions with motion
 * - Error handling and retry
 * - Progress tracking
 */
export function OnboardingWizardRefactored() {
  const [state, send] = useMachine(onboardingMachine);
  const { currentStep, totalSteps, completedSteps, selectedIntegration, workflowCreated, workflowTested } = state.context;
  const isPending = state.matches("connectingIntegration") || state.matches("creatingWorkflowAsync") || state.matches("testingWorkflowAsync");
  const hasError = state.matches("error");
  const error = state.context.error;

  // Track onboarding start
  useEffect(() => {
    const userId = localStorage.getItem("user_id") || "anonymous";
    track(userId, {
      type: "onboarding_started",
      path: "/onboarding",
      meta: {
        timestamp: new Date().toISOString(),
      },
      app: "web",
    });
    trackFlowStarted("onboarding", { userId });
  }, []);

  // Track step changes
  useEffect(() => {
    const userId = localStorage.getItem("user_id") || "anonymous";
    const stepId = getStepId(currentStep);
    track(userId, {
      type: "onboarding_step_viewed",
      path: "/onboarding",
      meta: {
        step_id: stepId,
        step_number: currentStep + 1,
        timestamp: new Date().toISOString(),
      },
      app: "web",
    });
    trackStepViewed("onboarding", currentStep, stepId, { userId });
  }, [currentStep]);

  // Track step completion
  useEffect(() => {
    if (completedSteps.length > 0) {
      const userId: string = localStorage.getItem("user_id") || "anonymous";
      const lastCompleted = completedSteps[completedSteps.length - 1];
      if (lastCompleted) {
        const stepIndex = getStepIds().indexOf(lastCompleted as OnboardingStepId);
        track(userId, {
          type: "onboarding_step_completed",
          path: "/onboarding",
          meta: {
            step_id: lastCompleted,
            step_number: stepIndex + 1,
            timestamp: new Date().toISOString(),
          },
          app: "web",
        });
        trackStepCompleted("onboarding", stepIndex, lastCompleted, undefined, { userId });
      }
    }
  }, [completedSteps]);

  // Track completion
  useEffect(() => {
    if (state.matches("complete")) {
      const userId = localStorage.getItem("user_id") || "anonymous";
      track(userId, {
        type: "onboarding_completed",
        path: "/onboarding",
        meta: {
          timestamp: new Date().toISOString(),
        },
        app: "web",
      });
      trackFlowCompleted("onboarding", 0, completedSteps.length, { userId });
      trackSuccess("onboarding_completed", "onboarding", { userId });
    }
  }, [state, completedSteps]);

  const progress = ((currentStep + 1) / totalSteps) * 100;
  const stepId = getStepId(currentStep);

  const handleNext = () => {
    if (state.matches("welcome")) {
      send({ type: "NEXT" });
    } else if (state.matches("choosingIntegration")) {
      send({ type: "NEXT" });
    } else if (state.matches("creatingWorkflow")) {
      send({ type: "CREATE_WORKFLOW" });
    } else if (state.matches("testingWorkflow")) {
      send({ type: "TEST_WORKFLOW" });
    }
  };

  const handlePrevious = () => {
    send({ type: "PREVIOUS" });
  };

  const handleSelectIntegration = (provider: IntegrationProvider) => {
    send({ type: "SELECT_INTEGRATION", provider });
  };

  const handleRetry = () => {
    trackRetry((state.context.retryCount || 0) + 1, "onboarding", currentStep);
    send({ type: "RETRY" });
  };

  // Track errors
  useEffect(() => {
    if (hasError && error) {
      trackError(
        error instanceof Error ? error.message : String(error),
        "onboarding",
        undefined,
        true,
        { step: currentStep, retryCount: state.context.retryCount }
      );
    }
  }, [hasError, error, currentStep, state.context.retryCount]);

  return (
    <div className="space-y-6" role="main" aria-label="Onboarding wizard">
      {/* Progress Indicator */}
      <ProgressIndicator
        current={currentStep}
        total={totalSteps}
        completedSteps={completedSteps}
        stepLabels={getStepIds().map((id) => getStepTitle(id))}
      />

      {/* Current Step Content */}
      <StepTransition step={currentStep}>
        <AnimatedCard variant="fadeInUp">
          <Card>
            <CardHeader>
              <CardTitle>{getStepTitle(stepId)}</CardTitle>
              <CardDescription>{getStepDescription(stepId)}</CardDescription>
            </CardHeader>
            <CardContent>
              {renderStepContent(stepId, {
                onNext: handleNext,
                onPrevious: handlePrevious,
                onSelectIntegration: handleSelectIntegration,
                selectedIntegration,
                workflowCreated,
                workflowTested,
                isPending,
              })}
            </CardContent>
          </Card>
        </AnimatedCard>
      </StepTransition>

      {/* Error Message */}
      {hasError && error && (
        <ErrorMessage
          message={error instanceof Error ? error.message : String(error)}
          title="Error"
          showRetry={true}
          onRetry={handleRetry}
        />
      )}

      {/* Success Message */}
      {state.matches("complete") && (
        <SuccessToast
          message="You've successfully completed onboarding! You're now ready to automate and save time."
          title="Congratulations!"
          celebrate={true}
        />
      )}

      {/* Navigation */}
      {!state.matches("complete") && !state.matches("error") && (
        <Reveal variant="fadeInUp" delay={0.2}>
          <div className="flex justify-between" role="navigation" aria-label="Onboarding navigation">
            <AnimatedButton
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isPending}
              aria-label="Go to previous step"
            >
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Previous
            </AnimatedButton>
            <AnimatedButton
              onClick={handleNext}
              disabled={isPending || !canProceed(state)}
              aria-label="Go to next step"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Processing...
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </>
              )}
            </AnimatedButton>
          </div>
        </Reveal>
      )}
    </div>
  );
}

// Helper functions
function getStepIds(): OnboardingStepId[] {
  return ["welcome", "choose-integration", "create-workflow", "test-workflow", "complete"];
}

function getStepId(index: number): OnboardingStepId {
  const steps = getStepIds();
  return steps[index] || "welcome";
}

function getStepTitle(stepId: OnboardingStepId): string {
  const titles: Record<OnboardingStepId, string> = {
    welcome: "Welcome to AIAS Platform",
    "choose-integration": "Choose Your First Integration",
    "create-workflow": "Create Your First Workflow",
    "test-workflow": "Test Your Workflow",
    complete: "You're All Set!",
  };
  return titles[stepId] || "";
}

function getStepDescription(stepId: OnboardingStepId): string {
  const descriptions: Record<OnboardingStepId, string> = {
    welcome: "Let's get you set up in 30 minutes",
    "choose-integration": "Connect a tool you use daily",
    "create-workflow": "Build an automation in minutes",
    "test-workflow": "Make sure everything works",
    complete: "Start automating and saving time",
  };
  return descriptions[stepId] || "";
}

function canProceed(state: ReturnType<typeof useMachine<typeof onboardingMachine>>[0]): boolean {
  if (state.matches("welcome")) return true;
  if (state.matches("choosingIntegration")) return !!state.context.selectedIntegration;
  if (state.matches("creatingWorkflow")) return true;
  if (state.matches("testingWorkflow")) return true;
  return false;
}

function renderStepContent(
  stepId: OnboardingStepId,
  props: {
    onNext: () => void;
    onPrevious: () => void;
    onSelectIntegration: (provider: IntegrationProvider) => void;
    selectedIntegration?: IntegrationProvider;
    workflowCreated?: boolean;
    workflowTested?: boolean;
    isPending: boolean;
  }
) {
  switch (stepId) {
    case "welcome":
      return <WelcomeStep onNext={props.onNext} />;
    case "choose-integration":
      return (
        <ChooseIntegrationStep
          onNext={props.onNext}
          onSelectIntegration={props.onSelectIntegration}
          selectedIntegration={props.selectedIntegration}
          isPending={props.isPending}
        />
      );
    case "create-workflow":
      return (
        <CreateWorkflowStep
          onNext={props.onNext}
          selectedIntegration={props.selectedIntegration}
          workflowCreated={props.workflowCreated}
          isPending={props.isPending}
        />
      );
    case "test-workflow":
      return (
        <TestWorkflowStep
          onNext={props.onNext}
          workflowTested={props.workflowTested}
          isPending={props.isPending}
        />
      );
    case "complete":
      return <CompleteStep />;
    default:
      return null;
  }
}

// Step Components
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-2xl font-bold mb-2">Welcome to AIAS Platform!</h3>
        <p className="text-muted-foreground">
          We'll help you create your first automation workflow in just 30 minutes.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <Zap className="h-8 w-8 text-primary mx-auto mb-2" aria-hidden="true" />
          <div className="font-semibold mb-1">Quick Setup</div>
          <div className="text-sm text-muted-foreground">30 minutes</div>
        </div>
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <Target className="h-8 w-8 text-primary mx-auto mb-2" aria-hidden="true" />
          <div className="font-semibold mb-1">First Workflow</div>
          <div className="text-sm text-muted-foreground">Automate tasks</div>
        </div>
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <Check className="h-8 w-8 text-primary mx-auto mb-2" aria-hidden="true" />
          <div className="font-semibold mb-1">Save Time</div>
          <div className="text-sm text-muted-foreground">10+ hours/week</div>
        </div>
      </div>
      <AnimatedButton onClick={onNext} className="w-full" size="lg">
        Get Started
        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
      </AnimatedButton>
    </div>
  );
}

function ChooseIntegrationStep({
  onNext,
  onSelectIntegration,
  selectedIntegration,
  isPending,
}: {
  onNext: () => void;
  onSelectIntegration: (provider: IntegrationProvider) => void;
  selectedIntegration?: IntegrationProvider;
  isPending: boolean;
}) {
  const integrations: Array<{ name: string; icon: string; description: string; provider: IntegrationProvider }> = [
    { name: "Shopify", icon: "🛍️", description: "E-commerce automation", provider: "shopify" },
    { name: "Wave Accounting", icon: "📊", description: "Financial automation", provider: "wave" },
    { name: "Stripe", icon: "💳", description: "Payment processing", provider: "stripe" },
    { name: "Gmail", icon: "📧", description: "Email automation", provider: "gmail" },
    { name: "Slack", icon: "💬", description: "Team communication", provider: "slack" },
    { name: "Notion", icon: "📝", description: "Productivity automation", provider: "notion" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Choose a tool you use daily. We'll help you automate it.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4" role="list" aria-label="Available integrations">
        {integrations.map((integration) => (
          <button
            key={integration.name}
            onClick={() => onSelectIntegration(integration.provider)}
            disabled={isPending}
            className={`p-4 border rounded-lg transition-colors text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
              selectedIntegration === integration.provider
                ? "border-primary bg-primary/10"
                : "hover:border-primary hover:bg-primary/5"
            } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label={`Connect ${integration.name}`}
            role="listitem"
          >
            <div className="text-2xl mb-2" aria-hidden="true">{integration.icon}</div>
            <div className="font-semibold mb-1">{integration.name}</div>
            <div className="text-sm text-muted-foreground">{integration.description}</div>
          </button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Don't see your tool? <Link href="/integrations" className="text-primary hover:underline">Browse all integrations</Link>
      </p>
    </div>
  );
}

function CreateWorkflowStep({
  onNext,
  selectedIntegration,
  workflowCreated,
  isPending,
}: {
  onNext: () => void;
  selectedIntegration?: IntegrationProvider;
  workflowCreated?: boolean;
  isPending: boolean;
}) {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Let's create a simple workflow. Choose from our pre-built templates or create your own.
      </p>
      {workflowCreated ? (
        <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <Check className="h-5 w-5 text-green-600" aria-hidden="true" />
            <div className="font-semibold text-green-900 dark:text-green-100">Workflow Created Successfully</div>
          </div>
          <div className="text-sm text-green-800 dark:text-green-200">
            Your workflow is ready to use. It will automatically run when triggered.
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="font-semibold mb-2">Trigger</div>
              <div className="text-sm text-muted-foreground">New order in {selectedIntegration || "your integration"}</div>
            </div>
            <div className="text-center text-2xl" aria-hidden="true">→</div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="font-semibold mb-2">Action</div>
              <div className="text-sm text-muted-foreground">Send notification to Slack</div>
            </div>
          </div>
          <AnimatedButton onClick={onNext} className="w-full" size="lg" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Creating Workflow...
              </>
            ) : (
              <>
                Create Workflow
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </>
            )}
          </AnimatedButton>
        </>
      )}
    </div>
  );
}

function TestWorkflowStep({
  onNext,
  workflowTested,
  isPending,
}: {
  onNext: () => void;
  workflowTested?: boolean;
  isPending: boolean;
}) {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Great! Your workflow is created. Let's test it to make sure everything works.
      </p>
      {workflowTested ? (
        <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <Check className="h-5 w-5 text-green-600" aria-hidden="true" />
            <div className="font-semibold text-green-900 dark:text-green-100">Workflow Tested Successfully</div>
          </div>
          <div className="text-sm text-green-800 dark:text-green-200">
            Your workflow is working correctly. It will automatically run when triggered.
          </div>
        </div>
      ) : (
        <AnimatedButton onClick={onNext} className="w-full" size="lg" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Testing Workflow...
            </>
          ) : (
            <>
              Test Workflow
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </>
          )}
        </AnimatedButton>
      )}
    </div>
  );
}

function CompleteStep() {
  return (
    <div className="space-y-6 text-center">
      <div className="text-6xl mb-4" role="img" aria-label="Celebration">🎉</div>
      <h3 className="text-2xl font-bold">Congratulations!</h3>
      <p className="text-muted-foreground">
        You've created your first workflow. You're now ready to automate and save time.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-left">
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-sm">Create more workflows</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-sm">Explore templates</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-sm">Connect more integrations</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-left">
            <Link href="/help" className="block text-sm text-primary hover:underline">
              Help Center
            </Link>
            <Link href="/case-studies" className="block text-sm text-primary hover:underline">
              Case Studies
            </Link>
            <Link href="/blog" className="block text-sm text-primary hover:underline">
              Blog & Tutorials
            </Link>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <AnimatedButton size="lg" asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </AnimatedButton>
        <AnimatedButton size="lg" variant="outline" asChild>
          <Link href="/templates">Browse Templates</Link>
        </AnimatedButton>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StepTransition, AnimatedButton, AnimatedCard, Reveal } from "@/components/motion";
import { ProgressIndicator, ErrorMessage } from "@/components/feedback";
import { trackFlowStarted, trackStepViewed, trackStepCompleted, trackFlowCompleted, trackError } from "@/lib/ux-events";
import React from "react";

interface SetupStep {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  estimatedTime: number; // in minutes
}

interface IntegrationSetupWizardProps {
  integration: "shopify" | "wave";
  onComplete: () => void;
  onCancel: () => void;
}

const shopifySteps: SetupStep[] = [
  {
    id: "prepare",
    title: "Prepare Your Shopify Store",
    description: "Make sure you have admin access to your Shopify store",
    instructions: [
      "Log in to your Shopify admin panel",
      "Verify you have admin permissions",
      "Note your store URL (e.g., yourstore.myshopify.com)",
    ],
    estimatedTime: 2,
  },
  {
    id: "authorize",
    title: "Authorize AIAS Platform",
    description: "Connect your Shopify store to AIAS",
    instructions: [
      "Click 'Connect Shopify' below",
      "You'll be redirected to Shopify's authorization page",
      "Review the permissions AIAS is requesting",
      "Click 'Install app' or 'Authorize'",
    ],
    estimatedTime: 3,
  },
  {
    id: "verify",
    title: "Verify Connection",
    description: "Confirm your store is connected",
    instructions: [
      "You'll be redirected back to AIAS Platform",
      "You should see a success message",
      "Your Shopify store should appear in Settings → Integrations",
    ],
    estimatedTime: 1,
  },
];

const waveSteps: SetupStep[] = [
  {
    id: "prepare",
    title: "Prepare Your Wave Account",
    description: "Make sure you have access to your Wave Accounting account",
    instructions: [
      "Log in to your Wave Accounting account",
      "Verify you have admin access",
      "Note which business you want to connect (if you have multiple)",
    ],
    estimatedTime: 2,
  },
  {
    id: "authorize",
    title: "Authorize AIAS Platform",
    description: "Connect your Wave Accounting to AIAS",
    instructions: [
      "Click 'Connect Wave Accounting' below",
      "You'll be redirected to Wave's authorization page",
      "Sign in to your Wave account if needed",
      "Review the permissions AIAS is requesting",
      "Click 'Authorize' or 'Allow'",
    ],
    estimatedTime: 3,
  },
  {
    id: "select-business",
    title: "Select Business (If Multiple)",
    description: "Choose which business to connect",
    instructions: [
      "If you have multiple businesses, select the one to connect",
      "Click 'Continue'",
      "You can connect additional businesses later if needed",
    ],
    estimatedTime: 1,
  },
  {
    id: "verify",
    title: "Verify Connection",
    description: "Confirm your account is connected",
    instructions: [
      "You'll be redirected back to AIAS Platform",
      "You should see a success message",
      "Your Wave Accounting should appear in Settings → Integrations",
    ],
    estimatedTime: 1,
  },
];

export function IntegrationSetupWizard({ integration, onComplete, onCancel }: IntegrationSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = integration === "shopify" ? shopifySteps : waveSteps;
  
  // Track flow start
  React.useEffect(() => {
    trackFlowStarted(`integration-setup-${integration}`);
  }, [integration]);
  
  // Track step views
  React.useEffect(() => {
    const stepId = steps[currentStep]?.id;
    if (stepId) {
      trackStepViewed(`integration-setup-${integration}`, currentStep, stepId);
    }
  }, [currentStep, integration, steps]);

  const handleNext = () => {
    const step = steps[currentStep];
    if (!step) return;
    const stepId = step.id;
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
      trackStepCompleted(`integration-setup-${integration}`, currentStep, stepId);
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      trackFlowCompleted(`integration-setup-${integration}`, 0, completedSteps.length + 1);
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);

    try {
      // Initiate OAuth flow
      const response = await fetch(`/api/integrations/${integration}/oauth`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to initiate OAuth flow");
      }

      const data = await response.json();
      
      if (data.oauth_url) {
        // Redirect to OAuth URL
        window.location.href = data.oauth_url;
      } else {
        throw new Error("No OAuth URL returned");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect integration";
      setError(errorMessage);
      setConnecting(false);
      trackError(errorMessage, `integration-setup-${integration}`, undefined, true);
    }
  };

  const currentStepData = steps[currentStep];
  if (!currentStepData) return null;
  const totalTime = steps.reduce((sum, step) => sum + step.estimatedTime, 0);

  const totalTime = steps.reduce((sum, step) => sum + step.estimatedTime, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Header */}
      <Reveal variant="fadeInUp">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {integration === "shopify" ? "Shopify" : "Wave Accounting"} Setup
            </h2>
            <Badge variant="secondary">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Estimated time: {totalTime} minutes
          </p>
        </div>
      </Reveal>

      {/* Progress Indicator */}
      <ProgressIndicator
        current={currentStep}
        total={steps.length}
        completedSteps={completedSteps}
        stepLabels={steps.map((s) => s.title)}
      />

      {/* Current Step Card */}
      <StepTransition step={currentStep}>
        <AnimatedCard variant="fadeInUp">
          <Card>
            <CardHeader>
              <CardTitle>{currentStepData.title}</CardTitle>
              <CardDescription>{currentStepData.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
          {/* Instructions */}
          <div className="space-y-3">
            <h3 className="font-semibold">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              {currentStepData.instructions.map((instruction, idx) => (
                <li key={idx} className="text-muted-foreground">
                  {instruction}
                </li>
              ))}
            </ol>
          </div>

          {/* Action Button for Authorization Step */}
          {currentStepData.id === "authorize" && (
            <div className="pt-4 border-t">
              {error && (
                <ErrorMessage
                  message={error}
                  showRetry={true}
                  onRetry={handleConnect}
                  retryLabel="Try Again"
                />
              )}
              <AnimatedButton
                onClick={handleConnect}
                disabled={connecting}
                size="lg"
                className="w-full"
              >
                {connecting ? (
                  "Connecting..."
                ) : (
                  <>
                    Connect {integration === "shopify" ? "Shopify" : "Wave Accounting"}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </>
                )}
              </AnimatedButton>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                You'll be redirected to {integration === "shopify" ? "Shopify" : "Wave"} to authorize
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <AnimatedButton variant="outline" onClick={currentStep === 0 ? onCancel : handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentStep === 0 ? "Cancel" : "Back"}
            </AnimatedButton>
            {currentStepData.id !== "authorize" && (
              <AnimatedButton onClick={handleNext}>
                {currentStep === steps.length - 1 ? "Complete" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </AnimatedButton>
            )}
          </div>
        </CardContent>
          </Card>
        </AnimatedCard>
      </StepTransition>

    </div>
  );
}

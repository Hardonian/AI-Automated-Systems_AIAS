"use client";

import { useMachine } from "@xstate/react";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";

import { AnimatedButton, AnimatedCard, Reveal, StepTransition, PageTransition } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { demoFormMachine } from "@/lib/xstate/demo-machine";


/**
 * Playground Page
 * 
 * Internal route for verifying motion system and state machine patterns.
 * Demonstrates:
 * - Motion primitives (AnimatedButton, AnimatedCard, Reveal, StepTransition)
 * - State machine integration (demoFormMachine)
 * - Success and error handling
 * - Accessibility (reduced motion)
 */
export default function PlaygroundPage() {
  const [currentSection, setCurrentSection] = useState<"motion" | "state-machine">("motion");
  const [step, setStep] = useState(0);
  const [transitionKey, setTransitionKey] = useState(0);

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <Reveal variant="fadeInUp">
        <h1 className="text-4xl font-bold mb-2">UX System Playground</h1>
        <p className="text-muted-foreground mb-8">
          Internal verification route for motion system and state machines
        </p>
      </Reveal>

      {/* Section Toggle */}
      <div className="flex gap-4 mb-8">
        <Button
          variant={currentSection === "motion" ? "default" : "outline"}
          onClick={() => setCurrentSection("motion")}
        >
          Motion Primitives
        </Button>
        <Button
          variant={currentSection === "state-machine" ? "default" : "outline"}
          onClick={() => setCurrentSection("state-machine")}
        >
          State Machine Demo
        </Button>
      </div>

      {/* Motion Primitives Section */}
      {currentSection === "motion" && (
        <PageTransition transitionKey={`motion-${transitionKey}`}>
          <div className="space-y-8">
            {/* Animated Cards */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Animated Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatedCard staggerDelay={0} variant="fadeInUp">
                  <CardHeader>
                    <CardTitle>Fade In Up</CardTitle>
                    <CardDescription>Standard entrance animation</CardDescription>
                  </CardHeader>
                </AnimatedCard>
                <AnimatedCard staggerDelay={0.1} variant="scaleIn">
                  <CardHeader>
                    <CardTitle>Scale In</CardTitle>
                    <CardDescription>Gentle scale entrance</CardDescription>
                  </CardHeader>
                </AnimatedCard>
                <AnimatedCard staggerDelay={0.2} variant="slideInLeft">
                  <CardHeader>
                    <CardTitle>Slide In Left</CardTitle>
                    <CardDescription>Horizontal entrance</CardDescription>
                  </CardHeader>
                </AnimatedCard>
                <AnimatedCard staggerDelay={0.3} variant="slideInRight">
                  <CardHeader>
                    <CardTitle>Slide In Right</CardTitle>
                    <CardDescription>Horizontal entrance</CardDescription>
                  </CardHeader>
                </AnimatedCard>
              </div>
            </section>

            {/* Animated Buttons */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Animated Buttons</h2>
              <div className="flex flex-wrap gap-4">
                <AnimatedButton animationVariant="standard">Standard</AnimatedButton>
                <AnimatedButton animationVariant="subtle">Subtle</AnimatedButton>
                <AnimatedButton animationVariant="bouncy">Bouncy</AnimatedButton>
                <AnimatedButton animationVariant="standard" variant="outline">
                  Outline
                </AnimatedButton>
              </div>
            </section>

            {/* Reveal Components */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Reveal Components</h2>
              <div className="space-y-4">
                <Reveal delay={0} variant="fadeInUp">
                  <Card>
                    <CardHeader>
                      <CardTitle>Delayed Reveal (0s)</CardTitle>
                    </CardHeader>
                  </Card>
                </Reveal>
                <Reveal delay={0.2} variant="fadeInUp">
                  <Card>
                    <CardHeader>
                      <CardTitle>Delayed Reveal (0.2s)</CardTitle>
                    </CardHeader>
                  </Card>
                </Reveal>
                <Reveal delay={0.4} variant="fadeInUp">
                  <Card>
                    <CardHeader>
                      <CardTitle>Delayed Reveal (0.4s)</CardTitle>
                    </CardHeader>
                  </Card>
                </Reveal>
              </div>
            </section>

            {/* Step Transition */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Step Transitions</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Step {step + 1} of 3</CardTitle>
                  <CardDescription>Navigate between steps</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <StepTransition step={step}>
                    <div className="min-h-[200px] flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2">Step {step + 1}</h3>
                        <p className="text-muted-foreground">
                          This content transitions smoothly between steps
                        </p>
                      </div>
                    </div>
                  </StepTransition>
                  <div className="flex justify-between">
                    <Button
                      disabled={step === 0}
                      variant="outline"
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      disabled={step === 2}
                      onClick={() => setStep((s) => Math.min(2, s + 1))}
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Page Transition */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Page Transition</h2>
              <Card>
                <CardContent className="pt-6">
                  <Button
                    className="mb-4"
                    onClick={() => setTransitionKey((k) => k + 1)}
                  >
                    Trigger Transition
                  </Button>
                  <PageTransition transitionKey={transitionKey}>
                    <div className="p-8 bg-muted rounded-lg text-center">
                      <p className="text-lg">Transition Key: {transitionKey}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        This content transitions when the key changes
                      </p>
                    </div>
                  </PageTransition>
                </CardContent>
              </Card>
            </section>
          </div>
        </PageTransition>
      )}

      {/* State Machine Section */}
      {currentSection === "state-machine" && (
        <PageTransition transitionKey={`state-machine-${transitionKey}`}>
          <StateMachineDemo />
        </PageTransition>
      )}
    </div>
  );
}

/**
 * State Machine Demo Component
 * 
 * Demonstrates the demoFormMachine with real form interaction
 */
function StateMachineDemo() {
  const [state, send] = useMachine(demoFormMachine);
  const { formData, validationErrors, data, error } = state.context;

  const isPending = state.matches("submitting");
  const isSuccess = state.matches("success");
  const isError = state.matches("error");
  const isInvalid = state.matches("invalid");

  return (
    <div className="space-y-6">
      <Reveal variant="fadeInUp">
        <h2 className="text-2xl font-semibold mb-4">State Machine Demo</h2>
        <p className="text-muted-foreground mb-6">
          Form submission with validation, async operations, and error handling
        </p>
      </Reveal>

      {/* Current State Indicator */}
      <AnimatedCard variant="fadeInUp">
        <Card>
          <CardHeader>
            <CardTitle>Current State</CardTitle>
            <CardDescription>Machine state visualization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isPending ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200" :
                isSuccess ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" :
                isError ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200" :
                isInvalid ? "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200" :
                "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              }`}>
                {state.value as string}
              </div>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSuccess && <CheckCircle2 className="h-4 w-4 text-green-600" />}
              {isError && <AlertCircle className="h-4 w-4 text-red-600" />}
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Form */}
      <AnimatedCard staggerDelay={0.1} variant="fadeInUp">
        <Card>
          <CardHeader>
            <CardTitle>Demo Form</CardTitle>
            <CardDescription>
              Fill out the form and submit to see state machine in action
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                aria-describedby={validationErrors.name ? "name-error" : undefined}
                aria-invalid={!!validationErrors.name}
                disabled={isPending}
                id="name"
                value={formData.name}
                onChange={(e) =>
                  send({ type: "INPUT_CHANGE", field: "name", value: e.target.value })
                }
              />
              {validationErrors.name && (
                <Reveal immediate={false} variant="fadeInUp">
                  <p className="text-sm text-red-600 dark:text-red-400" id="name-error">
                    {validationErrors.name}
                  </p>
                </Reveal>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                aria-describedby={validationErrors.email ? "email-error" : undefined}
                aria-invalid={!!validationErrors.email}
                disabled={isPending}
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  send({ type: "INPUT_CHANGE", field: "email", value: e.target.value })
                }
              />
              {validationErrors.email && (
                <Reveal immediate={false} variant="fadeInUp">
                  <p className="text-sm text-red-600 dark:text-red-400" id="email-error">
                    {validationErrors.email}
                  </p>
                </Reveal>
              )}
            </div>

            <div className="flex gap-2">
              <AnimatedButton
                className="flex-1"
                disabled={isPending}
                onClick={() => send({ type: "SUBMIT" })}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </AnimatedButton>
              {(isSuccess || isError) && (
                <AnimatedButton
                  variant="outline"
                  onClick={() => send({ type: "RESET" })}
                >
                  Reset
                </AnimatedButton>
              )}
              {isError && (
                <AnimatedButton
                  variant="outline"
                  onClick={() => send({ type: "RETRY" })}
                >
                  Retry
                </AnimatedButton>
              )}
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Success Message */}
      {isSuccess && data && (
        <Reveal variant="fadeInUp">
          <AnimatedCard variant="fadeInUp">
            <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                      Success!
                    </h3>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      {data.message}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </Reveal>
      )}

      {/* Error Message */}
      {isError && error && (
        <Reveal variant="fadeInUp">
          <AnimatedCard variant="fadeInUp">
            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                      Error
                    </h3>
                    <p className="text-sm text-red-800 dark:text-red-200">
                      {error instanceof Error ? error.message : String(error)}
                    </p>
                    {state.context.retryCount !== undefined && (
                      <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                        Retry count: {state.context.retryCount}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </Reveal>
      )}
    </div>
  );
}

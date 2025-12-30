/**
 * Onboarding Wizard State Machine
 * 
 * Manages the multi-step onboarding flow with validation,
 * async operations, and error handling.
 */

import { createMachine, assign } from "xstate";
import { StepFlowContext, StepFlowEvents, GuardFn, MachineError } from "./conventions";
import { createMachineError } from "./utils";

/**
 * Onboarding step IDs
 */
export type OnboardingStepId = 
  | "welcome"
  | "choose-integration"
  | "create-workflow"
  | "test-workflow"
  | "complete";

/**
 * Integration provider
 */
export type IntegrationProvider = 
  | "shopify"
  | "wave"
  | "stripe"
  | "gmail"
  | "slack"
  | "notion";

/**
 * Onboarding context
 */
export interface OnboardingContext extends StepFlowContext {
  selectedIntegration?: IntegrationProvider;
  workflowCreated?: boolean;
  workflowTested?: boolean;
  error?: MachineError;
  retryCount?: number;
}

/**
 * Onboarding events
 */
export type OnboardingEvent =
  | { type: "NEXT" }
  | { type: "PREVIOUS" }
  | { type: "GO_TO_STEP"; step: number }
  | { type: "SELECT_INTEGRATION"; provider: IntegrationProvider }
  | { type: "CREATE_WORKFLOW" }
  | { type: "TEST_WORKFLOW" }
  | { type: "RETRY" }
  | { type: "RESET" }
  | { type: "COMPLETE" };

/**
 * Step definitions
 */
const STEPS: OnboardingStepId[] = [
  "welcome",
  "choose-integration",
  "create-workflow",
  "test-workflow",
  "complete",
];

/**
 * Validation guards
 */
const canProceedFromWelcome: GuardFn<OnboardingContext, OnboardingEvent> = () => {
  // Welcome step can always proceed
  return true;
};

const canProceedFromChooseIntegration: GuardFn<OnboardingContext, OnboardingEvent> = (context) => {
  return !!context.selectedIntegration;
};

const canProceedFromCreateWorkflow: GuardFn<OnboardingContext, OnboardingEvent> = (context) => {
  return !!context.workflowCreated;
};

const canProceedFromTestWorkflow: GuardFn<OnboardingContext, OnboardingEvent> = (context) => {
  return !!context.workflowTested;
};

/**
 * Service: Connect integration
 */
async function connectIntegration(provider: IntegrationProvider): Promise<void> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Simulate occasional failures (20% chance)
  if (Math.random() < 0.2) {
    throw new Error(`Failed to connect ${provider}. Please try again.`);
  }
}

/**
 * Service: Create workflow
 */
async function createWorkflow(integration: IntegrationProvider): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  if (Math.random() < 0.15) {
    throw new Error("Failed to create workflow. Please try again.");
  }
}

/**
 * Service: Test workflow
 */
async function testWorkflow(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  if (Math.random() < 0.1) {
    throw new Error("Workflow test failed. Please check your configuration.");
  }
}

/**
 * Onboarding State Machine
 * 
 * States:
 * - idle: Initial state
 * - welcome: Welcome step
 * - choosingIntegration: Choosing integration step
 * - connectingIntegration: Connecting integration (async)
 * - creatingWorkflow: Creating workflow step
 * - creatingWorkflowAsync: Creating workflow (async)
 * - testingWorkflow: Testing workflow step
 * - testingWorkflowAsync: Testing workflow (async)
 * - complete: Onboarding complete
 * - error: Error state
 */
export const onboardingMachine = createMachine(
  {
    id: "onboarding",
    types: {} as {
      context: OnboardingContext;
      events: OnboardingEvent;
    },
    initial: "welcome",
    context: {
      currentStep: 0,
      totalSteps: STEPS.length,
      completedSteps: [],
      data: {},
      retryCount: 0,
    },
    states: {
      welcome: {
        entry: assign({
          currentStep: 0,
          error: undefined,
        }),
        on: {
          NEXT: {
            target: "choosingIntegration",
            guard: canProceedFromWelcome,
            actions: assign({
              currentStep: 1,
            }),
          },
        },
      },
      choosingIntegration: {
        entry: assign({
          currentStep: 1,
          error: undefined,
        }),
        on: {
          SELECT_INTEGRATION: {
            target: "choosingIntegration",
            actions: assign({
              selectedIntegration: ({ event }) => event.provider,
            }),
          },
          PREVIOUS: {
            target: "welcome",
            actions: assign({
              currentStep: 0,
            }),
          },
          NEXT: {
            target: "connectingIntegration",
            guard: canProceedFromChooseIntegration,
          },
        },
      },
      connectingIntegration: {
        entry: assign({
          error: undefined,
        }),
        invoke: {
          id: "connectIntegration",
          src: ({ context }) => {
            if (!context.selectedIntegration) {
              throw new Error("No integration selected");
            }
            return Promise.race([
              connectIntegration(context.selectedIntegration),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Connection timeout. Please try again.")), 10000)
              ),
            ]);
          },
          onDone: {
            target: "creatingWorkflow",
            actions: assign({
              currentStep: 2,
              completedSteps: ({ context }) => [
                ...context.completedSteps,
                "choose-integration",
              ],
              retryCount: 0,
            }),
          },
          onError: {
            target: "error",
            actions: assign({
              error: ({ event }) => createMachineError(event.error),
              retryCount: ({ context }) => (context.retryCount || 0) + 1,
            }),
          },
        },
        after: {
          10000: {
            target: "error",
            actions: assign({
              error: () => createMachineError(new Error("Connection timeout. Please try again.")),
            }),
          },
        },
        on: {
          CANCEL: {
            target: "choosingIntegration",
          },
        },
      },
      creatingWorkflow: {
        entry: assign({
          currentStep: 2,
          error: undefined,
        }),
        on: {
          CREATE_WORKFLOW: {
            target: "creatingWorkflowAsync",
          },
          PREVIOUS: {
            target: "choosingIntegration",
            actions: assign({
              currentStep: 1,
            }),
          },
        },
      },
      creatingWorkflowAsync: {
        entry: assign({
          error: undefined,
        }),
        invoke: {
          id: "createWorkflow",
          src: ({ context }) => {
            if (!context.selectedIntegration) {
              throw new Error("No integration selected");
            }
            return Promise.race([
              createWorkflow(context.selectedIntegration),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Workflow creation timeout. Please try again.")), 15000)
              ),
            ]);
          },
          onDone: {
            target: "testingWorkflow",
            actions: assign({
              workflowCreated: true,
              currentStep: 3,
              completedSteps: ({ context }) => [
                ...context.completedSteps,
                "create-workflow",
              ],
              retryCount: 0,
            }),
          },
          onError: {
            target: "error",
            actions: assign({
              error: ({ event }) => createMachineError(event.error),
              retryCount: ({ context }) => (context.retryCount || 0) + 1,
            }),
          },
        },
        after: {
          15000: {
            target: "error",
            actions: assign({
              error: () => createMachineError(new Error("Workflow creation timeout. Please try again.")),
            }),
          },
        },
        on: {
          CANCEL: {
            target: "creatingWorkflow",
          },
        },
      },
      testingWorkflow: {
        entry: assign({
          currentStep: 3,
          error: undefined,
        }),
        on: {
          TEST_WORKFLOW: {
            target: "testingWorkflowAsync",
          },
          PREVIOUS: {
            target: "creatingWorkflow",
            actions: assign({
              currentStep: 2,
            }),
          },
        },
      },
      testingWorkflowAsync: {
        entry: assign({
          error: undefined,
        }),
        invoke: {
          id: "testWorkflow",
          src: () => Promise.race([
            testWorkflow(),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Workflow test timeout. Please try again.")), 8000)
            ),
          ]),
          onDone: {
            target: "complete",
            actions: assign({
              workflowTested: true,
              currentStep: 4,
              completedSteps: ({ context }) => [
                ...context.completedSteps,
                "test-workflow",
              ],
              retryCount: 0,
            }),
          },
          onError: {
            target: "error",
            actions: assign({
              error: ({ event }) => createMachineError(event.error),
              retryCount: ({ context }) => (context.retryCount || 0) + 1,
            }),
          },
        },
        after: {
          8000: {
            target: "error",
            actions: assign({
              error: () => createMachineError(new Error("Workflow test timeout. Please try again.")),
            }),
          },
        },
        on: {
          CANCEL: {
            target: "testingWorkflow",
          },
        },
      },
      complete: {
        entry: assign({
          currentStep: 4,
          completedSteps: ({ context }) => [
            ...context.completedSteps,
            "complete",
          ],
        }),
        on: {
          RESET: {
            target: "welcome",
            actions: assign({
              currentStep: 0,
              completedSteps: [],
              selectedIntegration: undefined,
              workflowCreated: false,
              workflowTested: false,
              error: undefined,
              retryCount: 0,
            }),
          },
        },
      },
      error: {
        entry: ({ context }) => {
          // Log error for debugging
          if (process.env.NODE_ENV === "development") {
            console.error("[Onboarding Error]", context.error);
          }
        },
        on: {
          RETRY: [
            {
              guard: ({ context }) => {
                const retryCount = context.retryCount || 0;
                return context.currentStep === 1 && retryCount < 3;
              },
              target: "connectingIntegration",
              actions: assign({
                error: undefined,
              }),
            },
            {
              guard: ({ context }) => {
                const retryCount = context.retryCount || 0;
                return context.currentStep === 2 && retryCount < 3;
              },
              target: "creatingWorkflowAsync",
              actions: assign({
                error: undefined,
              }),
            },
            {
              guard: ({ context }) => {
                const retryCount = context.retryCount || 0;
                return context.currentStep === 3 && retryCount < 3;
              },
              target: "testingWorkflowAsync",
              actions: assign({
                error: undefined,
              }),
            },
          ],
          PREVIOUS: [
            {
              guard: ({ context }) => context.currentStep === 1,
              target: "choosingIntegration",
            },
            {
              guard: ({ context }) => context.currentStep === 2,
              target: "creatingWorkflow",
            },
            {
              guard: ({ context }) => context.currentStep === 3,
              target: "testingWorkflow",
            },
          ],
          RESET: {
            target: "welcome",
            actions: assign({
              currentStep: 0,
              completedSteps: [],
              selectedIntegration: undefined,
              workflowCreated: false,
              workflowTested: false,
              error: undefined,
              retryCount: 0,
            }),
          },
        },
      },
    },
  },
  {
    guards: {
      canProceedFromWelcome,
      canProceedFromChooseIntegration,
      canProceedFromCreateWorkflow,
      canProceedFromTestWorkflow,
    },
  }
);

// Export types
export type { OnboardingContext, OnboardingEvent };

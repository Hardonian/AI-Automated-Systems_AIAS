/**
 * Demo State Machine
 * 
 * Reference implementation demonstrating XState patterns and conventions.
 * This machine handles a simple form submission flow with validation,
 * async operations, error handling, and retry logic.
 */

import { createMachine, assign, fromPromise } from "xstate";
import { 
  AsyncContext, 
  MachineError,
  GuardFn,
  ValidationResult,
} from "./conventions";
import { retry, createMachineError } from "./utils";

/**
 * Context for demo form machine
 */
interface DemoFormContext extends AsyncContext<{ message: string }> {
  formData: {
    name: string;
    email: string;
  };
  validationErrors: Record<string, string>;
}

/**
 * Events for demo form machine
 */
type DemoFormEvent =
  | { type: "INPUT_CHANGE"; field: "name" | "email"; value: string }
  | { type: "SUBMIT" }
  | { type: "RETRY" }
  | { type: "RESET" }
  | { type: "CANCEL" };

/**
 * Demo service: Simulates API call
 */
async function submitForm(data: DemoFormContext["formData"]): Promise<{ message: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Simulate occasional failures (30% chance)
  if (Math.random() < 0.3) {
    throw new Error("Network error: Failed to submit form");
  }
  
  return {
    message: `Hello, ${data.name}! Your form has been submitted successfully.`,
  };
}

/**
 * Validation function
 */
function validateForm(context: DemoFormContext): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  if (!context.formData.name || context.formData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }
  
  if (!context.formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(context.formData.email)) {
    errors.email = "Please enter a valid email address";
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validation guard
 */
const isValidForm = ({ context }: { context: DemoFormContext }) => {
  const result = validateForm(context);
  return result.valid;
};

/**
 * Demo Form State Machine
 * 
 * States:
 * - idle: Initial state, form is ready for input
 * - validating: Form is being validated
 * - invalid: Form validation failed
 * - submitting: Form is being submitted
 * - success: Form submitted successfully
 * - error: Form submission failed
 */
// Export types for external use
export type { DemoFormContext, DemoFormEvent };

export const demoFormMachine = createMachine(
  {
    id: "demoForm",
    types: {} as {
      context: DemoFormContext;
      events: DemoFormEvent;
    },
    initial: "idle",
    context: {
      formData: {
        name: "",
        email: "",
      },
      validationErrors: {},
      retryCount: 0,
    },
    states: {
      idle: {
        on: {
          INPUT_CHANGE: {
            target: "idle",
            actions: assign({
              formData: ({ context, event }) => ({
                ...context.formData,
                [event.field]: event.value,
              }),
              validationErrors: {},
            }),
          },
          SUBMIT: {
            target: "validating",
          },
        },
      },
      validating: {
        always: [
          {
            guard: isValidForm,
            target: "submitting",
            actions: assign({
              validationErrors: {},
            }),
          },
          {
            target: "invalid",
            actions: assign({
              validationErrors: ({ context }) => validateForm(context).errors,
            }),
          },
        ],
      },
      invalid: {
        on: {
          INPUT_CHANGE: {
            target: "idle",
            actions: assign({
              formData: ({ context, event }) => ({
                ...context.formData,
                [event.field]: event.value,
              }),
              validationErrors: {},
            }),
          },
          SUBMIT: {
            target: "validating",
          },
        },
      },
      submitting: {
        entry: assign({
          error: undefined,
        }),
        invoke: {
          id: "submitForm",
          src: fromPromise(async ({ input }: { input: DemoFormContext["formData"] }) => {
            return await retry(() => submitForm(input), 3, 1000);
          }),
          input: ({ context }: { context: DemoFormContext }) => context.formData,
          onDone: {
            target: "success",
            actions: assign({
              data: ({ event }) => event.output,
              retryCount: 0,
            }),
          },
          onError: {
            target: "error",
            actions: assign({
              error: ({ event }) => {
                const machineError = createMachineError(event.error);
                return new Error(machineError.message);
              },
              retryCount: ({ context }) => (context.retryCount || 0) + 1,
            }),
          },
        },
        on: {
          CANCEL: {
            target: "idle",
          },
        },
      },
      success: {
        on: {
          RESET: {
            target: "idle",
            actions: assign({
              formData: {
                name: "",
                email: "",
              },
              validationErrors: {},
              data: undefined,
              error: undefined,
              retryCount: 0,
            }),
          },
        },
      },
      error: {
        on: {
          RETRY: {
            target: "submitting",
          },
          RESET: {
            target: "idle",
            actions: assign({
              formData: {
                name: "",
                email: "",
              },
              validationErrors: {},
              data: undefined,
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
      isValidForm,
    },
  }
);

/**
 * XState React Hooks
 * 
 * Ergonomic hooks for consuming state machines in React components
 */

import { useMachine, useSelector } from "@xstate/react";
import { StateMachine, ActorRefFrom } from "xstate";
import { useMemo } from "react";

/**
 * Hook for using a state machine with typed state
 */
export function useTypedMachine<TMachine extends StateMachine<any, any, any>>(
  machine: TMachine
) {
  return useMachine(machine);
}

/**
 * Hook for selecting a specific value from machine state
 */
export function useMachineSelector<
  TMachine extends StateMachine<any, any, any>,
  TValue
>(
  actor: ActorRefFrom<TMachine>,
  selector: (state: ReturnType<ActorRefFrom<TMachine>["getSnapshot"]>) => TValue
): TValue {
  return useSelector(actor, selector);
}

/**
 * Hook for checking if machine is in a specific state
 */
export function useIsInState<TMachine extends StateMachine<any, any, any>>(
  actor: ActorRefFrom<TMachine>,
  stateValue: string | string[]
): boolean {
  return useSelector(actor, (state) => {
    if (Array.isArray(stateValue)) {
      return stateValue.some((sv) => state.matches(sv));
    }
    return state.matches(stateValue);
  });
}

/**
 * Hook for getting current state value
 */
export function useCurrentState<TMachine extends StateMachine<any, any, any>>(
  actor: ActorRefFrom<TMachine>
): string {
  return useSelector(actor, (state) => state.value as string);
}

/**
 * Hook for getting context value
 */
export function useMachineContext<TMachine extends StateMachine<any, any, any>>(
  actor: ActorRefFrom<TMachine>
) {
  return useSelector(actor, (state) => state.context);
}

/**
 * Hook for checking if machine is in async pending state
 */
export function useIsPending<TMachine extends StateMachine<any, any, any>>(
  actor: ActorRefFrom<TMachine>
): boolean {
  return useIsInState(actor, "pending");
}

/**
 * Hook for checking if machine is in error state
 */
export function useHasError<TMachine extends StateMachine<any, any, any>>(
  actor: ActorRefFrom<TMachine>
): boolean {
  return useIsInState(actor, "error");
}

/**
 * Hook for getting error from machine context
 */
export function useMachineError<TMachine extends StateMachine<any, any, any>>(
  actor: ActorRefFrom<TMachine>
): unknown {
  return useSelector(actor, (state) => {
    const context = state.context as { error?: unknown };
    return context.error;
  });
}

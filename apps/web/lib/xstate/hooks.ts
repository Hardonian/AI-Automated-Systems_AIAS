/**
 * XState React Hooks
 * 
 * Ergonomic hooks for consuming state machines in React components
 */

import { useMachine, useSelector } from "@xstate/react";
import { AnyActorRef, StateFrom } from "xstate";
import { useMemo } from "react";

/**
 * Hook for using a state machine with typed state
 */
export function useTypedMachine<TMachine extends Parameters<typeof useMachine>[0]>(
  machine: TMachine
) {
  return useMachine(machine);
}

/**
 * Hook for selecting a specific value from machine state
 */
export function useMachineSelector<
  TActor extends AnyActorRef,
  TValue
>(
  actor: TActor,
  selector: (snapshot: TActor extends { getSnapshot(): infer TSnapshot } ? TSnapshot : any) => TValue
): TValue {
  return useSelector(actor, selector as any);
}

/**
 * Hook for checking if machine is in a specific state
 */
export function useIsInState<TActor extends AnyActorRef>(
  actor: TActor,
  stateValue: string | string[]
): boolean {
  return useSelector(actor, (state: any) => {
    if (Array.isArray(stateValue)) {
      return stateValue.some((sv) => state.matches(sv));
    }
    return state.matches(stateValue);
  });
}

/**
 * Hook for getting current state value
 */
export function useCurrentState<TActor extends AnyActorRef>(
  actor: TActor
): string {
  return useSelector(actor, (state: any) => state.value as string);
}

/**
 * Hook for getting context value
 */
export function useMachineContext<TActor extends AnyActorRef>(
  actor: TActor
) {
  return useSelector(actor, (state: any) => state.context);
}

/**
 * Hook for checking if machine is in async pending state
 */
export function useIsPending<TActor extends AnyActorRef>(
  actor: TActor
): boolean {
  return useIsInState(actor, "pending");
}

/**
 * Hook for checking if machine is in error state
 */
export function useHasError<TActor extends AnyActorRef>(
  actor: TActor
): boolean {
  return useIsInState(actor, "error");
}

/**
 * Hook for getting error from machine context
 */
export function useMachineError<TActor extends AnyActorRef>(
  actor: TActor
): unknown {
  return useSelector(actor, (state: any) => {
    const context = state.context as { error?: unknown };
    return context.error;
  });
}

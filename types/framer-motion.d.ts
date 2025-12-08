/**
 * Type declarations to fix Framer Motion className issues
 * Extends motion components to accept className prop
 */

import 'framer-motion';
import { HTMLAttributes, ReactNode } from 'react';

declare module 'framer-motion' {
  // Override the problematic type that filters out className
  export type HTMLAttributesWithoutMotionProps<T extends keyof React.JSX.IntrinsicElements> = 
    Omit<HTMLAttributes<React.JSX.IntrinsicElements[T]>, 'style' | 'className'> & {
      className?: string;
      style?: React.CSSProperties | any;
    };
  
  // Extend MotionProps to include className
  export interface MotionProps {
    className?: string;
    children?: ReactNode;
  }
  
  // Override motion component types to accept className
  export interface MotionComponentProps<T extends keyof React.JSX.IntrinsicElements> 
    extends HTMLAttributes<React.JSX.IntrinsicElements[T]>, MotionProps {
    className?: string;
  }
}

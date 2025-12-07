/**
 * Type declarations to fix Framer Motion className issues
 * Extends motion components to accept className prop
 */

import 'framer-motion';
import { HTMLAttributes } from 'react';

declare module 'framer-motion' {
  // Override HTMLAttributesWithoutMotionProps to include className
  export type HTMLAttributesWithoutMotionProps<T extends keyof React.JSX.IntrinsicElements> = 
    Omit<HTMLAttributes<React.JSX.IntrinsicElements[T]>, 'style'> & {
      className?: string;
      style?: React.CSSProperties | any;
    };
  
  // Extend MotionProps to include className
  export interface MotionProps {
    className?: string;
  }
}

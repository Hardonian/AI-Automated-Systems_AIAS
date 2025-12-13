"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { motionTransitions, motionScale, prefersReducedMotion } from "@/lib/style/motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-95 min-h-[44px] min-w-[44px] relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground hover:from-primary/90 hover:via-primary hover:to-primary/95 shadow-md hover:shadow-lg hover:scale-105",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md hover:scale-105",
        outline: "border-2 border-border bg-background hover:bg-muted hover:border-primary/50 shadow-sm hover:shadow-md hover:scale-105",
        ghost: "hover:bg-muted hover:text-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg hover:scale-105",
        cta: "bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground hover:from-primary/95 hover:via-primary hover:to-primary/95 shadow-lg hover:shadow-xl hover:scale-110 font-bold text-base relative",
        trust: "bg-gradient-to-r from-green-500 via-green-600 to-green-500 text-white hover:from-green-600 hover:via-green-500 hover:to-green-600 shadow-lg hover:shadow-xl hover:scale-105",
        premium: "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 shadow-xl hover:shadow-2xl hover:scale-110 font-bold",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        pill: "h-11 px-8 rounded-full text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
);

// Type that excludes HTML animation handlers that conflict with Framer Motion
type ButtonHTMLPropsWithoutAnimationHandlers = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
>;

export interface ButtonProps
  extends ButtonHTMLPropsWithoutAnimationHandlers,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  "aria-label"?: string; // Explicitly support aria-label for accessibility
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, icon, iconPosition = "left", children, disabled, "aria-label": ariaLabel, ...props }, ref) => {
    const Comp = asChild ? Slot : motion.button;
    const isDisabled = disabled || loading;
    
    // If icon-only button without children, ensure aria-label is provided
    const hasText = Boolean(children);
    const isIconOnly = Boolean(icon && !hasText);
    
    if (isIconOnly && !ariaLabel && !props["aria-labelledby"]) {
      console.warn("Button: Icon-only button should have aria-label or aria-labelledby for accessibility");
    }
    
    const buttonContent = (
      <>
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin absolute left-1/2 -translate-x-1/2" aria-hidden="true" />
        )}
        <span className={cn("flex items-center gap-2", loading && "invisible")}>
          {icon && iconPosition === "left" && <span className="inline-flex" aria-hidden="true">{icon}</span>}
          {children}
          {icon && iconPosition === "right" && <span className="inline-flex" aria-hidden="true">{icon}</span>}
        </span>
        {variant === "cta" && (
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" aria-hidden="true" />
        )}
      </>
    );
    
    if (asChild) {
      return (
        <Slot ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props}>
          {buttonContent}
        </Slot>
      );
    }
    
    // Type-safe props for motion.button
    // We exclude conflicting animation handlers that are already excluded from ButtonProps
    type SafeMotionButtonProps = Omit<
      HTMLMotionProps<"button">,
      "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDrag" | "onDragStart" | "onDragEnd"
    >;
    
    const motionProps: Partial<SafeMotionButtonProps> = prefersReducedMotion() 
      ? {} 
      : {
          whileHover: { scale: isDisabled ? 1 : motionScale.hover },
          whileTap: { scale: isDisabled ? 1 : motionScale.active },
          transition: motionTransitions.standard,
        };
    
    // Extract only the props that are safe for MotionButton
    // Exclude custom props (variant, size, etc. are handled separately)
    const {
      asChild: _asChild,
      loading: _loading,
      icon: _icon,
      iconPosition: _iconPosition,
      variant: _variant,
      size: _size,
      ...motionSafeProps
    } = props;
    
    return (
      <motion.button
        ref={ref}
        aria-busy={loading}
        aria-disabled={isDisabled}
        aria-label={ariaLabel || (isIconOnly ? undefined : ariaLabel)}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isDisabled}
        {...motionProps}
        {...(motionSafeProps as SafeMotionButtonProps)}
      >
        {buttonContent}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };

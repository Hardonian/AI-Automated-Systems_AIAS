"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import * as React from "react";

import {
  motionTransitions,
  motionScale,
  useSafeReducedMotion,
} from "@/lib/style/motion";
import { cn } from "@/lib/utils";

import { playClick } from "@/lib/audio/sound-fx";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-none font-mono text-sm font-bold uppercase tracking-wider ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:translate-y-0.5 min-h-[44px] min-w-[44px] relative overflow-hidden group cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "border-2 border-primary bg-primary text-primary-foreground shadow-[3px_3px_0px_0px_hsl(var(--text))] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_hsl(var(--text))] active:shadow-none",
        secondary:
          "border-2 border-border bg-secondary text-secondary-foreground shadow-[3px_3px_0px_0px_hsl(var(--text))] hover:-translate-y-0.5 hover:border-foreground",
        outline:
          "border-2 border-border bg-background text-foreground shadow-[3px_3px_0px_0px_hsl(var(--text))] hover:-translate-y-0.5 hover:border-foreground hover:bg-muted/40",
        ghost: "hover:bg-muted hover:text-foreground",
        destructive:
          "border-2 border-destructive bg-destructive text-destructive-foreground shadow-[3px_3px_0px_0px_hsl(var(--text))] hover:-translate-y-0.5",
        cta: "border-2 border-primary bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_hsl(var(--text))] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_hsl(var(--text))] font-black text-base relative",
        trust:
          "border-2 border-emerald-600 bg-emerald-600 text-white shadow-[3px_3px_0px_0px_hsl(var(--text))] hover:-translate-y-0.5",
        premium:
          "border-2 border-amber-500 bg-amber-500 text-black shadow-[4px_4px_0px_0px_hsl(var(--text))] hover:-translate-y-0.5 font-black",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        pill: "h-11 px-8 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
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
  extends
    ButtonHTMLPropsWithoutAnimationHandlers,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  "aria-label"?: string; // Explicitly support aria-label for accessibility
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      icon,
      iconPosition = "left",
      children,
      disabled,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    // Safe SSR: use hook to defer motion preference check to after hydration
    const shouldReduceMotion = useSafeReducedMotion();
    const isDisabled = disabled || loading;

    // If icon-only button without children, ensure aria-label is provided
    const hasText = Boolean(children);
    const isIconOnly = Boolean(icon && !hasText);

    if (isIconOnly && !ariaLabel && !props["aria-labelledby"]) {
      console.warn(
        "Button: Icon-only button should have aria-label or aria-labelledby for accessibility",
      );
    }

    const buttonContent = (
      <>
        {loading && (
          <Loader2
            className="absolute left-1/2 mr-2 h-4 w-4 -translate-x-1/2 animate-spin"
            aria-hidden="true"
          />
        )}
        <span className={cn("flex items-center gap-2", loading && "invisible")}>
          {icon && iconPosition === "left" && (
            <span className="inline-flex" aria-hidden="true">
              {icon}
            </span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span className="inline-flex" aria-hidden="true">
              {icon}
            </span>
          )}
        </span>
        {variant === "cta" && (
          <span
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
            aria-hidden="true"
          />
        )}
      </>
    );

    if (asChild) {
      // React Server Components can deserialize a single JSX child as a
      // one-item array. Normalize it before cloning instead of relying on
      // Children.only(), which rejects arrays regardless of their length.
      const childNodes = React.Children.toArray(children);
      const child = childNodes.length === 1 ? childNodes[0] : null;
      if (React.isValidElement(child)) {
        const childType = child.type;
        const childIsFragment = childType === React.Fragment;

        if (childIsFragment) {
          return (
            <span
              className={cn(buttonVariants({ variant, size }), className)}
              {...(props as React.HTMLAttributes<HTMLSpanElement>)}
            >
              {buttonContent}
            </span>
          );
        }

        // Use the child element's own children (e.g. the text inside <Link>)
        // instead of Button's `children` (the <Link> itself) to avoid nesting
        // an <a> inside an <a> when the child renders an anchor element.
        const childContent = (child.props as { children?: React.ReactNode })
          .children;
        const asChildContent = (
          <>
            {loading && (
              <Loader2
                className="absolute left-1/2 mr-2 h-4 w-4 -translate-x-1/2 animate-spin"
                aria-hidden="true"
              />
            )}
            <span
              className={cn("flex items-center gap-2", loading && "invisible")}
            >
              {icon && iconPosition === "left" && (
                <span className="inline-flex" aria-hidden="true">
                  {icon}
                </span>
              )}
              {childContent}
              {icon && iconPosition === "right" && (
                <span className="inline-flex" aria-hidden="true">
                  {icon}
                </span>
              )}
            </span>
            {variant === "cta" && (
              <span
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
                aria-hidden="true"
              />
            )}
          </>
        );
        return (
          <Slot
            ref={ref}
            className={cn(buttonVariants({ variant, size }), className)}
            {...props}
          >
            {React.cloneElement(child, undefined, asChildContent)}
          </Slot>
        );
      }
    }

    // Type-safe props for motion.button
    // HTMLMotionProps includes className from React.ButtonHTMLAttributes
    type SafeMotionButtonProps = Omit<
      HTMLMotionProps<"button">,
      | "onAnimationStart"
      | "onAnimationEnd"
      | "onAnimationIteration"
      | "onDrag"
      | "onDragStart"
      | "onDragEnd"
    >;

    // Type for remaining props after destructuring custom Button props
    // This ensures type safety when spreading props to motion.button
    type RemainingButtonProps = Omit<
      ButtonProps,
      | "className"
      | "variant"
      | "size"
      | "asChild"
      | "loading"
      | "icon"
      | "iconPosition"
      | "children"
      | "disabled"
      | "aria-label"
    >;

    const motionProps: Partial<
      Pick<SafeMotionButtonProps, "whileHover" | "whileTap" | "transition">
    > = shouldReduceMotion
      ? {}
      : {
          whileHover: { scale: isDisabled ? 1 : motionScale.hover },
          whileTap: { scale: isDisabled ? 1 : motionScale.active },
          transition:
            motionTransitions.standard as unknown as SafeMotionButtonProps["transition"],
        };

    // Props are already filtered - asChild, loading, icon, iconPosition, variant, size
    // are already destructured from function parameters, so props only contains HTML button attributes
    // Type assertion is safe because RemainingButtonProps only contains HTML button attributes
    const safeProps = props as RemainingButtonProps;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      playClick();
      (props as React.ButtonHTMLAttributes<HTMLButtonElement>).onClick?.(e);
    };

    return (
      <motion.button
        ref={ref}
        aria-busy={loading}
        aria-disabled={isDisabled}
        aria-label={ariaLabel}
        disabled={isDisabled}
        {...motionProps}
        className={cn(buttonVariants({ variant, size }), className)}
        {...safeProps}
        onClick={handleClick}
      >
        {buttonContent}
      </motion.button>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };

/**
 * Retry Button Component
 * Provides consistent retry functionality with loading states
 */

"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface RetryButtonProps {
  onRetry: () => Promise<void> | void;
  label?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "xl" | "icon" | "pill";
}

export function RetryButton({
  onRetry,
  label = "Try again",
  variant = "outline",
  size = "md",
}: RetryButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } catch (error) {
      // Catch and log error to prevent unhandled rejections
      console.error("Retry failed:", error);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <Button
      onClick={handleRetry}
      variant={variant}
      size={size}
      disabled={isRetrying}
    >
      <RefreshCw
        className={`mr-2 h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
      />
      {label}
    </Button>
  );
}

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
  size?: "default" | "sm" | "lg" | "icon";
}

export function RetryButton({
  onRetry,
  label = "Try again",
  variant = "outline",
  size = "default",
}: RetryButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <Button onClick={handleRetry} variant={variant} size={size} disabled={isRetrying}>
      <RefreshCw className={`mr-2 h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} />
      {label}
    </Button>
  );
}

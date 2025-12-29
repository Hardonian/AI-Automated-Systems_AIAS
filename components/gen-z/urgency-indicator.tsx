"use client";

import { Clock, Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";

interface UrgencyIndicatorProps {
  spotsRemaining?: number;
  deadline?: Date;
  className?: string;
}

export function UrgencyIndicator({ spotsRemaining, deadline, className }: UrgencyIndicatorProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    if (!deadline) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [deadline]);

  if (!spotsRemaining && !timeRemaining) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`} role="status" aria-live="polite">
      {spotsRemaining && spotsRemaining < 10 && (
        <Badge variant="destructive" className="animate-pulse">
          <Zap className="h-3 w-3 mr-1" aria-hidden="true" />
          Only {spotsRemaining} spots left
        </Badge>
      )}
      {timeRemaining && (
        <Badge variant="outline" className="border-primary text-primary">
          <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
          {timeRemaining} remaining
        </Badge>
      )}
    </div>
  );
}

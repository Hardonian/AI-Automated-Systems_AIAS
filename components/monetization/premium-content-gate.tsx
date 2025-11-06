"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PremiumContentGateProps {
  title?: string;
  description?: string;
  preview?: string;
  unlockPrice?: number;
}

export function PremiumContentGate({
  title = "Premium Content",
  description = "This content is available for premium subscribers",
  preview,
  unlockPrice = 9,
}: PremiumContentGateProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  // TODO: Check if user is premium subscriber

  if (isUnlocked) {
    return null; // Show full content
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔒 Premium Content
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {preview && (
          <div className="prose prose-sm dark:prose-invert max-w-none opacity-60 blur-sm pointer-events-none">
            {preview}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <Link href="/pricing">Subscribe to Premium (${unlockPrice}/month)</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/premium">View Premium Features</Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Premium subscribers get access to all premium content, exclusive frameworks, 
          and advanced systems thinking resources.
        </p>
      </CardContent>
    </Card>
  );
}

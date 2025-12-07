/**
 * Enhanced CTA Component
 * CRO-optimized with urgency, social proof, and interactivity
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { trackCTAClick, detectExitIntent, showUrgencyIndicator } from '@/lib/cro/optimization';
import { motion } from 'framer-motion';

interface CTAEnhancedProps {
  variant?: 'primary' | 'secondary';
  urgency?: 'low' | 'medium' | 'high';
  showSocialProof?: boolean;
  showUrgency?: boolean;
}

export function CTAEnhanced({
  variant = 'primary',
  urgency = 'high',
  showSocialProof = true,
  showUrgency = true,
}: CTAEnhancedProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showExitIntent, setShowExitIntent] = useState(false);

  useEffect(() => {
    // Set countdown timer (24 hours from now)
    const endTime = Date.now() + 24 * 60 * 60 * 1000;
    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    // Exit intent detection
    const cleanup = detectExitIntent(() => {
      setShowExitIntent(true);
    });

    return () => {
      clearInterval(interval);
      cleanup();
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleClick = () => {
    trackCTAClick('enhanced-cta', 'homepage', urgency);
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        {showUrgency && timeLeft !== null && timeLeft > 0 && (
          <Badge variant="destructive" className="animate-pulse">
            <Clock className="h-3 w-3 mr-1" />
            Limited time: {formatTime(timeLeft)} left
          </Badge>
        )}

        {showSocialProof && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Join 500+ businesses automating with AIAS</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button
            asChild
            size="lg"
            className="group relative overflow-hidden"
            onClick={handleClick}
          >
            <Link href="/signup">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            onClick={() => trackCTAClick('schedule-call', 'homepage', 'medium')}
          >
            <Link href="/contact">
              Schedule Strategy Call
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          No credit card required • 14-day free trial • Cancel anytime
        </p>

        {showExitIntent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowExitIntent(false)}
          >
            <div
              className="bg-card rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-2">Wait! Don't Miss Out</h3>
              <p className="text-muted-foreground mb-4">
                Get started today and save 10+ hours per week with AI automation.
              </p>
              <Button asChild className="w-full" onClick={handleClick}>
                <Link href="/signup">Start Free Trial Now</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

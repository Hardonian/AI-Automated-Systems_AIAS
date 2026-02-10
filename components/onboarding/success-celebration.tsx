'use client';

import confetti from 'canvas-confetti';
import { CheckCircle, Sparkles, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SuccessCelebrationProps {
  onDismiss?: () => void;
}

export function SuccessCelebration({ onDismiss }: SuccessCelebrationProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Trigger confetti celebration
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  if (!show) {
    return null;
  }

  const handleDismiss = () => {
    setShow(false);
    onDismiss?.();
  };

  return (
    <Card className='mb-6 border-green-500 bg-green-50 dark:bg-green-950/20'>
      <CardContent className='p-6'>
        <div className='space-y-4 text-center'>
          <div className='flex justify-center'>
            <div className='relative'>
              <CheckCircle className='h-16 w-16 text-green-600' />
              <Sparkles className='absolute -right-2 -top-2 h-8 w-8 animate-pulse text-yellow-500' />
            </div>
          </div>
          <div>
            <h2 className='mb-2 text-2xl font-bold'>
              🎉 First Workflow Created!
            </h2>
            <p className='text-muted-foreground'>
              You're on your way to saving 10+ hours per week with automation!
            </p>
          </div>
          <div className='flex flex-col justify-center gap-3 sm:flex-row'>
            <Button asChild>
              <Link href='/workflows'>
                Create Another Workflow
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
            <Button variant='outline' onClick={handleDismiss}>
              Continue
            </Button>
          </div>
          <div className='border-t pt-4'>
            <p className='text-sm text-muted-foreground'>
              <Zap className='mr-1 inline h-4 w-4' />
              <strong>Next:</strong> Connect more integrations or explore
              advanced features
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Edge AI Readiness Quiz — Assess Your Needs | AIAS',
  description:
    'Take our quick quiz to assess your edge AI readiness and get personalized recommendations.',
};

// This is a static page for now. In production, this would be an interactive form.
export default function EdgeAIReadinessQuizPage() {
  return (
    <div className='container py-12 md:py-16'>
      <div className='mx-auto mb-12 max-w-3xl text-center'>
        <h1 className='mb-4 text-4xl font-bold md:text-5xl'>
          Edge AI Readiness Quiz
        </h1>
        <p className='mb-8 text-xl text-muted-foreground'>
          Answer a few questions to assess your edge AI needs and get
          personalized recommendations.
        </p>
      </div>

      <Card className='mx-auto mb-8 max-w-2xl'>
        <CardHeader>
          <CardTitle>Assessment Questions</CardTitle>
          <CardDescription>
            This quiz helps us understand your requirements and recommend the
            best approach.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            <div>
              <h3 className='mb-2 font-semibold'>
                1. What is your primary use case?
              </h3>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>• Offline enterprise assistant</li>
                <li>• Mobile app with AI features</li>
                <li>• IoT/robotics application</li>
                <li>• Privacy-sensitive application</li>
                <li>• Cost reduction (move from cloud)</li>
              </ul>
            </div>
            <div>
              <h3 className='mb-2 font-semibold'>
                2. What is your target device/platform?
              </h3>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>• AI PC / Desktop</li>
                <li>• NVIDIA Jetson</li>
                <li>• Android / iOS mobile</li>
                <li>• Raspberry Pi / Edge server</li>
                <li>• Custom hardware</li>
              </ul>
            </div>
            <div>
              <h3 className='mb-2 font-semibold'>
                3. What are your latency requirements?
              </h3>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>• Real-time (&lt;10ms)</li>
                <li>• Near real-time (10-100ms)</li>
                <li>• Acceptable (100ms-1s)</li>
                <li>• Not critical</li>
              </ul>
            </div>
            <div>
              <h3 className='mb-2 font-semibold'>
                4. Do you have existing AI models?
              </h3>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>• Yes, in ONNX/TFLite format</li>
                <li>• Yes, in PyTorch/TensorFlow</li>
                <li>• No, need to train/acquire</li>
                <li>• Exploring options</li>
              </ul>
            </div>
            <div>
              <h3 className='mb-2 font-semibold'>
                5. What is your deployment timeline?
              </h3>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>• Immediate (within 1 month)</li>
                <li>• Short-term (1-3 months)</li>
                <li>• Medium-term (3-6 months)</li>
                <li>• Long-term (6+ months)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='mx-auto max-w-2xl space-y-4'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CheckCircle className='h-5 w-5 text-green-500' />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='mb-4 text-muted-foreground'>
              Based on your answers, we'll provide personalized recommendations
              and help you get started.
            </p>
            <div className='flex flex-col gap-4 sm:flex-row'>
              <Button asChild>
                <Link href='/demo'>
                  Schedule Consultation
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
              <Button asChild variant='outline'>
                <Link href='/edge-ai'>Explore Platform</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <XCircle className='h-5 w-5 text-muted-foreground' />
              Note
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              This is a simplified assessment. For a detailed analysis, schedule
              a consultation with our team. We'll review your specific
              requirements and create a custom deployment plan.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

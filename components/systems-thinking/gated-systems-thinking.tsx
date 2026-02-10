'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlanFeatureGate } from '@/components/monetization/plan-feature-gate';
import type { PlanTier } from '@/config/plans';

interface GatedSystemsThinkingProps {
  userPlan: PlanTier;
}

export function GatedSystemsThinking({ userPlan }: GatedSystemsThinkingProps) {
  const isPaid = userPlan === 'starter' || userPlan === 'pro';

  // Teaser content (always visible)
  const teaser = (
    <div className='container py-16'>
      <div className='mb-12 text-center'>
        <h1 className='mb-4 text-4xl font-bold md:text-5xl'>
          Systems Thinking: The Critical Skill for the AI Age
        </h1>
        <p className='mx-auto max-w-3xl text-lg text-muted-foreground'>
          Systems thinking helps you see problems from all angles, find root
          causes, and design solutions that actually work. Combined with AI
          automation, it's unstoppable.
        </p>
        <div className='mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary'>
          🧠 The Critical Skill • 🤖 AI Age Differentiator • 🚀 Career &
          Business Advantage
        </div>
      </div>

      <div className='mx-auto max-w-4xl space-y-8'>
        {/* Teaser: First section only */}
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>
              Why Systems Thinking Matters
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              Systems thinking is the skill that helps you understand how
              everything connects. Instead of treating symptoms, you find root
              causes. Instead of point solutions, you design integrated systems
              that work together.
            </p>
            <div className='rounded-lg bg-primary/10 p-4'>
              <p className='mb-2 font-semibold'>What you'll learn:</p>
              <ul className='space-y-1 text-sm text-muted-foreground'>
                <li>• How to analyze problems from multiple perspectives</li>
                <li>• How to identify root causes vs. symptoms</li>
                <li>• How to design holistic solutions</li>
                <li>• How systems thinking works with AI</li>
                <li>• Why it's your competitive advantage</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade prompt */}
        {!isPaid && (
          <Card className='border-2 border-primary/30 bg-primary/5'>
            <CardHeader>
              <CardTitle className='text-xl'>
                Unlock the Full Systems Thinking Course
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-muted-foreground'>
                This is just the introduction. Upgrade to access the complete
                course including:
              </p>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>
                  ✓ The AI Paradox: Why systems thinking is more critical than
                  ever
                </li>
                <li>
                  ✓ Job market advantage: How systems thinking sets you apart
                </li>
                <li>✓ Business success: Real examples and case studies</li>
                <li>✓ AI + Systems Thinking: The unstoppable combination</li>
                <li>✓ Step-by-step frameworks and methodologies</li>
                <li>✓ Interactive exercises and assessments</li>
              </ul>
              <Button className='w-full' size='lg' asChild>
                <Link href='/pricing'>Upgrade to Unlock Full Course</Link>
              </Button>
              <p className='text-center text-xs text-muted-foreground'>
                Start your 30-day free trial • No credit card required
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  // Full content (gated)
  const fullContent = (
    <div className='container py-16'>
      <div className='mb-12 text-center'>
        <h1 className='mb-4 text-4xl font-bold md:text-5xl'>
          Systems Thinking: The Critical Skill for the AI Age
        </h1>
        <p className='mx-auto max-w-3xl text-lg text-muted-foreground'>
          Systems thinking is THE skill needed more than ever in the AI age.
          It's what makes you stand out in the job market, succeed in business,
          and achieve optimal outcomes.
        </p>
        <div className='mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary'>
          🧠 The Critical Skill • 🤖 AI Age Differentiator • 🚀 Career &
          Business Advantage
        </div>
      </div>

      <div className='mx-auto max-w-4xl space-y-12'>
        {/* Full content sections would go here - using existing page content */}
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>
              The AI Paradox: Why Systems Thinking is More Critical Than Ever
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              Full detailed content about AI capabilities and limitations,
              systems thinking gap, etc. (This would include all the content
              from the original systems-thinking page)
            </p>
            {/* Full content sections */}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (isPaid) {
    return fullContent;
  }

  return (
    <PlanFeatureGate
      requiredPlan='starter'
      currentPlan={userPlan}
      featureName='Systems Thinking Course'
      featureDescription='Complete course on systems thinking: frameworks, methodologies, case studies, and interactive exercises'
      showPreview={false}
    >
      {teaser}
    </PlanFeatureGate>
  );
}

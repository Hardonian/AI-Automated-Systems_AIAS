'use client';

import { useMemo, useState } from 'react';
import { z } from 'zod';

import {
  BUDGET_FLEXIBILITY_RANGES,
  ENGAGEMENT_SCOPES,
  ORG_TYPES,
  PROBLEM_CATEGORIES,
  URGENCY_LEVELS,
  classifyIntake,
  type IntakeSubmission,
} from '@/lib/intakeClassifier';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SurfaceCard } from '@/components/ui/section-primitives';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
  orgType: z.enum(ORG_TYPES, { required_error: 'Select organization type.' }),
  problemCategory: z.enum(PROBLEM_CATEGORIES, { required_error: 'Select problem category.' }),
  urgency: z.enum(URGENCY_LEVELS, { required_error: 'Select urgency.' }),
  scope: z.enum(ENGAGEMENT_SCOPES, { required_error: 'Select engagement scope.' }),
  budgetFlexibility: z.enum(BUDGET_FLEXIBILITY_RANGES, { required_error: 'Select budget flexibility.' }),
});

type FormValues = Partial<IntakeSubmission>;
type FormErrors = Partial<Record<keyof IntakeSubmission, string>>;

const orgTypeLabels: Record<IntakeSubmission['orgType'], string> = {
  startup: 'Startup / founding team',
  smb: 'Small or midsize business',
  enterprise: 'Enterprise',
  nonprofit: 'Nonprofit',
  'public-sector': 'Public sector',
};

const problemLabels: Record<IntakeSubmission['problemCategory'], string> = {
  'manual-operations': 'Manual operations and repeated tasks',
  'data-fragmentation': 'Data is fragmented across tools',
  'compliance-risk': 'Compliance, security, or governance risk',
  'customer-experience': 'Customer response and service quality',
  'ai-readiness': 'AI readiness and adoption planning',
};

const urgencyLabels: Record<IntakeSubmission['urgency'], string> = {
  'this-month': 'Need action this month',
  'this-quarter': 'Planning for this quarter',
  'this-year': 'Exploration this year',
};

const scopeLabels: Record<IntakeSubmission['scope'], string> = {
  'one-off': 'One-off diagnostic or implementation',
  'build-with': 'Build-with partnership',
  'managed-refinement': 'Managed refinement and optimization',
};

const budgetLabels: Record<IntakeSubmission['budgetFlexibility'], string> = {
  constrained: 'Constrained — need a focused outcome',
  moderate: 'Moderate — can support phased delivery',
  strategic: 'Strategic — open to deeper implementation',
};

const steps: ReadonlyArray<{ id: number; title: string; fields: ReadonlyArray<keyof IntakeSubmission> }> = [
  { id: 1, title: 'Organization and problem context', fields: ['orgType', 'problemCategory'] },
  { id: 2, title: 'Urgency and engagement scope', fields: ['urgency', 'scope'] },
  { id: 3, title: 'Budget flexibility and confirmation', fields: ['budgetFlexibility'] },
];

function validateFields(values: FormValues, fields: ReadonlyArray<keyof IntakeSubmission>): FormErrors {
  const parsed = formSchema.safeParse(values);
  if (parsed.success) {
    return {};
  }

  const errors: FormErrors = {};
  for (const field of fields) {
    const issue = parsed.error.issues.find((entry) => entry.path[0] === field);
    if (issue) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

export function IntakeForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const activeStep = steps[Math.min(stepIndex, steps.length - 1)]!;

  const completion = useMemo(() => ((stepIndex + 1) / steps.length) * 100, [stepIndex]);

  const updateValue = <K extends keyof IntakeSubmission>(key: K, value: IntakeSubmission[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const onNext = () => {
    const nextErrors = validateFields(values, activeStep.fields);
    if (Object.keys(nextErrors).length > 0) {
      setErrors((current) => ({ ...current, ...nextErrors }));
      return;
    }
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  };

  const onPrevious = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const onSubmit = async () => {
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      const allErrors = validateFields(values, ['orgType', 'problemCategory', 'urgency', 'scope', 'budgetFlexibility']);
      setErrors(allErrors);
      return;
    }

    const intake = parsed.data;
    const classification = classifyIntake(intake);
    const payload = {
      type: 'lead-intake',
      submittedAt: new Date().toISOString(),
      intake,
      classification,
    };

    const endpoint = process.env.NEXT_PUBLIC_INTAKE_WEBHOOK_URL;

    setIsSubmitting(true);
    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          console.error('Intake submission endpoint returned non-OK response.', {
            status: response.status,
            statusText: response.statusText,
          });
        }
      } else {
        console.info('No intake webhook configured. Submission logged in browser only.', payload);
      }
    } catch (error) {
      console.error('Intake submission failed but was safely degraded.', error);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      setValues(intake);
    }
  };

  if (submitted) {
    const intake = formSchema.parse(values);
    const result = classifyIntake(intake);

    return (
      <SurfaceCard>
        <p className='text-sm font-semibold uppercase tracking-wide text-primary'>Intake received</p>
        <h2 className='mt-2 text-2xl font-bold'>Recommended path: {result.recommendedPath.title}</h2>
        <p className='mt-3 text-muted-foreground'>{result.recommendedPath.summary}</p>
        <p className='mt-3 text-muted-foreground'>{result.recommendedPath.nextStep}</p>
        <div className='mt-6 rounded-lg border border-border bg-muted/30 p-4'>
          <h3 className='font-semibold'>Engagement rationale</h3>
          <ul className='mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground'>
            {result.rationale.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard>
      <div className='mb-6' aria-live='polite'>
        <p className='text-sm text-muted-foreground'>Step {stepIndex + 1} of {steps.length}</p>
        <h2 className='text-2xl font-bold'>{activeStep.title}</h2>
        <div className='mt-3 h-2 w-full rounded-full bg-muted'>
          <div className='h-2 rounded-full bg-primary transition-all' style={{ width: `${completion}%` }} />
        </div>
      </div>

      <form
        className='space-y-6'
        onSubmit={(event) => {
          event.preventDefault();
          if (stepIndex === steps.length - 1) {
            void onSubmit();
            return;
          }
          onNext();
        }}
      >
        {stepIndex === 0 && (
          <>
            <div className='space-y-2'>
              <Label htmlFor='orgType'>Organization type</Label>
              <Select value={values.orgType} onValueChange={(value) => updateValue('orgType', value as IntakeSubmission['orgType'])}>
                <SelectTrigger id='orgType' aria-invalid={Boolean(errors.orgType)} aria-describedby={errors.orgType ? 'orgType-error' : undefined}>
                  <SelectValue placeholder='Choose your organization type' />
                </SelectTrigger>
                <SelectContent>
                  {ORG_TYPES.map((option) => (
                    <SelectItem key={option} value={option}>{orgTypeLabels[option]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.orgType && <p id='orgType-error' className='text-sm text-destructive'>{errors.orgType}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='problemCategory'>Primary problem category</Label>
              <Select value={values.problemCategory} onValueChange={(value) => updateValue('problemCategory', value as IntakeSubmission['problemCategory'])}>
                <SelectTrigger id='problemCategory' aria-invalid={Boolean(errors.problemCategory)} aria-describedby={errors.problemCategory ? 'problemCategory-error' : undefined}>
                  <SelectValue placeholder='Choose the closest match' />
                </SelectTrigger>
                <SelectContent>
                  {PROBLEM_CATEGORIES.map((option) => (
                    <SelectItem key={option} value={option}>{problemLabels[option]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.problemCategory && <p id='problemCategory-error' className='text-sm text-destructive'>{errors.problemCategory}</p>}
            </div>
          </>
        )}

        {stepIndex === 1 && (
          <>
            <fieldset className='space-y-3'>
              <legend className='text-sm font-medium'>Urgency</legend>
              <RadioGroup value={values.urgency} onValueChange={(value) => updateValue('urgency', value as IntakeSubmission['urgency'])} aria-invalid={Boolean(errors.urgency)} aria-describedby={errors.urgency ? 'urgency-error' : undefined}>
                {URGENCY_LEVELS.map((option) => (
                  <div className='flex items-center space-x-3' key={option}>
                    <RadioGroupItem id={`urgency-${option}`} value={option} />
                    <Label htmlFor={`urgency-${option}`}>{urgencyLabels[option]}</Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.urgency && <p id='urgency-error' className='text-sm text-destructive'>{errors.urgency}</p>}
            </fieldset>

            <fieldset className='space-y-3'>
              <legend className='text-sm font-medium'>Engagement scope</legend>
              <RadioGroup value={values.scope} onValueChange={(value) => updateValue('scope', value as IntakeSubmission['scope'])} aria-invalid={Boolean(errors.scope)} aria-describedby={errors.scope ? 'scope-error' : undefined}>
                {ENGAGEMENT_SCOPES.map((option) => (
                  <div className='flex items-center space-x-3' key={option}>
                    <RadioGroupItem id={`scope-${option}`} value={option} />
                    <Label htmlFor={`scope-${option}`}>{scopeLabels[option]}</Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.scope && <p id='scope-error' className='text-sm text-destructive'>{errors.scope}</p>}
            </fieldset>
          </>
        )}

        {stepIndex === 2 && (
          <fieldset className='space-y-3'>
            <legend className='text-sm font-medium'>Budget flexibility</legend>
            <RadioGroup value={values.budgetFlexibility} onValueChange={(value) => updateValue('budgetFlexibility', value as IntakeSubmission['budgetFlexibility'])} aria-invalid={Boolean(errors.budgetFlexibility)} aria-describedby={errors.budgetFlexibility ? 'budgetFlexibility-error' : undefined}>
              {BUDGET_FLEXIBILITY_RANGES.map((option) => (
                <div className='flex items-center space-x-3' key={option}>
                  <RadioGroupItem id={`budget-${option}`} value={option} />
                  <Label htmlFor={`budget-${option}`}>{budgetLabels[option]}</Label>
                </div>
              ))}
            </RadioGroup>
            {errors.budgetFlexibility && <p id='budgetFlexibility-error' className='text-sm text-destructive'>{errors.budgetFlexibility}</p>}
          </fieldset>
        )}

        <div className='flex flex-wrap items-center gap-3'>
          <Button type='button' variant='outline' onClick={onPrevious} disabled={stepIndex === 0 || isSubmitting}>
            Back
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {stepIndex === steps.length - 1 ? (isSubmitting ? 'Submitting...' : 'Submit intake') : 'Continue'}
          </Button>
        </div>
      </form>
    </SurfaceCard>
  );
}

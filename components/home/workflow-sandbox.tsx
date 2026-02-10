'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Copy, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { siteContent } from '@/src/content/site';

type WorkflowField = typeof siteContent.workflowSandbox.inputForm.fields[number];

const replaceTokens = (template: string, values: Record<string, string>) =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? '');

export function WorkflowSandbox() {
  const { workflowSandbox } = siteContent;
  const initialState = useMemo(() => {
    return workflowSandbox.inputForm.fields.reduce<Record<string, string>>(
      (acc, field) => {
        if (field.type === 'select') {
          acc[field.id] = field.options?.[0] ?? '';
        } else {
          acc[field.id] = '';
        }
        return acc;
      },
      {}
    );
  }, [workflowSandbox.inputForm.fields]);

  const [values, setValues] = useState<Record<string, string>>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const timestamp = useMemo(() => new Date().toISOString(), []);

  const normalizedValues = useMemo(
    () => ({
      ...values,
      problem: values.problem || 'Operational automation',
      constraints: values.constraints || 'No additional constraints provided',
      stack: values.stack || 'Existing business systems',
      timestamp,
    }),
    [timestamp, values]
  );

  const output = useMemo(() => {
    const markdown = replaceTokens(
      workflowSandbox.output.markdownTemplate,
      normalizedValues
    );
    const checklist = replaceTokens(
      workflowSandbox.output.checklistTemplate,
      normalizedValues
    );
    const artifactJson = replaceTokens(
      workflowSandbox.output.artifactJsonTemplate,
      normalizedValues
    );

    return {
      markdown,
      checklist,
      artifactJson,
    };
  }, [normalizedValues, workflowSandbox.output]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const handleCopy = async (text: string) => {
    if (!navigator.clipboard) {
      setCopyStatus('Clipboard access is not available.');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('Copied to clipboard.');
      setTimeout(() => setCopyStatus(null), 2000);
    } catch {
      setCopyStatus('Copy failed. Please try again.');
    }
  };

  const handleDownload = () => {
    try {
      const parsed = JSON.parse(output.artifactJson);
      const blob = new Blob([JSON.stringify(parsed, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `workflow-sandbox-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setCopyStatus('Export failed. Please copy manually.');
    }
  };

  return (
    <section className='bg-muted/20 px-4 py-20' id='workflow-sandbox'>
      <div className='container mx-auto max-w-6xl'>
        <div className='mb-12 text-center'>
          <p className='mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary'>
            Workflow Sandbox
          </p>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
            {workflowSandbox.title}
          </h2>
          <p className='mx-auto max-w-3xl text-lg text-muted-foreground'>
            {workflowSandbox.description}
          </p>
        </div>

        <div className='grid gap-8 lg:grid-cols-[1.1fr_1fr]'>
          <Card className='h-full'>
            <CardContent className='p-6'>
              <h3 className='mb-6 text-xl font-semibold'>
                {workflowSandbox.inputForm.title}
              </h3>
              <form className='space-y-6' onSubmit={handleSubmit}>
                {workflowSandbox.inputForm.fields.map((field: WorkflowField) => (
                  <div key={field.id} className='space-y-2'>
                    <Label htmlFor={field.id}>{field.label}</Label>
                    {field.type === 'select' ? (
                      <Select
                        value={values[field.id]}
                        onValueChange={value =>
                          setValues(prev => ({ ...prev, [field.id]: value }))
                        }
                      >
                        <SelectTrigger id={field.id}>
                          <SelectValue placeholder='Select option' />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map(option => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === 'textarea' ? (
                      <Textarea
                        id={field.id}
                        rows={4}
                        value={values[field.id]}
                        onChange={event =>
                          setValues(prev => ({
                            ...prev,
                            [field.id]: event.target.value,
                          }))
                        }
                      />
                    ) : (
                      <Input
                        id={field.id}
                        value={values[field.id]}
                        onChange={event =>
                          setValues(prev => ({
                            ...prev,
                            [field.id]: event.target.value,
                          }))
                        }
                      />
                    )}
                  </div>
                ))}
                <Button type='submit' className='w-full' size='lg'>
                  {workflowSandbox.inputForm.submitLabel}
                </Button>
              </form>
              <div className='mt-6 flex items-start gap-2 text-sm text-muted-foreground'>
                <CheckCircle2 className='mt-0.5 h-4 w-4 text-primary' />
                <span>Illustrative demo — no data leaves your browser.</span>
              </div>
            </CardContent>
          </Card>

          <Card className='h-full'>
            <CardContent className='flex h-full flex-col gap-6 p-6'>
              <div>
                <h3 className='text-xl font-semibold'>
                  {workflowSandbox.output.title}
                </h3>
                <p className='mt-2 text-sm text-muted-foreground'>
                  Generated from your inputs. Use this to align stakeholders and
                  document next steps.
                </p>
              </div>
              <div className='space-y-4'>
                <div className='rounded-lg border bg-background p-4'>
                  <pre className='whitespace-pre-wrap text-sm text-muted-foreground'>
                    {submitted ? output.markdown : 'Submit the form to generate a plan.'}
                  </pre>
                </div>
                <div className='rounded-lg border bg-background p-4'>
                  <pre className='whitespace-pre-wrap text-sm text-muted-foreground'>
                    {submitted ? output.checklist : 'Checklist output will appear here.'}
                  </pre>
                </div>
                <div className='rounded-lg border bg-background p-4'>
                  <pre className='whitespace-pre-wrap text-xs text-muted-foreground'>
                    {submitted ? output.artifactJson : 'Artifact JSON will appear here.'}
                  </pre>
                </div>
              </div>
              <div className='flex flex-col gap-3 sm:flex-row'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => handleCopy(output.markdown)}
                >
                  <Copy className='mr-2 h-4 w-4' />
                  Copy Markdown
                </Button>
                <Button type='button' variant='outline' onClick={handleDownload}>
                  <Download className='mr-2 h-4 w-4' />
                  Download JSON
                </Button>
              </div>
              {copyStatus && (
                <p className='text-sm text-primary'>{copyStatus}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { siteContent } from '@/src/content/site';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CheckCircle2,
  Copy,
  Download,
  FileText,
  ListChecks,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export default function WorkflowSandboxPage() {
  const { workflowSandbox } = siteContent;
  const [formData, setFormData] = useState({
    problem: '',
    constraints: '',
    stack: '',
  });
  const [output, setOutput] = useState<null | {
    markdown: string;
    checklist: string;
    json: string;
  }>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    // Simulate deterministic generation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const timestamp = new Date().toISOString();
    const replaceVars = (template: string) => {
      return template
        .replace(/{{problem}}/g, formData.problem || 'General Automation')
        .replace(/{{constraints}}/g, formData.constraints || 'Standard Compliance')
        .replace(/{{stack}}/g, formData.stack || 'Standard Stack')
        .replace(/{{timestamp}}/g, timestamp);
    };

    const markdown = replaceVars(workflowSandbox.output.markdownTemplate);
    const checklist = replaceVars(workflowSandbox.output.checklistTemplate);
    const json = replaceVars(workflowSandbox.output.artifactJsonTemplate);

    setOutput({ markdown, checklist, json });
    setIsGenerating(false);
    toast.success('Plan outline generated successfully!');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadJson = () => {
    if (!output) {return;}
    const blob = new Blob([output.json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-plan-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Download started!');
  };

  return (
    <div className='container mx-auto max-w-5xl px-4 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-12 text-center'
      >
        <h1 className='mb-4 text-4xl font-bold'>{workflowSandbox.title}</h1>
        <p className='mx-auto max-w-2xl text-xl text-muted-foreground'>
          {workflowSandbox.description}
        </p>
        <div className='mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
          <Sparkles className='h-4 w-4' />
          Illustrative Demo (Client-Side Only)
        </div>
      </motion.div>

      <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
        {/* Input Form */}
        <Card className='h-full'>
          <CardHeader>
            <CardTitle>{workflowSandbox.inputForm.title}</CardTitle>
            <CardDescription>
              Provide context for the deterministic engine.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className='space-y-6'>
              {workflowSandbox.inputForm.fields.map(field => (
                <div key={field.id} className='space-y-2'>
                  <Label htmlFor={field.id}>{field.label}</Label>
                  {field.type === 'select' ? (
                    <Select
                      onValueChange={val =>
                        setFormData({ ...formData, [field.id]: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select a type' />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map(opt => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === 'textarea' ? (
                    <Textarea
                      id={field.id}
                      placeholder='e.g. Must be PIPEDA compliant, budget under $500/mo'
                      onChange={e =>
                        setFormData({ ...formData, [field.id]: e.target.value })
                      }
                    />
                  ) : (
                    <Input
                      id={field.id}
                      placeholder='e.g. Shopify, Wave, Slack'
                      onChange={e =>
                        setFormData({ ...formData, [field.id]: e.target.value })
                      }
                    />
                  )}
                </div>
              ))}
              <Button type='submit' className='w-full' disabled={isGenerating}>
                {isGenerating
                  ? 'Generating...'
                  : workflowSandbox.inputForm.submitLabel}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Output Display */}
        <div className='space-y-6'>
          {!output ? (
            <div className='flex h-full items-center justify-center rounded-xl border-2 border-dashed p-12 text-center text-muted-foreground'>
              <div>
                <FileText className='mx-auto mb-4 h-12 w-12 opacity-20' />
                <p>Fill out the form to generate a plan outline.</p>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className='space-y-6'
            >
              {/* Markdown Plan */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-lg font-medium'>
                    Markdown Plan
                  </CardTitle>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => copyToClipboard(output.markdown)}
                  >
                    <Copy className='h-4 w-4' />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className='prose prose-sm max-h-64 max-w-none overflow-auto rounded-md bg-muted p-4 dark:prose-invert'>
                    <pre className='whitespace-pre-wrap font-sans text-xs'>
                      {output.markdown}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* Checklist */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-lg font-medium'>
                    Checklist
                  </CardTitle>
                  <ListChecks className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <ul className='space-y-2'>
                    {output.checklist.split('\n').map((item, i) => (
                      <li key={i} className='flex items-center gap-2 text-sm'>
                        <CheckCircle2 className='h-4 w-4 text-green-500' />
                        {item.replace(/^\d+\.\s*/, '')}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* JSON Artifact */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-lg font-medium'>
                    JSON Artifact
                  </CardTitle>
                  <div className='flex gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => copyToClipboard(output.json)}
                    >
                      <Copy className='h-4 w-4' />
                    </Button>
                    <Button variant='ghost' size='icon' onClick={downloadJson}>
                      <Download className='h-4 w-4' />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='max-h-48 overflow-auto rounded-md bg-zinc-950 p-4 text-zinc-50'>
                    <pre className='font-mono text-[10px]'>{output.json}</pre>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

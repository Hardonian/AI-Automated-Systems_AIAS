"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  Download,
  Sparkles,
  FileText,
  ListChecks,
  Code2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/section-primitives";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { siteContent } from "@/src/content/site";

type WorkflowField =
  (typeof siteContent.workflowSandbox.inputForm.fields)[number];

const replaceTokens = (template: string, values: Record<string, string>) =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? "");

export function WorkflowSandbox() {
  const { workflowSandbox } = siteContent;
  const initialState = useMemo(() => {
    return workflowSandbox.inputForm.fields.reduce<Record<string, string>>(
      (acc, field) => {
        if (field.type === "select") {
          acc[field.id] = field.options?.[0] ?? "";
        } else {
          acc[field.id] = "";
        }
        return acc;
      },
      {},
    );
  }, [workflowSandbox.inputForm.fields]);

  const [values, setValues] = useState<Record<string, string>>(initialState);
  const [submitted, setSubmitted] = useState(true); // Default to live preview
  const [activeOutputTab, setActiveOutputTab] = useState<
    "markdown" | "checklist" | "json"
  >("markdown");
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const timestamp = useMemo(() => new Date().toISOString(), []);

  const normalizedValues = useMemo(
    () => ({
      ...values,
      problem: values.problem || "Cross-system operational reconciliation",
      constraints:
        values.constraints ||
        "Deterministic accuracy required, zero unauthorized PII leakage",
      stack: values.stack || "PostgreSQL, FastAPI, Claude 3.5 Sonnet",
      timestamp,
    }),
    [timestamp, values],
  );

  const output = useMemo(() => {
    const markdown = replaceTokens(
      workflowSandbox.output.markdownTemplate,
      normalizedValues,
    );
    const checklist = replaceTokens(
      workflowSandbox.output.checklistTemplate,
      normalizedValues,
    );
    const artifactJson = replaceTokens(
      workflowSandbox.output.artifactJsonTemplate,
      normalizedValues,
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
      setCopyStatus("Clipboard access unavailable");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Copied to clipboard!");
      setTimeout(() => setCopyStatus(null), 2500);
    } catch {
      setCopyStatus("Copy failed.");
    }
  };

  const handleDownload = () => {
    try {
      const parsed = JSON.parse(output.artifactJson);
      const blob = new Blob([JSON.stringify(parsed, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `workflow-sandbox-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setCopyStatus("Export failed. Please copy manually.");
    }
  };

  return (
    <section
      className="border-b-2 border-border bg-muted/20 px-4 py-24"
      id="workflow-sandbox"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="flex h-6 w-6 items-center justify-center border border-primary bg-primary/10 text-xs font-mono font-bold text-primary">
              {"//"}
            </span>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Interactive Blueprint Generator
            </p>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-foreground md:text-5xl">
            {workflowSandbox.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-mono text-sm text-muted-foreground leading-relaxed">
            {workflowSandbox.description}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left: Input Form (6 cols) */}
          <div className="lg:col-span-6">
            <SurfaceCard className="p-6 sm:p-8 border-2 border-border h-full flex flex-col justify-between">
              <div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground border-b-2 border-border pb-4 mb-6">
                  {workflowSandbox.inputForm.title}
                </h3>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  {workflowSandbox.inputForm.fields.map(
                    (field: WorkflowField) => (
                      <div key={field.id} className="space-y-1.5">
                        <Label
                          htmlFor={field.id}
                          className="font-mono text-xs font-bold uppercase text-foreground"
                        >
                          {field.label}
                        </Label>
                        {field.type === "select" ? (
                          <Select
                            value={values[field.id]}
                            onValueChange={(value) =>
                              setValues((prev) => ({
                                ...prev,
                                [field.id]: value,
                              }))
                            }
                          >
                            <SelectTrigger
                              id={field.id}
                              className="rounded-none border-2 border-border font-mono text-xs"
                            >
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent className="rounded-none border-2 border-border font-mono text-xs">
                              {field.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : field.type === "textarea" ? (
                          <Textarea
                            id={field.id}
                            rows={3}
                            value={values[field.id]}
                            onChange={(event) =>
                              setValues((prev) => ({
                                ...prev,
                                [field.id]: event.target.value,
                              }))
                            }
                            className="rounded-none border-2 border-border font-mono text-xs"
                            placeholder="Describe target workflow friction..."
                          />
                        ) : (
                          <Input
                            id={field.id}
                            value={values[field.id]}
                            onChange={(event) =>
                              setValues((prev) => ({
                                ...prev,
                                [field.id]: event.target.value,
                              }))
                            }
                            className="rounded-none border-2 border-border font-mono text-xs"
                            placeholder="e.g. Existing ERP, Slack, LangChain"
                          />
                        )}
                      </div>
                    ),
                  )}

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full rounded-none border-2 border-primary bg-primary font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card hover:-translate-y-0.5 transition-all"
                      size="lg"
                    >
                      {workflowSandbox.inputForm.submitLabel}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="mt-6 flex items-start gap-2 text-xs text-muted-foreground border-t border-border pt-4">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-primary shrink-0" />
                <span>Client-side execution: no data leaves your browser.</span>
              </div>
            </SurfaceCard>
          </div>

          {/* Right: Generated Output Tabs (6 cols) */}
          <div className="lg:col-span-6">
            <SurfaceCard className="p-6 sm:p-8 border-2 border-primary bg-card h-full flex flex-col justify-between shadow-card">
              <div>
                <div className="flex items-center justify-between border-b-2 border-border pb-4 mb-4">
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
                    Generated Control Blueprint
                  </h3>
                  <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 border border-primary bg-primary/10 text-primary">
                    Live Preview
                  </span>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setActiveOutputTab("markdown")}
                    className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-bold uppercase border transition-colors cursor-pointer ${
                      activeOutputTab === "markdown"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <FileText className="h-3 w-3" />
                    Markdown
                  </button>
                  <button
                    onClick={() => setActiveOutputTab("checklist")}
                    className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-bold uppercase border transition-colors cursor-pointer ${
                      activeOutputTab === "checklist"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ListChecks className="h-3 w-3" />
                    Checklist
                  </button>
                  <button
                    onClick={() => setActiveOutputTab("json")}
                    className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-bold uppercase border transition-colors cursor-pointer ${
                      activeOutputTab === "json"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Code2 className="h-3 w-3" />
                    JSON
                  </button>
                </div>

                {/* Tab Previews */}
                <div className="border-2 border-border bg-muted/40 p-4 font-mono text-xs text-foreground max-h-80 overflow-auto leading-relaxed">
                  {activeOutputTab === "markdown" && (
                    <pre className="whitespace-pre-wrap">{output.markdown}</pre>
                  )}
                  {activeOutputTab === "checklist" && (
                    <pre className="whitespace-pre-wrap">
                      {output.checklist}
                    </pre>
                  )}
                  {activeOutputTab === "json" && (
                    <pre className="whitespace-pre-wrap">
                      {output.artifactJson}
                    </pre>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 border-t-2 border-border pt-4 space-y-3">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-wider hover:border-foreground"
                    onClick={() =>
                      handleCopy(
                        activeOutputTab === "markdown"
                          ? output.markdown
                          : activeOutputTab === "checklist"
                            ? output.checklist
                            : output.artifactJson,
                      )
                    }
                  >
                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                    Copy Active View
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-wider hover:border-foreground"
                    onClick={handleDownload}
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Download JSON
                  </Button>
                </div>

                {copyStatus && (
                  <p className="text-xs font-mono font-bold text-center text-primary">
                    {copyStatus}
                  </p>
                )}

                <Button
                  asChild
                  className="w-full rounded-none border-2 border-primary bg-primary font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card hover:-translate-y-0.5 transition-all"
                >
                  <Link href="/book">
                    Review this Blueprint on a Strategy Call
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </SurfaceCard>
          </div>
        </div>
      </div>
    </section>
  );
}

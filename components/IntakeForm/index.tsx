"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";

import {
  BUDGET_FLEXIBILITY_RANGES,
  ENGAGEMENT_SCOPES,
  ORG_TYPES,
  PROBLEM_CATEGORIES,
  AI_STACK_OPTIONS,
  MODEL_MIX_OPTIONS,
  FAILURE_MODE_OPTIONS,
  GOVERNANCE_MATURITY_OPTIONS,
  URGENCY_LEVELS,
  classifyIntake,
  type IntakeSubmission,
} from "@/lib/intakeClassifier";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SurfaceCard } from "@/components/ui/section-primitives";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { track } from "@/lib/analytics";
import {
  buildLeadBriefMarkdown,
  downloadTextArtifact,
  readLeadAttribution,
  type LeadAttribution,
} from "@/lib/lead-brief";

const formSchema = z.object({
  orgType: z.enum(ORG_TYPES, { error: "Select organization type." }),
  problemCategory: z.enum(PROBLEM_CATEGORIES, {
    error: "Select problem category.",
  }),
  aiStack: z.enum(AI_STACK_OPTIONS, {
    error: "Select current AI stack state.",
  }),
  modelMix: z.enum(MODEL_MIX_OPTIONS, { error: "Select model mix." }),
  failureMode: z.enum(FAILURE_MODE_OPTIONS, {
    error: "Select current failure mode.",
  }),
  governanceMaturity: z.enum(GOVERNANCE_MATURITY_OPTIONS, {
    error: "Select governance maturity.",
  }),
  urgency: z.enum(URGENCY_LEVELS, { error: "Select urgency." }),
  scope: z.enum(ENGAGEMENT_SCOPES, { error: "Select engagement scope." }),
  budgetFlexibility: z.enum(BUDGET_FLEXIBILITY_RANGES, {
    error: "Select budget flexibility.",
  }),
  name: z.string().trim().min(2, "Enter your name.").max(100),
  organization: z.string().trim().min(2, "Enter your organization.").max(120),
  workflowSummary: z
    .string()
    .trim()
    .min(20, "Describe the workflow in at least 20 characters.")
    .max(1200),
  email: z.string().trim().email("Enter a valid work email."),
  website: z.string().max(0).optional(),
});

type FormValues = Partial<IntakeSubmission> & {
  name?: string;
  organization?: string;
  workflowSummary?: string;
  email?: string;
  website?: string;
};
type FormErrors = Partial<Record<keyof FormValues, string>>;

const emptyAttribution: LeadAttribution = {
  landingPath: "",
  referrer: "",
  source: "",
  medium: "",
  campaign: "",
  content: "",
  term: "",
};

interface CatalogOption {
  id: string;
  title: string;
}

interface IntakeFormProps {
  bookingHref: string;
  catalogOptions: ReadonlyArray<CatalogOption>;
  contactEmail: string;
}

const orgTypeLabels: Record<IntakeSubmission["orgType"], string> = {
  startup: "Startup / founding team",
  smb: "Small or midsize business",
  enterprise: "Enterprise",
  nonprofit: "Nonprofit",
  "public-sector": "Public sector",
};

const problemLabels: Record<IntakeSubmission["problemCategory"], string> = {
  "manual-operations": "Manual operations and repeated tasks",
  "data-fragmentation": "Data is fragmented across tools",
  "compliance-risk": "Compliance, security, or governance risk",
  "customer-experience": "Customer response and service quality",
  "ai-readiness": "AI readiness and adoption planning",
};

const aiStackLabels: Record<IntakeSubmission["aiStack"], string> = {
  none: "No AI stack in production",
  pilot: "Pilot workflows only",
  production: "Production AI workflows",
  "multi-system": "Multiple AI systems across teams",
};

const modelMixLabels: Record<IntakeSubmission["modelMix"], string> = {
  "single-model": "Single model deployment",
  "multi-model": "Multiple models with routing",
  "open-and-closed": "Mix of open and closed models",
  unknown: "Unknown or unmanaged model mix",
};

const failureModeLabels: Record<IntakeSubmission["failureMode"], string> = {
  hallucination: "Hallucination and output quality issues",
  latency: "Latency and throughput issues",
  "cost-drift": "Inference cost drift",
  "unsafe-actions": "Unsafe or uncontrolled actions",
  "evaluation-gaps": "Evaluation and benchmark gaps",
};

const governanceMaturityLabels: Record<
  IntakeSubmission["governanceMaturity"],
  string
> = {
  "ad-hoc": "Ad hoc controls",
  repeatable: "Repeatable but undocumented controls",
  defined: "Defined policies and review process",
  controlled: "Controlled with continuous auditability",
};

const urgencyLabels: Record<IntakeSubmission["urgency"], string> = {
  "this-month": "Need action this month",
  "this-quarter": "Planning for this quarter",
  "this-year": "Exploration this year",
};

const scopeLabels: Record<IntakeSubmission["scope"], string> = {
  "one-off": "One-off diagnostic or implementation",
  "build-with": "Co-build sprint",
  "managed-refinement": "Managed system refinement",
};

const budgetLabels: Record<IntakeSubmission["budgetFlexibility"], string> = {
  constrained: "Constrained — need a focused outcome",
  moderate: "Moderate — can support phased delivery",
  strategic: "Strategic — open to deeper implementation",
};

const steps: ReadonlyArray<{
  id: number;
  title: string;
  fields: ReadonlyArray<keyof FormValues>;
}> = [
  {
    id: 1,
    title: "Organization and problem context",
    fields: ["orgType", "problemCategory"],
  },
  {
    id: 2,
    title: "AI stack and governance diagnostics",
    fields: ["aiStack", "modelMix", "failureMode", "governanceMaturity"],
  },
  {
    id: 3,
    title: "Urgency and engagement scope",
    fields: ["urgency", "scope"],
  },
  {
    id: 4,
    title: "Workflow brief and contact",
    fields: [
      "budgetFlexibility",
      "name",
      "organization",
      "workflowSummary",
      "email",
    ],
  },
];

function validateFields(
  values: FormValues,
  fields: ReadonlyArray<keyof FormValues>,
): FormErrors {
  const parsed = formSchema.safeParse(values);
  if (parsed.success) {
    return {};
  }

  const errors: FormErrors = {};
  const fieldSet = new Set(fields);

  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as keyof FormValues;
    if (fieldSet.has(field) && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

function downloadJsonArtifact(payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `aias-intake-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function IntakeForm({
  bookingHref,
  catalogOptions,
  contactEmail,
}: IntakeFormProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryState, setDeliveryState] = useState<
    "idle" | "sent" | "prepared"
  >("idle");
  const [catalogSelection, setCatalogSelection] = useState<string[]>([]);
  const [progressRestored, setProgressRestored] = useState(false);
  const [attribution, setAttribution] =
    useState<LeadAttribution>(emptyAttribution);
  const interactionStarted = useRef(false);
  const formMountedAt = useRef(0);

  useEffect(() => {
    let active = true;
    formMountedAt.current = Date.now();
    try {
      const stored = window.sessionStorage.getItem("aias_intake_progress");
      if (stored) {
        const candidate = JSON.parse(stored) as {
          stepIndex?: unknown;
          values?: unknown;
        };
        const parsedValues = formSchema.partial().safeParse(candidate.values);
        queueMicrotask(() => {
          if (!active) return;
          if (parsedValues.success) setValues(parsedValues.data);
          if (typeof candidate.stepIndex === "number") {
            setStepIndex(
              Math.max(
                0,
                Math.min(Math.trunc(candidate.stepIndex), steps.length - 1),
              ),
            );
          }
          setProgressRestored(true);
        });
      } else {
        queueMicrotask(() => active && setProgressRestored(true));
      }
    } catch {
      window.sessionStorage.removeItem("aias_intake_progress");
      queueMicrotask(() => active && setProgressRestored(true));
    }
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const search = new URLSearchParams(window.location.search);
    const storedAttribution = window.sessionStorage.getItem(
      "aias_lead_attribution",
    );
    const currentAttribution = readLeadAttribution({
      search: window.location.search,
      referrer: document.referrer,
      landingPath: window.location.pathname,
    });
    let mergedAttribution = currentAttribution;
    if (storedAttribution) {
      try {
        const parsed = JSON.parse(
          storedAttribution,
        ) as Partial<LeadAttribution>;
        mergedAttribution = {
          ...emptyAttribution,
          ...parsed,
          ...Object.fromEntries(
            Object.entries(currentAttribution).filter(([, value]) => value),
          ),
        };
      } catch {
        window.sessionStorage.removeItem("aias_lead_attribution");
      }
    }
    const requestedIds = [
      search.get("product") ?? "",
      ...(search.get("products") ?? "").split(","),
    ].filter(Boolean);
    const availableIds = new Set(catalogOptions.map((option) => option.id));
    const validIds = [...new Set(requestedIds)].filter((id) =>
      availableIds.has(id),
    );

    queueMicrotask(() => {
      if (!active) return;
      setAttribution(mergedAttribution);
      window.sessionStorage.setItem(
        "aias_lead_attribution",
        JSON.stringify(mergedAttribution),
      );
      setCatalogSelection(validIds);
      if (validIds.length > 0) {
        track("catalog_contact_context_loaded", {
          products: validIds.join("|"),
          product_count: validIds.length,
        });
      }
    });

    return () => {
      active = false;
    };
  }, [catalogOptions]);

  useEffect(() => {
    if (!progressRestored || deliveryState !== "idle") return;
    window.sessionStorage.setItem(
      "aias_intake_progress",
      JSON.stringify({ stepIndex, values }),
    );
  }, [deliveryState, progressRestored, stepIndex, values]);

  const activeStep = steps[Math.min(stepIndex, steps.length - 1)]!;

  const completion = useMemo(
    () => ((stepIndex + 1) / steps.length) * 100,
    [stepIndex],
  );

  const updateValue = <K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) => {
    if (!interactionStarted.current) {
      interactionStarted.current = true;
      track("intake_started", {
        catalog_product_count: catalogSelection.length,
        source: attribution.source || "direct",
      });
    }
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const onNext = () => {
    const nextErrors = validateFields(values, activeStep.fields);
    if (Object.keys(nextErrors).length > 0) {
      setErrors((current) => ({ ...current, ...nextErrors }));
      track("intake_validation_blocked", {
        step: activeStep.id,
        error_count: Object.keys(nextErrors).length,
      });
      return;
    }
    track("intake_step_completed", { step: activeStep.id });
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  };

  const onPrevious = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const onSubmit = async () => {
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      const allErrors = validateFields(values, [
        "orgType",
        "problemCategory",
        "aiStack",
        "modelMix",
        "failureMode",
        "governanceMaturity",
        "urgency",
        "scope",
        "budgetFlexibility",
        "name",
        "organization",
        "workflowSummary",
        "email",
      ]);
      setErrors(allErrors);
      track("intake_validation_blocked", {
        step: activeStep.id,
        error_count: Object.keys(allErrors).length,
      });
      return;
    }

    if (parsed.data.website) {
      return;
    }

    const intake: IntakeSubmission = {
      orgType: parsed.data.orgType,
      problemCategory: parsed.data.problemCategory,
      aiStack: parsed.data.aiStack,
      modelMix: parsed.data.modelMix,
      failureMode: parsed.data.failureMode,
      governanceMaturity: parsed.data.governanceMaturity,
      urgency: parsed.data.urgency,
      scope: parsed.data.scope,
      budgetFlexibility: parsed.data.budgetFlexibility,
      email: parsed.data.email || undefined,
    };

    const classification = classifyIntake(intake);
    const endpoint = process.env.NEXT_PUBLIC_INTAKE_WEBHOOK_URL;
    const provider =
      process.env.NEXT_PUBLIC_INTAKE_PROVIDER ?? (endpoint ? "custom" : "none");
    const payload = {
      type: "lead-intake",
      submittedAt: new Date().toISOString(),
      contactAvailable: Boolean(intake.email),
      contact: {
        name: parsed.data.name,
        organization: parsed.data.organization,
        email: parsed.data.email,
      },
      workflowSummary: parsed.data.workflowSummary,
      catalogSelection,
      attribution,
      intake,
      classification,
      delivery: {
        provider,
        requestedFollowUp: "fit-review",
        preferredReplyTo: parsed.data.email,
      },
      antiAutomation: {
        elapsedMs: Date.now() - formMountedAt.current,
        honeypotClear: true,
      },
      tags: [
        `problem:${intake.problemCategory}`,
        `failure:${intake.failureMode}`,
        `maturity:${intake.governanceMaturity}`,
        `tier:${classification.tier}`,
        ...catalogSelection.map((product) => `catalog:${product}`),
      ],
    };

    setIsSubmitting(true);
    let delivered = false;
    try {
      if (provider !== "none" && endpoint) {
        const requestBody =
          provider === "formspree"
            ? {
                name: parsed.data.name,
                organization: parsed.data.organization,
                email: parsed.data.email,
                message: parsed.data.workflowSummary,
                _subject: `AIAS fit request — ${parsed.data.organization}`,
                aias_payload: JSON.stringify(payload),
              }
            : payload;
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 8000);
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
          credentials: "omit",
          referrerPolicy: "strict-origin-when-cross-origin",
          signal: controller.signal,
        });
        window.clearTimeout(timeoutId);
        delivered = response.ok;
      }
    } catch {
      delivered = false;
    } finally {
      downloadJsonArtifact(payload);
      setIsSubmitting(false);
      setDeliveryState(delivered ? "sent" : "prepared");
      window.sessionStorage.removeItem("aias_intake_progress");
      setValues({
        ...intake,
        email: parsed.data.email,
        name: parsed.data.name,
        organization: parsed.data.organization,
        workflowSummary: parsed.data.workflowSummary,
      });
      track(delivered ? "intake_delivered" : "intake_prepared", {
        catalog_product_count: catalogSelection.length,
        tier: classification.tier,
        provider,
        source: attribution.source || "direct",
      });
    }
  };

  if (deliveryState !== "idle") {
    const intake = formSchema.parse({ ...values, website: "" });
    const result = classifyIntake({
      orgType: intake.orgType,
      problemCategory: intake.problemCategory,
      aiStack: intake.aiStack,
      modelMix: intake.modelMix,
      failureMode: intake.failureMode,
      governanceMaturity: intake.governanceMaturity,
      urgency: intake.urgency,
      scope: intake.scope,
      budgetFlexibility: intake.budgetFlexibility,
      email: intake.email || undefined,
    });
    const selectedProducts = catalogOptions.filter((option) =>
      catalogSelection.includes(option.id),
    );
    const emailSubject = `AIAS fit brief — ${intake.organization}`;
    const emailBody = [
      `Name: ${intake.name}`,
      `Organization: ${intake.organization}`,
      `Email: ${intake.email}`,
      selectedProducts.length > 0
        ? `Catalog shortlist: ${selectedProducts.map((product) => product.title).join(", ")}`
        : "Catalog shortlist: open to recommendation",
      `Recommended path: ${result.recommendedPath.title}`,
      `Workflow: ${intake.workflowSummary}`,
      "",
      "Please reply with fit, material risks, and the smallest useful next step.",
    ].join("\n");
    const emailHref = `mailto:${contactEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    const leadBrief = buildLeadBriefMarkdown({
      contact: {
        name: intake.name,
        organization: intake.organization,
        email: intake.email,
      },
      workflowSummary: intake.workflowSummary,
      catalogTitles: selectedProducts.map((product) => product.title),
      intake: {
        orgType: intake.orgType,
        problemCategory: intake.problemCategory,
        aiStack: intake.aiStack,
        modelMix: intake.modelMix,
        failureMode: intake.failureMode,
        governanceMaturity: intake.governanceMaturity,
        urgency: intake.urgency,
        scope: intake.scope,
        budgetFlexibility: intake.budgetFlexibility,
        email: intake.email,
      },
      classification: result,
      attribution,
    });

    return (
      <SurfaceCard>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          {deliveryState === "sent"
            ? "Intake delivered"
            : "Fit brief prepared locally"}
        </p>
        <h2 className="mt-3 text-2xl font-bold">
          {result.recommendedPath.title}
        </h2>
        <p className="mt-3 text-muted-foreground">
          {result.recommendedPath.summary}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          {deliveryState === "sent"
            ? `The configured intake channel accepted the brief. Follow-up can be sent to ${intake.email}.`
            : "No intake endpoint is configured, so nothing was silently claimed as submitted. Your structured JSON was downloaded; email the prepared summary or book a diagnostic to deliver the context."}
        </p>
        <div className="mt-6 rounded-lg border bg-muted/40 p-4">
          <p className="text-sm font-semibold">Why this path</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
            {result.rationale.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        {selectedProducts.length > 0 && (
          <div className="mt-5 border-2 border-border bg-background p-4">
            <p className="font-mono text-xs font-bold uppercase text-foreground">
              Catalog context carried forward
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {selectedProducts.map((product) => (
                <li key={product.id}>{product.title}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <a
              href={emailHref}
              onClick={() =>
                track("intake_email_handoff_clicked", {
                  catalog_product_count: catalogSelection.length,
                })
              }
            >
              Email this fit brief
            </a>
          </Button>
          <Button asChild variant="outline">
            <a
              href={bookingHref}
              onClick={() => track("intake_booking_handoff_clicked")}
            >
              Book diagnostic
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              downloadTextArtifact({
                content: leadBrief,
                filename: `aias-fit-brief-${new Date().toISOString().slice(0, 10)}.md`,
              });
              track("intake_decision_brief_downloaded", {
                catalog_product_count: catalogSelection.length,
              });
            }}
          >
            Download decision brief
          </Button>
        </div>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard>
      {catalogSelection.length > 0 && (
        <div className="mb-6 border-2 border-primary bg-primary/5 p-4">
          <p className="font-mono text-xs font-black uppercase tracking-wider text-primary">
            Catalog shortlist received
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {catalogOptions
              .filter((option) => catalogSelection.includes(option.id))
              .map((option) => option.title)
              .join(" · ")}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Your answers will qualify this shortlist against the operating
            context. Selection does not lock the recommendation.
          </p>
        </div>
      )}
      <div className="mb-6" aria-live="polite">
        <p className="text-sm text-muted-foreground">
          Step {stepIndex + 1} of {steps.length}
        </p>
        <h2 className="text-2xl font-bold">{activeStep.title}</h2>
        <div className="mt-3 h-2 w-full rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (stepIndex === steps.length - 1) {
            void onSubmit();
            return;
          }
          onNext();
        }}
      >
        <p className="text-xs text-muted-foreground">
          Submit sanitized business context only. If a delivery provider is
          configured, the validated brief is sent directly from your browser;
          otherwise it remains local and downloads for your records.
        </p>
        <input
          autoComplete="off"
          className="hidden"
          name="website"
          tabIndex={-1}
          type="text"
          value={values.website || ""}
          onChange={(event) => updateValue("website", event.target.value)}
        />

        {stepIndex === 0 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="orgType">Organization type</Label>
              <Select
                value={values.orgType ?? ""}
                onValueChange={(value) =>
                  updateValue("orgType", value as IntakeSubmission["orgType"])
                }
              >
                <SelectTrigger
                  id="orgType"
                  aria-invalid={Boolean(errors.orgType)}
                  aria-describedby={
                    errors.orgType ? "orgType-error" : undefined
                  }
                >
                  <SelectValue placeholder="Choose your organization type" />
                </SelectTrigger>
                <SelectContent>
                  {ORG_TYPES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {orgTypeLabels[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.orgType && (
                <p id="orgType-error" className="text-sm text-destructive">
                  {errors.orgType}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="problemCategory">Primary problem category</Label>
              <Select
                value={values.problemCategory ?? ""}
                onValueChange={(value) =>
                  updateValue(
                    "problemCategory",
                    value as IntakeSubmission["problemCategory"],
                  )
                }
              >
                <SelectTrigger
                  id="problemCategory"
                  aria-invalid={Boolean(errors.problemCategory)}
                  aria-describedby={
                    errors.problemCategory ? "problemCategory-error" : undefined
                  }
                >
                  <SelectValue placeholder="Choose the closest match" />
                </SelectTrigger>
                <SelectContent>
                  {PROBLEM_CATEGORIES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {problemLabels[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.problemCategory && (
                <p
                  id="problemCategory-error"
                  className="text-sm text-destructive"
                >
                  {errors.problemCategory}
                </p>
              )}
            </div>
          </>
        )}

        {stepIndex === 1 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="aiStack">Current AI stack</Label>
              <Select
                value={values.aiStack ?? ""}
                onValueChange={(value) =>
                  updateValue("aiStack", value as IntakeSubmission["aiStack"])
                }
              >
                <SelectTrigger
                  id="aiStack"
                  aria-invalid={Boolean(errors.aiStack)}
                  aria-describedby={
                    errors.aiStack ? "aiStack-error" : undefined
                  }
                >
                  <SelectValue placeholder="Select current AI stack state" />
                </SelectTrigger>
                <SelectContent>
                  {AI_STACK_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {aiStackLabels[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.aiStack && (
                <p id="aiStack-error" className="text-sm text-destructive">
                  {errors.aiStack}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelMix">Model mix</Label>
              <Select
                value={values.modelMix ?? ""}
                onValueChange={(value) =>
                  updateValue("modelMix", value as IntakeSubmission["modelMix"])
                }
              >
                <SelectTrigger
                  id="modelMix"
                  aria-invalid={Boolean(errors.modelMix)}
                  aria-describedby={
                    errors.modelMix ? "modelMix-error" : undefined
                  }
                >
                  <SelectValue placeholder="Select model mix" />
                </SelectTrigger>
                <SelectContent>
                  {MODEL_MIX_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {modelMixLabels[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.modelMix && (
                <p id="modelMix-error" className="text-sm text-destructive">
                  {errors.modelMix}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="failureMode">Current failure mode</Label>
              <Select
                value={values.failureMode ?? ""}
                onValueChange={(value) =>
                  updateValue(
                    "failureMode",
                    value as IntakeSubmission["failureMode"],
                  )
                }
              >
                <SelectTrigger
                  id="failureMode"
                  aria-invalid={Boolean(errors.failureMode)}
                  aria-describedby={
                    errors.failureMode ? "failureMode-error" : undefined
                  }
                >
                  <SelectValue placeholder="Select the highest-risk failure mode" />
                </SelectTrigger>
                <SelectContent>
                  {FAILURE_MODE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {failureModeLabels[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.failureMode && (
                <p id="failureMode-error" className="text-sm text-destructive">
                  {errors.failureMode}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="governanceMaturity">Governance maturity</Label>
              <Select
                value={values.governanceMaturity ?? ""}
                onValueChange={(value) =>
                  updateValue(
                    "governanceMaturity",
                    value as IntakeSubmission["governanceMaturity"],
                  )
                }
              >
                <SelectTrigger
                  id="governanceMaturity"
                  aria-invalid={Boolean(errors.governanceMaturity)}
                  aria-describedby={
                    errors.governanceMaturity
                      ? "governanceMaturity-error"
                      : undefined
                  }
                >
                  <SelectValue placeholder="Select governance maturity level" />
                </SelectTrigger>
                <SelectContent>
                  {GOVERNANCE_MATURITY_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {governanceMaturityLabels[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.governanceMaturity && (
                <p
                  id="governanceMaturity-error"
                  className="text-sm text-destructive"
                >
                  {errors.governanceMaturity}
                </p>
              )}
            </div>
          </>
        )}

        {stepIndex === 2 && (
          <>
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">Urgency</legend>
              <RadioGroup
                value={values.urgency ?? ""}
                onValueChange={(value) =>
                  updateValue("urgency", value as IntakeSubmission["urgency"])
                }
                aria-invalid={Boolean(errors.urgency)}
                aria-describedby={errors.urgency ? "urgency-error" : undefined}
              >
                {URGENCY_LEVELS.map((option) => (
                  <div className="flex items-center space-x-3" key={option}>
                    <RadioGroupItem id={`urgency-${option}`} value={option} />
                    <Label htmlFor={`urgency-${option}`}>
                      {urgencyLabels[option]}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.urgency && (
                <p id="urgency-error" className="text-sm text-destructive">
                  {errors.urgency}
                </p>
              )}
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">Engagement scope</legend>
              <RadioGroup
                value={values.scope ?? ""}
                onValueChange={(value) =>
                  updateValue("scope", value as IntakeSubmission["scope"])
                }
                aria-invalid={Boolean(errors.scope)}
                aria-describedby={errors.scope ? "scope-error" : undefined}
              >
                {ENGAGEMENT_SCOPES.map((option) => (
                  <div className="flex items-center space-x-3" key={option}>
                    <RadioGroupItem id={`scope-${option}`} value={option} />
                    <Label htmlFor={`scope-${option}`}>
                      {scopeLabels[option]}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.scope && (
                <p id="scope-error" className="text-sm text-destructive">
                  {errors.scope}
                </p>
              )}
            </fieldset>
          </>
        )}

        {stepIndex === 3 && (
          <>
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">
                Budget flexibility
              </legend>
              <RadioGroup
                value={values.budgetFlexibility ?? ""}
                onValueChange={(value) =>
                  updateValue(
                    "budgetFlexibility",
                    value as IntakeSubmission["budgetFlexibility"],
                  )
                }
                aria-invalid={Boolean(errors.budgetFlexibility)}
                aria-describedby={
                  errors.budgetFlexibility
                    ? "budgetFlexibility-error"
                    : undefined
                }
              >
                {BUDGET_FLEXIBILITY_RANGES.map((option) => (
                  <div className="flex items-center space-x-3" key={option}>
                    <RadioGroupItem id={`budget-${option}`} value={option} />
                    <Label htmlFor={`budget-${option}`}>
                      {budgetLabels[option]}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.budgetFlexibility && (
                <p
                  id="budgetFlexibility-error"
                  className="text-sm text-destructive"
                >
                  {errors.budgetFlexibility}
                </p>
              )}
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Your name</Label>
                <Input
                  autoComplete="name"
                  id="name"
                  placeholder="Name"
                  value={values.name || ""}
                  onChange={(event) => updateValue("name", event.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-destructive">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  autoComplete="organization"
                  id="organization"
                  placeholder="Organization"
                  value={values.organization || ""}
                  onChange={(event) =>
                    updateValue("organization", event.target.value)
                  }
                  aria-invalid={Boolean(errors.organization)}
                  aria-describedby={
                    errors.organization ? "organization-error" : undefined
                  }
                />
                {errors.organization && (
                  <p
                    id="organization-error"
                    className="text-sm text-destructive"
                  >
                    {errors.organization}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workflowSummary">
                Workflow, volume, and current failure
              </Label>
              <Textarea
                id="workflowSummary"
                maxLength={1200}
                placeholder="Example: We reconcile 2,000 invoices each month across NetSuite and email. Duplicate detection and PO exceptions consume two operator-days per week."
                rows={5}
                value={values.workflowSummary || ""}
                onChange={(event) =>
                  updateValue("workflowSummary", event.target.value)
                }
                aria-invalid={Boolean(errors.workflowSummary)}
                aria-describedby={
                  errors.workflowSummary
                    ? "workflowSummary-error"
                    : "workflowSummary-help"
                }
              />
              {errors.workflowSummary && (
                <p
                  id="workflowSummary-error"
                  className="text-sm text-destructive"
                >
                  {errors.workflowSummary}
                </p>
              )}
              <p
                className="text-xs text-muted-foreground"
                id="workflowSummary-help"
              >
                Use approximate volumes and sanitized context. Do not include
                credentials, personal data, or production records.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                autoComplete="email"
                id="email"
                type="email"
                placeholder="you@company.com"
                value={values.email || ""}
                onChange={(event) => updateValue("email", event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : "email-help"}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive">
                  {errors.email}
                </p>
              )}
              <p className="text-xs text-muted-foreground" id="email-help">
                The page states whether the configured intake channel accepted
                the brief. A local JSON copy is always generated for your
                records.
              </p>
            </div>
          </>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={stepIndex === 0 || isSubmitting}
          >
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {stepIndex === steps.length - 1
              ? isSubmitting
                ? "Submitting..."
                : "Prepare fit brief"
              : "Continue"}
          </Button>
        </div>
      </form>
    </SurfaceCard>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PageLoader } from "@/components/loading-states";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import type { RuntimeUiConfig } from "@/lib/runtime-ui/runtime-ui-config";

type ReviewState = "default" | "loading" | "empty" | "error";

async function getCsrfToken(): Promise<string | null> {
  try {
    const r = await fetch("/api/csrf", { method: "GET", credentials: "same-origin" });
    if (!r.ok) {return null;}
    const data = (await r.json()) as { token?: string };
    return data.token ?? null;
  } catch {
    return null;
  }
}

export function ReviewClient(props: { config: RuntimeUiConfig; source: string; envLabel: string; canEdit: boolean }) {
  const [state, setState] = useState<ReviewState>("default");
  const [draft, setDraft] = useState(() => JSON.stringify(props.config, null, 2));
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const criticalRoutes = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "Pricing", href: "/pricing" },
      { label: "Sign up", href: "/signup" },
      { label: "Sign in", href: "/signin" },
      { label: "Dashboard (auth)", href: "/dashboard" },
      { label: "Workflows (auth)", href: "/workflows" },
      { label: "Billing (auth)", href: "/billing" },
      { label: "Settings (auth)", href: "/settings" },
      { label: "Admin (admin)", href: "/admin" },
      { label: "Trust", href: "/trust" },
      { label: "Status", href: "/status" },
      { label: "API docs", href: "/api" },
    ],
    []
  );

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">Internal Review</h1>
        <p className="text-muted-foreground">
          Fast visual polish harness for preview deployments. Environment: <span className="font-medium">{props.envLabel}</span>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Critical routes</CardTitle>
          <CardDescription>Open key flows/pages in new tabs during polish passes.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {criticalRoutes.map((r) => (
            <Button key={r.href} asChild variant="outline">
              <Link href={r.href} target="_blank">
                {r.label}
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>UI state toggles</CardTitle>
          <CardDescription>Force common UI states to speed up review.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setState("default")} variant={state === "default" ? "default" : "outline"}>
              Default
            </Button>
            <Button onClick={() => setState("loading")} variant={state === "loading" ? "default" : "outline"}>
              Loading
            </Button>
            <Button onClick={() => setState("empty")} variant={state === "empty" ? "default" : "outline"}>
              Empty
            </Button>
            <Button onClick={() => setState("error")} variant={state === "error" ? "default" : "outline"}>
              Error
            </Button>
          </div>

          <div>
            {state === "loading" ? (
              <PageLoader />
            ) : state === "empty" ? (
              <EmptyState
                title="No results"
                description="This is a representative empty state for polishing spacing, typography, and CTA affordances."
                secondaryAction={{ label: "Go home", href: "/" }}
              />
            ) : state === "error" ? (
              <ErrorState
                title="Example error"
                description="This is a representative error state for polishing messaging and recovery."
                error="Simulated error for review mode."
                onRetry={() => setState("default")}
                showDetails={true}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Card shadow + radius</CardTitle>
                    <CardDescription>Driven by runtime tokens (`--shadow-card`, `--radius`).</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Adjust tokens via Edge Config to iterate without rebuilds.
                    </p>
                    <Button asChild>
                      <Link href="/demo" target="_blank">
                        Primary CTA
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Typography + spacing</CardTitle>
                    <CardDescription>Spot-check heading, body, and button sizes.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">
                      Use this page to sanity-check contrast, hover states, focus rings, and mobile wrapping behavior.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline">Secondary</Button>
                      <Button>Primary</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current runtime UI config (public)</CardTitle>
          <CardDescription>
            Source: <span className="font-medium">{props.source}</span>. This is what the frontend reads at runtime.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            onClick={() => {
              void navigator.clipboard.writeText(JSON.stringify(props.config, null, 2));
            }}
          >
            Copy JSON
          </Button>
          <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-[480px]">
            {JSON.stringify(props.config, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {props.canEdit ? (
        <Card>
          <CardHeader>
            <CardTitle>Update runtime UI config (admin)</CardTitle>
            <CardDescription>
              Saves to DB-backed runtime config. Requires same-origin + CSRF token.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <textarea
              className="w-full min-h-[240px] rounded-md border border-border bg-background p-3 font-mono text-xs"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <div className="flex gap-2 items-center">
              <Button
                onClick={() => {
                  void (async () => {
                    setSaveStatus("saving");
                    const csrf = await getCsrfToken();
                    if (!csrf) {
                      setSaveStatus("error");
                      return;
                    }

                    let parsed: unknown;
                    try {
                      parsed = JSON.parse(draft);
                    } catch {
                      setSaveStatus("error");
                      return;
                    }

                    const r = await fetch("/api/admin/ui-config", {
                      method: "POST",
                      credentials: "same-origin",
                      headers: {
                        "content-type": "application/json",
                        "x-csrf-token": csrf,
                      },
                      body: JSON.stringify({ config: parsed }),
                    });

                    if (!r.ok) {
                      setSaveStatus("error");
                      return;
                    }
                    setSaveStatus("saved");
                  })();
                }}
                disabled={saveStatus === "saving"}
              >
                {saveStatus === "saving" ? "Saving…" : "Save"}
              </Button>
              <span className="text-sm text-muted-foreground">
                {saveStatus === "saved"
                  ? "Saved. Refresh to see applied values."
                  : saveStatus === "error"
                    ? "Save failed. Check JSON + auth."
                    : null}
              </span>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}


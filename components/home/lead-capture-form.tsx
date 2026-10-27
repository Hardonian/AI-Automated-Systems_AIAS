"use client";

import { useState } from "react";
import Link from "next/link";

export function LeadCaptureForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "local-fallback" | "error"
  >("idle");

  const persistLocalSubscription = (subEmail: string, subName: string) => {
    try {
      const existingRaw = window.localStorage.getItem("aias_subscriber_queue");
      const existing = existingRaw
        ? (JSON.parse(existingRaw) as unknown[])
        : [];
      const next = Array.isArray(existing) ? existing : [];
      next.push({
        email: subEmail,
        name: subName,
        savedAt: new Date().toISOString(),
      });
      window.localStorage.setItem(
        "aias_subscriber_queue",
        JSON.stringify(next.slice(-20)),
      );
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch(
        "https://api.aiautomatedsystems.ca/api/subscribe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name, tag: "vercel-site" }),
        },
      );

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setName("");
      } else {
        persistLocalSubscription(email, name);
        setStatus("local-fallback");
      }
    } catch {
      persistLocalSubscription(email, name);
      setStatus("local-fallback");
    }
  };

  const fallbackMailto = `mailto:inquiries@aiautomatedsystems.ca?subject=${encodeURIComponent(
    "Subscribe to AIAS Sovereign AI Lab Updates",
  )}&body=${encodeURIComponent(
    `Please add ${name ? `${name} (${email})` : email} to the AIAS Sovereign AI Lab dispatches.`,
  )}`;

  return (
    <section
      aria-labelledby="lead-capture-heading"
      className="border-y border-border bg-surface-muted/50 py-16"
    >
      <div className="container mx-auto max-w-xl px-4 text-center">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          Stay in the loop
        </p>
        <h2
          id="lead-capture-heading"
          className="mt-3 text-2xl font-black uppercase tracking-tight"
        >
          Get sovereign AI lab updates
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          New workflows, ComfyUI packs, private inference pricing, and operator
          playbooks. No spam — unsubscribe in one click.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="lead-capture-name" className="sr-only">
            First name (optional)
          </label>
          <input
            id="lead-capture-name"
            aria-label="First name (optional)"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First name (optional)"
            className="flex-1 border-2 border-border bg-card px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            autoComplete="given-name"
          />
          <label htmlFor="lead-capture-email" className="sr-only">
            Work email address
          </label>
          <input
            id="lead-capture-email"
            aria-label="Work email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            className="flex-1 border-2 border-border bg-card px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            autoComplete="email"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="border-2 border-primary bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-[3px_3px_0px_0px_hsl(var(--text))] transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {status === "loading" ? "…" : "Subscribe"}
          </button>
        </form>

        {status === "success" && (
          <p
            role="status"
            aria-live="polite"
            className="mt-4 font-mono text-sm text-emerald-500"
          >
            ✓ You&apos;re in. Check your inbox for a confirmation.
          </p>
        )}
        {status === "local-fallback" && (
          <div
            role="status"
            aria-live="polite"
            className="mt-4 border border-primary/40 bg-card p-3 font-mono text-xs text-foreground"
          >
            <p className="font-bold text-primary">
              ✓ Saved locally in offline-resilient mode.
            </p>
            <p className="mt-1 text-muted-foreground">
              Confirm immediately via{" "}
              <a
                href={fallbackMailto}
                className="font-bold text-primary underline"
              >
                1-click email dispatch
              </a>{" "}
              or subscribe directly to our{" "}
              <Link
                href="/rss.xml"
                className="font-bold text-primary underline"
              >
                RSS / Atom feed
              </Link>
              .
            </p>
          </div>
        )}
        {status === "error" && (
          <p role="alert" className="mt-4 font-mono text-sm text-red-500">
            Something went wrong. Try again or email{" "}
            <a
              href="mailto:inquiries@aiautomatedsystems.ca"
              className="underline"
            >
              inquiries@aiautomatedsystems.ca
            </a>
          </p>
        )}
      </div>
    </section>
  );
}

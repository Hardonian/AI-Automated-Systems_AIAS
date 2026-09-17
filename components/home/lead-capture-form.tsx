"use client";

import { useState } from "react";

export function LeadCaptureForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("https://api.aiautomatedsystems.ca/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, tag: "vercel-site" }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setName("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="border-y border-border bg-surface-muted/50 py-16">
      <div className="container mx-auto max-w-xl px-4 text-center">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          Stay in the loop
        </p>
        <h2 className="mt-3 text-2xl font-black uppercase tracking-tight">
          Get sovereign AI lab updates
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          New workflows, ComfyUI packs, private inference pricing, and operator
          playbooks. No spam — unsubscribe in one click.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First name (optional)"
            className="flex-1 border-2 border-border bg-card px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            autoComplete="given-name"
          />
          <input
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
            className="border-2 border-primary bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-[3px_3px_0px_0px_hsl(var(--text))] transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
          >
            {status === "loading" ? "…" : "Subscribe"}
          </button>
        </form>

        {status === "success" && (
          <p className="mt-4 font-mono text-sm text-green-600">
            ✓ You&apos;re in. Check your inbox for a confirmation.
          </p>
        )}
        {status === "error" && (
          <p className="mt-4 font-mono text-sm text-red-500">
            Something went wrong. Try again or email{" "}
            <a href="mailto:inquiries@aiautomatedsystems.ca" className="underline">
              inquiries@aiautomatedsystems.ca
            </a>
          </p>
        )}
      </div>
    </section>
  );
}

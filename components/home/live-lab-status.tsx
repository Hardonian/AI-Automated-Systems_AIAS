"use client";

import { useEffect, useState } from "react";

interface LabStatus {
  gpuOnline: boolean;
  productCount: number;
  auditFresh: boolean;
  computeOk: boolean;
}

export function LiveLabStatus() {
  const [status, setStatus] = useState<LabStatus | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      const result: LabStatus = {
        gpuOnline: false,
        productCount: 0,
        auditFresh: false,
        computeOk: false,
      };

      try {
        const [productsRes, auditRes, computeRes] = await Promise.allSettled([
          fetch("https://api.aiautomatedsystems.ca/api/products", {
            signal: AbortSignal.timeout(5000),
          }),
          fetch("https://api.aiautomatedsystems.ca/audit/health", {
            signal: AbortSignal.timeout(5000),
          }),
          fetch("https://compute.aiautomatedsystems.ca/health", {
            signal: AbortSignal.timeout(5000),
          }),
        ]);

        if (productsRes.status === "fulfilled" && productsRes.value.ok) {
          const data = await productsRes.value.json();
          result.productCount = data.products?.length ?? 0;
          result.gpuOnline = true;
        }

        if (auditRes.status === "fulfilled" && auditRes.value.ok) {
          const data = await auditRes.value.json();
          result.auditFresh = data.metrics?.fresh ?? false;
        }

        if (computeRes.status === "fulfilled" && computeRes.value.ok) {
          const data = await computeRes.value.json();
          result.computeOk =
            data.status === "ok" || data.checks?.some(
              (c: { status: string }) => c.status === "ok"
            );
        }
      } catch {
        // Silent — widget just stays hidden
      }

      setStatus(result);
      setLoaded(true);
    };

    fetchStatus();
  }, []);

  if (!loaded || !status) return null;

  return (
    <section className="border-b border-border bg-surface-muted/50 py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Live from the sovereign lab
            </span>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
            <LiveCard
              label="GPU Stack"
              value={status.gpuOnline ? "Online" : "Waking"}
              accent={status.gpuOnline}
            />
            <LiveCard
              label="Products"
              value={`${status.productCount}+`}
              accent={status.productCount > 0}
            />
            <LiveCard
              label="Audit Engine"
              value={status.auditFresh ? "Fresh" : "Standby"}
              accent={status.auditFresh}
            />
            <LiveCard
              label="Compute API"
              value={status.computeOk ? "Ready" : "Starting"}
              accent={status.computeOk}
            />
          </div>

          <a
            href="https://api.aiautomatedsystems.ca/audit/"
            className="inline-flex items-center gap-2 border-2 border-primary bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-[3px_3px_0px_0px_hsl(var(--text))] transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Run Free AI Lab Audit →
          </a>
        </div>
      </div>
    </section>
  );
}

function LiveCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: boolean;
}) {
  return (
    <div className="border border-border bg-card p-4 text-center">
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-1 font-mono text-lg font-black uppercase ${
          accent ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

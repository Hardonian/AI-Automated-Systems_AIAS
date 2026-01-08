"use client";

import Link from "next/link";

import { useRuntimeUiConfig } from "@/lib/runtime-ui/use-runtime-ui-config";

function toneClasses(tone: string | undefined) {
  switch (tone) {
    case "success":
      return "bg-emerald-600 text-white";
    case "warning":
      return "bg-amber-500 text-black";
    case "danger":
      return "bg-red-600 text-white";
    case "info":
    default:
      return "bg-primary text-primary-foreground";
  }
}

export function RuntimeTopBanner() {
  const { data: config } = useRuntimeUiConfig();

  const banner = config?.notices?.topBanner;
  if (!banner?.enabled) {
    return null;
  }
  if (!banner.message) {
    return null;
  }

  const cta = banner.cta;
  const hasCta = !!cta?.label && !!cta?.href;

  return (
    <div aria-label="Site notice" className={toneClasses(banner.tone)} role="status">
      <div className="container mx-auto px-4 py-2 text-sm flex flex-col sm:flex-row items-center justify-center gap-2">
        <span className="text-center">{banner.message}</span>
        {hasCta ? (
          <Link className="underline underline-offset-2 font-medium" href={cta!.href!}>
            {cta!.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}


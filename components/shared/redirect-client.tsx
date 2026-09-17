"use client";

import { useEffect } from "react";

export function RedirectClient({
  target,
  label,
}: {
  target: string;
  label: string;
}) {
  useEffect(() => {
    window.location.href = target;
  }, [target]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="font-mono text-sm text-muted-foreground">
        Loading {label}…
      </p>
      <p className="text-xs text-muted-foreground">
        If you are not redirected,{" "}
        <a href={target} className="text-primary underline">
          click here
        </a>
        .
      </p>
    </div>
  );
}

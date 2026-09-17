"use client";

import { useEffect } from "react";

export function AuditRedirectClient() {
  useEffect(() => {
    window.location.href = "https://api.aiautomatedsystems.ca/audit/";
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="font-mono text-sm text-muted-foreground">
        Loading AI Lab Audit…
      </p>
      <p className="text-xs text-muted-foreground">
        If you are not redirected,{" "}
        <a
          href="https://api.aiautomatedsystems.ca/audit/"
          className="text-primary underline"
        >
          click here
        </a>
        .
      </p>
    </div>
  );
}

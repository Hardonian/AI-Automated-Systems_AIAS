self.addEventListener("message", (event) => {
  const payload = event.data;
  if (!payload || typeof payload !== "object") return;

  if (payload.type === "pipeda-grade") {
    const checks = Array.isArray(payload.checks) ? payload.checks : [];
    const score = Math.round(
      (checks.filter(Boolean).length / Math.max(checks.length, 1)) * 100,
    );
    self.postMessage({
      type: "pipeda-grade",
      score,
      grade:
        score >= 90
          ? "A"
          : score >= 75
            ? "B"
            : score >= 60
              ? "C"
              : "Needs remediation",
    });
    return;
  }

  if (payload.type === "brief-audit") {
    const text = typeof payload.notes === "string" ? payload.notes.trim() : "";
    const hasObjective = /Objective[: \t-]+\S.{7,}/i.test(text);
    const hasConstraints =
      /(?:Constraints|Latency|Workload Context)[: \t-]*(?:\n[-*]\s+\S.{5,}|\S.{7,})/i.test(
        text,
      );
    const hasFailures =
      /(?:Failure modes|Risk)[: \t-]*(?:\n[-*]\s+\S.{5,}|\S.{7,})/i.test(text);
    const hasGates =
      /(?:Gate\s*0[1-4]|Verified Guardrail|Deterministic|Zod|SHA-256)/i.test(
        text,
      );
    const hasNext =
      /(?:Next decision|Next Implementation|Track)[: \t-]*(?:\n(?:\d+\.|[-*])\s+\S.{5,}|\S.{7,})/i.test(
        text,
      );
    const checks = [
      hasObjective,
      hasConstraints,
      hasFailures,
      hasGates,
      hasNext,
    ];
    const passed = checks.filter(Boolean).length;
    const score = Math.round((passed / checks.length) * 100);
    self.postMessage({
      type: "brief-audit",
      workerVerified: true,
      passedPillars: passed,
      totalPillars: checks.length,
      score,
    });
  }
});

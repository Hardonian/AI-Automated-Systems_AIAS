self.addEventListener("message", (event) => {
  if (event.data?.type !== "pipeda-grade") return;
  const checks = Array.isArray(event.data.checks) ? event.data.checks : [];
  const score = Math.round(
    (checks.filter(Boolean).length / Math.max(checks.length, 1)) * 100,
  );
  self.postMessage({
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
});

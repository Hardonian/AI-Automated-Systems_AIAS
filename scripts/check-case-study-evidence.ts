import { caseStudies } from "../lib/case-studies-generator";

const failures: string[] = [];

for (const study of caseStudies) {
  const evidence = study.evidence;

  if (!evidence.basis.trim())
    failures.push(`${study.slug}: evidence basis missing`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(evidence.reviewedAt)) {
    failures.push(`${study.slug}: reviewedAt must use YYYY-MM-DD`);
  }
  if (
    evidence.sources.length === 0 ||
    evidence.sources.some((source) => !source.trim())
  ) {
    failures.push(`${study.slug}: at least one evidence source is required`);
  }
  if (evidence.level === "client-approved" && !evidence.approvedBy?.trim()) {
    failures.push(
      `${study.slug}: client-approved evidence requires approvedBy`,
    );
  }
  if (evidence.level === "representative" && evidence.approvedBy) {
    failures.push(
      `${study.slug}: representative scenarios cannot imply client approval`,
    );
  }
}

if (failures.length > 0) {
  console.error("Case-study evidence check failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `Case-study evidence check passed for ${caseStudies.length} scenarios.`,
);

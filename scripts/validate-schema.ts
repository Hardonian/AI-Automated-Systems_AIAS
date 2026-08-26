import { readFileSync } from "node:fs";

const failures: string[] = [];

const requiredComponentUsage: Array<{ file: string; checks: string[] }> = [
  {
    file: "app/layout.tsx",
    checks: [
      "<OrganizationSchema",
      "<ProfessionalServiceSchema",
      "<WebSiteSchema hasSiteSearch={false}",
    ],
  },
  {
    file: "app/page.tsx",
    checks: ["<FAQSchema", "<ServiceListSchema", "faqs={siteContent.faq"],
  },
  {
    file: "app/services/page.tsx",
    checks: ["<FAQSchema", "faqs={siteContent.routeFaqs.services}"],
  },
  {
    file: "app/how-it-works/page.tsx",
    checks: ["<FAQSchema", "faqs={siteContent.faq"],
  },
];

for (const { file, checks } of requiredComponentUsage) {
  const source = readFileSync(file, "utf8");
  for (const check of checks) {
    if (!source.includes(check)) {
      failures.push(`${file}: missing ${check} usage`);
    }
  }
}

if (failures.length) {
  console.error("Schema validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Schema validation passed.");

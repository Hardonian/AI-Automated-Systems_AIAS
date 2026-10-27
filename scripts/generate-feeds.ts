import { writeFileSync } from "node:fs";

import { getLatestArticles } from "../lib/blog/articles";
import { SITE_URL } from "../lib/seo/metadata";
import { caseStudies } from "../src/content/caseStudies";
import { blueprints } from "../src/content/moat";
import { siteContent } from "../src/content/site";

const escapeXml = (value: string) =>
  value.replace(
    /[<>&'"]/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[character]!,
  );
const articles = getLatestArticles(100);
const updated = new Date(
  articles[0]?.publishedDate ?? "2024-01-01",
).toUTCString();
const rssItems = articles
  .map(
    (article) =>
      `<item><title>${escapeXml(article.title)}</title><link>${SITE_URL}/blog/${article.slug}</link><guid isPermaLink="true">${SITE_URL}/blog/${article.slug}</guid><pubDate>${new Date(article.publishedDate).toUTCString()}</pubDate><description>${escapeXml(article.excerpt)}</description></item>`,
  )
  .join("");
const atomItems = articles
  .map(
    (article) =>
      `<entry><title>${escapeXml(article.title)}</title><id>${SITE_URL}/blog/${article.slug}</id><link href="${SITE_URL}/blog/${article.slug}"/><updated>${new Date(article.publishedDate).toISOString()}</updated><summary>${escapeXml(article.excerpt)}</summary><author><name>${escapeXml(article.author)}</name></author></entry>`,
  )
  .join("");

writeFileSync(
  "public/rss.xml",
  `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>AIAS Systems Thinking + AI</title><link>${SITE_URL}/blog</link><description>Deterministic automation, governance, and systems thinking.</description><lastBuildDate>${updated}</lastBuildDate>${rssItems}</channel></rss>\n`,
);
writeFileSync(
  "public/atom.xml",
  `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>AIAS Systems Thinking + AI</title><id>${SITE_URL}/blog</id><link href="${SITE_URL}/atom.xml" rel="self"/><updated>${new Date(articles[0]?.publishedDate ?? "2024-01-01").toISOString()}</updated>${atomItems}</feed>\n`,
);

const llmsTxt = [
  `# ${siteContent.brand.name} (AIAS)`,
  "",
  `> ${siteContent.brand.tagline} — ${siteContent.positioning.subheading}`,
  "",
  `${siteContent.brand.description} Based in Canada, ${siteContent.brand.name} is an agentic automation consultancy and systems architecture lab building deterministic workflow systems, governed AI pipelines, and sovereign automation infrastructure with PIPEDA-informed and SOC 2-aligned guardrails.`,
  "",
  "## Interactive Self-Serve Simulators & Diagnostics",
  `- [AI Clarity & Architecture Diagnostic](${SITE_URL}/diagnostic): 4-step capability allocation matrix, risk scorer, and portable CTO permalink generator.`,
  `- [Quick Tools & Handoff Console](${SITE_URL}/tools): Local-first architecture handoff console with SHA-256 receipts, AES-GCM encrypted export, and fault-injection stress testing.`,
  `- [Policy & Guardrail Studio](${SITE_URL}/tools/policy-studio): Interactive deterministic boundary and PII redaction simulator.`,
  `- [ROI & Capacity Calculator](${SITE_URL}/roi-calculator): Deterministic payback, hours reclaimed, and error-reduction financial modeler.`,
  `- [Automation Engine Simulator](${SITE_URL}/automation-demo): Live 4-stage pipeline telemetry and policy intercept visualizer.`,
  `- [Readiness & Maturity Scorecard](${SITE_URL}/readiness-checklist): Enterprise AI governance and data readiness assessment.`,
  "",
  "## Core Services & Engagement Tracks",
  ...siteContent.services.map(
    (s) =>
      `- [${s.title}](${SITE_URL}/services): ${s.description} (Outcome: ${s.outcome})`,
  ),
  ...siteContent.consultancyTracks.map(
    (t) => `- [${t.title}](${SITE_URL}/hire): ${t.description} (${t.timeline})`,
  ),
  "",
  "## Turnkey Catalog Modules",
  ...siteContent.catalogProducts.map(
    (p) =>
      `- [${p.title}](${SITE_URL}/catalog): ${p.description} (${p.operationalOutcome})`,
  ),
  "",
  "## Open Architecture Blueprints",
  ...blueprints.map(
    (bp) => `- [${bp.title}](${SITE_URL}/blueprints/${bp.slug}): ${bp.summary}`,
  ),
  "",
  "## Production Case Studies",
  ...caseStudies.map(
    (cs) =>
      `- [${cs.title}](${SITE_URL}/case-studies/${cs.slug}): ${cs.summary}`,
  ),
  "",
  "## Engineering Research & Systems Thinking Articles",
  ...articles
    .slice(0, 15)
    .map((a) => `- [${a.title}](${SITE_URL}/blog/${a.slug}): ${a.excerpt}`),
  "",
  "## Full Context Corpus",
  `- [Full AIAS Technical Corpus (llms-full.txt)](${SITE_URL}/llms-full.txt)`,
  `- [RSS Feed](${SITE_URL}/rss.xml)`,
  `- [Atom Feed](${SITE_URL}/atom.xml)`,
  "",
].join("\n");

const llmsFullTxt = [
  `# ${siteContent.brand.name} (AIAS) — Complete Technical & Architectural Corpus`,
  "",
  `Canonical URL: ${SITE_URL}`,
  `Contact: ${siteContent.contact.email} (${siteContent.contact.responseTime})`,
  "",
  "## 1. Positioning & Architectural Philosophy",
  `${siteContent.brand.tagline}`,
  `${siteContent.brand.description}`,
  `${siteContent.positioning.subheading}`,
  "",
  "Core Invariants:",
  "- Deterministic rules govern all state transitions, financial math, and schema contracts.",
  "- Probabilistic AI models are constrained to scoped classification, extraction, and synthesis with explicit confidence thresholds.",
  "- Zero-hard-500 resilience: every external model or API call is wrapped in circuit breakers and human-in-the-loop escalation queues.",
  "- PIPEDA-informed Canadian data residency and SOC 2-aligned cryptographic audit receipts.",
  "",
  "## 2. Services & Consultancy Tracks",
  ...siteContent.services.flatMap((s) => [
    `### ${s.title} (${SITE_URL}/services)`,
    `- Summary: ${s.description}`,
    `- Outcome: ${s.outcome}`,
    `- Deliverables: ${s.deliverables.join("; ")}`,
    "",
  ]),
  ...siteContent.consultancyTracks.flatMap((t) => [
    `### ${t.title} — ${t.subtitle} (${SITE_URL}/hire)`,
    `- Timeline: ${t.timeline} | Focus: ${t.architectureFocus}`,
    `- Description: ${t.description}`,
    `- Deliverables: ${t.deliverables.join("; ")}`,
    `- SLA Guarantees: ${t.slaGuarantees.join("; ")}`,
    "",
  ]),
  "## 3. Turnkey Catalog Modules",
  ...siteContent.catalogProducts.flatMap((p) => [
    `### ${p.title} — ${p.subtitle} (${SITE_URL}/catalog)`,
    `- Category: ${p.category} | License: ${p.license}`,
    `- Description: ${p.description}`,
    `- Operational Outcome: ${p.operationalOutcome}`,
    `- Architecture Summary: ${p.architectureSummary}`,
    `- Control Points: ${p.controlPoints.join("; ")}`,
    "",
  ]),
  "## 4. Reference Architecture Blueprints",
  ...blueprints.flatMap((bp) => [
    `### ${bp.title} (${SITE_URL}/blueprints/${bp.slug})`,
    `- Summary: ${bp.summary}`,
    `- Operating Model: ${bp.operatingModel}`,
    `- Problem: ${bp.problem}`,
    `- Constraints: ${bp.constraints.join("; ")}`,
    `- Architecture Nodes: ${bp.architectureNodes.join(" -> ")}`,
    "",
  ]),
  "## 5. Production Case Studies",
  ...caseStudies.flatMap((cs) => [
    `### ${cs.title} (${SITE_URL}/case-studies/${cs.slug})`,
    `- Summary: ${cs.summary}`,
    `- Client Problem: ${cs.clientProblem}`,
    `- Architecture Chosen: ${cs.architectureChosen}`,
    `- Governance Model: ${cs.governanceModel.join("; ")}`,
    `- Performance Results: ${cs.performanceResults.join("; ")}`,
    "",
  ]),
  "## 6. Frequently Asked Questions",
  ...siteContent.faq.flatMap((faqItem) => [
    `### Q: ${faqItem.question}`,
    `A: ${faqItem.answer}`,
    "",
  ]),
  "## 7. Published Engineering Articles",
  ...articles.flatMap((a) => [
    `### ${a.title} (${SITE_URL}/blog/${a.slug})`,
    `- Published: ${a.publishedDate} | Category: ${a.category} | Reading Time: ${a.readingTime}`,
    `- Summary: ${a.excerpt}`,
    "",
  ]),
].join("\n");

writeFileSync("public/llms.txt", llmsTxt);
writeFileSync("public/llms-full.txt", llmsFullTxt);

console.log(
  `Generated RSS, Atom, llms.txt, and llms-full.txt feeds with ${articles.length} entries.`,
);

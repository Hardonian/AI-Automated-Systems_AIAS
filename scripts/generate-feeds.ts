import { writeFileSync } from "node:fs";

import { getLatestArticles } from "../lib/blog/articles";
import { SITE_URL } from "../lib/seo/metadata";

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
console.log(`Generated RSS and Atom feeds with ${articles.length} entries.`);

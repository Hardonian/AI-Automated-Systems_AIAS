import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const purify = DOMPurify(window as unknown as Parameters<typeof DOMPurify>[0]);

const STRICT_CONFIG: import("dompurify").Config = {
  ALLOWED_TAGS: [
    "a",
    "blockquote",
    "br",
    "code",
    "em",
    "h2",
    "h3",
    "h4",
    "hr",
    "li",
    "ol",
    "p",
    "pre",
    "strong",
    "ul",
  ],
  ALLOWED_ATTR: ["href", "rel", "target"],
  ALLOW_DATA_ATTR: false,
  ALLOW_ARIA_ATTR: false,
  FORBID_TAGS: ["form", "iframe", "object", "script", "style", "svg", "math"],
  FORBID_ATTR: ["style", "srcset"],
};

export function sanitizeHTMLServer(html: string): string {
  return purify.sanitize(html.slice(0, 200_000), STRICT_CONFIG);
}

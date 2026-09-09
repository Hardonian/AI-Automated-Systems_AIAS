import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export interface BuiltPage {
  file: string;
  html: string;
  route: string;
}

const walk = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory()
      ? walk(target)
      : entry.isFile() && entry.name.endsWith(".html")
        ? [target]
        : [];
  });

const fileToRoute = (file: string) => {
  const relative = path.relative("out", file).replaceAll("\\", "/");
  if (relative === "index.html") return "/";
  return `/${relative.replace(/\/index\.html$/, "").replace(/\.html$/, "")}`;
};

export function getBuiltPages(): BuiltPage[] {
  if (!existsSync("out")) {
    throw new Error("Missing out/ directory. Run pnpm build first.");
  }

  return walk("out")
    .filter((file) => !/(?:^|[\\/])(?:404|_not-found)\.html$/.test(file))
    .map((file) => ({
      file,
      html: readFileSync(file, "utf8"),
      route: fileToRoute(file),
    }));
}

export function attributeValues(
  html: string,
  element: "link" | "meta",
  identifyingAttribute: string,
  identifyingValue: string,
  valueAttribute: string,
): string[] {
  const tags = html.match(new RegExp(`<${element}\\b[^>]*>`, "gi")) ?? [];
  return tags.flatMap((tag) => {
    const identity = tag.match(
      new RegExp(`${identifyingAttribute}=["']([^"']+)["']`, "i"),
    )?.[1];
    const value = tag.match(
      new RegExp(`${valueAttribute}=["']([^"']+)["']`, "i"),
    )?.[1];
    return identity === identifyingValue && value
      ? [value.replaceAll("&amp;", "&")]
      : [];
  });
}

export function jsonLdObjects(html: string): Array<Record<string, unknown>> {
  const scripts =
    html.match(
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
    ) ?? [];

  return scripts.flatMap((script) => {
    const raw = script
      .replace(/^<script\b[^>]*>/i, "")
      .replace(/<\/script>$/i, "");
    try {
      const parsed: unknown = JSON.parse(raw);
      return parsed && typeof parsed === "object"
        ? [parsed as Record<string, unknown>]
        : [];
    } catch {
      return [];
    }
  });
}

#!/usr/bin/env tsx
/**
 * Script to replace console.log/error/warn with structured logger
 * Run: tsx scripts/replace-console-logs.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { glob } from "glob";
import { join } from "path";

const files = [
  ...glob.sync("app/**/*.{ts,tsx}"),
  ...glob.sync("components/**/*.{ts,tsx}"),
].filter((f) => !f.includes("node_modules"));

let replaced = 0;

for (const file of files) {
  let content = readFileSync(file, "utf-8");
  const originalContent = content;
  
  // Skip if already has logger import
  if (content.includes("from \"@/lib/logging/structured-logger\"")) {
    continue;
  }

  // Add logger import if file has console statements
  if (content.match(/console\.(log|error|warn|info|debug)/)) {
    // Determine if it's a client or server component
    const isClient = content.includes('"use client"');
    const isServer = content.includes('"use server"') || file.includes("/api/");
    
    // Add import after other imports
    const importMatch = content.match(/(import .+ from .+;\n)+/);
    if (importMatch) {
      const lastImport = importMatch[0].split("\n").filter(Boolean).pop();
      if (lastImport) {
        const importIndex = content.indexOf(lastImport) + lastImport.length;
        content = 
          content.slice(0, importIndex) +
          "\nimport { logger } from \"@/lib/logging/structured-logger\";" +
          content.slice(importIndex);
      }
    }

    // Replace console.error with logger.error
    content = content.replace(
      /console\.error\((["'`])([^"'`]+)\1\s*,\s*(error|err)\)/g,
      (match, quote, message, errorVar) => {
        return `logger.error(${quote}${message}${quote}, ${errorVar} instanceof Error ? ${errorVar} : new Error(String(${errorVar})), { component: "${file.split("/").pop()?.replace(/\.(ts|tsx)$/, "") || "Unknown"}", action: "unknown" })`;
      }
    );

    // Replace console.error with just message
    content = content.replace(
      /console\.error\((["'`])([^"'`]+)\1\)/g,
      (match, quote, message) => {
        return `logger.error(${quote}${message}${quote}, undefined, { component: "${file.split("/").pop()?.replace(/\.(ts|tsx)$/, "") || "Unknown"}", action: "unknown" })`;
      }
    );

    // Replace console.warn
    content = content.replace(
      /console\.warn\((["'`])([^"'`]+)\1\s*,\s*(.+?)\)/g,
      (match, quote, message, context) => {
        return `logger.warn(${quote}${message}${quote}, { component: "${file.split("/").pop()?.replace(/\.(ts|tsx)$/, "") || "Unknown"}", ...${context} })`;
      }
    );

    content = content.replace(
      /console\.warn\((["'`])([^"'`]+)\1\)/g,
      (match, quote, message) => {
        return `logger.warn(${quote}${message}${quote}, { component: "${file.split("/").pop()?.replace(/\.(ts|tsx)$/, "") || "Unknown"}" })`;
      }
    );

    // Replace console.log (less critical, but still good to replace)
    content = content.replace(
      /console\.log\((["'`])([^"'`]+)\1\s*,\s*(.+?)\)/g,
      (match, quote, message, context) => {
        return `logger.info(${quote}${message}${quote}, { component: "${file.split("/").pop()?.replace(/\.(ts|tsx)$/, "") || "Unknown"}", ...${context} })`;
      }
    );

    // Replace .catch(console.error)
    content = content.replace(/\.catch\(console\.error\)/g, (match) => {
      return `.catch((err) => logger.error("Unhandled error", err instanceof Error ? err : new Error(String(err)), { component: "${file.split("/").pop()?.replace(/\.(ts|tsx)$/, "") || "Unknown"}" }))`;
    });

    if (content !== originalContent) {
      writeFileSync(file, content, "utf-8");
      replaced++;
      console.log(`Updated: ${file}`);
    }
  }
}

console.log(`\nReplaced console statements in ${replaced} files`);

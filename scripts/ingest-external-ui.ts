#!/usr/bin/env ts-node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const getArg = (k: string, d?: string) => {
  const i = args.findIndex((a) => a === k);
  return i >= 0 ? args[i + 1] : d;
};
const SRC = getArg("--src", "./external-dump");
const DEST = getArg("--dest", "./components/external");

if (!SRC || !fs.existsSync(SRC)) {
  console.error("❌ Source path missing:", SRC);
  process.exit(1);
}
if (!DEST) {
  console.error("❌ Destination path missing");
  process.exit(1);
}
fs.mkdirSync(DEST, { recursive: true });

function toPascal(s: string) {
  return s
    .replace(/[\W_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
}

function convertHtmlToComponent(filePath: string) {
  if (!DEST) {throw new Error('DEST is not set');}
  const raw = fs.readFileSync(filePath, "utf8");
  const name = toPascal(path.basename(filePath, path.extname(filePath)));
  // naive sanitation; Cursor to refine with codemods if needed
  const jsx = raw
    .replace(/class=/g, "className=")
    .replace(/for=/g, "htmlFor=")
    .replace(/<\/img>/g, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "");
  const out = `/* Auto-imported from external builder */
"use client";
import React from "react";
export default function ${name}(){ 
  return (<div suppressHydrationWarning>${jsx}</div>);
}
`;
  fs.writeFileSync(path.join(DEST, `${name}.tsx`), out, "utf8");
  return name;
}

function processDir(dir: string) {
  if (!DEST) {throw new Error('DEST is not set');}
  const report: string[] = [];
  for (const f of fs.readdirSync(dir)) {
    if (typeof f !== 'string') {continue;}
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      processDir(p);
    } else if (/\.(html|htm)$/i.test(f)) {
      const name = convertHtmlToComponent(p);
      report.push(`Component: ${name} <- ${p}`);
    } else if (/\.svg$/i.test(f)) {
      const out = path.join(DEST, path.basename(f));
      try {
        execSync(`npx svgo -i "${p}" -o "${out}"`, { stdio: "inherit" });
        execSync(`npx @svgr/cli "${out}" --out-dir "${DEST}" --ext tsx`, { stdio: "inherit" });
      } catch (e) {
        console.warn(`Failed to process SVG ${p}:`, e);
      }
    } else if (/\.css$/i.test(f)) {
      // Place CSS as module; Cursor can refactor to Tailwind tokens as needed
      const out = path.join(DEST, path.basename(f).replace(".css", ".module.css"));
      fs.copyFileSync(p, out);
    } else {
      const out = path.join(DEST, path.basename(f));
      fs.copyFileSync(p, out);
    }
  }
  return report;
}

const report = processDir(SRC);
fs.writeFileSync(path.join(DEST, "_import-report.txt"), report.join("\n"), "utf8");
console.log("✅ External UI ingest complete.\n", report.join("\n"));

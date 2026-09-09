"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Download,
  FileJson,
  Gauge,
  ShieldCheck,
} from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/section-primitives";
import {
  architectureSvg,
  downloadArchitecturePng,
  downloadPdf,
  downloadText,
} from "@/lib/client/artifact-export";

const sampleSchema = z
  .object({
    requestId: z.string().uuid(),
    confidence: z.number().min(0).max(1),
    decision: z.enum(["approve", "review", "reject"]),
  })
  .strict();

const DEFAULT_PAYLOAD = `{
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "confidence": 0.91,
  "decision": "review"
}`;

const DEFAULT_PROMPT = "Approve invoice 1042 for $950 and notify finance.";
const DEFAULT_RULE =
  "IF amount <= 1000 AND confidence >= 0.90 THEN approve ELSE human_review";

export function AdvancedEngineLab() {
  const [payload, setPayload] = useState(DEFAULT_PAYLOAD);
  const [schemaResult, setSchemaResult] = useState("Not evaluated");
  const [nodes, setNodes] = useState([
    "Typed intake",
    "Model",
    "Policy gate",
    "Audit ledger",
  ]);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [rule, setRule] = useState(DEFAULT_RULE);
  const [diffMode, setDiffMode] = useState<"split" | "unified">("split");
  const [tokens, setTokens] = useState(8_000);
  const [throughput, setThroughput] = useState(55);
  const [pipeda, setPipeda] = useState([true, true, false, true, false]);
  const [grade, setGrade] = useState("Not graded");

  const latency = useMemo(
    () => Math.round(250 + (tokens / Math.max(throughput, 1)) * 1_000),
    [tokens, throughput],
  );
  const promptTerms = useMemo(
    () => new Set(prompt.toLowerCase().split(/\W+/).filter(Boolean)),
    [prompt],
  );
  const ruleTerms = useMemo(
    () => new Set(rule.toLowerCase().split(/\W+/).filter(Boolean)),
    [rule],
  );
  const overlap = useMemo(
    () => [...promptTerms].filter((term) => ruleTerms.has(term)),
    [promptTerms, ruleTerms],
  );

  const validatePayload = () => {
    try {
      const parsed: unknown = JSON.parse(payload);
      const result = sampleSchema.safeParse(parsed);
      setSchemaResult(
        result.success
          ? "VALID · strict Zod contract passed"
          : `INVALID · ${result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ")}`,
      );
    } catch {
      setSchemaResult("INVALID · malformed JSON");
    }
  };

  const moveNode = (index: number, offset: -1 | 1) => {
    const destination = index + offset;
    if (destination < 0 || destination >= nodes.length) return;
    setNodes((current) => {
      const next = [...current];
      [next[index], next[destination]] = [next[destination]!, next[index]!];
      return next;
    });
  };

  const gradePipeda = () => {
    const worker = new Worker("/workers/analysis-worker.js");
    worker.onmessage = (
      event: MessageEvent<{ score: number; grade: string }>,
    ) => {
      setGrade(`${event.data.grade} · ${event.data.score}%`);
      worker.terminate();
    };
    worker.onerror = () => {
      setGrade("Worker unavailable");
      worker.terminate();
    };
    worker.postMessage({ type: "pipeda-grade", checks: pipeda });
  };

  return (
    <section aria-labelledby="engine-lab-title" className="space-y-6">
      <div>
        <p className="font-mono text-xs font-black uppercase tracking-widest text-primary">
          Advanced browser engines
        </p>
        <h2
          className="mt-1 font-mono text-2xl font-black uppercase"
          id="engine-lab-title"
        >
          Deterministic systems lab
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          All calculations, validation, rendering, and exports run locally.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <SurfaceCard className="border-2 border-border">
          <h3 className="font-mono text-sm font-black uppercase">
            <FileJson className="mr-2 inline h-4 w-4 text-primary" />
            Live Zod validator
          </h3>
          <p className="mt-2 text-xs text-muted-foreground">
            Contract: UUID requestId, confidence 0–1, decision
            approve/review/reject; unknown keys rejected.
          </p>
          <textarea
            className="mt-3 min-h-40 w-full border-2 border-border bg-background p-3 font-mono text-xs"
            maxLength={10_000}
            onChange={(event) => setPayload(event.target.value)}
            value={payload}
          />
          <Button className="mt-3" onClick={validatePayload}>
            Validate payload
          </Button>
          <output
            className="mt-3 block border border-border p-3 font-mono text-xs"
            aria-live="polite"
          >
            {schemaResult}
          </output>
        </SurfaceCard>

        <SurfaceCard className="border-2 border-border">
          <h3 className="font-mono text-sm font-black uppercase">
            Architecture flow + export
          </h3>
          <ol className="mt-3 space-y-2">
            {nodes.map((node, index) => (
              <li
                className="flex items-center justify-between border-2 border-border p-2 font-mono text-xs"
                key={node}
              >
                <span>
                  {index + 1}. {node}
                </span>
                <span>
                  <Button
                    aria-label={`Move ${node} up`}
                    disabled={index === 0}
                    onClick={() => moveNode(index, -1)}
                    size="sm"
                    variant="ghost"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    aria-label={`Move ${node} down`}
                    disabled={index === nodes.length - 1}
                    onClick={() => moveNode(index, 1)}
                    size="sm"
                    variant="ghost"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </span>
              </li>
            ))}
          </ol>
          <div
            className="mt-4 overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: architectureSvg(nodes) }}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              onClick={() =>
                downloadText(
                  "aias-architecture.svg",
                  architectureSvg(nodes),
                  "image/svg+xml",
                )
              }
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              SVG
            </Button>
            <Button
              onClick={() => {
                downloadArchitecturePng(nodes).catch(() =>
                  setSchemaResult("PNG export unavailable"),
                );
              }}
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              PNG
            </Button>
          </div>
        </SurfaceCard>

        <SurfaceCard className="border-2 border-border">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-mono text-sm font-black uppercase">
              Prompt vs deterministic diff
            </h3>
            <Button
              onClick={() =>
                setDiffMode((mode) => (mode === "split" ? "unified" : "split"))
              }
              size="sm"
              variant="outline"
            >
              {diffMode} view
            </Button>
          </div>
          <div
            className={`mt-3 grid gap-3 ${diffMode === "split" ? "sm:grid-cols-2" : "grid-cols-1"}`}
          >
            <textarea
              aria-label="AI prompt"
              className="min-h-32 border-2 border-border bg-background p-3 font-mono text-xs"
              maxLength={5_000}
              onChange={(event) => setPrompt(event.target.value)}
              value={prompt}
            />
            <textarea
              aria-label="Deterministic policy"
              className="min-h-32 border-2 border-border bg-background p-3 font-mono text-xs"
              maxLength={5_000}
              onChange={(event) => setRule(event.target.value)}
              value={rule}
            />
          </div>
          <p className="mt-3 font-mono text-xs">
            Shared terms: {overlap.join(", ") || "none"}
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              onClick={() =>
                downloadPdf(
                  "aias-policy-brief.pdf",
                  "AIAS Policy Brief",
                  `PROMPT\n${prompt}\n\nDETERMINISTIC RULE\n${rule}`,
                )
              }
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Generate PDF
            </Button>
            <Button asChild variant="outline">
              <Link href="/tools/policy-studio">Open gate builder</Link>
            </Button>
          </div>
        </SurfaceCard>

        <SurfaceCard className="border-2 border-border">
          <h3 className="font-mono text-sm font-black uppercase">
            <Gauge className="mr-2 inline h-4 w-4 text-primary" />
            Model context + latency
          </h3>
          <label
            className="mt-4 block text-xs font-bold"
            htmlFor="context-tokens"
          >
            Context tokens: {tokens.toLocaleString()}
          </label>
          <input
            className="w-full accent-primary"
            id="context-tokens"
            min={1_000}
            max={128_000}
            step={1_000}
            onChange={(event) => setTokens(Number(event.target.value))}
            type="range"
            value={tokens}
          />
          <label className="mt-3 block text-xs font-bold" htmlFor="throughput">
            Throughput: {throughput} tokens/sec
          </label>
          <input
            className="w-full accent-primary"
            id="throughput"
            min={10}
            max={250}
            onChange={(event) => setThroughput(Number(event.target.value))}
            type="range"
            value={throughput}
          />
          <output className="mt-4 block border-2 border-primary bg-primary/10 p-4 font-mono text-2xl font-black">
            ~{(latency / 1_000).toFixed(1)}s
          </output>
        </SurfaceCard>

        <SurfaceCard className="border-2 border-border lg:col-span-2">
          <h3 className="font-mono text-sm font-black uppercase">
            <ShieldCheck className="mr-2 inline h-4 w-4 text-primary" />
            PIPEDA readiness grader
          </h3>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {[
              "Documented consent purpose",
              "Data minimization",
              "Canadian residency boundary",
              "Retention/deletion schedule",
              "Breach response owner",
            ].map((label, index) => (
              <label
                className="flex min-h-11 items-center gap-3 border-2 border-border p-3 text-sm"
                key={label}
              >
                <input
                  checked={pipeda[index]}
                  onChange={(event) =>
                    setPipeda((current) =>
                      current.map((value, itemIndex) =>
                        itemIndex === index ? event.target.checked : value,
                      ),
                    )
                  }
                  type="checkbox"
                />
                {label}
              </label>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={gradePipeda}>Grade in Web Worker</Button>
            <output
              aria-live="polite"
              className="font-mono text-lg font-black text-primary"
            >
              {grade}
            </output>
          </div>
        </SurfaceCard>
      </div>
    </section>
  );
}

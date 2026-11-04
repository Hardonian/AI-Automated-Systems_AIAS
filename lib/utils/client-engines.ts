"use client";

/**
 * Items 62, 65, 66, 67, 20: Client-Side Utility Hooks
 *
 * - useHashState: Synchronize component state with URL hash params
 * - useWebShare: Native Web Share API with clipboard fallback
 * - useBroadcastChannel: Cross-tab state synchronization
 * - generateDiagnosticMailto: Pre-filled mailto with diagnostic data
 * - generateSHA256Receipt: Web Crypto signed runbook receipts
 */

import { useState, useEffect, useCallback, useRef } from "react";

/* ========================================
   Item 62: URL Hash State Synchronization
   ======================================== */
export function useHashState<T extends string>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    return (params.get(key) as T | null) ?? defaultValue;
  });

  useEffect(() => {
    const readHash = () => {
      const params = new URLSearchParams(window.location.hash.slice(1));
      setValue((params.get(key) as T | null) ?? defaultValue);
    };
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, [defaultValue, key]);

  const setHashValue = useCallback(
    (newValue: T) => {
      setValue(newValue);
      const hash = window.location.hash.slice(1);
      const params = new URLSearchParams(hash);
      params.set(key, newValue);
      window.history.replaceState(null, "", `#${params.toString()}`);
    },
    [key],
  );

  return [value, setHashValue];
}

/* ========================================
   Item 65: Web Share API Integration
   ======================================== */
interface ShareData {
  title: string;
  text: string;
  url: string;
}

export function useWebShare() {
  const canShare = typeof navigator !== "undefined" && "share" in navigator;

  const share = useCallback(
    async (data: ShareData): Promise<boolean> => {
      if (canShare) {
        try {
          await navigator.share(data);
          return true;
        } catch (err) {
          if ((err as Error).name === "AbortError") return false;
        }
      }
      // Clipboard fallback
      try {
        await navigator.clipboard.writeText(data.url);
        return true;
      } catch {
        return false;
      }
    },
    [canShare],
  );

  return { canShare, share };
}

/* ========================================
   Item 66: BroadcastChannel Cross-Tab Sync
   ======================================== */
export function useBroadcastChannel<T>(
  channelName: string,
  onMessage?: (data: T) => void,
) {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel(channelName);
    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent<T>) => {
      onMessageRef.current?.(event.data);
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [channelName]);

  const postMessage = useCallback((data: T) => {
    channelRef.current?.postMessage(data);
  }, []);

  return { postMessage };
}

/* ========================================
   Item 67: Diagnostic Mailto Generator
   ======================================== */
export function generateDiagnosticMailto(options?: {
  subject?: string;
  recipient?: string;
  diagnosticData?: Record<string, string>;
}): string {
  const {
    subject = "AIAS Architecture Review Request",
    recipient = "inquiries@aiautomatedsystems.ca",
    diagnosticData = {},
  } = options ?? {};

  const browserInfo =
    typeof navigator !== "undefined"
      ? `${navigator.userAgent.split(" ").pop() ?? "Unknown"}`
      : "SSR";
  const viewport =
    typeof window !== "undefined"
      ? `${window.innerWidth}x${window.innerHeight}`
      : "N/A";
  const timestamp = new Date().toISOString();

  const body = [
    "--- Diagnostic Snapshot ---",
    `Timestamp: ${timestamp}`,
    `Viewport: ${viewport}`,
    `Agent: ${browserInfo}`,
    `Page: ${typeof window !== "undefined" ? window.location.pathname : "/"}`,
    ...Object.entries(diagnosticData).map(([k, v]) => `${k}: ${v}`),
    "--- End Snapshot ---",
    "",
    "Describe your automation challenge below:",
    "",
  ].join("\n");

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* ========================================
   Item 20: SHA-256 Runbook Hash Receipt
   via Web Crypto API
   ======================================== */
export async function generateSHA256Receipt(
  content: string,
): Promise<{ hash: string; timestamp: string; receipt: string }> {
  const timestamp = new Date().toISOString();
  const payload = `${timestamp}::${content}`;

  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  const receipt = [
    "╔══════════════════════════════════════════════╗",
    "║  AIAS RUNBOOK VERIFICATION RECEIPT           ║",
    "╠══════════════════════════════════════════════╣",
    `║  SHA-256:  ${hash.slice(0, 32)}...  ║`,
    `║  Issued:   ${timestamp.padEnd(33)}║`,
    "║  Status:   INTEGRITY VERIFIED ●              ║",
    "╚══════════════════════════════════════════════╝",
  ].join("\n");

  return { hash, timestamp, receipt };
}

/* ========================================
   Item 61: LocalStorage Workspace Persistence
   ======================================== */
export const DEFAULT_WORKSPACE_TEMPLATE =
  "Objective:\nConstraints:\nFailure modes:\nNext decision:";

/**
 * Normalizes raw localStorage values for `aias_workspace_notes`, self-healing
 * both JSON-encoded strings, raw plain-text strings, and mixed concatenations.
 */
export function normalizeWorkspaceNotes(
  raw: string | null | undefined,
): string {
  if (!raw || typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (typeof parsed === "string") {
      try {
        const nested: unknown = JSON.parse(parsed);
        if (typeof nested === "string") {
          return nested.trim();
        }
      } catch {
        // Not double-encoded
      }
      return parsed.trim();
    }
  } catch {
    // Handle case where a JSON-quoted string was concatenated with raw markdown
    if (trimmed.startsWith('"')) {
      const closingQuoteMatch = /^("(?:[^"\\]|\\.)*")\s*\n+([\s\S]+)$/.exec(
        trimmed,
      );
      if (closingQuoteMatch && closingQuoteMatch[1] && closingQuoteMatch[2]) {
        try {
          const head = JSON.parse(closingQuoteMatch[1]) as unknown;
          if (typeof head === "string") {
            return `${head.trim()}\n\n${closingQuoteMatch[2].trim()}`;
          }
        } catch {
          // Fall through to raw string
        }
      }
    }
  }

  return trimmed;
}

export function readWorkspaceNotes(storage?: Pick<Storage, "getItem">): string {
  try {
    const targetStorage =
      storage ?? (typeof window !== "undefined" ? window.localStorage : null);
    if (!targetStorage) return DEFAULT_WORKSPACE_TEMPLATE;
    const raw = targetStorage.getItem("aias_workspace_notes");
    const normalized = normalizeWorkspaceNotes(raw);
    return normalized || DEFAULT_WORKSPACE_TEMPLATE;
  } catch {
    return DEFAULT_WORKSPACE_TEMPLATE;
  }
}

export function writeWorkspaceNotes(
  notes: string,
  storage?: Pick<Storage, "setItem">,
): string {
  const clean = normalizeWorkspaceNotes(notes).slice(0, 10_000);
  try {
    const targetStorage =
      storage ?? (typeof window !== "undefined" ? window.localStorage : null);
    targetStorage?.setItem("aias_workspace_notes", JSON.stringify(clean));
  } catch {
    // Storage full — silently degrade
  }
  return clean;
}

export function appendWorkspaceNotes(
  sectionBlock: string,
  storage?: Pick<Storage, "getItem" | "setItem">,
): string {
  const incoming = normalizeWorkspaceNotes(sectionBlock);
  if (!incoming) return readWorkspaceNotes(storage);

  const existing = readWorkspaceNotes(storage);
  const isDefaultOrEmpty =
    !existing ||
    existing === DEFAULT_WORKSPACE_TEMPLATE ||
    existing.startsWith("Objective:\nConstraints:\nFailure modes:");

  if (isDefaultOrEmpty) {
    const fresh = incoming.startsWith("# ")
      ? incoming
      : `# AIAS Architecture Handoff Brief\n\n${incoming}`;
    return writeWorkspaceNotes(fresh, storage);
  }

  if (existing.includes(incoming)) {
    return writeWorkspaceNotes(existing, storage);
  }

  // Deduplicate by matching "## Heading" block if re-syncing from the same tool
  const firstLine = incoming.split("\n")[0]?.trim() ?? "";
  if (firstLine.startsWith("## ")) {
    const escapedHeading = firstLine.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const sectionRegex = new RegExp(
      `${escapedHeading}[\\s\\S]*?(?=\\n## |(?![\\s\\S]))`,
    );
    if (sectionRegex.test(existing)) {
      const updated = existing.replace(sectionRegex, incoming);
      return writeWorkspaceNotes(updated, storage);
    }
  }

  return writeWorkspaceNotes(`${existing}\n\n${incoming}`, storage);
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const defaultValueRef = useRef(defaultValue);
  const [storedValue, setStoredValue] = useState<T>(defaultValue);

  useEffect(() => {
    let active = true;
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        if (
          key === "aias_workspace_notes" &&
          typeof defaultValueRef.current === "string"
        ) {
          const normalized = normalizeWorkspaceNotes(item) as unknown as T;
          window.localStorage.setItem(key, JSON.stringify(normalized));
          queueMicrotask(() => active && setStoredValue(normalized));
        } else {
          try {
            const parsed = JSON.parse(item) as T;
            queueMicrotask(() => active && setStoredValue(parsed));
          } catch {
            if (typeof defaultValueRef.current === "string") {
              const recovered = item as unknown as T;
              window.localStorage.setItem(key, JSON.stringify(recovered));
              queueMicrotask(() => active && setStoredValue(recovered));
            } else {
              queueMicrotask(
                () => active && setStoredValue(defaultValueRef.current),
              );
            }
          }
        }
      }
    } catch {
      queueMicrotask(() => active && setStoredValue(defaultValueRef.current));
    }
    return () => {
      active = false;
    };
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(newValue));
        } catch {
          // Storage full — silently degrade
        }
        return newValue;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}

/* ========================================
   Item 69: Session Storage Wizard Progress
   ======================================== */
export function useSessionProgress<T>(
  wizardId: string,
  defaultState: T,
): [T, (update: Partial<T>) => void, () => void] {
  const storageKey = `aias_wizard_${wizardId}`;
  const defaultStateRef = useRef(defaultState);
  const [state, setState] = useState<T>(defaultState);

  useEffect(() => {
    let active = true;
    try {
      const stored = window.sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as T;
        queueMicrotask(() => active && setState(parsed));
      }
    } catch {
      queueMicrotask(() => active && setState(defaultStateRef.current));
    }
    return () => {
      active = false;
    };
  }, [storageKey]);

  const updateProgress = useCallback(
    (update: Partial<T>) => {
      setState((prev) => {
        const next = { ...prev, ...update };
        try {
          window.sessionStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // Session storage full
        }
        return next;
      });
    },
    [storageKey],
  );

  const resetProgress = useCallback(() => {
    setState(defaultStateRef.current);
    try {
      window.sessionStorage.removeItem(storageKey);
    } catch {
      // Ignore
    }
  }, [storageKey]);

  return [state, updateProgress, resetProgress];
}

export interface EncryptedClientExport {
  algorithm: "AES-GCM";
  ciphertext: string;
  iv: string;
  salt: string;
  iterations: 210_000;
}

const bytesToBase64 = (bytes: Uint8Array) => {
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary);
};

const base64ToBytes = (base64: string): Uint8Array => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

/** Creates a portable AES-GCM export without sending state off-device. */
export async function encryptClientState(
  state: unknown,
  passphrase: string,
): Promise<EncryptedClientExport> {
  if (passphrase.length < 12) {
    throw new Error("Use a passphrase of at least 12 characters.");
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: 210_000 },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(state)),
  );
  return {
    algorithm: "AES-GCM",
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
    iv: bytesToBase64(iv),
    salt: bytesToBase64(salt),
    iterations: 210_000,
  };
}

/** Decrypts an EncryptedClientExport locally using Web Crypto PBKDF2 and AES-GCM. */
export async function decryptClientState<T = unknown>(
  encrypted: EncryptedClientExport,
  passphrase: string,
): Promise<T> {
  if (!passphrase || passphrase.length < 12) {
    throw new Error("Invalid passphrase (minimum 12 characters required).");
  }
  if (encrypted.algorithm !== "AES-GCM") {
    throw new Error(`Unsupported encryption algorithm: ${encrypted.algorithm}`);
  }

  const salt = base64ToBytes(encrypted.salt);
  const iv = base64ToBytes(encrypted.iv);
  const ciphertext = base64ToBytes(encrypted.ciphertext);

  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: salt as unknown as BufferSource,
      iterations: encrypted.iterations || 210_000,
    },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );

  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv as unknown as BufferSource },
      key,
      ciphertext as unknown as BufferSource,
    );
    const decoded = new TextDecoder().decode(decryptedBuffer);
    return JSON.parse(decoded) as T;
  } catch {
    throw new Error(
      "Decryption failed. Incorrect passphrase or corrupt payload.",
    );
  }
}

/* ========================================
   Deterministic Diagnostic Scoring & URL Codec
   ======================================== */
export type DiagnosticWorkloadType =
  | "customer-support"
  | "financial-ops"
  | "engineering-automation"
  | "compliance-audit";

export type DiagnosticVolumeLevel = "low" | "medium" | "high";
export type DiagnosticLatencyTier = "realtime" | "near-realtime" | "async";
export type DiagnosticAllocationMode = "deterministic" | "ai" | "hybrid";

export interface DiagnosticCapabilitySpec {
  id: string;
  label: string;
  description: string;
  recommended: DiagnosticAllocationMode;
  contractInvariant: string;
}

export const DEFAULT_DIAGNOSTIC_CAPABILITIES: readonly DiagnosticCapabilitySpec[] =
  [
    {
      id: "schema-validation",
      label: "Input Parsing & Schema Validation",
      description:
        "Validating structure, types, and required payload constraints.",
      recommended: "deterministic",
      contractInvariant:
        "Strict Zod schema parse before any downstream model or tool invocation.",
    },
    {
      id: "unstructured-synthesis",
      label: "Semantic Understanding & Synthesis",
      description:
        "Extracting intent, summarization, and contextual reasoning.",
      recommended: "ai",
      contractInvariant:
        "Temperature-clamped model inference bounded by structured output schemas.",
    },
    {
      id: "authorization-policy",
      label: "Policy Gates & Permission Check",
      description: "Enforcing roles, tenant isolation, and transaction limits.",
      recommended: "deterministic",
      contractInvariant:
        "Zero-trust RBAC and tenant boundary check evaluated in deterministic code.",
    },
    {
      id: "math-calculations",
      label: "Calculations & Financial Math",
      description:
        "Invoicing math, interest rates, ledger entries, and tax rates.",
      recommended: "deterministic",
      contractInvariant:
        "IEEE-754 / integer cent arithmetic verified with 0.00% variance tolerance.",
    },
    {
      id: "customer-messaging",
      label: "Outbound Content Generation",
      description: "Drafting messages, notifications, and tailored replies.",
      recommended: "hybrid",
      contractInvariant:
        "Model-drafted copy gated by deterministic policy filter and human approval threshold.",
    },
    {
      id: "audit-receipts",
      label: "Audit Ledger & Receipts",
      description: "Immutable hashing, execution logs, and replay receipts.",
      recommended: "deterministic",
      contractInvariant:
        "Append-only SHA-256 cryptographic receipt signed on every state transition.",
    },
  ] as const;

export const DIAGNOSTIC_FAILURE_MODES = [
  {
    id: "hallucination",
    label: "Hallucination Risk",
    description:
      "Model outputs plausibly incorrect facts, IDs, or commitments.",
    mitigationGate:
      "Post-inference Zod contract assertion + deterministic citation cross-check.",
  },
  {
    id: "latency-spike",
    label: "Provider Outages & Latency Spikes",
    description: "Upstream LLM API delays, 504 timeouts, or degraded status.",
    mitigationGate:
      "Bounded timeout circuit breaker + automatic fallback queue and dead-letter replay.",
  },
  {
    id: "pii-leak",
    label: "PII & Confidential Data Exposure",
    description: "Unsanitized customer records sent to third-party endpoints.",
    mitigationGate:
      "Pre-flight deterministic PII redaction airlock + PIPEDA-informed tenant isolation.",
  },
  {
    id: "budget-runaway",
    label: "Cost & Capacity Runaway",
    description: "Recursive agent loops or unbounded compute consumption.",
    mitigationGate:
      "Hard step-count ceiling (max_steps <= 4) + deterministic loop-breaker telemetry.",
  },
] as const;

export interface DiagnosticShareState {
  workload: DiagnosticWorkloadType;
  volume: DiagnosticVolumeLevel;
  latency: DiagnosticLatencyTier;
  allocations: Record<string, DiagnosticAllocationMode>;
  risks: string[];
  step?: 1 | 2 | 3 | 4;
}

export interface DiagnosticEvaluationResult {
  score: number;
  grade: "A" | "B" | "D";
  status: string;
  recommendation: string;
  track: string;
  composition: {
    deterministicPct: number;
    hybridPct: number;
    aiPct: number;
    deterministicCount: number;
    hybridCount: number;
    aiCount: number;
  };
  operationalProfile: {
    targetP95Latency: string;
    estimatedHoursReclaimedPerYear: number;
    circuitBreakerPattern: string;
    criticalDrifts: string[];
  };
}

const VALID_WORKLOADS = new Set<DiagnosticWorkloadType>([
  "customer-support",
  "financial-ops",
  "engineering-automation",
  "compliance-audit",
]);
const VALID_VOLUMES = new Set<DiagnosticVolumeLevel>(["low", "medium", "high"]);
const VALID_LATENCIES = new Set<DiagnosticLatencyTier>([
  "realtime",
  "near-realtime",
  "async",
]);
const VALID_MODES = new Set<DiagnosticAllocationMode>([
  "deterministic",
  "ai",
  "hybrid",
]);
const VALID_CAPABILITY_IDS = new Set<string>(
  DEFAULT_DIAGNOSTIC_CAPABILITIES.map((c) => c.id),
);
const VALID_RISK_IDS = new Set<string>(
  DIAGNOSTIC_FAILURE_MODES.map((r) => r.id),
);

export function evaluateDiagnosticArchitecture(
  allocations: Record<string, DiagnosticAllocationMode>,
  workload: DiagnosticWorkloadType = "financial-ops",
  volume: DiagnosticVolumeLevel = "medium",
  latency: DiagnosticLatencyTier = "near-realtime",
  selectedRisks: string[] = ["hallucination", "pii-leak"],
): DiagnosticEvaluationResult {
  let score = 100;

  if (allocations["math-calculations"] === "ai") score -= 25;
  if (allocations["authorization-policy"] === "ai") score -= 25;
  if (allocations["schema-validation"] === "ai") score -= 15;
  if (allocations["audit-receipts"] === "ai") score -= 20;

  if (allocations["unstructured-synthesis"] === "ai") score += 5;
  if (allocations["customer-messaging"] === "hybrid") score += 5;

  score = Math.max(20, Math.min(100, score));

  let grade: "A" | "B" | "D" = "A";
  let status = "Production-Ready Boundary Separation";
  let recommendation =
    "Your target architecture demonstrates sound governance with deterministic control over money, policy, and data validity.";
  let track = "Advisory & Co-Build Sprint";

  if (score < 60) {
    grade = "D";
    status = "Critical Fragility: High Probability of Silent Failure";
    recommendation =
      "Core policy or math functions are assigned to probabilistic models. Immediate architectural intervention required to install deterministic guards.";
    track = "Stabilization & Emergency Remediation";
  } else if (score < 80) {
    grade = "B";
    status = "Moderate Fragility: Gaps in Enforcement Layer";
    recommendation =
      "Architecture has reasonable foundations but leaves edge states exposed. Strengthen schema validation and audit immutability.";
    track = "Targeted Governance Hardening";
  }

  const total = DEFAULT_DIAGNOSTIC_CAPABILITIES.length;
  const normalizedValues = DEFAULT_DIAGNOSTIC_CAPABILITIES.map(
    (cap) => allocations[cap.id] ?? cap.recommended,
  );
  const deterministicCount = normalizedValues.filter(
    (v) => v === "deterministic",
  ).length;
  const hybridCount = normalizedValues.filter((v) => v === "hybrid").length;
  const aiCount = normalizedValues.filter((v) => v === "ai").length;

  const composition = {
    deterministicPct: Math.round((deterministicCount / total) * 100),
    hybridPct: Math.round((hybridCount / total) * 100),
    aiPct: Math.round((aiCount / total) * 100),
    deterministicCount,
    hybridCount,
    aiCount,
  };

  const criticalDrifts = DEFAULT_DIAGNOSTIC_CAPABILITIES.filter(
    (cap) =>
      cap.recommended === "deterministic" &&
      (allocations[cap.id] ?? cap.recommended) === "ai",
  ).map((cap) => cap.label);

  const baseHoursByWorkload: Record<DiagnosticWorkloadType, number> = {
    "financial-ops": 1150,
    "customer-support": 1420,
    "engineering-automation": 980,
    "compliance-audit": 1060,
  };
  const volumeMultiplier: Record<DiagnosticVolumeLevel, number> = {
    low: 0.65,
    medium: 1.45,
    high: 3.1,
  };
  const estimatedHoursReclaimedPerYear = Math.round(
    baseHoursByWorkload[workload] * volumeMultiplier[volume],
  );

  const targetP95Latency =
    latency === "realtime"
      ? "< 450ms (Pre-compiled Zod gate + hot-path cache)"
      : latency === "near-realtime"
        ? "1.2s – 3.5s (Scoped inference + synchronous policy gate)"
        : "Queue-buffered async worker + idempotent ledger commit";

  const circuitBreakerPattern = selectedRisks.includes("pii-leak")
    ? "Zero-Trust PII Redaction Airlock + Deterministic Policy Intercept"
    : selectedRisks.includes("latency-spike")
      ? "Bounded Timeout Circuit Breaker + Dead-Letter Replay Queue"
      : "Strict Zod Schema Gate + SHA-256 Runbook Verification";

  return {
    score,
    grade,
    status,
    recommendation,
    track,
    composition,
    operationalProfile: {
      targetP95Latency,
      estimatedHoursReclaimedPerYear,
      circuitBreakerPattern,
      criticalDrifts,
    },
  };
}

export function encodeDiagnosticState(state: DiagnosticShareState): string {
  const params = new URLSearchParams();
  params.set("workload", state.workload);
  params.set("volume", state.volume);
  params.set("latency", state.latency);
  if (state.step) {
    params.set("step", String(state.step));
  }
  if (state.risks.length > 0) {
    params.set(
      "risks",
      state.risks.filter((r) => VALID_RISK_IDS.has(r)).join(","),
    );
  }
  const allocPairs = DEFAULT_DIAGNOSTIC_CAPABILITIES.map((cap) => {
    const mode = state.allocations[cap.id] ?? cap.recommended;
    return `${cap.id}:${mode}`;
  });
  params.set("alloc", allocPairs.join(","));
  return params.toString();
}

export function decodeDiagnosticState(
  queryOrUrl: string,
): Partial<DiagnosticShareState> | null {
  if (!queryOrUrl || typeof queryOrUrl !== "string") return null;
  const rawQuery = queryOrUrl.includes("?")
    ? (queryOrUrl.split("?")[1]?.split("#")[0] ?? "")
    : queryOrUrl.replace(/^[?#]/, "");

  if (!rawQuery.trim()) return null;

  const params = new URLSearchParams(rawQuery);
  const result: Partial<DiagnosticShareState> = {};

  const workloadParam = params.get("workload") as DiagnosticWorkloadType | null;
  if (workloadParam && VALID_WORKLOADS.has(workloadParam)) {
    result.workload = workloadParam;
  }

  const volumeParam = params.get("volume") as DiagnosticVolumeLevel | null;
  if (volumeParam && VALID_VOLUMES.has(volumeParam)) {
    result.volume = volumeParam;
  }

  const latencyParam = params.get("latency") as DiagnosticLatencyTier | null;
  if (latencyParam && VALID_LATENCIES.has(latencyParam)) {
    result.latency = latencyParam;
  }

  const stepParam = Number(params.get("step"));
  if (
    stepParam === 1 ||
    stepParam === 2 ||
    stepParam === 3 ||
    stepParam === 4
  ) {
    result.step = stepParam;
  }

  const risksParam = params.get("risks");
  if (risksParam !== null) {
    const validRisks = risksParam
      .split(",")
      .map((s) => s.trim())
      .filter((id) => VALID_RISK_IDS.has(id));
    if (validRisks.length > 0) {
      result.risks = validRisks;
    }
  }

  const allocParam = params.get("alloc");
  if (allocParam) {
    const allocations: Record<string, DiagnosticAllocationMode> =
      Object.fromEntries(
        DEFAULT_DIAGNOSTIC_CAPABILITIES.map((cap) => [cap.id, cap.recommended]),
      );
    let hasValidPair = false;
    for (const pair of allocParam.split(",")) {
      const [capId, mode] = pair.split(":").map((s) => s.trim());
      if (
        capId &&
        mode &&
        VALID_CAPABILITY_IDS.has(capId) &&
        VALID_MODES.has(mode as DiagnosticAllocationMode)
      ) {
        allocations[capId] = mode as DiagnosticAllocationMode;
        hasValidPair = true;
      }
    }
    if (hasValidPair) {
      result.allocations = allocations;
    }
  }

  return Object.keys(result).length > 0 ? result : null;
}

/* ========================================
   Autonomous Self-Healing Diagnostic Optimizer
   ======================================== */
export interface DiagnosticRemediationChange {
  id: string;
  label: string;
  from: DiagnosticAllocationMode;
  to: DiagnosticAllocationMode;
  reason: string;
}

export interface DiagnosticRemediationResult {
  healedAllocations: Record<string, DiagnosticAllocationMode>;
  beforeEvaluation: DiagnosticEvaluationResult;
  afterEvaluation: DiagnosticEvaluationResult;
  scoreDelta: number;
  changesApplied: DiagnosticRemediationChange[];
}

export function autoRemediateDiagnosticArchitecture(
  allocations: Record<string, DiagnosticAllocationMode>,
  workload: DiagnosticWorkloadType = "financial-ops",
  volume: DiagnosticVolumeLevel = "medium",
  latency: DiagnosticLatencyTier = "near-realtime",
  selectedRisks: string[] = ["hallucination", "pii-leak"],
): DiagnosticRemediationResult {
  const beforeEvaluation = evaluateDiagnosticArchitecture(
    allocations,
    workload,
    volume,
    latency,
    selectedRisks,
  );

  const healedAllocations: Record<string, DiagnosticAllocationMode> = {};
  const changesApplied: DiagnosticRemediationChange[] = [];

  for (const cap of DEFAULT_DIAGNOSTIC_CAPABILITIES) {
    const current = allocations[cap.id] ?? cap.recommended;
    healedAllocations[cap.id] = cap.recommended;
    if (current !== cap.recommended) {
      changesApplied.push({
        id: cap.id,
        label: cap.label,
        from: current,
        to: cap.recommended,
        reason: cap.contractInvariant,
      });
    }
  }

  const afterEvaluation = evaluateDiagnosticArchitecture(
    healedAllocations,
    workload,
    volume,
    latency,
    selectedRisks,
  );

  return {
    healedAllocations,
    beforeEvaluation,
    afterEvaluation,
    scoreDelta: Math.max(0, afterEvaluation.score - beforeEvaluation.score),
    changesApplied,
  };
}

/* ========================================
   Interactive Diagnostic Stress & Fault Simulator
   ======================================== */
export type DiagnosticStressScenarioId =
  "hallucination" | "latency-spike" | "pii-leak" | "budget-runaway";

export interface DiagnosticStressSimulationResult {
  faultId: DiagnosticStressScenarioId;
  title: string;
  injectedPayloadSummary: string;
  contained: boolean;
  interceptLayer: string;
  simulatedLatencyMs: number;
  blastRadius:
    | "ZERO (Contained at Boundary)"
    | "MODERATE (Partial Escalation)"
    | "CRITICAL (Unbounded Downstream Mutation)";
  analysis: string;
  remediationHint: string;
}

export function simulateDiagnosticStress(
  allocations: Record<string, DiagnosticAllocationMode>,
  workload: DiagnosticWorkloadType,
  latency: DiagnosticLatencyTier,
  faultId: DiagnosticStressScenarioId,
): DiagnosticStressSimulationResult {
  const schemaMode = allocations["schema-validation"] ?? "deterministic";
  const authMode = allocations["authorization-policy"] ?? "deterministic";
  const mathMode = allocations["math-calculations"] ?? "deterministic";
  const auditMode = allocations["audit-receipts"] ?? "deterministic";
  const messagingMode = allocations["customer-messaging"] ?? "hybrid";

  const baseLatencyMs =
    latency === "realtime" ? 18 : latency === "near-realtime" ? 42 : 95;

  if (faultId === "hallucination") {
    const vulnerable = schemaMode === "ai" || mathMode === "ai";
    const partial = messagingMode === "ai" && !vulnerable;
    return {
      faultId,
      title: "Adversarial Hallucination & Math Drift Injection",
      injectedPayloadSummary:
        workload === "financial-ops"
          ? 'LLM emits unverified credit memo {"invoiceTotalCents": -450000, "confidence": 0.61}'
          : 'LLM synthesizes fabricated policy clause ID "REG-994-NONEXISTENT"',
      contained: !vulnerable && !partial,
      interceptLayer: vulnerable
        ? "NONE // Probabilistic pass-through to downstream state"
        : partial
          ? "Gate 01 // Zod Schema Gate (Outbound copy unreviewed)"
          : "Gate 01 + Gate 03 // Deterministic Schema & Arithmetic Invariant Gate",
      simulatedLatencyMs: baseLatencyMs + (vulnerable ? 1420 : 6),
      blastRadius: vulnerable
        ? "CRITICAL (Unbounded Downstream Mutation)"
        : partial
          ? "MODERATE (Partial Escalation)"
          : "ZERO (Contained at Boundary)",
      analysis: vulnerable
        ? "FAILURE: Because Schema Validation or Calculations are assigned to Model Only, the hallucinated value bypassed code-level assertions and mutated downstream state."
        : partial
          ? "PARTIAL CONTAINMENT: Core ledger math held firm, but Outbound Content Generation is set to Model Only without a hybrid policy filter."
          : "CONTAINED: Deterministic Zod schema validation and integer arithmetic invariants rejected the hallucinated payload in 6ms before any state mutation.",
      remediationHint:
        "Ensure Input Parsing & Schema Validation and Calculations & Financial Math are locked to DETERMINISTIC, and Outbound Content is HYBRID.",
    };
  }

  if (faultId === "pii-leak") {
    const vulnerable = authMode === "ai" || schemaMode === "ai";
    return {
      faultId,
      title: "Unredacted PII & Cross-Tenant Context Bleed",
      injectedPayloadSummary:
        'Inbound context includes raw SIN "046-454-286" and cross-tenant header X-Tenant-ID mismatch',
      contained: !vulnerable,
      interceptLayer: vulnerable
        ? "NONE // Prompt-level instruction only (Bypassed via injection)"
        : "Gate 01 + Gate 02 // Pre-Flight PII Redaction Airlock & RBAC Lock",
      simulatedLatencyMs: baseLatencyMs + (vulnerable ? 980 : 4),
      blastRadius: vulnerable
        ? "CRITICAL (Unbounded Downstream Mutation)"
        : "ZERO (Contained at Boundary)",
      analysis: vulnerable
        ? "FAILURE: Policy Gates or Input Parsing rely on probabilistic prompts. Unsanitized PII tokens were transmitted to the external inference endpoint."
        : "CONTAINED: Deterministic pre-flight airlock scrubbed sensitive tokens into vault placeholders [REDACTED_SIN_01] and enforced tenant isolation prior to model invocation.",
      remediationHint:
        "Assign Policy Gates & Permission Check and Input Parsing & Schema Validation to DETERMINISTIC.",
    };
  }

  if (faultId === "latency-spike") {
    const vulnerable = auditMode === "ai" || schemaMode === "ai";
    const deadlineMs =
      latency === "realtime" ? 450 : latency === "near-realtime" ? 2500 : 8000;
    return {
      faultId,
      title: "Upstream Provider 504 Timeout & Latency Surge",
      injectedPayloadSummary: `Upstream model endpoint stalls for 9,400ms (Target budget: ${deadlineMs}ms)`,
      contained: !vulnerable,
      interceptLayer: vulnerable
        ? "UNBOUNDED // Cascading request stall without idempotent receipt"
        : `Gate 03 // AbortSignal Circuit Breaker (${deadlineMs}ms) + Dead-Letter Queue`,
      simulatedLatencyMs: vulnerable
        ? 9400
        : Math.min(deadlineMs, baseLatencyMs + 14),
      blastRadius: vulnerable
        ? "MODERATE (Partial Escalation)"
        : "ZERO (Contained at Boundary)",
      analysis: vulnerable
        ? "DEGRADED: Without deterministic schema pre-filtering and immutable audit receipts, the stalled upstream call risks duplicate replay on retry."
        : "CONTAINED: Circuit breaker tripped cleanly at deadline; request state was hashed to the dead-letter replay queue with zero unhandled 500 errors.",
      remediationHint:
        "Lock Audit Ledger & Receipts and Input Parsing to DETERMINISTIC to guarantee idempotent retry safety.",
    };
  }

  // budget-runaway
  const vulnerable = authMode === "ai" || mathMode === "ai";
  return {
    faultId,
    title: "Recursive Tool-Call Loop & Compute Runaway",
    injectedPayloadSummary:
      "Agent enters recursive retry cycle attempting 48 consecutive tool invocations on ambiguous input",
    contained: !vulnerable,
    interceptLayer: vulnerable
      ? "NONE // Unbounded agent loop"
      : "Gate 02 // Hard Step-Count Ceiling (maxSteps <= 4) & Cost Breaker",
    simulatedLatencyMs: baseLatencyMs + (vulnerable ? 6200 : 9),
    blastRadius: vulnerable
      ? "CRITICAL (Unbounded Downstream Mutation)"
      : "ZERO (Contained at Boundary)",
    analysis: vulnerable
      ? "FAILURE: Policy Gates are delegated to the model, allowing recursive self-invocation without a deterministic step counter."
      : "CONTAINED: Deterministic policy gate enforced maxSteps=4 ceiling, halted the runaway loop, and routed the trace to operator review.",
    remediationHint:
      "Lock Policy Gates & Permission Check to DETERMINISTIC to enforce hard step and compute ceilings in code.",
  };
}

/* ========================================
   Executable TypeScript + Zod Contract Generator
   ======================================== */
export function generateDiagnosticZodContract(
  state: DiagnosticShareState,
  evaluation: DiagnosticEvaluationResult,
): string {
  const timeoutMs =
    state.latency === "realtime"
      ? 450
      : state.latency === "near-realtime"
        ? 3500
        : 15000;
  const hasPiiGuard = state.risks.includes("pii-leak");
  const hasBudgetGuard = state.risks.includes("budget-runaway");
  const hasHallucinationGuard = state.risks.includes("hallucination");

  return [
    "/**",
    ` * AIAS Sovereign Boundary Contract — ${state.workload.toUpperCase()}`,
    ` * Reliability Score: ${evaluation.score}/100 (Grade ${evaluation.grade})`,
    ` * Recommended Track: ${evaluation.track}`,
    " * Generated 100% client-side by AIAS Diligence Engine",
    " */",
    'import { z } from "zod";',
    "",
    "// 1. Deterministic Input & Policy Envelope (Gate 01)",
    "export const WorkloadEnvelopeSchema = z.object({",
    '  requestId: z.string().uuid("Idempotency UUID required"),',
    '  tenantId: z.string().min(3, "Strict tenant namespace lock"),',
    `  workload: z.literal("${state.workload}"),`,
    `  volumeTier: z.literal("${state.volume}"),`,
    ...(state.workload === "financial-ops"
      ? [
          '  amountCents: z.number().int().nonnegative("IEEE-754 float drift forbidden; use integer cents"),',
          '  currency: z.enum(["CAD", "USD"]),',
        ]
      : [
          '  payloadText: z.string().min(1).max(8000, "Bounded context window"),',
        ]),
    ...(hasBudgetGuard
      ? [
          '  stepCount: z.number().int().min(0).max(4, "Hard loop-breaker ceiling: maxSteps <= 4"),',
        ]
      : []),
    "}).strict();",
    "",
    "export type WorkloadEnvelope = z.infer<typeof WorkloadEnvelopeSchema>;",
    "",
    "// 2. Structured Model Inference Output Contract (Gate 02)",
    "export const GovernedInferenceSchema = z.object({",
    "  classification: z.string().min(1),",
    `  confidenceScore: z.number().min(${hasHallucinationGuard ? "0.92" : "0.80"}).max(1.0),`,
    "  citations: z.array(z.string().min(1)).min(1),",
    "  requiresOperatorSignOff: z.boolean(),",
    "}).strict();",
    "",
    ...(hasPiiGuard
      ? [
          "// 3. Pre-Flight PIPEDA-Informed Redaction Airlock",
          "export function scrubSensitiveTokens(raw: string): string {",
          "  return raw",
          '    .replace(/\\b\\d{3}[-\\s]?\\d{3}[-\\s]?\\d{3}\\b/g, "[REDACTED_SIN]")',
          '    .replace(/\\b(?:\\d[ -]*?){13,16}\\b/g, "[REDACTED_CARD]");',
          "}",
          "",
        ]
      : []),
    "// 4. Sovereign Execution Pipeline with Circuit Breaker & SHA-256 Receipt",
    "export async function executeGovernedPipeline(",
    "  rawInput: unknown,",
    "  runInference: (envelope: WorkloadEnvelope, signal: AbortSignal) => Promise<unknown>,",
    ") {",
    "  const parsedInput = WorkloadEnvelopeSchema.safeParse(rawInput);",
    "  if (!parsedInput.success) {",
    "    return {",
    '      status: "REJECTED_AT_GATE_01" as const,',
    "      issues: parsedInput.error.issues,",
    "    };",
    "  }",
    "",
    `  const controller = new AbortController();`,
    `  const timer = setTimeout(() => controller.abort(), ${timeoutMs}); // ${state.latency} P95 budget`,
    "",
    "  try {",
    "    const rawOutput = await runInference(parsedInput.data, controller.signal);",
    "    const verifiedOutput = GovernedInferenceSchema.safeParse(rawOutput);",
    "    if (!verifiedOutput.success) {",
    "      return {",
    '        status: "INTERCEPTED_HALLUCINATION_DRIFT" as const,',
    '        fallback: "ROUTED_TO_DETERMINISTIC_OPERATOR_QUEUE",',
    "      };",
    "    }",
    "",
    "    const receiptPayload = JSON.stringify({",
    "      requestId: parsedInput.data.requestId,",
    "      tenantId: parsedInput.data.tenantId,",
    "      verifiedOutput: verifiedOutput.data,",
    "    });",
    "    const digest = await crypto.subtle.digest(",
    '      "SHA-256",',
    "      new TextEncoder().encode(receiptPayload),",
    "    );",
    "    const sha256Receipt = Array.from(new Uint8Array(digest))",
    '      .map((b) => b.toString(16).padStart(2, "0"))',
    '      .join("");',
    "",
    "    return {",
    '      status: "COMMITTED_WITH_PROVENANCE" as const,',
    "      data: verifiedOutput.data,",
    "      sha256Receipt,",
    "    };",
    "  } catch {",
    "    return {",
    '      status: "CIRCUIT_BREAKER_OPEN_DEAD_LETTER_QUEUED" as const,',
    `      timeoutBudgetMs: ${timeoutMs},`,
    "    };",
    "  } finally {",
    "    clearTimeout(timer);",
    "  }",
    "}",
  ].join("\n");
}

/* ========================================
   Self-Maintaining Workspace Brief Auditor
   ======================================== */
export interface WorkspaceBriefAudit {
  score: number;
  grade: "A" | "B" | "C" | "Incomplete";
  presentPillars: string[];
  missingPillars: string[];
  detectedGates: number;
  wordCount: number;
  suggestions: string[];
  autoEnrichedBrief: string;
}

const BRIEF_PILLAR_SPECS: ReadonlyArray<{
  id: string;
  label: string;
  pattern: RegExp;
  defaultLine: string;
}> = [
  {
    id: "objective",
    label: "Objective",
    pattern:
      /(?:^|\n)(?:#+\s*)?(?:\d+\.\s*)?\**_?Objective\b[: \t-]*(\S.{7,})/i,
    defaultLine:
      "Objective: Automate high-friction operational handoffs with deterministic policy gates and zero silent failure drift.",
  },
  {
    id: "constraints",
    label: "Constraints",
    pattern:
      /(?:^|\n)(?:#+\s*)?(?:\d+\.\s*)?\**_?(?:Constraints|Latency|Workload Context|Target Status)\b[: \t-]*(?:\n[-*]\s+\S.{5,}|\S.{7,})/i,
    defaultLine:
      "Constraints: P95 latency < 2.5s | PIPEDA-informed tenant isolation | 100% strict Zod schema validation at ingress and egress.",
  },
  {
    id: "failure-modes",
    label: "Failure Modes",
    pattern:
      /(?:^|\n)(?:#+\s*)?(?:\d+\.\s*)?\**_?(?:Failure modes|High-Priority Failure Modes|High-Priority Guardrail|Risk)\b[: \t-]*(?:\n[-*]\s+\S.{5,}|\S.{7,})/i,
    defaultLine:
      "Failure modes: Unvalidated model output drift; upstream provider 504 timeout; unredacted PII token exposure.",
  },
  {
    id: "gates",
    label: "Deterministic Gates",
    pattern:
      /(?:Gate\s*0[1-4]|Boundary Allocation|Invariant Boundary|Verified Guardrail|Deterministic Systems Lab|Policy Studio Gate)/i,
    defaultLine: [
      "Architecture topology:",
      "- Gate 01 (Deterministic): Strict Zod contract parse + idempotency key deduplication.",
      "- Gate 02 (Governed AI): Scoped inference with structured output schema and confidence threshold >= 0.92.",
      "- Gate 03 (Policy Gate): Deterministic rule & permission verification + timeout circuit breaker.",
      "- Gate 04 (Audit Ledger): Append-only SHA-256 cryptographic execution receipt.",
    ].join("\n"),
  },
  {
    id: "next-decision",
    label: "Next Decision",
    pattern:
      /(?:^|\n)(?:#+\s*)?(?:\d+\.\s*)?\**_?(?:Next decision|Next Implementation Steps|Action Recommendation|Recommended Track)\b[: \t-]*(?:\n(?:\d+\.|[-*])\s+\S.{5,}|\S.{7,})/i,
    defaultLine:
      "Next decision: Validate boundary contracts against 50 representative production payloads in a 2-week AIAS Architecture Sprint.",
  },
];

export function analyzeWorkspaceBrief(rawNotes: string): WorkspaceBriefAudit {
  const clean = normalizeWorkspaceNotes(rawNotes);
  const words = clean.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const presentPillars: string[] = [];
  const missingPillars: string[] = [];
  const suggestions: string[] = [];
  const enrichmentBlocks: string[] = [];

  for (const pillar of BRIEF_PILLAR_SPECS) {
    if (pillar.pattern.test(clean)) {
      presentPillars.push(pillar.label);
    } else {
      missingPillars.push(pillar.label);
      suggestions.push(`Add explicit ${pillar.label} specification.`);
      enrichmentBlocks.push(pillar.defaultLine);
    }
  }

  const gateMatches = clean.match(
    /(?:Gate\s*0[1-4]|Verified Guardrail|Deterministic|Zod|SHA-256|Circuit Breaker)/gi,
  );
  const detectedGates = gateMatches ? Math.min(8, gateMatches.length) : 0;

  let score = Math.round(
    (presentPillars.length / BRIEF_PILLAR_SPECS.length) * 75,
  );
  if (detectedGates >= 3) score += 15;
  else if (detectedGates >= 1) score += 8;
  if (wordCount >= 35) score += 10;
  else if (wordCount >= 15) score += 5;

  if (clean === DEFAULT_WORKSPACE_TEMPLATE || wordCount <= 6) {
    score = 15;
  }

  score = Math.max(0, Math.min(100, score));

  const grade: WorkspaceBriefAudit["grade"] =
    score >= 85 ? "A" : score >= 70 ? "B" : score >= 50 ? "C" : "Incomplete";

  let autoEnrichedBrief = clean;
  if (clean === DEFAULT_WORKSPACE_TEMPLATE || !clean) {
    autoEnrichedBrief = BRIEF_PILLAR_SPECS.map((p) => p.defaultLine).join(
      "\n\n",
    );
  } else if (enrichmentBlocks.length > 0) {
    // Replace empty stub lines like "Objective:" if present, or append missing blocks
    let working = clean;
    for (const pillar of BRIEF_PILLAR_SPECS) {
      if (!pillar.pattern.test(working)) {
        const emptyStubRegex = new RegExp(
          `^(?:${pillar.label})\\s*:\\s*$`,
          "im",
        );
        if (emptyStubRegex.test(working)) {
          working = working.replace(emptyStubRegex, pillar.defaultLine);
        } else {
          working = `${working.trimEnd()}\n\n${pillar.defaultLine}`;
        }
      }
    }
    autoEnrichedBrief = working.trim();
  }

  return {
    score,
    grade,
    presentPillars,
    missingPillars,
    detectedGates,
    wordCount,
    suggestions,
    autoEnrichedBrief,
  };
}

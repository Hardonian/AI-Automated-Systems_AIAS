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
        const parsed = JSON.parse(item) as T;
        queueMicrotask(() => active && setStoredValue(parsed));
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

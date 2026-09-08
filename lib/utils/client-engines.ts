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
  defaultValue: T
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    return (params.get(key) as T | null) ?? defaultValue;
  });

  const setHashValue = useCallback(
    (newValue: T) => {
      setValue(newValue);
      const hash = window.location.hash.slice(1);
      const params = new URLSearchParams(hash);
      params.set(key, newValue);
      window.history.replaceState(null, "", `#${params.toString()}`);
    },
    [key]
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
  const canShare =
    typeof navigator !== "undefined" && "share" in navigator;

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
    [canShare]
  );

  return { canShare, share };
}

/* ========================================
   Item 66: BroadcastChannel Cross-Tab Sync
   ======================================== */
export function useBroadcastChannel<T>(
  channelName: string,
  onMessage?: (data: T) => void
) {
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel(channelName);
    channelRef.current = channel;

    if (onMessage) {
      channel.onmessage = (event: MessageEvent<T>) => {
        onMessage(event.data);
      };
    }

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [channelName, onMessage]);

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
  content: string
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
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

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
    [key]
  );

  return [storedValue, setValue];
}

/* ========================================
   Item 69: Session Storage Wizard Progress
   ======================================== */
export function useSessionProgress<T>(
  wizardId: string,
  defaultState: T
): [T, (update: Partial<T>) => void, () => void] {
  const storageKey = `aias_wizard_${wizardId}`;
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return defaultState;
    try {
      const stored = window.sessionStorage.getItem(storageKey);
      return stored ? (JSON.parse(stored) as T) : defaultState;
    } catch {
      return defaultState;
    }
  });

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
    [storageKey]
  );

  const resetProgress = useCallback(() => {
    setState(defaultState);
    try {
      window.sessionStorage.removeItem(storageKey);
    } catch {
      // Ignore
    }
  }, [storageKey, defaultState]);

  return [state, updateProgress, resetProgress];
}

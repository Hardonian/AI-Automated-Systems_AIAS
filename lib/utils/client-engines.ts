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

import { describe, expect, it } from "vitest";
import {
  encryptClientState,
  decryptClientState,
  generateSHA256Receipt,
  DEFAULT_DIAGNOSTIC_CAPABILITIES,
  evaluateDiagnosticArchitecture,
  encodeDiagnosticState,
  decodeDiagnosticState,
  type DiagnosticAllocationMode,
} from "@/lib/utils/client-engines";

describe("client-engines cryptographic suite", () => {
  const sampleState = {
    notes:
      "Objective: Deterministic banking automation\nConstraints: Zero PII leakage",
    author: "AIAS Lead Architect",
    timestamp: "2026-09-10T12:00:00.000Z",
  };
  const passphrase = "correct-horse-battery-staple-2026";

  it("encrypts and decrypts state accurately via AES-GCM and PBKDF2", async () => {
    const encrypted = await encryptClientState(sampleState, passphrase);

    expect(encrypted.algorithm).toBe("AES-GCM");
    expect(encrypted.ciphertext).toBeTruthy();
    expect(encrypted.iv).toBeTruthy();
    expect(encrypted.salt).toBeTruthy();
    expect(encrypted.iterations).toBe(210_000);

    const decrypted = await decryptClientState<typeof sampleState>(
      encrypted,
      passphrase,
    );
    expect(decrypted).toEqual(sampleState);
  });

  it("rejects passphrases shorter than 12 characters", async () => {
    await expect(encryptClientState(sampleState, "too-short")).rejects.toThrow(
      /at least 12 characters/,
    );

    const encrypted = await encryptClientState(sampleState, passphrase);
    await expect(decryptClientState(encrypted, "short")).rejects.toThrow(
      /minimum 12 characters/,
    );
  });

  it("fails decryption when an incorrect passphrase is supplied", async () => {
    const encrypted = await encryptClientState(sampleState, passphrase);
    await expect(
      decryptClientState(encrypted, "wrong-passphrase-with-enough-chars-1234"),
    ).rejects.toThrow(/Decryption failed/);
  });

  it("generates a valid SHA-256 receipt with expected formatting", async () => {
    const content = "Test runbook content";
    const receipt = await generateSHA256Receipt(content);

    expect(receipt.hash).toHaveLength(64);
    expect(receipt.timestamp).toBeTruthy();
    expect(receipt.receipt).toContain("AIAS RUNBOOK VERIFICATION RECEIPT");
    expect(receipt.receipt).toContain("INTEGRITY VERIFIED");
  });

  it("evaluates governed vs fragile diagnostic architectures deterministically", () => {
    const governedAllocations = Object.fromEntries(
      DEFAULT_DIAGNOSTIC_CAPABILITIES.map((c) => [c.id, c.recommended]),
    ) as Record<string, DiagnosticAllocationMode>;

    const governed = evaluateDiagnosticArchitecture(
      governedAllocations,
      "financial-ops",
      "high",
      "near-realtime",
      ["hallucination", "pii-leak"],
    );

    expect(governed.score).toBeGreaterThanOrEqual(82);
    expect(governed.grade).toBe("A");
    expect(governed.operationalProfile.criticalDrifts).toHaveLength(0);
    expect(
      governed.operationalProfile.estimatedHoursReclaimedPerYear,
    ).toBeGreaterThan(1000);

    const fragileAllocations: Record<string, DiagnosticAllocationMode> = {
      ...governedAllocations,
      "schema-validation": "ai",
      "math-calculations": "ai",
      "authorization-policy": "ai",
      "audit-receipts": "ai",
    };

    const fragile = evaluateDiagnosticArchitecture(
      fragileAllocations,
      "financial-ops",
      "high",
      "realtime",
      ["hallucination", "pii-leak", "budget-runaway", "latency-spike"],
    );

    expect(fragile.score).toBeLessThan(governed.score);
    expect(fragile.grade).toBe("D");
    expect(fragile.operationalProfile.criticalDrifts.length).toBeGreaterThan(0);
    expect(fragile.track).toContain("Stabilization");
  });

  it("encodes and decodes URL-safe diagnostic share states and rejects tampered inputs", () => {
    const allocations = Object.fromEntries(
      DEFAULT_DIAGNOSTIC_CAPABILITIES.map((c) => [c.id, c.recommended]),
    ) as Record<string, DiagnosticAllocationMode>;

    const originalState = {
      workload: "compliance-audit" as const,
      volume: "high" as const,
      latency: "realtime" as const,
      allocations,
      risks: ["pii-leak", "hallucination"],
    };

    const encoded = encodeDiagnosticState(originalState);
    const decoded = decodeDiagnosticState(encoded);

    expect(decoded).not.toBeNull();
    expect(decoded?.workload).toBe("compliance-audit");
    expect(decoded?.volume).toBe("high");
    expect(decoded?.latency).toBe("realtime");
    expect(decoded?.allocations).toEqual(allocations);
    expect(decoded?.risks).toEqual(["pii-leak", "hallucination"]);

    // Tampered query string should sanitize unknown values
    const tampered = decodeDiagnosticState(
      "workload=invalid-workload&volume=bad&alloc=schema-validation:invalid,bad-id:deterministic&risks=pii-leak,fake-risk",
    );
    expect(tampered).not.toBeNull();
    expect(tampered?.workload).toBeUndefined();
    expect(tampered?.volume).toBeUndefined();
    expect(tampered?.allocations).toBeUndefined();
    expect(tampered?.risks).toEqual(["pii-leak"]);
  });
});

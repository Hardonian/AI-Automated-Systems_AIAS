import { describe, expect, it } from "vitest";
import {
  encryptClientState,
  decryptClientState,
  generateSHA256Receipt,
  DEFAULT_DIAGNOSTIC_CAPABILITIES,
  DEFAULT_WORKSPACE_TEMPLATE,
  evaluateDiagnosticArchitecture,
  encodeDiagnosticState,
  decodeDiagnosticState,
  normalizeWorkspaceNotes,
  readWorkspaceNotes,
  writeWorkspaceNotes,
  appendWorkspaceNotes,
  autoRemediateDiagnosticArchitecture,
  simulateDiagnosticStress,
  generateDiagnosticZodContract,
  analyzeWorkspaceBrief,
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

  it("self-heals and deduplicates workspace notes across JSON and raw storage formats", () => {
    const store = new Map<string, string>();
    const mockStorage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    };

    expect(readWorkspaceNotes(mockStorage)).toBe(DEFAULT_WORKSPACE_TEMPLATE);

    // Simulate legacy raw unquoted string combined with JSON string
    const corrupted =
      '"Objective: Recover 1,200 hrs/yr"\n\n## Deterministic Systems Lab Telemetry\n- Status: OK';
    expect(normalizeWorkspaceNotes(corrupted)).toContain(
      "Objective: Recover 1,200 hrs/yr",
    );
    expect(normalizeWorkspaceNotes(corrupted)).toContain(
      "## Deterministic Systems Lab Telemetry",
    );

    writeWorkspaceNotes(
      "Objective: Build governed FinOps pipeline",
      mockStorage,
    );
    expect(readWorkspaceNotes(mockStorage)).toBe(
      "Objective: Build governed FinOps pipeline",
    );

    // Append section and verify idempotent section replacement on re-sync
    appendWorkspaceNotes(
      "## Deterministic Systems Lab Telemetry\n- Latency: 1.2s",
      mockStorage,
    );
    const afterFirstAppend = readWorkspaceNotes(mockStorage);
    expect(afterFirstAppend).toContain("Latency: 1.2s");

    appendWorkspaceNotes(
      "## Deterministic Systems Lab Telemetry\n- Latency: 0.8s",
      mockStorage,
    );
    const afterSecondAppend = readWorkspaceNotes(mockStorage);
    expect(afterSecondAppend).toContain("Latency: 0.8s");
    expect(afterSecondAppend).not.toContain("Latency: 1.2s");
  });

  it("autonomously remediates fragile diagnostic architectures to Grade A", () => {
    const fragileAllocations: Record<string, DiagnosticAllocationMode> = {
      "schema-validation": "ai",
      "unstructured-synthesis": "deterministic",
      "authorization-policy": "ai",
      "math-calculations": "ai",
      "customer-messaging": "ai",
      "audit-receipts": "ai",
    };

    const remediation = autoRemediateDiagnosticArchitecture(
      fragileAllocations,
      "financial-ops",
      "high",
      "realtime",
      ["hallucination", "pii-leak"],
    );

    expect(remediation.beforeEvaluation.grade).toBe("D");
    expect(remediation.afterEvaluation.grade).toBe("A");
    expect(remediation.scoreDelta).toBeGreaterThan(40);
    expect(
      remediation.afterEvaluation.operationalProfile.criticalDrifts,
    ).toHaveLength(0);
    expect(remediation.changesApplied.length).toBe(6);
  });

  it("simulates fault stress accurately before and after boundary remediation", () => {
    const fragileAllocations: Record<string, DiagnosticAllocationMode> = {
      "schema-validation": "ai",
      "unstructured-synthesis": "ai",
      "authorization-policy": "ai",
      "math-calculations": "ai",
      "customer-messaging": "ai",
      "audit-receipts": "ai",
    };

    const breachedHallucination = simulateDiagnosticStress(
      fragileAllocations,
      "financial-ops",
      "realtime",
      "hallucination",
    );
    expect(breachedHallucination.contained).toBe(false);
    expect(breachedHallucination.blastRadius).toContain("CRITICAL");

    const { healedAllocations } = autoRemediateDiagnosticArchitecture(
      fragileAllocations,
      "financial-ops",
      "high",
      "realtime",
      ["hallucination", "pii-leak", "latency-spike", "budget-runaway"],
    );

    for (const faultId of [
      "hallucination",
      "pii-leak",
      "latency-spike",
      "budget-runaway",
    ] as const) {
      const result = simulateDiagnosticStress(
        healedAllocations,
        "financial-ops",
        "realtime",
        faultId,
      );
      expect(result.contained).toBe(true);
      expect(result.blastRadius).toBe("ZERO (Contained at Boundary)");
    }
  });

  it("generates an executable TypeScript + Zod boundary contract and self-enriches incomplete briefs", () => {
    const allocations = Object.fromEntries(
      DEFAULT_DIAGNOSTIC_CAPABILITIES.map((c) => [c.id, c.recommended]),
    ) as Record<string, DiagnosticAllocationMode>;
    const evaluation = evaluateDiagnosticArchitecture(
      allocations,
      "financial-ops",
      "high",
      "realtime",
      ["hallucination", "pii-leak", "budget-runaway"],
    );

    const code = generateDiagnosticZodContract(
      {
        workload: "financial-ops",
        volume: "high",
        latency: "realtime",
        allocations,
        risks: ["hallucination", "pii-leak", "budget-runaway"],
      },
      evaluation,
    );

    expect(code).toContain("export const WorkloadEnvelopeSchema = z.object");
    expect(code).toContain("amountCents: z.number().int().nonnegative");
    expect(code).toContain("scrubSensitiveTokens");
    expect(code).toContain("crypto.subtle.digest");

    // Audit default template vs auto-enriched brief
    const initialAudit = analyzeWorkspaceBrief(DEFAULT_WORKSPACE_TEMPLATE);
    expect(initialAudit.grade).toBe("Incomplete");
    expect(initialAudit.missingPillars.length).toBe(5);

    const enrichedAudit = analyzeWorkspaceBrief(initialAudit.autoEnrichedBrief);
    expect(enrichedAudit.grade).toBe("A");
    expect(enrichedAudit.missingPillars).toHaveLength(0);
    expect(enrichedAudit.score).toBeGreaterThanOrEqual(85);
  });
});

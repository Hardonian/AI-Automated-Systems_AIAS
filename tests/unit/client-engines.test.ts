import { describe, expect, it } from "vitest";
import {
  encryptClientState,
  decryptClientState,
  generateSHA256Receipt,
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
});

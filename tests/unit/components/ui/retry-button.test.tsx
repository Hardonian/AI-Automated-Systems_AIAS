import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RetryButton } from "@/components/ui/retry-button";

describe("RetryButton component", () => {
  it("resets isRetrying state when onRetry rejects", async () => {
    let resolveRetry: (value: unknown) => void;
    let rejectRetry: (reason?: any) => void;

    const mockOnRetry = vi.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        resolveRetry = resolve;
        rejectRetry = reject;
      });
    });

    // We suppress console.error for this test because the unhandled promise rejection in the component
    // will log to console in the test environment
    const originalError = console.error;
    console.error = vi.fn();

    render(<RetryButton onRetry={mockOnRetry} />);

    const button = screen.getByRole("button", { name: /try again/i });

    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    expect(button).toBeDisabled();

    // Reject the retry action
    try {
      rejectRetry!(new Error("Test error"));
    } catch (e) {
      // Ignored
    }

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });

    expect(mockOnRetry).toHaveBeenCalledTimes(1);

    console.error = originalError;
  });

  it("resets isRetrying state when onRetry resolves", async () => {
    let resolveRetry: (value: unknown) => void;

    const mockOnRetry = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolveRetry = resolve;
      });
    });

    render(<RetryButton onRetry={mockOnRetry} />);

    const button = screen.getByRole("button", { name: /try again/i });

    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    expect(button).toBeDisabled();

    // Resolve the retry action
    resolveRetry!(undefined);

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });
});

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IntakeForm } from '../../../../components/IntakeForm';

// Mock matchMedia for happy-dom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Since the download artifact function is in the same file and relies on Blob/URL.createObjectURL which might not exist or work
// well in happy-dom, let's mock URL.createObjectURL
if (typeof window.URL.createObjectURL === 'undefined') {
  window.URL.createObjectURL = vi.fn();
}

describe('IntakeForm Network Failure Path', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    // Suppress console.error if needed
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('silently fails and still downloads the artifact when fetch fails', async () => {
    // Make fetch reject to simulate network failure
    (global.fetch as any).mockRejectedValueOnce(new TypeError('NetworkError when attempting to fetch resource.'));

    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:test-url');
    window.URL.createObjectURL = mockCreateObjectURL;

    render(<IntakeForm />);

    // Fill out Step 0
    fireEvent.click(screen.getByRole('combobox', { name: /Organization type/i }));
    fireEvent.click(screen.getByRole('option', { name: /Startup/i }));

    fireEvent.click(screen.getByRole('combobox', { name: /Primary problem category/i }));
    fireEvent.click(screen.getByRole('option', { name: /Customer response and service quality/i }));

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Fill out Step 1
    fireEvent.click(screen.getByRole('combobox', { name: /Current AI stack/i }));
    fireEvent.click(screen.getByRole('option', { name: /No AI/i }));

    fireEvent.click(screen.getByRole('combobox', { name: /Model mix/i }));
    fireEvent.click(screen.getByRole('option', { name: /Single model deployment/i }));

    fireEvent.click(screen.getByRole('combobox', { name: /Current failure mode/i }));
    fireEvent.click(screen.getByRole('option', { name: /Hallucination and output quality issues/i }));

    fireEvent.click(screen.getByRole('combobox', { name: /Governance maturity/i }));
    fireEvent.click(screen.getByRole('option', { name: /Ad hoc controls/i }));

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Fill out Step 2
    fireEvent.click(screen.getByLabelText(/Exploration this year/i)); // urgency
    fireEvent.click(screen.getByLabelText(/One-off diagnostic/i)); // scope

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Fill out Step 3
    fireEvent.click(screen.getByLabelText(/Constrained/i)); // budget

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Submit intake/i }));

    // Wait for the download to be triggered (which uses URL.createObjectURL)
    await waitFor(() => {
      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    // We can also verify the screen transitioned to the success state
    expect(screen.getByText(/Intake submitted/i)).toBeInTheDocument();
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { IntakeForm } from '../../../../components/IntakeForm';

// Mock the environment variable
process.env.NEXT_PUBLIC_INTAKE_WEBHOOK_URL = 'http://test.com/webhook';

// Mock global.URL.createObjectURL and revokeObjectURL
const mockCreateObjectURL = vi.fn().mockReturnValue('blob:http://localhost/1234');
const mockRevokeObjectURL = vi.fn();
global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

// Create a mock for anchor click
const mockAnchorClick = vi.fn();
// We'll spy on document.createElement instead to intercept the anchor
const originalCreateElement = document.createElement.bind(document);
vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
  if (tagName === 'a') {
    const anchor = originalCreateElement('a');
    anchor.click = mockAnchorClick;
    return anchor as any;
  }
  return originalCreateElement(tagName) as any;
});

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// ResizeObserver mock needed by radix select
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
global.HTMLElement.prototype.hasPointerCapture = vi.fn();
global.HTMLElement.prototype.scrollIntoView = vi.fn();

// Helper to fill the form and submit
async function fillAndSubmitForm(user: ReturnType<typeof userEvent.setup>) {
  // Radix select comboboxes have pointer-events:none on the span containing text.
  // We need to click the combobox element.

  const getSelectTrigger = (name: RegExp) => screen.getByRole('combobox', { name });
  const selectOption = async (triggerName: RegExp, optionText: string) => {
    await user.click(getSelectTrigger(triggerName));
    await waitFor(() => expect(screen.getByRole('option', { name: optionText })).toBeInTheDocument());
    await user.click(screen.getByRole('option', { name: optionText }));
  };

  // Step 1: Organization and problem context
  await selectOption(/organization type/i, 'Startup / founding team');
  await selectOption(/problem category/i, 'Manual operations and repeated tasks');

  await user.click(screen.getByRole('button', { name: 'Continue' }));

  // Step 2: AI stack and governance diagnostics
  await selectOption(/current ai stack/i, 'No AI stack in production');
  await selectOption(/model mix/i, 'Single model deployment');
  await selectOption(/failure mode/i, 'Hallucination and output quality issues');
  await selectOption(/governance maturity/i, 'Ad hoc controls');

  await user.click(screen.getByRole('button', { name: 'Continue' }));

  // Step 3: Urgency and engagement scope
  await user.click(screen.getByLabelText('Need action this month'));
  await user.click(screen.getByLabelText('One-off diagnostic or implementation'));

  await user.click(screen.getByRole('button', { name: 'Continue' }));

  // Step 4: Budget and contact preferences
  await user.click(screen.getByLabelText('Constrained — need a focused outcome'));
  await user.type(screen.getByLabelText(/Email/i), 'test@example.com');

  await user.click(screen.getByRole('button', { name: 'Submit intake' }));
}

describe('IntakeForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<IntakeForm />);
    expect(screen.getByText('Organization type')).toBeInTheDocument();
  });

  it('downloads artifact on network failure (fetch throws)', async () => {
    const user = userEvent.setup();
    render(<IntakeForm />);

    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await fillAndSubmitForm(user);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
      expect(mockAnchorClick).toHaveBeenCalledTimes(1);
      expect(mockRevokeObjectURL).toHaveBeenCalledTimes(1);
    });
  });

  it('downloads artifact on network failure (fetch returns !ok)', async () => {
    const user = userEvent.setup();
    render(<IntakeForm />);

    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await fillAndSubmitForm(user);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
      expect(mockAnchorClick).toHaveBeenCalledTimes(1);
      expect(mockRevokeObjectURL).toHaveBeenCalledTimes(1);
    });
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InteractiveScheduler } from "@/components/content/interactive-scheduler";

describe("booking availability", () => {
  it("does not present unverified slots or a local confirmation as a booking", () => {
    render(<InteractiveScheduler />);
    expect(
      screen.getByText(/online booking is currently unavailable/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /email.*inquiries/i }),
    ).toHaveAttribute("href", "mailto:inquiries@aiautomatedsystems.ca");
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/available strategy slots/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /confirm.*session/i }),
    ).not.toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders its child element without adding a nested button", () => {
    render(
      <Button asChild>
        <a href="/services">View services</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "View services" });
    expect(link).toHaveAttribute("href", "/services");
    expect(link.closest("button")).toBeNull();
  });

  it("accepts a one-item child array from a server-component boundary", () => {
    render(
      <Button asChild>
        {[
          <a key="contact" href="/contact">
            Contact AIAS
          </a>,
        ]}
      </Button>,
    );

    expect(screen.getByRole("link", { name: "Contact AIAS" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });
});

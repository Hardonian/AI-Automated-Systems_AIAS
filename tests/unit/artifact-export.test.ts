import { describe, expect, it } from "vitest";

import { architectureSvg, createTextPdf } from "@/lib/client/artifact-export";

describe("client artifact exports", () => {
  it("creates a valid SVG architecture", () => {
    expect(architectureSvg(["Input", "Gate"])).toContain("<svg");
    expect(architectureSvg(["Input", "Gate"])).toContain("Gate");
  });

  it("creates a PDF blob", () => {
    const pdf = createTextPdf("Title", "Body");
    expect(pdf.type).toBe("application/pdf");
    expect(pdf.size).toBeGreaterThan(100);
  });
});

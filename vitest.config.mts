import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    setupFiles: ["./tests/setup/vitest-env.ts", "./tests/unit/setup.ts"],
  },
  resolve: {
    alias: {
      "@": projectRoot,
    },
  },
});

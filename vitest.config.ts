import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  esbuild: {
    jsxInject: `import React from 'react'`
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
})

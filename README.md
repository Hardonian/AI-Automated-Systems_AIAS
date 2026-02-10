# AIAS Platform

Enterprise-grade AI consultancy landing site and agentic workflow demonstration.

## Overview

AIAS Platform is a high-performance, static-first web application built with Next.js 15 and TypeScript. It serves as the primary touchpoint for our consultancy services and features a client-side agentic workflow simulation.

**Key Features:**
- **Zero Backend**: Fully static/client-side architecture for maximum reliability and security.
- **Deterministic Workflow Sandbox**: Interactive demo of agentic planning logic (client-side).
- **Centralized Content**: All site copy managed via typed `src/content/site.ts`.
- **Performance**: Optimized for core web vitals and accessibility.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS + Radix UI
- **Testing**: Playwright (E2E)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+

### Installation

```bash
git clone https://github.com/shardie-github/aias.git
cd aias
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Verification

Run the full quality suite:

```bash
pnpm verify
```

This runs:
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`

### Content Management

All site content is located in `src/content/site.ts`.
Edit this file to update text, links, feature lists, and testimonials. The TypeScript interface ensures you don't break the layout.

## Deployment

The site is designed for static edge deployment (Vercel recommended).
No environment variables are required for the core site to function.

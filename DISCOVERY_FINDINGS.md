# Discovery Findings - AIAS Pivot to Static

## 1. Repo Inspection
- **Framework**: Next.js 15.1.0 (App Router) with React 19.
- **Structure**: Root-level `app/` directory containing the main application.
- **Confusing Elements**: An `apps/web` directory exists but appears minimal/broken compared to the root `app`. It contains backend-heavy dependencies (Prisma, Supabase) but no visible source code in the file list. The root `package.json` also lists backend dependencies globally.

## 2. Backend-ish Code Identified
- **Dependencies**: `bullmq`, `ioredis`, `stripe`, `resend`, `openai`, `supabase` (implicit or in `apps/web`).
- **Files**:
  - `lib/content/loader.ts`: Uses `fs/promises` server-side and `fetch('/api/...')` client-side.
  - `app/admin/metrics/api/route.ts`: API route for metrics.
  - `app/admin/metrics.json/route.ts`: API route for metrics.
- **Configuration**: Root `package.json` scripts verify DB connection (`vscode-prisma`, etc).

## 3. Issues & Dead Ends
- `apps/web` seems to be a distraction or a failed workspace attempt. It will be removed/ignored.
- The `admin` dashboard likely relies on real data which we are cutting. It will be disabled or replaced with valid static demo data.
- `lib/content/loader.ts` overcomplicates content loading for a static site.

## 4. Pivot Strategy (Preserving Intent)
- **Goal**: Transform into a high-conversion, maintainable consultancy landing page.
- **Approach**:
  - **Prune**: Remove all backend dependencies and `apps/web`.
  - **Centralize Content**: Create `src/content/site.ts` as the single source of truth.
  - **Static Conversion**: Replace `fs` and `fetch` content loading with direct imports of the typed `site.ts` object. This ensures build-time consistency and removes runtime API requirements.
  - **Frontend Polish**: Focus on the "Agentic Consulting Workflow" and "Client-only Workflow Sandbox" components using client-side React.
  - **Safety**: Ensure deterministic builds (lint/typecheck/build) without database requirements.

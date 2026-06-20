# Build & Deployment Reliability Guide

## Toolchain (Pinned)

- Node.js: `22.21.1`
- pnpm: `8.15.0`
- Package manager: `pnpm` only (`pnpm-lock.yaml` is canonical)

## Local setup (clean-room)

```bash
pnpm clean
pnpm ci:install
pnpm doctor
pnpm verify
```

## One-command workflow

1. `pnpm doctor`
2. `pnpm verify`

`verify` runs the same deterministic sequence used by CI/Vercel parity checks:

- doctor
- dependency audit (`high` and `critical` threshold)
- lint
- typecheck
- test
- build

## Vercel parity

- Build command (preview + production): `pnpm vercel-build`
- `pnpm vercel-build` runs `pnpm doctor && pnpm verify`
- CI mirrors this with `.github/workflows/vercel-parity.yml`

## Environment checklist

Expected for **Preview** and **Production**:

- `NEXT_PUBLIC_SITE_URL`
- `VERCEL_ENV`

Optional but supported:

- `NEXT_PUBLIC_APP_ENV`
- `NEXT_PUBLIC_GOOGLE_VERIFICATION`
- `NEXT_PUBLIC_YANDEX_VERIFICATION`
- `NEXT_PUBLIC_YAHOO_VERIFICATION`

### Safety notes

- Doctor validates env presence and schema without printing secret values.
- Doctor reports missing/invalid env keys by mode with grouped diagnostics.

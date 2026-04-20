# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## DSCC artifacts

- `dscc-website` — bilingual public site (React + Vite). Posts inbound leads to `/api/leads`.
- `dscc-admin` — internal CRM dashboard (React + Vite). Bearer-token auth (`ADMIN_TOKEN`, default `dscc-dev-token` in dev). Pages: Dashboard (stats/charts), Leads (filter/CSV export), Lead detail (status, priority, notes), Settings. **Bilingual EN/AR** with full RTL support, Tajawal font for Arabic, persisted in `localStorage["dscc_admin_lang"]`. Default language: Arabic. Burgundy palette (`338 69% 34%`) matched to public website. Logo asset shared with website (`public/logo.svg`). Translation system: `src/lib/i18n.tsx` (React context + dictionary). Status/source labels resolved via `statusKey()`/`sourceKey()` helpers in `src/lib/types.ts`.
- `api-server` — Express. Public `POST /api/leads` (validated + sanitized). Admin endpoints under `/api/admin/*` (timing-safe bearer check, atomic JSON-file persistence at `DATA_DIR/leads.json`, defaults to `./data`). In production, refuses to boot without `ADMIN_TOKEN`.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

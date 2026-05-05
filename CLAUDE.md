# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install          # install dependencies
bun run dev          # start all apps (web on :3001, server on :3000)
bun run dev:web      # web only
bun run dev:server   # server only
bun run check        # biome lint + format (write mode)
bun run check-types  # tsc across all packages
bun run build        # build all packages

# Database (runs against apps/server/.env)
bun run db:push      # push schema to DB
bun run db:generate  # generate migrations
bun run db:migrate   # run migrations
bun run db:studio    # open Drizzle Studio
```

## Architecture

Turborepo monorepo with Bun. Two apps, five shared packages.

**Apps**
- `apps/web` — Next.js 16 App Router on port 3001. Uses tRPC via TanStack Query (`@trpc/tanstack-react-query`). Auth via `better-auth/react` client. Shared UI from `@lens/ui`.
- `apps/server` — Hono server on port 3000. Mounts tRPC at `/trpc/*` and Better Auth at `/api/auth/*`. Built with `tsdown`, runs hot-reload via `bun run --hot`.

**Packages**
- `packages/api` — tRPC router (`appRouter`), context factory, and procedure helpers (`publicProcedure`, `protectedProcedure`). Add new routers here and register them in `src/routers/index.ts`.
- `packages/db` — Drizzle ORM with `node-postgres`. Schema lives in `src/schema/`. `drizzle.config.ts` reads from `apps/server/.env`.
- `packages/auth` — Better Auth instance wired to the Drizzle adapter. Auth schema is in `packages/db/src/schema/auth.ts`.
- `packages/env` — Type-safe env via `@t3-oss/env-core`. Two entry points: `@lens/env/server` and `@lens/env/web`. Always import from the correct one.
- `packages/ui` — Shared shadcn/ui components. Import as `@lens/ui/components/<name>`. Add primitives with `npx shadcn@latest add <component> -c packages/ui`.

**Request flow**
Browser → `apps/web` (Next.js RSC/client) → tRPC `httpBatchLink` → `apps/server` (`/trpc/*`) → `packages/api` router → `packages/db` / `packages/auth`

**Adding a tRPC route**
1. Add a procedure in `packages/api/src/routers/` using `publicProcedure` or `protectedProcedure`.
2. Register it on `appRouter` in `packages/api/src/routers/index.ts`.
3. The web client gets full type inference automatically via `AppRouter`.

## Conventions

- Formatter: Biome with tabs, double quotes for JS/TS.
- Husky + lint-staged run `biome check --write` on commit.
- Workspace package versions are pinned in the root `package.json` `catalog` field — reference them as `catalog:` in individual `package.json` files.
- Server env vars: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `CORS_ORIGIN` — defined in `apps/server/.env`.
- Web env vars: `NEXT_PUBLIC_SERVER_URL` — defined in `apps/web/.env`.

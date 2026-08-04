# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Commands

Always use `pnpm` (never npm or yarn).

```bash
pnpm dev              # web + collab + tldraw-sync (parallel)
pnpm dev:web          # Next.js only (:3000)
pnpm collab:dev       # Hocuspocus only
pnpm dev:realtime     # Nest Socket.io Kanban (:4001)
pnpm build            # @refstash/web production build
pnpm start            # prisma migrate deploy + web start
pnpm lint             # Biome check (repo root)
pnpm format           # Biome format --write
pnpm test             # Vitest watch (@refstash/web)
pnpm test:run         # Vitest single run
pnpm test -- src/lib/ai/note-content-edit.test.ts
pnpm db:generate      # prisma generate
pnpm db:migrate       # prisma migrate dev
pnpm commit           # Commitizen
```

Never use `--no-verify` on git. If a hook fails, fix the problem.

## Architecture

**Refstash** is a **pnpm monorepo** (`0.2.0-beta.1`) for collaborative notes, resource collections, boards, and an in-app AI agent — multi-tenant via Better Auth organizations (workspaces).

| Package | Role |
|---------|------|
| `apps/web` (`@refstash/web`) | Next.js 16 App Router — UI + API |
| `apps/collab` (`@refstash/collab`) | Hocuspocus / Y.js realtime for notes |
| `apps/realtime` (`@refstash/realtime`) | Nest + Socket.io — Kanban fan-out (Redis) |
| `apps/tldraw-sync` (`@refstash/tldraw-sync`) | Cloudflare Worker — tldraw board sync |
| `packages/shared` (`@refstash/shared`) | Shared Zod schemas + types |
| `prisma/` | PostgreSQL schema + migrations (root) |

**Stack (web):** React 19 + React Compiler, TypeScript strict, Tailwind CSS v4, shadcn/ui on **Base UI**, Tiptap, tldraw, TanStack Query v5, React Hook Form + Zod, Better Auth, Prisma 7, AI SDK, Biome, Vitest.

### Data flow

```
React Components
  → TanStack Query (apps/web/src/hook/)
    → Next.js API (apps/web/src/app/api/)
      → Prisma (apps/web/src/lib/prisma.ts / src/server/)
        → PostgreSQL

Notes CRDT: Tiptap Collaboration → apps/collab (Hocuspocus)
Boards: tldraw → JWT → apps/tldraw-sync (Durable Object + optional R2)
```

Prisma clients are generated to:
- `apps/web/src/generated/prisma`
- `apps/collab/src/generated/prisma`

Import the web client via `apps/web/src/lib/prisma.ts` — never commit generated folders.

### Key directories (web)

- `apps/web/src/app/` — routes, layouts, API
- `apps/web/src/components/` — feature UI (`notes`, `chat`, `boards`, `collections`, `dashboard`, `workspace`, …)
  - `ui/` — shadcn primitives
  - `base/` — shared layout/structure
- `apps/web/src/hook/` — global TanStack Query hooks + `*Keys.ts`
- `apps/web/src/lib/` — auth, storage, env, Tiptap config, `ai/`, `extension/`
- `apps/web/src/server/` — session/ACL helpers (`requireSession()`, etc.)
- `apps/web/src/types/` — web-only types/schemas
- `packages/shared/src/` — shared domain schemas/types

### Routing

- `/` — landing
- `/login`, `/register`, `/verify-email`
- `/workspace/new` — create workspace
- `/invite/[id]`
- `/docs/*` — in-app docs (MDX)
- `/[workspaceSlug]` — workspace home
- `/[workspaceSlug]/notes`, `/notes/[id]`
- `/[workspaceSlug]/collections`, `/collections/[id]`
- `/[workspaceSlug]/categories`
- `/[workspaceSlug]/boards`, `/boards/[id]`
- `/api/*` — serverless APIs (`ai`, `notes`, `workspace`, `collab`, `upload`, …)

### Hooks placement

- **Global data fetching** → `apps/web/src/hook/<feature>/`
- **Local form/UI hooks** → `apps/web/src/components/<feature>/hook/` or `hooks/`

### API response format

```typescript
return Response.json({ message: "...", data: ... }, { status: 201 })
return Response.json({ error: "User-friendly message", code: "ERROR_CODE" }, { status: 400 })
```

### Env setup

- Root `.env` — `DATABASE_URL` (see `.env.example`)
- `apps/web/.env` — full web env (see `apps/web/.env.example`)
- `apps/collab/.env` — collab server
- `apps/tldraw-sync/.dev.vars` — local Worker secrets (not `.env`; see `.dev.vars.example`)

`ANTHROPIC_API_KEY` is required by `apps/web/src/lib/env.ts`.

## Conventions

- Path alias: `@/*` → `apps/web/src/*`; shared package: `@refstash/shared`
- Prefer domain schemas in `@refstash/shared`; keep web-only schemas under `apps/web/src/types/schema/`
- Components: PascalCase `.tsx`; hooks: `useXxx.ts`; types: `*.type.ts`; schemas: `*.schema.ts`
- `"use client"` only when using state, hooks, or browser events
- Variants: CVA + `cn()` from `@/lib/utils`
- UI: shadcn/ui on **Base UI** — do not use Radix primitives directly
- Tiptap config: `apps/web/src/lib/notes-editor-config.ts`; extensions: `lib/extension/`
- Note content is Tiptap **JSON**, not HTML
- AI agent: `lib/ai/` + `components/chat/`; domain docs in `docs/ia.md` and `docs/boards.md`
- Tests: `vi.mock()` / `vi.hoisted()`; `*.test.ts` co-located
- Project agent skills: `.agents/skills/` (shadcn, building-components, workflow)

## Before Creating Anything

**Always search before creating.** Check existing components, hooks, contexts, utils, API routes, and `packages/shared` first. If something already covers ~80% of the need, extend it.

## Single Responsibility

Each module does **one thing**: UI components don't fetch; hooks don't mix unrelated concerns; contexts stay domain-scoped; API handlers stay single-action.

## .gitignore Hygiene

Never commit: `.env*`, `.dev.vars`, `**/src/generated/prisma`, `prisma/*.db*`, build artifacts. Update `.gitignore` before the first `git add` of generated files.

## Design Patterns

### Components

- Prefer `apps/web/src/components/ui/` (shadcn). Create from scratch only if no equivalent exists.
- **Border radius:** follow the primitive defaults (Button → `rounded-2xl`, Dialog → `--radius-*` tokens). Do not invent ad-hoc `rounded-md` / force `rounded-xl` everywhere.

### Colors

Never hardcode palette colors (`bg-blue-500`, etc.). Use semantic tokens from `apps/web/src/app/globals.css`:

- Backgrounds: `bg-background`, `bg-card`, `bg-muted`, `bg-accent`, `bg-primary`, `bg-secondary`, `bg-destructive`, `bg-popover`, `bg-sidebar`, `bg-sidebar-accent`
- Text: `text-foreground`, `text-muted-foreground`, `text-primary`, `text-secondary-foreground`, `text-accent-foreground`, `text-destructive`, `text-sidebar-foreground`
- Borders: `border-border`, `border-input`, `border-sidebar-border`
- Rings: `ring-ring`, `ring-sidebar-ring`

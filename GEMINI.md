# Refstash — Agent / Gemini Guide

Refstash is a **pnpm monorepo** for collaborative notes, resource collections, visual boards, and an in-app AI agent. Workspaces are Better Auth organizations (multi-tenant).

## Tech stack

- **Apps:** Next.js 16 (`apps/web`), Hocuspocus (`apps/collab`), Cloudflare Worker + tldraw sync (`apps/tldraw-sync`)
- **Shared:** `@refstash/shared` (Zod schemas + types)
- **UI:** React 19 (React Compiler), Tailwind CSS v4, shadcn/ui on [Base UI](https://base-ui.com/react), Hugeicons
- **Data:** Prisma 7 + PostgreSQL (schema at repo root `prisma/`)
- **Auth:** Better Auth
- **Editors:** Tiptap (notes + Y.js collab), tldraw (boards)
- **AI:** Vercel AI SDK (`apps/web/src/lib/ai/`, chat UI in `components/chat/`)
- **Tooling:** Biome 2.2, Vitest, pnpm workspaces

## Monorepo layout

```
apps/web/              # @refstash/web — Next.js UI + API
apps/collab/           # @refstash/collab — realtime notes
apps/tldraw-sync/      # @refstash/tldraw-sync — board WebSocket worker
packages/shared/       # @refstash/shared — schemas/types
prisma/                # schema + migrations
docs/                  # domain docs (ia.md, boards.md)
.agents/skills/        # local agent skills
```

Prisma client outputs:

- `apps/web/src/generated/prisma`
- `apps/collab/src/generated/prisma`

Import via `apps/web/src/lib/prisma.ts` (web). Do not commit generated clients.

## Web app structure (`apps/web/src`)

- `app/` — App Router (landing, auth, onboarding, `/[workspaceSlug]/*`, `/api/*`, docs MDX)
- `components/` — feature UI (`notes`, `chat`, `boards`, `collections`, `ui`, …)
- `hook/` — global TanStack Query hooks
- `lib/` — auth, env, storage, Tiptap, AI, extensions
- `server/` — session / ACL helpers
- `types/` — web-only types and schemas
- `context/` — React contexts

Path alias: `@/*` → `./src/*` (within `apps/web`). Shared imports: `@refstash/shared`.

## Key routes

| Path | Purpose |
|------|---------|
| `/` | Landing |
| `/login`, `/register` | Auth |
| `/workspace/new` | Create workspace |
| `/[workspaceSlug]/notes/[id]` | Note editor |
| `/[workspaceSlug]/boards/[id]` | Board canvas |
| `/[workspaceSlug]/collections` | Resource collections |
| `/docs/*` | Product/tech docs |
| `/api/ai/*` | Agent chat, skills, settings, models |

## Commands (always `pnpm`)

```bash
pnpm install
pnpm dev                 # web + collab + tldraw-sync
pnpm dev:web
pnpm build
pnpm lint
pnpm format
pnpm test / pnpm test:run
pnpm db:generate
pnpm db:migrate
pnpm commit
```

## Environment

1. Root `.env` ← `.env.example` (`DATABASE_URL`)
2. `apps/web/.env` ← `apps/web/.env.example` (auth, storage, collab URLs, `ANTHROPIC_API_KEY`, …)
3. `apps/collab/.env` ← `apps/collab/.env.example`
4. `apps/tldraw-sync/.dev.vars` ← `.dev.vars.example` (Wrangler local secrets; not `.env`)

## Conventions

- Prefer existing shadcn/ui components; Base UI underneath — do not reach for Radix directly
- Semantic Tailwind colors only (no hardcoded `bg-blue-500`, etc.)
- Follow primitive border-radius defaults (e.g. Button `rounded-2xl`); avoid ad-hoc radius overrides
- Domain Zod schemas live in `packages/shared`; do not duplicate in the web app
- Note content is Tiptap JSON; convert with `lib/ai/note-to-text.ts` / `lib/notes-html.ts` when needed
- Search before creating new components, hooks, contexts, utils, or API routes
- Never commit secrets, `.dev.vars`, or `**/src/generated/prisma`
- Never skip git hooks (`--no-verify`)

See also: `AGENTS.md` (PT, detailed), `CLAUDE.md` (architecture), `docs/ia.md`, `docs/boards.md`.

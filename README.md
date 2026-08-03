# Refstash

Aplicação colaborativa multi-tenant para notas, coleções de recursos, boards (canvas) e assistente de IA — monorepo pnpm.

## Stack

- **Next.js 16** (App Router) + **React 19** — `apps/web`
- **Hocuspocus / Y.js** — collab de notas (`apps/collab`)
- **tldraw + Cloudflare Worker** — boards (`apps/tldraw-sync`)
- **TypeScript** (strict) + **Tailwind CSS v4** + **shadcn/ui** (Base UI)
- **Tiptap** — editor rico com extensões e colaboração
- **TanStack Query v5** — data fetching
- **Better Auth** — autenticação + organizations (workspaces)
- **Prisma 7** + **PostgreSQL** — schema na raiz (`prisma/`)
- **@refstash/shared** — schemas Zod e tipos compartilhados
- **S3-compatible storage** — upload de imagens
- **AI SDK** — agente no chat / editor
- **Biome** — lint/format | **Vitest** — testes

## Requisitos

- Node.js 20+
- pnpm
- PostgreSQL
- Storage S3-compatible (Garage, MinIO, AWS S3, etc.) — opcional conforme features
- Wrangler (dev de boards) — opcional

## Instalação

```bash
pnpm install
```

Configure as variáveis:

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env
cp apps/collab/.env.example apps/collab/.env
# Boards (dev local do Worker):
cp apps/tldraw-sync/.dev.vars.example apps/tldraw-sync/.dev.vars
```

Rode as migrations:

```bash
pnpm db:migrate
```

## Variáveis de ambiente (web)

Principais chaves em `apps/web/.env.example`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/refstash
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:3000
STORAGE_ENDPOINT=...
STORAGE_BUCKET=...
STORAGE_ACCESS_KEY=...
STORAGE_SECRET_KEY=...
STORAGE_REGION=...
NEXT_PUBLIC_COLLAB_WS_URL=ws://localhost:1234
COLLAB_JWT_SECRET=...
NEXT_PUBLIC_TLDRAW_SYNC_WS_URL=ws://127.0.0.1:8787
ANTHROPIC_API_KEY=sk-ant-...
```

Na raiz, `.env` precisa pelo menos de `DATABASE_URL` para o Prisma.

## Comandos

```bash
pnpm dev          # web + collab + tldraw-sync
pnpm dev:web      # só Next.js
pnpm build        # build do web
pnpm start        # migrate deploy + start
pnpm lint         # Biome
pnpm format       # Biome format
pnpm test         # Vitest (watch)
pnpm test:run     # Vitest (single run)
pnpm db:migrate   # migrations
pnpm commit       # Commitizen
```

## Estrutura

```
apps/
  web/src/           # Next.js — app/, components/, hook/, lib/, server/
  collab/            # Hocuspocus
  tldraw-sync/       # Worker tldraw
packages/shared/     # schemas + types
prisma/              # schema + migrations
docs/                # ia.md, boards.md
```

Rotas autenticadas usam `/[workspaceSlug]/…` (notes, collections, categories, boards).

## Docs para agentes

- [AGENTS.md](./AGENTS.md) — guia completo (PT)
- [CLAUDE.md](./CLAUDE.md) — arquitetura e convenções
- [GEMINI.md](./GEMINI.md) — overview rápido
- [docs/ia.md](./docs/ia.md) — assistente de IA
- [docs/boards.md](./docs/boards.md) — boards / tldraw

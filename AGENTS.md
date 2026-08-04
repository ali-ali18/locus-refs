# AGENTS.md - Guia para Agentes de Código

Orientações para agentes que operam neste repositório.

---

## 1. Visão do Monorepo

**Refstash** é um monorepo **pnpm workspaces** (versão `0.2.0-beta.1`) para notas, coleções, boards e assistente de IA em workspaces multi-tenant.

| Pacote | Nome | Papel |
|--------|------|-------|
| `apps/web` | `@refstash/web` | Next.js 16 (App Router) — UI, API routes, auth |
| `apps/collab` | `@refstash/collab` | Servidor Hocuspocus (Y.js) — collab de notas |
| `apps/realtime` | `@refstash/realtime` | Nest + Socket.io — fan-out Kanban (Redis) |
| `apps/tldraw-sync` | `@refstash/tldraw-sync` | Cloudflare Worker — sync de boards (tldraw) |
| `packages/shared` | `@refstash/shared` | Tipos e schemas Zod compartilhados |
| `prisma/` | — | Schema e migrations na raiz (PostgreSQL) |

Prisma gera clients em:
- `apps/web/src/generated/prisma`
- `apps/collab/src/generated/prisma`

Sempre usar **pnpm** (nunca npm ou yarn).

---

## 2. Comandos

```bash
# Desenvolvimento (web + collab + tldraw-sync em paralelo)
pnpm dev

# Só o web
pnpm dev:web
pnpm collab:dev
pnpm dev:realtime          # Nest Socket.io Kanban (:4001)

# Build / start
pnpm build
pnpm start                 # migrate deploy + start do web

# Lint e formatação (Biome na raiz)
pnpm lint
pnpm format

# Testes (Vitest no @refstash/web)
pnpm test
pnpm test:run
pnpm test -- src/lib/ai/note-content-edit.test.ts
pnpm --filter @refstash/web test:run src/app/api/notes/route.test.ts

# Banco
pnpm db:generate           # prisma generate
pnpm db:migrate            # prisma migrate dev
pnpm db:push

# Commit estruturado
pnpm commit
```

Nunca use `--no-verify` em git. Se um hook falhar, corrija o problema.

---

## 3. Setup local

1. `pnpm install` (roda `prisma generate` no `postinstall`)
2. Copiar envs:
   - Raiz: `.env` a partir de `.env.example` (`DATABASE_URL`)
   - Web: `apps/web/.env` a partir de `apps/web/.env.example`
   - Collab: `apps/collab/.env` a partir de `apps/collab/.env.example`
   - Tldraw (dev): `apps/tldraw-sync/.dev.vars` a partir de `.dev.vars.example` (não usa `.env`)
3. `pnpm db:migrate`
4. `pnpm dev`

Variáveis importantes do web: `DATABASE_URL`, `BETTER_AUTH_*`, storage S3, `NEXT_PUBLIC_COLLAB_WS_URL`, `COLLAB_JWT_SECRET`, `NEXT_PUBLIC_TLDRAW_SYNC_WS_URL`, `ANTHROPIC_API_KEY` (obrigatória), opcionais de email/Resend e `MINIMAX_API_KEY`.

---

## 4. Arquitetura e data flow

```
React (apps/web)
  → TanStack Query (apps/web/src/hook/)
    → Next.js API routes (apps/web/src/app/api/)
      → Prisma (apps/web/src/lib/prisma.ts / src/server/)
        → PostgreSQL

Notas em tempo real:
  Tiptap Collaboration → Hocuspocus (apps/collab) → Y.js / DB

Boards:
  tldraw client → JWT (/api/collab/board-token) → Worker (apps/tldraw-sync) → Durable Object
```

### Rotas principais (web)

- `/` — landing
- `/login`, `/register`, `/verify-email` — auth
- `/workspace/new` — onboarding de workspace
- `/invite/[id]` — convite
- `/docs/*` — documentação interna (MDX)
- `/[workspaceSlug]` — home do workspace
- `/[workspaceSlug]/notes`, `/notes/[id]`
- `/[workspaceSlug]/collections`, `/collections/[id]`
- `/[workspaceSlug]/categories`
- `/[workspaceSlug]/boards`, `/boards/[id]`
- `/api/*` — API serverless

### Domínios de API

`ai` (chat, models, settings, skills, threads), `auth`, `categories`, `collab`, `collection`, `cron`, `docs`, `fetchMetadata`, `notes`, `resources`, `upload`, `user`, `workspace`.

### Formato de resposta da API

```typescript
// Sucesso
return Response.json({ message: "...", data: ... }, { status: 201 })

// Erro
return Response.json(
  { error: "Mensagem amigável", code: "ERROR_CODE" },
  { status: 400 }
)
```

---

## 5. Estrutura de diretórios

```
apps/
  web/src/
    app/                 # App Router (páginas + api)
    components/          # Features (notes, chat, boards, dashboard, …)
      ui/                # shadcn/ui (Base UI)
      base/              # Layout / estrutura compartilhada
    hook/                # TanStack Query global (notes, ai, workspace, …)
    lib/                 # auth, prisma, storage, ai/, extension/, collab utils
    server/              # Helpers server-side (session, ACL)
    context/             # Contextos React
    types/               # Tipos locais + schemas específicos do web
    generated/prisma/    # Client Prisma (não commitar)
  collab/src/            # Hocuspocus server
  tldraw-sync/src/       # Worker + Durable Object
packages/shared/src/
  schemas/               # Zod: note, category, collection, board, workspace
  types/                 # Tipos compartilhados
prisma/                  # schema.prisma + migrations
docs/                    # Docs de domínio (ia.md, boards.md)
.agents/skills/          # Skills locais (shadcn, building-components, workflow)
```

### Path alias

- `@/*` → `apps/web/src/*`
- Pacote compartilhado: `@refstash/shared`

### Onde colocar código

| Tipo | Onde |
|------|------|
| Schema/tipo de domínio compartilhado | `packages/shared` |
| Schema só do web (auth, skill, resource) | `apps/web/src/types/schema/` |
| Hook de data fetching global | `apps/web/src/hook/<feature>/` |
| Hook local de UI/form | `apps/web/src/components/<feature>/hook/` |
| Extensão Tiptap | `apps/web/src/lib/extension/` |
| Lógica de IA | `apps/web/src/lib/ai/` |
| UI do agente/chat | `apps/web/src/components/chat/` |

---

## 6. Convenções

### Stack

Next.js 16, React 19 (React Compiler), TypeScript strict, Tailwind CSS v4, shadcn/ui + **Base UI** (não Radix direto), Tiptap, tldraw, TanStack Query v5, Better Auth (organizations = workspaces), Prisma 7 + PostgreSQL, Zod, AI SDK, Biome 2.2, Vitest.

### Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componentes | PascalCase | `NoteEditor.tsx` |
| Hooks | `useXxx` | `useNotes.ts` |
| Tipos | `*.type.ts` | `note.type.ts` |
| Schemas Zod | `*.schema.ts` | `note.schema.ts` |
| Testes | `*.test.ts` | co-localizados |

### UI

- Preferir componentes em `components/ui/` (shadcn). Só criar do zero se não houver equivalente.
- Variantes com CVA + `cn()` de `@/lib/utils`.
- **Cores:** nunca hardcodar (`bg-blue-500`, etc.). Usar tokens semânticos (`bg-background`, `text-muted-foreground`, `border-border`, …) de `globals.css`.
- **Border radius:** seguir o padrão do primitive shadcn (ex.: Button usa `rounded-2xl`, Dialog usa tokens `--radius-*`). Não forçar `rounded-xl`/`rounded-md` ad hoc; evite sobrescrever radius sem motivo.
- Ícones: Hugeicons (`@hugeicons/react`) quando já usado no fluxo.

### TipTap / notas

- Config: `apps/web/src/lib/notes-editor-config.ts`
- Conteúdo persistido como **JSON Tiptap** (`Note.content`), não HTML
- Collab via `@hocuspocus/provider` + `NEXT_PUBLIC_COLLAB_WS_URL`
- IA: texto via `lib/ai/note-to-text.ts`; edição via `lib/ai/note-content-edit.ts`

### IA / Agent

- Chat: `POST /api/ai/chat` (streaming)
- Skills: CRUD em `/api/ai/skills`, UI em `components/chat/`
- Threads: privadas ou de workspace (`AgentThread`)
- Settings por workspace: `WorkspaceAiSettings`
- Docs de domínio: `docs/ia.md`, `docs/boards.md`

### Antes de criar qualquer coisa

Sempre buscar equivalente existente (`components/`, `hook/`, `lib/`, `api/`, `packages/shared`). Se cobrir ~80% da necessidade, estender em vez de duplicar.

### Single responsibility

Componente renderiza UI; hook cuida de uma preocupação; API route = uma ação de recurso; contexto = um slice de estado.

---

## 7. Code review (antes do commit)

Em português:

1. `git status`
2. `git diff` (unstaged)
3. `git diff --staged`
4. Procurar: bugs, secrets, `console.log`/`debugger`, código morto, imports quebrados, perf óbvia
5. Listar arquivo + linha + correção
6. Se limpo, confirmar

Nunca `--no-verify` / desabilitar hooks.

---

## 8. .gitignore

Nunca commitar:

- `.env`, `.env.*` (exceto `*.example`), `.dev.vars`
- `**/src/generated/prisma`
- `prisma/*.db*`
- `.next/`, `node_modules/`, artefatos de build

Ao adicionar ferramenta que gera arquivos, atualizar `.gitignore` **antes** do primeiro `git add`.

---

## 9. Notas para agentes

- `"use client"` só com state, hooks ou eventos de browser
- Data fetching no client → TanStack Query; mutations com invalidation
- API routes são serverless — sem estado global em memória
- Testes: `vi.mock()` / `vi.hoisted()` (Vitest)
- Schemas de domínio preferir `@refstash/shared`; não duplicar no web
- Skills do projeto em `.agents/skills/` (shadcn, building-components, workflow Vercel)
- Documentação de produto/arquitetura em `docs/` e `/docs` (MDX no app)

# PLAN — Realtime Kanban (Nest + Socket.io)

Guia passo a passo para implementar no monorepo.  
Vá marcando `[x]` conforme concluir. Em cada passo, peça ajuda no chat se travar.

**Modelo:** estilo Trello — Postgres é a verdade; Socket só avisa; last-write-wins; sem lock; sem BullMQ no v1.

---

## Visão rápida

```
Browser A → API Next → Postgres
                 ↓
               Redis (PUBLISH)
                 ↓
               Nest Socket.io → Browser B
```

| Peça | Pasta / papel |
|------|----------------|
| Tipos de evento | `packages/shared` |
| Serviço WS | `apps/realtime` (Nest + Socket.io) |
| Publish após mutação | `apps/web` (API kanban + agent tools) |
| Client | hook + `WrapperKanban` |
| Infra | Redis local (`REDIS_URL`) |

---

## Pré-requisitos

- [ ] Redis rodando local (Docker ok: `docker run -d -p 6379:6379 redis:7`)
- [ ] Branch atual: `feat/kanban-area` (ou branch nova a partir dela)
- [ ] Entender: **não** vamos usar Yjs no Kanban; **não** BullMQ no v1

Env que vamos precisar (anotar, preencher depois):

```env
# apps/realtime + apps/web
REDIS_URL=redis://127.0.0.1:6379
REALTIME_JWT_SECRET=trocar-por-segredo-longo
NEXT_PUBLIC_REALTIME_WS_URL=http://localhost:4001
```

---

## Passo 0 — Decisões (já fechadas)

- [x] Serviço em `apps/realtime` (monorepo), não repo separado
- [x] Nest + Socket.io + Redis
- [x] Concorrência Trello (LWW)
- [x] Presence leve (online no board) — pode ser no final do v1
- [x] Chat futuro: só reservar mentalmente namespace; **não implementar agora**

---

## Passo 1 — Contrato de eventos (`packages/shared`)

**Objetivo:** um tipo compartilhado entre web e Nest.

- [x] Criar `packages/shared/src/realtime/kanban-realtime.ts` (ou similar)
- [x] Definir union discriminada, por exemplo:
  - `card.created` | `card.updated` | `card.moved` | `card.deleted`
  - `column.created` | `column.updated` | `column.deleted`
  - `board.updated` | `board.deleted`
- [x] Cada evento com: `type`, `boardId`, `workspaceId`, `actorId`, `at` (ISO), `payload` mínimo (ids + campos mudados — **não** o board inteiro)
- [x] Helper `boardRoom(boardId) => \`board:${boardId}\``
- [x] Constante do canal Redis: `KANBAN_EVENTS_CHANNEL = "kanban:events"`
- [x] Exportar no `packages/shared` `index`
- [x] Build/check do shared (`pnpm --filter @refstash/shared ...` se existir)

**Done when:** web e realtime conseguem importar o mesmo tipo.

---

## Passo 2 — Scaffold `apps/realtime`

**Objetivo:** Nest sobe, health ok, Socket.io aceita conexão (mesmo sem kanban ainda).

- [x] Criar app Nest em `apps/realtime` (`@refstash/realtime`)
- [x] Dependências: `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`, `ioredis`, `@socket.io/redis-adapter`, `jsonwebtoken`, `@refstash/shared`, `dotenv` (Prisma no Passo 3)
- [x] Porta `4001` + `dotenv/config` no `main.ts`
- [x] `GET /health`
- [x] `.env.example` com `REDIS_URL`, `DATABASE_URL`, `REALTIME_JWT_SECRET`, `PORT`
- [x] Script root: `"dev:realtime": "pnpm --filter @refstash/realtime dev"`
- [ ] (Opcional) incluir no `pnpm dev` paralelo

**Done when:** `pnpm dev:realtime` sobe e `/health` responde.

---

## Passo 3 — Auth Socket + rooms

**Objetivo:** só membro do workspace entra no room do board.

- [x] Em `apps/web`: `GET /api/realtime/token` (sessão Better Auth → JWT `{ userId, workspaceId, name, image }`)
- [x] Gateway Nest: validar JWT no `connection` (handshake `auth.token`)
- [x] Evento client → server: `board:join` `{ boardId }`
  - Nest confere: board existe, `workspaceId` do JWT, `deletedAt` null, user é member
  - `socket.join(boardRoom(boardId))`
- [x] `board:leave` → `socket.leave(...)`
- [x] Presence mínima: ao join/leave, emitir `presence:sync` / `presence:leave` no room
- [x] PrismaService Nest ([docs](https://docs.nestjs.com/recipes/prisma)) + generator `realtime_client`

**Done when:** client autenticado entra no room; user de outro workspace é rejeitado.

**Env:** preencher `DATABASE_URL` + `REALTIME_JWT_SECRET` em `apps/realtime/.env` **e** `REALTIME_JWT_SECRET` (+ depois `NEXT_PUBLIC_REALTIME_WS_URL`) no web.

---

## Passo 4 — Redis: adapter + subscriber

**Objetivo:** Nest escuta eventos e emite no room certo.

- [x] Redis adapter no Socket.io (multi-instância) — `redis-io.adapter.ts` + `main.ts`
- [x] Subscriber no canal `kanban:events` — `kanban-events.subscriber.ts`
- [x] Ao receber JSON válido → `server.to(boardRoom(boardId)).emit("kanban:event", event)`
- [x] Log se payload inválido; não derrubar o processo

**Done when:** `PUBLISH kanban:events '{...}'` faz o client no room receber `kanban:event`.

---

## Passo 5 — Publish no Next (best-effort)

**Objetivo:** depois de gravar no Postgres, avisar o Redis.

- [x] Helper server-only: `apps/web/src/lib/realtime/publish-kanban-event.ts`
  - `publishKanbanEvent(event)` com ioredis
  - se Redis cair: `console.error` / log e **não** falhar a API
- [x] Chamar após sucesso em:
  - [x] `POST/PATCH/DELETE` cards
  - [x] `POST/PATCH/DELETE` columns
  - [x] `PATCH/DELETE` board
- [x] Chamar também nas tools do Agent que mutam kanban (`workspace-tools.ts`)

**Done when:** move um card na UI → mensagem aparece no Redis (monitor) → Nest reemite.

---

## Passo 6 — Client web (`useKanbanRealtime`)

**Objetivo:** segundo browser atualiza sozinho.

- [x] Dependência `socket.io-client` no `@refstash/web`
- [x] Hook `useKanbanRealtime(boardId)`:
  1. busca token
  2. conecta em `NEXT_PUBLIC_REALTIME_WS_URL`
  3. `board:join`
  4. on `kanban:event` → `queryClient.setQueryData(kanbanKeys.detail(...), merge)`
- [x] Regras de merge:
  - [x] criar/atualizar/deletar card/coluna no cache
  - [x] se estiver arrastando o mesmo `cardId`, **ignorar** evento remoto desse card até fim do drag
  - [x] dialog aberto com form dirty: **não** sobrescrever inputs; só o cache do board
  - [x] `board.deleted` → invalidate lista + redirect
- [x] Wire em `WrapperKanban`
- [x] Env `NEXT_PUBLIC_REALTIME_WS_URL` no `.env.example` do web

**Done when:** dois browsers no mesmo board; move no A → B atualiza sem refresh.

---

## Passo 7 — Presence na UI (opcional no mesmo PR)

- [x] Escutar `presence:*` no hook
- [x] Mostrar avatares “online” na toolbar do board (`KanbanBoardToolbar`)
- [x] Sem bloquear edição

---

## Passo 8 — Polimento

- [x] `docs/realtime.md` curto (arquitetura + envs + como testar)
- [x] Atualizar `AGENTS.md` / `CLAUDE.md` com `pnpm dev:realtime` se fizer sentido
- [ ] Teste manual checklist:
  - [ ] move card
  - [ ] editar título
  - [ ] criar / deletar card
  - [ ] reordenar coluna
  - [ ] soft-delete board (outro client some / redireciona)
  - [ ] Redis down: API ainda salva; só não synca

---

## Fora deste PLAN (fase 2+)

- BullMQ (lembretes, e-mail, jobs)
- Cache Redis do JSON do board
- Lock / “fulano está editando” / HTTP 409
- CRDT / Hocuspocus no Kanban
- Chat / DM no mesmo Nest
- Migrar notas ou tldraw para este serviço

---

## Como usar este doc com o agente

1. Escolha o próximo passo com `- [ ]` aberto (comece pelo **Passo 1**).
2. No chat: *“vamos fazer o Passo N do PLAN-realtime-kanban”*.
3. Implemente (ou peça o patch); marque `[x]` aqui quando validar o **Done when**.
4. Não pule publish (5) antes do client (6) se quiser testar ponta a ponta — a ordem 1→6 é a mais segura.

**Próximo:** teste manual do checklist (Passo 8) — `pnpm dev:realtime` + `pnpm dev:web` + Redis.

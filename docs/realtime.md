# Realtime (Kanban)

Fan-out de eventos Kanban via Nest + Socket.io + Redis.  
Postgres continua a fonte da verdade (estilo Trello / last-write-wins).

## Arquitetura

```
Browser A → Next API → Postgres
                ↓
          Redis PUBLISH kanban:events
                ↓
          apps/realtime (Nest) SUBSCRIBE
                ↓
          Socket.io room board:{id} → Browser B
```

## Apps

| App | Papel |
|-----|--------|
| `apps/web` | API publica eventos; client `useKanbanRealtime` |
| `apps/realtime` | JWT auth, rooms, presence, Redis adapter + subscriber |

## Env

### `apps/realtime/.env`

```env
PORT=4001
DATABASE_URL=...
REDIS_URL=redis://127.0.0.1:6379
REALTIME_JWT_SECRET=...
```

### `apps/web/.env`

```env
NEXT_PUBLIC_REALTIME_WS_URL=http://localhost:4001
REALTIME_JWT_SECRET=...   # mesmo secret
REDIS_URL=redis://127.0.0.1:6379
```

## Deploy (Docker)

Build a partir da **raiz** do monorepo (mesmo padrão do collab/web):

```bash
docker build -f apps/realtime/Dockerfile -t refstash-realtime .
```

Redis **não** vai na imagem — sobe numa instância separada e passa `REDIS_URL` no painel (Dokploy/VPS).

Envs obrigatórias no container:

| Var | Notas |
|-----|--------|
| `DATABASE_URL` | Mesmo Postgres do web |
| `REDIS_URL` | Redis externo |
| `REALTIME_JWT_SECRET` | **Igual** ao do web |
| `PORT` | Default `4001` |

No web de produção: `NEXT_PUBLIC_REALTIME_WS_URL` apontando para o host/porta públicos deste serviço + `REDIS_URL` + mesmo `REALTIME_JWT_SECRET`.

## Dev

```bash
pnpm dev:realtime
pnpm dev:web
```

## Teste rápido

1. Dois browsers no mesmo board.
2. Mova um card no A → B atualiza sem refresh.
3. Avatares de presence na toolbar.
4. Com Redis down: API ainda salva; só não synca.

Guia passo a passo: [`PLAN-realtime-kanban.md`](../PLAN-realtime-kanban.md).

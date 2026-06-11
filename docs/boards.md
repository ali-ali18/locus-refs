# Boards — Canvas Colaborativo

## Visão geral

O Refstash possui um canvas visual colaborativo integrado ao workspace. Cada board é um quadro infinito onde membros do time podem criar formas, sticky notes, setas, diagramas e qualquer outro elemento visual — em tempo real, sem conflitos, com cursores de colaboradores visíveis.

![Lista de boards do workspace](./images/boards-lista.png)

Cada workspace pode ter múltiplos boards, ordenados pelo mais recentemente aberto.

---

## Infraestrutura

O feature de Boards usa dois serviços distintos: o web app (Next.js, `apps/web`) e um Cloudflare Worker dedicado à sincronização do canvas (`apps/tldraw-sync`).

```
┌──────────────────────────────────────────────────────────────────┐
│  apps/web (Next.js — Vercel / Node)                              │
│                                                                  │
│  - CRUD de boards (PostgreSQL via Prisma)                        │
│  - Emite JWT de autenticação do board                            │
│  - Não toca no conteúdo do canvas                                │
└──────────────────────────┬───────────────────────────────────────┘
                           │  WebSocket  (wss://tldraw-sync.*)
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│  apps/tldraw-sync (Cloudflare Worker)                            │
│                                                                  │
│  - Valida JWT de board (COLLAB_JWT_SECRET)                       │
│  - Roteia para o Durable Object do board                         │
│  - Serve e armazena assets no R2                                 │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  TldrawDurableObject (1 instância por board)            │    │
│  │                                                         │    │
│  │  - SQLite embutido: shapes persistidas no próprio DO    │    │
│  │  - TLSocketRoom: protocolo TLSync em memória            │    │
│  │  - WebSockets: um por aba/cliente conectada             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Bindings Cloudflare:                                            │
│    TLDRAW_DURABLE_OBJECT — Durable Object namespace              │
│    UPLOADS               — R2 bucket (assets do canvas)          │
│    COLLAB_JWT_SECRET     — secret (via wrangler secret put)       │
└──────────────────────────────────────────────────────────────────┘
```

---

## Durable Objects — 1 por board

O `TldrawDurableObject` (`apps/tldraw-sync/src/TldrawDurableObject.ts`) é instanciado uma vez por board, usando o `boardId` como nome estável:

```ts
const doId = env.TLDRAW_DURABLE_OBJECT.idFromName(`board-${boardId}`);
const stub = env.TLDRAW_DURABLE_OBJECT.get(doId);
```

Isso garante que dois clientes abrindo o mesmo board sempre chegam à **mesma instância** do DO, que mantém o estado de sync em memória.

### Persistência via SQLite

O conteúdo do canvas (shapes, estilos, posições) é persistido no **SQLite embutido do Durable Object**, gerenciado por `SQLiteSyncStorage` + `DurableObjectSqliteSyncWrapper` do `@tldraw/sync-core`. Os dados sobrevivem a reinicializações do Worker — só a sessão de sync em memória é descartada quando não há clientes conectados.

```ts
const sql = new DurableObjectSqliteSyncWrapper(this.ctx.storage);
const storage = new SQLiteSyncStorage<TLRecord>({ sql });

this.room = new TLSocketRoom<TLRecord, void>({
  schema,
  storage,
  clientTimeout: Infinity, // CF faz keep-alive nos WS, timeout seria falso positivo
  onSessionRemoved: (_room, { numSessionsRemaining }) => {
    if (numSessionsRemaining === 0) {
      this.room?.close(); // libera memória; dados continuam no SQLite
      this.room = null;
    }
  },
});
```

### Por que não usar WebSocket Hibernation API

A versão `@tldraw/sync-core@4.5.12` não expõe API pública de "resume" de sessão pós-hibernação (`onSessionSnapshot` / `handleSocketResume` só existem em versões mais novas). Por isso o DO usa `server.accept()` em vez de `ctx.acceptWebSocket()`. O tradeoff: o DO não hiberna enquanto há conexões abertas — ele é evitado pelo Cloudflare apenas quando está completamente ocioso.

---

## Autenticação — JWT de board

O web app emite um JWT curto antes de abrir o WebSocket. O Cloudflare Worker valida esse token em toda requisição autenticada.

### Emissão (web app)

`GET /api/collab/board-token?boardId=...&workspaceId=...`

- Verifica se o usuário é membro do workspace
- Assina o JWT com `COLLAB_JWT_SECRET` (HS256, expiração 1h)
- Payload:

```json
{
  "userId": "uuid",
  "workspaceId": "uuid",
  "boardId": "uuid",
  "role": "owner | admin | member",
  "exp": 1234567890
}
```

O cliente armazena o token no cache do TanStack Query com `staleTime: 50min`, evitando uma requisição extra a cada render.

### Verificação (Worker)

`apps/tldraw-sync/src/auth.ts` usa `jose` para verificar assinatura e expiração:

```ts
const { payload } = await jwtVerify(token, secretKey); // lança se inválido/expirado
```

O token pode chegar como:
- `Authorization: Bearer <token>` (uploads via `fetch`)
- `?token=<token>` na query string (WebSocket — browsers não permitem headers customizados no `new WebSocket()`)

---

## Rotas do Worker (`apps/tldraw-sync`)

| Método | Caminho | Autenticação | Descrição |
|--------|---------|--------------|-----------|
| `GET` | `/health` | Não | Health check |
| `GET` (WS) | `/api/boards/:boardId/connect` | JWT no query `?token=` | Upgrade WebSocket → DO |
| `PUT` | `/api/uploads/:boardId/:assetId` | JWT no header | Grava asset no R2 |
| `GET` | `/api/uploads/:boardId/:assetId` | Não | Serve asset do R2 (público) |

### Segurança do upload

O Worker valida que o `boardId` no caminho do objeto bate com o `boardId` do JWT antes de gravar no R2 — impede que um cliente suba assets para boards que não sejam o seu:

```ts
if (!objectId.startsWith(`${payload.boardId}/`)) {
  return new Response("Object does not belong to the authorized board", { status: 403 });
}
```

Assets servidos via `GET` são **públicos** (sem auth) porque a URL é opaca (UUID aleatório) e fica salva dentro do store do tldraw — não é enumerável. A resposta inclui `Cache-Control: public, max-age=31536000, immutable`.

### CORS

O Worker reflete o `Origin` da requisição se ele for `localhost` (dev) ou bater com `ALLOWED_ORIGIN` (produção):

```toml
# wrangler.toml
[vars]
ALLOWED_ORIGIN = "https://organization.kodea.com.br"
```

---

## R2 — Assets do canvas

Imagens coladas ou arrastadas para o canvas são armazenadas em um **R2 bucket** (`locus-tldraw-assets`) separado do bucket de uploads do web app. O bucket é criado antes do primeiro deploy:

```bash
pnpm exec wrangler r2 bucket create locus-tldraw-assets
```

Em desenvolvimento (`wrangler dev`), o R2 é simulado localmente sem precisar criar nada.

---

## Criando um board

Qualquer membro do workspace pode criar um board. Clique em **Criar board** para abrir o formulário:

![Dialog de criação de board](./images/boards-criar.png)

| Campo | Obrigatório | Limite |
|-------|-------------|--------|
| Título | Sim | 1–120 caracteres |
| Ícone | Não | identificador de ícone |
| Descrição | Não | até 1000 caracteres |

---

## Canvas

Ao abrir um board, o editor tldraw é carregado com sincronização ativa:

![Editor canvas de um board](./images/boards-canvas.png)

O canvas suporta: formas livres, sticky notes, setas com curva, texto, imagens, e conexões entre elementos. Múltiplos usuários aparecem com cursores e cores distintas, sem conflitos de edição.

---

## Controle de acesso

| Ação | Membro | Admin / Owner |
|------|--------|---------------|
| Visualizar boards | Sim | Sim |
| Criar board | Sim | Sim |
| Editar board (metadados) | Não | Sim |
| Deletar board | Não | Sim |
| Editar no canvas | Sim | Sim |

O controle é aplicado em dois lugares:
- **API do web app** (`PATCH`/`DELETE /api/workspace/boards/[id]`): verifica `member.role` no PostgreSQL
- **JWT de board**: o `role` é incluído no token para uso futuro (ex: canvas read-only para membros)

---

## Rotas da API — web app (`apps/web`)

### `GET /api/workspace/boards`

Lista boards do workspace (PostgreSQL), ordenados por `lastOpenedAt DESC`.

```json
[
  {
    "id": "uuid",
    "title": "Roadmap Q3",
    "description": "Planejamento do trimestre",
    "icon": "calendar",
    "workspaceId": "uuid",
    "createdById": "uuid",
    "createdAt": "2026-06-01T00:00:00.000Z",
    "updatedAt": "2026-06-10T00:00:00.000Z",
    "lastOpenedAt": "2026-06-11T00:00:00.000Z"
  }
]
```

---

### `POST /api/workspace/boards`

Cria um novo board. Valida com `createBoardSchema` (Zod). Retorna `201`.

```json
{ "title": "Novo board", "icon": "star", "description": "Descrição opcional" }
```

---

### `PATCH /api/workspace/boards/[id]`

Atualiza título, ícone ou descrição. Valida com `updateBoardSchema` (Zod). Restrito a Admin/Owner.

---

### `DELETE /api/workspace/boards/[id]`

Soft-delete: define `deletedAt` sem remover do banco. Os dados do canvas no Durable Object **não são deletados** automaticamente (o DO é evitado pelo Cloudflare quando ocioso). Restrito a Admin/Owner.

---

### `GET /api/collab/board-token`

Emite o JWT para a sessão WebSocket. Verifica membership antes de assinar.

**Query params:** `boardId`, `workspaceId`

```json
{ "token": "eyJhbGci..." }
```

---

## Fluxo completo

```
Usuário acessa /<workspace>/boards
  → useBoards() → GET /api/workspace/boards (Next.js → PostgreSQL)
    → lista de boards renderizada

Usuário abre um board
  → navega para /<workspace>/boards/:id
    → useBoardCollabToken() → GET /api/collab/board-token (Next.js → JWT assinado)
      → BoardCanvas monta useSync(wsUrl + "?token=...")
        → GET wss://tldraw-sync.*/api/boards/:id/connect?token=...
          → Worker valida JWT → rota para TldrawDurableObject (DO do board)
            → DO aceita WebSocket, TLSocketRoom registra sessão
              → canvas sincronizado em tempo real

Outro usuário abre o mesmo board
  → mesma sequência → mesmo DO (mesmo boardId → mesma instância)
    → TLSocketRoom propaga operações entre as duas sessões

Usuário cola uma imagem no canvas
  → PUT wss://tldraw-sync.*/api/uploads/:boardId/:assetId (Authorization: Bearer token)
    → Worker valida JWT + verifica boardId → grava no R2
      → tldraw usa GET /api/uploads/:boardId/:assetId para exibir (público, cached)

Usuário fecha o board (última aba)
  → WebSocket fecha → onSessionRemoved (numSessionsRemaining === 0)
    → TLSocketRoom liberado da memória
      → shapes permanecem no SQLite do DO para a próxima abertura
```

---

## Variáveis de ambiente e secrets

### `apps/web` (`.env`)

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_TLDRAW_SYNC_WS_URL` | Base URL WebSocket do Worker (ex: `wss://locus-tldraw-sync.*.workers.dev`) |
| `COLLAB_JWT_SECRET` | Secret compartilhado para assinar/verificar JWTs de board |

### `apps/tldraw-sync` (wrangler secrets + vars)

| Nome | Tipo | Descrição |
|------|------|-----------|
| `COLLAB_JWT_SECRET` | Secret | Mesmo valor que o web app usa para assinar |
| `ALLOWED_ORIGIN` | Var (wrangler.toml) | Origem permitida em CORS (produção) |
| `TLDRAW_DURABLE_OBJECT` | Binding | Namespace do Durable Object |
| `UPLOADS` | Binding | R2 bucket `locus-tldraw-assets` |

Para setar o secret antes do deploy:

```bash
cd apps/tldraw-sync
pnpm wrangler secret put COLLAB_JWT_SECRET
```

---

## Deploy

```bash
# 1. Criar R2 bucket (só na primeira vez)
cd apps/tldraw-sync
pnpm exec wrangler r2 bucket create locus-tldraw-assets

# 2. Setar o secret
pnpm wrangler secret put COLLAB_JWT_SECRET

# 3. Deploy do Worker
pnpm exec wrangler deploy

# 4. Copiar a URL gerada para o web app
# apps/web/.env → NEXT_PUBLIC_TLDRAW_SYNC_WS_URL=wss://locus-tldraw-sync.*.workers.dev
```

---

## Desenvolvimento local

```bash
# Terminal 1 — Worker (porta 8787)
cd apps/tldraw-sync
pnpm dev

# Terminal 2 — Web app (porta 3000)
cd apps/web
pnpm dev
```

O `wrangler dev` simula Durable Objects e R2 localmente. O `.env` do web app já aponta para `ws://127.0.0.1:8787` por padrão.

---

## Arquivos principais

| Caminho | Responsabilidade |
|---------|-----------------|
| `apps/web/src/components/boards/ContentBoards.tsx` | Listagem de boards e cards |
| `apps/web/src/components/boards/BoardCanvas.tsx` | Editor tldraw + useSync |
| `apps/web/src/hook/boards/useBoards.ts` | Hooks TanStack Query (CRUD) |
| `apps/web/src/hook/boards/useBoardCollabToken.ts` | Hook para buscar JWT |
| `apps/web/src/app/api/workspace/boards/route.ts` | GET lista / POST criar |
| `apps/web/src/app/api/workspace/boards/[id]/route.ts` | GET / PATCH / DELETE |
| `apps/web/src/app/api/collab/board-token/route.ts` | Emissão do JWT |
| `apps/tldraw-sync/src/worker.ts` | Roteamento do Cloudflare Worker |
| `apps/tldraw-sync/src/TldrawDurableObject.ts` | DO: sync + SQLite |
| `apps/tldraw-sync/src/auth.ts` | Verificação do JWT no Worker |
| `apps/tldraw-sync/wrangler.toml` | Configuração do Worker (bindings, R2) |
| `packages/shared/src/schemas/board.schema.ts` | Schemas Zod compartilhados |

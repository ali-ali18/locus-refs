# Plano: Canvas Colaborativo (estilo Miro) — Refstash

## Contexto

O Refstash ganha uma nova feature: **canvas infinito colaborativo** (estilo Miro/Figma), complementar ao editor de notas rico. Usuários podem criar boards por workspace, manipulando shapes livres, sticky notes, conexões, etc. O canvas é entregue em ondas progressivas:

1. **v1 (individual)**: usuário edita sozinho, persistência local via snapshot no Prisma
2. **v2 (colab tempo real)**: usando o **tldraw Multiplayer kit** (Cloudflare DO + TLSync)
3. **v3 (IA assistente)**: usando os **patterns do tldraw Agent kit**, adaptado pro nosso `@ai-sdk`

### Por que tldraw + kits oficiais (e não custom sync)

- Engine de canvas maduro, com shapes, sticky notes, setas, snap, undo/redo, multi-select prontos
- **Sync nativo (TLSync) é protocolo proprietário do tldraw** — reescrever em Y.js seria meses de trabalho arriscado
- **Multiplayer kit + Agent kit foram projetados pra trabalhar juntos** (Agent kit usa `createShape`/`deleteShape` que dependem do sync)
- Usado em produção por ClickUp, Google, Shopify, Replit, BlackRock, etc.
- Customizações de UI/UX possíveis via override de tema e componentes
- **Licença hobby** (free, com watermark "made with tldraw") — suficiente para projeto open-source não-comercial

### Trade-off aceito: dois stacks de sync

O projeto terá **duas infraestruturas de colaboração** (decisão consciente):

- **Hocuspocus** (`apps/collab`) — para Notes (texto com Tiptap + Y.js)
- **tldraw sync** (Cloudflare Worker + Durable Object) — para Boards (canvas com TLSync)

**Justificativa:**

- Domínios diferentes (texto rico vs shapes livres)
- Protocolos diferentes (Y.js vs TLSync) — brigar pra unificar custaria meses e traria bugs de CRDT
- **Auth centralizada no Better Auth** (single source of truth) — os dois backends validam contra ela
- Custo de "2 deploys" aceitável dado o ganho de tempo e robustez (2-3 semanas vs 3-6 meses)
- Se um dia quisermos consolidar, dá pra fazer com o produto validado

### Glossário rápido de Cloudflare (pra quem nunca usou além de DDoS)

| Produto | O que é | Quando usar | Free tier |
|---|---|---|---|
| **Workers** | Funções serverless no edge (TS/JS) | Rodar nosso backend do tldraw | 100k requests/dia |
| **Durable Objects (DO)** | "Mini-servidor stateful" por chave | Real-time collab (1 DO por board) | 1M requests-mês |
| **R2** | Object storage S3-compatible | Imagens, anexos, avatares do canvas | 10GB storage |
| **Wrangler** | CLI pra dev/deploy | `wrangler dev`, `wrangler deploy` | - |

**Como funciona o DO pro nosso caso (analogia):**

- Pensa no DO como um "servidor Node.js dedicado por board"
- Quando alguém conecta no `board-123`, a Cloudflare **cria OU acorda** a instância daquela classe
- Todos os usuários do mesmo board caem na **mesma instância** → sem race condition
- A instância tem **SQLite embutido** → persistência automática
- A instância mantém **WebSockets abertos** → broadcast de updates em tempo real

**Setup básico (referência rápida):**

```bash
# Instalar
pnpm add -D wrangler
pnpm login  # abre browser, OAuth

# Dev local
pnpm dev  # roda worker no emulador local

# Deploy prod
pnpm deploy  # sobe pra Cloudflare
```

```toml
# wrangler.toml (config mínima)
name = "refstash-tldraw-sync"
main = "src/worker.ts"
compatibility_date = "2024-01-01"

[[durable_objects.bindings]]
name = "TLDRAW_DURABLE_OBJECT"
class_name = "TldrawDurableObject"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["TldrawDurableObject"]

[[r2_buckets]]
binding = "TLDRAW_BUCKET"
bucket_name = "refstash-tldraw-assets"
```

---

## Decisões arquiteturais

| Decisão | Escolha | Por quê |
|---|---|---|
| Engine do canvas | **tldraw SDK** | Maduro, customizável, sync plugável |
| Starter kit usado | **Nenhum direto** (Agent + Multiplayer como referência) | Custom sync > divergir de fork do Cloudflare DO |
| Licença tldraw | **Hobby license** (free, com watermark) | Projeto open-source, não-comercial |
| Sincronização | **Custom Y.js sync provider** | Stack unificado com Hocuspocus |
| Backend de sync | **`apps/collab` (Hocuspocus) existente** | Reaproveita auth, persistência, deploy |
| Modelagem | **Nova tabela `Board`** no Prisma | Schema mais limpo que polimorfismo no `Note` |
| Document name Hocuspocus | **`board-{boardId}`** | Convenção clara, separa de `note-{noteId}` |
| Persistência v1 (individual) | **Snapshot JSON** do tldraw em `Board.snapshot` (Json column) | Simples, suficiente para uso solo |
| Persistência v2 (colab) | **Y.js binary** em `Board.ydoc` (Bytes) — `snapshot` removido | Mesma estratégia do `Note` |
| Roteamento | **`/[workspaceSlug]/boards`** e **`/[workspaceSlug]/boards/[id]`** | Paralelo a Notes, mais discoverable |
| IA | **Painel lateral** com `@ai-sdk/react` (useChat) + tool definitions | Reaproveita OpenAI/Anthropic já configurado |
| Permissões | **Reusa `Member.role`** (owner/admin = editor, member = viewer) | Sem model novo |

---

## Modelagem de dados

### Novo model no `prisma/schema.prisma`

```prisma
model Board {
  id           String       @id @default(uuid())
  title        String
  description  String?
  workspaceId  String
  workspace    Organization @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  createdById  String
  createdBy    User         @relation(fields: [createdById], references: [id], onDelete: Cascade)

  // v1: snapshot individual
  // v2: removido ao ativar sync (ydoc vira source of truth)
  snapshot     Json?

  // v2: Y.js binary state, populado pelo Hocuspocus
  ydoc         Bytes?

  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  deletedAt    DateTime?    // soft delete

  @@index([workspaceId])
  @@index([createdById])
}
```

**Modificações em models existentes:**
- `Organization`: adicionar `boards Board[]`
- `User`: adicionar `boards Board[]`

### Convenções do projeto (revisão)

Mantém o padrão do `PLAN.md` original: nomes em camelCase, scopes por `workspaceId`, soft delete com `deletedAt`, fields `createdAt`/`updatedAt` em todo model.

---

## Dependências adicionais

**`apps/web/package.json`** (adicionar):

```json
"tldraw": "^4.0.0"  // versão mais recente estável
```

> ⚠️ Conferir a versão no momento da implementação — tldraw tem API que muda entre majors. Verificar compatibilidade com React 19.

**`apps/web/package.json`** (já existem):

- `yjs` ^13
- `@hocuspocus/provider` latest
- `lucide-react` (ícones)
- `next-themes` (dark/light)
- `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/react`, `ai` (IA)

**`apps/collab/package.json`** (já tem tudo):

- `@hocuspocus/server`
- `@hocuspocus/extension-database`
- `@prisma/client`
- `jsonwebtoken`

**Nenhuma dependência nova no `apps/collab`** — só adaptação de lógica.

---

## Fases de implementação

### FASE 1 — Schema: model `Board`

- Adicionar `model Board` no `prisma/schema.prisma`
- Adicionar `Board` no relation de `Organization` e `User`
- Rodar `pnpm db:migrate` para criar a tabela
- Rodar `pnpm db:generate` para atualizar o Prisma Client

**Arquivos modificados:**

- `prisma/schema.prisma`
- Nova migration em `prisma/migrations/`

**Verificação:**

- [ ] `pnpm db:migrate` aplica sem erros
- [ ] Tabela `board` criada com todos os campos
- [ ] `prisma.board` disponível no Prisma Client (web + collab)

---

### FASE 2 — Routing: `/[workspaceSlug]/boards`

- Criar `apps/web/src/app/[workspaceSlug]/boards/page.tsx` (listagem de boards)
- Criar `apps/web/src/app/[workspaceSlug]/boards/[id]/page.tsx` (canvas)
- Adicionar entrada "Boards" em `apps/web/src/components/sidebar/NavBase.tsx` (paralelo a Notes/Collections)
- Server component para fetch inicial + client component pro canvas

**Arquivos novos:**

- `apps/web/src/app/[workspaceSlug]/boards/page.tsx` — listagem (server)
- `apps/web/src/app/[workspaceSlug]/boards/[id]/page.tsx` — editor (server shell + client)
- `apps/web/src/components/boards/BoardList.tsx` — listagem (client)
- `apps/web/src/components/boards/BoardCard.tsx` — card individual na listagem
- `apps/web/src/components/boards/CreateBoardDialog.tsx` — modal de criação

**Arquivos modificados:**

- `apps/web/src/components/sidebar/NavBase.tsx` — adicionar item "Boards"

**Verificação:**

- [ ] `/[slug]/boards` carrega sem erro 404
- [ ] Item "Boards" aparece na sidebar
- [ ] Server component faz query de boards do workspace

---

### FASE 3 — API Routes: CRUD de Boards

- `GET  /api/workspace/[slug]/boards` — listar boards do workspace
- `POST /api/workspace/[slug]/boards` — criar board
- `GET  /api/workspace/[slug]/boards/[id]` — buscar um board
- `PATCH /api/workspace/[slug]/boards/[id]` — atualizar título/descrição
- `DELETE /api/workspace/[slug]/boards/[id]` — soft delete

**Padrão (replicar dos endpoints de `Note`):**

- `requireSession()` para autenticação
- Validar membership do usuário no workspace
- Retornar `{ message, data }` no sucesso, `{ error, code }` no erro
- `workspaceId` via header `x-workspace-id` ou via slug resolvido no server

**Arquivos novos:**

- `apps/web/src/app/api/workspace/[slug]/boards/route.ts` (GET, POST)
- `apps/web/src/app/api/workspace/[slug]/boards/[id]/route.ts` (GET, PATCH, DELETE)
- `apps/web/src/app/api/workspace/[slug]/boards/[id]/route.test.ts` (testes, padrão dos outros)

**Verificação:**

- [ ] GET retorna apenas boards do workspace do usuário
- [ ] POST cria board com `createdById` e `workspaceId` corretos
- [ ] PATCH atualiza apenas título/descrição (não toca no conteúdo)
- [ ] DELETE marca `deletedAt` (soft delete)
- [ ] Membro de outro workspace recebe 403

---

### FASE 4 — Canvas Individual (v1: sem collab) ⭐ **primeira entrega de valor**

- Install `tldraw` no `apps/web`
- Componente `BoardCanvas` que renderiza `<Tldraw />`
- Persistência via API de snapshot do tldraw:
  - `editor.store.listen()` para detectar mudanças
  - Debounce de **2 segundos**
  - Salva `editor.getSnapshot()` (JSON) no `Board.snapshot` via PATCH da API
  - Carrega no mount com `editor.loadSnapshot(snapshot)` se `Board.snapshot` existir
- **Sem provider de sync**: cada usuário edita sozinho, sem tempo real
- License key passada no `<Tldraw licenseKey="..." />` (env var ou hardcoded no dev)

**Arquivos novos:**

- `apps/web/src/components/boards/BoardCanvas.tsx` — wrapper do `<Tldraw />`
- `apps/web/src/lib/tldraw/board-persistence.ts` — helpers de load/save snapshot
- `apps/web/src/hook/boards/useBoards.ts` — TanStack Query: listagem
- `apps/web/src/hook/boards/useBoard.ts` — TanStack Query: board único + mutation de update
- `apps/web/src/hook/boards/boardKeys.ts` — query keys centralizadas

**Variáveis de ambiente (apps/web):**

```env
NEXT_PUBLIC_TLDRAW_LICENSE_KEY=tldraw-***
```

**Verificação:**

- [ ] Abrir board → renderiza canvas tldraw vazio
- [ ] Editar canvas (criar shapes, mover, escrever)
- [ ] Refresh → conteúdo persiste (snapshot save/load funciona)
- [ ] Debounce de 2s está respeitado (verificar network tab)
- [ ] Sem erro de license key no console

---

### FASE 5 — Polimento UX

- Tema dark/light consistente com Refstash (usa `next-themes` que já tá lá)
- Sobrescrever cores default do tldraw com tokens do projeto
- Customizar toolbar/menu pra combinar com design system (shadcn/ui)
- Loading states (skeleton no canvas enquanto snapshot carrega)
- Error handling (toast do `sonner` em falhas de save)
- Empty state ("esse board tá vazio, comece criando um shape")

**Arquivos modificados:**

- `apps/web/src/components/boards/BoardCanvas.tsx`
- `apps/web/src/app/globals.css` (overrides de CSS variables do tldraw)

**Verificação:**

- [ ] Canvas respeita `next-themes` (troca de tema funciona)
- [ ] Toolbar do tldraw segue o design system (cores, fontes, radii)
- [ ] Loading state aparece antes do snapshot carregar
- [ ] Erro de save mostra toast amigável

---

### FASE 6 — Sync Custom: tldraw + Hocuspocus (v2: collab) ⭐ **entrega de valor多人**

- Escrever `TldrawYjsSyncProvider` custom (~50-100 linhas)
- Estratégia: usar a API `TLDocumentStore` do tldraw + `@hocuspocus/provider` + Y.js
- Document name no Hocuspocus: `board-{boardId}` (separado de `note-{noteId}`)
- Cliente (apps/web): abre provider com `name="board-{boardId}"`, recebe updates de Y.Doc
- Servidor (apps/collab): extrai `boardId` do `documentName`, valida membership via Prisma (igual faz com notes)

**Arquivos novos:**

- `apps/web/src/lib/tldraw/tldraw-hocuspocus-provider.ts` — sync provider custom

**Arquivos modificados:**

- `apps/collab/src/index.ts`:
  - `onAuthenticate`: parsear `documentName` com prefixo `board-` (separado de `note-`)
  - Validar membership de `boardId` no `workspaceId` extraído do JWT
  - `fetch`/`store` no `Database` extension: branch por tipo de documento
- `apps/web/src/components/boards/BoardCanvas.tsx`:
  - Substituir save de snapshot por uso do provider custom
  - Migração one-shot: se `Board.snapshot` existe e `Board.ydoc` é null, popular ydoc a partir do snapshot

**Verificação:**

- [ ] Conectar via `wscat` ao `board-xxx` retorna OK com token válido
- [ ] Token de outro workspace retorna 403
- [ ] Dois browsers no mesmo board veem mudanças em tempo real
- [ ] Conteúdo editado offline é sincronizado ao reconectar
- [ ] Board sem `ydoc` migra corretamente do `snapshot` (sem perda de dados)

---

### FASE 7 — Cursors + Awareness

- tldraw tem suporte nativo pra user presence
- Cada cliente configura um "user" no provider (nome, cor) baseado no session do Better Auth
- Cursors de outros usuários aparecem em tempo real via Y.js awareness
- Cor única por usuário (hash do `userId` → paleta consistente)

**Arquivos modificados:**

- `apps/web/src/lib/tldraw/tldraw-hocuspocus-provider.ts` — configurar awareness
- `apps/web/src/components/boards/BoardCanvas.tsx` — passar `user` info do session

**Verificação:**

- [ ] Cursor de outro usuário aparece com nome e cor
- [ ] Cursors desaparecem ao desconectar
- [ ] Cor é estável entre sessões (mesmo userId = mesma cor)

---

### FASE 8 — Permissions (viewer/editor)

- `Member.role` já existe (`owner` / `admin` / `member`)
- Mapear: `owner` e `admin` = editor, `member` = viewer
- **Cliente**: `readOnly: true` no editor pra viewer (tldraw tem essa prop)
- **Servidor (Hocuspocus)**: rejeita conexão de viewer se for escrita (read-only via awareness flag)
- **API routes**: checar role antes de permitir POST/PATCH/DELETE de board

**Arquivos modificados:**

- `apps/web/src/app/api/workspace/[slug]/boards/route.ts` — checar role no POST
- `apps/web/src/app/api/workspace/[slug]/boards/[id]/route.ts` — checar role no PATCH/DELETE
- `apps/web/src/components/boards/BoardCanvas.tsx` — passar `readOnly` baseado no role do member
- `apps/collab/src/index.ts` — branch no `onAuthenticate` por tipo de documento, validar role

**Helper novo:**

- `apps/web/src/server/requireMembershipWithRole.ts` — retorna `{ session, member, role }` pra usar nos handlers

**Verificação:**

- [ ] Viewer (member) não consegue criar/mover shapes (read-only no editor)
- [ ] Viewer recebe 403 ao tentar POST/PATCH/DELETE na API
- [ ] Editor (admin/owner) edita normalmente
- [ ] Hocuspocus rejeita escrita de viewer (log de erro ou rejeição silenciosa)

---

### FASE 9 — IA: Painel AI Assistant ⭐ **diferencial do produto**

- Painel lateral (`<Sheet />` ou painel fixo toggleable) com chat
- Input do usuário → `useChat` do `@ai-sdk/react` → endpoint streaming
- Tools customizadas pro LLM usar:
  - `read_board()` — retorna lista de shapes (tipo, posição, texto)
  - `create_shape({ type, x, y, w, h, text? })` — adiciona shape
  - `move_shape({ id, x, y })` — move shape
  - `delete_shape({ id })` — remove shape
  - `create_connection({ fromId, toId })` — conecta dois shapes
  - `summarize_board()` — gera resumo textual
  - `cluster_shapes({ ids, label })` — agrupa shapes num frame
- Endpoint streaming com `streamText` do `ai`
- Patterns de **Agent starter kit** (referência) + **AI SDK** do projeto (já configurado)

**Arquivos novos:**

- `apps/web/src/components/boards/AIPanel.tsx` — UI do chat lateral
- `apps/web/src/lib/ai/board-tools.ts` — tool definitions (Zod schema + execute)
- `apps/web/src/app/api/workspace/[slug]/boards/[id]/ai/route.ts` — endpoint streaming

**Arquivos modificados:**

- `apps/web/src/components/boards/BoardCanvas.tsx` — botão de toggle do AI panel
- `apps/web/src/app/[workspaceSlug]/boards/[id]/page.tsx` — layout com AI panel

**Variáveis de ambiente (apps/web):** (provavelmente já existem)

```env
ANTHROPIC_API_KEY=...
# ou
OPENAI_API_KEY=...
```

**Verificação:**

- [ ] Chat abre ao clicar no botão de AI
- [ ] "Crie 3 sticky notes amarelas formando um triângulo" → 3 sticky notes aparecem
- [ ] "Resuma esse board" → resumo coerente listando shapes
- [ ] "Mova o retângulo azul pra cá" → retângulo se move
- [ ] Conexões Hocuspocus + tool calls funcionam juntas (sem race conditions)
- [ ] Streaming funciona (resposta aparece incrementalmente)

---

### FASE 10 — UI Integration final

- Listagem de boards com thumbnails (gerar PNG do snapshot)
- Criar/renomear/deletar board (dialogs)
- Busca por título
- "Recentes" e "Fixados" (futuro: implementar fixar)
- Empty state
- Breadcrumb "Workspace / Boards / {title}"
- Adicionar boards no DashboardActivity (overview do workspace)
- Adicionar boards no QuickCreate (criar board em 1 clique)

**Arquivos novos:**

- `apps/web/src/components/boards/BoardCard.tsx` — card com thumbnail
- `apps/web/src/components/boards/RenameBoardDialog.tsx`
- `apps/web/src/components/boards/DeleteBoardDialog.tsx`
- `apps/web/src/components/boards/BoardThumbnail.tsx` — renderiza PNG a partir do snapshot
- `apps/web/src/hook/boards/useBoards.ts` — extended com mutations
- `apps/web/src/hook/boards/useBoardMutations.ts` — mutations isoladas

**Arquivos modificados:**

- `apps/web/src/components/workspace/overview/activity/DashboardActivity.tsx` — incluir boards na atividade
- `apps/web/src/components/workspace/overview/QuickCreate.tsx` — botão "Criar board"
- `apps/web/src/components/workspace/WorkspaceNavigationMenu.tsx` — link "Boards"

**Verificação:**

- [ ] Listagem mostra boards com thumbnails
- [ ] Criar/renomear/deletar funciona via dialogs
- [ ] Busca por título filtra corretamente
- [ ] Empty state aparece quando não há boards
- [ ] Breadcrumb correto em todas as rotas

---

## Variáveis de ambiente

### `apps/web/.env` (novas)

```env
# tldraw — pegar hobby license em https://tldraw.dev/get-a-license/hobby
NEXT_PUBLIC_TLDRAW_LICENSE_KEY=tldraw-********************************

# AI (provavelmente já existem)
ANTHROPIC_API_KEY=...
# ou
OPENAI_API_KEY=...
```

### `apps/collab/.env` (nenhuma nova)

Reusa `DATABASE_URL`, `COLLAB_JWT_SECRET`, `PORT` que já existem.

---

## Ordem de execução

```
1. Schema Board                              (Fase 1)
2. Routing /boards                           (Fase 2)
3. API CRUD                                  (Fase 3)
4. ⭐ Canvas individual + persistência       (Fase 4)  ← PRIMEIRA ENTREGA DE VALOR
5. Polimento UX (tema, loading, erros)       (Fase 5)
6. ⭐ Sync custom Hocuspocus                 (Fase 6)  ← PRIMEIRA ENTREGA DE COLAB
7. Cursors + awareness多人                    (Fase 7)
8. Permissions (viewer/editor)               (Fase 8)
9. ⭐ IA assistant                           (Fase 9)  ← DIFERENCIAL DO PRODUTO
10. UI final (listagem, busca, dashboard)    (Fase 10)
```

**Marcos de entrega:**

- **Marco 1 (Fases 1-5)**: usuário pode criar boards, editar canvas, persistir
- **Marco 2 (Fases 6-8)**: boards são colaborativos em tempo real多人
- **Marco 3 (Fases 9-10)**: produto completo com IA e UI polida

---

## Arquivos críticos

| Arquivo | Fases | Tipo | Resumo |
|---|---|---|---|
| `prisma/schema.prisma` | 1 | modificado | Adiciona `model Board` |
| `apps/web/src/app/[workspaceSlug]/boards/page.tsx` | 2 | novo | Listagem (server) |
| `apps/web/src/app/[workspaceSlug]/boards/[id]/page.tsx` | 2, 4, 6, 7, 8, 9 | novo | Editor (server shell) |
| `apps/web/src/components/boards/BoardCanvas.tsx` | 4, 5, 6, 7, 8, 9 | novo (evolui) | Componente do tldraw |
| `apps/web/src/lib/tldraw/board-persistence.ts` | 4 | novo | Save/load snapshot |
| `apps/web/src/lib/tldraw/tldraw-hocuspocus-provider.ts` | 6, 7 | novo | Sync custom Y.js+Hocuspocus |
| `apps/web/src/components/boards/AIPanel.tsx` | 9 | novo | UI do chat IA |
| `apps/web/src/lib/ai/board-tools.ts` | 9 | novo | Tool definitions |
| `apps/web/src/app/api/workspace/[slug]/boards/route.ts` | 3, 8 | novo | CRUD endpoints |
| `apps/web/src/app/api/workspace/[slug]/boards/[id]/ai/route.ts` | 9 | novo | AI streaming endpoint |
| `apps/web/src/app/api/workspace/[slug]/boards/[id]/route.ts` | 3, 8 | novo | Board único |
| `apps/web/src/components/sidebar/NavBase.tsx` | 2 | modificado | Adiciona link "Boards" |
| `apps/collab/src/index.ts` | 6, 8 | modificado | Branch para `board-*` no documentName |
| `apps/web/src/hook/boards/useBoards.ts` | 4, 10 | novo | TanStack Query listagem |
| `apps/web/src/hook/boards/useBoard.ts` | 4 | novo | TanStack Query board único |
| `apps/web/src/hook/boards/boardKeys.ts` | 4 | novo | Query keys |

---

## Checklist de verificação (por marco)

### Marco 1 — Canvas Individual (Fases 1-5)

- [ ] `pnpm db:migrate` aplica o model `Board` sem erros
- [ ] Rota `/[slug]/boards` lista boards do workspace
- [ ] Criar board via UI → aparece na listagem
- [ ] Abrir board → renderiza canvas tldraw vazio
- [ ] Editar canvas, refresh, conteúdo persiste (snapshot save/load)
- [ ] Tema dark/light consistente com resto do app
- [ ] Loading state e error handling funcionam
- [ ] `pnpm lint` passa sem erros
- [ ] `pnpm test:run` passa (com testes novos do CRUD)

### Marco 2 — Colaboração em Tempo Real (Fases 6-8)

- [ ] Dois browsers no mesmo board veem mudanças em tempo real
- [ ] Cursors e seleção de outros usuários aparecem com nome e cor
- [ ] Conteúdo editado offline sincroniza ao reconectar
- [ ] Board sem `ydoc` migra corretamente do `snapshot` (sem perda de dados)
- [ ] Viewer (member) não consegue editar (read-only no editor)
- [ ] Viewer recebe 403 ao tentar POST/PATCH/DELETE na API
- [ ] Editor (admin/owner) edita normalmente
- [ ] Hocuspocus rejeita escrita de viewer
- [ ] `wscat` em `board-xxx` com token válido conecta
- [ ] `wscat` em `board-xxx` com token de outro workspace recebe erro

### Marco 3 — IA e UI Final (Fases 9-10)

- [ ] Chat IA abre ao clicar no botão
- [ ] "Crie 3 sticky notes" → 3 sticky notes aparecem
- [ ] "Resuma esse board" → resumo coerente
- [ ] "Mova shape X pra cá" → shape se move
- [ ] Streaming funciona (resposta aparece incrementalmente)
- [ ] Conexões Hocuspocus + tool calls funcionam juntas
- [ ] Listagem mostra boards com thumbnails
- [ ] Criar/renomear/deletar funciona via dialogs
- [ ] Busca por título filtra corretamente
- [ ] Empty state aparece quando não há boards
- [ ] Breadcrumb correto em todas as rotas
- [ ] Boards aparecem no DashboardActivity e QuickCreate

---

## Out of scope (deixar pra depois)

- Export do canvas pra PNG/SVG (tldraw tem `editor.toImage()` mas vamos deixar pra v2)
- Templates de board pré-prontos
- Versionamento/histórico de boards
- Comentários e menções em shapes específicos
- Embed de URLs externas no canvas
- Permissões granulares por board (atualmente é por role do workspace)
- Mobile / touch optimization profundo (tldraw suporta, mas polimento fica pra depois)
- Boards públicos (compartilhados fora do workspace)
- Realtime voice/video (pode vir via integração externa tipo LiveKit)
- Frame avançado de AI agent que "faz coisas" automaticamente sem prompt

### v4 (futuro distante) — Custom shapes de workflow

Se quiser virar o canvas num **editor de automação** estilo n8n/Make um dia, dá pra reaproveitar:

- Patterns do **Workflow starter kit** (custom shapes com portas de entrada/saída, drag-connect, snap-to-port)
- Custom tools pra "ferramenta de conexão"
- Execution feedback visual (pulse no node rodando)

Por enquanto fica como nota — não é o foco do produto.

---

## Riscos e mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| Bundle size do tldraw (~500KB gzipped) | Performance no load inicial | Lazy load do componente canvas via `next/dynamic` com `ssr: false`; só baixa ao abrir board |
| Performance com 100+ shapes no canvas | UX ruim em boards grandes | tldraw usa Canvas2D + culling — testar cedo com shapes sintéticos; perfil se necessário |
| License key expirar (trial 100 dias) | SDK para de funcionar em produção | Aplicar hobby license antes do trial acabar; documentar processo de upgrade pra commercial se virar comercial |
| Divergência entre `snapshot` (v1) e `ydoc` (v2) | Perda de dados na migração | Migração one-shot ao ativar sync: converter `snapshot` → `ydoc` antes de remover campo; manter ambos por uma versão |
| Custom sync provider com bugs | Edits não persistem ou conflitos | Cobertura de testes: abrir 2 browsers, simular disconnect/reconnect, validar convergência |
| AI tools com loops infinitos de tool calls | Custo de API, UX travada | Limitar `maxSteps` no `streamText`; rate limit por usuário |
| Watermark "made with tldraw" no canvas | Visual poluído | Aceitável pra hobby license; remover com commercial license quando virar comercial |
| API do tldraw muda entre majors | Migração de código ao atualizar | Fixar versão major; ler release notes com cuidado no upgrade |
| Race condition: Hocuspocus update + AI tool call | Estado inconsistente | Tool calls do AI devem passar pelo Y.js (Hocuspocus), nunca mutar estado local direto |
| Conflito de navegação: usuário clica em 2 boards rápido | Estado do editor fica bagunçado | Cleanup rigoroso do `editor.dispose()` no unmount; Suspense boundary em volta |

---

## Notas de arquitetura

### Por que tldraw sync (Cloudflare DO) ao invés de custom Y.js

**Versão anterior do plano propunha custom Y.js sync provider plugado no Hocuspocus. Essa abordagem foi descartada depois de pesquisa mais profunda. Razões:**

- O `tldraw sync` (TLSync) é um **protocolo proprietário do tldraw**, não Y.js
- Reimplementar `TLSocketRoom` em Y.js exigiria reescrever o core de sync do tldraw — meses de trabalho arriscado
- O **Agent starter kit** (que vamos usar pra IA) é construído em cima do Multiplayer kit — usa `editor.createShape()`, `editor.deleteShape()` que dependem do sync TLSync pra funcionar多人
- Brigar pra unificar Y.js e TLSync é reinventar a roda com bug-risk 10x maior

**Com Multiplayer kit (Cloudflare DO) ganhamos:**

- ✅ **Sync battle-tested** em produção (ClickUp, Google, Shopify, Replit, BlackRock usam)
- ✅ **Strong consistency automática** (1 DO por board, sem race condition)
- ✅ **Persistência SQLite embutida** no DO (sem código de save)
- ✅ **Agent kit funciona out-of-the-box** (já foi projetado pra rodar em cima)
- ✅ **Curva de aprendizado baixa** (kit dá 90% pronto)
- ❌ Cloudflare entra como vendor adicional
- ❌ Auth unificada mas exige bridge (Worker valida Better Auth token via HTTP)

**Custo do trade-off:**

- Tempo: 2-3 semanas pro MVP (vs 3-6 meses da abordagem custom)
- Risco: baixo (kit usado em prod por muita gente)
- Complexidade adicionada: 1 plataforma nova (Cloudflare Workers/DO/R2), mas com free tier generoso

### Sobre a watermark do tldraw

A hobby license exige o watermark "made with tldraw" visível no canvas. Isso é:
- ✅ Aceitável pra projeto open-source não-comercial
- ✅ Não bloqueia desenvolvimento
- ❌ Visual menos "profissional" pra um SaaS comercial
- 💡 Se virar comercial no futuro: commercial license ($$) remove o watermark

### Sobre IA e o Agent starter kit

O tldraw oferece o **Agent starter kit** que é um agente de IA completo que lê e modifica o canvas. Ele foi projetado pra rodar em cima do **Multiplayer kit**. A gente vai:

1. **Usar o kit como base** (não fork) — copiar os patterns de:
   - `client/modes/AgentModeDefinitions.ts` — sistema de modes (working, reviewing, etc.)
   - `client/parts/` — prompt parts (o que o LLM vê: screenshot, shapes, viewport, history)
   - `client/actions/` — action utils (o que o LLM faz: create, move, delete, align, etc.)
   - `worker/prompt/` — system prompt sections
2. **Substituir o worker de IA do kit** pelo nosso endpoint Next.js usando `@ai-sdk` (OpenAI/Anthropic)
3. **Substituir o sistema de providers** (o kit suporta Anthropic/OpenAI/Google nativamente) pelo nosso
4. **Manter a UI do chat panel** mas com `useChat` do `@ai-sdk/react` ao invés do streaming próprio do kit
5. **Tools vão operar via tldraw sync** (cria shape → DO broadcast → todos veem) — funciona naturalmente porque o canvas já tá no TLSync

O resultado: temos um agente IA completo, com modos customizáveis, contexto visual rico, e que respeita a colaboração多人 — em ~1 semana a menos do que construir do zero.

---

## Próximos passos

1. **Confirmar plano** com o usuário (esta conversa)
2. **Pegar hobby license key** em https://tldraw.dev/get-a-license/hobby
3. **Setup Cloudflare**: criar conta Cloudflare (se não tem), instalar wrangler, fazer `wrangler login`
4. **Fase 1**: criar model `Board` + migration
5. **Fase 2-3**: setup Cloudflare (Worker + DO + R2) + auth bridge
6. **Fase 4-5**: renderizar canvas com Multiplayer kit + customizar UI/UX do Refstash
7. **Marco 1**: canvas funcionando com persistência automática no DO
8. **Fase 6**: customizar auth (Better Auth → DO) e permissions (viewer/editor)
9. **Marco 2**: dois browsers no mesmo board → edição tempo real多人
10. **Fase 7-8**: integrar Agent kit patterns com nosso `@ai-sdk`
11. **Marco 3**: AI assistant funcional (chat lateral, criar/mover shapes via prompt)
12. **Fase 9**: UI final (listagem, busca, dashboard)

---

> Última atualização: 2026-06-06
> Status: rascunho aguardando aprovação

# Pivot Plan: Workspace Colaborativo

## Contexto

O Refstash passa de app **single-user** para **multi-tenant colaborativo**. Cada workspace é uma organização do Better Auth. Membros colaboram em notas em tempo real via Hocuspocus (Y.js/CRDT). O repositório vira um **pnpm monorepo** com dois apps deployados separadamente via Dokploy na VPS.

---

## Decisões arquiteturais

| Decisão | Escolha |
|---|---|
| Estrutura | pnpm workspaces monorepo |
| Workspace na URL | `/[workspaceSlug]/notes`, `/[workspaceSlug]/collections` |
| Permissões | `owner` / `editor` (admin BA) / `viewer` (member BA) |
| Deploy collab | Docker container na VPS via Dokploy |
| Auth no collab server | Valida session token do Better Auth direto no DB |

---

## Estrutura do monorepo

```
workspace-app/
├── apps/
│   ├── web/          ← Next.js (código atual migrado)
│   └── collab/       ← Hocuspocus WebSocket server
├── packages/
│   └── shared/       ← tipos, schemas Zod, utils compartilhados
├── prisma/           ← permanece na raiz (shared entre apps)
├── pnpm-workspace.yaml
└── package.json
```

---

## Fases de implementação

### FASE 1 — Monorepo Setup

- Criar `pnpm-workspace.yaml`
- Mover `src/`, `public/`, `next.config.ts`, `tailwind.config.*`, `components.json` → `apps/web/`
- Criar `apps/collab/` com `package.json` básico (Node.js + Hocuspocus)
- Criar `packages/shared/` com `package.json`
- Ajustar `tsconfig.json` em cada app para referenciar `@refstash/shared`
- `prisma/` permanece na raiz

---

### FASE 2 — packages/shared

Extrair tipos e schemas reutilizados por `web` e `collab`:

```
packages/shared/src/
├── types/
│   ├── note.type.ts
│   ├── collection.type.ts
│   └── workspace.type.ts   ← novo
├── schemas/
│   ├── note.schema.ts
│   ├── collection.schema.ts
│   └── workspace.schema.ts ← novo
└── index.ts
```

---

### FASE 3 — Better Auth Organizations

Habilitar o plugin `organization` no Better Auth.

**`apps/web/src/lib/auth.ts`:**
```typescript
import { organization } from "better-auth/plugins"

betterAuth({
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
      membershipLimit: 50,
    })
  ]
})
```

**`apps/web/src/lib/auth-client.ts`:**
```typescript
import { organizationClient } from "better-auth/client/plugins"
createAuthClient({ plugins: [organizationClient()] })
```

Tabelas geradas pelo BA (via `npx @better-auth/cli generate`):
- `Organization` — id, name, slug, logo
- `Member` — organizationId, userId, role (owner/admin/member)
- `Invitation` — organizationId, email, role, status, expiresAt

**Onboarding:** Após registro → redirect para `/workspace/new` se usuário não tiver workspace.

---

### FASE 4 — Prisma Schema: workspaceId

Escopar todos os dados ao workspace (organização BA).

**Mudanças em `prisma/schema.prisma`:**

```prisma
model Note {
  // ...campos atuais...
  workspaceId  String
  workspace    Organization @relation(fields: [workspaceId], references: [id])
  createdById  String       // userId para auditoria
  ydoc         Bytes?       // Y.js document state (novo)
}

// Mesmo padrão para Collection, Resource, Category
```

**Migração de dados:** Script que cria workspace pessoal para cada usuário existente e reassocia todos os seus dados.

---

### FASE 5 — Routing

Substituir `/dashboard/*` por `/[workspaceSlug]/*`.

**Nova estrutura `apps/web/src/app/`:**
```
app/
├── (auth)/
│   ├── login/page.tsx               ← atual: /
│   └── register/page.tsx
├── (onboarding)/
│   └── workspace/new/page.tsx       ← criar primeiro workspace
├── [workspaceSlug]/
│   ├── layout.tsx                   ← valida membership, seta workspace ativo
│   ├── page.tsx
│   ├── notes/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx            ← editor Tiptap + Hocuspocus
│   ├── collections/page.tsx
│   ├── categories/page.tsx
│   └── settings/
│       ├── page.tsx                 ← configurações gerais
│       └── members/page.tsx         ← membros e convites
└── page.tsx                         ← redirect: workspace ativo ou login
```

`[workspaceSlug]/layout.tsx` resolve o slug → organizationId, valida membership e passa `workspaceId` via Context.

---

### FASE 6 — API Routes

Todos os endpoints escopam por `organizationId`.

**Helper novo `apps/web/src/server/requireMembership.ts`:**
```typescript
export async function requireMembership(workspaceId: string) {
  const session = await requireSession()
  const member = await prisma.member.findFirst({
    where: { organizationId: workspaceId, userId: session.user.id }
  })
  if (!member) throw new Error("NOT_MEMBER")
  return { session, member }
}
```

**Mudanças em todas as rotas:** `workspaceId` via header `x-workspace-id`, substituindo `userId` nos filtros Prisma.

**Rotas novas:**
- `GET/POST /api/workspace/[id]/members`
- `DELETE /api/workspace/[id]/members/[userId]`
- `POST /api/workspace/[id]/invitations`
- `GET /api/invitations/[token]` — aceitar convite

---

### FASE 7 — Storage Migration

Mudar prefixo S3 de `userId/` para `workspaceId/`.

**`apps/web/src/server/upload.ts`:**
```typescript
// Antes: `${userId}/notes/${uuid}-${safeName}`
// Depois: `${workspaceId}/notes/${uuid}-${safeName}`
```

Script para renomear keys existentes no S3.

---

### FASE 8 — apps/collab (Hocuspocus Server)

**Stack:** Node.js + TypeScript + `@hocuspocus/server` + `@hocuspocus/extension-database` + Prisma Client

**Document name:** `${workspaceId}.${noteId}`

**Fluxo principal `apps/collab/src/index.ts`:**
```typescript
Server.configure({
  port: 1234,

  async onAuthenticate({ token, documentName }) {
    const [workspaceId] = documentName.split(".")
    // 1. Valida session token no DB
    // 2. Valida que userId é member de workspaceId
    // 3. Retorna { user, role } para uso nos handlers
  },

  extensions: [
    new Database({
      fetch: async ({ documentName }) => {
        // Retorna ydoc binário do banco
      },
      store: async ({ documentName, state }) => {
        // Salva ydoc binário + converte para HTML (content)
      }
    })
  ]
})
```

**Dockerfile (`apps/collab/Dockerfile`)** para deploy via Dokploy.

---

### FASE 9 — Tiptap Collaboration (Frontend)

**Pacotes a instalar em `apps/web`:**
```
@hocuspocus/provider
@tiptap/extension-collaboration
@tiptap/extension-collaboration-cursor
```

**`apps/web/src/lib/notes-editor-config.ts`:**
```typescript
import Collaboration from "@tiptap/extension-collaboration"
import CollaborationCursor from "@tiptap/extension-collaboration-cursor"

export function createEditorConfig(provider: HocuspocusProvider, user: User) {
  return {
    extensions: [
      // ...extensions atuais...
      Collaboration.configure({ document: provider.document }),
      CollaborationCursor.configure({
        provider,
        user: { name: user.name, color: generateColor(user.id) }
      })
    ]
  }
}
```

**`apps/web/src/app/[workspaceSlug]/notes/[id]/page.tsx`:**
```typescript
const provider = new HocuspocusProvider({
  url: process.env.NEXT_PUBLIC_COLLAB_URL, // ws://collab.seudominio.com
  name: `${workspaceId}.${noteId}`,
  token: sessionToken,
})
```

**Mudança no save:** Y.js passa a ser a fonte da verdade para o `content`. O frontend só salva `title` e `icon` via REST.

---

## Variáveis de ambiente novas

**`apps/web/.env`:**
```
NEXT_PUBLIC_COLLAB_URL=ws://collab.seudominio.com
```

**`apps/collab/.env`:**
```
DATABASE_URL=...   # mesmo do web
PORT=1234
```

---

## Ordem de execução

```
1. Monorepo Setup          (Fase 1)
2. packages/shared         (Fase 2)
3. Better Auth Orgs        (Fase 3)
4. Prisma Schema           (Fase 4)
5. Routing                 (Fase 5)
6. API Routes              (Fase 6)
7. Storage                 (Fase 7)
8. Hocuspocus Server       (Fase 8)
9. Tiptap Collaboration    (Fase 9)
```

---

## Arquivos críticos

| Arquivo | Fase |
|---|---|
| `pnpm-workspace.yaml` (novo) | 1 |
| `apps/web/src/lib/auth.ts` | 3 |
| `apps/web/src/lib/auth-client.ts` | 3 |
| `prisma/schema.prisma` | 3, 4, 8 |
| `apps/web/src/app/` (routing completo) | 5 |
| `apps/web/src/app/api/**` (todas as rotas) | 6 |
| `apps/web/src/server/upload.ts` | 7 |
| `apps/collab/src/index.ts` (novo) | 8 |
| `apps/web/src/lib/notes-editor-config.ts` | 9 |

---

## Checklist de verificação

- [ ] `pnpm install` na raiz sem erros
- [ ] `pnpm --filter @refstash/web dev` sobe o Next.js
- [ ] BA gera tabelas organization/member/invitation
- [ ] Criar org, convidar membro, aceitar convite funciona
- [ ] Migração Prisma aplica sem erros; dados existentes associados ao workspace pessoal
- [ ] Rotas `/[slug]/notes` acessíveis; redirect correto na raiz
- [ ] APIs retornam 403 para membro de outro workspace
- [ ] Upload salva em `workspaceId/notes/...` no S3
- [ ] `apps/collab` conecta via wscat; token inválido recebe erro
- [ ] Dois browsers no mesmo editor mostram cursores e mudanças em tempo real

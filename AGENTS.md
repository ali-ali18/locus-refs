# AGENTS.md - Guia para Agentes de Código

Este documento fornece orientações para agentes de código que operam neste repositório.

---

## 1. Comandos de Build, Lint e Test

### Comandos Principais (usar SEMPRE pnpm)

```bash
# Desenvolvimento
pnpm dev          # Inicia servidor de desenvolvimento
pnpm build        # Build de produção
pnpm start        # Inicia servidor de produção

# Lint e Formatação
pnpm lint         # Executa Biome check (linter)
pnpm format       # Executa Biome format --write

# Testes
pnpm test         # Vitest em modo watch
pnpm test:run     # Vitest executa uma vez

# Rodar teste único
pnpm test -- src/app/api/notes/route.test.ts
pnpm test:run src/app/api/notes/route.test.ts
```

### Commit

```bash
pnpm commit        # Commitizen para commits estruturados
```

---

## 2. Código de Estilo e Convenções

### Configurações do Projeto

- **Package Manager**: SEMPRE usar `pnpm` (não npm ou yarn)
- **TypeScript**: Modo strict ativado (`strict: true` no tsconfig)
- **Path Alias**: `@/*` pointing to `./src/*`
- **Linter**: Biome 2.2.0
- **Framework**: Next.js 16 (App Router)

### Regras do Biome

```json
{
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "recommended": true,
    "domains": {
      "next": "recommended",
      "react": "recommended"
    }
  },
  "assist": {
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  }
}
```

### Imports

Ordem recomendada:
1. Imports externos (React, Next.js, libs)
2. Imports do projeto (`@/...`)
3. Imports relativos (`../`, `./`)

O Biome está configurado para organizar imports automaticamente (`organizeImports`).

### Convenções de Nomenclatura

| Tipo | Convenção | Exemplo |
|------|------------|---------|
| Componentes | PascalCase | `Button.tsx`, `NoteEditor.tsx` |
| Hooks | camelCase com prefixo `use` | `useNotes.ts`, `useNote.ts` |
| Arquivos de tipos | `.type.ts` ou `.types.ts` | `note.type.ts`, `categories.type.ts` |
| Schemas Zod | `.schema.ts` | `note.schema.ts`, `auth.schema.ts` |
| Utilitários | camelCase | `utils.ts`, `api.ts` |
| Testes | `.test.ts` | `route.test.ts` |

### Componentes UI

- **Base**: shadcn/ui (não usar Radix diretamente)
- **Variantes**: Usar CVA (class-variance-authority)
- **Estilização**: Tailwind CSS com classes utilitárias
- **Nomenclatura de arquivos**: `.tsx` para componentes com JSX

Exemplo de componente com CVA:
```typescript
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva("...", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { default: "...", sm: "...", lg: "..." }
  },
  defaultVariants: { variant: "default", size: "default" }
})

function Button({ className, variant, ...props }: ButtonProps) {
  return <Primitive className={cn(buttonVariants({ variant }), className)} />
}
```

### Tipos e TypeScript

- Sempre usar tipos explícitos para parâmetros de funções e retornos
- Usar `type` para unions/intersections simples
- Usar interfaces para objetos extensíveis
- Zod para validação de dados (schemas em `src/types/schema/`)

```typescript
// Bom
async function getNotes(): Promise<Note[]> {
  const { data } = await api.get<Note[]>("/api/notes")
  return data
}

// Bom - tipos para API routes
interface ApiError {
  error: string
  code: string
}
```

### TipTap (Editor de Notas)

- Configurações do editor em `src/lib/notes-editor-config.ts`
- Extensões customizadas em `src/lib/extension/`
- Ícones do editor em `src/components/tiptap-icons/`

### TanStack Query (Data Fetching)

- Hooks globais de query em `src/hook/` (TanStack Query)
- Hooks locais ficam dentro da feature correspondente (`components/notes/hook/`, `components/dashboard/hooks/`)
- Keys de query centralizadas em arquivos `*Keys.ts`

```typescript
// Estrutura recomendada
src/
  hook/                      # Hooks globais (TanStack Query)
    notes/
      useNotes.ts
      useNote.ts
      noteKeys.ts

  components/
    notes/
      hook/                 # Hooks locais de notas
        useFormCreateNote.ts
    dashboard/
      hooks/                # Hooks locais do dashboard
        useResourceMutations.ts
      services/             # Services locais
        useResource.ts
```

### tratamento de Erros em API Routes

Retornar sempre no formato:
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

## 3. Regras de Code Review (do .cursor/rules/)

**Em português** - Aplicar em todas as revisões:

1. Execute `git status` para listar arquivos modificados
2. Execute `git diff` para mudanças ainda não staged
3. Execute `git diff --staged` para mudanças já staged
4. Analise os diffs em busca de:
   - Bugs e regressões lógicas
   - Credenciais, tokens ou dados sensíveis expostos
   - console.log, debugger ou print esquecidos
   - Código morto, TODOs não resolvidos
   - Imports não utilizados ou quebrados
   - Problemas de performance óbvios
5. Liste os problemas encontrados com: arquivo, linha e sugestão de correção
6. Se nenhum problema for encontrado, confirme que está limpo para commitar

**Regras Importantes:**
- NUNCA use `--no-verify` em comandos git
- NUNCA desabilite git hooks
- Se um hook falhar, corrija o problema

---

## 4. Estrutura de Diretórios

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── */route.test.ts
│   ├── dashboard/        # Páginas autenticadas
│   └── page.tsx          # Página pública
├── components/
│   ├── ui/               # Componentes shadcn/ui globais
│   ├── base/             # Componentes base compartilhados
│   ├── tiptap-icons/     # Ícones do Tiptap
│   ├── tiptap-ui-utils/ # Utilitários UI do Tiptap
│   ├── notes/            # Feature Notas
│   │   ├── note/         # Componentes internos de nota
│   │   │   └── hook/     # Hooks específicos de nota
│   │   ├── hook/         # Hooks de notas (TanStack Query)
│   │   └── *.tsx
│   ├── dashboard/        # Feature Dashboard
│   │   ├── hooks/        # Hooks locais do dashboard
│   │   ├── services/     # Services locais
│   │   └── *.tsx
│   ├── categories/       # Feature Categorias
│   └── auth/             # Feature Autenticação
│       └── hook/         # Hooks de auth
├── hook/                 # TanStack Query hooks globais
│   ├── notes/
│   └── categories/
├── lib/                  # Utilitários e configurações
│   ├── extension/       # Extensões Tiptap
│   └── data/            # Dados estáticos
├── types/
│   ├── schema/          # Zod schemas
│   └── *.type.ts        # TypeScript types
└── server/              # Utilitários server-side
```

### Padrão de Componentes por Feature

Componentes são organizados por **feature** (notes, dashboard, categories, auth). Cada feature pode ter:
- **hook/** ou **hooks/**: Hooks locais (useFormCreateNote, useResourceMutations)
- **services/**: Services locais (useResource, useCategory)
- **Componentes .tsx**: Componentes específicos da feature
- **hook/ dentro de subpasta**: Hooks específicos de um componente

Hooks globais de data fetching ficam em `src/hook/` (TanStack Query).

---

## 5. Tecnologias Principais do Projeto

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Next.js 16 |
| UI Components | shadcn/ui + Base UI |
| Editor | Tiptap |
| Styling | Tailwind CSS v4 |
| State/Fetch | TanStack Query v5 |
| Auth | Better Auth |
| Database | Prisma + PostgreSQL |
| Validation | Zod |
| Testing | Vitest |
| Linting | Biome |

---

## 6. Notas Adicionais

- Sempre usar `"use client"` para componentes que usam state, hooks ou eventos do browser
- Componentes de servidor (Server Components) não precisam de diretiva
- Para data fetching em clientes, preferir React Query (TanStack Query)
- Para mutations, usar React Query com invalidation de queries relacionadas
- API routes são Serverless - evitar dependências de contexto global
- Testes usam `vi.mock()` e `vi.hoisted()` do Vitest

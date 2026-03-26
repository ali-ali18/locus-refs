# Refstash

Aplicação para gerenciar notas e coleções de recursos, com editor de texto rico, blocos customizados (Kanban, Gantt, Calendário) e upload de imagens.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** (strict) + **Tailwind CSS v4** + **shadcn/ui**
- **Tiptap** — editor de texto rico com extensões customizadas
- **TanStack Query v5** — data fetching e cache
- **Better Auth** — autenticação
- **Prisma** + **PostgreSQL** — banco de dados
- **S3-compatible storage** (testado com [Garage](https://garagehq.deuxfleurs.fr/)) — upload de imagens
- **Biome** — lint e format | **Vitest** — testes

## Requisitos

- Node.js 20+
- pnpm
- PostgreSQL
- Storage S3-compatible (Garage, MinIO, AWS S3, etc.)

## Instalação

```bash
pnpm install
```

Configure as variáveis de ambiente copiando o exemplo:

```bash
cp .env.example .env
```

Rode as migrations do banco:

```bash
pnpm exec prisma migrate dev
```

## Variáveis de ambiente

```env
# Banco de dados
DATABASE_URL=postgresql://user:password@localhost:5432/refstash

# Auth (Better Auth)
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:3000

# Storage S3-compatible
STORAGE_ENDPOINT=http://localhost:3900
STORAGE_REGION=garage          # ou us-east-1 para AWS
STORAGE_ACCESS_KEY=your-access-key
STORAGE_SECRET_KEY=your-secret-key
STORAGE_BUCKET=refstash

# URL pública da aplicação
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Configuração do storage

O upload de imagens passa pelo servidor Next.js (`POST /api/upload/notes`) e as imagens são servidas via proxy interno (`/storage/*` → Garage). O bucket não precisa ser público — basta configurar as variáveis de ambiente corretamente.

## Comandos

```bash
pnpm dev        # Servidor de desenvolvimento
pnpm build      # Build de produção
pnpm start      # Servidor de produção
pnpm lint       # Biome linter
pnpm format     # Biome format
pnpm test       # Vitest (watch)
pnpm test:run   # Vitest (single run)
pnpm commit     # Commitizen (commits estruturados)
```

## Estrutura

```
src/
├── app/              # Next.js App Router (páginas e API routes)
├── components/       # Componentes por feature
│   └── ui/           # shadcn/ui + componentes globais
├── hook/             # TanStack Query hooks globais
├── lib/              # Utilitários, config do editor Tiptap, extensões
├── server/           # Helpers server-side (auth, storage)
└── types/            # Tipos TypeScript e schemas Zod
```

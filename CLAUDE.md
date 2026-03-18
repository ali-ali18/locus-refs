# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Always use `pnpm` (never npm or yarn).

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm lint         # Biome linter check
pnpm format       # Biome format --write
pnpm test         # Vitest watch mode
pnpm test:run     # Vitest single run
pnpm test -- src/app/api/notes/route.test.ts  # Run a single test file
pnpm commit       # Commitizen structured commits
```

Never use `--no-verify` on git commands. If a hook fails, fix the problem.

## Architecture

**Refstash** is a Next.js 16 (App Router) app for managing notes and resource collections.

**Stack:** React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui, Tiptap (rich text editor), TanStack Query v5, React Hook Form + Zod, Better Auth, Prisma + PostgreSQL, Biome, Vitest.

### Data flow

```
React Components
  → TanStack Query hooks (src/hook/)
    → Next.js API routes (src/app/api/)
      → Prisma (src/lib/prisma.ts / src/server/)
        → PostgreSQL
```

### Key directories

- `src/app/` — Next.js App Router: pages, layouts, and API routes
- `src/components/` — Feature-based components (notes, dashboard, categories, auth)
  - `src/components/ui/` — shadcn/ui global components
  - `src/components/base/` — Shared base components
- `src/hook/` — **Global** TanStack Query hooks (`useNotes`, `useCategories`, etc.) with query keys in `*Keys.ts` files
- `src/lib/` — Utilities, Tiptap editor config (`notes-editor-config.ts`), and custom Tiptap extensions (`lib/extension/`)
- `src/types/` — TypeScript types (`*.type.ts`) and Zod schemas (`types/schema/*.schema.ts`)
- `src/server/` — Server-side utilities (session/auth helpers, `requireSession()`)

### Routing

- `/` — Login (public)
- `/register` — Registration
- `/dashboard` — Authenticated home
- `/dashboard/notes` — Notes list
- `/dashboard/notes/[id]` — Note editor (Tiptap)
- `/dashboard/categories` — Categories management
- `/api/*` — Serverless API routes

### Hooks placement

- **Global data fetching** → `src/hook/<feature>/` (TanStack Query, shared across the app)
- **Local form/UI hooks** → `src/components/<feature>/hook/` or `hooks/` (scoped to the feature)

### API response format

```typescript
// Success
return Response.json({ message: "...", data: ... }, { status: 201 })

// Error
return Response.json({ error: "User-friendly message", code: "ERROR_CODE" }, { status: 400 })
```

## Conventions

- Path alias: `@/*` → `./src/*`
- Components: PascalCase `.tsx`; hooks: `useXxx.ts`; types: `*.type.ts`; schemas: `*.schema.ts`
- Use `"use client"` only for components that use state, hooks, or browser events
- Component variants use CVA (`class-variance-authority`) + `cn()` from `@/lib/utils`
- UI: use shadcn/ui components — this project uses shadcn/ui built on top of **Base UI** (not Radix UI). Do not use Radix primitives directly.
- Tiptap editor config lives in `src/lib/notes-editor-config.ts`; custom extensions in `src/lib/extension/`
- Tests use `vi.mock()` and `vi.hoisted()` from Vitest; test files are `*.test.ts` co-located with API routes

## Design Patterns

### Components
- **Always use shadcn/ui** for UI components (`src/components/ui/`). Only create a component from scratch if shadcn/ui has no equivalent.
- **Border radius:** always use `rounded-xl` (never `rounded`, `rounded-md`, `rounded-lg`, etc.) unless a specific context requires otherwise (e.g. `rounded-full` for avatars/pills).

### Colors
- **Never hardcode colors** such as `bg-blue-500`, `text-red-600`, `border-green-300`, etc.
- All colors must derive from the design tokens defined in `src/app/globals.css` and used via Tailwind semantic classes:
  - Backgrounds: `bg-background`, `bg-card`, `bg-muted`, `bg-accent`, `bg-primary`, `bg-secondary`, `bg-destructive`, `bg-popover`, `bg-sidebar`, `bg-sidebar-accent`
  - Text: `text-foreground`, `text-muted-foreground`, `text-primary`, `text-secondary-foreground`, `text-accent-foreground`, `text-destructive`, `text-sidebar-foreground`
  - Borders: `border-border`, `border-input`, `border-sidebar-border`
  - Rings: `ring-ring`, `ring-sidebar-ring`

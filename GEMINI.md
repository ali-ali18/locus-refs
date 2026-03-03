# Refstash Project Overview

Refstash is a modern web application built with **Next.js 16**, **React 19**, and **TypeScript**. It utilizes a robust stack including **Prisma** for database management, **Better Auth** for authentication, and **Tailwind CSS v4** for styling.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library:** [React 19](https://react.dev/) (with React Compiler enabled)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with [@base-ui/react](https://base-ui.com/react)
- **Database:** [Prisma](https://www.prisma.io/) (PostgreSQL)
- **Authentication:** [Better Auth](https://www.better-auth.com/)
- **Linting & Formatting:** [Biome](https://biomejs.dev/)
- **Icons:** [Hugeicons](https://hugeicons.com/)

## Project Structure

- `src/app/`: Next.js App Router (pages, layouts, and API routes).
- `src/components/`:
  - `ui/`: Shared UI components (shadcn-like, using Base UI).
  - `auth/`: Authentication-specific components (Login, Register).
  - `base/`: Core layout and structural components.
  - `shared/`: Generic reusable components (Icons, ThemeProvider, etc.).
- `src/lib/`: Core logic, including Prisma client (`prisma.ts`) and Auth configuration (`auth.ts`).
- `src/types/`: TypeScript definitions and Zod schemas.
- `prisma/`: Database schema and migrations.
- `public/`: Static assets.

## Key Commands

- `pnpm dev`: Starts the development server.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Runs Biome check for linting and formatting.
- `pnpm format`: Formats the codebase using Biome.
- `npx prisma generate`: Generates the Prisma client (output to `src/generated/prisma`).
- `npx prisma db push`: Pushes the schema changes to the database.

## Development Conventions

- **Linting & Formatting:** Biome is the primary tool for linting and formatting. Ensure `pnpm lint` passes before committing.
- **Component Organization:** Follow the existing structure in `src/components`. Use `src/components/ui` for primitive components.
- **Type Safety:** Use TypeScript strictly. Define Zod schemas in `src/types` for validation.
- **Prisma Client:** The Prisma client is generated into `src/generated/prisma`. Always import the client from `src/lib/prisma.ts`.
- **Styling:** Use Tailwind CSS v4 utility classes. Prefer Vanilla CSS for complex animations or custom styles.
- **Authentication:** Use `better-auth` for session management and authentication logic. Auth configuration is located in `src/lib/auth.ts`.
- **React Compiler:** The project has `reactCompiler: true` enabled in `next.config.ts`. Write standard React 19 code; the compiler will handle optimizations.

## Getting Started

1. Install dependencies: `pnpm install`
2. Set up environment variables in `.env` (refer to `src/lib/auth.ts` for required variables like `BETTER_AUTH_URL`).
3. Generate Prisma client: `npx prisma generate`
4. Start the development server: `pnpm dev`

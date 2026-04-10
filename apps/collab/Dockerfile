FROM node:22-alpine AS base
RUN corepack enable

FROM base AS builder
WORKDIR /app

# Layer 1: manifests + prisma schema — só invalida quando deps mudarem
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY apps/collab/package.json apps/collab/
COPY packages/shared/package.json packages/shared/
# node-linker=hoisted: pnpm instala como npm (sem symlinks) — necessário para COPY entre stages funcionar
RUN echo "node-linker=hoisted" >> .npmrc && pnpm install --frozen-lockfile

# Layer 2: source — invalida a cada push
COPY apps/collab/src apps/collab/src
COPY apps/collab/tsconfig.json apps/collab/
COPY packages/shared packages/shared
# tsc compila src/ → dist/ (exclui src/generated — Prisma v7 gera .js que importam .ts internamente)
RUN pnpm --filter @refstash/collab build
# Copia os arquivos pré-compilados do Prisma (incluindo .ts que o client.js importa em runtime)
RUN cp -r apps/collab/src/generated apps/collab/dist/

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/collab/dist ./apps/collab/dist
COPY --from=builder /app/apps/collab/package.json ./apps/collab/package.json

WORKDIR /app/apps/collab
EXPOSE 1234
CMD ["node", "dist/index.js"]

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
# postinstall roda "prisma generate" e gera os clients em src/generated/
RUN pnpm install --frozen-lockfile

# Layer 2: source — invalida a cada push
COPY apps/collab/src apps/collab/src
COPY packages/shared packages/shared
# tsc compila src/ → dist/ (inclui src/generated/prisma/*.ts → dist/generated/prisma/)
RUN pnpm --filter @refstash/collab build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Hoisted node_modules do monorepo (pnpm hospeda tudo aqui)
COPY --from=builder /app/node_modules ./node_modules
# JS compilado + Prisma client compilado
COPY --from=builder /app/apps/collab/dist ./apps/collab/dist
COPY --from=builder /app/apps/collab/package.json ./apps/collab/package.json

WORKDIR /app/apps/collab
EXPOSE 1234
CMD ["node", "dist/index.js"]

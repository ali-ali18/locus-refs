FROM node:22-alpine AS base
RUN corepack enable

FROM base AS builder
WORKDIR /app

# Layer 1: manifests + prisma schema — só invalida quando deps mudarem
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma
COPY prisma.config.mjs ./
COPY apps/realtime/package.json apps/realtime/
COPY packages/shared/package.json packages/shared/

# postinstall roda "prisma generate" (inclui realtime_client)
RUN pnpm install --frozen-lockfile

# Layer 2: source — invalida a cada push
COPY apps/realtime/src apps/realtime/src
COPY apps/realtime/tsconfig.json apps/realtime/
COPY apps/realtime/tsconfig.build.json apps/realtime/
COPY apps/realtime/nest-cli.json apps/realtime/
COPY packages/shared packages/shared

RUN pnpm --filter @refstash/realtime build

# Prisma v7: client .js ainda importa .ts — usa o generated original em runtime
RUN rm -rf apps/realtime/dist/generated \
 && cp -r apps/realtime/src/generated apps/realtime/dist/generated

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/apps/realtime/dist ./apps/realtime/dist
COPY --from=builder /app/apps/realtime/package.json ./apps/realtime/package.json
# @refstash/shared exporta .ts — carregado via tsx no CMD
COPY --from=builder /app/packages/shared ./packages/shared

WORKDIR /app/apps/realtime
EXPOSE 4001

# tsx: resolve @refstash/shared (source .ts) em produção
# Envs: PORT, DATABASE_URL, REDIS_URL, REALTIME_JWT_SECRET (Redis externo)
CMD ["node", "--import", "tsx", "dist/main.js"]

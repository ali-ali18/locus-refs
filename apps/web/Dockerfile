FROM node:22-alpine AS base
RUN corepack enable

FROM base AS builder
WORKDIR /app

# Layer 1: manifests + prisma schema — só invalida quando deps mudarem
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
# postinstall roda "prisma generate"
RUN pnpm install --frozen-lockfile

# Layer 2: source — invalida a cada push
COPY apps/web/src apps/web/src
COPY apps/web/public apps/web/public
COPY apps/web/next.config.ts apps/web/
COPY apps/web/tsconfig.json apps/web/
COPY apps/web/postcss.config.mjs apps/web/
COPY packages/shared packages/shared

# NEXT_PUBLIC_* são baked no bundle no build time — devem ser passados como build args no Dokploy
ARG NEXT_PUBLIC_COLLAB_WS_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_COLLAB_WS_URL=$NEXT_PUBLIC_COLLAB_WS_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm --filter @refstash/web build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Standalone output — Next.js traça e inclui apenas os node_modules necessários
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

# Prisma CLI + client para rodar migrate deploy no start
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000
CMD ["sh", "-c", "node node_modules/.bin/prisma migrate deploy --schema=/app/prisma/schema.prisma && node apps/web/server.js"]

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

function createPrismaClient(): PrismaClient {
  return new PrismaClient({ adapter });
}

const cached = globalThis.__prisma;
const prisma =
  cached && "agentThread" in cached && cached.agentThread
    ? cached
    : createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

export default prisma;

-- CreateEnum
CREATE TYPE "AgentThreadVisibility" AS ENUM ('private', 'workspace');

-- CreateTable
CREATE TABLE "agent_thread" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "visibility" "AgentThreadVisibility" NOT NULL DEFAULT 'private',
    "title" TEXT,
    "messages" JSONB NOT NULL DEFAULT '[]',
    "lastOpenedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_thread_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "agent_thread_workspaceId_visibility_updatedAt_idx" ON "agent_thread"("workspaceId", "visibility", "updatedAt");

-- CreateIndex
CREATE INDEX "agent_thread_workspaceId_createdById_idx" ON "agent_thread"("workspaceId", "createdById");

-- AddForeignKey
ALTER TABLE "agent_thread" ADD CONSTRAINT "agent_thread_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_thread" ADD CONSTRAINT "agent_thread_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "AgentSkillVisibility" AS ENUM ('personal', 'workspace');

-- CreateTable
CREATE TABLE "agent_skills" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "prompt" TEXT NOT NULL,
    "requiresNote" BOOLEAN NOT NULL DEFAULT false,
    "visibility" "AgentSkillVisibility" NOT NULL DEFAULT 'personal',
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_skills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "agent_skills_userId_visibility_idx" ON "agent_skills"("userId", "visibility");

-- CreateIndex
CREATE INDEX "agent_skills_workspaceId_visibility_idx" ON "agent_skills"("workspaceId", "visibility");

-- AddForeignKey
ALTER TABLE "agent_skills" ADD CONSTRAINT "agent_skills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_skills" ADD CONSTRAINT "agent_skills_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

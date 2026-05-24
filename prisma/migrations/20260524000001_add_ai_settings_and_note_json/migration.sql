-- Convert any existing non-JSON content in Note.content to empty Tiptap document
UPDATE "Note"
SET "content" = '{"type":"doc","content":[]}'
WHERE "content" !~ '^\s*[\[{]';

-- Change Note.content from TEXT to JSONB
ALTER TABLE "Note" ALTER COLUMN "content" TYPE JSONB USING "content"::JSONB;
ALTER TABLE "Note" ALTER COLUMN "content" SET DEFAULT '{"type":"doc","content":[]}';

-- CreateTable workspace_ai_settings
CREATE TABLE "workspace_ai_settings" (
    "workspaceId" TEXT NOT NULL,
    "defaultModelId" TEXT NOT NULL DEFAULT 'claude-sonnet-4-6',
    "systemPrompt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_ai_settings_pkey" PRIMARY KEY ("workspaceId")
);

-- AddForeignKey
ALTER TABLE "workspace_ai_settings" ADD CONSTRAINT "workspace_ai_settings_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

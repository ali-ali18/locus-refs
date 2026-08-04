-- CreateTable
CREATE TABLE "kanban_board" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "workspaceId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "lastOpenedAt" TIMESTAMP(3),

    CONSTRAINT "kanban_board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kanban_column" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "position" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kanban_column_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kanban_card" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "columnId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "position" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kanban_card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "kanban_board_workspaceId_idx" ON "kanban_board"("workspaceId");

-- CreateIndex
CREATE INDEX "kanban_board_createdById_idx" ON "kanban_board"("createdById");

-- CreateIndex
CREATE INDEX "kanban_board_lastOpenedAt_idx" ON "kanban_board"("lastOpenedAt");

-- CreateIndex
CREATE INDEX "kanban_column_boardId_idx" ON "kanban_column"("boardId");

-- CreateIndex
CREATE INDEX "kanban_column_boardId_position_idx" ON "kanban_column"("boardId", "position");

-- CreateIndex
CREATE INDEX "kanban_card_boardId_idx" ON "kanban_card"("boardId");

-- CreateIndex
CREATE INDEX "kanban_card_columnId_idx" ON "kanban_card"("columnId");

-- CreateIndex
CREATE INDEX "kanban_card_columnId_position_idx" ON "kanban_card"("columnId", "position");

-- CreateIndex
CREATE INDEX "kanban_card_createdById_idx" ON "kanban_card"("createdById");

-- AddForeignKey
ALTER TABLE "kanban_board" ADD CONSTRAINT "kanban_board_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kanban_board" ADD CONSTRAINT "kanban_board_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kanban_column" ADD CONSTRAINT "kanban_column_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "kanban_board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kanban_card" ADD CONSTRAINT "kanban_card_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "kanban_board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kanban_card" ADD CONSTRAINT "kanban_card_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "kanban_column"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kanban_card" ADD CONSTRAINT "kanban_card_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

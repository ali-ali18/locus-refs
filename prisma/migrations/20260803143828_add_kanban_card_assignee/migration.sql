-- AlterTable
ALTER TABLE "kanban_card" ADD COLUMN     "assigneeId" TEXT;

-- CreateIndex
CREATE INDEX "kanban_card_assigneeId_idx" ON "kanban_card"("assigneeId");

-- AddForeignKey
ALTER TABLE "kanban_card" ADD CONSTRAINT "kanban_card_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

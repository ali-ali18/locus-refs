-- AlterTable
ALTER TABLE "kanban_card" ADD COLUMN     "dueDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "kanban_card_dueDate_idx" ON "kanban_card"("dueDate");

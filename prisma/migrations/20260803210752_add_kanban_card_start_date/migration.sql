-- AlterTable
ALTER TABLE "kanban_card" ADD COLUMN     "startDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "kanban_card_startDate_idx" ON "kanban_card"("startDate");

/*
  Warnings:

  - A unique constraint covering the columns `[name,workspaceId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,workspaceId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspaceId,slug]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workspaceId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Category_name_key";

-- DropIndex
DROP INDEX "Category_name_userId_key";

-- DropIndex
DROP INDEX "Category_slug_key";

-- DropIndex
DROP INDEX "Category_slug_userId_key";

-- DropIndex
DROP INDEX "Collection_userId_slug_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "workspaceId" TEXT NOT NULL,
ADD COLUMN     "ydoc" BYTEA;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_workspaceId_key" ON "Category"("name", "workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_workspaceId_key" ON "Category"("slug", "workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_workspaceId_slug_key" ON "Collection"("workspaceId", "slug");

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

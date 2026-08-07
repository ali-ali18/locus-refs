-- AlterTable
ALTER TABLE "calendar_events" ADD COLUMN "imageUrl" TEXT;

-- CreateTable
CREATE TABLE "calendar_event_assignees" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "calendar_event_assignees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "calendar_event_assignees_userId_idx" ON "calendar_event_assignees"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "calendar_event_assignees_eventId_userId_key" ON "calendar_event_assignees"("eventId", "userId");

-- AddForeignKey
ALTER TABLE "calendar_event_assignees" ADD CONSTRAINT "calendar_event_assignees_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "calendar_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_event_assignees" ADD CONSTRAINT "calendar_event_assignees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

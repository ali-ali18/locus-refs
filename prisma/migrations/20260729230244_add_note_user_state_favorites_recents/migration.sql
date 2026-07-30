-- CreateTable
CREATE TABLE "note_user_state" (
    "userId" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "favoritedAt" TIMESTAMP(3),
    "lastOpenedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "note_user_state_pkey" PRIMARY KEY ("userId","noteId")
);

-- CreateIndex
CREATE INDEX "note_user_state_userId_isFavorite_favoritedAt_idx" ON "note_user_state"("userId", "isFavorite", "favoritedAt");

-- CreateIndex
CREATE INDEX "note_user_state_userId_lastOpenedAt_idx" ON "note_user_state"("userId", "lastOpenedAt");

-- AddForeignKey
ALTER TABLE "note_user_state" ADD CONSTRAINT "note_user_state_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_user_state" ADD CONSTRAINT "note_user_state_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

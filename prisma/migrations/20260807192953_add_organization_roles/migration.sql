-- CreateTable
CREATE TABLE "organization_role" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "organization_role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "organization_role_organizationId_idx" ON "organization_role"("organizationId");

-- CreateIndex
CREATE INDEX "organization_role_role_idx" ON "organization_role"("role");

-- AddForeignKey
ALTER TABLE "organization_role" ADD CONSTRAINT "organization_role_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

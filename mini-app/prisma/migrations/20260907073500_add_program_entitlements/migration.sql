CREATE TYPE "ProgramEntitlementSource" AS ENUM (
  'COACH_ASSIGNMENT',
  'FREE_CLAIM',
  'PURCHASE',
  'SUBSCRIPTION',
  'ADMIN_GRANT'
);

CREATE TABLE "ProgramEntitlement" (
  "id" SERIAL NOT NULL,
  "programId" INTEGER NOT NULL,
  "userId" INTEGER NOT NULL,
  "source" "ProgramEntitlementSource" NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ProgramEntitlement_pkey"
    PRIMARY KEY ("id")
);

CREATE INDEX
  "ProgramEntitlement_programId_idx"
ON "ProgramEntitlement"("programId");

CREATE INDEX
  "ProgramEntitlement_userId_idx"
ON "ProgramEntitlement"("userId");

CREATE INDEX
  "ProgramEntitlement_source_idx"
ON "ProgramEntitlement"("source");

CREATE INDEX
  "ProgramEntitlement_isActive_idx"
ON "ProgramEntitlement"("isActive");

CREATE INDEX
  "ProgramEntitlement_userId_programId_isActive_idx"
ON "ProgramEntitlement"(
  "userId",
  "programId",
  "isActive"
);

CREATE INDEX
  "ProgramEntitlement_expiresAt_idx"
ON "ProgramEntitlement"("expiresAt");

ALTER TABLE "ProgramEntitlement"
ADD CONSTRAINT
  "ProgramEntitlement_programId_fkey"
FOREIGN KEY ("programId")
REFERENCES "TrainingProgram"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "ProgramEntitlement"
ADD CONSTRAINT
  "ProgramEntitlement_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;


/*
 * Backfill current coach assignments.
 *
 * Existing application access must not be lost when the
 * entitlement layer is introduced.
 */
INSERT INTO "ProgramEntitlement" (
  "programId",
  "userId",
  "source",
  "isActive",
  "startsAt",
  "createdAt",
  "updatedAt"
)
SELECT
  pa."programId",
  pa."clientId",
  'COACH_ASSIGNMENT'::"ProgramEntitlementSource",
  true,
  COALESCE(
    pa."startDate",
    pa."createdAt"
  ),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "ProgramAssignment" pa
WHERE pa."isActive" = true;

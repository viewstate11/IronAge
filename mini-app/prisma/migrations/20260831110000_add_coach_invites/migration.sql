CREATE TABLE "CoachInvite" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "coachId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoachInvite_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CoachInvite_token_key"
ON "CoachInvite"("token");

CREATE INDEX "CoachInvite_coachId_idx"
ON "CoachInvite"("coachId");

CREATE INDEX "CoachInvite_expiresAt_idx"
ON "CoachInvite"("expiresAt");

ALTER TABLE "CoachInvite"
ADD CONSTRAINT "CoachInvite_coachId_fkey"
FOREIGN KEY ("coachId")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

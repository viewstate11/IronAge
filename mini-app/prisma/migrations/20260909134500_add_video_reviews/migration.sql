-- CreateEnum
CREATE TYPE "VideoReviewStatus" AS ENUM (
  'PENDING',
  'REVIEWED',
  'REJECTED'
);

-- CreateTable
CREATE TABLE "VideoReview" (
  "id" SERIAL NOT NULL,
  "clientId" INTEGER NOT NULL,
  "coachId" INTEGER NOT NULL,
  "workoutSessionId" INTEGER,
  "exerciseName" TEXT NOT NULL,
  "videoUrl" TEXT NOT NULL,
  "athleteNote" TEXT,
  "coachFeedback" TEXT,
  "status" "VideoReviewStatus" NOT NULL DEFAULT 'PENDING',
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "VideoReview_pkey"
    PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX "VideoReview_clientId_idx"
  ON "VideoReview"("clientId");

CREATE INDEX "VideoReview_coachId_idx"
  ON "VideoReview"("coachId");

CREATE INDEX "VideoReview_status_idx"
  ON "VideoReview"("status");

CREATE INDEX "VideoReview_coachId_status_idx"
  ON "VideoReview"("coachId", "status");

CREATE INDEX "VideoReview_submittedAt_idx"
  ON "VideoReview"("submittedAt");

CREATE INDEX "VideoReview_workoutSessionId_idx"
  ON "VideoReview"("workoutSessionId");

-- Foreign keys
ALTER TABLE "VideoReview"
ADD CONSTRAINT "VideoReview_clientId_fkey"
FOREIGN KEY ("clientId")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "VideoReview"
ADD CONSTRAINT "VideoReview_coachId_fkey"
FOREIGN KEY ("coachId")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "VideoReview"
ADD CONSTRAINT "VideoReview_workoutSessionId_fkey"
FOREIGN KEY ("workoutSessionId")
REFERENCES "WorkoutSession"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

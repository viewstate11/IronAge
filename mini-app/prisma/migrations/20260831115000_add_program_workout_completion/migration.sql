-- CreateTable
CREATE TABLE "ProgramWorkoutCompletion" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "programWorkoutId" INTEGER NOT NULL,
    "workoutSessionId" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgramWorkoutCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProgramWorkoutCompletion_workoutSessionId_key" ON "ProgramWorkoutCompletion"("workoutSessionId");

-- CreateIndex
CREATE INDEX "ProgramWorkoutCompletion_assignmentId_idx" ON "ProgramWorkoutCompletion"("assignmentId");

-- CreateIndex
CREATE INDEX "ProgramWorkoutCompletion_programWorkoutId_idx" ON "ProgramWorkoutCompletion"("programWorkoutId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramWorkoutCompletion_assignmentId_programWorkoutId_key" ON "ProgramWorkoutCompletion"("assignmentId", "programWorkoutId");

-- AddForeignKey
ALTER TABLE "ProgramWorkoutCompletion" ADD CONSTRAINT "ProgramWorkoutCompletion_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "ProgramAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramWorkoutCompletion" ADD CONSTRAINT "ProgramWorkoutCompletion_programWorkoutId_fkey" FOREIGN KEY ("programWorkoutId") REFERENCES "ProgramWorkout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramWorkoutCompletion" ADD CONSTRAINT "ProgramWorkoutCompletion_workoutSessionId_fkey" FOREIGN KEY ("workoutSessionId") REFERENCES "WorkoutSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;


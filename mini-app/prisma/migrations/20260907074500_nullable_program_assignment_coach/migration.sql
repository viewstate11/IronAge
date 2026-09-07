ALTER TABLE "ProgramAssignment"
DROP CONSTRAINT "ProgramAssignment_assignedBy_fkey";

ALTER TABLE "ProgramAssignment"
ALTER COLUMN "assignedBy"
DROP NOT NULL;

ALTER TABLE "ProgramAssignment"
ADD CONSTRAINT "ProgramAssignment_assignedBy_fkey"
FOREIGN KEY ("assignedBy")
REFERENCES "User"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

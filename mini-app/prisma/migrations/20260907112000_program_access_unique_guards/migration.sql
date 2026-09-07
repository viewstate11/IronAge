-- Prevent duplicate active entitlement
-- for the same user, program and source.
CREATE UNIQUE INDEX
  "ProgramEntitlement_active_user_program_source_key"
ON "ProgramEntitlement"
  ("userId", "programId", "source")
WHERE "isActive" = true;


-- Prevent duplicate active self-service
-- assignment for the same client + program.
CREATE UNIQUE INDEX
  "ProgramAssignment_active_self_service_key"
ON "ProgramAssignment"
  ("clientId", "programId")
WHERE
  "isActive" = true
  AND "assignedBy" IS NULL;


-- A client may have only one active
-- coach-assigned training program.
CREATE UNIQUE INDEX
  "ProgramAssignment_active_coach_client_key"
ON "ProgramAssignment"
  ("clientId")
WHERE
  "isActive" = true
  AND "assignedBy" IS NOT NULL;

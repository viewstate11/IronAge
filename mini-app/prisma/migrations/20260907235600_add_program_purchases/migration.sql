-- Add store product identifiers to published training programs.
ALTER TABLE "TrainingProgram"
ADD COLUMN "appleProductId" TEXT,
ADD COLUMN "googleProductId" TEXT;

-- Each App Store / Google Play product maps to at most one IRONAGE program.
CREATE UNIQUE INDEX
"TrainingProgram_appleProductId_key"
ON "TrainingProgram"("appleProductId");

CREATE UNIQUE INDEX
"TrainingProgram_googleProductId_key"
ON "TrainingProgram"("googleProductId");

-- Verified purchase ledger for standalone training programs.
CREATE TABLE "ProgramPurchase" (
    "id" SERIAL NOT NULL,
    "programId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "originalTransactionId" TEXT,
    "amountCents" INTEGER,
    "currency" TEXT,
    "purchasedAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramPurchase_pkey"
    PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX
"ProgramPurchase_transactionId_key"
ON "ProgramPurchase"("transactionId");

CREATE INDEX
"ProgramPurchase_programId_idx"
ON "ProgramPurchase"("programId");

CREATE INDEX
"ProgramPurchase_userId_idx"
ON "ProgramPurchase"("userId");

CREATE INDEX
"ProgramPurchase_provider_idx"
ON "ProgramPurchase"("provider");

CREATE INDEX
"ProgramPurchase_platform_idx"
ON "ProgramPurchase"("platform");

CREATE INDEX
"ProgramPurchase_productId_idx"
ON "ProgramPurchase"("productId");

CREATE INDEX
"ProgramPurchase_purchasedAt_idx"
ON "ProgramPurchase"("purchasedAt");

ALTER TABLE "ProgramPurchase"
ADD CONSTRAINT "ProgramPurchase_programId_fkey"
FOREIGN KEY ("programId")
REFERENCES "TrainingProgram"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "ProgramPurchase"
ADD CONSTRAINT "ProgramPurchase_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

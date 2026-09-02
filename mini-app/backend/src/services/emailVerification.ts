import {
  createHash,
  randomBytes,
} from "node:crypto";

import { prisma } from "../prisma.js";

import type { Prisma } from "../../generated/prisma/client.js";

const EMAIL_VERIFICATION_TTL_MS =
  30 * 60 * 1000;

function hashVerificationToken(
  token: string
): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

async function createEmailVerificationTokenWithDb(
  userId: number,
  db: Prisma.TransactionClient
): Promise<{
  token: string;
  expiresAt: Date;
}> {
  const token =
    randomBytes(32).toString("hex");

  const tokenHash =
    hashVerificationToken(token);

  const expiresAt =
    new Date(
      Date.now() +
        EMAIL_VERIFICATION_TTL_MS
    );

  await db.emailVerificationToken.deleteMany({
    where: {
      userId,
    },
  });

  await db.emailVerificationToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return {
    token,
    expiresAt,
  };
}

export async function createEmailVerificationToken(
  userId: number
): Promise<{
  token: string;
  expiresAt: Date;
}> {
  return prisma.$transaction(
    async (tx) =>
      createEmailVerificationTokenWithDb(
        userId,
        tx
      )
  );
}

export async function createEmailVerificationTokenInTransaction(
  userId: number,
  tx: Prisma.TransactionClient
): Promise<{
  token: string;
  expiresAt: Date;
}> {
  return createEmailVerificationTokenWithDb(
    userId,
    tx
  );
}

export async function verifyEmailWithToken(
  token: string
): Promise<number | null> {
  if (!token) {
    return null;
  }

  const tokenHash =
    hashVerificationToken(token);

  return prisma.$transaction(
    async (tx) => {
      const verification =
        await tx.emailVerificationToken.findUnique({
          where: {
            tokenHash,
          },
          select: {
            id: true,
            userId: true,
            expiresAt: true,
          },
        });

      if (!verification) {
        return null;
      }

      if (
        verification.expiresAt.getTime() <=
        Date.now()
      ) {
        await tx.emailVerificationToken.delete({
          where: {
            id: verification.id,
          },
        });

        return null;
      }

      const identity =
        await tx.authIdentity.findFirst({
          where: {
            userId: verification.userId,
            provider: "EMAIL",
          },
          select: {
            id: true,
          },
        });

      if (!identity) {
        await tx.emailVerificationToken.delete({
          where: {
            id: verification.id,
          },
        });

        return null;
      }

      await tx.authIdentity.update({
        where: {
          id: identity.id,
        },
        data: {
          emailVerified: true,
        },
      });

      await tx.emailVerificationToken.delete({
        where: {
          id: verification.id,
        },
      });

      return verification.userId;
    }
  );
}

import {
  createHash,
  randomBytes,
} from "node:crypto";

import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../prisma.js";

const SESSION_LIFETIME_MS =
  1000 * 60 * 60 * 24 * 30;

function hashSessionToken(
  token: string
): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function createAuthSession(
  userId: number,
  db: Prisma.TransactionClient | typeof prisma =
    prisma
) {
  const token =
    randomBytes(32)
      .toString("base64url");

  const tokenHash =
    hashSessionToken(token);

  console.log(
    "IRONAGE SESSION SERVER CREATE:",
    tokenHash.slice(0, 8)
  );

  const expiresAt =
    new Date(
      Date.now() +
        SESSION_LIFETIME_MS
    );

  const created =
    await db.authSession.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
      select: {
        id: true,
        userId: true,
        tokenHash: true,
        expiresAt: true,
      },
    });

  if (
    created.userId !== userId ||
    created.tokenHash !== tokenHash
  ) {
    throw new Error(
      "Auth session persistence mismatch"
    );
  }

  const persisted =
    await db.authSession.findUnique({
      where: {
        tokenHash,
      },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
      },
    });

  if (!persisted) {
    throw new Error(
      "Auth session was not persisted"
    );
  }

  if (
    persisted.userId !== userId
  ) {
    throw new Error(
      "Auth session user mismatch"
    );
  }

  return {
    token,
    expiresAt:
      persisted.expiresAt,
  };
}

export async function getAuthSessionUser(
  token: string
) {
  if (!token) {
    return null;
  }

  const tokenHash =
    hashSessionToken(token);

  console.log(
    "IRONAGE SESSION SERVER LOOKUP:",
    tokenHash.slice(0, 8)
  );

  const session =
    await prisma.authSession.findUnique({
      where: {
        tokenHash,
      },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
      },
    });

  if (!session) {
    return null;
  }

  if (
    session.expiresAt.getTime() <=
    Date.now()
  ) {
    await prisma.authSession
      .delete({
        where: {
          id: session.id,
        },
      })
      .catch(() => undefined);

    return null;
  }

  return {
    userId: session.userId,
    sessionId: session.id,
    expiresAt: session.expiresAt,
  };
}

export async function revokeAuthSession(
  token: string
): Promise<void> {
  if (!token) {
    return;
  }

  const tokenHash =
    hashSessionToken(token);

  await prisma.authSession.deleteMany({
    where: {
      tokenHash,
    },
  });
}

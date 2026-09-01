import {
  createHash,
  randomBytes,
} from "node:crypto";

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
  userId: number
) {
  const token =
    randomBytes(32)
      .toString("base64url");

  const tokenHash =
    hashSessionToken(token);

  const expiresAt =
    new Date(
      Date.now() +
        SESSION_LIFETIME_MS
    );

  await prisma.authSession.create({
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

export async function getAuthSessionUser(
  token: string
) {
  if (!token) {
    return null;
  }

  const tokenHash =
    hashSessionToken(token);

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

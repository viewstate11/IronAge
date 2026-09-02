import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { prisma } from "../prisma.js";

import {
  getAuthSessionUser,
} from "../services/authSession.js";

import {
  requireTelegramAuth,
  getAuthenticatedTelegramUser,
} from "./authMiddleware.js";

/* =========================================================
   TYPES
========================================================= */

export type AppAuthenticatedRequest =
  Request & {
    appUserId: number;
    authType: "telegram" | "session";
    sessionId?: number;
  };

/* =========================================================
   COOKIE SESSION ORIGIN PROTECTION
========================================================= */

const trustedWebOrigins =
  new Set([
    "https://ironage.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ]);

function isMutationMethod(
  method: string
): boolean {
  return [
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
  ].includes(
    method.toUpperCase()
  );
}

function hasTrustedCookieOrigin(
  req: Request
): boolean {
  const origin =
    req.header("origin")?.trim();

  return Boolean(
    origin &&
    trustedWebOrigins.has(origin)
  );
}

/* =========================================================
   WEB ID VALIDATION
========================================================= */


/* =========================================================
   APP AUTH
   TELEGRAM OR WEB
========================================================= */

export async function requireAppAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    /* =====================================================
       TELEGRAM DETECTION
    ===================================================== */

    const telegramInitData =
      req.header(
        "x-telegram-init-data"
      )?.trim();

    const authorization =
      req.header(
        "authorization"
      )?.trim();

    const hasTelegramAuth =
      Boolean(
        telegramInitData ||
        authorization?.startsWith(
          "Bearer "
        )
      );

    /* =====================================================
       TELEGRAM
    ===================================================== */

    if (hasTelegramAuth) {
      await new Promise<void>(
        (resolve, reject) => {
          requireTelegramAuth(
            req,
            res,
            () => resolve()
          );
        }
      );

      /*
       * If requireTelegramAuth already
       * returned an HTTP error, do not continue.
       */

      if (res.headersSent) {
        return;
      }

      const telegramUser =
        getAuthenticatedTelegramUser(
          req
        );

      const user =
        await prisma.user.findUnique({
          where: {
            telegramId:
              BigInt(
                telegramUser.id
              ),
          },
          select: {
            id: true,
          },
        });

      if (!user) {
        res.status(404).json({
          success: false,
          message:
            "IRONAGE Telegram user not found",
        });

        return;
      }

      const authenticatedRequest =
        req as AppAuthenticatedRequest;

      authenticatedRequest.appUserId =
        user.id;

      authenticatedRequest.authType =
        "telegram";

      next();

      return;
    }

    /* =====================================================
       SESSION
    ===================================================== */

    const headerSessionToken =
      req.header(
        "x-ironage-session"
      )?.trim();

    const cookieHeader =
      req.header("cookie") || "";

    const cookieSessionToken =
      cookieHeader
        .split(";")
        .map(value => value.trim())
        .find(value =>
          value.startsWith(
            "ironage_session="
          )
        )
        ?.slice(
          "ironage_session=".length
        );

    let decodedCookieSessionToken = "";

    if (cookieSessionToken) {
      try {
        decodedCookieSessionToken =
          decodeURIComponent(
            cookieSessionToken
          );
      } catch {
        res.status(401).json({
          success: false,
          message:
            "Invalid IRONAGE session cookie",
        });

        return;
      }
    }

    const isCookieSession =
      Boolean(
        !headerSessionToken &&
        decodedCookieSessionToken
      );

    if (
      isCookieSession &&
      isMutationMethod(req.method) &&
      !hasTrustedCookieOrigin(req)
    ) {
      res.status(403).json({
        success: false,
        message:
          "IRONAGE request origin denied",
      });

      return;
    }

    const sessionToken =
      headerSessionToken ||
      decodedCookieSessionToken;

    if (sessionToken) {
      const session =
        await getAuthSessionUser(
          sessionToken
        );

      if (!session) {
        res.status(401).json({
          success: false,
          message:
            "Invalid or expired IRONAGE session",
        });

        return;
      }

      const authenticatedRequest =
        req as AppAuthenticatedRequest;

      authenticatedRequest.appUserId =
        session.userId;

      authenticatedRequest.authType =
        "session";

      authenticatedRequest.sessionId =
        session.sessionId;

      next();

      return;
    }

    res.status(401).json({
      success: false,
      message:
        "IRONAGE authentication required",
    });

    return;
  } catch (error) {
    console.error(
      "IRONAGE APP AUTH ERROR:",
      error
    );

    if (res.headersSent) {
      return;
    }

    res.status(500).json({
      success: false,
      message:
        "Authentication service error",
    });
  }
}

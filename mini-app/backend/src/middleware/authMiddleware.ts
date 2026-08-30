import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  validateTelegramInitData,
  type TelegramAuthUser,
} from "../services/telegramAuth.js";

/* =========================================================
   TYPES
========================================================= */

export type AuthenticatedRequest =
  Request & {
    telegramUser: TelegramAuthUser;
    telegramAuthDate: number;
    telegramQueryId?: string;
  };

/* =========================================================
   GET TELEGRAM INIT DATA
========================================================= */

function getInitData(
  req: Request
): string | null {
  /*
   * Preferred:
   *
   * Authorization: Bearer <telegram-init-data>
   */

  const authorization =
    req.header("authorization");

  if (
    authorization &&
    authorization.startsWith("Bearer ")
  ) {
    const token =
      authorization
        .slice(7)
        .trim();

    if (token) {
      return token;
    }
  }

  /*
   * Alternative:
   *
   * x-telegram-init-data
   */

  const initData =
    req.header(
      "x-telegram-init-data"
    );

  if (
    initData &&
    initData.trim()
  ) {
    return initData.trim();
  }

  return null;
}

/* =========================================================
   TELEGRAM AUTH MIDDLEWARE
========================================================= */

export function requireTelegramAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    /* =====================================================
       PRODUCTION / REAL TELEGRAM AUTH
    ===================================================== */

    const initData =
      getInitData(req);

    if (!initData) {
      res.status(401).json({
        success: false,
        message:
          "Telegram authentication required",
      });

      return;
    }

    /*
     * Cryptographically validate
     * Telegram WebApp initData.
     */

    const auth =
      validateTelegramInitData(
        initData
      );

    const authenticatedRequest =
      req as AuthenticatedRequest;

    authenticatedRequest.telegramUser =
      auth.user;

    authenticatedRequest.telegramAuthDate =
      auth.authDate;

    authenticatedRequest.telegramQueryId =
      auth.queryId;

    next();
  } catch (error) {
    console.error(
      "IRONAGE TELEGRAM AUTH ERROR:",
      error
    );

    res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Invalid Telegram authentication",
    });
  }
}

/* =========================================================
   GET AUTHENTICATED TELEGRAM USER
========================================================= */

export function getAuthenticatedTelegramUser(
  req: Request
): TelegramAuthUser {
  const authenticatedRequest =
    req as Partial<AuthenticatedRequest>;

  if (
    !authenticatedRequest.telegramUser
  ) {
    throw new Error(
      "Authenticated Telegram user is missing"
    );
  }

  return authenticatedRequest.telegramUser;
}

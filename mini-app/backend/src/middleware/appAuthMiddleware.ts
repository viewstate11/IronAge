import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { prisma } from "../prisma.js";

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
    authType: "telegram" | "web";
    webId?: string;
  };

/* =========================================================
   WEB ID VALIDATION
========================================================= */

function isValidWebId(
  webId: string
): boolean {
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidPattern.test(webId);
}

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
       WEB
    ===================================================== */

    const webId =
      req.header(
        "x-ironage-web-id"
      )?.trim();

    if (!webId) {
      res.status(401).json({
        success: false,
        message:
          "IRONAGE authentication required",
      });

      return;
    }

    if (!isValidWebId(webId)) {
      res.status(401).json({
        success: false,
        message:
          "Invalid IRONAGE web identity",
      });

      return;
    }

    const user =
      await prisma.user.findUnique({
        where: {
          webId,
        },
        select: {
          id: true,
        },
      });

    if (!user) {
      res.status(404).json({
        success: false,
        message:
          "IRONAGE web user not found",
      });

      return;
    }

    const authenticatedRequest =
      req as AppAuthenticatedRequest;

    authenticatedRequest.appUserId =
      user.id;

    authenticatedRequest.authType =
      "web";

    authenticatedRequest.webId =
      webId;

    next();
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

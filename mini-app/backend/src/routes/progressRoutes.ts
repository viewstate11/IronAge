import { Router } from "express";

import { prisma } from "../prisma.js";

import {
  requireAppAuth,
  type AppAuthenticatedRequest,
} from "../middleware/appAuthMiddleware.js";

const router = Router();

/* =========================================================
   HELPERS
========================================================= */

function parseOptionalNumber(
  value: unknown,
  fieldName: string
): number | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(
      `${fieldName} must be a valid number`
    );
  }

  return parsed;
}

function validateOptionalRange(
  value: number | null,
  fieldName: string,
  min: number,
  max: number
): void {
  if (value === null) {
    return;
  }

  if (value < min || value > max) {
    throw new Error(
      `${fieldName} must be between ${min} and ${max}`
    );
  }
}

/* =========================================================
   CREATE PROGRESS
   POST /api/progress
========================================================= */

router.post(
  "/",
  requireAppAuth,
  async (req, res) => {
    try {
      const authenticatedRequest =
        req as AppAuthenticatedRequest;

      const user =
        await prisma.user.findUnique({
          where: {
            id: authenticatedRequest.appUserId,
          },
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const {
        weight,
        bodyFat,
        muscleMass,
        note,
      } = req.body ?? {};

      const parsedWeight =
        parseOptionalNumber(
          weight,
          "weight"
        );

      const parsedBodyFat =
        parseOptionalNumber(
          bodyFat,
          "bodyFat"
        );

      const parsedMuscleMass =
        parseOptionalNumber(
          muscleMass,
          "muscleMass"
        );

      validateOptionalRange(
        parsedWeight,
        "weight",
        20,
        500
      );

      validateOptionalRange(
        parsedBodyFat,
        "bodyFat",
        0,
        100
      );

      validateOptionalRange(
        parsedMuscleMass,
        "muscleMass",
        0,
        300
      );

      if (
        note !== undefined &&
        note !== null &&
        typeof note !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: "note must be a string",
        });
      }

      const progress =
        await prisma.progress.create({
          data: {
            userId: user.id,

            weight:
              parsedWeight,

            bodyFat:
              parsedBodyFat,

            muscleMass:
              parsedMuscleMass,

            note:
              typeof note === "string"
                ? note.trim() || null
                : null,
          },
        });

      return res.status(201).json({
        success: true,
        progress,
      });
    } catch (error) {
      console.error(
        "IRONAGE CREATE PROGRESS ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Progress create error",
      });
    }
  }
);

/* =========================================================
   GET CURRENT USER PROGRESS
   GET /api/progress
========================================================= */

router.get(
  "/",
  requireAppAuth,
  async (req, res) => {
    try {
      const authenticatedRequest =
        req as AppAuthenticatedRequest;

      const user =
        await prisma.user.findUnique({
          where: {
            id: authenticatedRequest.appUserId,
          },
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const progress =
        await prisma.progress.findMany({
          where: {
            userId: user.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      return res.json({
        success: true,
        progress,
      });
    } catch (error) {
      console.error(
        "IRONAGE GET PROGRESS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Progress load error",
      });
    }
  }
);

/* =========================================================
   GET CURRENT USER PROGRESS BY TELEGRAM ID
   GET /api/progress/telegram/:telegramId

   Kept only for compatibility with existing frontend/API
   calls. Ownership is strictly enforced.
========================================================= */

router.get(
  "/telegram/:telegramId",
  requireAppAuth,
  async (req, res) => {
    try {
      const authenticatedRequest =
        req as AppAuthenticatedRequest;

      if (
        authenticatedRequest.authType !==
        "telegram"
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      const requestedTelegramId =
        String(
          req.params.telegramId
        );

      const user =
        await prisma.user.findUnique({
          where: {
            id: authenticatedRequest.appUserId,
          },
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (
        user.telegramId === null ||
        String(user.telegramId) !==
        requestedTelegramId
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const progress =
        await prisma.progress.findMany({
          where: {
            userId: user.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      return res.json({
        success: true,
        progress,
      });
    } catch (error) {
      console.error(
        "IRONAGE GET TELEGRAM PROGRESS ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Progress load error",
      });
    }
  }
);

export default router;
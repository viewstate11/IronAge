import { Router } from "express";

import { prisma } from "../prisma.js";

import {
  validateTelegramInitData,
} from "../services/telegramAuth.js";

const router = Router();

/* =========================================================
   SERIALIZE USER
========================================================= */

function serializeUser(
  user: any
) {
  return {
    id: user.id,

    telegramId:
      user.telegramId !== null
        ? user.telegramId.toString()
        : null,

    webId:
      user.webId,

    username:
      user.username,

    firstName:
      user.firstName,

    lastName:
      user.lastName,

    languageCode:
      user.languageCode,

    age:
      user.age,

    gender:
      user.gender,

    weight:
      user.weight,

    height:
      user.height,

    goal:
      user.goal,

    onboardingCompleted:
      user.onboardingCompleted,

    level:
      user.level,

    xp:
      user.xp,

    workouts:
      user.workouts,

    streak:
      user.streak,

    premiumPlan:
      user.premiumPlan,

    createdAt:
      user.createdAt,

    updatedAt:
      user.updatedAt,
  };
}

/* =========================================================
   TELEGRAM LOGIN
   POST /api/auth/telegram
========================================================= */

router.post(
  "/telegram",
  async (req, res) => {
    try {
      const initData =
        typeof req.body?.initData ===
        "string"
          ? req.body.initData.trim()
          : "";

      if (!initData) {
        return res.status(400).json({
          success: false,
          message:
            "Telegram initData is required",
        });
      }

      /*
       * CRITICAL:
       *
       * Never trust user data coming
       * from frontend.
       *
       * Telegram user is extracted only
       * after cryptographic validation.
       */

      const auth =
        validateTelegramInitData(
          initData
        );

      const telegramUser =
        auth.user;

      /*
       * Upsert by Telegram ID.
       */

      const user =
        await prisma.user.upsert({
          where: {
            telegramId:
              BigInt(
                telegramUser.id
              ),
          },

          create: {
            telegramId:
              BigInt(
                telegramUser.id
              ),

            username:
              telegramUser.username ??
              null,

            firstName:
              telegramUser.first_name,

            lastName:
              telegramUser.last_name ??
              null,

            languageCode:
              telegramUser.language_code ??
              null,
          },

          update: {
            username:
              telegramUser.username ??
              null,

            firstName:
              telegramUser.first_name,

            lastName:
              telegramUser.last_name ??
              null,

            languageCode:
              telegramUser.language_code ??
              null,
          },
        });

      return res.status(200).json({
        success: true,

        auth: {
          telegramId:
            telegramUser.id,

          authDate:
            auth.authDate,
        },

        user:
          serializeUser(user),
      });
    } catch (error) {
      console.error(
        "IRONAGE TELEGRAM LOGIN ERROR:",
        error
      );

      return res.status(401).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Telegram authentication failed",
      });
    }
  }
);

/* =========================================================
   HEALTH
   GET /api/auth/health
========================================================= */

router.get(
  "/health",
  (_req, res) => {
    return res.json({
      success: true,
      service:
        "telegram-auth",
      status:
        "online",
    });
  }
);
/*
 * =========================================================
 * WEB LOGIN
 * POST /api/auth/web
 * =========================================================
 */

router.post(
  "/web",
  async (req, res) => {
    try {
      const webId =
        typeof req.body?.webId === "string"
          ? req.body.webId.trim()
          : "";

      if (!webId) {
        return res.status(400).json({
          success: false,
          message:
            "Web identity is required",
        });
      }

      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      if (!uuidPattern.test(webId)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid web identity",
        });
      }

      let user =
        await prisma.user.findUnique({
          where: {
            webId,
          },
        });

      if (!user) {
        user =
          await prisma.user.create({
            data: {
              webId,

              firstName:
                "IRONAGE",

              lastName:
                null,

              username:
                null,

              languageCode:
                "uk",
            },
          });
      }

      return res.json({
        success: true,
        authType: "web",
        user: serializeUser(user),
      });
    } catch (error) {
      console.error(
        "IRONAGE WEB LOGIN ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Web authentication failed",
      });
    }
  }
);

export default router;
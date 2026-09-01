import {
  Router,
  type Request,
  type Response,
} from "express";

import { prisma } from "../prisma.js";

import {
  hashPassword,
  verifyPassword,
} from "../services/passwordAuth.js";

import {
  createAuthSession,
  revokeAuthSession,
} from "../services/authSession.js";

import {
  validateTelegramInitData,
} from "../services/telegramAuth.js";

const router = Router();

const SESSION_COOKIE_NAME =
  "ironage_session";

const SESSION_COOKIE_MAX_AGE_MS =
  1000 * 60 * 60 * 24 * 30;

function setSessionCookie(
  res: any,
  token: string
): void {
  res.cookie(
    SESSION_COOKIE_NAME,
    token,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      path: "/",
      maxAge:
        SESSION_COOKIE_MAX_AGE_MS,
    }
  );
}

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


/* =========================================================
   EMAIL REGISTRATION
   POST /api/auth/email/register
========================================================= */

router.post(
  "/email/register",
  async (req, res) => {
    try {
      const email =
        typeof req.body?.email === "string"
          ? req.body.email.trim().toLowerCase()
          : "";

      const password =
        typeof req.body?.password === "string"
          ? req.body.password
          : "";

      const firstName =
        typeof req.body?.firstName === "string"
          ? req.body.firstName.trim()
          : "";

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !email ||
        !emailPattern.test(email)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Valid email is required",
        });
      }

      if (
        password.length < 8 ||
        password.length > 128
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be between 8 and 128 characters",
        });
      }

      if (
        firstName.length > 80
      ) {
        return res.status(400).json({
          success: false,
          message:
            "First name is too long",
        });
      }

      const existingIdentity =
        await prisma.authIdentity.findUnique({
          where: {
            provider_providerUserId: {
              provider: "EMAIL",
              providerUserId: email,
            },
          },
          select: {
            id: true,
          },
        });

      if (existingIdentity) {
        return res.status(409).json({
          success: false,
          message:
            "Email is already registered",
        });
      }

      const passwordHash =
        await hashPassword(password);

      const user =
        await prisma.$transaction(
          async (tx) => {
            const createdUser =
              await tx.user.create({
                data: {
                  firstName:
                    firstName || "IRONAGE",

                  lastName: null,

                  username: null,

                  languageCode: "uk",
                },
              });

            await tx.authIdentity.create({
              data: {
                userId:
                  createdUser.id,

                provider:
                  "EMAIL",

                providerUserId:
                  email,

                email,

                emailVerified:
                  false,

                passwordHash,
              },
            });

            return createdUser;
          }
        );

      const session =
        await createAuthSession(
          user.id
        );

      setSessionCookie(
        res,
        session.token
      );

      return res.status(201).json({
        success: true,

        authType:
          "session",

        session: {
          expiresAt:
            session.expiresAt,
        },

        user:
          serializeUser(user),
      });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Email is already registered",
        });
      }

      console.error(
        "IRONAGE EMAIL REGISTER ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Email registration failed",
      });
    }
  }
);


/* =========================================================
   EMAIL LOGIN
   POST /api/auth/email/login
========================================================= */

router.post(
  "/email/login",
  async (req, res) => {
    try {
      const email =
        typeof req.body?.email === "string"
          ? req.body.email.trim().toLowerCase()
          : "";

      const password =
        typeof req.body?.password === "string"
          ? req.body.password
          : "";

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message:
            "Email and password are required",
        });
      }

      const identity =
        await prisma.authIdentity.findUnique({
          where: {
            provider_providerUserId: {
              provider: "EMAIL",
              providerUserId: email,
            },
          },
          include: {
            user: true,
          },
        });

      if (
        !identity ||
        !identity.passwordHash
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password",
        });
      }

      const passwordValid =
        await verifyPassword(
          password,
          identity.passwordHash
        );

      if (!passwordValid) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password",
        });
      }

      const session =
        await createAuthSession(
          identity.userId
        );

      setSessionCookie(
        res,
        session.token
      );

      return res.status(200).json({
        success: true,

        authType:
          "session",

        session: {
          expiresAt:
            session.expiresAt,
        },

        user:
          serializeUser(identity.user),
      });
    } catch (error) {
      console.error(
        "IRONAGE EMAIL LOGIN ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Email login failed",
      });
    }
  }
);

/* =========================================================
   LOGOUT
========================================================= */

router.post(
  "/logout",
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const cookieHeader =
        req.header("cookie") || "";

      const cookieValue =
        cookieHeader
          .split(";")
          .map(value =>
            value.trim()
          )
          .find(value =>
            value.startsWith(
              `${SESSION_COOKIE_NAME}=`
            )
          );

      const headerSessionToken =
        req.header(
          "x-ironage-session"
        )?.trim() || "";

      let cookieSessionToken = "";

      if (
        cookieValue &&
        !headerSessionToken
      ) {
        try {
          cookieSessionToken =
            decodeURIComponent(
              cookieValue.slice(
                SESSION_COOKIE_NAME.length + 1
              )
            );
        } catch {
          res.clearCookie(
            SESSION_COOKIE_NAME,
            {
              httpOnly: true,
              secure:
                process.env.NODE_ENV ===
                "production",
              sameSite: "lax",
              path: "/",
            }
          );

          return res.status(400).json({
            success: false,
            message:
              "Invalid IRONAGE session cookie",
          });
        }
      }

      const sessionToken =
        headerSessionToken ||
        cookieSessionToken;

      if (sessionToken) {
        await revokeAuthSession(
          sessionToken
        );
      }

      res.clearCookie(
        SESSION_COOKIE_NAME,
        {
          httpOnly: true,
          secure:
            process.env.NODE_ENV ===
            "production",
          sameSite: "lax",
          path: "/",
        }
      );

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error(
        "IRONAGE LOGOUT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Logout failed",
      });
    }
  }
);

export default router;
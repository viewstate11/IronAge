import {
  Router,
  type Request,
  type Response,
} from "express";

import type {
  NextFunction,
} from "express";

import {
  emailRegisterRateLimit,
  emailLoginRateLimit,
  googleLoginRateLimit,
  emailVerificationResendRateLimit,
} from "../services/authRateLimit.js";

import { prisma } from "../prisma.js";

import {
  hashPassword,
  verifyPasswordOrDummy,
} from "../services/passwordAuth.js";

import {
  createAuthSession,
  revokeAuthSession,
} from "../services/authSession.js";

import {
  validateTelegramInitData,
} from "../services/telegramAuth.js";

import {
  createEmailVerificationToken,
  createEmailVerificationTokenInTransaction,
  verifyEmailWithToken,
} from "../services/emailVerification.js";

import {
  sendEmailVerification,
} from "../services/emailSender.js";

import {
  verifyGoogleIdToken,
} from "../services/googleAuth.js";

const router = Router();

const SESSION_COOKIE_NAME =
  "ironage_session";

const SESSION_COOKIE_MAX_AGE_MS =
  1000 * 60 * 60 * 24 * 30;

function setSessionCookie(
  res: Response,
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

function isNativeIosRequest(
  req: Request
): boolean {
  const origin =
    req.header("origin")?.trim();

  const nativePlatform =
    req.header(
      "x-ironage-native-platform"
    )?.trim().toLowerCase();

  return (
    origin === "capacitor://localhost" &&
    nativePlatform === "ios"
  );
}

async function enforceEmailVerificationResendRateLimit(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const forwardedFor =
      req.headers["x-forwarded-for"];

    const realIp =
      req.headers["x-real-ip"];

    const identifier =
      (
        typeof forwardedFor === "string"
          ? forwardedFor.split(",")[0]?.trim()
          : Array.isArray(forwardedFor)
            ? forwardedFor[0]
            : undefined
      ) ||
      (
        typeof realIp === "string"
          ? realIp.trim()
          : Array.isArray(realIp)
            ? realIp[0]
            : undefined
      ) ||
      req.ip ||
      "unknown";

    const result =
      await emailVerificationResendRateLimit.limit(
        identifier
      );

    res.setHeader(
      "RateLimit-Limit",
      String(result.limit)
    );

    res.setHeader(
      "RateLimit-Remaining",
      String(result.remaining)
    );

    res.setHeader(
      "RateLimit-Reset",
      String(
        Math.ceil(
          result.reset / 1000
        )
      )
    );

    if (!result.success) {
      return res.status(429).json({
        success: false,
        message:
          "Too many verification email requests. Please try again later.",
      });
    }

    next();
  } catch (error) {
    console.error(
      "IRONAGE EMAIL VERIFICATION RATE LIMIT ERROR:",
      error
    );

    return res.status(503).json({
      success: false,
      message:
        "Authentication service temporarily unavailable",
    });
  }
}

async function enforceAuthRateLimit(
  req: Request,
  res: Response,
  next: NextFunction,
  type: "register" | "login"
) {
  try {
    const forwardedFor =
      req.headers["x-forwarded-for"];

    const realIp =
      req.headers["x-real-ip"];

    const identifier =
      (
        typeof forwardedFor === "string"
          ? forwardedFor.split(",")[0]?.trim()
          : Array.isArray(forwardedFor)
            ? forwardedFor[0]
            : undefined
      ) ||
      (
        typeof realIp === "string"
          ? realIp.trim()
          : Array.isArray(realIp)
            ? realIp[0]
            : undefined
      ) ||
      req.ip ||
      "unknown";

    const limiter =
      type === "register"
        ? emailRegisterRateLimit
        : emailLoginRateLimit;

    const result =
      await limiter.limit(
        identifier
      );

    res.setHeader(
      "RateLimit-Limit",
      String(result.limit)
    );

    res.setHeader(
      "RateLimit-Remaining",
      String(result.remaining)
    );

    res.setHeader(
      "RateLimit-Reset",
      String(
        Math.ceil(
          result.reset / 1000
        )
      )
    );

    if (!result.success) {
      return res.status(429).json({
        success: false,
        message:
          type === "register"
            ? "Too many registration attempts. Please try again later."
            : "Too many login attempts. Please try again later.",
      });
    }

    next();
  } catch (error) {
    console.error(
      "IRONAGE AUTH RATE LIMIT ERROR:",
      error
    );

    return res.status(503).json({
      success: false,
      message:
        "Authentication service temporarily unavailable",
    });
  }
}

const enforceEmailRegisterRateLimit =
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) =>
    enforceAuthRateLimit(
      req,
      res,
      next,
      "register"
    );

const enforceEmailLoginRateLimit =
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) =>
    enforceAuthRateLimit(
      req,
      res,
      next,
      "login"
    );

const enforceGoogleLoginRateLimit =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const forwardedFor =
        req.headers["x-forwarded-for"];

      const realIp =
        req.headers["x-real-ip"];

      const identifier =
        (
          typeof forwardedFor === "string"
            ? forwardedFor
                .split(",")[0]
                ?.trim()
            : Array.isArray(forwardedFor)
              ? forwardedFor[0]
              : undefined
        ) ||
        (
          typeof realIp === "string"
            ? realIp.trim()
            : Array.isArray(realIp)
              ? realIp[0]
              : undefined
        ) ||
        req.ip ||
        "unknown";

      const result =
        await googleLoginRateLimit.limit(
          identifier
        );

      res.setHeader(
        "RateLimit-Limit",
        String(result.limit)
      );

      res.setHeader(
        "RateLimit-Remaining",
        String(result.remaining)
      );

      res.setHeader(
        "RateLimit-Reset",
        String(
          Math.ceil(
            result.reset / 1000
          )
        )
      );

      if (!result.success) {
        return res.status(429).json({
          success: false,
          message:
            "Too many Google login attempts. Please try again later.",
        });
      }

      next();
    } catch (error) {
      console.error(
        "IRONAGE GOOGLE RATE LIMIT ERROR:",
        error
      );

      return res.status(503).json({
        success: false,
        message:
          "Authentication service temporarily unavailable",
      });
    }
  };

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
/* =========================================================
   EMAIL REGISTRATION
   POST /api/auth/email/register
========================================================= */

router.post(
  "/email/register",
  enforceEmailRegisterRateLimit,
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

      const {
        user,
        verificationToken,
      } =
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

            const verification =
              await createEmailVerificationTokenInTransaction(
                createdUser.id,
                tx
              );

            return {
              user: createdUser,
              verificationToken:
                verification.token,
            };
          }
        );

      await sendEmailVerification({
        email,
        token:
          verificationToken,
      });

      return res.status(201).json({
        success: true,

        emailVerificationRequired:
          true,

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
   RESEND EMAIL VERIFICATION
   POST /api/auth/email/resend-verification
========================================================= */

router.post(
  "/email/resend-verification",
  enforceEmailVerificationResendRateLimit,
  async (req, res) => {
    const genericResponse = () =>
      res.status(200).json({
        success: true,
        message:
          "If the account exists and requires verification, a verification email has been sent.",
      });

    try {
      const email =
        typeof req.body?.email === "string"
          ? req.body.email
              .trim()
              .toLowerCase()
          : "";

      if (!email) {
        return genericResponse();
      }

      const identity =
        await prisma.authIdentity.findFirst({
          where: {
            provider: "EMAIL",
            email,
          },
          select: {
            userId: true,
            emailVerified: true,
          },
        });

      if (
        !identity ||
        identity.emailVerified
      ) {
        return genericResponse();
      }

      const verification =
        await createEmailVerificationToken(
          identity.userId
        );

      await sendEmailVerification({
        email,
        token:
          verification.token,
      });

      return genericResponse();
    } catch (error) {
      console.error(
        "IRONAGE EMAIL VERIFICATION RESEND ERROR:",
        error
      );

      return res.status(503).json({
        success: false,
        message:
          "Verification email service temporarily unavailable",
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
  enforceEmailLoginRateLimit,
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
        });

      const passwordValid =
        await verifyPasswordOrDummy(
          password,
          identity?.passwordHash
        );

      if (
        !identity ||
        !identity.passwordHash ||
        !passwordValid
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password",
        });
      }

      if (!identity.emailVerified) {
        return res.status(403).json({
          success: false,
          emailVerificationRequired:
            true,
          message:
            "Email verification is required",
        });
      }

      const user =
        await prisma.user.findUnique({
          where: {
            id: identity.userId,
          },
        });

      if (!user) {
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

          ...(isNativeIosRequest(req)
            ? {
                token:
                  session.token,
              }
            : {}),
        },

        user:
          serializeUser(user),
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
   GOOGLE LOGIN
   POST /api/auth/google
========================================================= */

router.post(
  "/google",
  enforceGoogleLoginRateLimit,
  async (req, res) => {
    try {
      const idToken =
        typeof req.body?.idToken === "string"
          ? req.body.idToken.trim()
          : "";

      if (!idToken) {
        return res.status(400).json({
          success: false,
          message:
            "Google ID token is required",
        });
      }

      const google =
        await verifyGoogleIdToken(
          idToken
        );

      let identity =
        await prisma.authIdentity.findUnique({
          where: {
            provider_providerUserId: {
              provider: "GOOGLE",
              providerUserId:
                google.providerUserId,
            },
          },
          include: {
            user: true,
          },
        });

      if (!identity) {
        const emailIdentity =
          await prisma.authIdentity.findFirst({
            where: {
              provider: "EMAIL",
              email: google.email,
              emailVerified: true,
            },
            select: {
              userId: true,
            },
          });

        const userId =
          await prisma.$transaction(
            async (tx) => {
              if (emailIdentity) {
                await tx.authIdentity.create({
                  data: {
                    userId:
                      emailIdentity.userId,

                    provider:
                      "GOOGLE",

                    providerUserId:
                      google.providerUserId,

                    email:
                      google.email,

                    emailVerified:
                      true,
                  },
                });

                return emailIdentity.userId;
              }

              const user =
                await tx.user.create({
                  data: {
                    firstName:
                      google.firstName,

                    lastName: null,
                    username: null,
                    languageCode: "uk",
                  },
                });

              await tx.authIdentity.create({
                data: {
                  userId:
                    user.id,

                  provider:
                    "GOOGLE",

                  providerUserId:
                    google.providerUserId,

                  email:
                    google.email,

                  emailVerified:
                    true,
                },
              });

              return user.id;
            }
          );

        identity =
          await prisma.authIdentity.findUnique({
            where: {
              provider_providerUserId: {
                provider: "GOOGLE",
                providerUserId:
                  google.providerUserId,
              },
            },
            include: {
              user: true,
            },
          });

        if (
          !identity ||
          identity.userId !== userId
        ) {
          throw new Error(
            "Google identity creation failed"
          );
        }
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

          ...(isNativeIosRequest(req)
            ? {
                token:
                  session.token,
              }
            : {}),
        },

        user:
          serializeUser(identity.user),
      });
    } catch (error) {
      console.error(
        "IRONAGE GOOGLE AUTH ERROR:",
        error
      );

      return res.status(401).json({
        success: false,
        message:
          "Google authentication failed",
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

router.post(
  "/email/verify",
  async (req, res) => {
    try {
      const token =
        typeof req.body?.token === "string"
          ? req.body.token.trim()
          : "";

      if (!token) {
        return res.status(400).json({
          success: false,
          message:
            "Verification token is required",
        });
      }

      const userId =
        await verifyEmailWithToken(
          token
        );

      if (!userId) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid or expired verification token",
        });
      }

      const session =
        await createAuthSession(
          userId
        );

      setSessionCookie(
        res,
        session.token
      );

      return res.status(200).json({
        success: true,

        authType:
          "session",

        emailVerified:
          true,

        session: {
          expiresAt:
            session.expiresAt,

          ...(isNativeIosRequest(req)
            ? {
                token:
                  session.token,
              }
            : {}),
        },
      });
    } catch (error) {
      console.error(
        "IRONAGE EMAIL VERIFY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Email verification failed",
      });
    }
  }
);

export default router;
import { Router } from "express";

import { prisma } from "../prisma.js";

import {
  requireAppAuth,
  type AppAuthenticatedRequest,
} from "../middleware/appAuthMiddleware.js";

import {
  requireTelegramAuth,
  getAuthenticatedTelegramUser,
} from "../middleware/authMiddleware.js";

const router = Router();

/* =========================================================
   HELPERS
========================================================= */

function parseOptionalNumber(
  value: unknown
): number | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const parsed =
    Number(value);

  if (
    !Number.isFinite(parsed)
  ) {
    throw new Error(
      "Invalid numeric value"
    );
  }

  return parsed;
}


function parseGender(
  value: unknown
): "MALE" | "FEMALE" | "OTHER" | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const normalized =
    String(value)
      .trim()
      .toUpperCase();

  if (
    ![
      "MALE",
      "FEMALE",
      "OTHER",
    ].includes(normalized)
  ) {
    throw new Error(
      "Invalid gender value"
    );
  }

  return normalized as
    | "MALE"
    | "FEMALE"
    | "OTHER";
}

function parseGoal(
  value: unknown
):
  | "MUSCLE"
  | "LOSE_WEIGHT"
  | "MAINTAIN"
  | "ENDURANCE"
  | "STRENGTH"
  | "FITNESS"
  | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const normalized =
    String(value)
      .trim()
      .toUpperCase();

  if (
    ![
      "MUSCLE",
      "LOSE_WEIGHT",
      "MAINTAIN",
      "ENDURANCE",
      "STRENGTH",
      "FITNESS",
    ].includes(normalized)
  ) {
    throw new Error(
      "Invalid goal value"
    );
  }

  return normalized as
    | "MUSCLE"
    | "LOSE_WEIGHT"
    | "MAINTAIN"
    | "ENDURANCE"
    | "STRENGTH"
    | "FITNESS";
}

/* =========================================================
   SERIALIZE USER
========================================================= */

function serializeUser(
  user: any
) {
  /*
   * IMPORTANT:
   *
   * workoutSessions are explicitly
   * loaded by GET user endpoints.
   *
   * They are converted into the
   * frontend-compatible history[].
   */

  const history =
    Array.isArray(
      user.workoutSessions
    )
      ? user.workoutSessions.map(
          (
            workout: any
          ) => ({
            id:
              workout.id,

            workoutId:
              workout.workoutId,

            name:
              workout.workoutName,

            date:
              workout.completedAt ??
              workout.createdAt,

            type:
              "workout",

            duration:
              workout.duration ??
              0,

            /*
             * Calories are not currently
             * stored in WorkoutSession.
             *
             * Keep 0 until calorie tracking
             * is implemented.
             */
            calories:
              0,

            xp:
              workout.xp ??
              0,

            completed:
              workout.status ===
              "COMPLETED",

            completedAt:
              workout.completedAt,

            status:
              workout.status,

            sets:
              Array.isArray(
                workout.sets
              )
                ? workout.sets.map(
                    (
                      set: any
                    ) => ({
                      id:
                        set.id,

                      exerciseId:
                        set.exerciseId,

                      exerciseName:
                        set.exerciseName,

                      setNumber:
                        set.setNumber,

                      repetitions:
                        set.repetitions,

                      weight:
                        set.weight,

                      duration:
                        set.duration,

                      completed:
                        set.completed,
                    })
                  )
                : [],
          })
        )
      : [];

  return {
    id:
      user.id,

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

    name:
      user.firstName,

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

    history:
      history,

    createdAt:
      user.createdAt,

    updatedAt:
      user.updatedAt,
  };
}

/* =========================================================
   CREATE / UPDATE CURRENT USER
   POST /api/users
========================================================= */

router.post(
  "/",
  requireTelegramAuth,
  async (
    req,
    res
  ) => {
    try {
      const telegramUser =
        getAuthenticatedTelegramUser(
          req
        );

      const {
        age,
        gender,
        weight,
        height,
        goal,
        onboardingCompleted,
      } = req.body ?? {};

      const updateData: any =
        {};

      /*
       * Telegram identity ALWAYS
       * comes from authenticated
       * Telegram data.
       */

      updateData.username =
        telegramUser.username ??
        null;

      updateData.firstName =
        telegramUser.first_name;

      updateData.lastName =
        telegramUser.last_name ??
        null;

      updateData.languageCode =
        telegramUser.language_code ??
        null;

      if (
        age !== undefined
      ) {
        updateData.age =
          parseOptionalNumber(
            age
          );
      }

      if (
        gender !== undefined
      ) {
        updateData.gender =
          gender ||
          null;
      }

      if (
        weight !== undefined
      ) {
        updateData.weight =
          parseOptionalNumber(
            weight
          );
      }

      if (
        height !== undefined
      ) {
        updateData.height =
          parseOptionalNumber(
            height
          );
      }

      if (
        goal !== undefined
      ) {
        updateData.goal =
          goal ||
          null;
      }

      if (
        onboardingCompleted !==
        undefined
      ) {
        updateData.onboardingCompleted =
          Boolean(
            onboardingCompleted
          );
      }

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

            age:
              updateData.age ??
              null,

            gender:
              updateData.gender ??
              null,

            weight:
              updateData.weight ??
              null,

            height:
              updateData.height ??
              null,

            goal:
              updateData.goal ??
              null,

            onboardingCompleted:
              updateData.onboardingCompleted ??
              false,
          },

          update:
            updateData,
        });

      return res.json({
        success: true,

        user:
          serializeUser(
            user
          ),
      });
    } catch (error) {
      console.error(
        "IRONAGE USER UPSERT ERROR:",
        error
      );

      return res.status(400).json({
        success: false,

        message:
          "Failed to create or update user",

        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

/* =========================================================
   GET CURRENT USER
   GET /api/users/me
========================================================= */

router.get(
  "/me",
  requireAppAuth,
  async (
    req,
    res
  ) => {
    try {
      const authenticatedRequest =
        req as AppAuthenticatedRequest;

      const user =
        await prisma.user.findUnique({
          where: {
            id:
              authenticatedRequest.appUserId,
          },

          /*
           * LOAD WORKOUT HISTORY
           */
          include: {
            workoutSessions: {
              include: {
                sets: {
                  orderBy: {
                    id: "asc",
                  },
                },
              },

              orderBy: {
                createdAt:
                  "desc",
              },
            },
          },
        });

      if (!user) {
        return res.status(404).json({
          success: false,

          message:
            "User not found",
        });
      }

      return res.json({
        success: true,

        user:
          serializeUser(
            user
          ),
      });
    } catch (error) {
      console.error(
        "IRONAGE GET CURRENT USER ERROR:",
        error
      );

      return res.status(400).json({
        success: false,

        message:
          "Failed to load user",

        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

/* =========================================================
   GET USER BY TELEGRAM ID
   GET /api/users/telegram/:telegramId
========================================================= */

router.get(
  "/telegram/:telegramId",
  requireTelegramAuth,
  async (
    req,
    res
  ) => {
    try {
      const telegramUser =
        getAuthenticatedTelegramUser(
          req
        );

      const requestedId =
        String(
          req.params.telegramId
        );

      /*
       * SECURITY:
       *
       * Client cannot request
       * another Telegram user's
       * profile.
       */

      if (
        requestedId !==
        String(
          telegramUser.id
        )
      ) {
        return res.status(403).json({
          success: false,

          message:
            "Access denied",
        });
      }

      const user =
        await prisma.user.findUnique({
          where: {
            telegramId:
              BigInt(
                telegramUser.id
              ),
          },

          /*
           * LOAD WORKOUT HISTORY
           */
          include: {
            workoutSessions: {
              include: {
                sets: {
                  orderBy: {
                    id: "asc",
                  },
                },
              },

              orderBy: {
                createdAt:
                  "desc",
              },
            },
          },
        });

      if (!user) {
        return res.status(404).json({
          success: false,

          message:
            "User not found",
        });
      }

      return res.json({
        success: true,

        user:
          serializeUser(
            user
          ),
      });
    } catch (error) {
      console.error(
        "IRONAGE GET USER ERROR:",
        error
      );

      return res.status(400).json({
        success: false,

        message:
          "Failed to load user",

        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

/* =========================================================
   UPDATE CURRENT USER
   PATCH /api/users/me
========================================================= */

router.patch(
  "/me",
  requireAppAuth,
  async (
    req,
    res
  ) => {
    try {
      const authenticatedRequest =
        req as AppAuthenticatedRequest;

      const {
        username,
        firstName,
        lastName,
        languageCode,
        age,
        gender,
        weight,
        height,
        goal,
        onboardingCompleted,
      } = req.body ?? {};

      const updateData: any = {};

      if (username !== undefined) {
        updateData.username =
          username || null;
      }

      if (firstName !== undefined) {
        const normalizedFirstName =
          typeof firstName === "string"
            ? firstName.trim()
            : "";

        if (!normalizedFirstName) {
          return res.status(400).json({
            success: false,
            message:
              "First name cannot be empty",
          });
        }

        updateData.firstName =
          normalizedFirstName;
      }

      if (lastName !== undefined) {
        updateData.lastName =
          typeof lastName === "string"
            ? lastName.trim() || null
            : null;
      }

      if (languageCode !== undefined) {
        updateData.languageCode =
          typeof languageCode === "string"
            ? languageCode.trim() || null
            : null;
      }

      if (age !== undefined) {
        updateData.age =
          parseOptionalNumber(age);
      }

      if (gender !== undefined) {
        updateData.gender =
          parseGender(gender);
      }

      if (weight !== undefined) {
        updateData.weight =
          parseOptionalNumber(weight);
      }

      if (height !== undefined) {
        updateData.height =
          parseOptionalNumber(height);
      }

      if (goal !== undefined) {
        updateData.goal =
          parseGoal(goal);
      }

      if (onboardingCompleted !== undefined) {
        updateData.onboardingCompleted =
          Boolean(onboardingCompleted);
      }

      const user =
        await prisma.user.update({
          where: {
            id:
              authenticatedRequest.appUserId,
          },

          data:
            updateData,
        });

      return res.status(200).json({
        success: true,
        user:
          serializeUser(user),
      });
    } catch (error) {
      console.error(
        "IRONAGE UPDATE CURRENT USER ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update current user",
      });
    }
  }
);

/* =========================================================
   DELETE CURRENT USER
   DELETE /api/users/me
========================================================= */

router.delete(
  "/me",
  requireTelegramAuth,
  async (
    req,
    res
  ) => {
    try {
      const telegramUser =
        getAuthenticatedTelegramUser(
          req
        );

      const telegramId =
        BigInt(
          telegramUser.id
        );

      const user =
        await prisma.user.findUnique({
          where: {
            telegramId,
          },
        });

      if (!user) {
        return res.status(404).json({
          success: false,

          message:
            "User not found",
        });
      }

      await prisma.user.delete({
        where: {
          telegramId,
        },
      });

      return res.json({
        success: true,

        message:
          "User deleted",
      });
    } catch (error) {
      console.error(
        "IRONAGE DELETE USER ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to delete user",
      });
    }
  }
);

/* =========================================================
   DELETE BY DATABASE ID
   DELETE /api/users/:id
========================================================= */

router.delete(
  "/:id",
  requireTelegramAuth,
  async (
    req,
    res
  ) => {
    try {
      const telegramUser =
        getAuthenticatedTelegramUser(
          req
        );

      const id =
        Number(
          req.params.id
        );

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid user id",
        });
      }

      const user =
        await prisma.user.findUnique({
          where: {
            id,
          },
        });

      if (!user) {
        return res.status(404).json({
          success: false,

          message:
            "User not found",
        });
      }

      /*
       * CRITICAL OWNERSHIP CHECK
       */

      if (
        user.telegramId ===
          null ||
        user.telegramId.toString() !==
          String(
            telegramUser.id
          )
      ) {
        return res.status(403).json({
          success: false,

          message:
            "Access denied",
        });
      }

      await prisma.user.delete({
        where: {
          id,
        },
      });

      return res.json({
        success: true,

        message:
          "User deleted",
      });
    } catch (error) {
      console.error(
        "IRONAGE DELETE USER ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to delete user",
      });
    }
  }
);

export default router;
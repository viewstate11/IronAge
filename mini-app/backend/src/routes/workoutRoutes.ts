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

function parsePositiveInt(
  value: unknown,
  fieldName: string
): number {
  const parsed = Number(value);

  if (
    !Number.isInteger(parsed) ||
    parsed <= 0
  ) {
    throw new Error(
      `${fieldName} must be a positive integer`
    );
  }

  return parsed;
}

function parseNonNegativeNumber(
  value: unknown,
  fieldName: string
): number {
  const parsed = Number(value ?? 0);

  if (
    !Number.isFinite(parsed) ||
    parsed < 0
  ) {
    throw new Error(
      `${fieldName} must be a non-negative number`
    );
  }

  return parsed;
}

function parseDate(
  value: unknown
): Date | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const date =
    new Date(String(value));

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    throw new Error(
      "Invalid date"
    );
  }

  return date;
}

function startOfDay(
  date: Date
): Date {
  const result =
    new Date(date);

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
}

function differenceInDays(
  a: Date,
  b: Date
): number {
  const dayA =
    startOfDay(a).getTime();

  const dayB =
    startOfDay(b).getTime();

  return Math.round(
    Math.abs(
      dayA - dayB
    ) /
      (
        1000 *
        60 *
        60 *
        24
      )
  );
}

/* =========================================================
   GET AUTHENTICATED USER
========================================================= */

function getCurrentUserId(
  req: Parameters<typeof requireAppAuth>[0]
): number {
  const authenticatedRequest =
    req as AppAuthenticatedRequest;

  const userId =
    authenticatedRequest.appUserId;

  if (
    !userId ||
    !Number.isInteger(userId) ||
    userId <= 0
  ) {
    throw new Error(
      "Authenticated app user ID is missing"
    );
  }

  return userId;
}

/* =========================================================
   CREATE WORKOUT
   POST /api/workouts
========================================================= */

router.post(
  "/",
  requireAppAuth,
  async (req, res) => {
    try {
      const userId =
        getCurrentUserId(
          req
        );

      /*
       * SECURITY:
       *
       * Never trust req.body.userId.
       *
       * User identity comes ONLY
       * from authenticated app identity.
       */

      const {
        workoutId,
        workoutName,
        duration,
        xp,
        status,
        startedAt,
        completedAt,
        sets,
      } = req.body;

      /* ===================================================
         VALIDATION
      =================================================== */

      if (
        !workoutId ||
        typeof workoutId !==
          "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "workoutId is required",
        });
      }

      if (
        !workoutName ||
        typeof workoutName !==
          "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "workoutName is required",
        });
      }

      /* ===================================================
         NORMALIZE
      =================================================== */

      const normalizedDuration =
        Math.round(
          parseNonNegativeNumber(
            duration,
            "duration"
          )
        );

      const normalizedXp =
        Math.round(
          parseNonNegativeNumber(
            xp,
            "xp"
          )
        );

      const normalizedStatus =
        status ===
        "CANCELED"
          ? "CANCELED"
          : "COMPLETED";

      const normalizedSets =
        Array.isArray(sets)
          ? sets
          : [];

      /* ===================================================
         CLEAN SETS
      =================================================== */

      const cleanSets =
        normalizedSets.map(
          (
            set: any,
            index: number
          ) => {
            const repetitions =
              set.repetitions !==
                undefined &&
              set.repetitions !==
                null &&
              set.repetitions !==
                ""
                ? Number(
                    set.repetitions
                  )
                : null;

            const weight =
              set.weight !==
                undefined &&
              set.weight !==
                null &&
              set.weight !==
                ""
                ? Number(
                    set.weight
                  )
                : null;

            const setDuration =
              set.duration !==
                undefined &&
              set.duration !==
                null &&
              set.duration !==
                ""
                ? Number(
                    set.duration
                  )
                : null;

            const setNumber =
              Number(
                set.setNumber ??
                  index + 1
              );

            return {
              exerciseId:
                String(
                  set.exerciseId ??
                    `exercise-${index + 1}`
                ),

              exerciseName:
                String(
                  set.exerciseName ??
                    "Exercise"
                ),

              setNumber:
                Number.isFinite(
                  setNumber
                )
                  ? Math.max(
                      1,
                      Math.round(
                        setNumber
                      )
                    )
                  : index + 1,

              repetitions:
                repetitions !==
                  null &&
                Number.isFinite(
                  repetitions
                )
                  ? Math.max(
                      0,
                      Math.round(
                        repetitions
                      )
                    )
                  : null,

              weight:
                weight !==
                  null &&
                Number.isFinite(
                  weight
                )
                  ? Math.max(
                      0,
                      weight
                    )
                  : null,

              duration:
                setDuration !==
                  null &&
                Number.isFinite(
                  setDuration
                )
                  ? Math.max(
                      0,
                      Math.round(
                        setDuration
                      )
                    )
                  : null,

              completed:
                Boolean(
                  set.completed
                ),
            };
          }
        );

      /* ===================================================
         DATES
      =================================================== */

      const startedAtDate =
        parseDate(
          startedAt
        );

      const completedAtDate =
        parseDate(
          completedAt
        ) ??
        (
          normalizedStatus ===
          "COMPLETED"
            ? new Date()
            : null
        );

      /* ===================================================
         TRANSACTION
      =================================================== */

      const result =
        await prisma.$transaction(
          async (tx) => {
            /* =============================================
               CREATE WORKOUT
            ============================================= */

            const workout =
              await tx.workoutSession.create({
                data: {
                  userId:
                    userId,

                  workoutId:
                    workoutId.trim(),

                  workoutName:
                    workoutName.trim(),

                  duration:
                    normalizedDuration,

                  xp:
                    normalizedXp,

                  status:
                    normalizedStatus,

                  startedAt:
                    startedAtDate,

                  completedAt:
                    completedAtDate,

                  sets:
                    cleanSets.length >
                    0
                      ? {
                          create:
                            cleanSets,
                        }
                      : undefined,
                },

                include: {
                  sets: {
                    orderBy: {
                      id: "asc",
                    },
                  },
                },
              });

            /* =============================================
               UPDATE USER
            ============================================= */

            let updatedUser =
              await tx.user.findUniqueOrThrow({
                where: {
                  id: userId,
                },
              });

            if (
              normalizedStatus ===
              "COMPLETED"
            ) {
              const workoutDate =
                completedAtDate ??
                new Date();

              const previousWorkout =
                await tx.workoutSession.findFirst({
                  where: {
                    userId:
                      userId,

                    status:
                      "COMPLETED",

                    id: {
                      not:
                        workout.id,
                    },

                    completedAt: {
                      not:
                        null,
                    },
                  },

                  orderBy: {
                    completedAt:
                      "desc",
                  },
                });

              let nextStreak =
                updatedUser.streak;

              if (
                !previousWorkout ||
                !previousWorkout.completedAt
              ) {
                nextStreak =
                  1;
              } else {
                const days =
                  differenceInDays(
                    workoutDate,
                    previousWorkout.completedAt
                  );

                if (
                  days === 0
                ) {
                  nextStreak =
                    Math.max(
                      1,
                      updatedUser.streak
                    );
                } else if (
                  days === 1
                ) {
                  nextStreak =
                    updatedUser.streak +
                    1;
                } else {
                  nextStreak =
                    1;
                }
              }

              const nextXp =
                updatedUser.xp +
                normalizedXp;

              const nextLevel =
                Math.floor(
                  nextXp / 1000
                ) + 1;

              updatedUser =
                await tx.user.update({
                  where: {
                    id:
                      userId,
                  },

                  data: {
                    xp: {
                      increment:
                        normalizedXp,
                    },

                    workouts: {
                      increment: 1,
                    },

                    streak:
                      nextStreak,

                    level:
                      nextLevel,
                  },
                });
            }

            return {
              workout,
              user:
                updatedUser,
            };
          }
        );

      /* ===================================================
         RESPONSE
      =================================================== */

      return res.status(201).json({
        success: true,

        workout:
          result.workout,

        user: {
          id:
            result.user.id,

          xp:
            result.user.xp,

          level:
            result.user.level,

          streak:
            result.user.streak,

          workouts:
            result.user.workouts,
        },
      });
    } catch (error) {
      console.error(
        "IRONAGE WORKOUT CREATE ERROR:",
        error
      );

      return res.status(400).json({
        success: false,

        message:
          "Workout create error",

        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

/* =========================================================
   GET CURRENT USER WORKOUTS
   GET /api/workouts
========================================================= */

router.get(
  "/",
  requireAppAuth,
  async (req, res) => {
    try {
      const userId =
        getCurrentUserId(
          req
        );

      const workouts =
        await prisma.workoutSession.findMany({
          where: {
            userId:
              userId,
          },

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
        });

      return res.json({
        success: true,
        workouts,
      });
    } catch (error) {
      console.error(
        "IRONAGE WORKOUT LOAD ERROR:",
        error
      );

      return res.status(400).json({
        success: false,

        message:
          "Workout load error",

        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

/* =========================================================
   GET WORKOUTS BY USER ID
   GET /api/workouts/user/:userId
========================================================= */

router.get(
  "/user/:userId",
  requireAppAuth,
  async (req, res) => {
    try {
      const authenticatedRequest =
        req as AppAuthenticatedRequest;

      const currentUser =
        await prisma.user.findUnique({
          where: {
            id:
              authenticatedRequest.appUserId,
          },
        });

      if (!currentUser) {
        return res.status(401).json({
          success: false,
          message:
            "Authenticated user not found",
        });
      }

      const requestedUserId =
        parsePositiveInt(
          req.params.userId,
          "userId"
        );

      /*
       * SECURITY:
       *
       * User can only access
       * their own workouts.
       */

      if (
        requestedUserId !==
        currentUser.id
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Access denied",
        });
      }

      const workouts =
        await prisma.workoutSession.findMany({
          where: {
            userId:
              currentUser.id,
          },

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
        });

      return res.json({
        success: true,
        workouts,
      });
    } catch (error) {
      console.error(
        "IRONAGE WORKOUT LOAD ERROR:",
        error
      );

      return res.status(400).json({
        success: false,

        message:
          "Workout load error",

        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

/* =========================================================
   GET SINGLE WORKOUT
   GET /api/workouts/session/:id
========================================================= */

router.get(
  "/session/:id",
  requireAppAuth,
  async (req, res) => {
    try {
      const userId =
        getCurrentUserId(
          req
        );

      const id =
        parsePositiveInt(
          req.params.id,
          "workout id"
        );

      const workout =
        await prisma.workoutSession.findUnique({
          where: {
            id,
          },

          include: {
            sets: {
              orderBy: {
                id: "asc",
              },
            },
          },
        });

      if (!workout) {
        return res.status(404).json({
          success: false,
          message:
            "Workout not found",
        });
      }

      /*
       * CRITICAL OWNERSHIP CHECK
       */

      if (
        workout.userId !==
        userId
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Access denied",
        });
      }

      return res.json({
        success: true,
        workout,
      });
    } catch (error) {
      console.error(
        "IRONAGE WORKOUT LOAD ERROR:",
        error
      );

      return res.status(400).json({
        success: false,

        message:
          "Workout load error",

        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

export default router;
import { Router } from "express";

import { prisma } from "../prisma.js";

import {
  requireAppAuth,
  type AppAuthenticatedRequest,
} from "../middleware/appAuthMiddleware.js";

const router = Router();

type ParsedWorkoutExercise = {
  exerciseId: number;
  position: number;
  sets: number | null;
  repetitions: number | null;
  minRepetitions: number | null;
  maxRepetitions: number | null;
  duration: number | null;
  restSeconds: number | null;
  targetWeight: number | null;
  tempo: string | null;
  coachNotes: string | null;
  coachVideoUrl: string | null;
};

function getCurrentUserId(
  req: AppAuthenticatedRequest
): number {
  const userId = req.appUserId;

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

function parseOptionalPositiveInt(
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

  if (
    !Number.isFinite(parsed) ||
    parsed < 0
  ) {
    throw new Error(
      `${fieldName} must be a valid number`
    );
  }

  return parsed;
}

function optionalString(
  value: unknown
): string | null {
  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  const normalized =
    String(value).trim();

  return normalized || null;
}

async function requireCoachProfile(
  coachId: number
) {
  const profile =
    await prisma.coachProfile.findUnique({
      where: {
        userId: coachId,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

  if (
    !profile ||
    !profile.isActive
  ) {
    return null;
  }

  return profile;
}

router.post(
  "/",
  requireAppAuth,
  async (req, res) => {
    try {
      const coachId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const coachProfile =
        await requireCoachProfile(
          coachId
        );

      if (!coachProfile) {
        return res.status(403).json({
          success: false,
          message:
            "Active coach profile required",
        });
      }

      const name =
        String(
          req.body?.name ?? ""
        ).trim();

      if (!name) {
        return res.status(400).json({
          success: false,
          message:
            "Workout name is required",
        });
      }

      const rawExercises =
        Array.isArray(
          req.body?.exercises
        )
          ? req.body.exercises
          : [];

      if (
        rawExercises.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Workout must contain at least one exercise",
        });
      }

      const exercises: ParsedWorkoutExercise[] =
        rawExercises.map(
          (
            item: Record<string, unknown>,
            index: number
          ) => {
            const exerciseId =
              Number(
                item.exerciseId
              );

            if (
              !Number.isInteger(
                exerciseId
              ) ||
              exerciseId <= 0
            ) {
              throw new Error(
                `exercises[${index}].exerciseId is invalid`
              );
            }

            const position =
              item.position ===
                undefined
                ? index + 1
                : Number(
                    item.position
                  );

            if (
              !Number.isInteger(
                position
              ) ||
              position <= 0
            ) {
              throw new Error(
                `exercises[${index}].position is invalid`
              );
            }

            return {
              exerciseId,
              position,

              sets:
                parseOptionalPositiveInt(
                  item.sets,
                  `exercises[${index}].sets`
                ),

              repetitions:
                parseOptionalPositiveInt(
                  item.repetitions,
                  `exercises[${index}].repetitions`
                ),

              minRepetitions:
                parseOptionalPositiveInt(
                  item.minRepetitions,
                  `exercises[${index}].minRepetitions`
                ),

              maxRepetitions:
                parseOptionalPositiveInt(
                  item.maxRepetitions,
                  `exercises[${index}].maxRepetitions`
                ),

              duration:
                parseOptionalPositiveInt(
                  item.duration,
                  `exercises[${index}].duration`
                ),

              restSeconds:
                parseOptionalPositiveInt(
                  item.restSeconds,
                  `exercises[${index}].restSeconds`
                ),

              targetWeight:
                parseOptionalNumber(
                  item.targetWeight,
                  `exercises[${index}].targetWeight`
                ),

              tempo:
                optionalString(
                  item.tempo
                ),

              coachNotes:
                optionalString(
                  item.coachNotes
                ),

              coachVideoUrl:
                optionalString(
                  item.coachVideoUrl
                ),
            };
          }
        );

      const uniquePositions =
        new Set(
          exercises.map(
            (item) =>
              item.position
          )
        );

      if (
        uniquePositions.size !==
        exercises.length
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Exercise positions must be unique",
        });
      }

      const exerciseIds: number[] =
        Array.from(
          new Set<number>(
            exercises.map(
              (item: ParsedWorkoutExercise) =>
                item.exerciseId
            )
          )
        );

      const availableExercises =
        await prisma.exercise.findMany({
          where: {
            id: {
              in: exerciseIds,
            },
            isActive: true,
          },
          select: {
            id: true,
          },
        });

      if (
        availableExercises.length !==
        exerciseIds.length
      ) {
        return res.status(400).json({
          success: false,
          message:
            "One or more exercises do not exist or are inactive",
        });
      }

      const workout =
        await prisma.$transaction(
          async (tx) => {
            const created =
              await tx.trainingWorkout.create({
                data: {
                  coachId,

                  name,

                  description:
                    optionalString(
                      req.body?.description
                    ),

                  duration:
                    parseOptionalPositiveInt(
                      req.body?.duration,
                      "duration"
                    ),

                  difficulty:
                    optionalString(
                      req.body?.difficulty
                    ),
                },
              });

            await tx.workoutExercise.createMany({
              data:
                exercises.map(
                  (item) => ({
                    workoutId:
                      created.id,

                    ...item,
                  })
                ),
            });

            return tx.trainingWorkout.findUnique({
              where: {
                id: created.id,
              },

              include: {
                exercises: {
                  include: {
                    exercise:
                      true,
                  },

                  orderBy: {
                    position:
                      "asc",
                  },
                },
              },
            });
          }
        );

      return res.status(201).json({
        success: true,
        workout,
      });
    } catch (error) {
      console.error(
        "IRONAGE COACH WORKOUT CREATE ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Coach workout create error",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

router.get(
  "/",
  requireAppAuth,
  async (req, res) => {
    try {
      const coachId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const coachProfile =
        await requireCoachProfile(
          coachId
        );

      if (!coachProfile) {
        return res.status(403).json({
          success: false,
          message:
            "Active coach profile required",
        });
      }

      const workouts =
        await prisma.trainingWorkout.findMany({
          where: {
            coachId,
            isActive: true,
          },

          include: {
            exercises: {
              include: {
                exercise: true,
              },

              orderBy: {
                position:
                  "asc",
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
        "IRONAGE COACH WORKOUTS LOAD ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load coach workouts",
      });
    }
  }
);

router.get(
  "/:id",
  requireAppAuth,
  async (req, res) => {
    try {
      const coachId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const workoutId =
        Number(
          req.params.id
        );

      if (
        !Number.isInteger(
          workoutId
        ) ||
        workoutId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid workout ID",
        });
      }

      const workout =
        await prisma.trainingWorkout.findFirst({
          where: {
            id: workoutId,
            coachId,
            isActive: true,
          },

          include: {
            exercises: {
              include: {
                exercise: true,
              },

              orderBy: {
                position:
                  "asc",
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

      return res.json({
        success: true,
        workout,
      });
    } catch (error) {
      console.error(
        "IRONAGE COACH WORKOUT LOAD ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load coach workout",
      });
    }
  }
);

export default router;

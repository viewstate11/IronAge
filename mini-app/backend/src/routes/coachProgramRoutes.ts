import { Router } from "express";

import { prisma } from "../prisma.js";

import {
  requireAppAuth,
  type AppAuthenticatedRequest,
} from "../middleware/appAuthMiddleware.js";

const router = Router();

type ParsedProgramWorkout = {
  workoutId: number;
  position: number;
  week: number | null;
  day: number | null;
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

  return parsePositiveInt(
    value,
    fieldName
  );
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

async function hasActiveCoachProfile(
  coachId: number
): Promise<boolean> {
  const profile =
    await prisma.coachProfile.findUnique({
      where: {
        userId: coachId,
      },
      select: {
        isActive: true,
      },
    });

  return Boolean(
    profile?.isActive
  );
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

      if (
        !await hasActiveCoachProfile(
          coachId
        )
      ) {
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
            "Program name is required",
        });
      }

      const rawWorkouts =
        Array.isArray(
          req.body?.workouts
        )
          ? req.body.workouts
          : [];

      if (
        rawWorkouts.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Program must contain at least one workout",
        });
      }

      const workouts: ParsedProgramWorkout[] = rawWorkouts.map(
        (
          item: Record<string, unknown>,
          index: number
        ) => {
          const workoutId =
            parsePositiveInt(
              item.workoutId,
              `workouts[${index}].workoutId`
            );

          const position =
            item.position === undefined
              ? index + 1
              : parsePositiveInt(
                  item.position,
                  `workouts[${index}].position`
                );

          return {
            workoutId,
            position,
            week:
              parseOptionalPositiveInt(
                item.week,
                `workouts[${index}].week`
              ),
            day:
              parseOptionalPositiveInt(
                item.day,
                `workouts[${index}].day`
              ),
          };
        }
      );

      const positions =
        workouts.map(
          (item) =>
            item.position
        );

      if (
        new Set(
          positions
        ).size !==
        positions.length
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Workout positions must be unique",
        });
      }

      const workoutIds: number[] =
        Array.from(
          new Set<number>(
            workouts.map(
              (item: ParsedProgramWorkout) =>
                item.workoutId
            )
          )
        );

      const ownedWorkouts =
        await prisma.trainingWorkout.findMany({
          where: {
            id: {
              in: workoutIds,
            },
            coachId,
            isActive: true,
          },
          select: {
            id: true,
          },
        });

      if (
        ownedWorkouts.length !==
        workoutIds.length
      ) {
        return res.status(400).json({
          success: false,
          message:
            "One or more workouts do not exist or do not belong to this coach",
        });
      }

      const program =
        await prisma.$transaction(
          async (tx) => {
            const created =
              await tx.trainingProgram.create({
                data: {
                  coachId,
                  name,
                  description:
                    optionalString(
                      req.body?.description
                    ),
                  durationWeeks:
                    parseOptionalPositiveInt(
                      req.body?.durationWeeks,
                      "durationWeeks"
                    ),
                },
              });

            await tx.programWorkout.createMany({
              data:
                workouts.map(
                  (item) => ({
                    programId:
                      created.id,
                    ...item,
                  })
                ),
            });

            return tx.trainingProgram.findUnique({
              where: {
                id: created.id,
              },
              include: {
                workouts: {
                  include: {
                    workout: {
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
                    },
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
        program,
      });
    } catch (error) {
      console.error(
        "IRONAGE COACH PROGRAM CREATE ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Coach program create error",
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

      if (
        !await hasActiveCoachProfile(
          coachId
        )
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Active coach profile required",
        });
      }

      const programs =
        await prisma.trainingProgram.findMany({
          where: {
            coachId,
            isActive: true,
          },
          include: {
            workouts: {
              include: {
                workout: true,
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
        programs,
      });
    } catch (error) {
      console.error(
        "IRONAGE COACH PROGRAMS LOAD ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load coach programs",
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

      const programId =
        parsePositiveInt(
          req.params.id,
          "programId"
        );

      const program =
        await prisma.trainingProgram.findFirst({
          where: {
            id: programId,
            coachId,
            isActive: true,
          },
          include: {
            workouts: {
              include: {
                workout: {
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
                },
              },
              orderBy: {
                position:
                  "asc",
              },
            },
          },
        });

      if (!program) {
        return res.status(404).json({
          success: false,
          message:
            "Program not found",
        });
      }

      return res.json({
        success: true,
        program,
      });
    } catch (error) {
      console.error(
        "IRONAGE COACH PROGRAM LOAD ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Failed to load coach program",
      });
    }
  }
);

router.post(
  "/:id/assign",
  requireAppAuth,
  async (req, res) => {
    try {
      const coachId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      if (
        !await hasActiveCoachProfile(
          coachId
        )
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Active coach profile required",
        });
      }

      const programId =
        parsePositiveInt(
          req.params.id,
          "programId"
        );

      const clientId =
        parsePositiveInt(
          req.body?.clientId,
          "clientId"
        );

      const program =
        await prisma.trainingProgram.findFirst({
          where: {
            id: programId,
            coachId,
            isActive: true,
          },
          select: {
            id: true,
          },
        });

      if (!program) {
        return res.status(404).json({
          success: false,
          message:
            "Program not found",
        });
      }

      const relationship =
        await prisma.coachClient.findUnique({
          where: {
            clientId,
          },
        });

      if (
        !relationship ||
        relationship.coachId !==
          coachId
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Client is not assigned to this coach",
        });
      }

      await prisma.programAssignment.updateMany({
        where: {
          clientId,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });

      const assignment =
        await prisma.programAssignment.create({
          data: {
            programId,
            clientId,
            assignedBy:
              coachId,
            startDate:
              new Date(),
            isActive:
              true,
          },
          include: {
            program:
              true,
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        });

      return res.status(201).json({
        success: true,
        assignment,
      });
    } catch (error) {
      console.error(
        "IRONAGE PROGRAM ASSIGN ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Program assign error",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

export default router;

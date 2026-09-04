import { Router } from "express";

import { prisma } from "../prisma.js";

import {
  requireAppAuth,
  type AppAuthenticatedRequest,
} from "../middleware/appAuthMiddleware.js";

const router = Router();

function getCurrentUserId(req: AppAuthenticatedRequest): number {
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

function normalizeOptionalString(
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

router.post(
  "/profile",
  requireAppAuth,
  async (req, res) => {
    try {
      const userId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const {
        displayName,
        bio,
        specialization,
        photoUrl,
        resubmit,
      } = req.body ?? {};

      const normalizedDisplayName =
        String(
          displayName ?? ""
        ).trim();

      if (!normalizedDisplayName) {
        return res.status(400).json({
          success: false,
          message:
            "displayName is required",
        });
      }

      const coach =
        await prisma.coachProfile.upsert({
          where: {
            userId,
          },

          create: {
            userId,
            displayName:
              normalizedDisplayName,
            bio:
              normalizeOptionalString(
                bio
              ),
            specialization:
              normalizeOptionalString(
                specialization
              ),
            photoUrl:
              normalizeOptionalString(
                photoUrl
              ),
          },

          update: {
            displayName:
              normalizedDisplayName,
            bio:
              normalizeOptionalString(
                bio
              ),
            specialization:
              normalizeOptionalString(
                specialization
              ),
            photoUrl:
              normalizeOptionalString(
                photoUrl
              ),

            ...(resubmit === true
              ? {
                  isActive: true,
                  isVerified: false,
                }
              : {}),
          },

          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
              },
            },
          },
        });

      return res.json({
        success: true,
        coach,
      });
    } catch (error) {
      console.error(
        "IRONAGE COACH PROFILE SAVE ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Coach profile save error",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

router.get(
  "/me",
  requireAppAuth,
  async (req, res) => {
    try {
      const userId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const coach =
        await prisma.coachProfile.findUnique({
          where: {
            userId,
          },

          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
              },
            },
          },
        });

      return res.json({
        success: true,
        coach,
      });
    } catch (error) {
      console.error(
        "IRONAGE COACH PROFILE LOAD ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Coach profile load error",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

router.get(
  "/clients",
  requireAppAuth,
  async (req, res) => {
    try {
      const coachId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const coachProfile =
        await prisma.coachProfile.findUnique({
          where: {
            userId:
              coachId,
          },
        });

      if (!coachProfile) {
        return res.status(403).json({
          success: false,
          message:
            "Coach profile required",
        });
      }

      const relationships =
        await prisma.coachClient.findMany({
          where: {
            coachId,
          },

          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                age: true,
                gender: true,
                weight: true,
                height: true,
                goal: true,
                level: true,
                xp: true,
                workouts: true,
                streak: true,
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
        clients:
          relationships.map(
            (relationship) => ({
              relationshipId:
                relationship.id,
              assignedAt:
                relationship.createdAt,
              client:
                relationship.client,
            })
          ),
      });
    } catch (error) {
      console.error(
        "IRONAGE COACH CLIENTS LOAD ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Coach clients load error",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

router.get(
  "/clients/:clientId/results",
  requireAppAuth,
  async (req, res) => {
    try {
      const coachId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const clientId =
        parsePositiveInt(
          req.params.clientId,
          "clientId"
        );

      const coachProfile =
        await prisma.coachProfile.findUnique({
          where: {
            userId: coachId,
          },
        });

      if (
        !coachProfile ||
        !coachProfile.isActive
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Active coach profile required",
        });
      }

      const relationship =
        await prisma.coachClient.findUnique({
          where: {
            clientId,
          },
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                age: true,
                gender: true,
                weight: true,
                height: true,
                goal: true,
                level: true,
                xp: true,
                workouts: true,
                streak: true,
              },
            },
          },
        });

      if (!relationship) {
        return res.status(404).json({
          success: false,
          message:
            "Coach-client relationship not found",
        });
      }

      if (
        relationship.coachId !==
        coachId
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      const [
        workouts,
        progress,
        activeAssignment,
      ] =
        await Promise.all([
          prisma.workoutSession.findMany({
            where: {
              userId: clientId,
            },

            include: {
              sets: {
                orderBy: [
                  {
                    exerciseName: "asc",
                  },
                  {
                    setNumber: "asc",
                  },
                ],
              },
            },

            orderBy: {
              createdAt: "desc",
            },
          }),

          prisma.progress.findMany({
            where: {
              userId: clientId,
            },

            orderBy: {
              createdAt: "desc",
            },
          }),

          prisma.programAssignment.findFirst({
            where: {
              clientId,
              assignedBy: coachId,
              isActive: true,
            },

            include: {
              program: {
                include: {
                  workouts: {
                    include: {
                      workout: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                    },

                    orderBy: {
                      position: "asc",
                    },
                  },
                },
              },

              completions: {
                select: {
                  programWorkoutId: true,
                  workoutSessionId: true,
                  completedAt: true,
                },

                orderBy: {
                  completedAt: "desc",
                },
              },
            },

            orderBy: {
              createdAt: "desc",
            },
          }),
        ]);

      /*
       * Program adherence is calculated only from the
       * authenticated coach's active assignment.
       *
       * ProgramWorkoutCompletion is the source of truth.
       */

      const adherence =
        activeAssignment
          ? (() => {
              const scheduledWorkouts =
                activeAssignment.program.workouts;

              const completionByProgramWorkoutId =
                new Map(
                  activeAssignment.completions.map(
                    (completion) => [
                      completion.programWorkoutId,
                      completion,
                    ]
                  )
                );

              const completedWorkouts =
                scheduledWorkouts.filter(
                  (programWorkout) =>
                    completionByProgramWorkoutId.has(
                      programWorkout.id
                    )
                ).length;

              const totalWorkouts =
                scheduledWorkouts.length;

              const percentage =
                totalWorkouts > 0
                  ? Math.round(
                      (completedWorkouts /
                        totalWorkouts) *
                        100
                    )
                  : 0;

              const latestCompletion =
                activeAssignment.completions[0] ??
                null;

              return {
                assignmentId:
                  activeAssignment.id,

                programId:
                  activeAssignment.program.id,

                programName:
                  activeAssignment.program.name,

                startDate:
                  activeAssignment.startDate,

                endDate:
                  activeAssignment.endDate,

                totalWorkouts,

                completedWorkouts,

                percentage,

                lastCompletedAt:
                  latestCompletion?.completedAt ??
                  null,

                workouts:
                  scheduledWorkouts.map(
                    (programWorkout) => {
                      const completion =
                        completionByProgramWorkoutId.get(
                          programWorkout.id
                        );

                      return {
                        programWorkoutId:
                          programWorkout.id,

                        workoutId:
                          programWorkout.workout.id,

                        workoutName:
                          programWorkout.workout.name,

                        week:
                          programWorkout.week,

                        day:
                          programWorkout.day,

                        position:
                          programWorkout.position,

                        status:
                          completion
                            ? "COMPLETED"
                            : "PENDING",

                        completedAt:
                          completion?.completedAt ??
                          null,

                        workoutSessionId:
                          completion?.workoutSessionId ??
                          null,
                      };
                    }
                  ),
              };
            })()
          : null;

      return res.json({
        success: true,
        client:
          relationship.client,
        workouts,
        progress,
        adherence,
      });
    } catch (error) {
      console.error(
        "IRONAGE COACH CLIENT RESULTS LOAD ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Coach client results load error",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

router.post(
  "/clients",
  requireAppAuth,
  async (req, res) => {
    try {
      const coachId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const clientId =
        parsePositiveInt(
          req.body?.clientId,
          "clientId"
        );

      if (coachId === clientId) {
        return res.status(400).json({
          success: false,
          message:
            "Coach cannot assign themselves as a client",
        });
      }

      const coachProfile =
        await prisma.coachProfile.findUnique({
          where: {
            userId:
              coachId,
          },
        });

      if (!coachProfile) {
        return res.status(403).json({
          success: false,
          message:
            "Coach profile required",
        });
      }

      const client =
        await prisma.user.findUnique({
          where: {
            id:
              clientId,
          },
        });

      if (!client) {
        return res.status(404).json({
          success: false,
          message:
            "Client not found",
        });
      }

      const existingRelationship =
        await prisma.coachClient.findUnique({
          where: {
            clientId,
          },
        });

      if (
        existingRelationship &&
        existingRelationship.coachId !==
          coachId
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Client already has a coach",
        });
      }

      const relationship =
        existingRelationship ??
        await prisma.coachClient.create({
          data: {
            coachId,
            clientId,
          },
        });

      return res.status(201).json({
        success: true,
        relationship,
      });
    } catch (error) {
      console.error(
        "IRONAGE COACH CLIENT ASSIGN ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Coach client assign error",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

router.get(
  "/my-coach",
  requireAppAuth,
  async (req, res) => {
    try {
      const clientId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const relationship =
        await prisma.coachClient.findUnique({
          where: {
            clientId,
          },

          include: {
            coach: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,

                coachProfile: {
                  select: {
                    id: true,
                    displayName: true,
                    bio: true,
                    specialization: true,
                    photoUrl: true,
                    isVerified: true,
                    isActive: true,
                  },
                },
              },
            },
          },
        });

      return res.json({
        success: true,
        coach:
          relationship?.coach ??
          null,
        assignedAt:
          relationship?.createdAt ??
          null,
      });
    } catch (error) {
      console.error(
        "IRONAGE MY COACH LOAD ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "My coach load error",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

router.delete(
  "/clients/:clientId",
  requireAppAuth,
  async (req, res) => {
    try {
      const coachId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const clientId =
        parsePositiveInt(
          req.params.clientId,
          "clientId"
        );

      const relationship =
        await prisma.coachClient.findUnique({
          where: {
            clientId,
          },
        });

      if (!relationship) {
        return res.status(404).json({
          success: false,
          message:
            "Coach-client relationship not found",
        });
      }

      if (
        relationship.coachId !==
        coachId
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Access denied",
        });
      }

      await prisma.coachClient.delete({
        where: {
          clientId,
        },
      });

      return res.json({
        success: true,
      });
    } catch (error) {
      console.error(
        "IRONAGE COACH CLIENT REMOVE ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Coach client remove error",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);


/* =========================================================
   COACH MARKETPLACE
========================================================= */

router.get(
  "/marketplace",
  requireAppAuth,
  async (req, res) => {
    try {
      const currentUserId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const pageRaw =
        Number(req.query.page ?? 1);

      const limitRaw =
        Number(req.query.limit ?? 20);

      const page =
        Number.isInteger(pageRaw) &&
        pageRaw > 0
          ? pageRaw
          : 1;

      const limit =
        Number.isInteger(limitRaw) &&
        limitRaw > 0
          ? Math.min(limitRaw, 50)
          : 20;

      const search =
        String(
          req.query.search ?? ""
        ).trim();

      const specialization =
        String(
          req.query.specialization ?? ""
        ).trim();

      const where = {
        isActive: true,
        isVerified: true,

        userId: {
          not: currentUserId,
        },

        ...(specialization
          ? {
              specialization: {
                contains:
                  specialization,
                mode:
                  "insensitive" as const,
              },
            }
          : {}),

        ...(search
          ? {
              OR: [
                {
                  displayName: {
                    contains:
                      search,
                    mode:
                      "insensitive" as const,
                  },
                },
                {
                  specialization: {
                    contains:
                      search,
                    mode:
                      "insensitive" as const,
                  },
                },
                {
                  bio: {
                    contains:
                      search,
                    mode:
                      "insensitive" as const,
                  },
                },
              ],
            }
          : {}),
      };

      const [
        total,
        coaches,
      ] =
        await prisma.$transaction([
          prisma.coachProfile.count({
            where,
          }),

          prisma.coachProfile.findMany({
            where,

            orderBy: [
              {
                isVerified:
                  "desc",
              },
              {
                createdAt:
                  "desc",
              },
            ],

            skip:
              (page - 1) *
              limit,

            take:
              limit,

            select: {
              id: true,
              userId: true,
              displayName: true,
              bio: true,
              specialization: true,
              photoUrl: true,
              isVerified: true,
              isActive: true,
              createdAt: true,

              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  username: true,

                  _count: {
                    select: {
                      coachRelationships:
                        true,
                      trainingWorkouts:
                        true,
                      trainingPrograms:
                        true,
                    },
                  },
                },
              },
            },
          }),
        ]);

      return res.json({
        success: true,

        coaches:
          coaches.map(
            (coach) => ({
              ...coach,

              stats: {
                clients:
                  coach.user
                    ._count
                    .coachRelationships,

                workouts:
                  coach.user
                    ._count
                    .trainingWorkouts,

                programs:
                  coach.user
                    ._count
                    .trainingPrograms,
              },
            })
          ),

        pagination: {
          page,
          limit,
          total,

          pages:
            Math.ceil(
              total / limit
            ),
        },
      });
    } catch (error) {
      console.error(
        "IRONAGE COACH MARKETPLACE LOAD ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Coach marketplace load error",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

/* =========================================================
   COACH MARKETPLACE PROFILE
========================================================= */

router.get(
  "/marketplace/:coachId",
  requireAppAuth,
  async (req, res) => {
    try {
      const coachId =
        parsePositiveInt(
          req.params.coachId,
          "coachId"
        );

      const coach =
        await prisma.coachProfile.findUnique({
          where: {
            userId:
              coachId,
          },

          select: {
            id: true,
            userId: true,
            displayName: true,
            bio: true,
            specialization: true,
            photoUrl: true,
            isVerified: true,
            isActive: true,
            createdAt: true,

            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,

                _count: {
                  select: {
                    coachRelationships:
                      true,
                    trainingWorkouts:
                      true,
                    trainingPrograms:
                      true,
                  },
                },
              },
            },
          },
        });

      if (
        !coach ||
        !coach.isActive ||
        !coach.isVerified
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Coach not found",
        });
      }

      return res.json({
        success: true,

        coach: {
          ...coach,

          stats: {
            clients:
              coach.user
                ._count
                .coachRelationships,

            workouts:
              coach.user
                ._count
                .trainingWorkouts,

            programs:
              coach.user
                ._count
                .trainingPrograms,
          },
        },
      });
    } catch (error) {
      console.error(
        "IRONAGE COACH MARKETPLACE PROFILE ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Coach marketplace profile load error",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

/* =========================================================
   ATHLETE CHOOSES COACH
========================================================= */

router.post(
  "/:coachId/connect",
  requireAppAuth,
  async (req, res) => {
    try {
      const clientId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const coachId =
        parsePositiveInt(
          req.params.coachId,
          "coachId"
        );

      if (
        coachId ===
        clientId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "You cannot choose yourself as coach",
        });
      }

      const coach =
        await prisma.coachProfile.findUnique({
          where: {
            userId:
              coachId,
          },

          select: {
            userId: true,
            displayName: true,
            isActive: true,
            isVerified: true,
          },
        });

      if (
        !coach ||
        !coach.isActive ||
        !coach.isVerified
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Coach not found, inactive, or not verified",
        });
      }

      const existing =
        await prisma.coachClient.findUnique({
          where: {
            clientId,
          },
        });

      if (
        existing &&
        existing.coachId !==
          coachId
      ) {
        return res.status(409).json({
          success: false,
          message:
            "You already have a coach",
        });
      }

      if (
        existing &&
        existing.coachId ===
          coachId
      ) {
        return res.json({
          success: true,
          relationship:
            existing,
          alreadyConnected:
            true,
        });
      }

      const relationship =
        await prisma.coachClient.create({
          data: {
            coachId,
            clientId,
          },
        });

      return res.status(201).json({
        success: true,
        relationship,
        alreadyConnected:
          false,
      });
    } catch (error) {
      console.error(
        "IRONAGE COACH MARKETPLACE CONNECT ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Coach connection error",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);


export default router;

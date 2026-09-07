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
  const parsed =
    Number(value);

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

/* =========================================================
   GET PUBLISHED PROGRAMS

   GET /api/programs
========================================================= */

router.get(
  "/",
  requireAppAuth,
  async (_req, res) => {
    try {
      const programs =
        await prisma.trainingProgram.findMany({
          where: {
            status:
              "PUBLISHED",

            isPublished:
              true,

            isActive:
              true,

            coach: {
              coachProfile: {
                is: {
                  isVerified:
                    true,

                  isActive:
                    true,
                },
              },
            },
          },

          select: {
            id: true,
            coachId: true,

            name: true,
            description: true,
            durationWeeks: true,

            priceCents: true,
            currency: true,

            publishedAt: true,
            createdAt: true,

            coach: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,

                coachProfile: {
                  select: {
                    displayName:
                      true,

                    specialization:
                      true,

                    photoUrl:
                      true,

                    isVerified:
                      true,
                  },
                },
              },
            },

            _count: {
              select: {
                workouts:
                  true,

                assignments:
                  true,
              },
            },
          },

          orderBy: [
            {
              publishedAt:
                "desc",
            },
            {
              createdAt:
                "desc",
            },
          ],
        });

      return res.json({
        success: true,
        programs,
      });
    } catch (error) {
      console.error(
        "IRONAGE PROGRAM MARKETPLACE LOAD ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load programs",
      });
    }
  }
);

/* =========================================================
   GET PUBLISHED PROGRAM DETAILS

   GET /api/programs/:id
========================================================= */

router.get(
  "/:id",
  requireAppAuth,
  async (req, res) => {
    try {
      const currentUserId =
        (
          req as AppAuthenticatedRequest
        ).appUserId;

      const programId =
        parsePositiveInt(
          req.params.id,
          "programId"
        );

      const program =
        await prisma.trainingProgram.findFirst({
          where: {
            id:
              programId,

            status:
              "PUBLISHED",

            isPublished:
              true,

            isActive:
              true,

            coach: {
              coachProfile: {
                is: {
                  isVerified:
                    true,

                  isActive:
                    true,
                },
              },
            },
          },

          select: {
            id: true,
            coachId: true,

            name: true,
            description: true,
            durationWeeks: true,

            priceCents: true,
            currency: true,

            publishedAt: true,

            coach: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,

                coachProfile: {
                  select: {
                    displayName:
                      true,

                    specialization:
                      true,

                    photoUrl:
                      true,

                    isVerified:
                      true,
                  },
                },
              },
            },

            _count: {
              select: {
                workouts:
                  true,

                assignments:
                  true,
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

      const now =
        new Date();

      const entitlement =
        await prisma.programEntitlement.findFirst({
          where: {
            programId,

            userId:
              currentUserId,

            isActive:
              true,

            startsAt: {
              lte:
                now,
            },

            OR: [
              {
                expiresAt:
                  null,
              },
              {
                expiresAt: {
                  gt:
                    now,
                },
              },
            ],
          },

          select: {
            id: true,
            source: true,
            expiresAt: true,
          },
        });

      return res.json({
        success: true,
        program,

        hasAccess:
          Boolean(entitlement),

        entitlement: entitlement
          ? {
              source:
                entitlement.source,

              expiresAt:
                entitlement.expiresAt,
            }
          : null,
      });
    } catch (error) {
      console.error(
        "IRONAGE PROGRAM MARKETPLACE DETAIL ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Failed to load program",
      });
    }
  }
);


/* =========================================================
   CLAIM FREE PROGRAM
   POST /api/programs/:id/claim

   Only explicitly free published programs can be claimed.

   FREE_CLAIM gives durable access through ProgramEntitlement.
   ProgramAssignment is the currently active self-service
   training instance and therefore has assignedBy = null.
========================================================= */

router.post(
  "/:id/claim",
  requireAppAuth,
  async (req, res) => {
    try {
      const authenticatedRequest =
        req as AppAuthenticatedRequest;

      const userId =
        authenticatedRequest.appUserId;

      const programId =
        Number(req.params.id);

      if (
        !Number.isSafeInteger(programId) ||
        programId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid program id",
        });
      }

      const program =
        await prisma.trainingProgram.findFirst({
          where: {
            id: programId,

            status:
              "PUBLISHED",

            isPublished:
              true,

            isActive:
              true,

            coach: {
              coachProfile: {
                is: {
                  isVerified:
                    true,

                  isActive:
                    true,
                },
              },
            },
          },

          select: {
            id: true,
            coachId: true,
            priceCents: true,
          },
        });

      if (!program) {
        return res.status(404).json({
          success: false,
          message: "Program not found",
        });
      }

      if (program.coachId === userId) {
        return res.status(409).json({
          success: false,
          message:
            "You cannot claim your own program",
        });
      }

      /*
       * IMPORTANT:
       * null means price is not configured.
       * Only explicit 0 is considered FREE.
       */
      if (program.priceCents !== 0) {
        return res.status(409).json({
          success: false,
          message:
            "Program is not available as a free claim",
        });
      }

      const now =
        new Date();

      const result =
        await prisma.$transaction(
          async (tx) => {
            /*
             * Entitlement is durable ownership/access.
             * Do not deactivate previously claimed programs.
             */
            let entitlement =
              await tx.programEntitlement.findFirst({
                where: {
                  programId,
                  userId,

                  source:
                    "FREE_CLAIM",

                  isActive:
                    true,

                  startsAt: {
                    lte:
                      now,
                  },

                  OR: [
                    {
                      expiresAt:
                        null,
                    },
                    {
                      expiresAt: {
                        gt:
                          now,
                      },
                    },
                  ],
                },

                select: {
                  id: true,
                },
              });

            if (!entitlement) {
              entitlement =
                await tx.programEntitlement.create({
                  data: {
                    programId,
                    userId,

                    source:
                      "FREE_CLAIM",

                    isActive:
                      true,

                    startsAt:
                      now,
                  },

                  select: {
                    id: true,
                  },
                });
            }

            /*
             * Check whether this exact self-service
             * assignment is already active.
             */
            let assignment =
              await tx.programAssignment.findFirst({
                where: {
                  programId,

                  clientId:
                    userId,

                  assignedBy:
                    null,

                  isActive:
                    true,
                },

                select: {
                  id: true,
                },
              });

            if (!assignment) {
              /*
               * A user may own and train through
               * multiple programs.
               *
               * Do not deactivate assignments
               * belonging to other programs.
               */
              assignment =
                await tx.programAssignment.create({
                  data: {
                    programId,

                    clientId:
                      userId,

                    assignedBy:
                      null,

                    startDate:
                      now,

                    isActive:
                      true,
                  },

                  select: {
                    id: true,
                  },
                });
            }

            return {
              entitlementId:
                entitlement.id,

              assignmentId:
                assignment.id,
            };
          },
          {
            isolationLevel:
              "Serializable",
          }
        );

      return res.status(201).json({
        success: true,

        hasAccess:
          true,

        entitlement: {
          id:
            result.entitlementId,

          source:
            "FREE_CLAIM",
        },

        assignmentId:
          result.assignmentId,
      });
    } catch (error) {
      console.error(
        "IRONAGE FREE PROGRAM CLAIM ERROR:",
        error
      );

      /*
       * Concurrent/idempotent recovery:
       *
       * A parallel request may have completed the same
       * FREE_CLAIM while this transaction lost a race
       * against a unique index or Serializable conflict.
       *
       * In that case the desired final state already
       * exists, so return success instead of HTTP 500.
       */
      try {
        const authenticatedRequest =
          req as AppAuthenticatedRequest;

        const userId =
          authenticatedRequest.appUserId;

        const programId =
          Number(req.params.id);

        if (
          Number.isSafeInteger(programId) &&
          programId > 0
        ) {
          const now =
            new Date();

          const [
            entitlement,
            assignment,
          ] = await Promise.all([
            prisma.programEntitlement.findFirst({
              where: {
                programId,
                userId,

                source:
                  "FREE_CLAIM",

                isActive:
                  true,

                startsAt: {
                  lte:
                    now,
                },

                OR: [
                  {
                    expiresAt:
                      null,
                  },
                  {
                    expiresAt: {
                      gt:
                        now,
                    },
                  },
                ],
              },

              select: {
                id: true,
              },
            }),

            prisma.programAssignment.findFirst({
              where: {
                programId,

                clientId:
                  userId,

                assignedBy:
                  null,

                isActive:
                  true,
              },

              select: {
                id: true,
              },
            }),
          ]);

          if (
            entitlement &&
            assignment
          ) {
            console.log(
              "IRONAGE FREE PROGRAM CLAIM RECOVERED:",
              {
                userId,
                programId,
                entitlementId:
                  entitlement.id,
                assignmentId:
                  assignment.id,
              }
            );

            return res.status(200).json({
              success: true,

              hasAccess:
                true,

              entitlement: {
                id:
                  entitlement.id,

                source:
                  "FREE_CLAIM",
              },

              assignmentId:
                assignment.id,

              recovered:
                true,
            });
          }
        }
      } catch (recoveryError) {
        console.error(
          "IRONAGE FREE PROGRAM CLAIM RECOVERY ERROR:",
          recoveryError
        );
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to claim free program",
      });
    }
  }
);

export default router;

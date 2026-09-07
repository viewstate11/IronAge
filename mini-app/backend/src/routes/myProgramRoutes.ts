import { Router } from "express";

import { prisma } from "../prisma.js";

import {
  requireAppAuth,
  type AppAuthenticatedRequest,
} from "../middleware/appAuthMiddleware.js";

const router = Router();

router.get(
  "/",
  requireAppAuth,
  async (req, res) => {
    try {
      const clientId =
        (
          req as AppAuthenticatedRequest
        ).appUserId;

      const assignments =
        await prisma.programAssignment.findMany({
          where: {
            clientId,
            isActive: true,
          },
          include: {
            coach: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                coachProfile: {
                  select: {
                    displayName:
                      true,
                    specialization:
                      true,
                    photoUrl:
                      true,
                  },
                },
              },
            },
            program: {
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
            },
          },
          orderBy: {
            createdAt:
              "desc",
          },
        });

      const now =
        new Date();

      const programIds =
        assignments.map(
          (assignment) =>
            assignment.programId
        );

      const entitlements =
        programIds.length > 0
          ? await prisma.programEntitlement.findMany({
              where: {
                userId:
                  clientId,

                programId: {
                  in:
                    programIds,
                },

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

              orderBy: {
                createdAt:
                  "desc",
              },

              select: {
                programId:
                  true,

                source:
                  true,

                expiresAt:
                  true,
              },
            })
          : [];

      const accessByProgram =
        new Map<
          number,
          {
            source:
              | "COACH_ASSIGNMENT"
              | "FREE_CLAIM"
              | "PURCHASE"
              | "SUBSCRIPTION"
              | "ADMIN_GRANT";

            expiresAt:
              Date | null;
          }
        >();

      for (
        const entitlement
        of entitlements
      ) {
        if (
          !accessByProgram.has(
            entitlement.programId
          )
        ) {
          accessByProgram.set(
            entitlement.programId,
            {
              source:
                entitlement.source,

              expiresAt:
                entitlement.expiresAt,
            }
          );
        }
      }

      const result =
        assignments.map(
          (assignment) => {
            const entitlement =
              accessByProgram.get(
                assignment.programId
              );

            return {
              ...assignment,

              accessSource:
                assignment.assignedBy !== null
                  ? "COACH_ASSIGNMENT"
                  : (
                      entitlement?.source ??
                      "ADMIN_GRANT"
                    ),

              accessExpiresAt:
                entitlement?.expiresAt ??
                null,
            };
          }
        );

      return res.json({
        success: true,
        assignments:
          result,
      });
    } catch (error) {
      console.error(
        "IRONAGE MY PROGRAMS LOAD ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load assigned programs",
      });
    }
  }
);

export default router;

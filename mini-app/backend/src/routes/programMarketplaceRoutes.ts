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

      const assignment =
        await prisma.programAssignment.findFirst({
          where: {
            programId,
            clientId:
              currentUserId,
            isActive:
              true,
          },

          select: {
            id: true,
          },
        });

      return res.json({
        success: true,
        program,
        hasAccess:
          Boolean(assignment),
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

export default router;

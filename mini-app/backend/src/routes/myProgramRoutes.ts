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

      return res.json({
        success: true,
        assignments,
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

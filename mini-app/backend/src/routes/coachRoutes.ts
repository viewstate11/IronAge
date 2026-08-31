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

      const workouts =
        await prisma.workoutSession.findMany({
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
        });

      return res.json({
        success: true,
        client:
          relationship.client,
        workouts,
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

export default router;

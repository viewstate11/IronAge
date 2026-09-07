import { Router } from "express";

import { prisma } from "../prisma.js";

import {
  requireAppAuth,
  type AppAuthenticatedRequest,
} from "../middleware/appAuthMiddleware.js";

import {
  requireAdmin,
} from "../middleware/adminMiddleware.js";

const router = Router();

/* =========================================================
   ADMIN SECURITY
========================================================= */

router.use(
  requireAppAuth,
  requireAdmin
);

/* =========================================================
   HELPERS
========================================================= */

function getAdminUserId(
  req: AppAuthenticatedRequest
): number {
  const userId =
    req.appUserId;

  if (
    !userId ||
    !Number.isInteger(userId) ||
    userId <= 0
  ) {
    throw new Error(
      "Authenticated admin user ID is missing"
    );
  }

  return userId;
}

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
   COMMON PROGRAM INCLUDE
========================================================= */

const programInclude = {
  coach: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,

      coachProfile: {
        select: {
          displayName: true,
          specialization: true,
          photoUrl: true,
          isVerified: true,
          isActive: true,
        },
      },
    },
  },

  approvedByUser: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
    },
  },

  workouts: {
    include: {
      workout: {
        include: {
          exercises: {
            include: {
              exercise: true,
            },

            orderBy: {
              position: "asc" as const,
            },
          },
        },
      },
    },

    orderBy: {
      position: "asc" as const,
    },
  },

  _count: {
    select: {
      assignments: true,
      workouts: true,
    },
  },
};

/* =========================================================
   GET ALL PROGRAMS

   GET /api/admin/programs
========================================================= */

router.get(
  "/",
  async (_req, res) => {
    try {
      const programs =
        await prisma.trainingProgram.findMany({
          include:
            programInclude,

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
        "IRONAGE ADMIN PROGRAMS LOAD ERROR:",
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
   GET ONE PROGRAM

   GET /api/admin/programs/:id
========================================================= */

router.get(
  "/:id",
  async (req, res) => {
    try {
      const programId =
        parsePositiveInt(
          req.params.id,
          "programId"
        );

      const program =
        await prisma.trainingProgram.findUnique({
          where: {
            id: programId,
          },

          include:
            programInclude,
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
        "IRONAGE ADMIN PROGRAM LOAD ERROR:",
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
   APPROVE

   POST /api/admin/programs/:id/approve

   DRAFT / REVIEW
        ↓
   APPROVED
========================================================= */

router.post(
  "/:id/approve",
  async (req, res) => {
    try {
      const adminId =
        getAdminUserId(
          req as unknown as AppAuthenticatedRequest
        );

      const programId =
        parsePositiveInt(
          req.params.id,
          "programId"
        );

      const existing =
        await prisma.trainingProgram.findUnique({
          where: {
            id: programId,
          },

          select: {
            id: true,
            status: true,
            isActive: true,
          },
        });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message:
            "Program not found",
        });
      }

      if (
        existing.status === "ARCHIVED"
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Archived program cannot be approved",
        });
      }

      const program =
        await prisma.trainingProgram.update({
          where: {
            id: programId,
          },

          data: {
            status:
              "APPROVED",

            isPublished:
              false,

            isActive:
              true,

            approvedBy:
              adminId,

            approvedAt:
              new Date(),
          },

          include:
            programInclude,
        });

      return res.json({
        success: true,
        program,
      });
    } catch (error) {
      console.error(
        "IRONAGE ADMIN PROGRAM APPROVE ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Program approval failed",
      });
    }
  }
);

/* =========================================================
   REJECT / RETURN TO DRAFT

   POST /api/admin/programs/:id/reject

   REVIEW / APPROVED
        ↓
   DRAFT

   We currently do not have a REJECTED enum.
   Rejected content returns to DRAFT for correction.
========================================================= */

router.post(
  "/:id/reject",
  async (req, res) => {
    try {
      const programId =
        parsePositiveInt(
          req.params.id,
          "programId"
        );

      const existing =
        await prisma.trainingProgram.findUnique({
          where: {
            id: programId,
          },

          select: {
            id: true,
            status: true,
          },
        });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message:
            "Program not found",
        });
      }

      if (
        existing.status === "ARCHIVED"
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Archived program cannot be returned to draft",
        });
      }

      const program =
        await prisma.trainingProgram.update({
          where: {
            id: programId,
          },

          data: {
            status:
              "DRAFT",

            isPublished:
              false,

            approvedBy:
              null,

            approvedAt:
              null,
          },

          include:
            programInclude,
        });

      return res.json({
        success: true,
        program,
      });
    } catch (error) {
      console.error(
        "IRONAGE ADMIN PROGRAM REJECT ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Program rejection failed",
      });
    }
  }
);

/* =========================================================
   PUBLISH

   POST /api/admin/programs/:id/publish

   APPROVED
       ↓
   PUBLISHED
========================================================= */

router.post(
  "/:id/publish",
  async (req, res) => {
    try {
      const adminId =
        getAdminUserId(
          req as unknown as AppAuthenticatedRequest
        );

      const programId =
        parsePositiveInt(
          req.params.id,
          "programId"
        );

      const existing =
        await prisma.trainingProgram.findUnique({
          where: {
            id: programId,
          },

          include: {
            coach: {
              select: {
                coachProfile: {
                  select: {
                    isVerified: true,
                    isActive: true,
                  },
                },
              },
            },

            _count: {
              select: {
                workouts: true,
              },
            },
          },
        });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message:
            "Program not found",
        });
      }

      if (
        existing.status !==
          "APPROVED"
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Only approved programs can be published",
        });
      }

      if (
        !existing.coach
          .coachProfile
          ?.isVerified ||
        !existing.coach
          .coachProfile
          ?.isActive
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Program coach must be verified and active",
        });
      }

      if (
        existing._count.workouts === 0
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Program must contain at least one workout before publishing",
        });
      }

      const program =
        await prisma.trainingProgram.update({
          where: {
            id: programId,
          },

          data: {
            status:
              "PUBLISHED",

            isPublished:
              true,

            isActive:
              true,

            approvedBy:
              adminId,

            approvedAt:
              existing.status ===
              "APPROVED"
                ? undefined
                : new Date(),

            publishedAt:
              new Date(),
          },

          include:
            programInclude,
        });

      return res.json({
        success: true,
        program,
      });
    } catch (error) {
      console.error(
        "IRONAGE ADMIN PROGRAM PUBLISH ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Program publish failed",
      });
    }
  }
);

/* =========================================================
   UNPUBLISH

   POST /api/admin/programs/:id/unpublish

   PUBLISHED
       ↓
   APPROVED
========================================================= */

router.post(
  "/:id/unpublish",
  async (req, res) => {
    try {
      const programId =
        parsePositiveInt(
          req.params.id,
          "programId"
        );

      const existing =
        await prisma.trainingProgram.findUnique({
          where: {
            id: programId,
          },

          select: {
            id: true,
            status: true,
          },
        });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message:
            "Program not found",
        });
      }

      if (
        existing.status !==
          "PUBLISHED"
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Program is not published",
        });
      }

      const program =
        await prisma.trainingProgram.update({
          where: {
            id: programId,
          },

          data: {
            status:
              "APPROVED",

            isPublished:
              false,
          },

          include:
            programInclude,
        });

      return res.json({
        success: true,
        program,
      });
    } catch (error) {
      console.error(
        "IRONAGE ADMIN PROGRAM UNPUBLISH ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Program unpublish failed",
      });
    }
  }
);

/* =========================================================
   ARCHIVE

   POST /api/admin/programs/:id/archive
========================================================= */

router.post(
  "/:id/archive",
  async (req, res) => {
    try {
      const programId =
        parsePositiveInt(
          req.params.id,
          "programId"
        );

      const existing =
        await prisma.trainingProgram.findUnique({
          where: {
            id: programId,
          },

          select: {
            id: true,
          },
        });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message:
            "Program not found",
        });
      }

      const program =
        await prisma.trainingProgram.update({
          where: {
            id: programId,
          },

          data: {
            status:
              "ARCHIVED",

            isPublished:
              false,

            isActive:
              false,
          },

          include:
            programInclude,
        });

      return res.json({
        success: true,
        program,
      });
    } catch (error) {
      console.error(
        "IRONAGE ADMIN PROGRAM ARCHIVE ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Program archive failed",
      });
    }
  }
);

export default router;

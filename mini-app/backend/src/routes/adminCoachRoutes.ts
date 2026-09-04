import {
  Router,
} from "express";

import {
  prisma,
} from "../prisma.js";

import {
  requireAppAuth,
} from "../middleware/appAuthMiddleware.js";

import {
  requireAdmin,
} from "../middleware/adminMiddleware.js";

const router =
  Router();

/* =========================================================
   ALL ROUTES BELOW REQUIRE:
   1. authenticated IRONAGE user
   2. user ID present in IRONAGE_ADMIN_USER_IDS
========================================================= */

router.use(
  requireAppAuth,
  requireAdmin
);

/* =========================================================
   ADMIN STATUS
========================================================= */

router.get(
  "/status",
  (req, res) => {
    return res.json({
      success: true,
      isAdmin: true,
    });
  }
);

/* =========================================================
   PENDING COACHES
========================================================= */

router.get(
  "/pending",
  async (_req, res) => {
    try {
      const coaches =
        await prisma.coachProfile.findMany({
          where: {
            isVerified:
              false,
            isActive:
              true,
          },

          orderBy: {
            createdAt:
              "asc",
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
            updatedAt: true,

            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                      webId: true,
                createdAt: true,
              },
            },
          },
        });

      return res.json({
        success: true,
        coaches,
        total:
          coaches.length,
      });
    } catch (error) {
      console.error(
        "IRONAGE ADMIN PENDING COACHES ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Pending coaches load error",
      });
    }
  }
);

/* =========================================================
   APPROVE COACH
========================================================= */

router.post(
  "/:userId/approve",
  async (req, res) => {
    try {
      const userId =
        Number(
          req.params.userId
        );

      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid coach userId",
        });
      }

      const existing =
        await prisma.coachProfile.findUnique({
          where: {
            userId,
          },

          select: {
            id: true,
            userId: true,
          },
        });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message:
            "Coach profile not found",
        });
      }

      const coach =
        await prisma.coachProfile.update({
          where: {
            userId,
          },

          data: {
            isVerified:
              true,
            isActive:
              true,
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
            updatedAt: true,
          },
        });

      return res.json({
        success: true,
        coach,
        status:
          "APPROVED",
      });
    } catch (error) {
      console.error(
        "IRONAGE ADMIN COACH APPROVE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Coach approval error",
      });
    }
  }
);

/* =========================================================
   REJECT / DISABLE COACH
========================================================= */

router.post(
  "/:userId/reject",
  async (req, res) => {
    try {
      const userId =
        Number(
          req.params.userId
        );

      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid coach userId",
        });
      }

      const existing =
        await prisma.coachProfile.findUnique({
          where: {
            userId,
          },

          select: {
            id: true,
            userId: true,
          },
        });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message:
            "Coach profile not found",
        });
      }

      const coach =
        await prisma.coachProfile.update({
          where: {
            userId,
          },

          data: {
            isVerified:
              false,
            isActive:
              false,
          },

          select: {
            id: true,
            userId: true,
            displayName: true,
            isVerified: true,
            isActive: true,
            updatedAt: true,
          },
        });

      return res.json({
        success: true,
        coach,
        status:
          "REJECTED",
      });
    } catch (error) {
      console.error(
        "IRONAGE ADMIN COACH REJECT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Coach rejection error",
      });
    }
  }
);

export default router;

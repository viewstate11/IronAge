import { Router } from "express";

import { prisma } from "../prisma.js";

import {
  requireAppAuth,
  type AppAuthenticatedRequest,
} from "../middleware/appAuthMiddleware.js";

const router = Router();

/* =========================================================
   PREMIUM PLANS
========================================================= */

const PREMIUM_PLANS = [
  "MONTHLY",
  "YEARLY",
] as const;

type PremiumPlan =
  (typeof PREMIUM_PLANS)[number];

function isPremiumPlan(
  value: unknown
): value is PremiumPlan {
  return (
    typeof value === "string" &&
    PREMIUM_PLANS.includes(
      value as PremiumPlan
    )
  );
}

/* =========================================================
   GET CURRENT PREMIUM
   GET /api/premium
========================================================= */

router.get(
  "/",
  requireAppAuth,
  async (req, res) => {
    try {
      const authenticatedRequest =
        req as AppAuthenticatedRequest;

      const user =
        await prisma.user.findUnique({
          where: {
            id:
              authenticatedRequest.appUserId,
          },

          select: {
            id: true,
            premiumPlan: true,
          },
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.json({
        success: true,
        premiumPlan:
          user.premiumPlan,
      });
    } catch (error) {
      console.error(
        "IRONAGE PREMIUM GET ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load premium plan",
      });
    }
  }
);

/* =========================================================
   UPDATE CURRENT PREMIUM
   PUT /api/premium

   Temporary development endpoint.
   Real payments will replace direct activation later.
========================================================= */

router.put(
  "/",
  requireAppAuth,
  async (req, res) => {
    try {
      const authenticatedRequest =
        req as AppAuthenticatedRequest;

      const plan =
        req.body?.plan;

      if (
        plan !== null &&
        !isPremiumPlan(plan)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid premium plan",
          allowedPlans:
            PREMIUM_PLANS,
        });
      }

      const user =
        await prisma.user.update({
          where: {
            id:
              authenticatedRequest.appUserId,
          },

          data: {
            premiumPlan: plan,
          },

          select: {
            id: true,
            premiumPlan: true,
          },
        });

      return res.json({
        success: true,
        premiumPlan:
          user.premiumPlan,
      });
    } catch (error) {
      console.error(
        "IRONAGE PREMIUM UPDATE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update premium plan",
      });
    }
  }
);

export default router;

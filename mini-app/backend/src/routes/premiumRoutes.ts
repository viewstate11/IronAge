import { Router } from "express";

import { prisma } from "../prisma.js";

import {
  requireAppAuth,
  type AppAuthenticatedRequest,
} from "../middleware/appAuthMiddleware.js";

const router = Router();

/* =========================================================
   GET CURRENT PREMIUM
   GET /api/premium

   Premium entitlement is read-only from the client.

   Source of truth:
   1. Trusted Subscription records
   2. Legacy User.premiumPlan fallback

   The client can never grant itself Premium.
========================================================= */

router.get(
  "/",
  requireAppAuth,
  async (req, res) => {
    try {
      const authenticatedRequest =
        req as AppAuthenticatedRequest;

      const now = new Date();

      const user =
        await prisma.user.findUnique({
          where: {
            id: authenticatedRequest.appUserId,
          },

          select: {
            id: true,
            premiumPlan: true,

            subscriptions: {
              where: {
                status: "ACTIVE",

                OR: [
                  {
                    expiresAt: null,
                  },
                  {
                    expiresAt: {
                      gt: now,
                    },
                  },
                ],
              },

              orderBy: [
                {
                  expiresAt: "desc",
                },
                {
                  createdAt: "desc",
                },
              ],

              take: 1,

              select: {
                id: true,
                provider: true,
                platform: true,
                productId: true,
                plan: true,
                status: true,
                expiresAt: true,
              },
            },
          },
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const subscription =
        user.subscriptions[0] ?? null;

      const premiumPlan =
        subscription?.plan ??
        user.premiumPlan ??
        null;

      return res.json({
        success: true,
        premiumPlan,
        isPremium: premiumPlan !== null,
        entitlementSource:
          subscription
            ? "SUBSCRIPTION"
            : user.premiumPlan
              ? "LEGACY"
              : "NONE",
        subscription,
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
   CLIENT PREMIUM MUTATION BLOCK
   PUT /api/premium

   Premium cannot be activated directly by the client.
========================================================= */

router.put(
  "/",
  requireAppAuth,
  (_req, res) => {
    return res.status(403).json({
      success: false,
      message:
        "Direct Premium activation is disabled",
    });
  }
);

export default router;

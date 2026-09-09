import { Router } from "express";

import { prisma } from "../prisma.js";

import {
  requireAppAuth,
  type AppAuthenticatedRequest,
} from "../middleware/appAuthMiddleware.js";

const router = Router();

/* =========================================================
   GET MY PAYMENTS
   GET /api/payments/me

   Returns trusted payment records for authenticated user:
   1. Premium subscriptions
   2. Program purchases
========================================================= */

router.get(
  "/me",
  requireAppAuth,
  async (req, res) => {
    try {
      const authenticatedRequest =
        req as AppAuthenticatedRequest;

      const userId =
        authenticatedRequest.appUserId;

      const user =
        await prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            id: true,
          },
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const [
        subscriptions,
        programPurchases,
      ] = await Promise.all([
        prisma.subscription.findMany({
          where: {
            userId,
          },

          orderBy: [
            {
              purchasedAt: "desc",
            },
            {
              createdAt: "desc",
            },
          ],

          select: {
            id: true,
            provider: true,
            platform: true,
            productId: true,
            plan: true,
            status: true,
            transactionId: true,
            originalTransactionId: true,
            purchasedAt: true,
            expiresAt: true,
            lastVerifiedAt: true,
            createdAt: true,
          },
        }),

        prisma.programPurchase.findMany({
          where: {
            userId,
          },

          orderBy: {
            purchasedAt: "desc",
          },

          select: {
            id: true,
            provider: true,
            platform: true,
            productId: true,
            transactionId: true,
            originalTransactionId: true,
            amountCents: true,
            currency: true,
            purchasedAt: true,
            verifiedAt: true,
            createdAt: true,

            program: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
      ]);

      return res.json({
        success: true,

        subscriptions,

        programPurchases,
      });
    } catch (error) {
      console.error(
        "IRONAGE PAYMENTS GET ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load payment history",
      });
    }
  }
);

export default router;

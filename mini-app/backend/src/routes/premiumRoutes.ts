import { Router } from "express";

import { prisma } from "../prisma.js";

import {
  verifyPremiumPurchase,
  type PaymentPlatform,
  type PaymentProvider,
} from "../services/premiumPayment.js";

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
   VERIFY PREMIUM PURCHASE
   POST /api/premium/verify

   Authentication is required.

   IMPORTANT:
   The client submits purchase evidence only.
   Premium is granted only after trusted provider verification.
========================================================= */

router.post(
  "/verify",
  requireAppAuth,
  async (req, res) => {
    try {
      const authenticatedRequest =
        req as AppAuthenticatedRequest;

      const {
        provider,
        platform,
        productId,
        transactionId,
        verificationPayload,
      } = req.body ?? {};

      if (
        typeof provider !== "string" ||
        typeof platform !== "string" ||
        typeof verificationPayload !== "string" ||
        verificationPayload.length === 0 ||
        (
          productId !== undefined &&
          typeof productId !== "string"
        ) ||
        (
          transactionId !== undefined &&
          typeof transactionId !== "string"
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid purchase verification payload",
        });
      }

      const verified =
        await verifyPremiumPurchase({
          provider:
            provider as PaymentProvider,
          platform:
            platform as PaymentPlatform,
          verificationPayload,
          productId,
          transactionId,
        });

      const existingSubscription =
        await prisma.subscription.findUnique({
          where: {
            transactionId:
              verified.transactionId,
          },

          select: {
            id: true,
            userId: true,
          },
        });

      if (
        existingSubscription &&
        existingSubscription.userId !==
          authenticatedRequest.appUserId
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Purchase belongs to another account",
        });
      }

      const subscription =
        existingSubscription
          ? await prisma.subscription.update({
              where: {
                id:
                  existingSubscription.id,
              },

              data: {
                provider:
                  verified.provider,
                platform:
                  verified.platform,
                productId:
                  verified.productId,
                plan:
                  verified.plan,
                status: "ACTIVE",
                originalTransactionId:
                  verified.originalTransactionId,
                purchasedAt:
                  verified.purchasedAt,
                expiresAt:
                  verified.expiresAt,
                lastVerifiedAt:
                  new Date(),
              },
            })
          : await prisma.subscription.create({
              data: {
                userId:
                  authenticatedRequest.appUserId,
                provider:
                  verified.provider,
                platform:
                  verified.platform,
                productId:
                  verified.productId,
                plan:
                  verified.plan,
                status: "ACTIVE",
                transactionId:
                  verified.transactionId,
                originalTransactionId:
                  verified.originalTransactionId,
                purchasedAt:
                  verified.purchasedAt,
                expiresAt:
                  verified.expiresAt,
                lastVerifiedAt:
                  new Date(),
              },
            });

      return res.json({
        success: true,
        premiumPlan: subscription.plan,
        isPremium: true,
      });
    } catch (error) {
      console.error(
        "IRONAGE PREMIUM VERIFY ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Purchase verification failed",
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

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

   IMPORTANT:
   The client must never be allowed to grant itself Premium.
   Future payment providers / App Store verification will
   update entitlement through trusted server-side flows.
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
   CLIENT PREMIUM MUTATION BLOCK

   PUT /api/premium

   Premium cannot be activated directly by the client.
   A verified payment flow will replace this endpoint.
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

import { Router } from "express";

import { prisma } from "../prisma.js";

import {
  requireAppAuth,
} from "../middleware/appAuthMiddleware.js";

import {
  requireAdmin,
} from "../middleware/adminMiddleware.js";

const router = Router();

router.use(
  requireAppAuth,
  requireAdmin
);

/* =========================================================
   ADMIN USERS
   GET /api/admin/users
========================================================= */

router.get(
  "/",
  async (req, res) => {
    try {
      const pageRaw =
        Number(req.query.page ?? 1);

      const limitRaw =
        Number(req.query.limit ?? 25);

      const page =
        Number.isInteger(pageRaw) &&
        pageRaw > 0
          ? pageRaw
          : 1;

      const limit =
        Number.isInteger(limitRaw) &&
        limitRaw > 0
          ? Math.min(limitRaw, 50)
          : 25;

      const search =
        String(
          req.query.search ?? ""
        ).trim();

      const where =
        search
          ? {
              OR: [
                {
                  firstName: {
                    contains: search,
                    mode:
                      "insensitive" as const,
                  },
                },
                {
                  lastName: {
                    contains: search,
                    mode:
                      "insensitive" as const,
                  },
                },
                {
                  username: {
                    contains: search,
                    mode:
                      "insensitive" as const,
                  },
                },
                {
                  authIdentities: {
                    some: {
                      email: {
                        contains: search,
                        mode:
                          "insensitive" as const,
                      },
                    },
                  },
                },
              ],
            }
          : {};

      const [
        total,
        users,
      ] =
        await prisma.$transaction([
          prisma.user.count({
            where,
          }),

          prisma.user.findMany({
            where,

            orderBy: {
              createdAt: "desc",
            },

            skip:
              (page - 1) *
              limit,

            take:
              limit,

            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              telegramId: true,
              webId: true,
              languageCode: true,
              onboardingCompleted: true,
              premiumPlan: true,
              level: true,
              xp: true,
              workouts: true,
              streak: true,
              createdAt: true,

              coachProfile: {
                select: {
                  displayName: true,
                  isVerified: true,
                  isActive: true,
                },
              },

              clientRelationships: {
                select: {
                  coachId: true,
                },
                take: 1,
              },

              authIdentities: {
                select: {
                  provider: true,
                  email: true,
                  emailVerified: true,
                },
                orderBy: {
                  createdAt: "asc",
                },
              },

              subscriptions: {
                select: {
                  plan: true,
                  status: true,
                  expiresAt: true,
                },
                orderBy: {
                  createdAt: "desc",
                },
                take: 1,
              },
            },
          }),
        ]);

      return res.json({
        success: true,

        users:
          users.map(user => ({
            ...user,

            telegramId:
              user.telegramId
                ? user.telegramId.toString()
                : null,

            isCoach:
              Boolean(
                user.coachProfile
              ),

            coachId:
              user
                .clientRelationships[0]
                ?.coachId ??
              null,

            isClient:
              user
                .clientRelationships
                .length > 0,

            latestSubscription:
              user.subscriptions[0] ??
              null,
          })),

        pagination: {
          page,
          limit,
          total,
          pages:
            Math.max(
              1,
              Math.ceil(
                total / limit
              )
            ),
        },
      });
    } catch (error) {
      console.error(
        "IRONAGE ADMIN USERS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load users",
      });
    }
  }
);

export default router;

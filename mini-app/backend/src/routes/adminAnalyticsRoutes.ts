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

router.get(
  "/",
  async (_req, res) => {
    try {
      const now =
        new Date();

      const sevenDaysAgo =
        new Date(now);

      sevenDaysAgo.setDate(
        sevenDaysAgo.getDate() - 7
      );

      const thirtyDaysAgo =
        new Date(now);

      thirtyDaysAgo.setDate(
        thirtyDaysAgo.getDate() - 30
      );

      const sixtyDaysAgo =
        new Date(now);

      sixtyDaysAgo.setDate(
        sixtyDaysAgo.getDate() - 60
      );

      const [
        totalUsers,
        newUsers7,
        newUsers30,
        previous30Users,

        totalCoaches,
        activeVerifiedCoaches,

        activePremiumUsers,

        totalPrograms,
        publishedPrograms,

        totalWorkouts,
        workouts30,

        totalSales,
        sales30,

        purchases,
      ] =
        await Promise.all([
          prisma.user.count(),

          prisma.user.count({
            where: {
              createdAt: {
                gte: sevenDaysAgo,
              },
            },
          }),

          prisma.user.count({
            where: {
              createdAt: {
                gte: thirtyDaysAgo,
              },
            },
          }),

          prisma.user.count({
            where: {
              createdAt: {
                gte: sixtyDaysAgo,
                lt: thirtyDaysAgo,
              },
            },
          }),

          prisma.coachProfile.count(),

          prisma.coachProfile.count({
            where: {
              isVerified: true,
              isActive: true,
            },
          }),

          prisma.user.count({
            where: {
              OR: [
                {
                  premiumPlan: {
                    not: null,
                  },
                },
                {
                  subscriptions: {
                    some: {
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
                  },
                },
              ],
            },
          }),

          prisma.trainingProgram.count(),

          prisma.trainingProgram.count({
            where: {
              isPublished: true,
              isActive: true,
            },
          }),

          prisma.workoutSession.count({
            where: {
              status: "COMPLETED",
            },
          }),

          prisma.workoutSession.count({
            where: {
              status: "COMPLETED",

              createdAt: {
                gte: thirtyDaysAgo,
              },
            },
          }),

          prisma.programPurchase.count(),

          prisma.programPurchase.count({
            where: {
              purchasedAt: {
                gte: thirtyDaysAgo,
              },
            },
          }),

          prisma.programPurchase.findMany({
            where: {
              amountCents: {
                not: null,
              },
            },

            select: {
              amountCents: true,
              currency: true,
              purchasedAt: true,
            },
          }),
        ]);

      const growthPercent =
        previous30Users > 0
          ? (
              (
                newUsers30 -
                previous30Users
              ) /
              previous30Users
            ) * 100
          : newUsers30 > 0
            ? 100
            : 0;

      type RevenueBucket = {
        currency: string;
        grossCents: number;
        last30Cents: number;
        sales: number;
        last30Sales: number;
      };

      const revenueMap =
        new Map<
          string,
          RevenueBucket
        >();

      for (
        const purchase
        of purchases
      ) {
        const amount =
          purchase.amountCents ??
          0;

        const currency =
          (
            purchase.currency ??
            "EUR"
          ).toUpperCase();

        const existing =
          revenueMap.get(
            currency
          ) ?? {
            currency,
            grossCents: 0,
            last30Cents: 0,
            sales: 0,
            last30Sales: 0,
          };

        existing.grossCents +=
          amount;

        existing.sales += 1;

        if (
          purchase.purchasedAt >=
          thirtyDaysAgo
        ) {
          existing.last30Cents +=
            amount;

          existing.last30Sales +=
            1;
        }

        revenueMap.set(
          currency,
          existing
        );
      }

      const revenue =
        Array.from(
          revenueMap.values()
        ).sort(
          (a, b) =>
            b.grossCents -
            a.grossCents
        );

      return res.json({
        success: true,

        generatedAt:
          now.toISOString(),

        users: {
          total: totalUsers,
          new7Days: newUsers7,
          new30Days: newUsers30,
          previous30Days:
            previous30Users,
          growthPercent:
            Number(
              growthPercent.toFixed(
                1
              )
            ),
        },

        coaches: {
          total: totalCoaches,
          activeVerified:
            activeVerifiedCoaches,
        },

        premium: {
          activeUsers:
            activePremiumUsers,
        },

        programs: {
          total: totalPrograms,
          published:
            publishedPrograms,
        },

        workouts: {
          completed:
            totalWorkouts,
          completed30Days:
            workouts30,
        },

        sales: {
          total: totalSales,
          last30Days: sales30,
        },

        revenue,
      });
    } catch (error) {
      console.error(
        "IRONAGE ADMIN ANALYTICS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load analytics",
      });
    }
  }
);

export default router;

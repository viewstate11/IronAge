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
  async (req, res) => {
    try {
      const search =
        String(
          req.query.search ?? ""
        ).trim();

      const limitRaw =
        Number(
          req.query.limit ?? 50
        );

      const limit =
        Number.isInteger(limitRaw) &&
        limitRaw > 0
          ? Math.min(
              limitRaw,
              100
            )
          : 50;

      const now =
        new Date();

      const userFilter =
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
          : undefined;

      const [
        subscriptionTotal,
        activeSubscriptions,
        purchaseTotal,
        subscriptions,
        purchases,
        revenuePurchases,
      ] =
        await Promise.all([
          prisma.subscription.count(
            userFilter
              ? {
                  where: {
                    user: userFilter,
                  },
                }
              : undefined
          ),

          prisma.subscription.count({
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

              ...(userFilter
                ? {
                    user:
                      userFilter,
                  }
                : {}),
            },
          }),

          prisma.programPurchase.count(
            userFilter
              ? {
                  where: {
                    user: userFilter,
                  },
                }
              : undefined
          ),

          prisma.subscription.findMany({
            where:
              userFilter
                ? {
                    user:
                      userFilter,
                  }
                : undefined,

            orderBy: [
              {
                purchasedAt:
                  "desc",
              },
              {
                createdAt:
                  "desc",
              },
            ],

            take: limit,

            select: {
              id: true,
              provider: true,
              platform: true,
              productId: true,
              plan: true,
              status: true,
              transactionId: true,
              originalTransactionId:
                true,
              purchasedAt: true,
              expiresAt: true,
              lastVerifiedAt: true,
              createdAt: true,

              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  username: true,

                  authIdentities: {
                    select: {
                      email: true,
                    },

                    where: {
                      email: {
                        not: null,
                      },
                    },

                    take: 1,
                  },
                },
              },
            },
          }),

          prisma.programPurchase.findMany({
            where:
              userFilter
                ? {
                    user:
                      userFilter,
                  }
                : undefined,

            orderBy: {
              purchasedAt:
                "desc",
            },

            take: limit,

            select: {
              id: true,
              provider: true,
              platform: true,
              productId: true,
              transactionId: true,
              originalTransactionId:
                true,
              amountCents: true,
              currency: true,
              purchasedAt: true,
              verifiedAt: true,
              createdAt: true,

              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  username: true,

                  authIdentities: {
                    select: {
                      email: true,
                    },

                    where: {
                      email: {
                        not: null,
                      },
                    },

                    take: 1,
                  },
                },
              },

              program: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          }),

          prisma.programPurchase.findMany({
            where: {
              amountCents: {
                not: null,
              },

              ...(userFilter
                ? {
                    user:
                      userFilter,
                  }
                : {}),
            },

            select: {
              amountCents: true,
              currency: true,
            },
          }),
        ]);

      const revenueMap =
        new Map<
          string,
          {
            currency: string;
            amountCents: number;
            sales: number;
          }
        >();

      for (
        const purchase
        of revenuePurchases
      ) {
        const currency =
          (
            purchase.currency ??
            "EUR"
          ).toUpperCase();

        const current =
          revenueMap.get(
            currency
          ) ?? {
            currency,
            amountCents: 0,
            sales: 0,
          };

        current.amountCents +=
          purchase.amountCents ??
          0;

        current.sales += 1;

        revenueMap.set(
          currency,
          current
        );
      }

      const normalizeUser = (
        user: {
          id: number;
          firstName: string;
          lastName: string | null;
          username: string | null;
          authIdentities: Array<{
            email: string | null;
          }>;
        }
      ) => ({
        id: user.id,
        firstName:
          user.firstName,
        lastName:
          user.lastName,
        username:
          user.username,
        email:
          user.authIdentities[0]
            ?.email ??
          null,
      });

      return res.json({
        success: true,

        summary: {
          subscriptions:
            subscriptionTotal,
          activeSubscriptions,
          programPurchases:
            purchaseTotal,

          programRevenue:
            Array.from(
              revenueMap.values()
            ).sort(
              (a, b) =>
                b.amountCents -
                a.amountCents
            ),
        },

        subscriptions:
          subscriptions.map(
            item => ({
              ...item,
              user:
                normalizeUser(
                  item.user
                ),
            })
          ),

        programPurchases:
          purchases.map(
            item => ({
              ...item,
              user:
                normalizeUser(
                  item.user
                ),
            })
          ),
      });
    } catch (error) {
      console.error(
        "IRONAGE ADMIN PAYMENTS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load admin payments",
      });
    }
  }
);

export default router;

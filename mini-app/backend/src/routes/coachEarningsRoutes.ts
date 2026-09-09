import { Router } from "express";

import { prisma } from "../prisma.js";

import {
  requireAppAuth,
  type AppAuthenticatedRequest,
} from "../middleware/appAuthMiddleware.js";

const router = Router();

function getCommissionBps(): number {
  const raw =
    Number(
      process.env
        .IRONAGE_COACH_COMMISSION_BPS ??
      0
    );

  if (
    !Number.isInteger(raw) ||
    raw < 0 ||
    raw > 10000
  ) {
    return 0;
  }

  return raw;
}

/* =========================================================
   COACH EARNINGS
   GET /api/coach-earnings/me
========================================================= */

router.get(
  "/me",
  requireAppAuth,
  async (req, res) => {
    try {
      const coachId =
        (
          req as AppAuthenticatedRequest
        ).appUserId;

      const coachProfile =
        await prisma.coachProfile.findUnique({
          where: {
            userId: coachId,
          },
          select: {
            displayName: true,
            isVerified: true,
            isActive: true,
          },
        });

      if (
        !coachProfile ||
        !coachProfile.isVerified ||
        !coachProfile.isActive
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Active verified coach profile required",
        });
      }

      const [
        programs,
        purchases,
      ] = await Promise.all([
        prisma.trainingProgram.findMany({
          where: {
            coachId,
          },
          select: {
            id: true,
            name: true,
            status: true,
            isPublished: true,
            isActive: true,
            priceCents: true,
            currency: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.programPurchase.findMany({
          where: {
            program: {
              coachId,
            },
          },
          select: {
            id: true,
            userId: true,
            provider: true,
            platform: true,
            amountCents: true,
            currency: true,
            purchasedAt: true,

            program: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            purchasedAt: "desc",
          },
        }),
      ]);

      const commissionBps =
        getCommissionBps();

      const totalsMap =
        new Map<
          string,
          {
            currency: string;
            grossCents: number;
            commissionCents: number;
            netCents: number;
            sales: number;
          }
        >();

      for (
        const purchase of purchases
      ) {
        const amountCents =
          Number(
            purchase.amountCents ?? 0
          );

        if (
          !Number.isFinite(
            amountCents
          ) ||
          amountCents < 0
        ) {
          continue;
        }

        const currency =
          String(
            purchase.currency ||
            "EUR"
          ).toUpperCase();

        const current =
          totalsMap.get(currency) ?? {
            currency,
            grossCents: 0,
            commissionCents: 0,
            netCents: 0,
            sales: 0,
          };

        const commissionCents =
          Math.round(
            amountCents *
              commissionBps /
              10000
          );

        current.grossCents +=
          amountCents;

        current.commissionCents +=
          commissionCents;

        current.netCents +=
          amountCents -
          commissionCents;

        current.sales += 1;

        totalsMap.set(
          currency,
          current
        );
      }

      const totals =
        Array.from(
          totalsMap.values()
        ).sort(
          (a, b) =>
            b.grossCents -
            a.grossCents
        );

      if (totals.length === 0) {
        totals.push({
          currency: "EUR",
          grossCents: 0,
          commissionCents: 0,
          netCents: 0,
          sales: 0,
        });
      }

      return res.json({
        success: true,

        coach: {
          displayName:
            coachProfile.displayName,
        },

        commissionBps,

        stats: {
          programs:
            programs.length,

          activePrograms:
            programs.filter(
              program =>
                program.isActive &&
                program.isPublished
            ).length,

          sales:
            purchases.length,
        },

        totals,

        programs,

        transactions:
          purchases.map(
            purchase => {
              const amountCents =
                Number(
                  purchase.amountCents ??
                  0
                );

              const commissionCents =
                Math.round(
                  amountCents *
                    commissionBps /
                    10000
                );

              return {
                id:
                  purchase.id,

                userId:
                  purchase.userId,

                program:
                  purchase.program,

                provider:
                  purchase.provider,

                platform:
                  purchase.platform,

                amountCents,

                currency:
                  String(
                    purchase.currency ||
                    "EUR"
                  ).toUpperCase(),

                commissionCents,

                netCents:
                  amountCents -
                  commissionCents,

                purchasedAt:
                  purchase.purchasedAt,
              };
            }
          ),
      });
    } catch (error) {
      console.error(
        "IRONAGE COACH EARNINGS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load coach earnings",
      });
    }
  }
);

export default router;

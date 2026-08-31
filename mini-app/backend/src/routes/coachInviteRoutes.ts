import crypto from "node:crypto";
import { Router } from "express";

import { prisma } from "../prisma.js";

import {
  requireAppAuth,
  type AppAuthenticatedRequest,
} from "../middleware/appAuthMiddleware.js";

const router = Router();

function getCurrentUserId(
  req: AppAuthenticatedRequest
): number {
  const userId = Number(
    req.appUserId
  );

  if (
    !Number.isInteger(userId) ||
    userId <= 0
  ) {
    throw new Error(
      "Authenticated user ID is invalid"
    );
  }

  return userId;
}

async function hasActiveCoachProfile(
  userId: number
): Promise<boolean> {
  const coach =
    await prisma.coachProfile.findUnique({
      where: {
        userId,
      },
      select: {
        isActive: true,
      },
    });

  return Boolean(
    coach?.isActive
  );
}

router.post(
  "/",
  requireAppAuth,
  async (req, res) => {
    try {
      const coachId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      if (
        !await hasActiveCoachProfile(
          coachId
        )
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Active coach profile required",
        });
      }

      const token =
        crypto
          .randomBytes(32)
          .toString("hex");

      const expiresAt =
        new Date(
          Date.now() +
            7 *
              24 *
              60 *
              60 *
              1000
        );

      const invite =
        await prisma.coachInvite.create({
          data: {
            coachId,
            token,
            expiresAt,
          },
          select: {
            id: true,
            token: true,
            expiresAt: true,
            createdAt: true,
          },
        });

      return res.status(201).json({
        success: true,
        invite,
      });
    } catch (error) {
      console.error(
        "IRONAGE COACH INVITE CREATE ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Coach invite create error",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

router.get(
  "/:token",
  requireAppAuth,
  async (req, res) => {
    try {
      const token =
        String(
          req.params.token ?? ""
        ).trim();

      if (!token) {
        return res.status(400).json({
          success: false,
          message:
            "Invite token is required",
        });
      }

      const invite =
        await prisma.coachInvite.findUnique({
          where: {
            token,
          },
          select: {
            id: true,
            expiresAt: true,
            acceptedAt: true,

            coach: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,

                coachProfile: {
                  select: {
                    displayName: true,
                    bio: true,
                    specialization: true,
                    photoUrl: true,
                    isVerified: true,
                    isActive: true,
                  },
                },
              },
            },
          },
        });

      if (!invite) {
        return res.status(404).json({
          success: false,
          message:
            "Invite not found",
        });
      }

      if (invite.acceptedAt) {
        return res.status(410).json({
          success: false,
          message:
            "Invite has already been used",
        });
      }

      if (
        invite.expiresAt.getTime() <=
        Date.now()
      ) {
        return res.status(410).json({
          success: false,
          message:
            "Invite has expired",
        });
      }

      if (
        !invite.coach.coachProfile
          ?.isActive
      ) {
        return res.status(410).json({
          success: false,
          message:
            "Coach is not active",
        });
      }

      return res.json({
        success: true,
        invite,
      });
    } catch (error) {
      console.error(
        "IRONAGE COACH INVITE LOAD ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Coach invite load error",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

router.post(
  "/:token/accept",
  requireAppAuth,
  async (req, res) => {
    try {
      const clientId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const token =
        String(
          req.params.token ?? ""
        ).trim();

      if (!token) {
        return res.status(400).json({
          success: false,
          message:
            "Invite token is required",
        });
      }

      const result =
        await prisma.$transaction(
          async (tx) => {
            const invite =
              await tx.coachInvite.findUnique({
                where: {
                  token,
                },
              });

            if (!invite) {
              throw new Error(
                "INVITE_NOT_FOUND"
              );
            }

            if (invite.acceptedAt) {
              throw new Error(
                "INVITE_USED"
              );
            }

            if (
              invite.expiresAt.getTime() <=
              Date.now()
            ) {
              throw new Error(
                "INVITE_EXPIRED"
              );
            }

            if (
              invite.coachId ===
              clientId
            ) {
              throw new Error(
                "SELF_ASSIGN"
              );
            }

            const coachProfile =
              await tx.coachProfile.findUnique({
                where: {
                  userId:
                    invite.coachId,
                },
                select: {
                  isActive: true,
                },
              });

            if (
              !coachProfile?.isActive
            ) {
              throw new Error(
                "COACH_INACTIVE"
              );
            }

            const existing =
              await tx.coachClient.findUnique({
                where: {
                  clientId,
                },
              });

            if (
              existing &&
              existing.coachId !==
                invite.coachId
            ) {
              throw new Error(
                "CLIENT_HAS_COACH"
              );
            }

            const relationship =
              existing ??
              await tx.coachClient.create({
                data: {
                  coachId:
                    invite.coachId,
                  clientId,
                },
              });

            const acceptedInvite =
              await tx.coachInvite.update({
                where: {
                  id: invite.id,
                },
                data: {
                  acceptedAt:
                    new Date(),
                },
              });

            return {
              relationship,
              invite:
                acceptedInvite,
            };
          }
        );

      return res.status(201).json({
        success: true,
        relationship:
          result.relationship,
        acceptedAt:
          result.invite.acceptedAt,
      });
    } catch (error) {
      const code =
        error instanceof Error
          ? error.message
          : String(error);

      if (
        code ===
        "INVITE_NOT_FOUND"
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Invite not found",
        });
      }

      if (
        code === "INVITE_USED" ||
        code === "INVITE_EXPIRED" ||
        code === "COACH_INACTIVE"
      ) {
        return res.status(410).json({
          success: false,
          message:
            code === "INVITE_USED"
              ? "Invite has already been used"
              : code === "INVITE_EXPIRED"
                ? "Invite has expired"
                : "Coach is not active",
        });
      }

      if (
        code === "SELF_ASSIGN"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Coach cannot accept their own invite",
        });
      }

      if (
        code ===
        "CLIENT_HAS_COACH"
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Client already has a coach",
        });
      }

      console.error(
        "IRONAGE COACH INVITE ACCEPT ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Coach invite accept error",
        error: code,
      });
    }
  }
);

export default router;

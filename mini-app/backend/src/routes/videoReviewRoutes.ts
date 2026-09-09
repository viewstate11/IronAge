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
  const userId = req.appUserId;

  if (
    !Number.isInteger(userId) ||
    userId <= 0
  ) {
    throw new Error(
      "Authenticated app user ID is missing"
    );
  }

  return userId;
}

function parsePositiveInt(
  value: unknown,
  fieldName: string
): number {
  const parsed = Number(value);

  if (
    !Number.isInteger(parsed) ||
    parsed <= 0
  ) {
    throw new Error(
      `${fieldName} must be a positive integer`
    );
  }

  return parsed;
}

function optionalPositiveInt(
  value: unknown
): number | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  return parsePositiveInt(
    value,
    "workoutSessionId"
  );
}

function normalizeText(
  value: unknown,
  maxLength: number
): string | null {
  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  const normalized =
    String(value).trim();

  if (!normalized) {
    return null;
  }

  return normalized.slice(
    0,
    maxLength
  );
}

function normalizeVideoUrl(
  value: unknown
): string {
  const raw =
    String(value ?? "").trim();

  if (!raw) {
    throw new Error(
      "videoUrl is required"
    );
  }

  if (raw.length > 2048) {
    throw new Error(
      "videoUrl is too long"
    );
  }

  let parsed: URL;

  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(
      "videoUrl must be a valid URL"
    );
  }

  if (
    parsed.protocol !== "https:" &&
    parsed.protocol !== "http:"
  ) {
    throw new Error(
      "videoUrl must use HTTP or HTTPS"
    );
  }

  return parsed.toString();
}

/* =========================================================
   ATHLETE: CREATE VIDEO REVIEW REQUEST
   POST /api/video-reviews
========================================================= */

router.post(
  "/",
  requireAppAuth,
  async (req, res) => {
    try {
      const clientId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const relationship =
        await prisma.coachClient.findUnique({
          where: {
            clientId,
          },

          select: {
            coachId: true,

            coach: {
              select: {
                coachProfile: {
                  select: {
                    isActive: true,
                    isVerified: true,
                  },
                },
              },
            },
          },
        });

      if (!relationship) {
        return res.status(409).json({
          success: false,
          message:
            "You do not have an assigned coach",
        });
      }

      if (
        !relationship.coach.coachProfile ||
        !relationship.coach.coachProfile.isActive ||
        !relationship.coach.coachProfile.isVerified
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Assigned coach is not available",
        });
      }

      const exerciseName =
        normalizeText(
          req.body?.exerciseName,
          160
        );

      if (!exerciseName) {
        return res.status(400).json({
          success: false,
          message:
            "exerciseName is required",
        });
      }

      const videoUrl =
        normalizeVideoUrl(
          req.body?.videoUrl
        );

      const athleteNote =
        normalizeText(
          req.body?.athleteNote,
          2000
        );

      const workoutSessionId =
        optionalPositiveInt(
          req.body?.workoutSessionId
        );

      if (workoutSessionId !== null) {
        const workoutSession =
          await prisma.workoutSession.findFirst({
            where: {
              id: workoutSessionId,
              userId: clientId,
            },

            select: {
              id: true,
            },
          });

        if (!workoutSession) {
          return res.status(404).json({
            success: false,
            message:
              "Workout session not found",
          });
        }
      }

      const review =
        await prisma.videoReview.create({
          data: {
            clientId,
            coachId:
              relationship.coachId,
            workoutSessionId,
            exerciseName,
            videoUrl,
            athleteNote,
            status: "PENDING",
          },

          select: {
            id: true,
            clientId: true,
            coachId: true,
            workoutSessionId: true,
            exerciseName: true,
            videoUrl: true,
            athleteNote: true,
            coachFeedback: true,
            status: true,
            submittedAt: true,
            reviewedAt: true,
          },
        });

      return res.status(201).json({
        success: true,
        review,
      });
    } catch (error) {
      console.error(
        "IRONAGE VIDEO REVIEW CREATE ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create video review",
      });
    }
  }
);

/* =========================================================
   ATHLETE: MY REVIEWS
   GET /api/video-reviews/me
========================================================= */

router.get(
  "/me",
  requireAppAuth,
  async (req, res) => {
    try {
      const clientId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const reviews =
        await prisma.videoReview.findMany({
          where: {
            clientId,
          },

          orderBy: {
            submittedAt: "desc",
          },

          select: {
            id: true,
            workoutSessionId: true,
            exerciseName: true,
            videoUrl: true,
            athleteNote: true,
            coachFeedback: true,
            status: true,
            submittedAt: true,
            reviewedAt: true,

            coach: {
              select: {
                id: true,
                firstName: true,
                lastName: true,

                coachProfile: {
                  select: {
                    displayName: true,
                    photoUrl: true,
                  },
                },
              },
            },
          },
        });

      return res.json({
        success: true,
        reviews,
      });
    } catch (error) {
      console.error(
        "IRONAGE VIDEO REVIEW MY LIST ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load video reviews",
      });
    }
  }
);

/* =========================================================
   COACH: REVIEW QUEUE
   GET /api/video-reviews/coach
========================================================= */

router.get(
  "/coach",
  requireAppAuth,
  async (req, res) => {
    try {
      const coachId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const coachProfile =
        await prisma.coachProfile.findUnique({
          where: {
            userId: coachId,
          },

          select: {
            isActive: true,
            isVerified: true,
          },
        });

      if (
        !coachProfile ||
        !coachProfile.isActive ||
        !coachProfile.isVerified
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Active verified coach profile required",
        });
      }

      const reviews =
        await prisma.videoReview.findMany({
          where: {
            coachId,
          },

          orderBy: [
            {
              status: "asc",
            },
            {
              submittedAt: "desc",
            },
          ],

          select: {
            id: true,
            clientId: true,
            workoutSessionId: true,
            exerciseName: true,
            videoUrl: true,
            athleteNote: true,
            coachFeedback: true,
            status: true,
            submittedAt: true,
            reviewedAt: true,

            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
              },
            },
          },
        });

      return res.json({
        success: true,
        reviews,
      });
    } catch (error) {
      console.error(
        "IRONAGE VIDEO REVIEW COACH LIST ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load coach video reviews",
      });
    }
  }
);

/* =========================================================
   COACH: SUBMIT FEEDBACK
   PATCH /api/video-reviews/:id/review
========================================================= */

router.patch(
  "/:id/review",
  requireAppAuth,
  async (req, res) => {
    try {
      const coachId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const reviewId =
        parsePositiveInt(
          req.params.id,
          "reviewId"
        );

      const coachProfile =
        await prisma.coachProfile.findUnique({
          where: {
            userId: coachId,
          },

          select: {
            isActive: true,
            isVerified: true,
          },
        });

      if (
        !coachProfile ||
        !coachProfile.isActive ||
        !coachProfile.isVerified
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Active verified coach profile required",
        });
      }

      const review =
        await prisma.videoReview.findUnique({
          where: {
            id: reviewId,
          },

          select: {
            id: true,
            coachId: true,
          },
        });

      if (!review) {
        return res.status(404).json({
          success: false,
          message:
            "Video review not found",
        });
      }

      if (
        review.coachId !== coachId
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      const statusRaw =
        String(
          req.body?.status ??
          "REVIEWED"
        )
          .trim()
          .toUpperCase();

      if (
        statusRaw !== "REVIEWED" &&
        statusRaw !== "REJECTED"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "status must be REVIEWED or REJECTED",
        });
      }

      const coachFeedback =
        normalizeText(
          req.body?.coachFeedback,
          4000
        );

      if (!coachFeedback) {
        return res.status(400).json({
          success: false,
          message:
            "coachFeedback is required",
        });
      }

      const updated =
        await prisma.videoReview.update({
          where: {
            id: reviewId,
          },

          data: {
            status: statusRaw,
            coachFeedback,
            reviewedAt: new Date(),
          },

          select: {
            id: true,
            clientId: true,
            coachId: true,
            exerciseName: true,
            videoUrl: true,
            athleteNote: true,
            coachFeedback: true,
            status: true,
            submittedAt: true,
            reviewedAt: true,
          },
        });

      return res.json({
        success: true,
        review: updated,
      });
    } catch (error) {
      console.error(
        "IRONAGE VIDEO REVIEW FEEDBACK ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to review video",
      });
    }
  }
);

export default router;

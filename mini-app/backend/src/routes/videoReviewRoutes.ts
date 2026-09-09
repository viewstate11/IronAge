import { Router } from "express";
import { randomUUID } from "node:crypto";

import {
  issueSignedToken,
  presignUrl,
} from "@vercel/blob";

import { prisma } from "../prisma.js";

import {
  requireAppAuth,
  type AppAuthenticatedRequest,
} from "../middleware/appAuthMiddleware.js";

const router = Router();

const VIDEO_REVIEW_MAX_BYTES =
  250 * 1024 * 1024;

const VIDEO_UPLOAD_TTL_MS =
  10 * 60 * 1000;

function sanitizeVideoExtension(
  fileName: unknown
): string {
  const normalized =
    String(fileName ?? "").trim();

  const match =
    normalized.match(
      /\.([a-zA-Z0-9]{1,8})$/
    );

  if (!match) {
    return "mp4";
  }

  return match[1]
    .toLowerCase()
    .replace(
      /[^a-z0-9]/g,
      ""
    ) || "mp4";
}

function normalizeVideoContentType(
  value: unknown
): string {
  const contentType =
    String(value ?? "")
      .trim()
      .toLowerCase();

  if (
    !contentType ||
    !contentType.startsWith(
      "video/"
    ) ||
    contentType.length > 120
  ) {
    throw new Error(
      "A valid video content type is required"
    );
  }

  return contentType;
}

function normalizeVideoFileSize(
  value: unknown
): number {
  const size = Number(value);

  if (
    !Number.isInteger(size) ||
    size <= 0
  ) {
    throw new Error(
      "A valid video file size is required"
    );
  }

  if (
    size >
    VIDEO_REVIEW_MAX_BYTES
  ) {
    throw new Error(
      "Video file is too large"
    );
  }

  return size;
}

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
  value: unknown,
  clientId?: number
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

  const privatePrefix =
    "ironage-blob:";

  if (
    raw.startsWith(
      privatePrefix
    )
  ) {
    const pathname =
      raw.slice(
        privatePrefix.length
      );

    if (
      !pathname.startsWith(
        "video-reviews/"
      )
    ) {
      throw new Error(
        "Invalid private video reference"
      );
    }

    if (
      clientId &&
      !pathname.startsWith(
        `video-reviews/client-${clientId}/`
      )
    ) {
      throw new Error(
        "Private video does not belong to this user"
      );
    }

    return (
      privatePrefix +
      pathname
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
   ATHLETE: CREATE PRIVATE VIDEO UPLOAD URL
   POST /api/video-reviews/upload-url
========================================================= */

router.post(
  "/upload-url",
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

      const contentType =
        normalizeVideoContentType(
          req.body?.contentType
        );

      const fileSize =
        normalizeVideoFileSize(
          req.body?.fileSize
        );

      const extension =
        sanitizeVideoExtension(
          req.body?.fileName
        );

      const pathname =
        [
          "video-reviews",
          `client-${clientId}`,
          `${Date.now()}-${randomUUID()}.${extension}`,
        ].join("/");

      const validUntil =
        Date.now() +
        VIDEO_UPLOAD_TTL_MS;

      const signedToken =
        await issueSignedToken({
          pathname,

          operations: [
            "put",
          ],

          validUntil,

          allowedContentTypes: [
            contentType,
          ],

          maximumSizeInBytes:
            fileSize,
        });

      const {
        presignedUrl,
      } = await presignUrl(
        signedToken,
        {
          operation: "put",
          pathname,
          access: "private",
          validUntil,

          allowedContentTypes: [
            contentType,
          ],

          maximumSizeInBytes:
            fileSize,

          allowOverwrite: false,
          addRandomSuffix: false,
        }
      );

      return res.json({
        success: true,

        upload: {
          presignedUrl,
          pathname,
          contentType,
          fileSize,
          maximumSizeInBytes:
            VIDEO_REVIEW_MAX_BYTES,
          validUntil,
        },
      });
    } catch (error) {
      console.error(
        "IRONAGE VIDEO REVIEW UPLOAD URL ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create video upload URL",
      });
    }
  }
);


/* =========================================================
   ATHLETE / COACH: PRIVATE VIDEO VIEW URL
   GET /api/video-reviews/:id/view-url
========================================================= */

router.get(
  "/:id/view-url",
  requireAppAuth,
  async (req, res) => {
    try {
      const userId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const reviewId =
        parsePositiveInt(
          req.params.id,
          "videoReviewId"
        );

      const review =
        await prisma.videoReview.findUnique({
          where: {
            id: reviewId,
          },

          select: {
            clientId: true,
            coachId: true,
            videoUrl: true,
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
        review.clientId !== userId &&
        review.coachId !== userId
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You cannot access this video",
        });
      }

      let pathname: string;

      if (
        review.videoUrl.startsWith(
          "ironage-blob:"
        )
      ) {
        pathname =
          review.videoUrl.slice(
            "ironage-blob:".length
          );
      } else {
        const parsed =
          new URL(review.videoUrl);

        const isVercelBlob =
          parsed.hostname.endsWith(
            ".blob.vercel-storage.com"
          );

        if (!isVercelBlob) {
          return res.json({
            success: true,
            viewUrl:
              review.videoUrl,
          });
        }

        pathname =
          decodeURIComponent(
            parsed.pathname.replace(
              /^\/+/,
              ""
            )
          );
      }

      if (!pathname) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid video pathname",
        });
      }

      const validUntil =
        Date.now() +
        VIDEO_UPLOAD_TTL_MS;

      const signedToken =
        await issueSignedToken({
          pathname,

          operations: [
            "get",
          ],

          validUntil,
        });

      const {
        presignedUrl,
      } = await presignUrl(
        signedToken,
        {
          operation: "get",
          pathname,
          access: "private",
          validUntil,
        }
      );

      return res.json({
        success: true,
        viewUrl:
          presignedUrl,
        validUntil,
      });
    } catch (error) {
      console.error(
        "IRONAGE VIDEO REVIEW VIEW URL ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to open video",
      });
    }
  }
);


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
          req.body?.videoUrl,
          clientId
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

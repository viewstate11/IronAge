import { Router } from "express";

import {
  Environment,
} from "@apple/app-store-server-library";

import { prisma } from "../prisma.js";

import {
  verifyAppleProgramTransaction,
} from "../services/applePurchaseVerifier.js";

import {
  requireAppAuth,
  type AppAuthenticatedRequest,
} from "../middleware/appAuthMiddleware.js";

const router = Router();

/* =========================================================
   HELPERS
========================================================= */

function getAppleProgramVerificationConfig(): {
  environment: Environment;
  appAppleId?: number;
} {
  const configuredEnvironment =
    (
      process.env.APPLE_IAP_ENVIRONMENT ??
      "SANDBOX"
    )
      .trim()
      .toUpperCase();

  if (
    configuredEnvironment ===
    "SANDBOX"
  ) {
    return {
      environment:
        Environment.SANDBOX,
    };
  }

  if (
    configuredEnvironment ===
    "PRODUCTION"
  ) {
    const rawAppAppleId =
      process.env.APPLE_APP_ID?.trim();

    const appAppleId =
      rawAppAppleId
        ? Number(rawAppAppleId)
        : NaN;

    if (
      !Number.isSafeInteger(appAppleId) ||
      appAppleId <= 0
    ) {
      throw new Error(
        "APPLE_APP_ID is required for Apple production verification"
      );
    }

    return {
      environment:
        Environment.PRODUCTION,

      appAppleId,
    };
  }

  throw new Error(
    "Invalid APPLE_IAP_ENVIRONMENT"
  );
}

function parsePositiveInt(
  value: unknown,
  fieldName: string
): number {
  const parsed =
    Number(value);

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

/* =========================================================
   GET PUBLISHED PROGRAMS

   GET /api/programs
========================================================= */

router.get(
  "/",
  requireAppAuth,
  async (_req, res) => {
    try {
      const programs =
        await prisma.trainingProgram.findMany({
          where: {
            status:
              "PUBLISHED",

            isPublished:
              true,

            isActive:
              true,

            coach: {
              coachProfile: {
                is: {
                  isVerified:
                    true,

                  isActive:
                    true,
                },
              },
            },
          },

          select: {
            id: true,
            coachId: true,

            name: true,
            description: true,
            durationWeeks: true,

            priceCents: true,
            currency: true,

            publishedAt: true,
            createdAt: true,

            coach: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,

                coachProfile: {
                  select: {
                    displayName:
                      true,

                    specialization:
                      true,

                    photoUrl:
                      true,

                    isVerified:
                      true,
                  },
                },
              },
            },

            _count: {
              select: {
                workouts:
                  true,

                assignments:
                  true,
              },
            },
          },

          orderBy: [
            {
              publishedAt:
                "desc",
            },
            {
              createdAt:
                "desc",
            },
          ],
        });

      return res.json({
        success: true,
        programs,
      });
    } catch (error) {
      console.error(
        "IRONAGE PROGRAM MARKETPLACE LOAD ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load programs",
      });
    }
  }
);

/* =========================================================
   GET PUBLISHED PROGRAM DETAILS

   GET /api/programs/:id
========================================================= */

router.get(
  "/:id",
  requireAppAuth,
  async (req, res) => {
    try {
      const currentUserId =
        (
          req as AppAuthenticatedRequest
        ).appUserId;

      const programId =
        parsePositiveInt(
          req.params.id,
          "programId"
        );

      const program =
        await prisma.trainingProgram.findFirst({
          where: {
            id:
              programId,

            status:
              "PUBLISHED",

            isPublished:
              true,

            isActive:
              true,

            coach: {
              coachProfile: {
                is: {
                  isVerified:
                    true,

                  isActive:
                    true,
                },
              },
            },
          },

          select: {
            id: true,
            coachId: true,

            name: true,
            description: true,
            durationWeeks: true,

            priceCents: true,
            currency: true,
            appleProductId: true,

            publishedAt: true,

            coach: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,

                coachProfile: {
                  select: {
                    displayName:
                      true,

                    specialization:
                      true,

                    photoUrl:
                      true,

                    isVerified:
                      true,
                  },
                },
              },
            },

            _count: {
              select: {
                workouts:
                  true,

                assignments:
                  true,
              },
            },
          },
        });

      if (!program) {
        return res.status(404).json({
          success: false,
          message:
            "Program not found",
        });
      }

      const now =
        new Date();

      const entitlement =
        await prisma.programEntitlement.findFirst({
          where: {
            programId,

            userId:
              currentUserId,

            isActive:
              true,

            startsAt: {
              lte:
                now,
            },

            OR: [
              {
                expiresAt:
                  null,
              },
              {
                expiresAt: {
                  gt:
                    now,
                },
              },
            ],
          },

          select: {
            id: true,
            source: true,
            expiresAt: true,
          },
        });

      return res.json({
        success: true,
        program,

        hasAccess:
          Boolean(entitlement),

        entitlement: entitlement
          ? {
              source:
                entitlement.source,

              expiresAt:
                entitlement.expiresAt,
            }
          : null,
      });
    } catch (error) {
      console.error(
        "IRONAGE PROGRAM MARKETPLACE DETAIL ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Failed to load program",
      });
    }
  }
);


/* =========================================================
   CLAIM FREE PROGRAM
   POST /api/programs/:id/claim

   Only explicitly free published programs can be claimed.

   FREE_CLAIM gives durable access through ProgramEntitlement.
   ProgramAssignment is the currently active self-service
   training instance and therefore has assignedBy = null.
========================================================= */

router.post(
  "/:id/claim",
  requireAppAuth,
  async (req, res) => {
    try {
      const authenticatedRequest =
        req as AppAuthenticatedRequest;

      const userId =
        authenticatedRequest.appUserId;

      const programId =
        Number(req.params.id);

      if (
        !Number.isSafeInteger(programId) ||
        programId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid program id",
        });
      }

      const program =
        await prisma.trainingProgram.findFirst({
          where: {
            id: programId,

            status:
              "PUBLISHED",

            isPublished:
              true,

            isActive:
              true,

            coach: {
              coachProfile: {
                is: {
                  isVerified:
                    true,

                  isActive:
                    true,
                },
              },
            },
          },

          select: {
            id: true,
            coachId: true,
            priceCents: true,
          },
        });

      if (!program) {
        return res.status(404).json({
          success: false,
          message: "Program not found",
        });
      }

      if (program.coachId === userId) {
        return res.status(409).json({
          success: false,
          message:
            "You cannot claim your own program",
        });
      }

      /*
       * IMPORTANT:
       * null means price is not configured.
       * Only explicit 0 is considered FREE.
       */
      if (program.priceCents !== 0) {
        return res.status(409).json({
          success: false,
          message:
            "Program is not available as a free claim",
        });
      }

      const now =
        new Date();

      const result =
        await prisma.$transaction(
          async (tx) => {
            /*
             * Entitlement is durable ownership/access.
             * Do not deactivate previously claimed programs.
             */
            let entitlement =
              await tx.programEntitlement.findFirst({
                where: {
                  programId,
                  userId,

                  source:
                    "FREE_CLAIM",

                  isActive:
                    true,

                  startsAt: {
                    lte:
                      now,
                  },

                  OR: [
                    {
                      expiresAt:
                        null,
                    },
                    {
                      expiresAt: {
                        gt:
                          now,
                      },
                    },
                  ],
                },

                select: {
                  id: true,
                },
              });

            if (!entitlement) {
              entitlement =
                await tx.programEntitlement.create({
                  data: {
                    programId,
                    userId,

                    source:
                      "FREE_CLAIM",

                    isActive:
                      true,

                    startsAt:
                      now,
                  },

                  select: {
                    id: true,
                  },
                });
            }

            /*
             * Check whether this exact self-service
             * assignment is already active.
             */
            let assignment =
              await tx.programAssignment.findFirst({
                where: {
                  programId,

                  clientId:
                    userId,

                  assignedBy:
                    null,

                  isActive:
                    true,
                },

                select: {
                  id: true,
                },
              });

            if (!assignment) {
              /*
               * A user may own and train through
               * multiple programs.
               *
               * Do not deactivate assignments
               * belonging to other programs.
               */
              assignment =
                await tx.programAssignment.create({
                  data: {
                    programId,

                    clientId:
                      userId,

                    assignedBy:
                      null,

                    startDate:
                      now,

                    isActive:
                      true,
                  },

                  select: {
                    id: true,
                  },
                });
            }

            return {
              entitlementId:
                entitlement.id,

              assignmentId:
                assignment.id,
            };
          },
          {
            isolationLevel:
              "Serializable",
          }
        );

      return res.status(201).json({
        success: true,

        hasAccess:
          true,

        entitlement: {
          id:
            result.entitlementId,

          source:
            "FREE_CLAIM",
        },

        assignmentId:
          result.assignmentId,
      });
    } catch (error) {
      console.error(
        "IRONAGE FREE PROGRAM CLAIM ERROR:",
        error
      );

      /*
       * Concurrent/idempotent recovery:
       *
       * A parallel request may have completed the same
       * FREE_CLAIM while this transaction lost a race
       * against a unique index or Serializable conflict.
       *
       * In that case the desired final state already
       * exists, so return success instead of HTTP 500.
       */
      try {
        const authenticatedRequest =
          req as AppAuthenticatedRequest;

        const userId =
          authenticatedRequest.appUserId;

        const programId =
          Number(req.params.id);

        if (
          Number.isSafeInteger(programId) &&
          programId > 0
        ) {
          const now =
            new Date();

          const [
            entitlement,
            assignment,
          ] = await Promise.all([
            prisma.programEntitlement.findFirst({
              where: {
                programId,
                userId,

                source:
                  "FREE_CLAIM",

                isActive:
                  true,

                startsAt: {
                  lte:
                    now,
                },

                OR: [
                  {
                    expiresAt:
                      null,
                  },
                  {
                    expiresAt: {
                      gt:
                        now,
                    },
                  },
                ],
              },

              select: {
                id: true,
              },
            }),

            prisma.programAssignment.findFirst({
              where: {
                programId,

                clientId:
                  userId,

                assignedBy:
                  null,

                isActive:
                  true,
              },

              select: {
                id: true,
              },
            }),
          ]);

          if (
            entitlement &&
            assignment
          ) {
            console.log(
              "IRONAGE FREE PROGRAM CLAIM RECOVERED:",
              {
                userId,
                programId,
                entitlementId:
                  entitlement.id,
                assignmentId:
                  assignment.id,
              }
            );

            return res.status(200).json({
              success: true,

              hasAccess:
                true,

              entitlement: {
                id:
                  entitlement.id,

                source:
                  "FREE_CLAIM",
              },

              assignmentId:
                assignment.id,

              recovered:
                true,
            });
          }
        }
      } catch (recoveryError) {
        console.error(
          "IRONAGE FREE PROGRAM CLAIM RECOVERY ERROR:",
          recoveryError
        );
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to claim free program",
      });
    }
  }
);

/* =========================================================
   PURCHASE PROGRAM WITH APPLE
   POST /api/programs/:id/purchase/apple

   Client sends Apple signed transaction only.

   Authorization source of truth:
   - program ID comes from URL
   - product ID comes from TrainingProgram.appleProductId
   - Apple signed transaction must match that product ID

   Successful verification creates:
   1. ProgramPurchase
   2. PURCHASE ProgramEntitlement
   3. self-service ProgramAssignment
========================================================= */

router.post(
  "/:id/purchase/apple",
  requireAppAuth,
  async (req, res) => {
    try {
      const authenticatedRequest =
        req as AppAuthenticatedRequest;

      const userId =
        authenticatedRequest.appUserId;

      const programId =
        parsePositiveInt(
          req.params.id,
          "programId"
        );

      const {
        signedTransaction,
      } = req.body ?? {};

      if (
        typeof signedTransaction !==
          "string" ||
        signedTransaction.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Apple signed transaction is required",
        });
      }

      /*
       * Only a real published paid program
       * with a configured Apple product can
       * be purchased.
       */
      const program =
        await prisma.trainingProgram.findFirst({
          where: {
            id:
              programId,

            status:
              "PUBLISHED",

            isPublished:
              true,

            isActive:
              true,

            coach: {
              coachProfile: {
                is: {
                  isVerified:
                    true,

                  isActive:
                    true,
                },
              },
            },
          },

          select: {
            id: true,
            coachId: true,

            priceCents: true,
            currency: true,

            appleProductId:
              true,
          },
        });

      if (!program) {
        return res.status(404).json({
          success: false,
          message:
            "Program not found",
        });
      }

      if (
        program.coachId ===
        userId
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You cannot purchase your own program",
        });
      }

      if (
        program.priceCents === null ||
        program.priceCents <= 0
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Program is not configured as a paid program",
        });
      }

      if (
        !program.appleProductId
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Apple purchase is not configured for this program",
        });
      }

      /*
       * Verify Apple cryptographic evidence
       * before touching purchase state.
       */
      const verified =
        await verifyAppleProgramTransaction(
          signedTransaction,
          getAppleProgramVerificationConfig()
        );

      /*
       * Never trust a product ID supplied
       * by the client.
       *
       * The verified Apple transaction must
       * match the product configured in DB.
       */
      if (
        verified.productId !==
        program.appleProductId
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Apple product does not match this program",
        });
      }

      const now =
        new Date();

      const result =
        await prisma.$transaction(
          async (tx) => {
            /*
             * A StoreKit transaction can belong
             * to exactly one IRONAGE account.
             */
            const existingPurchase =
              await tx.programPurchase.findUnique({
                where: {
                  transactionId:
                    verified.transactionId,
                },

                select: {
                  id: true,
                  userId: true,
                  programId: true,
                },
              });

            if (
              existingPurchase &&
              existingPurchase.userId !==
                userId
            ) {
              throw new Error(
                "PURCHASE_BELONGS_TO_ANOTHER_ACCOUNT"
              );
            }

            if (
              existingPurchase &&
              existingPurchase.programId !==
                programId
            ) {
              throw new Error(
                "PURCHASE_BELONGS_TO_ANOTHER_PROGRAM"
              );
            }

            let purchase =
              existingPurchase;

            if (!purchase) {
              purchase =
                await tx.programPurchase.create({
                  data: {
                    programId,
                    userId,

                    provider:
                      "APPLE",

                    platform:
                      "IOS",

                    productId:
                      verified.productId,

                    transactionId:
                      verified.transactionId,

                    originalTransactionId:
                      verified.originalTransactionId,

                    amountCents:
                      program.priceCents,

                    currency:
                      program.currency,

                    purchasedAt:
                      verified.purchasedAt,

                    verifiedAt:
                      now,
                  },

                  select: {
                    id: true,
                    userId: true,
                    programId: true,
                  },
                });
            }

            /*
             * Durable ownership entitlement.
             *
             * PURCHASE does not expire for an
             * Apple NON_CONSUMABLE product.
             */
            let entitlement =
              await tx.programEntitlement.findFirst({
                where: {
                  programId,
                  userId,

                  source:
                    "PURCHASE",

                  isActive:
                    true,
                },

                select: {
                  id: true,
                },
              });

            if (!entitlement) {
              entitlement =
                await tx.programEntitlement.create({
                  data: {
                    programId,
                    userId,

                    source:
                      "PURCHASE",

                    isActive:
                      true,

                    startsAt:
                      verified.purchasedAt,

                    expiresAt:
                      null,
                  },

                  select: {
                    id: true,
                  },
                });
            }

            /*
             * Execution/training instance.
             *
             * Multiple self-service programs
             * may coexist. Reuse an existing
             * assignment for this exact program.
             */
            let assignment =
              await tx.programAssignment.findFirst({
                where: {
                  programId,

                  clientId:
                    userId,

                  assignedBy:
                    null,

                  isActive:
                    true,
                },

                select: {
                  id: true,
                },
              });

            if (!assignment) {
              assignment =
                await tx.programAssignment.create({
                  data: {
                    programId,

                    clientId:
                      userId,

                    assignedBy:
                      null,

                    startDate:
                      now,

                    isActive:
                      true,
                  },

                  select: {
                    id: true,
                  },
                });
            }

            return {
              purchaseId:
                purchase.id,

              entitlementId:
                entitlement.id,

              assignmentId:
                assignment.id,
            };
          },
          {
            isolationLevel:
              "Serializable",
          }
        );

      return res.status(201).json({
        success: true,

        hasAccess:
          true,

        purchase: {
          id:
            result.purchaseId,

          provider:
            "APPLE",

          productId:
            verified.productId,

          transactionId:
            verified.transactionId,
        },

        entitlement: {
          id:
            result.entitlementId,

          source:
            "PURCHASE",
        },

        assignmentId:
          result.assignmentId,
      });
    } catch (error) {
      console.error(
        "IRONAGE APPLE PROGRAM PURCHASE ERROR:",
        error
      );

      if (
        error instanceof Error &&
        error.message ===
          "PURCHASE_BELONGS_TO_ANOTHER_ACCOUNT"
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Purchase belongs to another account",
        });
      }

      if (
        error instanceof Error &&
        error.message ===
          "PURCHASE_BELONGS_TO_ANOTHER_PROGRAM"
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Purchase belongs to another program",
        });
      }

      return res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Apple program purchase verification failed",
      });
    }
  }
);

export default router;

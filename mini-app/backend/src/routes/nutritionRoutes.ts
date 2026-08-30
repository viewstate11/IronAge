import { Router } from "express";

import { prisma } from "../prisma.js";

import {
  requireAppAuth,
  type AppAuthenticatedRequest,
} from "../middleware/appAuthMiddleware.js";

const router = Router();

/* =========================================================
   TYPES / HELPERS
========================================================= */

const MEAL_TYPES = [
  "BREAKFAST",
  "LUNCH",
  "DINNER",
  "SNACK",
] as const;

type MealType =
  (typeof MEAL_TYPES)[number];

function isMealType(
  value: unknown
): value is MealType {
  return (
    typeof value === "string" &&
    MEAL_TYPES.includes(
      value as MealType
    )
  );
}

function parseFiniteNumber(
  value: unknown,
  fieldName: string
): number {
  const parsed =
    Number(value);

  if (
    !Number.isFinite(parsed)
  ) {
    throw new Error(
      `${fieldName} must be a valid number`
    );
  }

  return parsed;
}

function parsePositiveNumber(
  value: unknown,
  fieldName: string
): number {
  const parsed =
    parseFiniteNumber(
      value,
      fieldName
    );

  if (parsed <= 0) {
    throw new Error(
      `${fieldName} must be greater than 0`
    );
  }

  return parsed;
}

/* =========================================================
   DATE
========================================================= */

function parseDate(
  value: unknown
): Date {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {
    throw new Error(
      "Date must use YYYY-MM-DD format"
    );
  }

  const date =
    new Date(
      `${value}T00:00:00.000Z`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    throw new Error(
      "Invalid date"
    );
  }

  /*
   * Validate impossible dates such as:
   * 2026-02-31
   */
  const [
    year,
    month,
    day,
  ] = value
    .split("-")
    .map(Number);

  if (
    date.getUTCFullYear() !==
      year ||
    date.getUTCMonth() + 1 !==
      month ||
    date.getUTCDate() !==
      day
  ) {
    throw new Error(
      "Invalid date"
    );
  }

  return date;
}

function getTodayDate(): Date {
  const now =
    new Date();

  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    )
  );
}

/* =========================================================
   AUTHENTICATED USER
========================================================= */

function getCurrentUserId(
  req: AppAuthenticatedRequest
): number {
  const userId =
    req.appUserId;

  if (
    !userId ||
    !Number.isInteger(
      userId
    ) ||
    userId <= 0
  ) {
    throw new Error(
      "Authenticated user not found"
    );
  }

  return userId;
}

/* =========================================================
   GET TODAY
   GET /api/nutrition/today
========================================================= */

router.get(
  "/today",
  requireAppAuth,
  async (req, res) => {
    try {
      const userId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const date =
        getTodayDate();

      let nutritionDay =
        await prisma.nutritionDay.findUnique(
          {
            where: {
              userId_date: {
                userId,
                date,
              },
            },

            include: {
              meals: {
                orderBy: {
                  createdAt:
                    "asc",
                },
              },
            },
          }
        );

      /*
       * Create today's nutrition
       * record automatically.
       */

      if (!nutritionDay) {
        nutritionDay =
          await prisma.nutritionDay.create(
            {
              data: {
                userId,
                date,
                water: 0,
              },

              include: {
                meals: {
                  orderBy: {
                    createdAt:
                      "asc",
                  },
                },
              },
            }
          );
      }

      return res.json({
        success: true,
        nutrition:
          nutritionDay,
      });
    } catch (error) {
      console.error(
        "IRONAGE GET TODAY NUTRITION ERROR:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to load nutrition";

      return res
        .status(
          message.includes(
            "Authenticated user"
          )
            ? 401
            : 500
        )
        .json({
          success: false,
          message,
        });
    }
  }
);

/* =========================================================
   GET NUTRITION BY DATE
   GET /api/nutrition?date=YYYY-MM-DD
========================================================= */

router.get(
  "/",
  requireAppAuth,
  async (req, res) => {
    try {
      const userId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const date =
        req.query.date
          ? parseDate(
              req.query.date
            )
          : getTodayDate();

      const nutritionDay =
        await prisma.nutritionDay.findUnique(
          {
            where: {
              userId_date: {
                userId,
                date,
              },
            },

            include: {
              meals: {
                orderBy: {
                  createdAt:
                    "asc",
                },
              },
            },
          }
        );

      /*
       * Do not create empty records
       * for historical dates.
       */

      if (!nutritionDay) {
        return res.json({
          success: true,

          nutrition: {
            id: null,

            userId,

            date,

            water: 0,

            meals: [],
          },
        });
      }

      return res.json({
        success: true,

        nutrition:
          nutritionDay,
      });
    } catch (error) {
      console.error(
        "IRONAGE GET NUTRITION ERROR:",
        error
      );

      return res
        .status(400)
        .json({
          success: false,

          message:
            error instanceof Error
              ? error.message
              : "Failed to load nutrition",
        });
    }
  }
);

/* =========================================================
   ADD MEAL
   POST /api/nutrition/meal
========================================================= */

router.post(
  "/meal",
  requireAppAuth,
  async (req, res) => {
    try {
      const userId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const {
        date,
        name,
        meal,
        calories,
        protein,
        fat,
        carbs,
        amount,
        unit,
      } =
        req.body ?? {};

      /* -----------------------------------------------------
         NAME
      ----------------------------------------------------- */

      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Meal name is required",
          });
      }

      /* -----------------------------------------------------
         MEAL TYPE
      ----------------------------------------------------- */

      if (
        !isMealType(meal)
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid meal type",
          });
      }

      /* -----------------------------------------------------
         DATE
      ----------------------------------------------------- */

      const nutritionDate =
        date
          ? parseDate(date)
          : getTodayDate();

      /* -----------------------------------------------------
         NUTRITION VALUES
      ----------------------------------------------------- */

      const caloriesValue =
        calories === undefined
          ? 0
          : parseFiniteNumber(
              calories,
              "calories"
            );

      const proteinValue =
        protein === undefined
          ? 0
          : parseFiniteNumber(
              protein,
              "protein"
            );

      const fatValue =
        fat === undefined
          ? 0
          : parseFiniteNumber(
              fat,
              "fat"
            );

      const carbsValue =
        carbs === undefined
          ? 0
          : parseFiniteNumber(
              carbs,
              "carbs"
            );

      if (
        caloriesValue < 0 ||
        proteinValue < 0 ||
        fatValue < 0 ||
        carbsValue < 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Nutrition values cannot be negative",
          });
      }

      /* -----------------------------------------------------
         AMOUNT
      ----------------------------------------------------- */

      const amountValue =
        amount === undefined ||
        amount === null ||
        amount === ""
          ? null
          : parsePositiveNumber(
              amount,
              "amount"
            );

      /* -----------------------------------------------------
         NUTRITION DAY
      ----------------------------------------------------- */

      const nutritionDay =
        await prisma.nutritionDay.upsert(
          {
            where: {
              userId_date: {
                userId,
                date:
                  nutritionDate,
              },
            },

            create: {
              userId,

              date:
                nutritionDate,

              water: 0,
            },

            update: {},
          }
        );

      /* -----------------------------------------------------
         CREATE FOOD
      ----------------------------------------------------- */

      const food =
        await prisma.foodEntry.create(
          {
            data: {
              nutritionDayId:
                nutritionDay.id,

              name:
                name.trim(),

              meal,

              calories:
                caloriesValue,

              protein:
                proteinValue,

              fat:
                fatValue,

              carbs:
                carbsValue,

              amount:
                amountValue,

              unit:
                typeof unit ===
                  "string" &&
                unit.trim()
                  ? unit.trim()
                  : null,
            },
          }
        );

      return res
        .status(201)
        .json({
          success: true,

          meal: food,
        });
    } catch (error) {
      console.error(
        "IRONAGE ADD MEAL ERROR:",
        error
      );

      return res
        .status(400)
        .json({
          success: false,

          message:
            error instanceof Error
              ? error.message
              : "Failed to add meal",
        });
    }
  }
);

/* =========================================================
   DELETE MEAL
   DELETE /api/nutrition/meal/:id
========================================================= */

router.delete(
  "/meal/:id",
  requireAppAuth,
  async (req, res) => {
    try {
      const userId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const mealId =
        Number(
          req.params.id
        );

      if (
        !Number.isInteger(
          mealId
        ) ||
        mealId <= 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid meal id",
          });
      }

      /*
       * IMPORTANT:
       * Verify ownership before deleting.
       */

      const meal =
        await prisma.foodEntry.findFirst(
          {
            where: {
              id: mealId,

              nutritionDay: {
                userId,
              },
            },

            select: {
              id: true,
            },
          }
        );

      if (!meal) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Meal not found",
          });
      }

      await prisma.foodEntry.delete(
        {
          where: {
            id: mealId,
          },
        }
      );

      return res.json({
        success: true,

        message:
          "Meal deleted",
      });
    } catch (error) {
      console.error(
        "IRONAGE DELETE MEAL ERROR:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to delete meal",
        });
    }
  }
);

/* =========================================================
   UPDATE WATER
   PATCH /api/nutrition/water
========================================================= */

router.patch(
  "/water",
  requireAppAuth,
  async (req, res) => {
    try {
      const userId =
        getCurrentUserId(
          req as AppAuthenticatedRequest
        );

      const {
        date,
        water,
      } =
        req.body ?? {};

      /* -----------------------------------------------------
         WATER VALUE
      ----------------------------------------------------- */

      const waterValue =
        parseFiniteNumber(
          water,
          "water"
        );

      if (
        !Number.isInteger(
          waterValue
        ) ||
        waterValue < 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Water must be a non-negative integer",
          });
      }

      /* -----------------------------------------------------
         DATE
      ----------------------------------------------------- */

      const nutritionDate =
        date
          ? parseDate(date)
          : getTodayDate();

      /* -----------------------------------------------------
         UPSERT DAY
      ----------------------------------------------------- */

      const nutritionDay =
        await prisma.nutritionDay.upsert(
          {
            where: {
              userId_date: {
                userId,
                date:
                  nutritionDate,
              },
            },

            create: {
              userId,

              date:
                nutritionDate,

              water:
                waterValue,
            },

            update: {
              water:
                waterValue,
            },

            include: {
              meals: {
                orderBy: {
                  createdAt:
                    "asc",
                },
              },
            },
          }
        );

      return res.json({
        success: true,

        nutrition:
          nutritionDay,
      });
    } catch (error) {
      console.error(
        "IRONAGE UPDATE WATER ERROR:",
        error
      );

      return res
        .status(400)
        .json({
          success: false,

          message:
            error instanceof Error
              ? error.message
              : "Failed to update water",
        });
    }
  }
);

/* =========================================================
   EXPORT
========================================================= */

export default router;
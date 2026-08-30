import { Router } from "express";

import { prisma } from "../prisma.js";

import {
  requireAppAuth,
} from "../middleware/appAuthMiddleware.js";

const router = Router();

router.get(
  "/",
  requireAppAuth,
  async (req, res) => {
    try {
      const exercises =
        await prisma.exercise.findMany({
          where: {
            isActive: true,
          },

          orderBy: [
            {
              muscleGroup: "asc",
            },
            {
              name: "asc",
            },
          ],

          select: {
            id: true,
            slug: true,
            name: true,
            description: true,
            instructions: true,
            muscleGroup: true,
            equipment: true,
            demoVideoUrl: true,
            thumbnailUrl: true,
          },
        });

      return res.json({
        success: true,
        exercises,
      });
    } catch (error) {
      console.error(
        "IRONAGE EXERCISES LOAD ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load exercises",
      });
    }
  }
);

router.get(
  "/:id",
  requireAppAuth,
  async (req, res) => {
    try {
      const id =
        Number(req.params.id);

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid exercise ID",
        });
      }

      const exercise =
        await prisma.exercise.findFirst({
          where: {
            id,
            isActive: true,
          },
        });

      if (!exercise) {
        return res.status(404).json({
          success: false,
          message:
            "Exercise not found",
        });
      }

      return res.json({
        success: true,
        exercise,
      });
    } catch (error) {
      console.error(
        "IRONAGE EXERCISE LOAD ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load exercise",
      });
    }
  }
);

export default router;

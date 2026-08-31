import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import premiumRoutes from "./routes/premiumRoutes.js";
import nutritionRoutes from "./routes/nutritionRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import coachRoutes from "./routes/coachRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import coachWorkoutRoutes from "./routes/coachWorkoutRoutes.js";
import coachProgramRoutes from "./routes/coachProgramRoutes.js";
import coachInviteRoutes from "./routes/coachInviteRoutes.js";
import myProgramRoutes from "./routes/myProgramRoutes.js";

const app = express();

/* =========================================================
   CORS
========================================================= */

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/* =========================================================
   BODY
========================================================= */

app.use(express.json());

/* =========================================================
   HEALTH
========================================================= */

app.get("/", (_req, res) => {
  res.json({
    message: "IRONAGE API ONLINE ⚔️",
    status: "running",
  });
});

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    status: "healthy",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    status: "healthy",
  });
});

/* =========================================================
   API ROUTES
========================================================= */

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/workouts", workoutRoutes);

app.use("/api/progress", progressRoutes);

app.use("/api/nutrition", nutritionRoutes);

app.use("/api/premium", premiumRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/coaches", coachRoutes);

app.use("/api/exercises", exerciseRoutes);

app.use("/api/coach-workouts", coachWorkoutRoutes);

app.use("/api/coach-programs", coachProgramRoutes);

app.use("/api/coach-invites", coachInviteRoutes);

app.use("/api/my-programs", myProgramRoutes);

/* =========================================================
   API 404
========================================================= */

app.use("/api", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(
      "❌ IRONAGE API ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }
);

export default app;
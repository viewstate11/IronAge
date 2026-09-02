import api, {
  telegramAuthOptions,
} from "./client";

/* =========================================================
   TYPES
========================================================= */

export type WorkoutSetPayload = {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  repetitions?: number | null;
  weight?: number | null;
  duration?: number | null;
  completed?: boolean;
};

export type CreateWorkoutPayload = {
  /*
   * Kept for frontend compatibility.
   *
   * IMPORTANT:
   * Backend does NOT trust userId.
   * Identity comes from App Authentication.
   */
  userId?: number | null;

  /*
   * Telegram initData is still accepted when
   * the app is opened inside Telegram.
   */
  initData?: string | null;

  workoutId: string;
  workoutName: string;

  duration?: number;
  xp?: number;

  status?:
    | "COMPLETED"
    | "CANCELED";

  startedAt?: string | null;
  completedAt?: string | null;

  assignmentId?: number;
  programWorkoutId?: number;

  sets?: WorkoutSetPayload[];
};

export type WorkoutSet = {
  id: number;

  workoutId: number;

  exerciseId: string;

  exerciseName: string;

  setNumber: number;

  repetitions: number | null;

  weight: number | null;

  duration: number | null;

  completed: boolean;

  createdAt: string;
};

export type WorkoutSession = {
  id: number;

  userId: number;

  workoutId: string;

  workoutName: string;

  duration: number;

  xp: number;

  status:
    | "COMPLETED"
    | "CANCELED";

  startedAt: string | null;

  completedAt: string | null;

  createdAt: string;

  updatedAt?: string;

  sets: WorkoutSet[];
};

/* =========================================================
   NORMALIZE SETS
========================================================= */

function normalizeSets(
  sets?: WorkoutSetPayload[]
): WorkoutSetPayload[] {
  if (!Array.isArray(sets)) {
    return [];
  }

  return sets.map(
    (
      set,
      index
    ) => {
      const setNumber =
        Number(
          set.setNumber
        );

      const repetitions =
        set.repetitions !==
          undefined &&
        set.repetitions !==
          null
          ? Number(
              set.repetitions
            )
          : null;

      const weight =
        set.weight !==
          undefined &&
        set.weight !==
          null
          ? Number(
              set.weight
            )
          : null;

      const duration =
        set.duration !==
          undefined &&
        set.duration !==
          null
          ? Number(
              set.duration
            )
          : null;

      return {
        exerciseId:
          String(
            set.exerciseId ??
              `exercise-${index + 1}`
          ),

        exerciseName:
          String(
            set.exerciseName ??
              "Exercise"
          ),

        setNumber:
          Number.isFinite(
            setNumber
          )
            ? Math.max(
                1,
                Math.round(
                  setNumber
                )
              )
            : index + 1,

        repetitions:
          repetitions !== null &&
          Number.isFinite(
            repetitions
          )
            ? Math.max(
                0,
                Math.round(
                  repetitions
                )
              )
            : null,

        weight:
          weight !== null &&
          Number.isFinite(
            weight
          )
            ? Math.max(
                0,
                weight
              )
            : null,

        duration:
          duration !== null &&
          Number.isFinite(
            duration
          )
            ? Math.max(
                0,
                Math.round(
                  duration
                )
              )
            : null,

        completed:
          Boolean(
            set.completed
          ),
      };
    }
  );
}

/* =========================================================
   CREATE WORKOUT
   POST /api/workouts
========================================================= */

export async function createWorkout(
  payload: CreateWorkoutPayload
): Promise<WorkoutSession> {
  /* =======================================================
     VALIDATE WORKOUT ID
  ======================================================= */

  const workoutId =
    String(
      payload.workoutId ??
        ""
    ).trim();

  if (!workoutId) {
    throw new Error(
      "Workout ID is required"
    );
  }

  /* =======================================================
     VALIDATE WORKOUT NAME
  ======================================================= */

  const workoutName =
    String(
      payload.workoutName ??
        ""
    ).trim();

  if (!workoutName) {
    throw new Error(
      "Workout name is required"
    );
  }

  /* =======================================================
     NORMALIZE DURATION
  ======================================================= */

  const rawDuration =
    Number(
      payload.duration ??
        0
    );

  const duration =
    Number.isFinite(
      rawDuration
    )
      ? Math.max(
          0,
          Math.round(
            rawDuration
          )
        )
      : 0;

  /* =======================================================
     NORMALIZE XP
  ======================================================= */

  const rawXp =
    Number(
      payload.xp ??
        0
    );

  const xp =
    Number.isFinite(
      rawXp
    )
      ? Math.max(
          0,
          Math.round(
            rawXp
          )
        )
      : 0;

  /* =======================================================
     STATUS
  ======================================================= */

  const status =
    payload.status ===
    "CANCELED"
      ? "CANCELED"
      : "COMPLETED";

  /* =======================================================
     SETS
  ======================================================= */

  const sets =
    normalizeSets(
      payload.sets
    );

  /* =======================================================
     DATES
  ======================================================= */

  const startedAt =
    payload.startedAt ??
    null;

  const completedAt =
    payload.completedAt ??
    (
      status ===
      "COMPLETED"
        ? new Date().toISOString()
        : null
    );

  /* =======================================================
     REQUEST BODY
  ======================================================= */

  const body = {
    workoutId,

    workoutName,

    duration,

    xp,

    status,

    startedAt,

    completedAt,

    assignmentId:
      payload.assignmentId,

    programWorkoutId:
      payload.programWorkoutId,

    sets,
  };

  /* =======================================================
     APP AUTH
     
     IMPORTANT:
     
     This supports BOTH:
     
     1. Telegram
        x-telegram-init-data
     
     2. Web
        HttpOnly session cookie
     
     Backend decides the authenticated identity.
  ======================================================= */

  const data =
    await api.post<{
      success: boolean;

      workout:
        WorkoutSession;

      user?: {
        id: number;

        xp: number;

        level: number;

        streak: number;

        workouts: number;
      };
    }>(
      "/workouts",
      body,
      telegramAuthOptions()
    );

  /* =======================================================
     VALIDATE RESPONSE
  ======================================================= */

  if (
    !data ||
    !data.success
  ) {
    throw new Error(
      "Workout API request failed"
    );
  }

  if (
    !data.workout
  ) {
    throw new Error(
      "API did not return workout"
    );
  }

  return data.workout;
}

/* =========================================================
   GET CURRENT USER WORKOUTS
   GET /api/workouts
========================================================= */

export async function getUserWorkouts(
  _userId?: number
): Promise<WorkoutSession[]> {
  const data =
    await api.get<{
      success: boolean;

      workouts:
        WorkoutSession[];
    }>(
      "/workouts",
      telegramAuthOptions()
    );

  if (
    !data ||
    !data.success
  ) {
    throw new Error(
      "Failed to load workouts"
    );
  }

  const workouts =
    Array.isArray(
      data.workouts
    )
      ? data.workouts
      : [];

  return workouts;
}

/* =========================================================
   GET SINGLE WORKOUT
   GET /api/workouts/session/:id
========================================================= */

export async function getWorkout(
  workoutSessionId: number
): Promise<WorkoutSession> {
  if (
    !Number.isInteger(
      workoutSessionId
    ) ||
    workoutSessionId <= 0
  ) {
    throw new Error(
      "Workout session ID is required"
    );
  }

  const data =
    await api.get<{
      success: boolean;

      workout:
        WorkoutSession;
    }>(
      `/workouts/session/${workoutSessionId}`,
      telegramAuthOptions()
    );

  if (
    !data ||
    !data.success ||
    !data.workout
  ) {
    throw new Error(
      "Workout not found"
    );
  }

  return data.workout;
}

/* =========================================================
   GET WORKOUTS BY USER ID
   LEGACY COMPATIBILITY
========================================================= */

export async function getWorkoutsByUser(
  userId: number
): Promise<WorkoutSession[]> {
  if (
    !Number.isInteger(
      userId
    ) ||
    userId <= 0
  ) {
    throw new Error(
      "User ID is required"
    );
  }

  const data =
    await api.get<{
      success: boolean;

      workouts:
        WorkoutSession[];
    }>(
      `/workouts/user/${userId}`,
      telegramAuthOptions()
    );

  if (
    !data ||
    !data.success
  ) {
    throw new Error(
      "Failed to load user workouts"
    );
  }

  return Array.isArray(
    data.workouts
  )
    ? data.workouts
    : [];
}

/* =========================================================
   API
========================================================= */

export const workoutsApi = {
  createWorkout,

  getUserWorkouts,

  getWorkout,

  getWorkoutsByUser,
};

export default workoutsApi;
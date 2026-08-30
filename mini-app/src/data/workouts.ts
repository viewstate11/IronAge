/* =========================================================
   IRONAGE — WORKOUT API
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "/api";

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
  userId: number;
  workoutId: string;
  workoutName: string;
  duration?: number;
  xp?: number;
  status?: "COMPLETED" | "CANCELED";
  startedAt?: string | null;
  completedAt?: string | null;
  sets?: WorkoutSetPayload[];
};

export type WorkoutSet = {
  id: number;
  sessionId: number;
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
  status: "COMPLETED" | "CANCELED";
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  sets: WorkoutSet[];
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  error?: string;
  [key: string]: unknown;
} & T;

/* =========================================================
   REQUEST
========================================================= */

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    }
  );

  let data: ApiResponse<T>;

  try {
    data =
      (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error(
      `API returned invalid JSON (${response.status})`
    );
  }

  if (
    !response.ok ||
    !data.success
  ) {
    throw new Error(
      data.message ||
        data.error ||
        `API error ${response.status}`
    );
  }

  return data;
}

/* =========================================================
   CREATE WORKOUT
========================================================= */

export async function createWorkout(
  payload: CreateWorkoutPayload
): Promise<WorkoutSession> {
  if (!payload.userId) {
    throw new Error(
      "User ID is required"
    );
  }

  if (!payload.workoutId) {
    throw new Error(
      "Workout ID is required"
    );
  }

  if (!payload.workoutName) {
    throw new Error(
      "Workout name is required"
    );
  }

  const data =
    await request<{
      workout: WorkoutSession;
    }>(
      "/api/workouts",
      {
        method: "POST",

        body:
          JSON.stringify({
            ...payload,

            userId:
              Number(
                payload.userId
              ),

            workoutId:
              String(
                payload.workoutId
              ),

            workoutName:
              String(
                payload.workoutName
              ),

            duration:
              Number(
                payload.duration ?? 0
              ),

            xp:
              Number(
                payload.xp ?? 0
              ),

            status:
              payload.status ??
              "COMPLETED",

            startedAt:
              payload.startedAt ??
              null,

            completedAt:
              payload.completedAt ??
              new Date().toISOString(),

            sets:
              Array.isArray(
                payload.sets
              )
                ? payload.sets
                : [],
          }),
      }
    );

  if (!data.workout) {
    throw new Error(
      "API did not return workout"
    );
  }

  return data.workout;
}

/* =========================================================
   GET USER WORKOUTS
========================================================= */

export async function getUserWorkouts(
  userId: number
): Promise<WorkoutSession[]> {
  if (!userId) {
    throw new Error(
      "User ID is required"
    );
  }

  const data =
    await request<{
      workouts: WorkoutSession[];
    }>(
      `/api/workouts/${userId}`
    );

  return Array.isArray(
    data.workouts
  )
    ? data.workouts
    : [];
}

/* =========================================================
   GET SINGLE WORKOUT
========================================================= */

export async function getWorkout(
  workoutSessionId: number
): Promise<WorkoutSession> {
  if (!workoutSessionId) {
    throw new Error(
      "Workout session ID is required"
    );
  }

  const data =
    await request<{
      workout: WorkoutSession;
    }>(
      `/api/workouts/session/${workoutSessionId}`
    );

  if (!data.workout) {
    throw new Error(
      "Workout not found"
    );
  }

  return data.workout;
}

/* =========================================================
   DEFAULT API
========================================================= */

export const workoutsApi = {
  createWorkout,
  getUserWorkouts,
  getWorkout,
};
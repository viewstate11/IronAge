
/* =========================================================
   IRONAGE WORKOUT TYPES
========================================================= */

export type WorkoutSetResult = {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;

  repetitions: number | null;
  weight: number | null;
  duration: number | null;

  completed: boolean;
};

/* =========================================================
   WORKOUT SESSION RESULT
========================================================= */

export type WorkoutSessionResult = {
  workoutId: string;
  workoutTitle: string;

  durationSeconds: number;

  exercisesCompleted: number;
  setsCompleted: number;

  xp: number;

  startedAt: string;
  completedAt: string;

  sets: WorkoutSetResult[];

  assignmentId?: number;
  programWorkoutId?: number;
};

/* =========================================================
   WORKOUT EXERCISE
========================================================= */

export type WorkoutExercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
};

/* =========================================================
   WORKOUT PROGRAM
========================================================= */

export type WorkoutProgram = {
  id: string;
  title: string;
  description?: string;

  exercises: WorkoutExercise[];

  assignmentId?: number;
  programWorkoutId?: number;
};

/* =========================================================
   WORKOUT CATEGORY
========================================================= */

export type WorkoutCategory =
  | "upper"
  | "lower"
  | "full";

/* =========================================================
   WORKOUT SUMMARY
========================================================= */

export type WorkoutSummary = {
  workoutId: string;
  title: string;

  exercisesCount: number;
  totalSets: number;

  estimatedDurationMinutes?: number;
};
import type {
  WorkoutProgram,
} from "../types/workout";

/* =========================================================
   IRONAGE WORKOUT PROGRAMS
========================================================= */

export const workoutPrograms: WorkoutProgram[] = [
  {
    id: "upper",
    title: "UPPER BODY",

    exercises: [
      {
        id: "push-ups",
        name: "PUSH UPS",
        sets: 4,
        reps: "15",
      },
      {
        id: "diamond-push-ups",
        name: "DIAMOND PUSH UPS",
        sets: 3,
        reps: "12",
      },
      {
        id: "dips",
        name: "DIPS",
        sets: 3,
        reps: "10",
      },
      {
        id: "pike-push-ups",
        name: "PIKE PUSH UPS",
        sets: 3,
        reps: "12",
      },
    ],
  },

  {
    id: "lower",
    title: "LOWER BODY",

    exercises: [
      {
        id: "squats",
        name: "SQUATS",
        sets: 4,
        reps: "15",
      },
      {
        id: "lunges",
        name: "LUNGES",
        sets: 3,
        reps: "12 / LEG",
      },
      {
        id: "glute-bridge",
        name: "GLUTE BRIDGE",
        sets: 3,
        reps: "15",
      },
      {
        id: "calf-raises",
        name: "CALF RAISES",
        sets: 4,
        reps: "20",
      },
    ],
  },

  {
    id: "full",
    title: "FULL BODY",

    exercises: [
      {
        id: "burpees",
        name: "BURPEES",
        sets: 3,
        reps: "12",
      },
      {
        id: "push-ups",
        name: "PUSH UPS",
        sets: 3,
        reps: "15",
      },
      {
        id: "squats",
        name: "SQUATS",
        sets: 3,
        reps: "20",
      },
      {
        id: "mountain-climbers",
        name: "MOUNTAIN CLIMBERS",
        sets: 3,
        reps: "30",
      },
    ],
  },
];

/* =========================================================
   GET WORKOUT
========================================================= */

export function getWorkoutProgram(
  workoutId: string
): WorkoutProgram {
  return (
    workoutPrograms.find(
      (workout) =>
        workout.id === workoutId
    ) ??
    workoutPrograms[0]
  );
}
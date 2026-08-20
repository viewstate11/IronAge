import type { WorkoutProgram } from "../types/workout";

export const workoutPrograms: Record<string, WorkoutProgram> = {
  upper: {
    id: "upper",
    name: "Верх тіла",
    duration: 20,
    exercises: [
      {
        name: "Віджимання",
        emoji: "💪",
        sets: 4,
        reps: 15,
      },
      {
        name: "Підтягування",
        emoji: "🏋️",
        sets: 4,
        reps: 10,
      },
      {
        name: "Бруси",
        emoji: "🔥",
        sets: 4,
        reps: 12,
      },
      {
        name: "Планка",
        emoji: "🧱",
        sets: 3,
        reps: 60,
      },
    ],
  },

  legs: {
    id: "legs",
    name: "Ноги",
    duration: 25,
    exercises: [
      {
        name: "Присідання",
        emoji: "🦵",
        sets: 4,
        reps: 15,
      },
      {
        name: "Випади",
        emoji: "🔥",
        sets: 3,
        reps: 12,
      },
      {
        name: "Ягодичний місток",
        emoji: "🍑",
        sets: 3,
        reps: 15,
      },
      {
        name: "Підйоми на носки",
        emoji: "⚡",
        sets: 3,
        reps: 20,
      },
    ],
  },

  abs: {
    id: "abs",
    name: "Прес",
    duration: 12,
    exercises: [
      {
        name: "Скручування",
        emoji: "💥",
        sets: 3,
        reps: 15,
      },
      {
        name: "Підйом ніг",
        emoji: "🔥",
        sets: 3,
        reps: 12,
      },
      {
        name: "Планка",
        emoji: "🧱",
        sets: 3,
        reps: 45,
      },
      {
        name: "Велосипед",
        emoji: "🚴",
        sets: 3,
        reps: 20,
      },
    ],
  },

  cardio: {
    id: "cardio",
    name: "Кардіо",
    duration: 15,
    exercises: [
      {
        name: "Jumping Jacks",
        emoji: "🏃",
        sets: 3,
        reps: 30,
      },
      {
        name: "Берпі",
        emoji: "🔥",
        sets: 3,
        reps: 10,
      },
      {
        name: "Mountain Climbers",
        emoji: "⚡",
        sets: 3,
        reps: 20,
      },
      {
        name: "Високі коліна",
        emoji: "🏃",
        sets: 3,
        reps: 30,
      },
    ],
  },
};

export function getWorkoutProgram(
  workoutId: string
): WorkoutProgram {
  return (
    workoutPrograms[workoutId] ??
    workoutPrograms.upper
  );
}
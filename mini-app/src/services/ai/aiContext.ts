import type { User } from "../../types/user";

export function buildAIUserContext(
  user: User
): string {
  const recentWorkouts =
    user.history
      .slice(0, 5)
      .map((workout) => {
        return [
          `Workout: ${workout.name}`,
          `Duration: ${workout.duration} min`,
          `XP: ${workout.xp}`,
          `Date: ${workout.date}`,
        ].join(" | ");
      })
      .join("\n");

  return `
IRONAGE USER PROFILE

Name: ${user.name}
Age: ${user.age}
Gender: ${user.gender || "not specified"}

Weight: ${user.weight} kg
Height: ${user.height} cm

Goal: ${user.goal}

Level: ${user.level}
XP: ${user.xp}

Completed workouts: ${user.workouts}
Current streak: ${user.streak}

RECENT WORKOUT HISTORY:

${recentWorkouts || "No workouts recorded yet."}
`.trim();
}
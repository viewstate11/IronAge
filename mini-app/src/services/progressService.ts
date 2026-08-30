import type {
  PersonalBest,
  ProgressDay,
  ProgressEngine,
  ProgressStats,
  ProgressWorkout,
  WeeklyProgress,
} from "../types/progress";

import {
  getProgressHistory,
  loadProgressHistory,
} from "./progressStorageService";

/* =========================================================
   XP ENGINE
========================================================= */

const BASE_WORKOUT_XP = 100;

const XP_PER_MINUTE = 2;

const XP_PER_100_VOLUME = 1;

const XP_PER_LEVEL = 1000;

/* =========================================================
   CALCULATE WORKOUT XP
========================================================= */

export function calculateWorkoutXp(
  workout: Pick<
    ProgressWorkout,
    | "durationMinutes"
    | "totalVolume"
    | "completed"
  >
): number {
  if (!workout.completed) {
    return 0;
  }

  const baseXp =
    BASE_WORKOUT_XP;

  const durationXp =
    Math.max(
      0,
      Math.round(
        workout.durationMinutes *
          XP_PER_MINUTE
      )
    );

  const volumeXp =
    Math.max(
      0,
      Math.round(
        workout.totalVolume /
          100 *
          XP_PER_100_VOLUME
      )
    );

  return (
    baseXp +
    durationXp +
    volumeXp
  );
}

/* =========================================================
   TOTAL XP
========================================================= */

export function calculateTotalXp(
  history: ProgressDay[]
): number {
  return history.reduce(
    (
      total,
      day
    ) =>
      total +
      day.xp,
    0
  );
}

/* =========================================================
   LEVEL
========================================================= */

export function calculateLevel(
  totalXp: number
): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
} {
  const safeXp =
    Math.max(
      0,
      totalXp
    );

  const level =
    Math.floor(
      safeXp /
        XP_PER_LEVEL
    ) + 1;

  const levelStartXp =
    (level - 1) *
    XP_PER_LEVEL;

  const currentLevelXp =
    safeXp -
    levelStartXp;

  return {
    level,

    currentLevelXp,

    nextLevelXp:
      XP_PER_LEVEL,
  };
}

/* =========================================================
   STREAK
========================================================= */

export function calculateCurrentStreak(
  history: ProgressDay[]
): number {
  if (
    history.length === 0
  ) {
    return 0;
  }

  const workoutDates =
    new Set(
      history
        .filter(
          (day) =>
            day.workouts.some(
              (
                workout
              ) =>
                workout.completed
            )
        )
        .map(
          (
            day
          ) =>
            day.date
        )
    );

  if (
    workoutDates.size ===
    0
  ) {
    return 0;
  }

  const today =
    new Date();

  today.setHours(
    12,
    0,
    0,
    0
  );

  let streak = 0;

  const latestDate =
    new Date(today);

  const todayKey =
    formatDateKey(
      latestDate
    );

  if (
    !workoutDates.has(
      todayKey
    )
  ) {
    latestDate.setDate(
      latestDate.getDate() -
        1
    );
  }

  while (true) {
    const key =
      formatDateKey(
        latestDate
      );

    if (
      !workoutDates.has(
        key
      )
    ) {
      break;
    }

    streak++;

    latestDate.setDate(
      latestDate.getDate() -
        1
    );
  }

  return streak;
}

/* =========================================================
   LONGEST STREAK
========================================================= */

export function calculateLongestStreak(
  history: ProgressDay[]
): number {
  const dates =
    history
      .filter(
        (day) =>
          day.workouts.some(
            (
              workout
            ) =>
              workout.completed
          )
      )
      .map(
        (
          day
        ) =>
          day.date
      )
      .sort();

  if (
    dates.length === 0
  ) {
    return 0;
  }

  let longest = 1;

  let current = 1;

  for (
    let i = 1;
    i < dates.length;
    i++
  ) {
    const previous =
      new Date(
        `${dates[i - 1]}T12:00:00`
      );

    const currentDate =
      new Date(
        `${dates[i]}T12:00:00`
      );

    const difference =
      Math.round(
        (
          currentDate.getTime() -
          previous.getTime()
        ) /
          86400000
      );

    if (
      difference ===
      1
    ) {
      current++;

      longest =
        Math.max(
          longest,
          current
        );
    } else {
      current = 1;
    }
  }

  return longest;
}

/* =========================================================
   WEEKLY PROGRESS
========================================================= */

export function calculateWeeklyProgress(
  endDate = new Date()
): WeeklyProgress[] {
  const history =
    getProgressHistory(
      7,
      endDate
    );

  return history.map(
    (
      day
    ) => ({
      date:
        day.date,

      workouts:
        day.workouts.filter(
          (
            workout
          ) =>
            workout.completed
        ).length,

      volume:
        day.totalVolume,

      xp:
        day.xp,
    })
  );
}

/* =========================================================
   PERSONAL BESTS
========================================================= */

export function calculatePersonalBests(
  history: ProgressDay[]
): PersonalBest[] {
  const bests =
    new Map<
      string,
      PersonalBest
    >();

  for (
    const day of history
  ) {
    for (
      const workout of day.workouts
    ) {
      if (
        !workout.completed
      ) {
        continue;
      }

      for (
        const exercise of workout.exercises
      ) {
        const weight =
          Math.max(
            0,
            exercise.weight ??
              0
          );

        const reps =
          Math.max(
            0,
            exercise.reps
          );

        const volume =
          Math.max(
            0,
            exercise.volume ??
              weight * reps
          );

        const name =
          exercise.exerciseName.trim();

        if (!name) {
          continue;
        }

        const existing =
          bests.get(name);

        if (
          !existing ||
          weight >
            existing.weight ||
          (
            weight ===
              existing.weight &&
            volume >
              existing.volume
          )
        ) {
          bests.set(
            name,
            {
              exerciseName:
                name,

              weight,

              reps,

              volume,

              date:
                day.date,
            }
          );
        }
      }
    }
  }

  return Array.from(
    bests.values()
  ).sort(
    (
      a,
      b
    ) =>
      b.weight -
      a.weight
  );
}

/* =========================================================
   STATS
========================================================= */

export function calculateProgressStats(
  history: ProgressDay[] =
    loadProgressHistory()
): ProgressStats {
  const completedWorkouts =
    history.flatMap(
      (
        day
      ) =>
        day.workouts.filter(
          (
            workout
          ) =>
            workout.completed
        )
    );

  const totalWorkouts =
    completedWorkouts.length;

  const totalVolume =
    completedWorkouts.reduce(
      (
        total,
        workout
      ) =>
        total +
        Math.max(
          0,
          workout.totalVolume
        ),
      0
    );

  const totalXp =
    calculateTotalXp(
      history
    );

  const level =
    calculateLevel(
      totalXp
    );

  const currentStreak =
    calculateCurrentStreak(
      history
    );

  const longestStreak =
    calculateLongestStreak(
      history
    );

  const weekly =
    calculateWeeklyProgress();

  const weeklyWorkouts =
    weekly.reduce(
      (
        total,
        day
      ) =>
        total +
        day.workouts,
      0
    );

  const weeklyVolume =
    weekly.reduce(
      (
        total,
        day
      ) =>
        total +
        day.volume,
      0
    );

  const averageWorkoutDuration =
    totalWorkouts === 0
      ? 0
      : Math.round(
          completedWorkouts.reduce(
            (
              total,
              workout
            ) =>
              total +
              Math.max(
                0,
                workout.durationMinutes
              ),
            0
          ) /
            totalWorkouts
        );

  const personalBests =
    calculatePersonalBests(
      history
    );

  return {
    totalWorkouts,

    totalVolume:

      Math.round(
        totalVolume
      ),

    totalXp,

    currentStreak,

    longestStreak,

    level:
      level.level,

    currentLevelXp:
      level.currentLevelXp,

    nextLevelXp:
      level.nextLevelXp,

    weeklyWorkouts,

    weeklyVolume:
      Math.round(
        weeklyVolume
      ),

    averageWorkoutDuration,

    personalBests,
  };
}

/* =========================================================
   ENGINE
========================================================= */

export function calculateProgressEngine(
  endDate = new Date()
): ProgressEngine {
  const history =
    loadProgressHistory();

  const stats =
    calculateProgressStats(
      history
    );

  const weekly =
    calculateWeeklyProgress(
      endDate
    );

  return {
    stats,

    weekly,

    history,
  };
}

/* =========================================================
   HELPERS
========================================================= */

function formatDateKey(
  date: Date
): string {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
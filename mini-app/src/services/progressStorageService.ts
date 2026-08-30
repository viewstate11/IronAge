import type {
  ProgressDay,
  ProgressWorkout,
} from "../types/progress";

const PROGRESS_KEY =
  "ironage_progress_v1";

/* =========================================================
   DATE
========================================================= */

export function getDateKey(
  date = new Date()
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

/* =========================================================
   DEFAULT
========================================================= */

function createDefaultDay(
  date: string
): ProgressDay {
  return {
    date,

    workouts: [],

    totalWorkouts: 0,

    totalVolume: 0,

    xp: 0,
  };
}

/* =========================================================
   LOAD ALL
========================================================= */

export function loadProgressHistory(): ProgressDay[] {
  const raw =
    localStorage.getItem(
      PROGRESS_KEY
    );

  if (!raw) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(raw);

    if (
      !Array.isArray(parsed)
    ) {
      return [];
    }

    return parsed.filter(
      (
        item
      ): item is ProgressDay =>
        Boolean(
          item &&
          typeof item.date ===
            "string" &&
          Array.isArray(
            item.workouts
          )
        )
    );
  } catch {
    return [];
  }
}

/* =========================================================
   SAVE ALL
========================================================= */

export function saveProgressHistory(
  history: ProgressDay[]
): void {
  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify(history)
  );
}

/* =========================================================
   LOAD DAY
========================================================= */

export function loadProgressDay(
  date = new Date()
): ProgressDay {
  const dateKey =
    getDateKey(date);

  const history =
    loadProgressHistory();

  const existing =
    history.find(
      (day) =>
        day.date === dateKey
    );

  if (existing) {
    return existing;
  }

  return createDefaultDay(
    dateKey
  );
}

/* =========================================================
   SAVE DAY
========================================================= */

export function saveProgressDay(
  day: ProgressDay
): ProgressDay {
  const history =
    loadProgressHistory();

  const index =
    history.findIndex(
      (item) =>
        item.date === day.date
    );

  if (index === -1) {
    history.push(day);
  } else {
    history[index] = day;
  }

  history.sort(
    (a, b) =>
      a.date.localeCompare(
        b.date
      )
  );

  saveProgressHistory(
    history
  );

  return day;
}

/* =========================================================
   ADD WORKOUT
========================================================= */

export function addProgressWorkout(
  workout: ProgressWorkout
): ProgressDay {
  const day =
    loadProgressDay(
      new Date(
        `${workout.date}T12:00:00`
      )
    );

  const updatedWorkout =
    workout;

  const updatedDay: ProgressDay =
    {
      ...day,

      workouts: [
        ...day.workouts,
        updatedWorkout,
      ],

      totalWorkouts:
        day.totalWorkouts + 1,

      totalVolume:
        day.totalVolume +
        Math.max(
          0,
          workout.totalVolume
        ),

      xp:
        day.xp +
        Math.max(
          0,
          workout.xp
        ),
    };

  return saveProgressDay(
    updatedDay
  );
}

/* =========================================================
   REMOVE WORKOUT
========================================================= */

export function removeProgressWorkout(
  workoutId: string,
  date: Date = new Date()
): ProgressDay {
  const day =
    loadProgressDay(
      date
    );

  const workout =
    day.workouts.find(
      (item) =>
        item.id === workoutId
    );

  if (!workout) {
    return day;
  }

  const workouts =
    day.workouts.filter(
      (item) =>
        item.id !== workoutId
    );

  const updatedDay: ProgressDay =
    {
      ...day,

      workouts,

      totalWorkouts:
        workouts.length,

      totalVolume:
        workouts.reduce(
          (
            total,
            item
          ) =>
            total +
            Math.max(
              0,
              item.totalVolume
            ),
          0
        ),

      xp:
        workouts.reduce(
          (
            total,
            item
          ) =>
            total +
            Math.max(
              0,
              item.xp
            ),
          0
        ),
    };

  return saveProgressDay(
    updatedDay
  );
}

/* =========================================================
   CLEAR
========================================================= */

export function clearProgressHistory(): void {
  localStorage.removeItem(
    PROGRESS_KEY
  );
}

/* =========================================================
   RANGE
========================================================= */

export function getProgressHistory(
  days = 7,
  endDate = new Date()
): ProgressDay[] {
  const history =
    loadProgressHistory();

  const result: ProgressDay[] =
    [];

  for (
    let i = days - 1;
    i >= 0;
    i--
  ) {
    const date =
      new Date(endDate);

    date.setHours(
      12,
      0,
      0,
      0
    );

    date.setDate(
      date.getDate() - i
    );

    const key =
      getDateKey(date);

    const existing =
      history.find(
        (item) =>
          item.date === key
      );

    result.push(
      existing ??
        createDefaultDay(
          key
        )
    );
  }

  return result;
}
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./WorkoutSession.css";

import vasylPhoto from "../../assets/vasyl-ua.jpg";

import type {
  WorkoutSetResult,
  WorkoutSessionResult,
} from "../../types/workout";

type Props = {
  changeTab: (nextTab: string) => void;
  workoutId: string;
  onComplete: (
    result: WorkoutSessionResult
  ) => void | Promise<void>;
};

const workoutData: Record<
  string,
  {
    title: string;
    exercises: {
      id: string;
      name: string;
      sets: number;
      reps: string;
    }[];
  }
> = {
  upper: {
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

  lower: {
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

  full: {
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
};

function parseRepetitions(
  reps: string
): number | null {
  const match = reps.match(/\d+/);

  if (!match) {
    return null;
  }

  const value = Number(match[0]);

  return Number.isFinite(value)
    ? value
    : null;
}

export default function WorkoutSession({
  changeTab,
  workoutId,
  onComplete,
}: Props) {
  const workout =
    workoutData[workoutId] ??
    workoutData.upper;

  const startedAtRef =
    useRef<string>(
      new Date().toISOString()
    );

  const finishingRef =
    useRef(false);

  const [
    exerciseIndex,
    setExerciseIndex,
  ] = useState(0);

  const [
    currentSet,
    setCurrentSet,
  ] = useState(1);

  const [
    seconds,
    setSeconds,
  ] = useState(0);

  const [
    completedSets,
    setCompletedSets,
  ] = useState<
    WorkoutSetResult[]
  >([]);

  useEffect(() => {
    const timer =
      window.setInterval(() => {
        setSeconds(
          (value) => value + 1
        );
      }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const exercise =
    workout.exercises[
      exerciseIndex
    ];

  const totalExercises =
    workout.exercises.length;

  const totalSets = useMemo(() => {
    return workout.exercises.reduce(
      (
        total,
        item
      ) =>
        total + item.sets,
      0
    );
  }, [workout.exercises]);

  const completedCount =
    completedSets.length;

  const progress =
    totalSets > 0
      ? (completedCount /
          totalSets) *
        100
      : 0;

  const formatTime = (
    value: number
  ) => {
    const minutes =
      Math.floor(value / 60);

    const secs =
      value % 60;

    return `${String(
      minutes
    ).padStart(
      2,
      "0"
    )}:${String(
      secs
    ).padStart(
      2,
      "0"
    )}`;
  };

  const finishWorkout = async (
    finalSets: WorkoutSetResult[]
  ) => {
    if (
      finishingRef.current
    ) {
      return;
    }

    finishingRef.current =
      true;

    const completedAt =
      new Date().toISOString();

    const completedExerciseIds =
      new Set(
        finalSets.map(
          (set) =>
            set.exerciseId
        )
      );

    const result: WorkoutSessionResult =
      {
        workoutId,
        workoutTitle:
          workout.title,
        durationSeconds:
          seconds,
        exercisesCompleted:
          completedExerciseIds.size,
        setsCompleted:
          finalSets.length,
        xp: 100,
        startedAt:
          startedAtRef.current,
        completedAt,
        sets:
          finalSets,
      };

    console.log(
      "IRONAGE WORKOUT RESULT:",
      result
    );

    try {
      await onComplete(
        result
      );
    } catch (error) {
      finishingRef.current =
        false;

      console.error(
        "IRONAGE: Workout completion failed:",
        error
      );
    }
  };

  const completeCurrentSet =
    () => {
      if (
        finishingRef.current
      ) {
        return;
      }

      const alreadyCompleted =
        completedSets.some(
          (set) =>
            set.exerciseId ===
              exercise.id &&
            set.setNumber ===
              currentSet
        );

      if (
        alreadyCompleted
      ) {
        return;
      }

      const newSet: WorkoutSetResult =
        {
          exerciseId:
            exercise.id,

          exerciseName:
            exercise.name,

          setNumber:
            currentSet,

          repetitions:
            parseRepetitions(
              exercise.reps
            ),

          weight: null,

          duration: null,

          completed: true,
        };

      const nextSets = [
        ...completedSets,
        newSet,
      ];

      setCompletedSets(
        nextSets
      );

      if (
        currentSet <
        exercise.sets
      ) {
        setCurrentSet(
          (value) =>
            value + 1
        );

        return;
      }

      if (
        exerciseIndex <
        totalExercises - 1
      ) {
        setExerciseIndex(
          (value) =>
            value + 1
        );

        setCurrentSet(1);

        return;
      }

      void finishWorkout(
        nextSets
      );
    };

  const closeSession =
    () => {
      if (
        finishingRef.current
      ) {
        return;
      }

      changeTab("home");
    };

  return (
    <main className="session-page">

      <img
        src={vasylPhoto}
        alt="IRONAGE athlete"
        className="session-background"
      />

      <div className="session-overlay" />

      <div className="session-content">

        <header className="session-header">

          <button
            type="button"
            className="session-close"
            onClick={closeSession}
          >
            ×
          </button>

          <div className="session-header-center">

            <span>
              IRONAGE SESSION
            </span>

            <strong>
              {workout.title}
            </strong>

          </div>

          <div className="session-timer">
            {formatTime(seconds)}
          </div>

        </header>

        <section className="session-progress">

          <div className="session-progress-top">

            <span>
              EXERCISE{" "}
              {exerciseIndex + 1}
              {" / "}
              {totalExercises}
            </span>

            <strong>
              {Math.round(
                progress
              )}
              %
            </strong>

          </div>

          <div className="session-progress-track">

            <div
              className="session-progress-fill"
              style={{
                width: `${Math.max(
                  progress,
                  3
                )}%`,
              }}
            />

          </div>

        </section>

        <section className="session-exercise">

          <span className="session-eyebrow">
            CURRENT EXERCISE
          </span>

          <h1>
            {exercise.name}
          </h1>

          <div className="session-main-stat">

            <span>
              REPS
            </span>

            <strong>
              {exercise.reps}
            </strong>

          </div>

          <div className="session-set">

            <div>

              <span>
                SET
              </span>

              <strong>
                {String(
                  currentSet
                ).padStart(
                  2,
                  "0"
                )}
              </strong>

            </div>

            <div className="session-set-divider" />

            <div>

              <span>
                TOTAL
              </span>

              <strong>
                {String(
                  exercise.sets
                ).padStart(
                  2,
                  "0"
                )}
              </strong>

            </div>

          </div>

          <div
            style={{
              marginTop: "18px",
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              opacity: 0.7,
            }}
          >
            {completedCount} /{" "}
            {totalSets} SETS
            COMPLETED
          </div>

        </section>

        <section className="session-bottom">

          <div className="session-motivation">

            <span>
              IRONAGE MINDSET
            </span>

            <p>
              One more set.
              <br />
              One stronger
              version of you.
            </p>

          </div>

          <button
            type="button"
            className="session-next"
            onClick={
              completeCurrentSet
            }
            disabled={
              finishingRef.current
            }
          >

            <span>
              {currentSet <
              exercise.sets
                ? "COMPLETE SET"
                : exerciseIndex <
                    totalExercises - 1
                  ? "NEXT EXERCISE"
                  : "FINISH WORKOUT"}
            </span>

            <strong>
              →
            </strong>

          </button>

        </section>

      </div>

    </main>
  );
}

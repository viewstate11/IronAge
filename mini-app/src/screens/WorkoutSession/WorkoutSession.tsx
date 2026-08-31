import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./WorkoutSession.css";

import vasylPhoto from "../../assets/vasyl-ua.jpg";

import {
  getWorkoutProgram,
} from "../../services/workoutService";

import type {
  WorkoutProgram,
  WorkoutSetResult,
  WorkoutSessionResult,
} from "../../types/workout";

type Props = {
  changeTab: (nextTab: string) => void;
  workoutId: string;
  workoutProgram?: WorkoutProgram;
  onComplete: (
    result: WorkoutSessionResult
  ) => void | Promise<void>;
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
  workoutProgram,
  onComplete,
}: Props) {
  const workout =
    workoutProgram ??
    getWorkoutProgram(workoutId);

  const startedAtRef =
    useRef<string>(
      new Date().toISOString()
    );

  const finishingRef =
    useRef(false);

  const setActionRef =
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

  const [
    exitConfirmOpen,
    setExitConfirmOpen,
  ] = useState(false);

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
        assignmentId:
          workout.assignmentId,
        programWorkoutId:
          workout.programWorkoutId,
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
        finishingRef.current ||
        setActionRef.current
      ) {
        return;
      }

      setActionRef.current =
        true;

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
        setActionRef.current =
          false;

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

        window.setTimeout(() => {
          setActionRef.current =
            false;
        }, 0);

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

        window.setTimeout(() => {
          setActionRef.current =
            false;
        }, 0);

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

      setExitConfirmOpen(true);
    };

  const cancelExit =
    () => {
      setExitConfirmOpen(false);
    };

  const confirmExit =
    () => {
      if (
        finishingRef.current
      ) {
        return;
      }

      setExitConfirmOpen(false);
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

      {exitConfirmOpen && (
        <div
          className="session-exit-overlay"
          role="presentation"
        >
          <div
            className="session-exit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="session-exit-title"
          >
            <span className="session-exit-eyebrow">
              IRONAGE SESSION
            </span>

            <h2 id="session-exit-title">
              EXIT WORKOUT?
            </h2>

            <p>
              Your current workout progress
              will be lost.
            </p>

            <div className="session-exit-actions">
              <button
                type="button"
                className="session-exit-continue"
                onClick={cancelExit}
              >
                CONTINUE TRAINING
              </button>

              <button
                type="button"
                className="session-exit-confirm"
                onClick={confirmExit}
              >
                EXIT WORKOUT
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

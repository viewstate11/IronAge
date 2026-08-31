import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  api,
  telegramAuthOptions,
} from "../../api/client";

import type {
  WorkoutProgram,
} from "../../types/workout";

import "./MyProgram.css";

type Exercise = {
  id: number;
  name: string;
};

type WorkoutExercise = {
  id: number;
  position: number;
  sets: number | null;
  repetitions: number | null;
  minRepetitions: number | null;
  maxRepetitions: number | null;
  duration: number | null;
  restSeconds: number | null;
  coachNotes: string | null;
  exercise: Exercise;
};

type TrainingWorkout = {
  id: number;
  name: string;
  description: string | null;
  duration: number | null;
  difficulty: string | null;
  exercises: WorkoutExercise[];
};

type ProgramWorkout = {
  id: number;
  week: number | null;
  day: number | null;
  position: number;
  workout: TrainingWorkout;
};

type TrainingProgram = {
  id: number;
  name: string;
  description: string | null;
  durationWeeks: number | null;
  workouts: ProgramWorkout[];
};

type Coach = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  coachProfile: {
    displayName: string;
    specialization: string | null;
    photoUrl: string | null;
  } | null;
};

type ProgramAssignment = {
  id: number;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  coach: Coach;
  program: TrainingProgram;
};

type MyProgramsResponse = {
  success: boolean;
  assignments: ProgramAssignment[];
};

type Props = {
  onBack: () => void;
  onStartWorkout: (
    workoutId: string,
    workoutProgram: WorkoutProgram
  ) => void;
};

function getReps(
  item: WorkoutExercise
): string {
  if (
    item.minRepetitions !== null &&
    item.maxRepetitions !== null
  ) {
    return `${item.minRepetitions}-${item.maxRepetitions}`;
  }

  if (item.repetitions !== null) {
    return String(item.repetitions);
  }

  if (item.duration !== null) {
    return `${item.duration} SEC`;
  }

  return "AS PRESCRIBED";
}

function toWorkoutProgram(
  workout: TrainingWorkout,
  assignmentId: number,
  programWorkoutId: number
): WorkoutProgram {
  return {
    id: `coach-${workout.id}`,
    assignmentId,
    programWorkoutId,
    title: workout.name,
    description:
      workout.description || undefined,

    exercises: workout.exercises.map(
      (item) => ({
        id: String(item.exercise.id),
        name: item.exercise.name,
        sets: Math.max(
          1,
          item.sets ?? 1
        ),
        reps: getReps(item),
      })
    ),
  };
}

export default function MyProgram({
  onBack,
  onStartWorkout,
}: Props) {
  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    assignments,
    setAssignments,
  ] = useState<ProgramAssignment[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const response =
          await api.get<MyProgramsResponse>(
            "/my-programs",
            telegramAuthOptions()
          );

        if (cancelled) {
          return;
        }

        setAssignments(
          Array.isArray(response.assignments)
            ? response.assignments
            : []
        );
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load program"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const assignment =
    assignments[0] ?? null;

  const workouts = useMemo(() => {
    if (!assignment) {
      return [];
    }

    return [...assignment.program.workouts]
      .sort(
        (a, b) =>
          a.position - b.position
      );
  }, [assignment]);

  return (
    <main className="my-program-page">
      <div className="my-program-shell">
        <header className="my-program-header">
          <button
            type="button"
            className="my-program-back"
            onClick={onBack}
            aria-label="Back"
          >
            ←
          </button>

          <div>
            <span>IRONAGE COACHING</span>
            <h1>MY PROGRAM</h1>
            <p>
              YOUR COACH. YOUR PLAN.
              YOUR WORK.
            </p>
          </div>
        </header>

        {loading && (
          <section className="my-program-state">
            <strong>
              LOADING PROGRAM...
            </strong>
          </section>
        )}

        {!loading && error && (
          <section className="my-program-state my-program-state--error">
            <strong>
              PROGRAM LOAD ERROR
            </strong>
            <p>{error}</p>
          </section>
        )}

        {!loading &&
          !error &&
          !assignment && (
            <section className="my-program-state">
              <span>NO ACTIVE PROGRAM</span>
              <h2>
                YOUR COACH HAS NOT
                ASSIGNED A PROGRAM YET.
              </h2>
              <p>
                Once a coach assigns your
                training plan, it will
                appear here.
              </p>
            </section>
          )}

        {!loading &&
          !error &&
          assignment && (
            <>
              <section className="my-program-coach">
                <span>YOUR COACH</span>

                <h2>
                  {assignment.coach
                    .coachProfile
                    ?.displayName ||
                    [
                      assignment.coach
                        .firstName,
                      assignment.coach
                        .lastName,
                    ]
                      .filter(Boolean)
                      .join(" ") ||
                    "IRONAGE COACH"}
                </h2>

                <p>
                  {assignment.coach
                    .coachProfile
                    ?.specialization ||
                    "PERSONAL COACHING"}
                </p>
              </section>

              <section className="my-program-hero">
                <span>
                  ACTIVE PROGRAM
                </span>

                <h2>
                  {assignment.program.name}
                </h2>

                {assignment.program
                  .description && (
                  <p>
                    {
                      assignment.program
                        .description
                    }
                  </p>
                )}

                <div className="my-program-meta">
                  <div>
                    <strong>
                      {assignment.program
                        .durationWeeks ??
                        "—"}
                    </strong>
                    <span>WEEKS</span>
                  </div>

                  <div>
                    <strong>
                      {workouts.length}
                    </strong>
                    <span>WORKOUTS</span>
                  </div>
                </div>
              </section>

              <div className="my-program-title">
                <span />
                <strong>
                  TRAINING SCHEDULE
                </strong>
                <span />
              </div>

              <section className="my-program-workouts">
                {workouts.map(
                  (programWorkout) => {
                    const workout =
                      programWorkout.workout;

                    const totalSets =
                      workout.exercises.reduce(
                        (total, item) =>
                          total +
                          (item.sets ?? 1),
                        0
                      );

                    return (
                      <article
                        key={
                          programWorkout.id
                        }
                        className="my-program-workout"
                      >
                        <div className="my-program-workout-top">
                          <div>
                            <span>
                              WEEK{" "}
                              {programWorkout.week ??
                                "—"}{" "}
                              · DAY{" "}
                              {programWorkout.day ??
                                "—"}
                            </span>

                            <h3>
                              {workout.name}
                            </h3>
                          </div>

                          {workout.difficulty && (
                            <b>
                              {
                                workout.difficulty
                              }
                            </b>
                          )}
                        </div>

                        <div className="my-program-workout-stats">
                          <span>
                            {
                              workout.exercises
                                .length
                            }{" "}
                            EXERCISES
                          </span>

                          <span>
                            {totalSets} SETS
                          </span>

                          {workout.duration !==
                            null && (
                            <span>
                              {workout.duration} MIN
                            </span>
                          )}
                        </div>

                        <div className="my-program-exercises">
                          {workout.exercises.map(
                            (item) => (
                              <div
                                key={item.id}
                              >
                                <section>
                                  <strong>
                                    {
                                      item.exercise
                                        .name
                                    }
                                  </strong>

                                  <small>
                                    {item.sets ??
                                      1}{" "}
                                    SETS ·{" "}
                                    {getReps(
                                      item
                                    )}{" "}
                                    REPS
                                  </small>
                                </section>

                                <b>
                                  {
                                    item.position
                                  }
                                </b>
                              </div>
                            )
                          )}
                        </div>

                        <button
                          type="button"
                          className="my-program-start"
                          disabled={
                            workout.exercises
                              .length === 0
                          }
                          onClick={() => {
                            const program =
                              toWorkoutProgram(
                                workout,
                                assignment.id,
                                programWorkout.id
                              );

                            onStartWorkout(
                              program.id,
                              program
                            );
                          }}
                        >
                          START WORKOUT →
                        </button>
                      </article>
                    );
                  }
                )}
              </section>
            </>
          )}
      </div>
    </main>
  );
}

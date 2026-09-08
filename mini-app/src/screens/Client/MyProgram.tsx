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

import { useLanguage } from "../../context/LanguageContext";

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

  accessSource:
    | "COACH_ASSIGNMENT"
    | "FREE_CLAIM"
    | "PURCHASE"
    | "SUBSCRIPTION"
    | "ADMIN_GRANT";

  accessExpiresAt:
    string | null;
  coach: Coach | null;
  program: TrainingProgram;
};

type MyProgramsResponse = {
  success: boolean;
  assignments: ProgramAssignment[];
};

type Props = {
  selectedProgramId?: number | null;
  onBack: () => void;
  onStartWorkout: (
    workoutId: string,
    workoutProgram: WorkoutProgram
  ) => void;
};

function getReps(
  item: WorkoutExercise,
  secLabel: string,
  prescribedLabel: string
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
    return `${item.duration} ${secLabel}`;
  }

  return prescribedLabel;
}

function toWorkoutProgram(
  workout: TrainingWorkout,
  assignmentId: number,
  programWorkoutId: number,
  secLabel: string,
  prescribedLabel: string
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
        reps: getReps(
          item,
          secLabel,
          prescribedLabel
        ),
      })
    ),
  };
}

export default function MyProgram({
  selectedProgramId = null,
  onBack,
  onStartWorkout,
}: Props) {
  const { t } = useLanguage();

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

  const [
    activeProgramId,
    setActiveProgramId,
  ] = useState<number | null>(
    selectedProgramId
  );

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
            : t("myProgram.failedToLoad")
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

  useEffect(() => {
    setActiveProgramId(
      selectedProgramId
    );
  }, [selectedProgramId]);

  const assignment =
    activeProgramId !== null
      ? (
          assignments.find(
            (item) =>
              item.program.id ===
              activeProgramId
          ) ?? null
        )
      : null;

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
            onClick={() => {
              if (
                activeProgramId !== null &&
                selectedProgramId === null
              ) {
                setActiveProgramId(
                  null
                );
                return;
              }

              onBack();
            }}
            aria-label={t("common.back")}
          >
            ←
          </button>

          <div>
            <span>
              {t("myProgram.training")}
            </span>

            <h1>
              {activeProgramId === null
                ? t("myProgram.myPrograms")
                : t("myProgram.myProgram")}
            </h1>

            <p>
              {activeProgramId === null
                ? t("myProgram.librarySubtitle")
                : t("myProgram.programSubtitle")}
            </p>
          </div>
        </header>

        {loading && (
          <section className="my-program-state">
            <strong>
              {t("myProgram.loading")}
            </strong>
          </section>
        )}

        {!loading && error && (
          <section className="my-program-state my-program-state--error">
            <strong>
              {t("myProgram.loadError")}
            </strong>
            <p>{error}</p>
          </section>
        )}

        {!loading &&
          !error &&
          activeProgramId === null &&
          assignments.length === 0 && (
            <section className="my-program-state">
              <span>
                {t("myProgram.noProgramsYet")}
              </span>

              <h2>
                {t("myProgram.libraryEmpty")}
              </h2>

              <p>
                Programs you receive from
                a coach, claim for free or
                purchase will appear here.
              </p>
            </section>
          )}

        {!loading &&
          !error &&
          activeProgramId === null &&
          assignments.length > 0 && (
            <section className="my-program-library">
              {assignments.map(
                (item) => {
                  const sourceLabel =
                    item.accessSource ===
                    "COACH_ASSIGNMENT"
                      ? t("myProgram.sourceCoach")
                      : item.accessSource ===
                          "FREE_CLAIM"
                        ? t("myProgram.sourceFree")
                        : item.accessSource ===
                            "PURCHASE"
                          ? t("myProgram.sourcePurchase")
                          : item.accessSource ===
                              "SUBSCRIPTION"
                            ? t("myProgram.sourceSubscription")
                            : t("myProgram.sourceAdmin");

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className="my-program-library-card"
                      onClick={() => {
                        setActiveProgramId(
                          item.program.id
                        );
                      }}
                    >
                      <div className="my-program-library-card__top">
                        <span>
                          {sourceLabel}
                        </span>

                        <b>
                          {t("myProgram.open")} →
                        </b>
                      </div>

                      <h2>
                        {item.program.name}
                      </h2>

                      {item.program
                        .description && (
                        <p>
                          {
                            item.program
                              .description
                          }
                        </p>
                      )}

                      <div className="my-program-library-card__meta">
                        <span>
                          {
                            item.program
                              .durationWeeks ??
                            "—"
                          }{" "}
                          {t("myProgram.weeks")}
                        </span>

                        <span>
                          {
                            item.program
                              .workouts.length
                          }{" "}
                          {t("myProgram.workouts")}
                        </span>

                        <span>
                          {item.coach
                            ? (
                                item.coach
                                  .coachProfile
                                  ?.displayName ||
                                "COACH"
                              )
                            : t("myProgram.selfService")}
                        </span>
                      </div>
                    </button>
                  );
                }
              )}
            </section>
          )}

        {!loading &&
          !error &&
          activeProgramId !== null &&
          !assignment && (
            <section className="my-program-state my-program-state--error">
              <span>
                {t("myProgram.notAvailable")}
              </span>

              <h2>
                THIS PROGRAM IS NOT
                ACTIVE IN YOUR ACCOUNT.
              </h2>
            </section>
          )}

        {!loading &&
          !error &&
          assignment && (
            <>
              <section className="my-program-coach">
                <span>
                  {assignment.coach
                    ? t("myProgram.yourCoach")
                    : t("myProgram.programAccess")}
                </span>

                <h2>
                  {assignment.coach
                    ? (
                        assignment.coach
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
                        t("myProgram.ironageCoach")
                      )
                    : t("myProgram.ironageProgram")}
                </h2>

                <p>
                  {assignment.coach
                    ? (
                        assignment.coach
                          .coachProfile
                          ?.specialization ||
                        t("myProgram.personalCoaching")
                      )
                    : t("myProgram.selfServiceProgram")}
                </p>
              </section>

              <section className="my-program-hero">
                <span>
                  {t("myProgram.activeProgram")}
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
                    <span>{t("myProgram.weeks")}</span>
                  </div>

                  <div>
                    <strong>
                      {workouts.length}
                    </strong>
                    <span>{t("myProgram.workouts")}</span>
                  </div>
                </div>
              </section>

              <div className="my-program-title">
                <span />
                <strong>
                  {t("myProgram.trainingSchedule")}
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
                              {t("myProgram.week")}{" "}
                              {programWorkout.week ??
                                "—"}{" "}
                              · {t("myProgram.day")}{" "}
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
                            {t("myProgram.exercises")}
                          </span>

                          <span>
                            {totalSets} {t("myProgram.sets")}
                          </span>

                          {workout.duration !==
                            null && (
                            <span>
                              {workout.duration} {t("myProgram.min")}
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
                                    {t("myProgram.sets")} ·{" "}
                                    {getReps(
                                      item,
                                      t("myProgram.sec"),
                                      t("myProgram.asPrescribed")
                                    )}{" "}
                                    {t("myProgram.reps")}
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
                                programWorkout.id,
                                t("myProgram.sec"),
                                t("myProgram.asPrescribed")
                              );

                            onStartWorkout(
                              program.id,
                              program
                            );
                          }}
                        >
                          {t("myProgram.startWorkout")} →
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

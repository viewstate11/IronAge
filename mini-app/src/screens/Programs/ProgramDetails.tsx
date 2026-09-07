import {
  useEffect,
  useState,
} from "react";

import api, {
  telegramAuthOptions,
} from "../../api/client";

import "./ProgramDetails.css";

type Exercise = {
  id: number;
  name: string;
};

type WorkoutExercise = {
  id: number;
  position: number;

  sets: number | null;
  repetitions: number | null;

  minRepetitions:
    number | null;

  maxRepetitions:
    number | null;

  duration:
    number | null;

  restSeconds:
    number | null;

  coachNotes:
    string | null;

  exercise: Exercise;
};

type ProgramWorkout = {
  id: number;
  week: number | null;
  day: number | null;
  position: number;

  workout: {
    id: number;
    name: string;
    description: string | null;
    duration: number | null;
    difficulty: string | null;

    exercises:
      WorkoutExercise[];
  };
};

type ProgramData = {
  id: number;
  coachId: number;

  name: string;
  description: string | null;

  durationWeeks:
    number | null;

  priceCents:
    number | null;

  currency:
    string;

  coach: {
    id: number;
    firstName: string;
    lastName: string | null;

    coachProfile: {
      displayName: string;
      specialization: string | null;
      photoUrl: string | null;
      isVerified: boolean;
    } | null;
  };

  workouts:
    ProgramWorkout[];

  _count: {
    assignments:
      number;
  };
};

type Response = {
  success: boolean;
  program: ProgramData;
};

type Props = {
  programId: number;
  onBack: () => void;

  onOpenCoach: (
    coachId: number
  ) => void;
};

function formatPrice(
  priceCents: number | null,
  currency: string
): string {
  if (
    priceCents === null ||
    priceCents <= 0
  ) {
    return "FREE";
  }

  try {
    return new Intl.NumberFormat(
      undefined,
      {
        style: "currency",
        currency,
      }
    ).format(
      priceCents / 100
    );
  } catch {
    return `${(
      priceCents / 100
    ).toFixed(2)} ${currency}`;
  }
}

export default function ProgramDetails({
  programId,
  onBack,
  onOpenCoach,
}: Props) {
  const [
    program,
    setProgram,
  ] = useState<ProgramData | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  async function loadProgram() {
    try {
      setLoading(true);
      setError(null);

      const response =
        await api.get<Response>(
          `/programs/${programId}`,
          telegramAuthOptions()
        );

      if (!response.program) {
        throw new Error(
          "Program not found"
        );
      }

      setProgram(
        response.program
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load program"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProgram();
  }, [programId]);

  if (loading) {
    return (
      <main className="program-detail">
        <div className="program-detail__state">
          LOADING PROGRAM...
        </div>
      </main>
    );
  }

  if (
    error ||
    !program
  ) {
    return (
      <main className="program-detail">
        <div className="program-detail__shell">
          <button
            type="button"
            className="program-detail__back"
            onClick={onBack}
          >
            ←
          </button>

          <div className="program-detail__state">
            <strong>
              PROGRAM NOT AVAILABLE
            </strong>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                void loadProgram()
              }
            >
              RETRY
            </button>
          </div>
        </div>
      </main>
    );
  }

  const coach =
    program.coach
      .coachProfile;

  return (
    <main className="program-detail">
      <div className="program-detail__shell">

        <header className="program-detail__header">
          <button
            type="button"
            className="program-detail__back"
            onClick={onBack}
          >
            ←
          </button>

          <span>
            IRONAGE PROGRAM
          </span>
        </header>


        <section className="program-detail__hero">
          <span>
            VERIFIED PROGRAM
          </span>

          <h1>
            {program.name}
          </h1>

          <p>
            {program.description ||
              "Professional IRONAGE training program."}
          </p>

          <div className="program-detail__price">
            {formatPrice(
              program.priceCents,
              program.currency
            )}
          </div>
        </section>


        <section
          className="program-detail__coach"
          onClick={() =>
            onOpenCoach(
              program.coachId
            )
          }
        >
          <div className="program-detail__coach-photo">
            {coach?.photoUrl ? (
              <img
                src={
                  coach.photoUrl
                }
                alt={
                  coach.displayName
                }
              />
            ) : (
              <span>
                {(coach?.displayName ||
                  program.coach
                    .firstName)
                  .slice(0,1)
                  .toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <span>
              COACH
            </span>

            <strong>
              {coach?.displayName ||
                program.coach
                  .firstName}
              {coach?.isVerified
                ? " ✓"
                : ""}
            </strong>

            <p>
              {coach?.specialization ||
                "IRONAGE COACH"}
            </p>
          </div>

          <b>
            →
          </b>
        </section>


        <section className="program-detail__stats">
          <div>
            <strong>
              {program.durationWeeks ??
                "—"}
            </strong>

            <span>
              WEEKS
            </span>
          </div>

          <div>
            <strong>
              {
                program
                  .workouts
                  .length
              }
            </strong>

            <span>
              WORKOUTS
            </span>
          </div>

          <div>
            <strong>
              {
                program
                  ._count
                  .assignments
              }
            </strong>

            <span>
              ATHLETES
            </span>
          </div>
        </section>


        <section className="program-detail__workouts">
          <div className="program-detail__section-title">
            PROGRAM WORKOUTS
          </div>

          {program.workouts.map(
            (
              item,
              index
            ) => (
              <article
                key={
                  item.id
                }
                className="program-detail__workout"
              >
                <div className="program-detail__workout-top">
                  <span>
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <div>
                    <h3>
                      {
                        item
                          .workout
                          .name
                      }
                    </h3>

                    <p>
                      {item.week
                        ? `WEEK ${item.week}`
                        : ""}
                      {item.week &&
                      item.day
                        ? " • "
                        : ""}
                      {item.day
                        ? `DAY ${item.day}`
                        : ""}
                    </p>
                  </div>
                </div>

                {item.workout
                  .exercises.map(
                    (
                      exercise
                    ) => (
                      <div
                        key={
                          exercise.id
                        }
                        className="program-detail__exercise"
                      >
                        <strong>
                          {
                            exercise
                              .exercise
                              .name
                          }
                        </strong>

                        <span>
                          {exercise.sets
                            ? `${exercise.sets} SETS`
                            : ""}
                          {exercise.repetitions
                            ? ` • ${exercise.repetitions} REPS`
                            : ""}
                        </span>
                      </div>
                    )
                  )}
              </article>
            )
          )}
        </section>


        <section className="program-detail__access">
          <span>
            PROGRAM ACCESS
          </span>

          <h2>
            READY TO TRAIN?
          </h2>

          <p>
            Purchase and subscription
            access will be connected
            in the next IRONAGE module.
          </p>

          <button
            type="button"
            disabled
          >
            GET PROGRAM
          </button>
        </section>

      </div>
    </main>
  );
}

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import api, {
  telegramAuthOptions,
} from "../../api/client";

import "./CreateProgram.css";

type Props = {
  onBack: () => void;
  onCreated: () => void;
};

type CoachWorkout = {
  id: number;
  coachId: number;
  name: string;
  description: string | null;
  duration: number | null;
  difficulty: string | null;
  isActive: boolean;
};

type WorkoutsResponse = {
  success: boolean;
  workouts: CoachWorkout[];
};

type SelectedWorkout = {
  workout: CoachWorkout;
  week: string;
  day: string;
};

type CreateProgramResponse = {
  success: boolean;
  program?: {
    id: number;
    name: string;
  };
  message?: string;
};

export default function CreateProgram({
  onBack,
  onCreated,
}: Props) {
  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [durationWeeks, setDurationWeeks] =
    useState("4");

  const [workouts, setWorkouts] =
    useState<CoachWorkout[]>([]);

  const [selected, setSelected] =
    useState<SelectedWorkout[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [saveError, setSaveError] =
    useState<string | null>(null);

  const selectedIds = useMemo(
    () =>
      new Set(
        selected.map(
          (item) =>
            item.workout.id
        )
      ),
    [selected]
  );

  async function loadWorkouts() {
    try {
      setLoading(true);
      setLoadError(null);

      const response =
        await api.get<WorkoutsResponse>(
          "/coach-workouts",
          telegramAuthOptions()
        );

      if (
        !response ||
        !Array.isArray(response.workouts)
      ) {
        throw new Error(
          "Invalid coach workouts response"
        );
      }

      setWorkouts(response.workouts);
    } catch (error) {
      console.error(
        "IRONAGE CREATE PROGRAM WORKOUTS ERROR:",
        error
      );

      setLoadError(
        error instanceof Error
          ? error.message
          : "Failed to load workouts"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadWorkouts();
  }, []);

  function addWorkout(
    workout: CoachWorkout
  ) {
    if (
      selectedIds.has(
        workout.id
      )
    ) {
      return;
    }

    setSelected(
      (current) => [
        ...current,
        {
          workout,
          week: "1",
          day: String(
            current.length + 1
          ),
        },
      ]
    );
  }

  function removeWorkout(
    workoutId: number
  ) {
    setSelected(
      (current) =>
        current.filter(
          (item) =>
            item.workout.id !==
            workoutId
        )
    );
  }

  function updateSchedule(
    workoutId: number,
    field: "week" | "day",
    value: string
  ) {
    setSelected(
      (current) =>
        current.map(
          (item) =>
            item.workout.id ===
            workoutId
              ? {
                  ...item,
                  [field]: value,
                }
              : item
        )
    );
  }

  async function saveProgram() {
    const normalizedName =
      name.trim();

    if (!normalizedName) {
      setSaveError(
        "Program name is required."
      );
      return;
    }

    if (
      selected.length === 0
    ) {
      setSaveError(
        "Add at least one workout."
      );
      return;
    }

    const weeks =
      Number(durationWeeks);

    if (
      !Number.isInteger(weeks) ||
      weeks < 1
    ) {
      setSaveError(
        "Program duration must be at least 1 week."
      );
      return;
    }

    for (const item of selected) {
      const week =
        Number(item.week);

      const day =
        Number(item.day);

      if (
        !Number.isInteger(week) ||
        week < 1 ||
        week > weeks
      ) {
        setSaveError(
          `${item.workout.name}: week must be between 1 and ${weeks}.`
        );
        return;
      }

      if (
        !Number.isInteger(day) ||
        day < 1 ||
        day > 7
      ) {
        setSaveError(
          `${item.workout.name}: day must be between 1 and 7.`
        );
        return;
      }
    }

    try {
      setSaving(true);
      setSaveError(null);

      const payload = {
        name: normalizedName,

        description:
          description.trim() ||
          undefined,

        durationWeeks:
          weeks,

        workouts:
          selected.map(
            (item, index) => ({
              workoutId:
                item.workout.id,

              position:
                index + 1,

              week:
                Number(item.week),

              day:
                Number(item.day),
            })
          ),
      };

      const response =
        await api.post<CreateProgramResponse>(
          "/coach-programs",
          payload,
          telegramAuthOptions()
        );

      if (
        !response?.success ||
        !response.program
      ) {
        throw new Error(
          response?.message ||
            "Program was not created"
        );
      }

      onCreated();
    } catch (error) {
      console.error(
        "IRONAGE CREATE PROGRAM ERROR:",
        error
      );

      setSaveError(
        error instanceof Error
          ? error.message
          : "Failed to create program"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="create-program">
      <div className="create-program__content">

        <header className="create-program__header">
          <button
            type="button"
            className="create-program__back"
            onClick={onBack}
            aria-label="Back to programs"
          >
            ←
          </button>

          <div>
            <span>
              IRONAGE COACH
            </span>

            <h1>
              CREATE PROGRAM
            </h1>

            <p>
              BUILD THE SYSTEM
            </p>
          </div>
        </header>

        <section className="create-program__section">
          <div className="create-program__title">
            <span>01</span>

            <div>
              <strong>
                PROGRAM DETAILS
              </strong>

              <small>
                DEFINE THE GOAL
              </small>
            </div>
          </div>

          <label className="create-program__field">
            <span>
              PROGRAM NAME
            </span>

            <input
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="IRONAGE STRENGTH"
            />
          </label>

          <label className="create-program__field">
            <span>
              DESCRIPTION
            </span>

            <textarea
              rows={3}
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Strength and muscle development..."
            />
          </label>

          <label className="create-program__field">
            <span>
              DURATION
            </span>

            <select
              value={durationWeeks}
              onChange={(event) =>
                setDurationWeeks(
                  event.target.value
                )
              }
            >
              <option value="4">
                4 WEEKS
              </option>

              <option value="8">
                8 WEEKS
              </option>

              <option value="12">
                12 WEEKS
              </option>
            </select>
          </label>
        </section>

        <section className="create-program__section">
          <div className="create-program__title">
            <span>02</span>

            <div>
              <strong>
                MY WORKOUTS
              </strong>

              <small>
                ADD TRAINING SESSIONS
              </small>
            </div>
          </div>

          {loading && (
            <div className="create-program__state">
              LOADING WORKOUTS...
            </div>
          )}

          {!loading &&
            loadError && (
              <div className="create-program__state create-program__state--error">
                <strong>
                  {loadError}
                </strong>

                <button
                  type="button"
                  onClick={() =>
                    void loadWorkouts()
                  }
                >
                  RETRY
                </button>
              </div>
            )}

          {!loading &&
            !loadError &&
            workouts.length === 0 && (
              <div className="create-program__state">
                NO WORKOUTS AVAILABLE
              </div>
            )}

          {!loading &&
            !loadError &&
            workouts.length > 0 && (
              <div className="create-program__library">
                {workouts.map(
                  (workout) => {
                    const isSelected =
                      selectedIds.has(
                        workout.id
                      );

                    return (
                      <button
                        key={workout.id}
                        type="button"
                        className={
                          isSelected
                            ? "create-program__workout create-program__workout--selected"
                            : "create-program__workout"
                        }
                        disabled={
                          isSelected
                        }
                        onClick={() =>
                          addWorkout(
                            workout
                          )
                        }
                      >
                        <div>
                          <span>
                            {workout.difficulty ||
                              "WORKOUT"}
                          </span>

                          <strong>
                            {workout.name}
                          </strong>

                          <small>
                            {workout.duration
                              ? `${workout.duration} MIN`
                              : "DURATION —"}
                          </small>
                        </div>

                        <b>
                          {isSelected
                            ? "✓"
                            : "+"}
                        </b>
                      </button>
                    );
                  }
                )}
              </div>
            )}
        </section>

        {selected.length > 0 && (
          <section className="create-program__section">
            <div className="create-program__title">
              <span>03</span>

              <div>
                <strong>
                  PROGRAM SCHEDULE
                </strong>

                <small>
                  SET WEEK AND DAY
                </small>
              </div>
            </div>

            <div className="create-program__schedule">
              {selected.map(
                (item, index) => (
                  <article
                    key={
                      item.workout.id
                    }
                    className="create-program__selected"
                  >
                    <div className="create-program__selected-header">
                      <div>
                        <span>
                          POSITION {index + 1}
                        </span>

                        <strong>
                          {item.workout.name}
                        </strong>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeWorkout(
                            item.workout.id
                          )
                        }
                        aria-label={`Remove ${item.workout.name}`}
                      >
                        ×
                      </button>
                    </div>

                    <div className="create-program__grid">
                      <label>
                        <span>
                          WEEK
                        </span>

                        <input
                          type="number"
                          min="1"
                          max={
                            durationWeeks
                          }
                          inputMode="numeric"
                          value={
                            item.week
                          }
                          onChange={(
                            event
                          ) =>
                            updateSchedule(
                              item.workout.id,
                              "week",
                              event.target.value
                            )
                          }
                        />
                      </label>

                      <label>
                        <span>
                          DAY
                        </span>

                        <input
                          type="number"
                          min="1"
                          max="7"
                          inputMode="numeric"
                          value={
                            item.day
                          }
                          onChange={(
                            event
                          ) =>
                            updateSchedule(
                              item.workout.id,
                              "day",
                              event.target.value
                            )
                          }
                        />
                      </label>
                    </div>
                  </article>
                )
              )}
            </div>
          </section>
        )}

        {saveError && (
          <div className="create-program__save-error">
            {saveError}
          </div>
        )}

        <button
          type="button"
          className="create-program__save"
          disabled={saving}
          onClick={() =>
            void saveProgram()
          }
        >
          <span>
            {saving
              ? "SAVING..."
              : "SAVE PROGRAM"}
          </span>

          <b>→</b>
        </button>

      </div>
    </main>
  );
}

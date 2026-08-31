import {
  useEffect,
  useMemo,
  useState,
} from "react";

import api, {
  telegramAuthOptions,
} from "../../api/client";

import "./CreateWorkout.css";

type Props = {
  onBack: () => void;
  onCreated: () => void;
};

type Exercise = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  instructions: string | null;
  muscleGroup: string | null;
  equipment: string | null;
  demoVideoUrl: string | null;
  thumbnailUrl: string | null;
};

type ExercisesResponse = {
  success: boolean;
  exercises: Exercise[];
};

type SelectedExercise = {
  exercise: Exercise;
  sets: string;
  repetitions: string;
  restSeconds: string;
  targetWeight: string;
  coachNotes: string;
};

type CreateWorkoutResponse = {
  success: boolean;
  workout?: {
    id: number;
    name: string;
  };
  message?: string;
};

export default function CreateWorkout({
  onBack,
  onCreated,
}: Props) {
  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [duration, setDuration] =
    useState("");

  const [difficulty, setDifficulty] =
    useState("INTERMEDIATE");

  const [library, setLibrary] =
    useState<Exercise[]>([]);

  const [selected, setSelected] =
    useState<SelectedExercise[]>([]);

  const [loadingLibrary, setLoadingLibrary] =
    useState(true);

  const [libraryError, setLibraryError] =
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
            item.exercise.id
        )
      ),
    [selected]
  );

  async function loadLibrary() {
    try {
      setLoadingLibrary(true);
      setLibraryError(null);

      const response =
        await api.get<ExercisesResponse>(
          "/exercises",
          telegramAuthOptions()
        );

      if (
        !response ||
        !Array.isArray(
          response.exercises
        )
      ) {
        throw new Error(
          "Invalid exercise library response"
        );
      }

      setLibrary(
        response.exercises
      );
    } catch (error) {
      console.error(
        "IRONAGE EXERCISE LIBRARY UI ERROR:",
        error
      );

      setLibraryError(
        error instanceof Error
          ? error.message
          : "Failed to load exercises"
      );
    } finally {
      setLoadingLibrary(false);
    }
  }

  useEffect(() => {
    void loadLibrary();
  }, []);

  function addExercise(
    exercise: Exercise
  ) {
    if (
      selectedIds.has(
        exercise.id
      )
    ) {
      return;
    }

    setSelected(
      (current) => [
        ...current,
        {
          exercise,
          sets: "3",
          repetitions: "10",
          restSeconds: "60",
          targetWeight: "",
          coachNotes: "",
        },
      ]
    );
  }

  function removeExercise(
    exerciseId: number
  ) {
    setSelected(
      (current) =>
        current.filter(
          (item) =>
            item.exercise.id !==
            exerciseId
        )
    );
  }

  function updateExercise(
    exerciseId: number,
    field:
      | "sets"
      | "repetitions"
      | "restSeconds"
      | "targetWeight"
      | "coachNotes",
    value: string
  ) {
    setSelected(
      (current) =>
        current.map(
          (item) =>
            item.exercise.id ===
            exerciseId
              ? {
                  ...item,
                  [field]: value,
                }
              : item
        )
    );
  }

  async function saveWorkout() {
    const normalizedName =
      name.trim();

    if (!normalizedName) {
      setSaveError(
        "Workout name is required."
      );
      return;
    }

    if (
      selected.length === 0
    ) {
      setSaveError(
        "Add at least one exercise."
      );
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);

      const payload = {
        name: normalizedName,

        description:
          description.trim() ||
          undefined,

        duration:
          duration
            ? Number(duration)
            : undefined,

        difficulty:
          difficulty ||
          undefined,

        exercises:
          selected.map(
            (item, index) => ({
              exerciseId:
                item.exercise.id,

              position:
                index + 1,

              sets:
                Number(
                  item.sets
                ),

              repetitions:
                Number(
                  item.repetitions
                ),

              restSeconds:
                Number(
                  item.restSeconds
                ),

              targetWeight:
                item.targetWeight
                  ? Number(
                      item.targetWeight
                    )
                  : undefined,

              coachNotes:
                item.coachNotes
                  .trim() ||
                undefined,
            })
          ),
      };

      const response =
        await api.post<CreateWorkoutResponse>(
          "/coach-workouts",
          payload,
          telegramAuthOptions()
        );

      if (
        !response?.success ||
        !response.workout
      ) {
        throw new Error(
          response?.message ||
            "Workout was not created"
        );
      }

      onCreated();
    } catch (error) {
      console.error(
        "IRONAGE CREATE WORKOUT UI ERROR:",
        error
      );

      setSaveError(
        error instanceof Error
          ? error.message
          : "Failed to create workout"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="create-workout">
      <div className="create-workout__content">

        <header className="create-workout__header">
          <button
            type="button"
            className="create-workout__back"
            onClick={onBack}
            aria-label="Back to workouts"
          >
            ←
          </button>

          <div>
            <span>
              IRONAGE COACH
            </span>

            <h1>
              CREATE WORKOUT
            </h1>

            <p>
              BUILD THE SESSION
            </p>
          </div>
        </header>

        <section className="create-workout__section">
          <div className="create-workout__section-title">
            <span>01</span>

            <div>
              <strong>
                WORKOUT DETAILS
              </strong>

              <small>
                DEFINE THE SESSION
              </small>
            </div>
          </div>

          <label className="create-workout__field">
            <span>
              WORKOUT NAME
            </span>

            <input
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="PUSH DAY"
            />
          </label>

          <label className="create-workout__field">
            <span>
              DESCRIPTION
            </span>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Chest, shoulders and triceps..."
              rows={3}
            />
          </label>

          <div className="create-workout__grid">
            <label className="create-workout__field">
              <span>
                DURATION / MIN
              </span>

              <input
                type="number"
                min="1"
                inputMode="numeric"
                value={duration}
                onChange={(event) =>
                  setDuration(
                    event.target.value
                  )
                }
                placeholder="60"
              />
            </label>

            <label className="create-workout__field">
              <span>
                DIFFICULTY
              </span>

              <select
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(
                    event.target.value
                  )
                }
              >
                <option value="BEGINNER">
                  BEGINNER
                </option>

                <option value="INTERMEDIATE">
                  INTERMEDIATE
                </option>

                <option value="ADVANCED">
                  ADVANCED
                </option>
              </select>
            </label>
          </div>
        </section>

        <section className="create-workout__section">
          <div className="create-workout__section-title">
            <span>02</span>

            <div>
              <strong>
                EXERCISE LIBRARY
              </strong>

              <small>
                SELECT MOVEMENTS
              </small>
            </div>
          </div>

          {loadingLibrary && (
            <div className="create-workout__state">
              LOADING EXERCISES...
            </div>
          )}

          {!loadingLibrary &&
            libraryError && (
              <div className="create-workout__state create-workout__state--error">
                <strong>
                  {libraryError}
                </strong>

                <button
                  type="button"
                  onClick={() =>
                    void loadLibrary()
                  }
                >
                  RETRY
                </button>
              </div>
            )}

          {!loadingLibrary &&
            !libraryError && (
              <div className="create-workout__library">
                {library.map(
                  (exercise) => {
                    const isSelected =
                      selectedIds.has(
                        exercise.id
                      );

                    return (
                      <button
                        key={
                          exercise.id
                        }
                        type="button"
                        className={
                          isSelected
                            ? "create-workout__exercise create-workout__exercise--selected"
                            : "create-workout__exercise"
                        }
                        disabled={
                          isSelected
                        }
                        onClick={() =>
                          addExercise(
                            exercise
                          )
                        }
                      >
                        <div>
                          <span>
                            {exercise.muscleGroup ||
                              "EXERCISE"}
                          </span>

                          <strong>
                            {exercise.name}
                          </strong>

                          <small>
                            {exercise.equipment ||
                              "NO EQUIPMENT"}
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
          <section className="create-workout__section">
            <div className="create-workout__section-title">
              <span>03</span>

              <div>
                <strong>
                  WORKOUT PLAN
                </strong>

                <small>
                  SET TRAINING TARGETS
                </small>
              </div>
            </div>

            <div className="create-workout__selected-list">
              {selected.map(
                (item, index) => (
                  <article
                    key={
                      item.exercise.id
                    }
                    className="create-workout__selected"
                  >
                    <div className="create-workout__selected-header">
                      <div>
                        <span>
                          EXERCISE{" "}
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <strong>
                          {item.exercise.name}
                        </strong>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeExercise(
                            item.exercise.id
                          )
                        }
                        aria-label={`Remove ${item.exercise.name}`}
                      >
                        ×
                      </button>
                    </div>

                    <div className="create-workout__metrics">
                      <label>
                        <span>
                          SETS
                        </span>

                        <input
                          type="number"
                          min="1"
                          inputMode="numeric"
                          value={
                            item.sets
                          }
                          onChange={(
                            event
                          ) =>
                            updateExercise(
                              item.exercise.id,
                              "sets",
                              event.target.value
                            )
                          }
                        />
                      </label>

                      <label>
                        <span>
                          REPS
                        </span>

                        <input
                          type="number"
                          min="1"
                          inputMode="numeric"
                          value={
                            item.repetitions
                          }
                          onChange={(
                            event
                          ) =>
                            updateExercise(
                              item.exercise.id,
                              "repetitions",
                              event.target.value
                            )
                          }
                        />
                      </label>

                      <label>
                        <span>
                          REST / SEC
                        </span>

                        <input
                          type="number"
                          min="1"
                          inputMode="numeric"
                          value={
                            item.restSeconds
                          }
                          onChange={(
                            event
                          ) =>
                            updateExercise(
                              item.exercise.id,
                              "restSeconds",
                              event.target.value
                            )
                          }
                        />
                      </label>
                    </div>

                    <label className="create-workout__field">
                      <span>
                        TARGET WEIGHT / KG
                      </span>

                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        inputMode="decimal"
                        value={
                          item.targetWeight
                        }
                        onChange={(
                          event
                        ) =>
                          updateExercise(
                            item.exercise.id,
                            "targetWeight",
                            event.target.value
                          )
                        }
                        placeholder="OPTIONAL"
                      />
                    </label>

                    <label className="create-workout__field">
                      <span>
                        COACH NOTES
                      </span>

                      <textarea
                        rows={2}
                        value={
                          item.coachNotes
                        }
                        onChange={(
                          event
                        ) =>
                          updateExercise(
                            item.exercise.id,
                            "coachNotes",
                            event.target.value
                          )
                        }
                        placeholder="Technique, tempo, intensity..."
                      />
                    </label>
                  </article>
                )
              )}
            </div>
          </section>
        )}

        {saveError && (
          <div className="create-workout__save-error">
            {saveError}
          </div>
        )}

        <button
          type="button"
          className="create-workout__save"
          disabled={saving}
          onClick={() =>
            void saveWorkout()
          }
        >
          <span>
            {saving
              ? "SAVING..."
              : "SAVE WORKOUT"}
          </span>

          <b>→</b>
        </button>

      </div>
    </main>
  );
}

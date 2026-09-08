import {
  useEffect,
  useMemo,
  useState,
} from "react";

import api, {
  telegramAuthOptions,
} from "../../api/client";

import { useLanguage } from "../../context/LanguageContext";

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
  const { t } = useLanguage();

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
          : t("createWorkout.failedLoad")
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
        t("createWorkout.nameRequired")
      );
      return;
    }

    if (
      selected.length === 0
    ) {
      setSaveError(
        t("createWorkout.addExercise")
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
            t("createWorkout.notCreated")
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
          : t("createWorkout.failedCreate")
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
            aria-label={t("createWorkout.back")}
          >
            ←
          </button>

          <div>
            <span>
              {t("createWorkout.coach")}
            </span>

            <h1>
              {t("createWorkout.title")}
            </h1>

            <p>
              {t("createWorkout.subtitle")}
            </p>
          </div>
        </header>

        <section className="create-workout__section">
          <div className="create-workout__section-title">
            <span>01</span>

            <div>
              <strong>
                {t("createWorkout.details")}
              </strong>

              <small>
                {t("createWorkout.defineSession")}
              </small>
            </div>
          </div>

          <label className="create-workout__field">
            <span>
              {t("createWorkout.name")}
            </span>

            <input
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder={t("createWorkout.namePlaceholder")}
            />
          </label>

          <label className="create-workout__field">
            <span>
              {t("createWorkout.description")}
            </span>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder={t("createWorkout.descriptionPlaceholder")}
              rows={3}
            />
          </label>

          <div className="create-workout__grid">
            <label className="create-workout__field">
              <span>
                {t("createWorkout.duration")}
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
                {t("createWorkout.difficulty")}
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
                  {t("createWorkout.beginner")}
                </option>

                <option value="INTERMEDIATE">
                  {t("createWorkout.intermediate")}
                </option>

                <option value="ADVANCED">
                  {t("createWorkout.advanced")}
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
                {t("createWorkout.exerciseLibrary")}
              </strong>

              <small>
                {t("createWorkout.selectMovements")}
              </small>
            </div>
          </div>

          {loadingLibrary && (
            <div className="create-workout__state">
              {t("createWorkout.loadingExercises")}
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
                  {t("common.retry")}
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
                              t("createWorkout.exercise")}
                          </span>

                          <strong>
                            {exercise.name}
                          </strong>

                          <small>
                            {exercise.equipment ||
                              t("createWorkout.noEquipment")}
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
                  {t("createWorkout.plan")}
                </strong>

                <small>
                  {t("createWorkout.targets")}
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
                          {t("createWorkout.exercise")}{" "}
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
                        aria-label={`${t("createWorkout.remove")} ${item.exercise.name}`}
                      >
                        ×
                      </button>
                    </div>

                    <div className="create-workout__metrics">
                      <label>
                        <span>
                          {t("createWorkout.sets")}
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
                          {t("createWorkout.reps")}
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
                          {t("createWorkout.rest")}
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
                        {t("createWorkout.targetWeight")}
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
                        placeholder={t("createWorkout.optional")}
                      />
                    </label>

                    <label className="create-workout__field">
                      <span>
                        {t("createWorkout.coachNotes")}
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
                        placeholder={t("createWorkout.notesPlaceholder")}
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
              ? t("createWorkout.saving")
              : t("createWorkout.save")}
          </span>

          <b>→</b>
        </button>

      </div>
    </main>
  );
}

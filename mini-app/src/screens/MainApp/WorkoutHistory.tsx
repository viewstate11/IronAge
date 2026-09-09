import {
  useMemo,
  useState,
} from "react";

import {
  useUser,
  type WorkoutHistoryItem,
} from "../../context/UserContext";

import {
  useLanguage,
} from "../../context/LanguageContext";

import "./WorkoutHistory.css";

type Props = {
  onBack: () => void;
};

function getLocale(
  language: string
): string {
  switch (language) {
    case "uk":
      return "uk-UA";
    case "ru":
      return "ru-RU";
    case "bg":
      return "bg-BG";
    case "de":
      return "de-DE";
    case "fr":
      return "fr-FR";
    case "es":
      return "es-ES";
    case "pt":
      return "pt-PT";
    default:
      return "en-US";
  }
}

function formatDate(
  value: string,
  locale: string
): string {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    locale,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

function totalWeight(
  workout: WorkoutHistoryItem
): number {
  return (
    workout.sets ?? []
  ).reduce(
    (total, set) => {
      const weight =
        typeof set.weight === "number"
          ? set.weight
          : 0;

      const reps =
        typeof set.repetitions === "number"
          ? set.repetitions
          : 0;

      return (
        total +
        weight * reps
      );
    },
    0
  );
}

export default function WorkoutHistory({
  onBack,
}: Props) {
  const { user } = useUser();

  const {
    language,
    t,
  } = useLanguage();

  const [
    expandedId,
    setExpandedId,
  ] = useState<
    string | number | null
  >(null);

  const locale =
    getLocale(language);

  const history =
    useMemo(
      () =>
        [...user.history].sort(
          (a, b) =>
            new Date(
              b.date
            ).getTime() -
            new Date(
              a.date
            ).getTime()
        ),
      [user.history]
    );

  const totalXp =
    history.reduce(
      (sum, item) =>
        sum +
        Number(
          item.xp || 0
        ),
      0
    );

  const totalSets =
    history.reduce(
      (sum, item) =>
        sum +
        (
          item.sets?.length ??
          0
        ),
      0
    );

  const totalDuration =
    history.reduce(
      (sum, item) =>
        sum +
        Number(
          item.duration || 0
        ),
      0
    );

  return (
    <main className="workout-history">
      <div className="workout-history__shell">

        <header className="workout-history__header">
          <button
            type="button"
            className="workout-history__back"
            onClick={onBack}
            aria-label={
              t("common.back")
            }
          >
            ←
          </button>

          <div>
            <span>
              IRONAGE
            </span>

            <h1>
              {t(
                "workoutHistory.title"
              )}
            </h1>

            <p>
              {t(
                "workoutHistory.subtitle"
              )}
            </p>
          </div>
        </header>

        <section className="workout-history__stats">
          <article>
            <span>
              {t(
                "workoutHistory.workouts"
              )}
            </span>

            <strong>
              {history.length}
            </strong>
          </article>

          <article>
            <span>
              {t(
                "workoutHistory.totalSets"
              )}
            </span>

            <strong>
              {totalSets}
            </strong>
          </article>

          <article>
            <span>
              {t(
                "workoutHistory.totalXp"
              )}
            </span>

            <strong>
              {totalXp}
            </strong>
          </article>

          <article>
            <span>
              {t(
                "workoutHistory.minutes"
              )}
            </span>

            <strong>
              {totalDuration}
            </strong>
          </article>
        </section>

        <section className="workout-history__section">
          <div className="workout-history__section-title">
            01 · {t(
              "workoutHistory.history"
            )}
          </div>

          {history.length === 0 && (
            <div className="workout-history__empty">
              <strong>
                {t(
                  "workoutHistory.emptyTitle"
                )}
              </strong>

              <span>
                {t(
                  "workoutHistory.emptyDescription"
                )}
              </span>
            </div>
          )}

          {history.map(
            workout => {
              const expanded =
                expandedId ===
                workout.id;

              const sets =
                workout.sets ?? [];

              const volume =
                totalWeight(
                  workout
                );

              return (
                <article
                  key={
                    workout.id
                  }
                  className="workout-history__card"
                >
                  <button
                    type="button"
                    className="workout-history__card-button"
                    onClick={() => {
                      setExpandedId(
                        expanded
                          ? null
                          : workout.id
                      );
                    }}
                  >
                    <div className="workout-history__card-main">
                      <span className="workout-history__date">
                        {formatDate(
                          workout.date,
                          locale
                        )}
                      </span>

                      <h2>
                        {workout.name}
                      </h2>

                      <div className="workout-history__meta">
                        <span>
                          {workout.duration}
                          {" "}
                          {t(
                            "workoutHistory.min"
                          )}
                        </span>

                        <span>
                          {sets.length}
                          {" "}
                          {t(
                            "workoutHistory.sets"
                          )}
                        </span>

                        <span>
                          +{workout.xp}
                          {" XP"}
                        </span>
                      </div>
                    </div>

                    <div className="workout-history__card-side">
                      <strong
                        className={
                          workout.completed
                            ? "workout-history__status workout-history__status--complete"
                            : "workout-history__status"
                        }
                      >
                        {workout.completed
                          ? t(
                              "workoutHistory.completed"
                            )
                          : t(
                              "workoutHistory.incomplete"
                            )}
                      </strong>

                      <span className="workout-history__chevron">
                        {expanded
                          ? "−"
                          : "+"}
                      </span>
                    </div>
                  </button>

                  {expanded && (
                    <div className="workout-history__details">

                      <div className="workout-history__detail-stats">
                        <div>
                          <span>
                            {t(
                              "workoutHistory.calories"
                            )}
                          </span>

                          <strong>
                            {workout.calories}
                          </strong>
                        </div>

                        <div>
                          <span>
                            {t(
                              "workoutHistory.volume"
                            )}
                          </span>

                          <strong>
                            {volume > 0
                              ? `${volume.toFixed(
                                  0
                                )} kg`
                              : "—"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            XP
                          </span>

                          <strong>
                            +{workout.xp}
                          </strong>
                        </div>
                      </div>

                      {sets.length === 0 ? (
                        <div className="workout-history__no-sets">
                          {t(
                            "workoutHistory.noSets"
                          )}
                        </div>
                      ) : (
                        <div className="workout-history__sets">
                          {sets.map(
                            (
                              set,
                              index
                            ) => (
                              <div
                                key={
                                  set.id ??
                                  `${workout.id}-${index}`
                                }
                                className="workout-history__set"
                              >
                                <div className="workout-history__set-name">
                                  <span>
                                    {String(
                                      set.setNumber ??
                                      index + 1
                                    ).padStart(
                                      2,
                                      "0"
                                    )}
                                  </span>

                                  <strong>
                                    {set.exerciseName}
                                  </strong>
                                </div>

                                <div className="workout-history__set-values">
                                  {typeof set.repetitions ===
                                    "number" && (
                                    <span>
                                      {
                                        set.repetitions
                                      }
                                      {" "}
                                      {t(
                                        "workoutHistory.reps"
                                      )}
                                    </span>
                                  )}

                                  {typeof set.weight ===
                                    "number" && (
                                    <span>
                                      {
                                        set.weight
                                      }
                                      {" kg"}
                                    </span>
                                  )}

                                  {typeof set.duration ===
                                    "number" && (
                                    <span>
                                      {
                                        set.duration
                                      }
                                      {" s"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            }
          )}
        </section>

      </div>
    </main>
  );
}

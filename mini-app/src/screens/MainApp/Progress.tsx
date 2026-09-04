import {
  useEffect,
  useMemo,
  useState,
} from "react";

import "./Progress.css";

import { useUser } from "../../context/UserContext";
import {
  useLanguage,
  type AppLanguage,
} from "../../context/LanguageContext";

const PROGRESS_LOCALES:
  Record<AppLanguage, string> = {
    en: "en-US",
    es: "es-ES",
    uk: "uk-UA",
    ru: "ru-RU",
    fr: "fr-FR",
    de: "de-DE",
    pt: "pt-PT",
    bg: "bg-BG",
  };

export default function Progress() {
  const { user } = useUser();
  const { language, t } = useLanguage();

  const history = Array.isArray(user.history)
    ? user.history
    : [];

  /* =========================================================
     DATE HELPERS
  ========================================================= */

  const [currentDate, setCurrentDate] =
    useState(() => new Date());

  useEffect(() => {
    const scheduleMidnightRefresh = () => {
      const now = new Date();

      const nextMidnight =
        new Date(now);

      nextMidnight.setHours(
        24,
        0,
        0,
        0
      );

      const delay =
        nextMidnight.getTime() -
        now.getTime() +
        1000;

      return window.setTimeout(() => {
        setCurrentDate(
          new Date()
        );
      }, delay);
    };

    const timeoutId =
      scheduleMidnightRefresh();

    return () => {
      window.clearTimeout(
        timeoutId
      );
    };
  }, [currentDate]);

  const startOfWeek = useMemo(() => {
    const day =
      currentDate.getDay() === 0
        ? 6
        : currentDate.getDay() - 1;

    const monday =
      new Date(currentDate);

    monday.setDate(
      currentDate.getDate() -
        day
    );

    monday.setHours(
      0,
      0,
      0,
      0
    );

    return monday;
  }, [currentDate]);

  const endOfWeek = useMemo(() => {
    const sunday = new Date(
      startOfWeek
    );

    sunday.setDate(
      startOfWeek.getDate() + 6
    );

    sunday.setHours(
      23,
      59,
      59,
      999
    );

    return sunday;
  }, [startOfWeek]);

  /* =========================================================
     WEEKLY WORKOUTS
  ========================================================= */

  const weeklyWorkouts = useMemo(() => {
    return history.filter((workout) => {
      const date = new Date(
        workout.date
      );

      return (
        date >= startOfWeek &&
        date <= endOfWeek &&
        workout.completed !== false
      );
    });
  }, [
    history,
    startOfWeek,
    endOfWeek,
  ]);

  /* =========================================================
     WEEKLY TARGET
  ========================================================= */

  const weeklyTarget = 4;

  const weeklyProgress = Math.min(
    100,
    Math.round(
      (weeklyWorkouts.length /
        weeklyTarget) *
        100
    )
  );

  /* =========================================================
     TOTAL WORKOUTS
  ========================================================= */

  const totalWorkouts =
    history.filter(
      (workout) =>
        workout.completed !== false
    ).length;

  /* =========================================================
     TOTAL TIME
  ========================================================= */

  const totalDurationSeconds =
    history.reduce(
      (total, workout) => {
        return (
          total +
          Number(
            workout.duration || 0
          )
        );
      },
      0
    );

  const totalHours = Math.floor(
    totalDurationSeconds / 3600
  );

  const totalMinutes = Math.floor(
    (totalDurationSeconds % 3600) /
      60
  );

  const formattedTotalTime =
    totalHours > 0
      ? `${totalHours}h ${String(
          totalMinutes
        ).padStart(2, "0")}m`
      : `${totalMinutes}m`;

  /* =========================================================
     TOTAL XP
  ========================================================= */

  const totalXp = Number(
    user.xp || 0
  );

  /* =========================================================
     XP LEVEL
  ========================================================= */

  const xpInLevel =
    totalXp % 1000;

  const xpProgress =
    Math.min(
      100,
      Math.round(
        (xpInLevel / 1000) * 100
      )
    );

  const xpToNextLevel =
    1000 - xpInLevel;

  /* =========================================================
     DAILY WORKOUT GRAPH
  ========================================================= */

  const weeklyChart = useMemo(() => {
    const days = [
      {
        label: t("progress.mon"),
        date: 0,
      },
      {
        label: t("progress.tue"),
        date: 1,
      },
      {
        label: t("progress.wed"),
        date: 2,
      },
      {
        label: t("progress.thu"),
        date: 3,
      },
      {
        label: t("progress.fri"),
        date: 4,
      },
      {
        label: t("progress.sat"),
        date: 5,
      },
      {
        label: t("progress.sun"),
        date: 6,
      },
    ];

    return days.map((day) => {
      const date =
        new Date(
          startOfWeek
        );

      date.setDate(
        startOfWeek.getDate() +
          day.date
      );

      const count =
        weeklyWorkouts.filter(
          (workout) => {
            const workoutDate =
              new Date(
                workout.date
              );

            return (
              workoutDate.getFullYear() ===
                date.getFullYear() &&
              workoutDate.getMonth() ===
                date.getMonth() &&
              workoutDate.getDate() ===
                date.getDate()
            );
          }
        ).length;

      return {
        ...day,
        count,
      };
    });
  }, [
    startOfWeek,
    weeklyWorkouts,
    t,
  ]);

  const maxChartValue =
    Math.max(
      1,
      ...weeklyChart.map(
        (day) => day.count
      )
    );

  /* =========================================================
     RECENT WORKOUTS
  ========================================================= */

  const recentWorkouts =
    useMemo(() => {
      return history
        .filter(
          (workout) =>
            workout.completed !== false
        )
        .sort(
          (a, b) =>
            new Date(
              b.date
            ).getTime() -
            new Date(
              a.date
            ).getTime()
        )
        .slice(0, 5);
    }, [history]);

  /* =========================================================
     SETS
  ========================================================= */

  /*
   * Current history items do not necessarily
   * contain sets. Therefore we safely support
   * future backend set data without breaking
   * the current UI.
   */

  const totalSets = history.reduce(
    (total, workout) => {
      const sets = (
        workout as typeof workout & {
          sets?: unknown[];
        }
      ).sets;

      return (
        total +
        (Array.isArray(sets)
          ? sets.length
          : 0)
      );
    },
    0
  );

  /* =========================================================
     LEVEL
  ========================================================= */

  const currentLevel =
    Number(user.level || 1);

  /* =========================================================
     DATE FORMAT
  ========================================================= */

  const formatDate = (
    value: string
  ) => {
    const date = new Date(
      value
    );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return t("progress.recent");
    }

    return date
      .toLocaleDateString(
        PROGRESS_LOCALES[language],
        {
          month: "short",
          day: "numeric",
        }
      )
      .toUpperCase();
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="progress-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="progress-header">

        <div>

          <span className="progress-eyebrow">
            {t("progress.performanceSystem")}
          </span>

          <h1>
            {t("progress.your")}
            <br />
            <span>{t("progress.title")}</span>
          </h1>

        </div>

        <div className="progress-level-badge">

          <span>
            {t("progress.level")}
          </span>

          <strong>
            {String(
              currentLevel
            ).padStart(
              2,
              "0"
            )}
          </strong>

        </div>

      </header>


      {/* =====================================================
          XP CARD
      ===================================================== */}

      <section className="progress-xp-card">

        <div className="progress-xp-top">

          <div>

            <span>
              {t("progress.currentLevel")}
            </span>

            <strong>
              {t("progress.level")}{" "}
              {String(
                currentLevel
              ).padStart(
                2,
                "0"
              )}
            </strong>

          </div>

          <div className="progress-xp-total">

            <span>
              {t("progress.totalXp")}
            </span>

            <strong>
              {totalXp.toLocaleString()}
            </strong>

          </div>

        </div>

        <div className="progress-xp-track">

          <div
            className="progress-xp-fill"
            style={{
              width: `${Math.max(
                xpProgress,
                xpInLevel > 0
                  ? 3
                  : 0
              )}%`,
            }}
          />

        </div>

        <div className="progress-xp-bottom">

          <span>
            {xpInLevel.toLocaleString()}
            {" / 1,000 XP"}
          </span>

          <span>
            {xpToNextLevel ===
            1000
              ? t("progress.levelUpAhead")
              : `${xpToNextLevel} ${t("progress.toNextLevel")}`}
          </span>

        </div>

      </section>


      {/* =====================================================
          STAT GRID
      ===================================================== */}

      <section className="progress-stat-grid">

        <article className="progress-stat-card">

          <span>
            {t("progress.workouts")}
          </span>

          <strong>
            {totalWorkouts}
          </strong>

          <small>
            {t("progress.allTime")}
          </small>

        </article>

        <article className="progress-stat-card">

          <span>
            {t("progress.thisWeek")}
          </span>

          <strong>
            {weeklyWorkouts.length}
            <small className="progress-stat-target">
              {" / "}
              {weeklyTarget}
            </small>
          </strong>

          <small>
            {t("progress.trainingTarget")}
          </small>

        </article>

        <article className="progress-stat-card">

          <span>
            {t("progress.totalTime")}
          </span>

          <strong className="progress-stat-time">
            {formattedTotalTime}
          </strong>

          <small>
            {t("progress.training")}
          </small>

        </article>

        <article className="progress-stat-card">

          <span>
            {t("progress.streak")}
          </span>

          <strong>
            {user.streak}
          </strong>

          <small>
            {user.streak === 1
              ? t("progress.day")
              : t("progress.days")}
          </small>

        </article>

      </section>


      {/* =====================================================
          WEEKLY CHART
      ===================================================== */}

      <section className="progress-section">

        <div className="progress-section-heading">

          <div>

            <span>
              {t("progress.thisWeek")}
            </span>

            <h2>
              {t("progress.trainingActivity")}
            </h2>

          </div>

          <strong>
            {weeklyProgress}%
          </strong>

        </div>

        <div className="progress-chart">

          {weeklyChart.map(
            (day) => {

              const height =
                day.count === 0
                  ? 4
                  : Math.max(
                      12,
                      Math.round(
                        (day.count /
                          maxChartValue) *
                          100
                      )
                    );

              return (
                <div
                  key={day.label}
                  className="progress-chart-day"
                >

                  <div className="progress-chart-value">

                    {day.count > 0
                      ? day.count
                      : ""}

                  </div>

                  <div className="progress-chart-column">

                    <div
                      className={`progress-chart-bar ${
                        day.count > 0
                          ? "is-active"
                          : ""
                      }`}
                      style={{
                        height: `${height}%`,
                      }}
                    />

                  </div>

                  <span>
                    {day.label}
                  </span>

                </div>
              );
            }
          )}

        </div>

        <div className="progress-week-footer">

          <span>
            {weeklyWorkouts.length}{" "}
            {t("progress.workouts")}
            {weeklyWorkouts.length ===
            1
              ? ""
              : "S"} COMPLETED
          </span>

          <span>
            {t("progress.target")}{" "}
            {weeklyTarget}
          </span>

        </div>

      </section>


      {/* =====================================================
          PERFORMANCE TOTALS
      ===================================================== */}

      <section className="progress-performance">

        <div className="progress-section-heading">

          <div>

            <span>
              {t("progress.performance")}
            </span>

            <h2>
              {t("progress.trainingVolume")}
            </h2>

          </div>

        </div>

        <div className="progress-performance-grid">

          <div>

            <span>
              {t("progress.totalSets")}
            </span>

            <strong>
              {totalSets}
            </strong>

          </div>

          <div>

            <span>
              TOTAL XP
            </span>

            <strong>
              {totalXp.toLocaleString()}
            </strong>

          </div>

          <div>

            <span>
              {t("progress.currentStreak")}
            </span>

            <strong>
              {user.streak}D
            </strong>

          </div>

        </div>

      </section>


      {/* =====================================================
          RECENT WORKOUTS
      ===================================================== */}

      <section className="progress-section">

        <div className="progress-section-heading">

          <div>

            <span>
              {t("progress.history")}
            </span>

            <h2>
              {t("progress.recentWorkouts")}
            </h2>

          </div>

        </div>

        {recentWorkouts.length ===
        0 ? (
          <div className="progress-empty">

            <span>
              {t("progress.noWorkouts")}
            </span>

            <p>
              {t("progress.emptyDescription")}
            </p>

          </div>
        ) : (
          <div className="progress-history">

            {recentWorkouts.map(
              (workout) => (
                <article
                  key={String(
                    workout.id
                  )}
                  className="progress-history-item"
                >

                  <div className="progress-history-main">

                    <span>
                      {formatDate(
                        workout.date
                      )}
                    </span>

                    <strong>
                      {workout.name}
                    </strong>

                  </div>

                  <div className="progress-history-meta">

                    <span>
                      {Math.floor(
                        Number(
                          workout.duration ||
                            0
                        ) / 60
                      )}{" "}
                      MIN
                    </span>

                    <strong>
                      +{workout.xp}
                      {" XP"}
                    </strong>

                  </div>

                </article>
              )
            )}

          </div>
        )}

      </section>


      {/* =====================================================
          MINDSET
      ===================================================== */}

      <section className="progress-mindset">

        <span>
          {t("progress.mindset")}
        </span>

        <h2>
          {t("progress.keep")}
          <br />
          <strong>
            {t("progress.building")}
          </strong>
        </h2>

        <p>
          {t("progress.quote")}
        </p>

      </section>

    </main>
  );
}
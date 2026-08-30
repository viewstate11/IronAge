import {
  useEffect,
  useMemo,
  useState,
} from "react";

import "./Progress.css";

import { useUser } from "../../context/UserContext";

export default function Progress() {
  const { user } = useUser();

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
        label: "MON",
        date: 0,
      },
      {
        label: "TUE",
        date: 1,
      },
      {
        label: "WED",
        date: 2,
      },
      {
        label: "THU",
        date: 3,
      },
      {
        label: "FRI",
        date: 4,
      },
      {
        label: "SAT",
        date: 5,
      },
      {
        label: "SUN",
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
      return "RECENT";
    }

    return date
      .toLocaleDateString(
        "en-US",
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
            IRONAGE / PERFORMANCE
          </span>

          <h1>
            YOUR
            <br />
            <span>PROGRESS.</span>
          </h1>

        </div>

        <div className="progress-level-badge">

          <span>
            LEVEL
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
              CURRENT LEVEL
            </span>

            <strong>
              LEVEL{" "}
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
              TOTAL XP
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
              ? "LEVEL UP AHEAD"
              : `${xpToNextLevel} XP TO NEXT LEVEL`}
          </span>

        </div>

      </section>


      {/* =====================================================
          STAT GRID
      ===================================================== */}

      <section className="progress-stat-grid">

        <article className="progress-stat-card">

          <span>
            WORKOUTS
          </span>

          <strong>
            {totalWorkouts}
          </strong>

          <small>
            ALL TIME
          </small>

        </article>

        <article className="progress-stat-card">

          <span>
            THIS WEEK
          </span>

          <strong>
            {weeklyWorkouts.length}
            <small className="progress-stat-target">
              {" / "}
              {weeklyTarget}
            </small>
          </strong>

          <small>
            TRAINING TARGET
          </small>

        </article>

        <article className="progress-stat-card">

          <span>
            TOTAL TIME
          </span>

          <strong className="progress-stat-time">
            {formattedTotalTime}
          </strong>

          <small>
            TRAINING
          </small>

        </article>

        <article className="progress-stat-card">

          <span>
            STREAK
          </span>

          <strong>
            {user.streak}
          </strong>

          <small>
            {user.streak === 1
              ? "DAY"
              : "DAYS"}
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
              THIS WEEK
            </span>

            <h2>
              Training Activity
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
            WORKOUT
            {weeklyWorkouts.length ===
            1
              ? ""
              : "S"} COMPLETED
          </span>

          <span>
            TARGET{" "}
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
              PERFORMANCE
            </span>

            <h2>
              Training Volume
            </h2>

          </div>

        </div>

        <div className="progress-performance-grid">

          <div>

            <span>
              TOTAL SETS
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
              CURRENT STREAK
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
              HISTORY
            </span>

            <h2>
              Recent Workouts
            </h2>

          </div>

        </div>

        {recentWorkouts.length ===
        0 ? (
          <div className="progress-empty">

            <span>
              NO WORKOUTS YET
            </span>

            <p>
              Complete your first
              workout to start
              building your
              performance history.
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
          IRONAGE / MINDSET
        </span>

        <h2>
          KEEP
          <br />
          <strong>
            BUILDING.
          </strong>
        </h2>

        <p>
          Progress is not about
          perfection. It is about
          showing up again.
        </p>

      </section>

    </main>
  );
}
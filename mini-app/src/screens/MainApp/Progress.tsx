import "./Progress.css";

import { useUser } from "../../context/UserContext";

export default function Progress() {
  const { user } = useUser();

  const XP_PER_LEVEL = 1000;

  const currentLevelXP = user.xp % XP_PER_LEVEL;

  const xpProgress = Math.min(
    (currentLevelXP / XP_PER_LEVEL) * 100,
    100
  );

  // =========================
  // WEEKLY ACTIVITY
  // =========================

  const weeklyXP = [
    { day: "ПН", xp: 0 },
    { day: "ВТ", xp: 0 },
    { day: "СР", xp: 0 },
    { day: "ЧТ", xp: 0 },
    { day: "ПТ", xp: 0 },
    { day: "СБ", xp: 0 },
    { day: "НД", xp: 0 },
  ];

  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  user.history.forEach((workout) => {
    const workoutDate = new Date(workout.date);

    const workoutDay = new Date(
      workoutDate.getFullYear(),
      workoutDate.getMonth(),
      workoutDate.getDate()
    );

    const diff =
      startOfToday.getTime() -
      workoutDay.getTime();

    const daysAgo = Math.floor(
      diff / (1000 * 60 * 60 * 24)
    );

    if (daysAgo >= 0 && daysAgo < 7) {
      const dayIndex =
        (workoutDay.getDay() + 6) % 7;

      weeklyXP[dayIndex].xp += workout.xp;
    }
  });

  const totalWeeklyXP = weeklyXP.reduce(
    (total, item) => total + item.xp,
    0
  );

  const maxXP = Math.max(
    ...weeklyXP.map((item) => item.xp),
    1
  );

  return (
    <div className="progress-page">

      {/* HEADER */}

      <header className="progress-header">

        <div>
          <p className="progress-label">
            IRONAGE PROGRESS
          </p>

          <h1>
            Твій прогрес
          </h1>

          <p>
            Кожне тренування наближає тебе
            до кращої версії себе.
          </p>
        </div>

        <div className="progress-level">
          ⚔️

          <span>
            LVL {user.level}
          </span>
        </div>

      </header>


      {/* XP */}

      <section className="progress-xp-card">

        <div className="xp-card-header">

          <div>
            <span>
              ЗАГАЛЬНИЙ ДОСВІД
            </span>

            <strong>
              {user.xp} XP
            </strong>
          </div>

          <div className="xp-level">
            LEVEL {user.level}
          </div>

        </div>

        <div className="progress-track">

          <div
            className="progress-fill"
            style={{
              width: `${xpProgress}%`,
            }}
          />

        </div>

        <div className="xp-bottom">

          <span>
            {currentLevelXP} / {XP_PER_LEVEL} XP
          </span>

          <span>
            {Math.max(
              XP_PER_LEVEL - currentLevelXP,
              0
            )}{" "}
            XP до наступного рівня
          </span>

        </div>

      </section>


      {/* STATS */}

      <section className="progress-stats">

        <div className="progress-stat">

          <span className="stat-icon">
            🔥
          </span>

          <strong>
            {user.streak}
          </strong>

          <small>
            STREAK
          </small>

        </div>


        <div className="progress-stat">

          <span className="stat-icon">
            💪
          </span>

          <strong>
            {user.workouts}
          </strong>

          <small>
            ТРЕНУВАНЬ
          </small>

        </div>


        <div className="progress-stat">

          <span className="stat-icon">
            ⚔️
          </span>

          <strong>
            {user.level}
          </strong>

          <small>
            РІВЕНЬ
          </small>

        </div>

      </section>


      {/* WEEKLY ACTIVITY */}

      <section className="activity-card">

        <div className="section-title">

          <div>
            <span>
              АКТИВНІСТЬ
            </span>

            <h2>
              Цього тижня
            </h2>
          </div>

          <strong>
            {totalWeeklyXP} XP
          </strong>

        </div>


        <div className="weekly-chart">

          {weeklyXP.map((item) => {

            const height =
              item.xp > 0
                ? (item.xp / maxXP) * 100
                : 0;

            return (
              <div
                className="chart-column"
                key={item.day}
              >

                <div className="chart-value">
                  {item.xp > 0
                    ? item.xp
                    : ""}
                </div>

                <div className="chart-bar">

                  <div
                    className="chart-fill"
                    style={{
                      height: `${height}%`,
                    }}
                  />

                </div>

                <span>
                  {item.day}
                </span>

              </div>
            );
          })}

        </div>

      </section>


      {/* HISTORY */}

      <section className="recent-section">

        <div className="section-title">

          <div>
            <span>
              ІСТОРІЯ
            </span>

            <h2>
              Останні тренування
            </h2>
          </div>

        </div>


        <div className="workout-history">

          {user.history.length === 0 ? (

            <div className="empty-history">

              <span>
                ⚔️
              </span>

              <strong>
                Тренувань ще немає
              </strong>

              <small>
                Заверши своє перше тренування,
                і воно з'явиться тут.
              </small>

            </div>

          ) : (

            user.history
              .slice(0, 10)
              .map((workout) => (

                <div
                  className="history-item"
                  key={workout.id}
                >

                  <div className="history-icon">
                    🔥
                  </div>

                  <div>

                    <strong>
                      {workout.name}
                    </strong>

                    <span>
                      {workout.duration} хв
                    </span>

                  </div>

                  <b>
                    +{workout.xp} XP
                  </b>

                </div>

              ))

          )}

        </div>

      </section>


      {/* MOTIVATION */}

      <section className="motivation-card">

        <div className="motivation-icon">
          ⚔️
        </div>

        <div>

          <strong>
            ПРАВИЛО IRONAGE
          </strong>

          <p>
            Результат не з'являється за один день.
            Але кожен день створює результат.
          </p>

        </div>

      </section>

    </div>
  );
}
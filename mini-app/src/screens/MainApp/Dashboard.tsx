import { useMemo } from "react";

import { useUser } from "../../context/UserContext";
import { useLanguage } from "../../context/LanguageContext";

import "./Dashboard.css";

import vasylPhoto from "../../assets/vasyl-ua.jpg";

type Props = {
  changeTab: (nextTab: string) => void;
  startWorkout: (workoutId: string) => void;
};

export default function Dashboard({
  changeTab,
  startWorkout,
}: Props) {
  const { user } = useUser();
  const { t } = useLanguage();

  /*
   * USER
   */

  const displayName =
    user.name?.trim() || t("dashboard.athlete");

  /*
   * XP
   */

  const xpInLevel =
    user.xp % 1000;

  const xpProgress =
    (xpInLevel / 1000) * 100;

  /*
   * LAST WORKOUT
   */

  const lastWorkout = useMemo(() => {
    if (!user.history.length) {
      return null;
    }

    return user.history[0];
  }, [user.history]);

  /*
   * TODAY STATUS
   */

  const today =
    new Date()
      .toISOString()
      .slice(0, 10);

  const trainedToday =
    user.history.some((workout) =>
      workout.date.startsWith(today)
    );

  return (
    <main className="dashboard">

      {/* =================================
          HERO
      ================================= */}

      <section className="dashboard-hero">

        <img
          src={vasylPhoto}
          alt={t("dashboard.athlete")}
          className="dashboard-hero-image"
        />

        <div className="dashboard-hero-overlay" />

        <div className="dashboard-hero-content">

          {/* HEADER */}

          <header className="dashboard-header">

            <div>

              <div className="dashboard-logo">
                IRON<span>AGE</span>
              </div>

              <div className="dashboard-edition">
                {t("dashboard.athleteSystem")}
              </div>

            </div>

            <button
              className="dashboard-avatar"
              onClick={() =>
                changeTab("profile")
              }
              type="button"
              aria-label={t("dashboard.openProfile")}
            >
              <img
                src={vasylPhoto}
                alt={displayName}
              />
            </button>

          </header>


          {/* HERO COPY */}

          <div className="dashboard-hero-copy">

            <span className="dashboard-eyebrow">
              {trainedToday
                ? t("dashboard.missionComplete")
                : t("dashboard.welcomeBack")}
            </span>

            <h1>

              {displayName.toUpperCase()}

              <br />

              <strong>
                {t("dashboard.build")}
              </strong>

            </h1>

            <p>
              {t("dashboard.disciplineToday")}
              <br />
              {t("dashboard.strengthTomorrow")}
            </p>

          </div>


          {/* START */}

          <button
            className="dashboard-start"
            type="button"
            onClick={() =>
              startWorkout("upper")
            }
          >

            <span>
              {trainedToday
                ? t("dashboard.trainAgain")
                : t("dashboard.startToday")}
            </span>

            <strong>
              →
            </strong>

          </button>

        </div>

      </section>


      {/* =================================
          USER STATS
      ================================= */}

      <section className="dashboard-stats">

        <div className="dashboard-stat">

          <span>
            {t("dashboard.streak")}
          </span>

          <strong>
            {String(
              user.streak
            ).padStart(2, "0")}
          </strong>

          <small>
            {t("dashboard.days")}
          </small>

        </div>


        <div className="dashboard-stat">

          <span>
            {t("dashboard.level")}
          </span>

          <strong>
            {String(
              user.level
            ).padStart(2, "0")}
          </strong>

          <small>
            {t("dashboard.current")}
          </small>

        </div>


        <div className="dashboard-stat">

          <span>
            XP
          </span>

          <strong>
            {user.xp.toLocaleString()}
          </strong>

          <small>
            {t("dashboard.points")}
          </small>

        </div>

      </section>


      {/* =================================
          XP PROGRESS
      ================================= */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">

          <div>

            <span>
              {t("dashboard.athleteLevel")}
            </span>

            <h2>
              {t("dashboard.levelPrefix")} {user.level}
            </h2>

          </div>

          <strong className="dashboard-xp-value">
            {xpInLevel} / 1000 XP
          </strong>

        </div>


        <div className="dashboard-xp-track">

            <div
              className="dashboard-xp-fill"
              style={{
                width: `${Math.max(
                  3,
                  xpProgress
                )}%`,
              }}
            />

        </div>

      </section>


      {/* =================================
          TODAY'S MISSION
      ================================= */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">

          <div>

            <span>
              {t("dashboard.yourProgram")}
            </span>

            <h2>
              {t("dashboard.todayMission")}
            </h2>

          </div>

          <button
            type="button"
            onClick={() =>
              changeTab("workout")
            }
          >
            {t("dashboard.viewAll")}
          </button>

        </div>


        <button
          type="button"
          className="dashboard-mission"
          onClick={() =>
            startWorkout("upper")
          }
        >

          <div className="mission-number">
            01
          </div>

          <div className="mission-info">

            <span>
              {t("dashboard.program")}
            </span>

            <h3>
              {t("dashboard.upperBody")}
            </h3>

            <p>
              {t("dashboard.chestShouldersArms")}
            </p>

          </div>

          <div className="mission-arrow">
            →
          </div>

        </button>

      </section>


      {/* =================================
          LAST WORKOUT
      ================================= */}

      {lastWorkout && (
        <section className="dashboard-section">

          <div className="dashboard-section-heading">

            <div>

              <span>
                {t("dashboard.trainingHistory")}
              </span>

              <h2>
                {t("dashboard.lastWorkout")}
              </h2>

            </div>

            <button
              type="button"
              onClick={() =>
                changeTab("progress")
              }
            >
              {t("dashboard.progress")}
            </button>

          </div>


          <div className="dashboard-mission dashboard-mission--static">

            <div className="mission-number">
              ✓
            </div>

            <div className="mission-info">

              <span>
                {t("dashboard.completed")}
              </span>

              <h3>
                {lastWorkout.name}
              </h3>

              <p>
                {lastWorkout.duration} {t("dashboard.min")}
                {" • "}
                +{lastWorkout.xp} XP
              </p>

            </div>

            <div className="mission-arrow">
              →
            </div>

          </div>

        </section>
      )}


      {/* =================================
          DAILY QUOTE
      ================================= */}

      <section className="dashboard-quote">

        <div className="quote-accent" />

        <p>
          {t("dashboard.quote1")}
          <br />
          {t("dashboard.quote2")}
          <br />

          <strong>
            {t("dashboard.quote3")}
          </strong>
        </p>

        <span>
          {t("dashboard.principle")}
        </span>

      </section>


      {/* =================================
          QUICK ACCESS
      ================================= */}

      <section className="dashboard-quick">

        <button
          type="button"
          onClick={() =>
            changeTab("progress")
          }
        >
          <span>
            {t("dashboard.progress")}
          </span>

          <strong>
            →
          </strong>

        </button>


        <button
          type="button"
          onClick={() =>
            changeTab("nutrition")
          }
        >
          <span>
            {t("dashboard.nutrition")}
          </span>

          <strong>
            →
          </strong>

        </button>


        <button
          type="button"
          onClick={() =>
            changeTab("ai")
          }
        >
          <span>
            {t("dashboard.aiTrainer")}
          </span>

          <strong>
            →
          </strong>

        </button>

      </section>

    </main>
  );
}

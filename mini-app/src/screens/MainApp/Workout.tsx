import { useMemo } from "react";

import { useUser } from "../../context/UserContext";
import { useLanguage } from "../../context/LanguageContext";

import {
  workoutPrograms,
} from "../../services/workoutService";

import "./Workout.css";

import vasylPhoto from "../../assets/vasyl-ua.jpg";

type Props = {
  changeTab: (nextTab: string) => void;
  startWorkout: (workoutId: string) => void;
};

/* =========================================================
   WORKOUT PRESENTATION DATA
========================================================= */



/* =========================================================
   COMPONENT
========================================================= */

export default function Workout({
  startWorkout,
}: Props) {
  const { user } = useUser();
  const { t } = useLanguage();

  /* =======================================================
     WORKOUT LIST
  ======================================================= */

  const workouts = useMemo(() => {
    return workoutPrograms.map(
      (workout, index) => {
        const presentation =
          workout.id === "upper"
            ? {
                meta:
                  t("workout.today45"),
                title:
                  t("workout.upperTitle"),
                description:
                  t("workout.upperDescription"),
              }
            : workout.id === "lower"
              ? {
                  meta:
                    t("workout.48min"),
                  title:
                    t("workout.lowerTitle"),
                  description:
                    t("workout.lowerDescription"),
                }
              : workout.id === "full"
                ? {
                    meta:
                      t("workout.52min"),
                    title:
                      t("workout.fullTitle"),
                    description:
                      t("workout.fullDescription"),
                  }
                : null;

        return {
          ...workout,

          number: String(
            index + 1
          ).padStart(2, "0"),

          title:
            presentation?.title ??
            workout.title,

          meta:
            presentation?.meta ??
            "",

          description:
            presentation?.description ??
            workout.description ??
            "",

          active:
            index === 0,
        };
      }
    );
  }, [t]);

  /* =======================================================
     COMPLETED WORKOUTS
  ======================================================= */

  const completedWorkouts =
    user.history.length;

  /* =======================================================
     WEEKLY PROGRESS
  ======================================================= */

  const weeklyProgress = useMemo(() => {
    const now = new Date();

    const currentDay =
      now.getDay() === 0
        ? 6
        : now.getDay() - 1;

    const monday =
      new Date(now);

    monday.setDate(
      now.getDate() -
        currentDay
    );

    monday.setHours(
      0,
      0,
      0,
      0
    );

    return user.history.filter(
      (workout) => {
        const workoutDate =
          new Date(
            workout.date
          );

        return (
          !Number.isNaN(
            workoutDate.getTime()
          ) &&
          workoutDate >= monday
        );
      }
    ).length;
  }, [user.history]);

  /* =======================================================
     WEEKLY TARGET
  ======================================================= */

  const weeklyTarget = 4;

  /* =======================================================
     PROGRESS
  ======================================================= */

  const progress =
    Math.min(
      100,
      Math.round(
        (weeklyProgress /
          weeklyTarget) *
          100
      )
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="workout-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="workout-hero">

        <img
          src={vasylPhoto}
          alt={t("dashboard.athlete")}
          className="workout-hero-image"
        />

        <div className="workout-hero-overlay" />

        <div className="workout-hero-content">

          <div className="workout-top">

            <div>

              <span className="workout-eyebrow">
                {t("workout.program")}
              </span>

              <h1>
                {t("workout.your")}
                <br />
                <span>
                  {t("workout.workouts")}
                </span>
              </h1>

            </div>

            <span className="workout-counter">
              {String(
                workouts.length
              ).padStart(2, "0")}{" "}
              / 12
            </span>

          </div>

          <div className="workout-hero-bottom">

            <div className="workout-status">

              <span className="workout-status-dot" />

              {t("workout.systemActive")}

            </div>

            <p className="workout-intro">
              {t("workout.trainPurpose")}
              <br />
              {t("workout.buildStronger")}
            </p>

          </div>

        </div>

      </section>

      {/* =================================================
          PROGRAM
      ================================================= */}

      <section className="workout-program">

        <div className="workout-section-heading">

          <div>

            <span className="workout-heading-label">
              {t("workout.thisWeek")}
            </span>

            <h2>
              {t("workout.trainingProgram")}
            </h2>

          </div>

          <span className="workout-week">
            {t("workout.week")}
          </span>

        </div>

        <div className="workout-list">

          {workouts.map(
            (workout) => (
              <button
                key={workout.id}
                type="button"
                className={`workout-card ${
                  workout.active
                    ? "workout-card-active"
                    : ""
                }`}
                onClick={() =>
                  startWorkout(
                    workout.id
                  )
                }
              >

                <div className="workout-card-number">
                  {workout.number}
                </div>

                <div className="workout-card-info">

                  <span>
                    {workout.meta}
                  </span>

                  <h3>
                    {workout.title}
                  </h3>

                  <p>
                    {workout.description}
                  </p>

                </div>

                <div className="workout-card-arrow">
                  →
                </div>

              </button>
            )
          )}

        </div>

      </section>

      {/* =================================================
          WEEKLY PROGRESS
      ================================================= */}

      <section className="workout-progress">

        <div className="workout-progress-header">

          <span>
            {t("workout.weeklyProgress")}
          </span>

          <strong>
            {weeklyProgress} /{" "}
            {weeklyTarget}
          </strong>

        </div>

        <div className="workout-progress-bar">

          <div
            className="workout-progress-fill"
            style={{
              width: `${Math.max(
                progress,
                weeklyProgress > 0
                  ? 3
                  : 0
              )}%`,
            }}
          />

        </div>

        <div className="workout-progress-footer">

          <span>
            {completedWorkouts === 0
              ? t("workout.startJourney")
              : `${completedWorkouts} WORKOUT${
                  completedWorkouts === 1
                    ? ""
                    : "S"
                } ${t("workout.completed")}`}
          </span>

          <span>
            {progress}%
          </span>

        </div>

      </section>

      {/* =================================================
          QUOTE
      ================================================= */}

      <section className="workout-quote">

        <span>
          {t("workout.mindset")}
        </span>

        <h2>
          {t("workout.no")}
          <strong>
            {t("workout.excuses")}
          </strong>
        </h2>

        <p>
          {t("workout.quote")}
        </p>

      </section>

    </main>
  );
}
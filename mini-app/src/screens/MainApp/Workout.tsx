import { useMemo } from "react";

import { useUser } from "../../context/UserContext";

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

const workoutMeta: Record<
  string,
  {
    meta: string;
    description: string;
  }
> = {
  upper: {
    meta: "TODAY / 45 MIN",
    description:
      "Chest • Shoulders • Arms",
  },

  lower: {
    meta: "48 MIN",
    description:
      "Legs • Glutes • Core",
  },

  full: {
    meta: "52 MIN",
    description:
      "Strength • Power • Conditioning",
  },
};

/* =========================================================
   COMPONENT
========================================================= */

export default function Workout({
  startWorkout,
}: Props) {
  const { user } = useUser();

  /* =======================================================
     WORKOUT LIST
  ======================================================= */

  const workouts = useMemo(() => {
    return workoutPrograms.map(
      (workout, index) => {
        const presentation =
          workoutMeta[workout.id];

        return {
          ...workout,

          number: String(
            index + 1
          ).padStart(2, "0"),

          meta:
            presentation?.meta ??
            "WORKOUT",

          description:
            presentation?.description ??
            "Strength • Conditioning",

          active:
            index === 0,
        };
      }
    );
  }, []);

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
          alt="IRONAGE athlete"
          className="workout-hero-image"
        />

        <div className="workout-hero-overlay" />

        <div className="workout-hero-content">

          <div className="workout-top">

            <div>

              <span className="workout-eyebrow">
                IRONAGE PROGRAM
              </span>

              <h1>
                YOUR
                <br />
                <span>
                  WORKOUTS.
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

              SYSTEM ACTIVE

            </div>

            <p className="workout-intro">
              Train with purpose.
              <br />
              Build something stronger.
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
              THIS WEEK
            </span>

            <h2>
              Training Program
            </h2>

          </div>

          <span className="workout-week">
            WEEK 01
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
            WEEKLY PROGRESS
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
              ? "START YOUR JOURNEY"
              : `${completedWorkouts} WORKOUT${
                  completedWorkouts === 1
                    ? ""
                    : "S"
                } COMPLETED`}
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
          IRONAGE / MINDSET
        </span>

        <h2>
          NO
          <strong>
            EXCUSES.
          </strong>
        </h2>

        <p>
          Discipline creates the
          version of you that others
          cannot stop.
        </p>

      </section>

    </main>
  );
}
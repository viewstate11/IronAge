import { useMemo } from "react";

import { useUser } from "../../context/UserContext";

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

  /*
   * USER
   */

  const displayName =
    user.name?.trim() || "ATHLETE";

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
          alt="IRONAGE athlete"
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
                ATHLETE SYSTEM / 01
              </div>

            </div>

            <button
              className="dashboard-avatar"
              onClick={() =>
                changeTab("profile")
              }
              type="button"
              aria-label="Open profile"
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
                ? "MISSION COMPLETE"
                : "WELCOME BACK"}
            </span>

            <h1>

              {displayName.toUpperCase()}

              <br />

              <strong>
                BUILD.
              </strong>

            </h1>

            <p>
              Discipline today.
              <br />
              Strength tomorrow.
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
                ? "TRAIN AGAIN"
                : "START TODAY'S WORKOUT"}
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
            STREAK
          </span>

          <strong>
            {String(
              user.streak
            ).padStart(2, "0")}
          </strong>

          <small>
            DAYS
          </small>

        </div>


        <div className="dashboard-stat">

          <span>
            LEVEL
          </span>

          <strong>
            {String(
              user.level
            ).padStart(2, "0")}
          </strong>

          <small>
            CURRENT
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
            POINTS
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
              ATHLETE LEVEL
            </span>

            <h2>
              Level {user.level}
            </h2>

          </div>

          <strong
            style={{
              color: "#D4AF37",
              fontSize: "8px",
              letterSpacing: "0.12em",
            }}
          >
            {xpInLevel} / 1000 XP
          </strong>

        </div>


        <div
          style={{
            width: "100%",
            height: "4px",
            background:
              "rgba(255,255,255,0.10)",
            overflow: "hidden",
          }}
        >

          <div
            style={{
              width: `${Math.max(
                3,
                xpProgress
              )}%`,
              height: "100%",
              background: "#D4AF37",
              boxShadow:
                "0 0 14px rgba(212,175,55,0.65)",
              transition:
                "width 300ms ease",
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
              YOUR PROGRAM
            </span>

            <h2>
              Today's Mission
            </h2>

          </div>

          <button
            type="button"
            onClick={() =>
              changeTab("workout")
            }
          >
            VIEW ALL
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
              IRONAGE / PROGRAM
            </span>

            <h3>
              UPPER BODY
            </h3>

            <p>
              Chest • Shoulders • Arms
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
                TRAINING HISTORY
              </span>

              <h2>
                Last Workout
              </h2>

            </div>

            <button
              type="button"
              onClick={() =>
                changeTab("progress")
              }
            >
              PROGRESS
            </button>

          </div>


          <div
            className="dashboard-mission"
            style={{
              cursor: "default",
            }}
          >

            <div className="mission-number">
              ✓
            </div>

            <div className="mission-info">

              <span>
                COMPLETED
              </span>

              <h3>
                {lastWorkout.name}
              </h3>

              <p>
                {lastWorkout.duration} min
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
          THE BODY ACHIEVES
          <br />
          WHAT THE MIND
          <br />

          <strong>
            REFUSES TO GIVE UP ON.
          </strong>
        </p>

        <span>
          IRONAGE PRINCIPLE / 001
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
            PROGRESS
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
            NUTRITION
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
            AI TRAINER
          </span>

          <strong>
            →
          </strong>

        </button>

      </section>

    </main>
  );
}
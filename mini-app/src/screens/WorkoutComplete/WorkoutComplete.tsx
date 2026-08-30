import "./WorkoutComplete.css";

import { useUser } from "../../context/UserContext";

export type WorkoutResult = {
  workoutId: string;
  workoutTitle: string;
  durationSeconds: number;
  exercisesCompleted: number;
  setsCompleted: number;
  xp: number;
};

type Props = {
  changeTab: (nextTab: string) => void;
  workoutId: string;
  result: WorkoutResult;
};

export default function WorkoutComplete({
  changeTab,
  result,
}: Props) {
  const { user } = useUser();

  /* =========================================================
     TIME
  ========================================================= */

  const minutes = Math.floor(
    result.durationSeconds / 60
  );

  const seconds =
    result.durationSeconds % 60;

  const formattedTime =
    `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;


  /* =========================================================
     XP / LEVEL
  ========================================================= */

  const xpInLevel =
    user.xp % 1000;

  const xpProgress =
    Math.min(
      100,
      (xpInLevel / 1000) * 100
    );

  const xpToNextLevel =
    1000 - xpInLevel;


  /* =========================================================
     NAVIGATION
  ========================================================= */

  const openProgress = () => {
    changeTab("progress");
  };

  const openDashboard = () => {
    changeTab("home");
  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="complete-page">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        className="complete-background"
        aria-hidden="true"
      />

      <div
        className="complete-overlay"
        aria-hidden="true"
      />


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="complete-content">


        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="complete-header">

          <div className="complete-brand">
            IRON
            <span>AGE</span>
          </div>

          <span className="complete-label">
            SESSION COMPLETE
          </span>

        </header>


        {/* ===================================================
            MAIN
        =================================================== */}

        <div className="complete-main">


          {/* =================================================
              SUCCESS CHECK
          ================================================= */}

          <div
            className="complete-check"
            aria-label="Workout completed"
          >
            ✓
          </div>


          {/* =================================================
              EYEBROW
          ================================================= */}

          <span className="complete-eyebrow">
            WORKOUT FINISHED
          </span>


          {/* =================================================
              TITLE
          ================================================= */}

          <h1>
            YOU
            <br />
            <span>
              DID IT.
            </span>
          </h1>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <p>
            {result.workoutTitle}
            <br />
            Another step forward.
          </p>


          {/* =================================================
              STATS
          ================================================= */}

          <div className="complete-stats">


            {/* TIME */}

            <div className="complete-stat">

              <span>
                TIME
              </span>

              <strong>
                {formattedTime}
              </strong>

            </div>


            {/* EXERCISES */}

            <div className="complete-stat">

              <span>
                EXERCISES
              </span>

              <strong>
                {String(
                  result.exercisesCompleted
                ).padStart(2, "0")}
              </strong>

            </div>


            {/* XP */}

            <div className="complete-stat">

              <span>
                XP
              </span>

              <strong>
                +{result.xp}
              </strong>

            </div>

          </div>


          {/* =================================================
              XP PROGRESS
          ================================================= */}

          <section className="complete-xp">

            <div className="complete-xp-top">


              {/* CURRENT LEVEL */}

              <div>

                <span>
                  CURRENT LEVEL
                </span>

                <strong>
                  LEVEL{" "}
                  {String(
                    user.level
                  ).padStart(2, "0")}
                </strong>

              </div>


              {/* TOTAL XP */}

              <div className="complete-level">

                <span>
                  TOTAL XP
                </span>

                <strong>
                  {user.xp.toLocaleString()}
                </strong>

              </div>

            </div>


            {/* XP TRACK */}

            <div className="complete-xp-track">

              <div
                className="complete-xp-fill"
                style={{
                  width: `${
                    xpProgress > 0
                      ? Math.max(3, xpProgress)
                      : 0
                  }%`,
                }}
              />

            </div>


            {/* XP META */}

            <div className="complete-xp-bottom">

              <span>
                {xpInLevel.toLocaleString()}
                {" / 1,000 XP"}
              </span>

              <span>
                {xpToNextLevel === 1000
                  ? "LEVEL UP AHEAD"
                  : `${xpToNextLevel} XP TO NEXT LEVEL`}
              </span>

            </div>

          </section>


          {/* =================================================
              STREAK
          ================================================= */}

          <section className="complete-streak">

            <div
              className="complete-streak-icon"
              aria-hidden="true"
            >
              🔥
            </div>

            <div>

              <span>
                CURRENT STREAK
              </span>

              <strong>
                {user.streak}{" "}
                {user.streak === 1
                  ? "DAY"
                  : "DAYS"}
              </strong>

            </div>

          </section>


          {/* =================================================
              QUOTE
          ================================================= */}

          <div className="complete-quote">

            <span>
              IRONAGE MINDSET
            </span>

            <p>
              DISCIPLINE
              <br />
              BUILDS
              <br />
              <strong>
                RESULTS.
              </strong>
            </p>

          </div>


        </div>


        {/* ===================================================
            FOOTER / NAVIGATION
        =================================================== */}

        <footer className="complete-footer">


          {/* VIEW PROGRESS */}

          <button
            type="button"
            className="complete-primary"
            onClick={openProgress}
          >

            <span>
              VIEW PROGRESS
            </span>

            <strong>
              →
            </strong>

          </button>


          {/* BACK HOME */}

          <button
            type="button"
            className="complete-secondary"
            onClick={openDashboard}
          >
            BACK TO DASHBOARD
          </button>


        </footer>


      </section>

    </main>
  );
}
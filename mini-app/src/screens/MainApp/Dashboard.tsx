import { useEffect, useState } from "react";

import "./Dashboard.css";

import { useUser } from "../../context/UserContext";
import { getWorkoutProgram } from "../../services/workoutService";

type Props = {
  changeTab: (tab: string) => void;
  startWorkout?: (workoutId: string) => void;
};

type ActiveWorkout = {
  workoutId: string;
  exercise: number;
  set: number;
  startedAt: string;
  updatedAt: string;
};

const ACTIVE_WORKOUT_KEY =
  "ironage_active_workout";

export default function Dashboard({
  changeTab,
  startWorkout,
}: Props) {
  const { user } = useUser();

  const [activeWorkout, setActiveWorkout] =
    useState<ActiveWorkout | null>(null);

  /*
   * --------------------------------------------------
   * CHECK ACTIVE WORKOUT
   * --------------------------------------------------
   */

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          ACTIVE_WORKOUT_KEY
        );

      if (!saved) {
        setActiveWorkout(null);
        return;
      }

      const parsed =
        JSON.parse(saved) as ActiveWorkout;

      if (!parsed.workoutId) {
        setActiveWorkout(null);
        return;
      }

      setActiveWorkout(parsed);
    } catch (error) {
      console.error(
        "IRONAGE active workout error:",
        error
      );

      setActiveWorkout(null);
    }
  }, []);

  /*
   * --------------------------------------------------
   * TODAY WORKOUT
   * --------------------------------------------------
   */

  const todayWorkout =
    getWorkoutProgram("upper");

  /*
   * --------------------------------------------------
   * XP
   * --------------------------------------------------
   */

  const XP_PER_LEVEL = 1000;

  const currentLevelXP =
    user.xp % XP_PER_LEVEL;

  const xpProgress = Math.min(
    (currentLevelXP / XP_PER_LEVEL) * 100,
    100
  );

  /*
   * --------------------------------------------------
   * START WORKOUT
   * --------------------------------------------------
   */

  const handleStartWorkout = () => {
    if (startWorkout) {
      startWorkout(todayWorkout.id);
      return;
    }

    changeTab("workout");
  };

  /*
   * --------------------------------------------------
   * RESUME WORKOUT
   * --------------------------------------------------
   */

  const handleResumeWorkout = () => {
    if (!activeWorkout) {
      return;
    }

    if (startWorkout) {
      startWorkout(
        activeWorkout.workoutId
      );

      return;
    }

    changeTab("session");
  };

  /*
   * --------------------------------------------------
   * ACTIVE WORKOUT DATA
   * --------------------------------------------------
   */

  let activeProgram = null;
  let activeExercise = null;

  if (activeWorkout) {
    try {
      activeProgram =
        getWorkoutProgram(
          activeWorkout.workoutId
        );

      activeExercise =
        activeProgram.exercises[
          activeWorkout.exercise
        ];
    } catch {
      activeProgram = null;
      activeExercise = null;
    }
  }

  return (
    <div className="dashboard">

      {/* HEADER */}

      <header className="dashboard-header">

        <div>

          <p className="dashboard-label">
            IRONAGE
          </p>

          <h1>
            Привіт,{" "}
            <span>{user.name}</span> 👋
          </h1>

          <p className="dashboard-subtitle">
            Час ставати сильнішим.
          </p>

        </div>

        <button
          type="button"
          className="dashboard-avatar"
          onClick={() =>
            changeTab("profile")
          }
          aria-label="Відкрити профіль"
        >
          {user.name
            ? user.name
                .charAt(0)
                .toUpperCase()
            : "V"}
        </button>

      </header>


      {/* LEVEL */}

      <section className="level-card">

        <div className="level-top">

          <div>

            <span className="level-caption">
              ТВОЄ ЗВАННЯ
            </span>

            <strong>
              ⚔️ IRON LVL {user.level}
            </strong>

          </div>

          <span className="level-xp">
            {currentLevelXP} /{" "}
            {XP_PER_LEVEL} XP
          </span>

        </div>


        <div className="xp-track">

          <div
            className="xp-fill"
            style={{
              width: `${xpProgress}%`,
            }}
          />

        </div>


        <p className="level-message">

          {XP_PER_LEVEL -
            currentLevelXP}{" "}
          XP до наступного рівня

        </p>

      </section>


      {/* STATS */}

      <section className="stats-grid">

        <div className="stat-card">

          <span className="stat-icon">
            🔥
          </span>

          <strong>
            {user.streak}
          </strong>

          <span>
            Днів streak
          </span>

        </div>


        <div className="stat-card">

          <span className="stat-icon">
            💪
          </span>

          <strong>
            {user.workouts}
          </strong>

          <span>
            Тренувань
          </span>

        </div>


        <div className="stat-card">

          <span className="stat-icon">
            ⚡
          </span>

          <strong>
            {user.xp}
          </strong>

          <span>
            XP
          </span>

        </div>

      </section>


      {/* RESUME WORKOUT */}

      {activeProgram &&
        activeExercise && (
          <section className="resume-section">

            <div className="section-heading">

              <div>

                <p>
                  ТРЕНУВАННЯ НЕ ЗАВЕРШЕНО
                </p>

                <h2>
                  Продовжити
                </h2>

              </div>

              <span className="section-icon">
                ⚔️
              </span>

            </div>


            <div className="resume-card">

              <div className="resume-icon">
                💪
              </div>


              <div className="resume-info">

                <span>
                  IRONAGE PROGRAM
                </span>

                <h3>
                  {activeProgram.name}
                </h3>

                <p>
                  Вправа{" "}
                  {activeWorkout!.exercise + 1}
                  {" / "}
                  {activeProgram.exercises.length}
                </p>

                <small>
                  {activeExercise.name}
                  {" • "}
                  Підхід{" "}
                  {activeWorkout!.set}
                  {" / "}
                  {activeExercise.sets}
                </small>

              </div>


              <button
                type="button"
                className="resume-button"
                onClick={
                  handleResumeWorkout
                }
              >
                →
              </button>

            </div>

          </section>
        )}


      {/* TODAY WORKOUT */}

      <section className="today-section">

        <div className="section-heading">

          <div>

            <p>
              СЬОГОДНІ
            </p>

            <h2>
              Твоє тренування
            </h2>

          </div>

          <span className="section-icon">
            🔥
          </span>

        </div>


        <div className="today-card">

          <div className="today-icon">
            💪
          </div>


          <div className="today-info">

            <span className="today-label">
              IRONAGE PROGRAM
            </span>

            <h3>
              {todayWorkout.name}
            </h3>

            <p>
              {todayWorkout.duration} хв
              {" • "}
              {todayWorkout.exercises.length}
              {" вправ"}
            </p>

          </div>


          <button
            className="today-start"
            onClick={
              handleStartWorkout
            }
            type="button"
            aria-label="Почати тренування"
          >
            ▶
          </button>

        </div>

      </section>


      {/* QUICK ACTIONS */}

      <section className="quick-section">

        <div className="section-heading">

          <div>

            <p>
              ШВИДКИЙ ДОСТУП
            </p>

            <h2>
              IRONAGE
            </h2>

          </div>

        </div>


        <div className="quick-grid">

          <button
            type="button"
            className="quick-card"
            onClick={() =>
              changeTab("workout")
            }
          >

            <span>
              🏋️
            </span>

            <strong>
              Тренування
            </strong>

            <small>
              Почати зараз
            </small>

          </button>


          <button
            type="button"
            className="quick-card"
            onClick={() =>
              changeTab("progress")
            }
          >

            <span>
              📈
            </span>

            <strong>
              Прогрес
            </strong>

            <small>
              Подивитися результати
            </small>

          </button>


          <button
            type="button"
            className="quick-card"
            onClick={() =>
              changeTab("ai")
            }
          >

            <span>
              ⚔️
            </span>

            <strong>
              AI Trainer
            </strong>

            <small>
              Твій персональний тренер
            </small>

          </button>


          <button
            type="button"
            className="quick-card"
            onClick={() =>
              changeTab("profile")
            }
          >

            <span>
              👤
            </span>

            <strong>
              Профіль
            </strong>

            <small>
              Твої дані
            </small>

          </button>

        </div>

      </section>


      {/* AI TRAINER */}

      <section className="ai-trainer-section">

        <button
          type="button"
          className="ai-trainer-card"
          onClick={() =>
            changeTab("ai")
          }
        >

          <div className="ai-trainer-icon">
            ⚔️
          </div>

          <div className="ai-trainer-content">

            <span>
              IRONAGE AI
            </span>

            <strong>
              Твій AI Trainer
            </strong>

            <p>
              Персональні поради щодо
              тренувань, харчування та
              дисципліни.
            </p>

          </div>

          <div className="ai-trainer-arrow">
            →
          </div>

        </button>

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
            Не чекай мотивації.
            Створи дисципліну.
          </p>

        </div>

      </section>

    </div>
  );
}
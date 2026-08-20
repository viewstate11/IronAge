import "./Workout.css";

import { getWorkoutProgram } from "../../services/workoutService";

type Props = {
  changeTab: (tab: string) => void;
  startWorkout?: (workoutId: string) => void;
};

const workouts = [
  {
    id: "upper",
    emoji: "💪",
    title: "Верх тіла",
    subtitle: "Груди • Спина • Плечі • Руки",
  },
  {
    id: "legs",
    emoji: "🦵",
    title: "Ноги",
    subtitle: "Квадрицепс • Сідниці • Ікри",
  },
  {
    id: "abs",
    emoji: "🔥",
    title: "Прес",
    subtitle: "Кор • Прес • Стабілізація",
  },
  {
    id: "cardio",
    emoji: "🏃",
    title: "Кардіо",
    subtitle: "Витривалість • Спалювання калорій",
  },
];

export default function Workout({
  changeTab,
  startWorkout,
}: Props) {
  const handleStartWorkout = (workoutId: string) => {
    if (startWorkout) {
      startWorkout(workoutId);
      return;
    }

    changeTab("session");
  };

  return (
    <div className="workout-screen">

      {/* HEADER */}

      <header className="workout-header">

        <div>
          <p className="workout-label">
            IRONAGE PROGRAM
          </p>

          <h1>
            Тренування
          </h1>

          <p>
            Обери тренування та починай роботу.
          </p>
        </div>

      </header>


      {/* TODAY */}

      <section className="workout-today">

        <div className="section-heading">

          <div>
            <p>
              СЬОГОДНІ
            </p>

            <h2>
              Рекомендовано для тебе
            </h2>
          </div>

          <span>
            ⚔️
          </span>

        </div>


        <div className="featured-workout">

          <div className="featured-icon">
            💪
          </div>

          <div className="featured-content">

            <span>
              IRONAGE PROGRAM
            </span>

            <h3>
              Верх тіла
            </h3>

            <p>
              Сила та м'язова витривалість
            </p>

            <small>
              20 хв • 4 вправи
            </small>

          </div>

          <button
            type="button"
            onClick={() =>
              handleStartWorkout("upper")
            }
          >
            ▶
          </button>

        </div>

      </section>


      {/* ALL WORKOUTS */}

      <section className="workout-list">

        <div className="section-heading">

          <div>
            <p>
              IRONAGE
            </p>

            <h2>
              Всі тренування
            </h2>
          </div>

        </div>


        <div className="workout-grid">

          {workouts.map((workout) => {

            const program =
              getWorkoutProgram(workout.id);

            return (
              <button
                type="button"
                className="workout-card"
                key={workout.id}
                onClick={() =>
                  handleStartWorkout(workout.id)
                }
              >

                <span className="workout-card-icon">
                  {workout.emoji}
                </span>

                <div className="workout-card-content">

                  <strong>
                    {workout.title}
                  </strong>

                  <small>
                    {workout.subtitle}
                  </small>

                  <span>
                    {program.duration} хв •{" "}
                    {program.exercises.length} вправ
                  </span>

                </div>

                <span className="workout-arrow">
                  →
                </span>

              </button>
            );
          })}

        </div>

      </section>


      {/* MOTIVATION */}

      <section className="workout-motivation">

        <span>
          ⚔️
        </span>

        <div>

          <strong>
            ПРАВИЛО IRONAGE
          </strong>

          <p>
            Не шукай ідеальний момент.
            Почни зараз.
          </p>

        </div>

      </section>

    </div>
  );
}
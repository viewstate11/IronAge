import "./WorkoutComplete.css";

import { useUser } from "../../context/UserContext";

type Props = {
  changeTab: (tab: string) => void;
  workoutId: string;
};

type WorkoutInfo = {
  name: string;
  duration: number;
  exercises: number;
  emoji: string;
};

const workoutData: Record<string, WorkoutInfo> = {
  upper: {
    name: "Верх тіла",
    duration: 20,
    exercises: 4,
    emoji: "🔥",
  },

  legs: {
    name: "Ноги",
    duration: 25,
    exercises: 4,
    emoji: "🦵",
  },

  abs: {
    name: "Прес",
    duration: 12,
    exercises: 4,
    emoji: "💥",
  },

  cardio: {
    name: "Кардіо",
    duration: 15,
    exercises: 4,
    emoji: "🏃",
  },
};

export default function WorkoutComplete({
  changeTab,
  workoutId,
}: Props) {
  const { user } = useUser();

  const workout =
    workoutData[workoutId] ?? workoutData.upper;

  const lastWorkout = user.history[0];

  return (
    <div className="workout-complete">

      {/* TROPHY */}

      <div className="complete-glow">
        🏆
      </div>

      {/* HEADER */}

      <p className="complete-label">
        IRONAGE
      </p>

      <h1>
        ТРЕНУВАННЯ
        <br />
        ЗАВЕРШЕНО
      </h1>

      <p className="complete-message">
        Сильний результат. Ще один крок
        до твоєї кращої версії.
      </p>

      {/* WORKOUT */}

      <div className="reward-card">

        <div className="reward-icon">
          {workout.emoji}
        </div>

        <div>
          <strong>
            {workout.name}
          </strong>

          <small>
            Тренування виконано
          </small>
        </div>

      </div>

      {/* XP */}

      <div className="reward-card">

        <div className="reward-icon">
          ⚡
        </div>

        <div>
          <strong>
            +250 XP
          </strong>

          <small>
            Досвід воїна
          </small>
        </div>

      </div>

      {/* STATS */}

      <div className="complete-stats">

        <div>
          <strong>
            {workout.duration}
          </strong>

          <span>
            ХВИЛИН
          </span>
        </div>

        <div>
          <strong>
            {workout.exercises}
          </strong>

          <span>
            ВПРАВ
          </span>
        </div>

        <div>
          <strong>
            +250
          </strong>

          <span>
            XP
          </span>
        </div>

      </div>

      {/* LEVEL */}

      <div className="xp-result">

        <span>
          Поточний рівень
        </span>

        <strong>
          ⚔️ LVL {user.level}
        </strong>

      </div>

      {/* STREAK */}

      <div className="xp-result">

        <span>
          Поточний streak
        </span>

        <strong>
          🔥 {user.streak}
        </strong>

      </div>

      {/* LAST WORKOUT */}

      {lastWorkout && (
        <div className="xp-result">

          <span>
            Останнє тренування
          </span>

          <strong>
            {lastWorkout.name}
          </strong>

        </div>
      )}

      {/* ACTIONS */}

      <button
        type="button"
        className="complete-button"
        onClick={() => changeTab("progress")}
      >
        📈 ПЕРЕГЛЯНУТИ ПРОГРЕС
      </button>

      <button
        type="button"
        className="home-button"
        onClick={() => changeTab("home")}
      >
        ← На головну
      </button>

    </div>
  );
}
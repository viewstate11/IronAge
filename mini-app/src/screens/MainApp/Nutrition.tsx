import { useEffect, useState } from "react";

import "./Nutrition.css";

import { useUser } from "../../context/UserContext";

type Props = {
  changeTab: (tab: string) => void;
};

type Meal = {
  id: number;
  name: string;
  description: string;
  icon: string;
  calories: number;
  protein: number;
};

const meals: Meal[] = [
  {
    id: 1,
    name: "Сніданок",
    description: "Яйця + овочі + джерело білка",
    icon: "🍳",
    calories: 500,
    protein: 35,
  },
  {
    id: 2,
    name: "Обід",
    description: "М'ясо або риба + овочі + гарнір",
    icon: "🥩",
    calories: 700,
    protein: 45,
  },
  {
    id: 3,
    name: "Вечеря",
    description: "Білок + велика порція овочів",
    icon: "🥗",
    calories: 600,
    protein: 40,
  },
];

export default function Nutrition({
  changeTab,
}: Props) {
  const { user } = useUser();

  const caloriesTarget = Math.round(
    user.weight * 30
  );

  const proteinTarget = Math.round(
    user.weight * 1.8
  );

  const waterTarget = Math.round(
    user.weight * 35
  );

  const [completedMeals, setCompletedMeals] =
    useState<number[]>([]);

  const [water, setWater] = useState(0);

  useEffect(() => {
    const today = new Date()
      .toISOString()
      .slice(0, 10);

    const saved = localStorage.getItem(
      `ironage_nutrition_${today}`
    );

    if (!saved) {
      return;
    }

    try {
      const data = JSON.parse(saved);

      if (Array.isArray(data.completedMeals)) {
        setCompletedMeals(data.completedMeals);
      }

      if (
        typeof data.water === "number"
      ) {
        setWater(data.water);
      }
    } catch {
      console.error(
        "Failed to load nutrition data"
      );
    }
  }, []);

  useEffect(() => {
    const today = new Date()
      .toISOString()
      .slice(0, 10);

    localStorage.setItem(
      `ironage_nutrition_${today}`,
      JSON.stringify({
        completedMeals,
        water,
      })
    );
  }, [completedMeals, water]);

  function toggleMeal(id: number) {
    setCompletedMeals((prev) => {
      if (prev.includes(id)) {
        return prev.filter(
          (mealId) => mealId !== id
        );
      }

      return [...prev, id];
    });
  }

  function addWater(amount: number) {
    setWater((prev) =>
      Math.min(
        prev + amount,
        waterTarget
      )
    );
  }

  const completedCalories =
    meals
      .filter((meal) =>
        completedMeals.includes(meal.id)
      )
      .reduce(
        (total, meal) =>
          total + meal.calories,
        0
      );

  const completedProtein =
    meals
      .filter((meal) =>
        completedMeals.includes(meal.id)
      )
      .reduce(
        (total, meal) =>
          total + meal.protein,
        0
      );

  const calorieProgress = Math.min(
    (completedCalories /
      caloriesTarget) *
      100,
    100
  );

  const proteinProgress = Math.min(
    (completedProtein /
      proteinTarget) *
      100,
    100
  );

  const waterProgress = Math.min(
    (water / waterTarget) * 100,
    100
  );

  return (
    <div className="nutrition-page">

      {/* HEADER */}

      <header className="nutrition-header">

        <button
          type="button"
          className="nutrition-back"
          onClick={() =>
            changeTab("home")
          }
        >
          ←
        </button>

        <div>
          <p className="nutrition-label">
            IRONAGE NUTRITION
          </p>

          <h1>
            Харчування
          </h1>
        </div>

        <div className="nutrition-icon">
          🥗
        </div>

      </header>


      {/* HERO */}

      <section className="nutrition-hero">

        <div className="nutrition-hero-icon">
          ⚡
        </div>

        <div>
          <strong>
            Харчування для {user.name}
          </strong>

          <p>
            Твоя ціль — {user.goal}.
            Їжа повинна допомагати тобі
            ставати сильнішим.
          </p>
        </div>

      </section>


      {/* DAILY TARGET */}

      <section className="nutrition-card">

        <div className="nutrition-card-title">

          <div>
            <span>
              ОРІЄНТИР НА ДЕНЬ
            </span>

            <h2>
              Основні показники
            </h2>
          </div>

          <span className="nutrition-target">
            🔥
          </span>

        </div>


        {/* CALORIES */}

        <div className="nutrition-progress-item">

          <div className="nutrition-progress-header">

            <span>
              Калорії
            </span>

            <strong>
              {completedCalories} /{" "}
              {caloriesTarget} KCAL
            </strong>

          </div>

          <div className="nutrition-progress-track">

            <div
              className="nutrition-progress-fill"
              style={{
                width: `${calorieProgress}%`,
              }}
            />

          </div>

        </div>


        {/* PROTEIN */}

        <div className="nutrition-progress-item">

          <div className="nutrition-progress-header">

            <span>
              Білок
            </span>

            <strong>
              {completedProtein} /{" "}
              {proteinTarget} г
            </strong>

          </div>

          <div className="nutrition-progress-track">

            <div
              className="nutrition-progress-fill"
              style={{
                width: `${proteinProgress}%`,
              }}
            />

          </div>

        </div>


        {/* WATER */}

        <div className="nutrition-progress-item">

          <div className="nutrition-progress-header">

            <span>
              Вода
            </span>

            <strong>
              {water} / {waterTarget} мл
            </strong>

          </div>

          <div className="nutrition-progress-track">

            <div
              className="nutrition-progress-fill"
              style={{
                width: `${waterProgress}%`,
              }}
            />

          </div>

        </div>


        <div className="nutrition-water-actions">

          <button
            type="button"
            onClick={() =>
              addWater(250)
            }
          >
            +250 мл
          </button>

          <button
            type="button"
            onClick={() =>
              addWater(500)
            }
          >
            +500 мл
          </button>

          <button
            type="button"
            onClick={() =>
              setWater(0)
            }
          >
            Скинути
          </button>

        </div>

      </section>


      {/* MEALS */}

      <section className="nutrition-section">

        <div className="nutrition-section-title">

          <div>
            <span>
              СЬОГОДНІ
            </span>

            <h2>
              Прийоми їжі
            </h2>
          </div>

          <strong>
            {completedMeals.length}/
            {meals.length}
          </strong>

        </div>


        <div className="meal-list">

          {meals.map((meal) => {

            const completed =
              completedMeals.includes(
                meal.id
              );

            return (
              <button
                type="button"
                key={meal.id}
                className={`meal-card ${
                  completed
                    ? "meal-completed"
                    : ""
                }`}
                onClick={() =>
                  toggleMeal(meal.id)
                }
              >

                <div className="meal-icon">
                  {completed
                    ? "✓"
                    : meal.icon}
                </div>

                <div className="meal-info">

                  <strong>
                    {meal.name}
                  </strong>

                  <p>
                    {meal.description}
                  </p>

                  <small>
                    {meal.calories} kcal •{" "}
                    {meal.protein} г білка
                  </small>

                </div>

                <span>
                  {completed
                    ? "ГОТОВО"
                    : "ВИКОНАТИ"}
                </span>

              </button>
            );
          })}

        </div>

      </section>


      {/* DAILY RESULT */}

      {completedMeals.length ===
        meals.length && (

        <section className="nutrition-success">

          <div>
            🏆
          </div>

          <strong>
            ХАРЧУВАННЯ ВИКОНАНО
          </strong>

          <p>
            Ти виконав усі заплановані
            прийоми їжі сьогодні.
          </p>

        </section>

      )}


      {/* RULE */}

      <section className="nutrition-rule">

        <div className="nutrition-rule-icon">
          ⚔️
        </div>

        <div>

          <strong>
            ПРАВИЛО IRONAGE
          </strong>

          <p>
            Не шукай ідеальну дієту.
            Створи харчування, якого
            зможеш дотримуватися щодня.
          </p>

        </div>

      </section>


      {/* AI BUTTON */}

      <button
        type="button"
        className="nutrition-ai-button"
        onClick={() =>
          changeTab("ai")
        }
      >
        ⚡ ЗАПИТАТИ AI TRAINER
      </button>

    </div>
  );
}
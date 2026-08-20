import { useState } from "react";

import "./Profile.css";

import { useUser } from "../../context/UserContext";

export default function Profile() {
  const { user, setUser } = useUser();

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(String(user.age));
  const [height, setHeight] = useState(String(user.height));
  const [weight, setWeight] = useState(String(user.weight));
  const [goal, setGoal] = useState(user.goal);

  const levelXP = user.xp % 1000;

  const xpProgress = Math.min(
    (levelXP / 1000) * 100,
    100
  );

  function startEditing() {
    setName(user.name);
    setAge(String(user.age));
    setHeight(String(user.height));
    setWeight(String(user.weight));
    setGoal(user.goal);

    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);

    setName(user.name);
    setAge(String(user.age));
    setHeight(String(user.height));
    setWeight(String(user.weight));
    setGoal(user.goal);
  }

  function saveProfile() {
    const parsedAge = Number(age);
    const parsedHeight = Number(height);
    const parsedWeight = Number(weight);

    if (!name.trim()) {
      return;
    }

    if (
      !Number.isFinite(parsedAge) ||
      parsedAge <= 0
    ) {
      return;
    }

    if (
      !Number.isFinite(parsedHeight) ||
      parsedHeight <= 0
    ) {
      return;
    }

    if (
      !Number.isFinite(parsedWeight) ||
      parsedWeight <= 0
    ) {
      return;
    }

    setUser((prev) => ({
      ...prev,

      name: name.trim(),

      age: parsedAge,

      height: parsedHeight,

      weight: parsedWeight,

      goal: goal.trim() || prev.goal,
    }));

    setEditing(false);
  }

  return (
    <div className="profile-page">

      {/* HEADER */}

      <header className="profile-header">

        <div>
          <p className="profile-label">
            IRONAGE PROFILE
          </p>

          <h1>
            Мій профіль
          </h1>
        </div>

        <div className="profile-level">
          ⚔️
          <span>
            LVL {user.level}
          </span>
        </div>

      </header>


      {/* USER */}

      <section className="profile-card">

        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="profile-main">

          <h2>
            {user.name}
          </h2>

          <p>
            {user.goal}
          </p>

        </div>

      </section>


      {/* EDIT */}

      {!editing ? (

        <button
          type="button"
          className="profile-edit-button"
          onClick={startEditing}
        >
          ✏️ РЕДАГУВАТИ ПРОФІЛЬ
        </button>

      ) : (

        <section className="profile-edit-card">

          <div className="profile-info-title">

            <span>
              НАЛАШТУВАННЯ
            </span>

            <h2>
              Редагування профілю
            </h2>

          </div>


          <label>
            Ім'я

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />
          </label>


          <label>
            Вік

            <input
              type="number"
              min="1"
              value={age}
              onChange={(event) =>
                setAge(event.target.value)
              }
            />
          </label>


          <label>
            Зріст

            <input
              type="number"
              min="1"
              value={height}
              onChange={(event) =>
                setHeight(event.target.value)
              }
            />
          </label>


          <label>
            Вага

            <input
              type="number"
              min="1"
              step="0.1"
              value={weight}
              onChange={(event) =>
                setWeight(event.target.value)
              }
            />
          </label>


          <label>
            Мета

            <input
              type="text"
              value={goal}
              onChange={(event) =>
                setGoal(event.target.value)
              }
            />
          </label>


          <div className="profile-edit-actions">

            <button
              type="button"
              className="profile-save-button"
              onClick={saveProfile}
            >
              ✓ ЗБЕРЕГТИ
            </button>

            <button
              type="button"
              className="profile-cancel-button"
              onClick={cancelEditing}
            >
              СКАСУВАТИ
            </button>

          </div>

        </section>

      )}


      {/* STATS */}

      <section className="profile-stats">

        <div className="profile-stat">

          <span>
            ⚡
          </span>

          <strong>
            {user.xp}
          </strong>

          <small>
            XP
          </small>

        </div>


        <div className="profile-stat">

          <span>
            🔥
          </span>

          <strong>
            {user.streak}
          </strong>

          <small>
            STREAK
          </small>

        </div>


        <div className="profile-stat">

          <span>
            💪
          </span>

          <strong>
            {user.workouts}
          </strong>

          <small>
            ТРЕНУВАНЬ
          </small>

        </div>

      </section>


      {/* PERSONAL DATA */}

      <section className="profile-info">

        <div className="profile-info-title">

          <span>
            ПЕРСОНАЛЬНІ ДАНІ
          </span>

          <h2>
            Мої параметри
          </h2>

        </div>


        <div className="profile-row">

          <span>
            Ім'я
          </span>

          <strong>
            {user.name}
          </strong>

        </div>


        <div className="profile-row">

          <span>
            Вік
          </span>

          <strong>
            {user.age} років
          </strong>

        </div>


        <div className="profile-row">

          <span>
            Зріст
          </span>

          <strong>
            {user.height} см
          </strong>

        </div>


        <div className="profile-row">

          <span>
            Вага
          </span>

          <strong>
            {user.weight} кг
          </strong>

        </div>


        <div className="profile-row">

          <span>
            Мета
          </span>

          <strong>
            {user.goal}
          </strong>

        </div>

      </section>


      {/* XP */}

      <section className="profile-xp">

        <div>

          <span>
            ПРОГРЕС РІВНЯ
          </span>

          <strong>
            {levelXP} / 1000 XP
          </strong>

        </div>


        <div className="profile-xp-track">

          <div
            className="profile-xp-fill"
            style={{
              width: `${xpProgress}%`,
            }}
          />

        </div>

      </section>


      {/* MOTIVATION */}

      <section className="profile-quote">

        <div className="profile-quote-icon">
          ⚔️
        </div>

        <div>

          <strong>
            IRONAGE MINDSET
          </strong>

          <p>
            Дисципліна перемагає мотивацію.
            Ти вже почав — тепер не зупиняйся.
          </p>

        </div>

      </section>

    </div>
  );
}
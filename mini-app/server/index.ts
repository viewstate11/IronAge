import dotenv from "dotenv";

dotenv.config({
  path: "./server/.env",
});

import express from "express";
import cors from "cors";

const app = express();

const port = Number(process.env.PORT || 3001);

app.use(
  cors({
    origin: true,
  })
);

app.use(express.json());

type WorkoutHistoryItem = {
  id: string;
  name: string;
  duration: number;
  xp: number;
  date: string;
};

type UserData = {
  name: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  goal: string;
  level: number;
  xp: number;
  workouts: number;
  streak: number;
  history?: WorkoutHistoryItem[];
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "IRONAGE AI",
    mode: "local",
  });
});

app.post("/api/ai", (req, res) => {
  try {
    const {
      user,
      message,
      history = [],
    } = req.body as {
      user: UserData;
      message: string;
      history?: ChatMessage[];
    };

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User data is required",
      });
    }

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    const answer = getLocalAIResponse(
      message,
      user,
      history
    );

    return res.json({
      success: true,
      message: answer,
      mode: "local",
    });
  } catch (error) {
    console.error(
      "IRONAGE LOCAL AI error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Помилка IRONAGE AI.",
    });
  }
});

function getLocalAIResponse(
  message: string,
  user: UserData,
  history: ChatMessage[]
): string {
  const text = message.toLowerCase();

  if (
    text.includes("привіт") ||
    text.includes("hello") ||
    text.includes("hi")
  ) {
    return getGreetingResponse(user);
  }

  if (
    text.includes("трен") ||
    text.includes("вправ") ||
    text.includes("спорт") ||
    text.includes("сьогодні") ||
    text.includes("підтяг") ||
    text.includes("віджим") ||
    text.includes("брус")
  ) {
    return getWorkoutResponse(user);
  }

  if (
    text.includes("їст") ||
    text.includes("їжа") ||
    text.includes("харч") ||
    text.includes("калор") ||
    text.includes("білок") ||
    text.includes("вода")
  ) {
    return getNutritionResponse(user);
  }

  if (
    text.includes("силь") ||
    text.includes("м'яз") ||
    text.includes("м’яз") ||
    text.includes("сила")
  ) {
    return getStrengthResponse(user);
  }

  if (
    text.includes("мотивац") ||
    text.includes("лін") ||
    text.includes("не хочу") ||
    text.includes("важко") ||
    text.includes("втом")
  ) {
    return getDisciplineResponse(user);
  }

  if (
    text.includes("прогрес") ||
    text.includes("результат") ||
    text.includes("рівень") ||
    text.includes("xp") ||
    text.includes("streak")
  ) {
    return getProgressResponse(user);
  }

  if (
    text.includes("план") ||
    text.includes("що робити")
  ) {
    return getPersonalPlanResponse(user);
  }

  if (history.length > 0) {
    return getGeneralResponse(user);
  }

  return getGeneralResponse(user);
}

function getGreetingResponse(
  user: UserData
): string {
  const lastWorkout = getLastWorkout(user);

  return `Привіт, ${user.name}! ⚔️

Я твій IRONAGE AI Trainer.

Твій статус:

⚔️ Рівень: ${user.level}
⚡ XP: ${user.xp}
🔥 Streak: ${user.streak} днів
💪 Тренувань: ${user.workouts}

🎯 Ціль:
${user.goal}

${
  lastWorkout
    ? `Останнє тренування: ${lastWorkout.name}.`
    : "Ти ще не маєш тренувань в історії."
}

Я можу допомогти тобі з тренуваннями, харчуванням, силою, прогресом і дисципліною.

Твоя задача проста:
не бути ідеальним — бути стабільним. ⚔️`;
}

function getWorkoutResponse(
  user: UserData
): string {
  const lastWorkout = getLastWorkout(user);

  if (user.workouts === 0) {
    return `⚔️ ПЕРШЕ ТРЕНУВАННЯ

${user.name}, почнемо з бази.

Твоя ціль:
${user.goal}

Сьогодні:

1. 💪 Віджимання — 3 × 10
2. 🏋️ Підтягування — 3 × 5
3. 🔥 Бруси — 3 × 8
4. ⚡ Планка — 3 × 30 сек

Відпочинок:
60–90 секунд.

Не женись за рекордом.

Перше завдання — просто завершити тренування.

Після цього IRONAGE збереже результат і почне будувати твою історію.`;
  }

  return `⚔️ ТРЕНУВАННЯ ДЛЯ ${user.name.toUpperCase()}

Твій рівень: ${user.level}
Streak: ${user.streak} днів
Тренувань: ${user.workouts}

${
  lastWorkout
    ? `Минулого разу ти виконував:
${lastWorkout.name}

Тривалість:
${lastWorkout.duration} хвилин.`
    : ""
}

Сьогодні працюємо над верхньою частиною тіла:

1. 💪 Віджимання — 4 × 12
2. 🏋️ Підтягування — 4 × 6
3. 🔥 Бруси — 3 × 10
4. ⚡ Планка — 3 × 40 сек

Відпочинок:
60–90 секунд.

Правило IRONAGE:

Якщо минулого разу було легко —
додай 1–2 повторення.

Якщо було важко —
збережи навантаження і покращ техніку.

Прогрес ≠ кожного разу максимум.

Прогрес = регулярність + поступове навантаження. ⚔️`;
}

function getNutritionResponse(
  user: UserData
): string {
  const calories = Math.round(
    user.weight * 30
  );

  const protein = Math.round(
    user.weight * 1.8
  );

  const water = Math.round(
    user.weight * 35
  );

  return `🥗 ХАРЧУВАННЯ IRONAGE

${user.name}, твої орієнтири:

⚖️ Вага:
${user.weight} кг

🔥 Калорії:
≈ ${calories} kcal

💪 Білок:
≈ ${protein} г

💧 Вода:
≈ ${water} мл

🎯 Ціль:
${user.goal}

Базова схема:

🍳 Сніданок
Яйця + овочі + джерело білка.

🥩 Обід
М'ясо або риба + овочі + гарнір.

🥗 Вечеря
Білок + велика порція овочів.

Не потрібно шукати ідеальну дієту.

Потрібне харчування, якого ти реально зможеш дотримуватися щодня.

Це орієнтири, а не медична або дієтологічна рекомендація.`;
}

function getStrengthResponse(
  user: UserData
): string {
  return `💪 СИЛА

${user.name}, якщо твоя ціль —
"${user.goal}", фокусуйся на чотирьох речах:

1. ⚔️ Прогресивне навантаження
2. 🎯 Техніка
3. 😴 Відновлення
4. 🔥 Регулярність

Тобі не потрібно кожного тренування бити рекорд.

Наступного разу спробуй:

+1 повторення
або
+1 підхід
або
кращу техніку.

Твій поточний рівень:
LVL ${user.level}

Твій XP:
${user.xp}

Ти вже почав.

Тепер твоя задача —
стати трохи сильнішим, ніж учора. ⚔️`;
}

function getDisciplineResponse(
  user: UserData
): string {
  return `🔥 IRONAGE DISCIPLINE

${user.name}, мотивація приходить і йде.

Дисципліна залишається.

Твій streak:
🔥 ${user.streak} днів

Тому сьогодні не потрібно зробити неможливе.

Зроби мінімум:

10 віджимань.
5 хвилин ходьби.
1 підхід.
1 маленький крок.

Бо головне правило:

"Не хочеться — зроби хоча б мінімум."

Не розривай ланцюг.

Твоя майбутня версія подякує тобі за сьогоднішню дію. ⚔️`;
}

function getProgressResponse(
  user: UserData
): string {
  const xpInLevel = user.xp % 1000;

  const xpToNextLevel =
    1000 - xpInLevel;

  const progress = Math.round(
    (xpInLevel / 1000) * 100
  );

  return `📈 ТВІЙ ПРОГРЕС

⚔️ Рівень:
${user.level}

⚡ XP:
${user.xp}

📊 Прогрес рівня:
${progress}%

🎯 До наступного рівня:
${xpToNextLevel} XP

💪 Тренувань:
${user.workouts}

🔥 Streak:
${user.streak} днів

${
  user.workouts === 0
    ? "Твоя головна ціль зараз — завершити перше тренування."
    : user.streak >= 7
      ? "Ти вже створив хорошу серію. Не зупиняйся."
      : "Ти вже почав. Тепер головне — створити стабільність."
}

Кожне тренування додає XP.

Кожен день дисципліни формує характер.

IRONAGE — це не один великий результат.

Це сотні маленьких перемог. ⚔️`;
}

function getPersonalPlanResponse(
  user: UserData
): string {
  const lastWorkout = getLastWorkout(user);

  return `⚔️ ТВОЄ ЗАВДАННЯ НА СЬОГОДНІ

${user.name}, твоя ціль:
${user.goal}

Поточний рівень:
LVL ${user.level}

🔥 Streak:
${user.streak} днів

${
  lastWorkout
    ? `Останнє тренування:
${lastWorkout.name}

Тривалість:
${lastWorkout.duration} хв.`
    : "Історія тренувань поки порожня."
}

Сьогодні:

01 — 🏋️ виконати тренування
02 — 💧 пити достатньо води
03 — 🥗 тримати харчування під контролем
04 — 😴 нормально відновитися
05 — ⚔️ не пропустити день

Не намагайся змінити все одразу.

Зміни одну річ сьогодні.

Завтра — ще одну.

Так будується IRONAGE.`;
}

function getGeneralResponse(
  user: UserData
): string {
  return `${user.name}, я тут. ⚔️

Я знаю твою ціль:
${user.goal}

Твій рівень:
LVL ${user.level}

XP:
${user.xp}

Streak:
🔥 ${user.streak}

Можеш запитати:

🏋️ "Що мені тренувати сьогодні?"

🥗 "Що мені їсти?"

💪 "Як стати сильнішим?"

🔥 "Мені лінь тренуватися."

📈 "Проаналізуй мій прогрес."

⚔️ "Дай мені план на сьогодні."

Твоя задача не змінюється:

стати кращою версією себе.`;
}

function getLastWorkout(
  user: UserData
): WorkoutHistoryItem | null {
  if (
    !user.history ||
    user.history.length === 0
  ) {
    return null;
  }

  return user.history[0];
}

app.listen(port, () => {
  console.log(
    `IRONAGE AI LOCAL server running on http://127.0.0.1:${port}`
  );
});
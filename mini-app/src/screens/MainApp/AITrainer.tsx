import { useEffect, useState } from "react";

import "./AITrainer.css";

import { useUser } from "../../context/UserContext";

type Props = {
  changeTab: (tab: string) => void;
};

type Message = {
  id: number;
  sender: "ai" | "user";
  text: string;
};

const CHAT_STORAGE_KEY = "ironage_ai_chat";

export default function AITrainer({
  changeTab,
}: Props) {
  const { user } = useUser();

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(
        CHAT_STORAGE_KEY
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.error(
        "IRONAGE AI chat load error:",
        error
      );
    }

    return [
      {
        id: 1,
        sender: "ai",
        text: `Привіт, ${user.name}! ⚔️

Я твій IRONAGE AI Trainer.

Твоя ціль:
${user.goal}

Рівень: ${user.level}
XP: ${user.xp}
Streak: ${user.streak} днів
Тренувань: ${user.workouts}

Я готовий допомогти тобі тренуватися,
харчуватися та ставати сильнішим.`,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify(messages)
      );
    } catch (error) {
      console.error(
        "IRONAGE AI chat save error:",
        error
      );
    }
  }, [messages]);

  const sendMessage = async (
    customMessage?: string
  ) => {
    const text = (
      customMessage ?? message
    ).trim();

    if (!text || loading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/api/ai",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

body: JSON.stringify({
  user: {
    name: user.name,
    age: user.age,
    gender: user.gender,
    weight: user.weight,
    height: user.height,
    goal: user.goal,
    level: user.level,
    xp: user.xp,
    workouts: user.workouts,
    streak: user.streak,

    history: user.history,
  },

  message: text,

  history: messages
    .slice(-10)
    .map((item) => ({
      role:
        item.sender === "ai"
          ? "assistant"
          : "user",

      content: item.text,
    })),
}),

        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.error ||
            "IRONAGE AI server error"
        );
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text:
          data.message ||
          "⚔️ Не вдалося сформувати відповідь.",
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);
    } catch (error) {
      console.error(
        "IRONAGE AI connection error:",
        error
      );

      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: `⚠️ IRONAGE AI зараз недоступний.

Перевір, чи запущений локальний сервер:

npm run server`,
      };

      setMessages((prev) => [
        ...prev,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  };

  const askQuestion = (
    question: string
  ) => {
    sendMessage(question);
  };

  const clearChat = () => {
    const initialMessage: Message = {
      id: Date.now(),
      sender: "ai",
      text: `Чат очищено. ⚔️

Привіт, ${user.name}!

Я знову готовий допомагати тобі
ставати сильнішим.`,
    };

    setMessages([initialMessage]);

    localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify([initialMessage])
    );
  };

  return (
    <div className="ai-trainer-page">

      {/* HEADER */}

      <header className="ai-header">

        <button
          type="button"
          className="ai-back"
          onClick={() => changeTab("home")}
          aria-label="Назад"
        >
          ←
        </button>

        <div>
          <p className="ai-label">
            IRONAGE AI
          </p>

          <h1>
            AI Trainer
          </h1>
        </div>

        <div
          className={`ai-status ${
            loading ? "loading" : ""
          }`}
        >
          ●
        </div>

      </header>

      {/* HERO */}

      <section className="ai-hero">

        <div className="ai-avatar">
          ⚔️
        </div>

        <div>
          <strong>
            Твій персональний тренер
          </strong>

          <p>
            Аналізую твої цілі, прогрес
            та допомагаю тримати дисципліну.
          </p>
        </div>

      </section>

      {/* QUICK QUESTIONS */}

      <div className="ai-quick">

        <button
          type="button"
          onClick={() =>
            askQuestion(
              "Що мені тренувати сьогодні?"
            )
          }
          disabled={loading}
        >
          🏋️ Тренування
        </button>

        <button
          type="button"
          onClick={() =>
            askQuestion(
              "Що мені їсти сьогодні?"
            )
          }
          disabled={loading}
        >
          🥗 Харчування
        </button>

        <button
          type="button"
          onClick={() =>
            askQuestion(
              "Як мені стати сильнішим?"
            )
          }
          disabled={loading}
        >
          ⚡ Порада
        </button>

      </div>

      {/* CHAT */}

      <section className="ai-chat">

        {messages.map((item) => (

          <div
            key={item.id}
            className={`ai-message ${
              item.sender === "user"
                ? "user-message"
                : "trainer-message"
            }`}
          >

            {item.sender === "ai" && (
              <span className="message-icon">
                ⚔️
              </span>
            )}

            <div className="message-bubble">
              {item.text}
            </div>

          </div>

        ))}

        {/* LOADING */}

        {loading && (
          <div className="ai-message trainer-message">

            <span className="message-icon">
              ⚔️
            </span>

            <div className="message-bubble">
              IRONAGE AI думає...
            </div>

          </div>
        )}

      </section>

      {/* INPUT */}

      <div className="ai-input-wrapper">

        <input
          type="text"
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Напиши своє питання..."
          disabled={loading}
        />

        <button
          type="button"
          onClick={() => sendMessage()}
          disabled={
            loading ||
            !message.trim()
          }
          aria-label="Надіслати"
        >
          ➤
        </button>

      </div>

      {/* CLEAR CHAT */}

      <button
        type="button"
        className="ai-clear-button"
        onClick={clearChat}
        disabled={loading}
      >
        Очистити чат
      </button>

    </div>
  );
}
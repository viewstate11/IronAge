import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  useUser,
  type User as ContextUser,
} from "../../context/UserContext";

import type {
  User as AppUser,
} from "../../types/user";

import { buildAIUserContext } from "../../services/ai/aiContext";
import { getAITrainerResponse } from "../../services/aiService";

import "./AITrainer.css";
import vasylPhoto from "../../assets/vasyl-ua.jpg";

/* =========================================================
   TYPES
========================================================= */

type Props = {
  changeTab: (nextTab: string) => void;
};

type CoachMode =
  | "workout"
  | "nutrition"
  | "recovery";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

/* =========================================================
   USER ADAPTER
========================================================= */

/*
 * UserContext has a wider frontend User type.
 *
 * AI services expect the canonical AppUser type
 * from src/types/user.ts.
 *
 * The important incompatibility here is:
 *
 * ContextUser.id -> string | number
 * AppUser.id     -> number
 *
 * We normalize the ID before passing the user
 * into AI services.
 */

function toAIUser(
  user: ContextUser
): AppUser {
  return {
    ...user,
    id: Number(user.id),
  } as AppUser;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function AITrainer({
  changeTab,
}: Props) {
  const {
    user,
    loading,
  } = useUser();

  /* =======================================================
     STATE
  ======================================================= */

  const [mode, setMode] =
    useState<CoachMode>("workout");

  const [question, setQuestion] =
    useState<string>("");

  const [answer, setAnswer] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState<boolean>(false);

  const [chatHistory, setChatHistory] =
    useState<ChatMessage[]>([]);

  /* =======================================================
     AI USER
  ======================================================= */

  const aiUser =
    useMemo<AppUser>(
      () => toAIUser(user),
      [user]
    );

  /* =======================================================
     USER DATA
  ======================================================= */

  const completedWorkouts =
    user.workouts;

  const currentStreak =
    user.streak;

  const currentLevel =
    user.level;

  const goal =
    user.goal ??
    "general fitness";

  /* =======================================================
     AI CONTEXT
  ======================================================= */

  const aiContext =
    useMemo(
      () =>
        buildAIUserContext(
          aiUser
        ),
      [aiUser]
    );

  /* =======================================================
     COACH MESSAGE
  ======================================================= */

  const coachMessage =
    useMemo(() => {
      if (currentStreak >= 10) {
        return `You're on a ${currentStreak}-day streak. That's serious discipline. Today we keep the momentum going.`;
      }

      if (currentStreak >= 5) {
        return `You're building a ${currentStreak}-day streak. Stay consistent today and keep moving forward.`;
      }

      if (completedWorkouts > 0) {
        return `You've already completed ${completedWorkouts} workouts. Keep building your strength and consistency.`;
      }

      return "You're building your foundation. The goal is simple: train consistently and become stronger every day.";
    }, [
      currentStreak,
      completedWorkouts,
    ]);

  /* =======================================================
     MODE RESPONSE
  ======================================================= */

  const getModeResponse = (
    selectedMode: CoachMode
  ): string => {
    switch (selectedMode) {
      case "workout":
        return `Based on your current level ${currentLevel} and goal "${goal}", I'd recommend completing today's workout with controlled reps, strong technique and consistent intensity.`;

      case "nutrition":
        return `Your nutrition should support your goal "${goal}". Prioritize enough protein, quality food, hydration and a consistent calorie intake.`;

      case "recovery":
        return "Recovery is part of the program. Focus on quality sleep, hydration and giving your muscles enough time to recover between hard sessions.";

      default:
        return "Stay consistent and keep moving forward.";
    }
  };

  /* =======================================================
     QUICK ACTION
  ======================================================= */

  const handleCoachAction = (
    selectedMode: CoachMode
  ): void => {
    setMode(selectedMode);

    setAnswer(
      getModeResponse(
        selectedMode
      )
    );
  };

  /* =======================================================
     ASK COACH
  ======================================================= */

  const askCoach =
    async (): Promise<void> => {
      const trimmedQuestion =
        question.trim();

      if (
        !trimmedQuestion ||
        isLoading
      ) {
        return;
      }

      setIsLoading(true);

      try {
        const response =
          await getAITrainerResponse(
            aiUser,
            trimmedQuestion,
            chatHistory
          );

        setAnswer(response);

        setChatHistory(
          (
            previous: ChatMessage[]
          ) => [
            ...previous,

            {
              role: "user",
              content:
                trimmedQuestion,
            },

            {
              role: "assistant",
              content: response,
            },
          ]
        );

        setQuestion("");
      } catch (error) {
        console.error(
          "IRONAGE AI ERROR:",
          error
        );

        setAnswer(
          "IRONAGE AI is temporarily unavailable. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

  /* =======================================================
     START WORKOUT
  ======================================================= */

  const startWorkout =
    (): void => {
      changeTab("workout");
    };

  /* =======================================================
     FORM SUBMIT
  ======================================================= */

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ): void => {
    event.preventDefault();

    void askCoach();
  };

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <main className="ai-page">

        <img
          src={vasylPhoto}
          alt="IRONAGE athlete"
          className="ai-background"
        />

        <div className="ai-overlay" />

        <section className="ai-coach-card">

          <div className="ai-message">

            <span className="ai-message-label">
              IRONAGE AI
            </span>

            <p>
              Loading your athlete profile...
            </p>

          </div>

        </section>

      </main>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="ai-page">

      {/* BACKGROUND */}

      <img
        src={vasylPhoto}
        alt="IRONAGE athlete"
        className="ai-background"
      />

      <div className="ai-overlay" />

      {/* HEADER */}

      <header className="ai-header">

        <div>

          <span className="ai-eyebrow">
            IRONAGE / INTELLIGENCE
          </span>

          <h1>
            AI
            <span> TRAINER.</span>
          </h1>

        </div>

        <div className="ai-status">

          <i />

          ONLINE

        </div>

      </header>

      {/* COACH CARD */}

      <section className="ai-coach-card">

        <div className="ai-coach-top">

          <div className="ai-avatar">

            <div className="ai-avatar-ring">
              IA
            </div>

          </div>

          <div>

            <span>
              YOUR PERSONAL COACH
            </span>

            <h2>
              IRONAGE AI
            </h2>

          </div>

        </div>

        <div className="ai-message">

          <span className="ai-message-label">
            COACH
          </span>

          <p>
            {coachMessage}
          </p>

          {answer && (
            <p>
              {answer}
            </p>
          )}

        </div>

        <button
          type="button"
          className="ai-workout-button"
          onClick={startWorkout}
        >

          <span>
            START RECOMMENDED WORKOUT
          </span>

          <strong>
            →
          </strong>

        </button>

      </section>

      {/* QUICK ACTIONS */}

      <section className="ai-section">

        <div className="ai-section-title">

          <span>
            QUICK COACH
          </span>

          <h2>
            What do you need?
          </h2>

        </div>

        <div className="ai-actions">

          <button
            type="button"
            onClick={() =>
              handleCoachAction(
                "workout"
              )
            }
          >

            <span className="ai-action-number">
              01
            </span>

            <div>

              <strong>
                CREATE WORKOUT
              </strong>

              <small>
                Build today's session
              </small>

            </div>

            <b>
              →
            </b>

          </button>

          <button
            type="button"
            onClick={() =>
              handleCoachAction(
                "nutrition"
              )
            }
          >

            <span className="ai-action-number">
              02
            </span>

            <div>

              <strong>
                NUTRITION ADVICE
              </strong>

              <small>
                Improve today's meals
              </small>

            </div>

            <b>
              →
            </b>

          </button>

          <button
            type="button"
            onClick={() =>
              handleCoachAction(
                "recovery"
              )
            }
          >

            <span className="ai-action-number">
              03
            </span>

            <div>

              <strong>
                RECOVERY
              </strong>

              <small>
                Sleep & recovery tips
              </small>

            </div>

            <b>
              →
            </b>

          </button>

        </div>

      </section>

      {/* CHAT */}

      <section className="ai-chat">

        <div className="ai-chat-header">

          <div>

            <span>
              ASK IRONAGE AI
            </span>

            <h2>
              Your next move.
            </h2>

          </div>

          <div className="ai-pulse" />

        </div>

        <form
          className="ai-input"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            value={question}
            onChange={(event) =>
              setQuestion(
                event.target.value
              )
            }
            placeholder={
              isLoading
                ? "IRONAGE AI is thinking..."
                : "Ask your coach anything..."
            }
            aria-label="Ask IRONAGE AI"
            disabled={isLoading}
          />

          <button
            type="submit"
            aria-label="Ask coach"
            disabled={
              isLoading ||
              !question.trim()
            }
          >
            {isLoading
              ? "..."
              : "→"}
          </button>

        </form>

      </section>

      {/* FOOTER */}

      <footer className="ai-footer">

        <span>
          POWERED BY IRONAGE INTELLIGENCE
        </span>

      </footer>

    </main>
  );
}
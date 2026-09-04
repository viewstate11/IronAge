import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  useUser,
  type User as ContextUser,
} from "../../context/UserContext";

import {
  useLanguage,
} from "../../context/LanguageContext";

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

  const { t } = useLanguage();

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
        return t("ai.streakStrong").replace(
          "{count}",
          String(currentStreak)
        );
      }

      if (currentStreak >= 5) {
        return t("ai.streakBuilding").replace(
          "{count}",
          String(currentStreak)
        );
      }

      if (completedWorkouts > 0) {
        return t("ai.workoutsDone").replace(
          "{count}",
          String(completedWorkouts)
        );
      }

      return t("ai.foundation");
    }, [
      currentStreak,
      completedWorkouts,
      t,
    ]);

  /* =======================================================
     MODE RESPONSE
  ======================================================= */

  const getModeResponse = (
    selectedMode: CoachMode
  ): string => {
    switch (selectedMode) {
      case "workout":
        return t("ai.workoutResponse")
          .replace("{level}", String(currentLevel))
          .replace("{goal}", String(goal));

      case "nutrition":
        return t("ai.nutritionResponse")
          .replace("{goal}", String(goal));

      case "recovery":
        return t("ai.recoveryResponse");

      default:
        return t("ai.keepGoing");
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
          t("ai.unavailable")
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
          alt={t("dashboard.athlete")}
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
                ? t("ai.thinking")
                : t("ai.askAnything")
            }
            aria-label={t("ai.ask")}
            disabled={isLoading}
          />

          <button
            type="submit"
            aria-label={t("ai.askCoach")}
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
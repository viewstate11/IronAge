import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import type {
  User,
  WorkoutHistoryItem,
} from "../types/user";

import {
  loadUser,
  saveUser,
} from "../services/storageService";

import {
  getTelegramUser,
  initTelegram,
} from "../services/telegramService";

const defaultUser: User = {
  name: "Vasyl",

  age: 30,
  gender: "",

  weight: 80,
  height: 180,

  goal: "Стати сильнішим",

  level: 1,
  xp: 250,

  workouts: 0,
  streak: 0,

  history: [],
};

type UserContextType = {
  user: User;

  setUser: React.Dispatch<
    React.SetStateAction<User>
  >;

  completeWorkout: (
    workoutName?: string,
    duration?: number
  ) => void;
};

const UserContext =
  createContext<UserContextType | null>(
    null
  );

export function UserProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User>(() => {
    const savedUser = loadUser();

    if (!savedUser) {
      return defaultUser;
    }

    return {
      ...defaultUser,
      ...savedUser,

      history: Array.isArray(
        savedUser.history
      )
        ? savedUser.history
        : [],
    };
  });

  /*
   * TELEGRAM
   */

  useEffect(() => {
    const telegram = initTelegram();

    if (!telegram) {
      return;
    }

    const telegramUser =
      getTelegramUser();

    if (!telegramUser) {
      return;
    }

    const telegramName =
      telegramUser.first_name?.trim();

    if (!telegramName) {
      return;
    }

    setUser((prev) => {
      /*
       * Якщо користувач вже має
       * власне ім'я — не перезаписуємо
       * його при кожному запуску.
       */

      if (
        prev.name &&
        prev.name !== "Vasyl"
      ) {
        return prev;
      }

      return {
        ...prev,
        name: telegramName,
      };
    });

    console.log(
      "IRONAGE Telegram user:",
      telegramUser
    );
  }, []);

  /*
   * SAVE USER
   */

  useEffect(() => {
    saveUser(user);
  }, [user]);

  /*
   * COMPLETE WORKOUT
   */

  function completeWorkout(
    workoutName = "Верх тіла",
    duration = 20
  ) {
    const XP_REWARD = 250;

    setUser((prev) => {
      const newXP =
        prev.xp + XP_REWARD;

      const newLevel =
        Math.floor(newXP / 1000) + 1;

      const workout: WorkoutHistoryItem = {
        id: Date.now().toString(),

        name: workoutName,

        duration,

        xp: XP_REWARD,

        date: new Date().toISOString(),
      };

      return {
        ...prev,

        xp: newXP,

        level: newLevel,

        workouts:
          prev.workouts + 1,

        streak:
          prev.streak + 1,

        history: [
          workout,
          ...prev.history,
        ],
      };
    });
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        completeWorkout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context =
    useContext(UserContext);

  if (!context) {
    throw new Error(
      "useUser must be inside UserProvider"
    );
  }

  return context;
}
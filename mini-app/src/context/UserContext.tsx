import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import {
  createOrUpdateUser,
  getUser,
  getSessionUser,
  getIronAgeWebId,
  isWebAuth,
  updateCurrentUser,
  logoutCurrentSession,
  type ApiUser,
} from "../api/client";

import { createWorkout } from "../api/workouts";

import type {
  Gender,
  Goal,
} from "../types/user";

import {
  getTelegramUser,
  getTelegramInitData,
  initTelegram,
  isTelegramWebApp,
  waitForTelegram,
} from "../services/telegramService";

/* =========================================================
   DEVELOPMENT
========================================================= */


/* =========================================================
   TYPES
========================================================= */

export type WorkoutHistoryItem = {
  id: string | number;

  workoutId?: string | number;

  name: string;

  date: string;

  type: string;

  duration: number;

  calories: number;

  xp: number;

  completed: boolean;

  sets?: {
    id?: string | number;
    exerciseId: string;
    exerciseName: string;
    setNumber: number;
    repetitions?: number | null;
    weight?: number | null;
    duration?: number | null;
    completed?: boolean;
  }[];
};

export type ProfileData = {
  name: string;

  age: number;

  gender: Gender | "";

  height: number;

  weight: number;

  goal: Goal | "";
};

export type CompleteWorkoutData = {
  id?: string | number;

  workoutId?: string | number;

  name?: string;

  date?: string;

  type?: string;

  duration?: number;

  calories?: number;

  xp?: number;

  startedAt?: string | null;

  completedAt?: string | null;

  assignmentId?: number;
  programWorkoutId?: number;

  sets?: Array<{
    exerciseId: string;

    exerciseName: string;

    setNumber: number;

    repetitions?: number | null;

    weight?: number | null;

    duration?: number | null;

    completed?: boolean;
  }>;
};

/* =========================================================
   USER
========================================================= */

export type User = Omit<
  ApiUser,
  | "age"
  | "gender"
  | "weight"
  | "height"
  | "goal"
  | "history"
> & {
  age: number | null;

  gender: Gender | string | null;

  weight: number | null;

  height: number | null;

  goal: Goal | string | null;

  history: WorkoutHistoryItem[];
};

/* =========================================================
   CONTEXT TYPE
========================================================= */

export type UserContextValue = {
  user: User;

  authenticated: boolean;

  loading: boolean;

  error: string | null;

  setUser: Dispatch<
    SetStateAction<User>
  >;

  refreshUser: () => Promise<void>;

  logout: () => Promise<void>;

  completeOnboarding: (
    profile: ProfileData
  ) => Promise<User>;

  updateProfile: (
    profile: Partial<ProfileData>
  ) => Promise<User>;

  completeWorkout: (
    workout?: CompleteWorkoutData
  ) => Promise<void>;
};

/* =========================================================
   DEFAULT USER
========================================================= */

function createDefaultUser(): User {
  const now =
    new Date().toISOString();

  return {
    id: 0,

    telegramId: "",

    username: null,

    firstName: "ATHLETE",

    lastName: null,

    languageCode: "uk",

    name: "ATHLETE",

    age: null,

    gender: null,

    weight: null,

    height: null,

    goal: null,

    onboardingCompleted: false,

    level: 1,

    xp: 0,

    workouts: 0,

    streak: 0,

    premiumPlan: null,

    history: [],

    createdAt: now,

    updatedAt: now,
  };
}

/* =========================================================
   NORMALIZE HISTORY
========================================================= */

function normalizeHistory(
  history:
    | ApiUser["history"]
    | undefined
): WorkoutHistoryItem[] {
  if (!Array.isArray(history)) {
    return [];
  }

  return history.map(
    (
      item,
      index
    ): WorkoutHistoryItem => {
      const raw =
        item as Partial<WorkoutHistoryItem>;

      return {
        id:
          raw.id ??
          `history-${index}`,

        workoutId:
          raw.workoutId,

        name:
          raw.name ??
          raw.type ??
          "WORKOUT",

        date:
          raw.date ??
          new Date().toISOString(),

        type:
          raw.type ??
          "workout",

        duration:
          typeof raw.duration === "number"
            ? raw.duration
            : 0,

        calories:
          typeof raw.calories === "number"
            ? raw.calories
            : 0,

        xp:
          typeof raw.xp === "number"
            ? raw.xp
            : 0,

        completed:
          typeof raw.completed === "boolean"
            ? raw.completed
            : true,

        sets:
          Array.isArray(raw.sets)
            ? raw.sets
            : [],
      };
    }
  );
}

/* =========================================================
   NORMALIZE USER
========================================================= */

function normalizeUser(
  apiUser: ApiUser
): User {
  const history =
    normalizeHistory(
      apiUser.history
    );

  return {
    ...apiUser,

    id:
      Number(
        apiUser.id ?? 0
      ),

    telegramId:
      String(
        apiUser.telegramId ?? ""
      ),

    username:
      apiUser.username ?? null,

    firstName:
      apiUser.firstName ||
      "ATHLETE",

    lastName:
      apiUser.lastName ?? null,

    languageCode:
      apiUser.languageCode ||
      "uk",

    name:
      apiUser.name ||
      apiUser.firstName ||
      "ATHLETE",

    age:
      apiUser.age ?? null,

    gender:
      apiUser.gender ?? null,

    weight:
      apiUser.weight ?? null,

    height:
      apiUser.height ?? null,

    goal:
      apiUser.goal ?? null,

    onboardingCompleted:
      Boolean(
        apiUser.onboardingCompleted
      ),

    level:
      typeof apiUser.level === "number"
        ? apiUser.level
        : 1,

    xp:
      typeof apiUser.xp === "number"
        ? apiUser.xp
        : 0,

    streak:
      typeof apiUser.streak === "number"
        ? apiUser.streak
        : 0,

    workouts:
      typeof apiUser.workouts === "number"
        ? apiUser.workouts
        : history.length,

    history,
  };
}

/* =========================================================
   TELEGRAM AUTH DATA
========================================================= */

function getOptionalTelegramInitData(
  webApp?: ReturnType<typeof initTelegram>
): string | null {
  const webAppInitData =
    webApp?.initData?.trim();

  if (webAppInitData) {
    return webAppInitData;
  }

  try {
    const initData =
      getTelegramInitData();

    return initData?.trim() || null;
  } catch {
    return null;
  }
}

/* =========================================================
   CONTEXT
========================================================= */

const UserContext =
  createContext<
    UserContextValue | undefined
  >(undefined);

/* =========================================================
   PROVIDER
========================================================= */

export function UserProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User>(
      createDefaultUser()
    );

  const [authenticated, setAuthenticated] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const workoutSavingRef =
    useRef(false);

  const userLoadingRef =
    useRef(false);

  /* =======================================================
     TELEGRAM IDENTITY
  ======================================================= */

  const resolveTelegramIdentity =
    useCallback(() => {
      const webApp =
        initTelegram();

      const telegramUser =
        getTelegramUser();

      const telegramId =
        telegramUser?.id != null
          ? String(
              telegramUser.id
            ).trim()
          : "";

      const telegramAvailable =
        isTelegramWebApp();

      const development =
        Boolean(
          import.meta.env.DEV
        );

      return {
        webApp,

        telegramUser,

        telegramId,

        telegramAvailable,

        development,
      };
    }, []);

  /* =======================================================
     EFFECTIVE TELEGRAM ID
  ======================================================= */

  const getEffectiveTelegramId =
    useCallback((): string => {
      const identity =
        resolveTelegramIdentity();

      if (
        identity.telegramId
      ) {
        return identity.telegramId;
      }

      const existingTelegramId =
        String(
          user.telegramId ?? ""
        ).trim();

      if (
        existingTelegramId
      ) {
        return existingTelegramId;
      }

      throw new Error(
        "Telegram user ID is missing. Open IRONAGE from the Telegram bot."
      );
    }, [
      resolveTelegramIdentity,
      user.telegramId,
    ]);

  /* =======================================================
     LOAD USER
  ======================================================= */

  const loadUser =
    useCallback(
      async (): Promise<void> => {
        if (
          userLoadingRef.current
        ) {
          return;
        }

        userLoadingRef.current =
          true;

        try {
          setLoading(true);
          setError(null);

          /*
           * Wait for Telegram SDK.
           */

          const webApp =
            await waitForTelegram(
              5000
            );

          /*
           * Telegram is optional.
           *
           * Real Telegram Mini App:
           * use Telegram initData.
           *
           * Browser / Vercel / native WebView:
           * use persistent Web authentication.
           */

          /*
           * Initialize Telegram when available.
           */

          if (webApp) {
            initTelegram();
          }

          /*
           * Resolve identity.
           */

          const identity =
            resolveTelegramIdentity();

          const telegramId =
            identity.telegramId;

          const initData =
            getOptionalTelegramInitData(
              identity.webApp
            );

          /*
           * =====================================================
           * WEB MODE
           * =====================================================
           *
           * Browser/Vercel does not have Telegram initData.
           * In that case api/client.ts automatically uses
           * the persistent Web identity stored in localStorage.
           */

          if (
            !telegramId ||
            !initData
          ) {
            /*
             * First try the real authenticated
             * browser session.
             *
             * The HttpOnly cookie is sent by
             * the browser automatically.
             */

            try {
              const apiUser =
                await getSessionUser();

              const normalized =
                normalizeUser(
                  apiUser
                );

              setUser(
                normalized
              );

              setAuthenticated(true);

              return;
            } catch {
              /*
               * No valid session.
               *
               * Keep the legacy webId path
               * temporarily for existing users.
               */
            }

            const webId =
              getIronAgeWebId();

            if (!webId) {
              setUser(
                createDefaultUser()
              );

              setAuthenticated(false);

              return;
            }

            const apiUser =
              await getUser(
                null,
                null
              );

            const normalized =
              normalizeUser(
                apiUser
              );

            setUser(
              normalized
            );

            setAuthenticated(true);

            return;
          }

          const telegramUser =
            identity.telegramUser;

          const firstName =
            telegramUser?.first_name ||
            "IRON";

          const lastName =
            telegramUser?.last_name ??
            null;

          const username =
            telegramUser?.username ??
            null;

          const languageCode =
            telegramUser?.language_code ||
            "uk";

          const apiUser =
            await createOrUpdateUser(
              {
                telegramId,

                username,

                firstName,

                lastName,

                languageCode,
              },
              initData
            );

          const normalized =
            normalizeUser(
              apiUser
            );

          setUser(
            normalized
          );

          setAuthenticated(true);

        } catch (err) {
          console.error(
            "IRONAGE: User load error:",
            err
          );

          const message =
            err instanceof Error
              ? err.message
              : "Не вдалося завантажити користувача";

          setError(
            message
          );
        } finally {
          setLoading(false);

          userLoadingRef.current =
            false;
        }
      },
      [
        resolveTelegramIdentity,
      ]
    );

  /* =======================================================
     LOGOUT
======================================================= */

  const logout =
    useCallback(
      async (): Promise<void> => {
        try {
          setLoading(true);
          setError(null);

          await logoutCurrentSession();

          setUser(
            createDefaultUser()
          );

          setAuthenticated(false);
        } catch (err) {
          console.error(
            "IRONAGE: Logout error:",
            err
          );

          const message =
            err instanceof Error
              ? err.message
              : "Logout failed";

          setError(message);

          throw err;
        } finally {
          setLoading(false);
        }
      },
      []
    );

  /* =======================================================
     INITIAL LOAD
======================================================= */

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  /* =======================================================
     REFRESH USER
======================================================= */

  const refreshUser =
    useCallback(
      async (): Promise<void> => {
        try {
          setLoading(true);
          setError(null);

          const identity =
            resolveTelegramIdentity();

          const telegramId =
            identity.telegramId;

          const initData =
            getOptionalTelegramInitData(
              identity.webApp
            );

          const telegramAuth =
            Boolean(
              telegramId &&
              initData
            );

          const webAuth =
            !telegramAuth;

          /*
           * WEB:
           * First use the real HttpOnly
           * session cookie.
           *
           * TELEGRAM:
           * Keep the existing Telegram flow.
           */

          let apiUser: ApiUser;

          if (webAuth) {
            try {
              apiUser =
                await getSessionUser();
            } catch {
              const webId =
                getIronAgeWebId();

              if (!webId) {
                setAuthenticated(false);
                setError(null);

                return;
              }

              apiUser =
                await getUser(
                  null,
                  null
                );
            }
          } else {
            apiUser =
              await getUser(
                telegramId,
                initData
              );
          }

          const normalized =
            normalizeUser(
              apiUser
            );

          /*
           * Never lose onboarding state.
           */

          setUser(
            previousUser => ({
              ...normalized,

              onboardingCompleted:
                previousUser.onboardingCompleted ||
                normalized.onboardingCompleted,
            })
          );

          setAuthenticated(true);

        } catch (err) {
          console.error(
            "IRONAGE: Refresh user error:",
            err
          );

          const message =
            err instanceof Error
              ? err.message
              : "Не вдалося оновити користувача";

          setError(
            message
          );

          /*
           * IMPORTANT:
           *
           * Do not throw again.
           *
           * App.tsx calls refreshUser()
           * from RETRY.
           *
           * The error is already stored
           * inside React state.
           */
        } finally {
          setLoading(false);
        }
      },
      [
        resolveTelegramIdentity,
      ]
    );

  /* =======================================================
     COMPLETE ONBOARDING
======================================================= */

  const completeOnboarding =
    useCallback(
      async (
        profile: ProfileData
      ): Promise<User> => {

        if (
          !profile.name?.trim()
        ) {
          throw new Error(
            "Name is required"
          );
        }

        if (
          !Number.isFinite(
            profile.age
          ) ||
          profile.age <= 0
        ) {
          throw new Error(
            "Valid age is required"
          );
        }

        if (
          !Number.isFinite(
            profile.height
          ) ||
          profile.height <= 0
        ) {
          throw new Error(
            "Valid height is required"
          );
        }

        if (
          !Number.isFinite(
            profile.weight
          ) ||
          profile.weight <= 0
        ) {
          throw new Error(
            "Valid weight is required"
          );
        }

        if (!profile.gender) {
          throw new Error(
            "Gender is required"
          );
        }

        if (!profile.goal) {
          throw new Error(
            "Goal is required"
          );
        }

        try {
          setError(null);

          const identity =
            resolveTelegramIdentity();

          const telegramUser =
            identity.telegramUser;

          /*
           * DEV:
           * initData may be empty.
           *
           * Production:
           * api/client.ts requires real initData.
           */

          const initData =
            getOptionalTelegramInitData(
              identity.webApp
            );

          const webAuth =
            isWebAuth();

          const telegramId =
            webAuth
              ? null
              : getEffectiveTelegramId();

          const profileInput = {
            username:
              telegramUser?.username ??
              user.username ??
              null,

            firstName:
              profile.name.trim(),

            lastName:
              telegramUser?.last_name ??
              user.lastName ??
              null,

            languageCode:
              telegramUser?.language_code ??
              user.languageCode ??
              "uk",

            age:
              profile.age,

            gender:
              profile.gender,

            height:
              profile.height,

            weight:
              profile.weight,

            goal:
              profile.goal,

            onboardingCompleted:
              true,
          };

          const apiUser =
            webAuth
              ? await updateCurrentUser(
                  profileInput
                )
              : await createOrUpdateUser(
                  {
                    ...profileInput,
                    telegramId,
                  },
                  initData
                );

          const updatedUser =
            normalizeUser(
              apiUser
            );

          setUser(
            updatedUser
          );

          return updatedUser;
        } catch (err) {
          console.error(
            "IRONAGE: Onboarding error:",
            err
          );

          const message =
            err instanceof Error
              ? err.message
              : "Не вдалося завершити onboarding";

          setError(
            message
          );

          throw err;
        }
      },
      [
        getEffectiveTelegramId,

        resolveTelegramIdentity,

        user.username,

        user.lastName,

        user.languageCode,
      ]
    );

  /* =======================================================
     UPDATE PROFILE
======================================================= */

  const updateProfile =
    useCallback(
      async (
        profile: Partial<ProfileData>
      ): Promise<User> => {
        try {
          setError(null);

          const identity =
            resolveTelegramIdentity();

          const telegramUser =
            identity.telegramUser;

          /*
           * DEV can work without initData.
           */

          const initData =
            getOptionalTelegramInitData(
              identity.webApp
            );

          const webAuth =
            isWebAuth();

          const telegramId =
            webAuth
              ? null
              : getEffectiveTelegramId();

          const webId =
            webAuth
              ? getIronAgeWebId()
              : null;

          const apiUser =
            await createOrUpdateUser(
              {
                telegramId,

                webId,

                username:
                  telegramUser?.username ??
                  user.username ??
                  null,

                /*
                 * Profile name is editable.
                 */

                firstName:
                  profile.name?.trim() ||
                  user.name ||
                  telegramUser?.first_name ||
                  user.firstName ||
                  "ATHLETE",

                lastName:
                  telegramUser?.last_name ??
                  user.lastName ??
                  null,

                languageCode:
                  telegramUser?.language_code ??
                  user.languageCode ??
                  "uk",

                age:
                  profile.age !== undefined
                    ? profile.age
                    : user.age,

                gender:
                  profile.gender !== undefined
                    ? profile.gender
                    : user.gender,

                height:
                  profile.height !== undefined
                    ? profile.height
                    : user.height,

                weight:
                  profile.weight !== undefined
                    ? profile.weight
                    : user.weight,

                goal:
                  profile.goal !== undefined
                    ? profile.goal
                    : user.goal,

                onboardingCompleted:
                  true,
              },
              initData
            );

          const updatedUser =
            normalizeUser(
              apiUser
            );

          setUser(
            updatedUser
          );

          return updatedUser;
        } catch (err) {
          console.error(
            "IRONAGE: Profile update error:",
            err
          );

          const message =
            err instanceof Error
              ? err.message
              : "Не вдалося зберегти профіль";

          setError(
            message
          );

          throw err;
        }
      },
      [
        user,
        getEffectiveTelegramId,
        resolveTelegramIdentity,
      ]
    );

  /* =======================================================
     COMPLETE WORKOUT
======================================================= */

  const completeWorkout =
    useCallback(
      async (
        workout:
          CompleteWorkoutData = {}
      ): Promise<void> => {
        if (
          workoutSavingRef.current
        ) {
          console.warn(
            "IRONAGE: Workout save already in progress."
          );

          return;
        }

        if (!user.id) {
          throw new Error(
            "Cannot save workout: user ID is missing"
          );
        }

        const workoutId =
          String(
            workout.workoutId ??
            ""
          ).trim();

        if (!workoutId) {
          throw new Error(
            "Workout ID is required"
          );
        }

        const workoutName =
          String(
            workout.name ??
            "Workout"
          ).trim();

        if (!workoutName) {
          throw new Error(
            "Workout name is required"
          );
        }

        const duration =
          Math.max(
            0,
            Number(
              workout.duration ?? 0
            )
          );

        const earnedXp =
          Math.max(
            0,
            Number(
              workout.xp ?? 100
            )
          );

        const now =
          new Date().toISOString();

        const sets =
          Array.isArray(
            workout.sets
          )
            ? workout.sets
            : [];

        workoutSavingRef.current =
          true;

        try {
          setError(null);

          const savedWorkout =
            await createWorkout({
              userId:
                Number(user.id),

              workoutId,

              workoutName,

              assignmentId:
                workout.assignmentId,

              programWorkoutId:
                workout.programWorkoutId,

              duration,

              xp:
                earnedXp,

              status:
                "COMPLETED",

              startedAt:
                workout.startedAt ??
                null,

              completedAt:
                workout.completedAt ??
                now,

              sets,
            });

          /*
           * Refresh user after workout.
           */

          const identity =
            resolveTelegramIdentity();

          const initData =
            getOptionalTelegramInitData(
              identity.webApp
            );

          const updatedApiUser =
            await getUser(
              identity.telegramId || null,
              initData
            );

          const updatedUser =
            normalizeUser(
              updatedApiUser
            );

          /*
           * NEVER lose onboarding state.
           */

          setUser(
            previousUser => ({
              ...updatedUser,

              onboardingCompleted:
                previousUser.onboardingCompleted ||
                updatedUser.onboardingCompleted,
            })
          );

        } catch (err) {
          console.error(
            "IRONAGE: Workout save error:",
            err
          );

          const message =
            err instanceof Error
              ? err.message
              : "Не вдалося зберегти тренування";

          setError(
            message
          );

          throw err;
        } finally {
          workoutSavingRef.current =
            false;
        }
      },
      [
        user.id,

        user.telegramId,

        getEffectiveTelegramId,

        resolveTelegramIdentity,
      ]
    );

  /* =======================================================
     CONTEXT VALUE
======================================================= */

  const value =
    useMemo<UserContextValue>(
      () => ({
        user,

        authenticated,

        loading,

        error,

        setUser,

        refreshUser,

        logout,

        completeOnboarding,

        updateProfile,

        completeWorkout,
      }),
      [
        user,

        authenticated,

        loading,

        error,

        refreshUser,

        logout,

        completeOnboarding,

        updateProfile,

        completeWorkout,
      ]
    );

  return (
    <UserContext.Provider
      value={value}
    >
      {children}
    </UserContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useUser(): UserContextValue {
  const context =
    useContext(UserContext);

  if (!context) {
    throw new Error(
      "useUser must be used inside UserProvider"
    );
  }

  return context;
}
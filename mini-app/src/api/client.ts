const API_URL =
  import.meta.env.VITE_API_URL || "/api";

/* =========================================================
   TYPES
========================================================= */

export type WorkoutHistorySet = {
  id?: string | number;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  repetitions?: number | null;
  weight?: number | null;
  duration?: number | null;
  completed?: boolean;
};

export type WorkoutHistoryItem = {
  id: string | number;
  name: string;
  workoutId?: string;
  duration: number;
  xp: number;
  date: string;
  completedAt?: string;
  status?: string;
  sets?: WorkoutHistorySet[];
};

export type ProgressRecord = {
  id: number | string;
  userId: number | string;
  weight: number | null;
  bodyFat: number | null;
  muscleMass: number | null;
  note?: string | null;
  createdAt: string;
};

export type ApiUser = {
  id: number | string;

  telegramId?: number | string | null;

  webId?: string | null;

  username?: string | null;
  firstName?: string;
  lastName?: string | null;
  languageCode?: string | null;

  name: string;

  age: number | null;
  gender: string | null;
  weight: number | null;
  height: number | null;
  goal: string | null;

  level: number;
  xp: number;
  workouts: number;
  streak: number;

  onboardingCompleted?: boolean;

  premiumPlan?: string | null;

  history?: WorkoutHistoryItem[];

  createdAt?: string;
  updatedAt?: string;
};

export type CreateOrUpdateUserInput = {
  telegramId?: number | string | null;

  webId?: string | null;

  username?: string | null;
  firstName?: string;
  lastName?: string | null;
  languageCode?: string | null;

  name?: string;

  age?: number | null;
  gender?: string | null;
  weight?: number | null;
  height?: number | null;
  goal?: string | null;

  onboardingCompleted?: boolean;
};

export type CreateProgressInput = {
  weight?: number | null;
  bodyFat?: number | null;
  muscleMass?: number | null;
  note?: string | null;
};

type RequestOptions = RequestInit & {
  token?: string;
};

/* =========================================================
   AUTH MODE
========================================================= */

export type PremiumPlan =
  | "MONTHLY"
  | "YEARLY";

export type AuthMode =
  | "telegram"
  | "web";

/* =========================================================
   PREMIUM API
========================================================= */

export async function getPremiumPlan(): Promise<
  PremiumPlan | null
> {
  const response =
    await api.get<{
      success: boolean;
      premiumPlan: PremiumPlan | null;
    }>(
      "/premium",
      telegramAuthOptions()
    );

  if (
    !response ||
    !Object.prototype.hasOwnProperty.call(
      response,
      "premiumPlan"
    )
  ) {
    throw new Error(
      "Invalid premium response from API"
    );
  }

  return response.premiumPlan;
}

/* =========================================================
   WEB IDENTITY
========================================================= */

const WEB_ID_STORAGE_KEY =
  "ironage.web.id";

/**
 * Returns the persistent browser identity.
 *
 * This is NOT a Telegram ID.
 *
 * It is only used when IRONAGE
 * is opened directly on the web.
 */
function getWebId(): string {
  if (
    typeof window === "undefined"
  ) {
    return "";
  }

  try {
    const existing =
      window.localStorage.getItem(
        WEB_ID_STORAGE_KEY
      );

    if (
      existing &&
      existing.trim()
    ) {
      return existing.trim();
    }

    const generated =
      crypto.randomUUID();

    window.localStorage.setItem(
      WEB_ID_STORAGE_KEY,
      generated
    );

    return generated;
  } catch (error) {
    console.error(
      "IRONAGE: Failed to create web identity:",
      error
    );

    return "";
  }
}

/* =========================================================
   REQUEST
========================================================= */

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    token,
    headers,
    ...fetchOptions
  } = options;

  const response =
    await fetch(
      `${API_URL}${path}`,
      {
        ...fetchOptions,

        headers: {
          "Content-Type":
            "application/json",

          ...(token
            ? {
                Authorization:
                  `Bearer ${token}`,
              }
            : {}),

          ...headers,
        },
      }
    );

  const text =
    await response.text();

  let data: unknown = null;

  try {
    data =
      text
        ? JSON.parse(text)
        : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data
        ? String(
            (
              data as {
                message: unknown;
              }
            ).message
          )
        : `API error ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}

/* =========================================================
   GENERIC API
========================================================= */

export const api = {
  get<T>(
    path: string,
    options?: RequestOptions
  ) {
    return request<T>(
      path,
      {
        ...options,
        method: "GET",
      }
    );
  },

  post<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions
  ) {
    return request<T>(
      path,
      {
        ...options,
        method: "POST",

        body:
          body === undefined
            ? undefined
            : JSON.stringify(body),
      }
    );
  },

  put<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions
  ) {
    return request<T>(
      path,
      {
        ...options,
        method: "PUT",

        body:
          body === undefined
            ? undefined
            : JSON.stringify(body),
      }
    );
  },

  patch<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions
  ) {
    return request<T>(
      path,
      {
        ...options,
        method: "PATCH",

        body:
          body === undefined
            ? undefined
            : JSON.stringify(body),
      }
    );
  },

  delete<T>(
    path: string,
    options?: RequestOptions
  ) {
    return request<T>(
      path,
      {
        ...options,
        method: "DELETE",
      }
    );
  },
};

/* =========================================================
   TELEGRAM INIT DATA
========================================================= */

let cachedTelegramInitData = "";

/**
 * Reads Telegram initData from
 * the current Telegram WebApp.
 */
function readTelegramInitData(): string {
  if (
    typeof window === "undefined"
  ) {
    return "";
  }

  const webApp =
    window.Telegram?.WebApp;

  if (!webApp) {
    return cachedTelegramInitData;
  }

  const current =
    webApp.initData?.trim() || "";

  if (current) {
    cachedTelegramInitData =
      current;

    return current;
  }

  return cachedTelegramInitData;
}

/* =========================================================
   AUTH MODE DETECTION
========================================================= */

export function getAuthMode(): AuthMode {
  if (typeof window === "undefined") {
    return "web";
  }

  const webApp =
    window.Telegram?.WebApp;

  const telegramInitData =
    webApp?.initData?.trim() || "";

  if (telegramInitData) {
    return "telegram";
  }

  return "web";
}

/* =========================================================
   AUTH OPTIONS
========================================================= */

export function telegramAuthOptions(
  initData?: string | null
): RequestOptions {
  /*
   * Priority:
   *
   * 1. Explicit Telegram initData
   * 2. Current Telegram initData
   * 3. Cached Telegram initData
   * 4. Web ID
   */

  const value =
    initData?.trim() ||
    readTelegramInitData();

  /* =======================================================
     TELEGRAM
  ======================================================= */

  if (value) {
    return {
      headers: {
        "x-telegram-init-data":
          value,
      },
    };
  }

  /* =======================================================
     WEB
  ======================================================= */

  const webId =
    getWebId();

  if (!webId) {
    throw new Error(
      "IRONAGE web identity could not be created."
    );
  }

  return {
    headers: {
      "x-ironage-web-id":
        webId,
    },
  };
}

/* =========================================================
   AUTH HEADERS
========================================================= */

export function getAuthHeaders(
  initData?: string | null
): HeadersInit {
  const value =
    initData?.trim() ||
    readTelegramInitData();

  /*
   * TELEGRAM
   */

  if (value) {
    return {
      "x-telegram-init-data":
        value,
    };
  }

  /*
   * WEB
   */

  const webId =
    getWebId();

  if (!webId) {
    throw new Error(
      "IRONAGE web identity could not be created."
    );
  }

  return {
    "x-ironage-web-id":
      webId,
  };
}

/* =========================================================
   GET USER
========================================================= */

export async function getUser(
  telegramId?: number | string | null,
  initData?: string | null
): Promise<ApiUser> {
  const mode =
    getAuthMode();

  /* =======================================================
     TELEGRAM
  ======================================================= */

  if (
    mode === "telegram"
  ) {
    if (
      telegramId === undefined ||
      telegramId === null ||
      String(telegramId).trim() === ""
    ) {
      throw new Error(
        "Telegram user ID is missing."
      );
    }

    const response =
      await api.get<{
        success: boolean;
        user: ApiUser;
      }>(
        `/users/telegram/${encodeURIComponent(
          String(telegramId)
        )}`,
        telegramAuthOptions(
          initData
        )
      );

    if (
      !response ||
      !response.user
    ) {
      throw new Error(
        "Invalid Telegram user response from API"
      );
    }

    return response.user;
  }

  /* =======================================================
     WEB
  ======================================================= */

  const response =
    await api.get<{
      success: boolean;
      user: ApiUser;
    }>(
      "/users/web/me",
      telegramAuthOptions()
    );

  if (
    !response ||
    !response.user
  ) {
    throw new Error(
      "Invalid Web user response from API"
    );
  }

  return response.user;
}

/* =========================================================
   CREATE / UPDATE USER
========================================================= */

export async function createOrUpdateUser(
  data: CreateOrUpdateUserInput,
  initData?: string | null
): Promise<ApiUser> {
  const mode =
    getAuthMode();

  /* =======================================================
     TELEGRAM
  ======================================================= */

  if (
    mode === "telegram"
  ) {
    const response =
      await api.post<{
        success: boolean;
        user: ApiUser;
      }>(
        "/users",
        data,
        telegramAuthOptions(
          initData
        )
      );

    if (
      !response ||
      !response.user
    ) {
      throw new Error(
        "Invalid Telegram user response from API"
      );
    }

    return response.user;
  }

  /* =======================================================
     WEB
  ======================================================= */

  const webId =
    getWebId();

  if (!webId) {
    throw new Error(
      "IRONAGE web identity could not be created."
    );
  }

  const webData: CreateOrUpdateUserInput = {
    ...data,

    telegramId:
      null,

    webId,
  };

  const response =
    await api.post<{
      success: boolean;
      user: ApiUser;
    }>(
      "/users/web",
      webData,
      telegramAuthOptions()
    );

  if (
    !response ||
    !response.user
  ) {
    throw new Error(
      "Invalid Web user response from API"
    );
  }

  return response.user;
}

/* =========================================================
   CURRENT USER
========================================================= */

export async function getCurrentUser(): Promise<ApiUser> {
  const mode =
    getAuthMode();

  if (
    mode === "telegram"
  ) {
    const webApp =
      typeof window !== "undefined"
        ? window.Telegram?.WebApp
        : undefined;

    const telegramUser =
      webApp?.initDataUnsafe?.user;

    if (
      !telegramUser?.id
    ) {
      throw new Error(
        "Telegram user is missing."
      );
    }

    return getUser(
      telegramUser.id
    );
  }

  return getUser();
}

/* =========================================================
   PROGRESS API
========================================================= */

/**
 * Get all body progress records
 * for the currently authenticated
 * IRONAGE user.
 *
 * WEB:
 *   x-ironage-web-id
 *
 * TELEGRAM:
 *   x-telegram-init-data
 */
export async function getProgress(): Promise<
  ProgressRecord[]
> {
  const response =
    await api.get<{
      success: boolean;
      progress: ProgressRecord[];
    }>(
      "/progress",
      telegramAuthOptions()
    );

  if (
    !response ||
    !Array.isArray(
      response.progress
    )
  ) {
    throw new Error(
      "Invalid progress response from API"
    );
  }

  return response.progress;
}

/**
 * Create a new body progress
 * record for the authenticated user.
 */
export async function createProgress(
  data: CreateProgressInput
): Promise<ProgressRecord> {
  const response =
    await api.post<{
      success: boolean;
      progress: ProgressRecord;
    }>(
      "/progress",
      data,
      telegramAuthOptions()
    );

  if (
    !response ||
    !response.progress
  ) {
    throw new Error(
      "Invalid progress creation response from API"
    );
  }

  return response.progress;
}

/**
 * Get progress history.
 *
 * Alias for getProgress().
 */
export async function getProgressHistory(): Promise<
  ProgressRecord[]
> {
  return getProgress();
}

/* =========================================================
   PREMIUM API
========================================================= */

/* =========================================================
   WEB ID
========================================================= */

export function getIronAgeWebId(): string | null {
  const webId =
    getWebId();

  return webId || null;
}

/* =========================================================
   IS TELEGRAM
========================================================= */

export function isTelegramAuth(): boolean {
  return (
    getAuthMode() ===
    "telegram"
  );
}

/* =========================================================
   IS WEB
========================================================= */

export function isWebAuth(): boolean {
  return (
    getAuthMode() ===
    "web"
  );
}

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default api;
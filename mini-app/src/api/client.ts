import { Capacitor } from "@capacitor/core";

import {
  getNativeSessionToken,
  removeNativeSessionToken,
  saveNativeSessionToken,
  usesNativeSessionStorage,
} from "../native/nativeSessionStorage";

const API_URL =
  import.meta.env.VITE_API_URL || "/api";

async function sessionFingerprint(
  token: string
): Promise<string> {
  const bytes =
    new TextEncoder().encode(token);

  const digest =
    await crypto.subtle.digest(
      "SHA-256",
      bytes
    );

  return Array.from(
    new Uint8Array(digest)
  )
    .map(value =>
      value.toString(16).padStart(2, "0")
    )
    .join("")
    .slice(0, 8);
}

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

export type PremiumVerificationResult = {
  premiumPlan: PremiumPlan;
  isPremium: boolean;
};

export async function verifyApplePremiumPurchase(
  signedTransaction: string
): Promise<PremiumVerificationResult> {
  if (
    typeof signedTransaction !== "string" ||
    signedTransaction.length === 0
  ) {
    throw new Error(
      "Apple signed transaction is required"
    );
  }

  const response =
    await api.post<{
      success: boolean;
      premiumPlan: PremiumPlan;
      isPremium: boolean;
    }>(
      "/premium/verify",
      {
        provider: "APPLE",
        platform: "IOS",
        verificationPayload:
          signedTransaction,
      },
      telegramAuthOptions()
    );

  if (
    !response ||
    response.success !== true ||
    (
      response.premiumPlan !== "MONTHLY" &&
      response.premiumPlan !== "YEARLY"
    ) ||
    response.isPremium !== true
  ) {
    throw new Error(
      "Invalid Apple Premium verification response"
    );
  }

  return {
    premiumPlan:
      response.premiumPlan,
    isPremium:
      response.isPremium,
  };
}

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

  const requestHeaders =
    new Headers(headers);

  if (
    Capacitor.isNativePlatform() &&
    Capacitor.getPlatform() === "ios"
  ) {
    requestHeaders.set(
      "x-ironage-native-platform",
      "ios"
    );
  }

  const hasTelegramHeader =
    requestHeaders.has(
      "x-telegram-init-data"
    );

  if (
    !token &&
    !hasTelegramHeader
  ) {
    const nativeSessionToken =
      await getNativeSessionToken();

    if (nativeSessionToken) {
      requestHeaders.set(
        "x-ironage-session",
        nativeSessionToken
      );

      if (path === "/users/me") {
        console.log(
          "IRONAGE SESSION OUT:",
          await sessionFingerprint(
            nativeSessionToken
          )
        );
      }
    }
  }

  const response =
    await fetch(
      `${API_URL}${path}`,
      {
        credentials: "include",

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

          ...Object.fromEntries(
            requestHeaders.entries()
          ),
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
   * 4. HttpOnly Web session cookie
   */

  const value =
    initData?.trim() ||
    readTelegramInitData();

  if (value) {
    return {
      headers: {
        "x-telegram-init-data":
          value,
      },
    };
  }

  /*
   * Web authentication uses the HttpOnly
   * session cookie sent automatically
   * by request().
   */
  return {};
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
     WEB SESSION
  ======================================================= */

  return getSessionUser();
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
     WEB SESSION
  ======================================================= */

  const response =
    await api.patch<{
      success: boolean;
      user: ApiUser;
    }>(
      "/users/me",
      data,
      {
        credentials: "include",
      }
    );

  if (
    !response ||
    !response.user
  ) {
    throw new Error(
      "Invalid session user update response from API"
    );
  }

  return response.user;
}

/* =========================================================
   SESSION USER
========================================================= */

export async function getSessionUser(): Promise<ApiUser> {
  const response =
    await api.get<{
      success: boolean;
      user: ApiUser;
    }>(
      "/users/me",
      {
        credentials: "include",
      }
    );

  if (
    !response ||
    !response.user
  ) {
    throw new Error(
      "Invalid session user response from API"
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
 *   HttpOnly session cookie
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
/* =========================================================
   EMAIL AUTH
========================================================= */

export type EmailRegistrationResult = {
  success: boolean;
  emailVerificationRequired: true;
  user: ApiUser;
};

export type EmailLoginResult = {
  success: boolean;
  authType: "session";
  session: {
    expiresAt: string;
    token?: string;
  };
  user: ApiUser;
};

export async function registerEmail(
  email: string,
  password: string,
  firstName: string
): Promise<EmailRegistrationResult> {
  return api.post<EmailRegistrationResult>(
    "/auth/email/register",
    {
      email: email.trim().toLowerCase(),
      password,
      firstName: firstName.trim(),
    }
  );
}

export async function loginEmail(
  email: string,
  password: string
): Promise<EmailLoginResult> {
  const response =
    await api.post<EmailLoginResult>(
      "/auth/email/login",
      {
        email: email.trim().toLowerCase(),
        password,
      }
    );

  if (usesNativeSessionStorage()) {
    const sessionToken =
      response.session?.token?.trim();

    if (!sessionToken) {
      throw new Error(
        "Native session token missing"
      );
    }

    console.log(
      "IRONAGE SESSION GOOGLE:",
      await sessionFingerprint(
        sessionToken
      )
    );

    await saveNativeSessionToken(
      sessionToken
    );
  }

  return response;
}

export type EmailVerificationResult = {
  success: boolean;
  authType: "session";
  emailVerified: true;
  session: {
    expiresAt: string;
    token?: string;
  };
};

export async function verifyEmail(
  token: string
): Promise<EmailVerificationResult> {
  const normalizedToken =
    token.trim();

  if (!normalizedToken) {
    throw new Error(
      "Verification token is required"
    );
  }

  const response =
    await api.post<EmailVerificationResult>(
      "/auth/email/verify",
      {
        token: normalizedToken,
      }
    );

  if (usesNativeSessionStorage()) {
    const sessionToken =
      response.session?.token?.trim();

    if (!sessionToken) {
      throw new Error(
        "Native session token missing"
      );
    }

    await saveNativeSessionToken(
      sessionToken
    );
  }

  return response;
}

/* =========================================================
   UPDATE CURRENT USER
========================================================= */

export async function updateCurrentUser(
  input: CreateOrUpdateUserInput
): Promise<ApiUser> {
  const response =
    await api.patch<{
      success: boolean;
      user: ApiUser;
    }>(
      "/users/me",
      input,
      telegramAuthOptions()
    );

  if (
    !response ||
    response.success !== true ||
    !response.user
  ) {
    throw new Error(
      "Invalid current user update response"
    );
  }

  return response.user;
}

/* =========================================================
   LOGOUT CURRENT SESSION
========================================================= */

export async function logoutCurrentSession(): Promise<void> {
  console.error("IRONAGE DEBUG: logoutCurrentSession CALLED");
  console.trace("IRONAGE DEBUG LOGOUT TRACE");

  try {
    const response =
      await api.post<{
        success: boolean;
      }>(
        "/auth/logout",
        {}
      );

    if (
      !response ||
      response.success !== true
    ) {
      throw new Error(
        "Logout failed"
      );
    }
  } finally {
    await removeNativeSessionToken();
  }
}

/* =========================================================
   GOOGLE AUTH
========================================================= */

export type GoogleLoginResult = {
  success: boolean;
  authType: "session";
  session: {
    expiresAt: string;
    token?: string;
  };
  user: ApiUser;
};

export async function loginGoogle(
  idToken: string
): Promise<GoogleLoginResult> {
  console.log("IRONAGE DEBUG: loginGoogle CALLED");
  console.trace("IRONAGE DEBUG GOOGLE TRACE");
  const normalizedToken =
    idToken.trim();

  if (!normalizedToken) {
    throw new Error(
      "Google credential is required"
    );
  }

  if (usesNativeSessionStorage()) {
    await removeNativeSessionToken();
  }

  const response =
    await api.post<GoogleLoginResult>(
      "/auth/google",
      {
        idToken: normalizedToken,
      }
    );

  if (usesNativeSessionStorage()) {
    const sessionToken =
      response.session?.token?.trim();

    if (!sessionToken) {
      throw new Error(
        "Native session token missing"
      );
    }

    console.log(
      "IRONAGE SESSION GOOGLE:",
      await sessionFingerprint(
        sessionToken
      )
    );

    await saveNativeSessionToken(
      sessionToken
    );
  }

  return response;
}

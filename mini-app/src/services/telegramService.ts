export type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
};

export type TelegramBackButton = {
  show: () => void;
  hide: () => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
};

export type TelegramWebApp = {
  initData: string;

  initDataUnsafe: {
    user?: TelegramUser;
    query_id?: string;
    auth_date?: number;
    hash?: string;
  };

  ready: () => void;
  expand: () => void;
  close: () => void;

  BackButton?: TelegramBackButton;

  platform?: string;
  version?: string;
  colorScheme?: string;

  isVersionAtLeast?: (version: string) => boolean;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

/* =========================================================
   CACHE
========================================================= */

let telegramInitialized = false;

let cachedTelegramUser: TelegramUser | null = null;

let cachedInitData = "";

/* =========================================================
   GET WEB APP
========================================================= */

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.Telegram?.WebApp ?? null;
}

/* =========================================================
   CHECK TELEGRAM
========================================================= */

export function isTelegramWebApp(): boolean {
  return getTelegramWebApp() !== null;
}

/* =========================================================
   VERSION CHECK
========================================================= */

function parseVersion(version: string | undefined): number[] {
  if (!version) {
    return [0];
  }

  return version
    .split(".")
    .map((part) => {
      const parsed = Number.parseInt(part, 10);

      return Number.isFinite(parsed)
        ? parsed
        : 0;
    });
}

function isTelegramVersionAtLeast(
  requiredVersion: string
): boolean {
  const webApp = getTelegramWebApp();

  if (!webApp) {
    return false;
  }

  /*
   * Prefer Telegram's native helper when available.
   */
  if (
    typeof webApp.isVersionAtLeast ===
    "function"
  ) {
    try {
      return webApp.isVersionAtLeast(
        requiredVersion
      );
    } catch {
      // Fall through to manual comparison.
    }
  }

  /*
   * Manual fallback.
   */
  const current =
    parseVersion(webApp.version);

  const required =
    parseVersion(requiredVersion);

  const length = Math.max(
    current.length,
    required.length
  );

  for (let i = 0; i < length; i += 1) {
    const currentPart =
      current[i] ?? 0;

    const requiredPart =
      required[i] ?? 0;

    if (currentPart > requiredPart) {
      return true;
    }

    if (currentPart < requiredPart) {
      return false;
    }
  }

  return true;
}

/* =========================================================
   PARSE USER FROM RAW INIT DATA
========================================================= */

function parseUserFromInitData(
  initData: string
): TelegramUser | null {
  if (!initData) {
    return null;
  }

  try {
    const params =
      new URLSearchParams(initData);

    const userJson =
      params.get("user");

    if (!userJson) {
      return null;
    }

    const parsed =
      JSON.parse(userJson) as Partial<TelegramUser>;

    if (
      typeof parsed.id !== "number" ||
      parsed.id <= 0 ||
      typeof parsed.first_name !== "string" ||
      !parsed.first_name.trim()
    ) {
      return null;
    }

    return {
      id: parsed.id,
      first_name: parsed.first_name,
      last_name: parsed.last_name,
      username: parsed.username,
      language_code:
        parsed.language_code,
      photo_url:
        parsed.photo_url,
    };
  } catch (error) {
    console.error(
      "IRONAGE: Failed to parse Telegram initData:",
      error
    );

    return null;
  }
}

/* =========================================================
   WAIT FOR TELEGRAM WEB APP
========================================================= */

export function waitForTelegram(
  timeout = 5000
): Promise<TelegramWebApp | null> {
  return new Promise((resolve) => {
    const existing =
      getTelegramWebApp();

    if (existing) {
      resolve(existing);
      return;
    }

    const startedAt =
      Date.now();

    const check = () => {
      const webApp =
        getTelegramWebApp();

      if (webApp) {
        resolve(webApp);
        return;
      }

      if (
        Date.now() - startedAt >=
        timeout
      ) {
        console.warn(
          "IRONAGE: Telegram WebApp was not detected within timeout."
        );

        resolve(null);
        return;
      }

      window.setTimeout(
        check,
        50
      );
    };

    check();
  });
}

/* =========================================================
   INITIALIZE TELEGRAM
========================================================= */

export function initTelegram(): TelegramWebApp | null {
  const webApp =
    getTelegramWebApp();

  if (!webApp) {
    console.warn(
      "IRONAGE: Telegram WebApp is not available."
    );

    return null;
  }

  /*
   * Cache initData as early as possible.
   */
  const initData =
    webApp.initData?.trim() ?? "";

  if (initData) {
    cachedInitData =
      initData;
  }

  /*
   * Cache user from initDataUnsafe.
   */
  const unsafeUser =
    webApp.initDataUnsafe?.user;

  if (
    unsafeUser &&
    typeof unsafeUser.id === "number" &&
    unsafeUser.id > 0 &&
    typeof unsafeUser.first_name === "string" &&
    unsafeUser.first_name.trim()
  ) {
    cachedTelegramUser =
      unsafeUser;
  }

  /*
   * Fallback:
   * recover user from raw initData.
   */
  if (
    !cachedTelegramUser &&
    cachedInitData
  ) {
    const parsedUser =
      parseUserFromInitData(
        cachedInitData
      );

    if (parsedUser) {
      cachedTelegramUser =
        parsedUser;
    }
  }

  /*
   * Initialize Telegram only once.
   */
  if (!telegramInitialized) {
    try {
      webApp.ready();
      webApp.expand();

      telegramInitialized =
        true;

    } catch (error) {
      console.error(
        "IRONAGE: Telegram initialization error:",
        error
      );
    }
  }

  return webApp;
}

/* =========================================================
   GET TELEGRAM USER
========================================================= */

export function getTelegramUser(): TelegramUser | null {
  /*
   * 1. Return cached user immediately.
   */
  if (cachedTelegramUser) {
    return cachedTelegramUser;
  }

  const webApp =
    getTelegramWebApp();

  if (!webApp) {
    return null;
  }

  /*
   * 2. Try Telegram's initDataUnsafe.
   */
  const unsafeUser =
    webApp.initDataUnsafe?.user;

  if (
    unsafeUser &&
    typeof unsafeUser.id === "number" &&
    unsafeUser.id > 0 &&
    typeof unsafeUser.first_name === "string" &&
    unsafeUser.first_name.trim()
  ) {
    cachedTelegramUser =
      unsafeUser;

    return cachedTelegramUser;
  }

  /*
   * 3. Try raw initData.
   */
  const initData =
    webApp.initData?.trim();

  if (initData) {
    cachedInitData =
      initData;

    const parsedUser =
      parseUserFromInitData(
        initData
      );

    if (parsedUser) {
      cachedTelegramUser =
        parsedUser;

      return cachedTelegramUser;
    }
  }

  /*
   * 4. Try cached initData.
   */
  if (cachedInitData) {
    const parsedUser =
      parseUserFromInitData(
        cachedInitData
      );

    if (parsedUser) {
      cachedTelegramUser =
        parsedUser;

      return cachedTelegramUser;
    }
  }

  return null;
}

/* =========================================================
   GET INIT DATA
========================================================= */

export function getTelegramInitData(): string | null {
  /*
   * Always read current Telegram WebApp first.
   */
  const webApp =
    getTelegramWebApp();

  if (webApp) {
    const currentInitData =
      webApp.initData?.trim();

    if (currentInitData) {
      cachedInitData =
        currentInitData;

      return cachedInitData;
    }
  }

  /*
   * Fallback to cached initData.
   */
  if (cachedInitData) {
    return cachedInitData;
  }

  return null;
}

/* =========================================================
   REQUIRE INIT DATA
========================================================= */

export function requireTelegramInitData(): string {
  const initData =
    getTelegramInitData();

  if (!initData) {
    throw new Error(
      "Telegram authentication data is missing. Open IRONAGE from the Telegram Mini App button."
    );
  }

  return initData;
}

/* =========================================================
   USER ID
========================================================= */

export function getTelegramUserId(): number | null {
  return (
    getTelegramUser()?.id ??
    null
  );
}

/* =========================================================
   BACK BUTTON
========================================================= */

/**
 * Telegram BackButton requires Telegram WebApp >= 6.1.
 *
 * Your current environment reports version 6.0,
 * therefore we MUST NOT call:
 *
 *   BackButton.show()
 *   BackButton.onClick()
 *
 * on that version.
 */
export function showTelegramBackButton(
  callback: () => void
): () => void {
  const webApp =
    getTelegramWebApp();

  /*
   * No Telegram WebApp.
   */
  if (!webApp) {
    return () => {};
  }

  /*
   * BackButton is officially supported
   * starting from Telegram WebApp 6.1.
   */
  if (
    !isTelegramVersionAtLeast(
      "6.1"
    )
  ) {
    return () => {};
  }

  /*
   * Telegram object does not expose
   * BackButton in this environment.
   */
  if (!webApp.BackButton) {
    return () => {};
  }

  try {
    webApp.BackButton.show();

    webApp.BackButton.onClick(
      callback
    );

    return () => {
      try {
        webApp.BackButton?.offClick(
          callback
        );

        webApp.BackButton?.hide();
      } catch (error) {
        console.warn(
          "IRONAGE: Failed to cleanup Telegram BackButton:",
          error
        );
      }
    };
  } catch (error) {
    console.warn(
      "IRONAGE: Telegram BackButton is unavailable:",
      error
    );

    return () => {};
  }
}

/* =========================================================
   HIDE BACK BUTTON
========================================================= */

export function hideTelegramBackButton(): void {
  const webApp =
    getTelegramWebApp();

  if (!webApp) {
    return;
  }

  /*
   * Do not call Telegram BackButton API
   * on unsupported versions.
   */
  if (
    !isTelegramVersionAtLeast(
      "6.1"
    )
  ) {
    return;
  }

  try {
    webApp.BackButton?.hide();
  } catch (error) {
    console.warn(
      "IRONAGE: Failed to hide Telegram BackButton:",
      error
    );
  }
}
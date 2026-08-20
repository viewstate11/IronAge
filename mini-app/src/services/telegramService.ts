 export type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
};

type TelegramWebApp = {
  initData: string;

  initDataUnsafe: {
    user?: TelegramUser;
    query_id?: string;
    auth_date?: number;
  };

  ready: () => void;
  expand: () => void;
  close: () => void;

  BackButton?: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
};

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export function getTelegramWebApp():
  | TelegramWebApp
  | null {
  if (
    typeof window === "undefined" ||
    !window.Telegram?.WebApp
  ) {
    return null;
  }

  return window.Telegram.WebApp;
}

export function initTelegram() {
  const webApp = getTelegramWebApp();

  if (!webApp) {
    console.log(
      "IRONAGE: Telegram WebApp not detected"
    );

    return null;
  }

  webApp.ready();
  webApp.expand();

  console.log(
    "IRONAGE: Telegram WebApp initialized"
  );

  return webApp;
}

export function getTelegramUser():
  | TelegramUser
  | null {
  const webApp = getTelegramWebApp();

  if (!webApp) {
    return null;
  }

  return (
    webApp.initDataUnsafe.user ?? null
  );
}

export function isTelegramWebApp(): boolean {
  return Boolean(
    typeof window !== "undefined" &&
      window.Telegram?.WebApp
  );
}

export function showTelegramBackButton(
  callback: () => void
) {
  const webApp = getTelegramWebApp();

  if (!webApp?.BackButton) {
    return () => {};
  }

  webApp.BackButton.show();
  webApp.BackButton.onClick(callback);

  return () => {
    webApp.BackButton?.offClick(callback);
    webApp.BackButton?.hide();
  };
}

export function hideTelegramBackButton() {
  const webApp = getTelegramWebApp();

  webApp?.BackButton?.hide();
}
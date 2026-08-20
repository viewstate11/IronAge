import { useEffect, useState } from "react";

import { UserProvider } from "./context/UserContext";

import Onboarding from "./screens/Onboarding/Onboarding";
import MainApp from "./screens/MainApp/MainApp";

import {
  initTelegram,
  getTelegramUser,
} from "./services/telegramService";

export default function App() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const telegram = initTelegram();

    if (telegram) {
      const telegramUser = getTelegramUser();

      if (telegramUser) {
        console.log(
          "IRONAGE Telegram user:",
          telegramUser
        );
      }
    }
  }, []);

  return (
    <UserProvider>
      {!started ? (
        <Onboarding
          finish={() => setStarted(true)}
        />
      ) : (
        <MainApp />
      )}
    </UserProvider>
  );
}
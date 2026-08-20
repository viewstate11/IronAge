import { useEffect } from "react";

import {
  showTelegramBackButton,
} from "../services/telegramService";

type Props = {
  onBack: () => void;
};

export default function TelegramBackButton({
  onBack,
}: Props) {
  useEffect(() => {
    const cleanup =
      showTelegramBackButton(onBack);

    return cleanup;
  }, [onBack]);

  return null;
}
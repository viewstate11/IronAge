import { useEffect } from "react";
import {
  hideTelegramBackButton,
  showTelegramBackButton,
} from "../services/telegramService";

type Props = {
  onBack: () => void;
};

export default function TelegramBackButton({ onBack }: Props) {
  useEffect(() => {
    showTelegramBackButton(onBack);

    return () => {
      hideTelegramBackButton();
    };
  }, [onBack]);

  return null;
}
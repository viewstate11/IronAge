import type { User } from "../types/user";

import {
  getStoredLanguage,
} from "../i18n/runtimeTranslator";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type AIResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

const API_URL =
  "/api/ai";

const AI_LANGUAGE_NAMES = {
  en: "English",
  es: "Spanish",
  uk: "Ukrainian",
  ru: "Russian",
  fr: "French",
  de: "German",
  pt: "Portuguese",
  bg: "Bulgarian",
} as const;

export async function getAITrainerResponse(
  user: User,
  message: string,
  history: ChatMessage[] = []
): Promise<string> {

  const response = await fetch(
    API_URL,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify((() => {
        const language =
          getStoredLanguage();

        const languageName =
          AI_LANGUAGE_NAMES[language];

        const localizedMessage =
          `[IRONAGE LANGUAGE: ${languageName}. ` +
          `Always answer the athlete in ${languageName}. ` +
          `Do not switch languages unless the athlete explicitly asks for a translation.]\n\n` +
          message;

        return {
          user,
          message: localizedMessage,
          history,
          language,
        };
      })()),
    }
  );

  if (!response.ok) {
    throw new Error(
      `AI request failed: ${response.status}`
    );
  }

  const data =
    (await response.json()) as AIResponse;

  if (
    !data.success ||
    !data.message
  ) {
    throw new Error(
      data.error ||
      "AI response is empty"
    );
  }

  return data.message;
}

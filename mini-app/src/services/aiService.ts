import type { User } from "../types/user";

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
  "http://localhost:3001/api/ai";

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

      body: JSON.stringify({
        user,
        message,
        history,
      }),
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
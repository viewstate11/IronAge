import crypto from "node:crypto";

export type TelegramAuthUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
};

export type TelegramAuthResult = {
  user: TelegramAuthUser;
  authDate: number;
  queryId?: string;
};

function getDataCheckString(
  params: URLSearchParams
): string {
  return [...params.entries()]
    .filter(([key]) => key !== "hash")
    .sort(([a], [b]) =>
      a.localeCompare(b)
    )
    .map(
      ([key, value]) =>
        `${key}=${value}`
    )
    .join("\n");
}

export function validateTelegramInitData(
  initData: string
): TelegramAuthResult {
  const botToken =
    process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    throw new Error(
      "TELEGRAM_BOT_TOKEN is not configured"
    );
  }

  if (!initData?.trim()) {
    throw new Error(
      "Telegram initData is missing"
    );
  }

  const params =
    new URLSearchParams(
      initData
    );

  const receivedHash =
    params.get("hash");

  if (!receivedHash) {
    throw new Error(
      "Telegram initData hash is missing"
    );
  }

  const authDateRaw =
    params.get("auth_date");

  if (!authDateRaw) {
    throw new Error(
      "Telegram auth_date is missing"
    );
  }

  const authDate =
    Number(authDateRaw);

  if (
    !Number.isFinite(authDate)
  ) {
    throw new Error(
      "Invalid Telegram auth_date"
    );
  }

  /*
   * Reject very old authentication payloads.
   */

  const now =
    Math.floor(
      Date.now() / 1000
    );

  const maxAge =
    24 * 60 * 60;

  if (
    Math.abs(now - authDate) >
    maxAge
  ) {
    throw new Error(
      "Telegram initData has expired"
    );
  }

  /*
   * Telegram Web Apps validation:
   *
   * secret_key = HMAC_SHA256(
   *   bot_token,
   *   "WebAppData"
   * )
   *
   * calculated_hash =
   * HMAC_SHA256(
   *   secret_key,
   *   data_check_string
   * )
   */

  const secretKey =
    crypto
      .createHmac(
        "sha256",
        "WebAppData"
      )
      .update(botToken)
      .digest();

  const dataCheckString =
    getDataCheckString(
      params
    );

  const calculatedHash =
    crypto
      .createHmac(
        "sha256",
        secretKey
      )
      .update(
        dataCheckString
      )
      .digest("hex");

  const receivedBuffer =
    Buffer.from(
      receivedHash,
      "hex"
    );

  const calculatedBuffer =
    Buffer.from(
      calculatedHash,
      "hex"
    );

  if (
    receivedBuffer.length !==
      calculatedBuffer.length ||
    !crypto.timingSafeEqual(
      receivedBuffer,
      calculatedBuffer
    )
  ) {
    throw new Error(
      "Invalid Telegram initData signature"
    );
  }

  /*
   * Extract Telegram user.
   */

  const userRaw =
    params.get("user");

  if (!userRaw) {
    throw new Error(
      "Telegram user is missing"
    );
  }

  let user: TelegramAuthUser;

  try {
    user =
      JSON.parse(
        userRaw
      ) as TelegramAuthUser;
  } catch {
    throw new Error(
      "Invalid Telegram user JSON"
    );
  }

  if (
    !user ||
    !Number.isFinite(
      user.id
    )
  ) {
    throw new Error(
      "Invalid Telegram user ID"
    );
  }

  return {
    user,
    authDate,
    queryId:
      params.get(
        "query_id"
      ) ?? undefined,
  };
}
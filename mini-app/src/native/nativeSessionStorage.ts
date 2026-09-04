import { Capacitor } from "@capacitor/core";

import {
  KeychainAccess,
  SecureStorage,
} from "@aparajita/capacitor-secure-storage";

const SESSION_TOKEN_KEY =
  "session_token";

let initialized = false;

function isNativeIos(): boolean {
  return (
    Capacitor.isNativePlatform() &&
    Capacitor.getPlatform() === "ios"
  );
}

async function initializeSecureStorage(): Promise<void> {
  if (
    initialized ||
    !isNativeIos()
  ) {
    return;
  }

  await SecureStorage.setSynchronize(
    false
  );

  await SecureStorage.setKeyPrefix(
    "ironage_"
  );

  await SecureStorage.setDefaultKeychainAccess(
    KeychainAccess.whenUnlockedThisDeviceOnly
  );

  initialized = true;
}

function normalizeStoredToken(
  value: string
): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  /*
   * SecureStorage may return a JSON-encoded
   * string, e.g.
   *
   *   "\"abc123\""
   *
   * Convert it back to:
   *
   *   abc123
   */
  if (
    trimmed.startsWith('"') &&
    trimmed.endsWith('"')
  ) {
    try {
      const parsed =
        JSON.parse(trimmed);

      if (
        typeof parsed === "string" &&
        parsed.trim()
      ) {
        return parsed.trim();
      }
    } catch {
      // Fall through to raw value.
    }
  }

  return trimmed;
}

export async function saveNativeSessionToken(
  token: string
): Promise<void> {
  if (!isNativeIos()) {
    return;
  }

  const normalizedToken =
    token.trim();

  if (!normalizedToken) {
    throw new Error(
      "Native session token is required"
    );
  }

  await initializeSecureStorage();

  await SecureStorage.set(
    SESSION_TOKEN_KEY,
    normalizedToken,
    false,
    false,
    KeychainAccess.whenUnlockedThisDeviceOnly
  );
}

export async function getNativeSessionToken(): Promise<
  string | null
> {
  if (!isNativeIos()) {
    return null;
  }

  await initializeSecureStorage();

  const value =
    await SecureStorage.getItem(
      SESSION_TOKEN_KEY
    );

  if (
    typeof value !== "string"
  ) {
    return null;
  }

  return normalizeStoredToken(
    value
  );
}

export async function removeNativeSessionToken(): Promise<void> {
  if (!isNativeIos()) {
    return;
  }

  await initializeSecureStorage();

  await SecureStorage.removeItem(
    SESSION_TOKEN_KEY
  );
}

export function usesNativeSessionStorage(): boolean {
  return isNativeIos();
}

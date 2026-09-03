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
    typeof value !== "string" ||
    !value.trim()
  ) {
    return null;
  }

  return value.trim();
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

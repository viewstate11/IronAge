import { Capacitor } from "@capacitor/core";
import { SocialLogin } from "@capgo/capacitor-social-login";

let initialized = false;

export function usesNativeGoogleAuth(): boolean {
  return (
    Capacitor.isNativePlatform() &&
    Capacitor.getPlatform() === "ios"
  );
}

export async function initializeNativeGoogleAuth(
  iosClientId: string,
  webClientId: string
): Promise<void> {
  if (!usesNativeGoogleAuth()) {
    return;
  }

  if (initialized) {
    return;
  }

  const normalizedIosClientId =
    iosClientId.trim();

  const normalizedWebClientId =
    webClientId.trim();

  if (!normalizedIosClientId) {
    throw new Error(
      "Google iOS Client ID is not configured"
    );
  }

  if (!normalizedWebClientId) {
    throw new Error(
      "Google Web Client ID is not configured"
    );
  }

  await SocialLogin.initialize({
    google: {
      iOSClientId:
        normalizedIosClientId,
      iOSServerClientId:
        normalizedWebClientId,
      webClientId:
        normalizedWebClientId,
      mode: "online",
    },
  });

  initialized = true;
}

export async function loginNativeGoogle(): Promise<string> {
  if (!usesNativeGoogleAuth()) {
    throw new Error(
      "Native Google authentication is unavailable"
    );
  }

  const response =
    await SocialLogin.login({
      provider: "google",
      options: {
        scopes: [
          "email",
          "profile",
        ],
        forcePrompt: false,
      },
    });

  if (
    response.provider !== "google" ||
    response.result.responseType !==
      "online"
  ) {
    throw new Error(
      "Google authentication returned an invalid response"
    );
  }

  const idToken =
    response.result.idToken?.trim();

  if (!idToken) {
    throw new Error(
      "Google authentication did not return an ID token"
    );
  }

  return idToken;
}

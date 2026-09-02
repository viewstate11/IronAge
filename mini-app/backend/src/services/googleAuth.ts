import {
  OAuth2Client,
} from "google-auth-library";

export type VerifiedGoogleIdentity = {
  providerUserId: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  picture?: string;
};

function getGoogleClientId(): string {
  const clientId =
    process.env.GOOGLE_CLIENT_ID?.trim();

  if (!clientId) {
    throw new Error(
      "GOOGLE_CLIENT_ID is not configured"
    );
  }

  return clientId;
}

export async function verifyGoogleIdToken(
  idToken: string
): Promise<VerifiedGoogleIdentity> {
  const normalizedToken =
    idToken.trim();

  if (!normalizedToken) {
    throw new Error(
      "Google ID token is required"
    );
  }

  const clientId =
    getGoogleClientId();

  const client =
    new OAuth2Client(clientId);

  const ticket =
    await client.verifyIdToken({
      idToken: normalizedToken,
      audience: clientId,
    });

  const payload =
    ticket.getPayload();

  if (!payload) {
    throw new Error(
      "Google token payload is missing"
    );
  }

  const providerUserId =
    payload.sub?.trim();

  const email =
    payload.email
      ?.trim()
      .toLowerCase();

  const emailVerified =
    payload.email_verified === true;

  if (!providerUserId) {
    throw new Error(
      "Google user ID is missing"
    );
  }

  if (!email) {
    throw new Error(
      "Google email is missing"
    );
  }

  if (!emailVerified) {
    throw new Error(
      "Google email is not verified"
    );
  }

  return {
    providerUserId,
    email,
    emailVerified: true,
    firstName:
      payload.given_name?.trim() ||
      payload.name?.trim() ||
      "IRONAGE User",
    picture:
      payload.picture?.trim() ||
      undefined,
  };
}

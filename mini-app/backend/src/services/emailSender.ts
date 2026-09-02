import { Resend } from "resend";

const DEFAULT_APP_URL =
  "https://ironage.vercel.app";

function getRequiredEnv(
  name: string
): string {
  const value =
    process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `${name} is not configured`
    );
  }

  return value;
}

function getAppUrl(): string {
  return (
    process.env.IRONAGE_APP_URL?.trim() ||
    DEFAULT_APP_URL
  ).replace(/\/+$/, "");
}

export async function sendEmailVerification(
  params: {
    email: string;
    token: string;
  }
): Promise<void> {
  const apiKey =
    getRequiredEnv(
      "RESEND_API_KEY"
    );

  const from =
    getRequiredEnv(
      "EMAIL_FROM"
    );

  const resend =
    new Resend(apiKey);

  const verificationUrl =
    new URL(
      "/verify-email",
      getAppUrl()
    );

  verificationUrl.searchParams.set(
    "token",
    params.token
  );

  const result =
    await resend.emails.send({
      from,
      to: params.email,
      subject:
        "Verify your IRONAGE email",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#050505;color:#ffffff;">
          <h1 style="margin:0 0 16px;color:#d4af37;">
            IRONAGE
          </h1>

          <p>
            Confirm your email address to activate your IRONAGE account.
          </p>

          <p style="margin:32px 0;">
            <a
              href="${verificationUrl.toString()}"
              style="display:inline-block;padding:14px 22px;background:#d4af37;color:#050505;text-decoration:none;font-weight:700;border-radius:10px;"
            >
              Verify email
            </a>
          </p>

          <p style="font-size:13px;color:#aaaaaa;">
            This verification link expires in 30 minutes.
          </p>
        </div>
      `,
      text:
        `Verify your IRONAGE email: ${verificationUrl.toString()}\n\nThis verification link expires in 30 minutes.`,
    });

  if (result.error) {
    throw new Error(
      `Resend email failed: ${result.error.message}`
    );
  }
}

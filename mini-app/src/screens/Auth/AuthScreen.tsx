import {
  useState,
  type FormEvent,
} from "react";

import {
  loginEmail,
  loginGoogle,
  registerEmail,
} from "../../api/client";

import {
  useUser,
} from "../../context/UserContext";

import {
  useLanguage,
} from "../../context/LanguageContext";

import GoogleSignInButton from "../../components/auth/GoogleSignInButton";

import "./AuthScreen.css";

type Props = {
  back: () => void;
};

type AuthMode =
  | "register"
  | "login";

export default function AuthScreen({
  back,
}: Props) {
  const {
    refreshUser,
  } = useUser();

  const { t } = useLanguage();

  const [mode, setMode] =
    useState<AuthMode>(
      "register"
    );

  const [firstName, setFirstName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const switchMode = (
    nextMode: AuthMode
  ) => {
    if (submitting) {
      return;
    }

    setMode(nextMode);
    setMessage("");
  };

  const handleEmail =
    async (
      event: FormEvent
    ) => {
      event.preventDefault();

      if (submitting) {
        return;
      }

      const normalizedEmail =
        email.trim();

      const normalizedFirstName =
        firstName.trim();

      if (
        mode === "register" &&
        !normalizedFirstName
      ) {
        setMessage(
          t("auth.enterName")
        );

        return;
      }

      if (!normalizedEmail) {
        setMessage(
          t("auth.enterEmail")
        );

        return;
      }

      if (
        password.length < 8
      ) {
        setMessage(
          t("auth.passwordMin")
        );

        return;
      }

      try {
        setSubmitting(true);
        setMessage("");

        if (
          mode === "register"
        ) {
          const result =
            await registerEmail(
              normalizedEmail,
              password,
              normalizedFirstName
            );

          if (
            result.emailVerificationRequired
          ) {
            setMessage(
              t("auth.verifyEmail")
            );

            setPassword("");

            return;
          }

          throw new Error(
            "Email verification was not requested"
          );
        }

        await loginEmail(
          normalizedEmail,
          password
        );

        /*
         * Login creates the HttpOnly
         * session cookie.
         *
         * Reload authenticated user
         * through /api/users/me.
         */
        await refreshUser();

      } catch (error) {
        console.error(
          "IRONAGE: Email auth error:",
          error
        );

        setMessage(
          error instanceof Error
            ? error.message.toUpperCase()
            : t("auth.failed")
        );
      } finally {
        setSubmitting(false);
      }
    };

  const handleGoogleCredential =
    async (
      credential: string
    ) => {
      if (submitting) {
        return;
      }

      try {
        setSubmitting(true);
        setMessage("");

        await loginGoogle(
          credential
        );

        await refreshUser();
      } catch (error) {
        console.error(
          "IRONAGE: Google auth error:",
          error
        );

        setMessage(
          error instanceof Error
            ? error.message.toUpperCase()
            : t("auth.googleFailed")
        );
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <main className="iron-auth">
      <div className="iron-auth__glow" />

      <div className="iron-auth__shell">
        <header className="iron-auth__header">
          <button
            type="button"
            className="iron-auth__back"
            onClick={back}
            aria-label={t("common.back")}
            disabled={submitting}
          >
            ←
          </button>

          <div className="iron-auth__brand">
            IRON<span>AGE</span>
          </div>

          <div className="iron-auth__edition">
            {t("auth.athleteSystem")}
          </div>
        </header>

        <section className="iron-auth__content">
          <div className="iron-auth__mark">
            IA
          </div>

          <div className="iron-auth__eyebrow">
            {mode === "register"
              ? t("auth.joinSystem")
              : t("auth.welcomeBack")}
          </div>

          <h1>
            {mode === "register"
              ? t("auth.readyRegister1")
              : t("auth.readyLogin1")}
            <span>
              {mode === "register"
                ? t("auth.readyRegister2")
                : t("auth.readyLogin2")}
            </span>
          </h1>

          <p className="iron-auth__intro">
            {mode === "register"
              ? t("auth.registerIntro")
              : t("auth.loginIntro")}
          </p>

          <div className="iron-auth__providers">
            <GoogleSignInButton
              disabled={submitting}
              onCredential={
                handleGoogleCredential
              }
              onError={setMessage}
            />

            <button
              type="button"
              className="iron-auth__provider"
              disabled={submitting}
              onClick={() =>
                setMessage(
                  t("auth.appleComingSoon")
                )
              }
            >
              <span className="iron-auth__provider-icon iron-auth__apple">
                
              </span>

              {t("auth.continueApple")}
            </button>
          </div>

          <div className="iron-auth__divider">
            <span />
            <strong>{t("auth.or")}</strong>
            <span />
          </div>

          <form
            className="iron-auth__form"
            onSubmit={handleEmail}
          >
            {mode === "register" && (
              <>
                <label htmlFor="ironage-name">
                  {t("auth.firstName")}
                </label>

                <input
                  id="ironage-name"
                  type="text"
                  value={firstName}
                  onChange={(event) => {
                    setFirstName(
                      event.target.value
                    );

                    setMessage("");
                  }}
                  placeholder={t("auth.namePlaceholder")}
                  autoComplete="given-name"
                  maxLength={80}
                  disabled={submitting}
                />
              </>
            )}

            <label htmlFor="ironage-email">
              {t("auth.email")}
            </label>

            <input
              id="ironage-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(
                  event.target.value
                );

                setMessage("");
              }}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={submitting}
            />

            <label htmlFor="ironage-password">
              {t("auth.password")}
            </label>

            <input
              id="ironage-password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(
                  event.target.value
                );

                setMessage("");
              }}
              placeholder={t("auth.passwordPlaceholder")}
              autoComplete={
                mode === "register"
                  ? "new-password"
                  : "current-password"
              }
              minLength={8}
              maxLength={128}
              disabled={submitting}
            />

            <button
              type="submit"
              className="iron-auth__continue"
              disabled={submitting}
            >
              {submitting
                ? t("auth.pleaseWait")
                : mode === "register"
                  ? t("auth.createAccount")
                  : t("auth.signIn")}

              {!submitting && (
                <span>→</span>
              )}
            </button>
          </form>

          <button
            type="button"
            className="iron-auth__mode"
            disabled={submitting}
            onClick={() =>
              switchMode(
                mode === "register"
                  ? "login"
                  : "register"
              )
            }
          >
            {mode === "register"
              ? t("auth.haveAccount")
              : t("auth.noAccount")}
          </button>

          {message && (
            <div className="iron-auth__message">
              {message}
            </div>
          )}

          <p className="iron-auth__legal">
            {t("auth.legalPrefix")}{" "}
            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/terms";
              }}
            >
              {t("auth.terms")}
            </button>{" "}
            {t("auth.and")}{" "}
            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/privacy";
              }}
            >
              {t("auth.privacy")}
            </button>
            .
          </p>
        </section>

        <footer className="iron-auth__footer">
          <span />
          {t("auth.footer")}
          <span />
        </footer>
      </div>
    </main>
  );
}

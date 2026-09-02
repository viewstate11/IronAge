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
          "ENTER YOUR NAME"
        );

        return;
      }

      if (!normalizedEmail) {
        setMessage(
          "ENTER YOUR EMAIL"
        );

        return;
      }

      if (
        password.length < 8
      ) {
        setMessage(
          "PASSWORD MUST BE AT LEAST 8 CHARACTERS"
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
              "CHECK YOUR EMAIL TO VERIFY YOUR ACCOUNT"
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
            : "AUTHENTICATION FAILED"
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
            : "GOOGLE AUTHENTICATION FAILED"
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
            aria-label="Back"
            disabled={submitting}
          >
            ←
          </button>

          <div className="iron-auth__brand">
            IRON<span>AGE</span>
          </div>

          <div className="iron-auth__edition">
            ATHLETE SYSTEM
          </div>
        </header>

        <section className="iron-auth__content">
          <div className="iron-auth__mark">
            IA
          </div>

          <div className="iron-auth__eyebrow">
            {mode === "register"
              ? "JOIN THE SYSTEM"
              : "WELCOME BACK"}
          </div>

          <h1>
            {mode === "register"
              ? "ARE YOU READY"
              : "READY TO"}
            <span>
              {mode === "register"
                ? "TO WORK?"
                : "CONTINUE?"}
            </span>
          </h1>

          <p className="iron-auth__intro">
            {mode === "register"
              ? "Build discipline. Track progress. Become stronger every day."
              : "Sign in and continue your IRONAGE journey."}
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
                  "APPLE AUTH COMING SOON"
                )
              }
            >
              <span className="iron-auth__provider-icon iron-auth__apple">
                
              </span>

              CONTINUE WITH APPLE
            </button>
          </div>

          <div className="iron-auth__divider">
            <span />
            <strong>OR</strong>
            <span />
          </div>

          <form
            className="iron-auth__form"
            onSubmit={handleEmail}
          >
            {mode === "register" && (
              <>
                <label htmlFor="ironage-name">
                  FIRST NAME
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
                  placeholder="Your name"
                  autoComplete="given-name"
                  maxLength={80}
                  disabled={submitting}
                />
              </>
            )}

            <label htmlFor="ironage-email">
              EMAIL
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
              PASSWORD
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
              placeholder="Minimum 8 characters"
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
                ? "PLEASE WAIT..."
                : mode === "register"
                  ? "CREATE ACCOUNT"
                  : "SIGN IN"}

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
              ? "ALREADY HAVE AN ACCOUNT? SIGN IN"
              : "DON'T HAVE AN ACCOUNT? CREATE ACCOUNT"}
          </button>

          {message && (
            <div className="iron-auth__message">
              {message}
            </div>
          )}

          <p className="iron-auth__legal">
            By continuing you agree to the{" "}
            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/terms";
              }}
            >
              Terms
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/privacy";
              }}
            >
              Privacy Policy
            </button>
            .
          </p>
        </section>

        <footer className="iron-auth__footer">
          <span />
          IRONAGE FITNESS SYSTEM
          <span />
        </footer>
      </div>
    </main>
  );
}

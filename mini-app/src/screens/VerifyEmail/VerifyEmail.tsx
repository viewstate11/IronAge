import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  verifyEmail,
} from "../../api/client";

import {
  useUser,
} from "../../context/UserContext";

type VerificationState =
  | "verifying"
  | "success"
  | "error";

export default function VerifyEmail() {
  const {
    refreshUser,
  } = useUser();

  const verificationStarted =
    useRef(false);

  const [
    state,
    setState,
  ] = useState<VerificationState>(
    "verifying"
  );

  const [
    message,
    setMessage,
  ] = useState(
    "VERIFYING YOUR EMAIL..."
  );

  useEffect(() => {
    if (verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    async function run() {
      const params =
        new URLSearchParams(
          window.location.search
        );

      const token =
        params.get("token")?.trim() || "";

      if (!token) {
        setState("error");

        setMessage(
          "VERIFICATION LINK IS INVALID"
        );

        return;
      }

      /*
       * Remove the raw verification token
       * from the browser URL as soon as it
       * has been captured.
       */
      window.history.replaceState(
        {},
        document.title,
        "/verify-email"
      );

      try {
        await verifyEmail(token);

        await refreshUser();

        setState("success");

        setMessage(
          "EMAIL VERIFIED"
        );

        window.location.replace("/");
      } catch (error) {
        console.error(
          "IRONAGE: Email verification error:",
          error
        );

        setState("error");

        setMessage(
          error instanceof Error
            ? error.message.toUpperCase()
            : "EMAIL VERIFICATION FAILED"
        );
      }
    }

    void run();
  }, [refreshUser]);

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "#050505",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        boxSizing: "border-box",
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 460,
          border:
            "1px solid #2a2a2a",
          borderRadius: 24,
          padding: 32,
          background: "#0b0b0b",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            color: "#d4af37",
            fontSize: 30,
            fontWeight: 900,
            letterSpacing: 4,
            marginBottom: 28,
          }}
        >
          IRONAGE
        </div>

        <div
          style={{
            width: 72,
            height: 72,
            margin: "0 auto 24px",
            borderRadius: "50%",
            border:
              "1px solid #d4af37",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 30,
            fontWeight: 900,
            color:
              state === "error"
                ? "#ff5555"
                : "#d4af37",
          }}
        >
          {state === "verifying"
            ? "..."
            : state === "success"
              ? "✓"
              : "!"}
        </div>

        <h1
          style={{
            margin:
              "0 0 14px",
            fontSize: 26,
            fontWeight: 900,
            letterSpacing: 1,
          }}
        >
          {message}
        </h1>

        <p
          style={{
            margin: 0,
            color: "#aaaaaa",
            lineHeight: 1.6,
          }}
        >
          {state === "verifying"
            ? "Please wait while we activate your IRONAGE account."
            : state === "success"
              ? "Your account is active. IRONAGE is loading your profile."
              : "The link may be invalid or expired. Return to IRONAGE and request a new verification email."}
        </p>

        {state === "error" && (
          <button
            type="button"
            onClick={() => {
              window.location.href =
                "/";
            }}
            style={{
              width: "100%",
              marginTop: 28,
              padding:
                "14px 18px",
              border: 0,
              borderRadius: 12,
              background:
                "#d4af37",
              color: "#050505",
              fontSize: 15,
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            RETURN TO IRONAGE
          </button>
        )}
      </section>
    </main>
  );
}

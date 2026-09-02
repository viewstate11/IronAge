import {
  useEffect,
  useRef,
} from "react";

type Props = {
  disabled?: boolean;
  onCredential: (
    credential: string
  ) => Promise<void>;
  onError: (
    message: string
  ) => void;
};

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleAccountsId = {
  initialize: (
    options: {
      client_id: string;
      callback: (
        response:
          GoogleCredentialResponse
      ) => void;
    }
  ) => void;

  renderButton: (
    element: HTMLElement,
    options: {
      type: "standard";
      theme: "outline";
      size: "large";
      text: "continue_with";
      shape: "rectangular";
      width: number;
    }
  ) => void;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleAccountsId;
      };
    };
  }
}

const GOOGLE_SCRIPT_ID =
  "ironage-google-identity";

const GOOGLE_SCRIPT_SRC =
  "https://accounts.google.com/gsi/client";

function loadGoogleScript():
  Promise<void> {
  return new Promise(
    (resolve, reject) => {
      if (
        window.google?.accounts?.id
      ) {
        resolve();
        return;
      }

      const existing =
        document.getElementById(
          GOOGLE_SCRIPT_ID
        ) as HTMLScriptElement | null;

      if (existing) {
        existing.addEventListener(
          "load",
          () => resolve(),
          {
            once: true,
          }
        );

        existing.addEventListener(
          "error",
          () => reject(
            new Error(
              "Google Sign-In failed to load"
            )
          ),
          {
            once: true,
          }
        );

        return;
      }

      const script =
        document.createElement(
          "script"
        );

      script.id =
        GOOGLE_SCRIPT_ID;

      script.src =
        GOOGLE_SCRIPT_SRC;

      script.async = true;
      script.defer = true;

      script.onload =
        () => resolve();

      script.onerror =
        () => reject(
          new Error(
            "Google Sign-In failed to load"
          )
        );

      document.head.appendChild(
        script
      );
    }
  );
}

export default function GoogleSignInButton({
  disabled = false,
  onCredential,
  onError,
}: Props) {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const callbackRef =
    useRef(onCredential);

  const errorRef =
    useRef(onError);

  callbackRef.current =
    onCredential;

  errorRef.current =
    onError;

  useEffect(() => {
    let active = true;

    const initialize =
      async () => {
        try {
          const clientId =
            import.meta.env
              .VITE_GOOGLE_CLIENT_ID
              ?.trim();

          if (!clientId) {
            throw new Error(
              "Google Client ID is not configured"
            );
          }

          await loadGoogleScript();

          if (
            !active ||
            !containerRef.current ||
            !window.google?.accounts?.id
          ) {
            return;
          }

          window.google.accounts.id
            .initialize({
              client_id: clientId,

              callback: (
                response
              ) => {
                const credential =
                  response.credential
                    ?.trim();

                if (!credential) {
                  errorRef.current(
                    "GOOGLE AUTHENTICATION FAILED"
                  );

                  return;
                }

                void callbackRef.current(
                  credential
                );
              },
            });

          containerRef.current
            .replaceChildren();

          window.google.accounts.id
            .renderButton(
              containerRef.current,
              {
                type: "standard",
                theme: "outline",
                size: "large",
                text:
                  "continue_with",
                shape:
                  "rectangular",
                width: 320,
              }
            );
        } catch (error) {
          console.error(
            "IRONAGE: Google GIS error:",
            error
          );

          errorRef.current(
            error instanceof Error
              ? error.message.toUpperCase()
              : "GOOGLE AUTHENTICATION FAILED"
          );
        }
      };

    void initialize();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "44px",
        display: "flex",
        justifyContent: "center",
        opacity:
          disabled ? 0.5 : 1,
        pointerEvents:
          disabled
            ? "none"
            : "auto",
      }}
    >
      <div ref={containerRef} />
    </div>
  );
}

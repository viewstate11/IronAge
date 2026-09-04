import {
  useEffect,
  useRef,
} from "react";

import {
  initializeNativeGoogleAuth,
  loginNativeGoogle,
  usesNativeGoogleAuth,
} from "../../native/nativeGoogleAuth";

import {
  useLanguage,
} from "../../context/LanguageContext";

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
  const { t } = useLanguage();

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

          if (usesNativeGoogleAuth()) {
            const iosClientId =
              import.meta.env
                .VITE_GOOGLE_IOS_CLIENT_ID
                ?.trim();

            if (!iosClientId) {
              throw new Error(
                "Google iOS Client ID is not configured"
              );
            }

            await initializeNativeGoogleAuth(
              iosClientId,
              clientId
            );

            if (
              !active ||
              !containerRef.current
            ) {
              return;
            }

            containerRef.current
              .replaceChildren();

            const button =
              document.createElement(
                "button"
              );

            button.type = "button";
            button.disabled =
              disabled;

            button.innerHTML = `
              <span style="
                width: 38px;
                height: 38px;
                border-radius: 50%;
                background: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                font-size: 18px;
                font-weight: 900;
                color: #111111;
              ">
                G
              </span>

              <span style="
                flex: 1;
                text-align: center;
                padding-right: 38px;
              ">
                ${t("auth.continueGoogle")}
              </span>
            `;

            button.style.width =
              "100%";

            button.style.height =
              "64px";

            button.style.display =
              "flex";

            button.style.alignItems =
              "center";

            button.style.padding =
              "0 20px";

            button.style.border =
              "1px solid rgba(255,255,255,0.16)";

            button.style.borderRadius =
              "18px";

            button.style.background =
              "#0c0c0c";

            button.style.color =
              "#ffffff";

            button.style.fontSize =
              "11px";

            button.style.fontWeight =
              "900";

            button.style.letterSpacing =
              "0.14em";

            button.style.fontFamily =
              "Montserrat, -apple-system, BlinkMacSystemFont, sans-serif";

            button.style.cursor =
              "pointer";

            button.style.boxSizing =
              "border-box";


            button.onclick =
              async () => {
                try {
                  button.disabled =
                    true;

                  const credential =
                    await loginNativeGoogle();

                  await callbackRef.current(
                    credential
                  );
                } catch (error) {
                  console.error(
                    "IRONAGE: Native Google error:",
                    error
                  );

                  errorRef.current(
                    error instanceof Error
                      ? error.message.toUpperCase()
                      : t("auth.googleFailed")
                  );
                } finally {
                  button.disabled =
                    disabled;
                }
              };

            containerRef.current
              .appendChild(button);

            return;
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
              : t("auth.googleFailed")
          );
        }
      };

    void initialize();

    return () => {
      active = false;
    };
  }, [disabled, t]);

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

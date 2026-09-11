import {
  useEffect,
  useState,
} from "react";

import {
  useLanguage,
} from "../../context/LanguageContext";

import {
  cancelMotivationReminder,
  cancelNutritionReminders,
  cancelWorkoutReminder,
  getNotificationPermission,
  isNativeNotificationsAvailable,
  requestNotificationPermission,
  scheduleMotivationReminder,
  scheduleNutritionReminders,
  scheduleWorkoutReminder,
  sendTestIronageNotification,
} from "../../native/nativeNotifications";

import "./Notifications.css";

type Props = {
  onBack: () => void;
};

type NotificationSettings = {
  workoutReminder: boolean;
  nutritionReminders: boolean;
  motivationReminder: boolean;
  progressUpdates: boolean;
};

const STORAGE_KEY =
  "ironage_notification_settings";

const defaultSettings:
  NotificationSettings = {
    workoutReminder: false,
    nutritionReminders: false,
    motivationReminder: false,
    progressUpdates: true,
  };

function loadSettings():
  NotificationSettings {
  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!raw) {
      return defaultSettings;
    }

    const parsed =
      JSON.parse(raw) as
        Partial<NotificationSettings>;

    return {
      workoutReminder:
        parsed.workoutReminder === true,

      nutritionReminders:
        parsed.nutritionReminders === true,

      motivationReminder:
        parsed.motivationReminder === true,

      progressUpdates:
        typeof parsed.progressUpdates ===
        "boolean"
          ? parsed.progressUpdates
          : true,
    };
  } catch {
    return defaultSettings;
  }
}

function saveSettings(
  settings: NotificationSettings
) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );
  } catch {
    // Storage may be unavailable.
  }
}

export default function Notifications({
  onBack,
}: Props) {
  const { t } = useLanguage();

  const [
    settings,
    setSettings,
  ] = useState<NotificationSettings>(
    loadSettings
  );

  const [
    permission,
    setPermission,
  ] = useState<
    "granted" |
    "denied" |
    "prompt" |
    "unknown" |
    "web"
  >("unknown");

  const [
    busy,
    setBusy,
  ] = useState<string | null>(
    null
  );

  const [
    message,
    setMessage,
  ] = useState<string | null>(
    null
  );

  const nativeAvailable =
    isNativeNotificationsAvailable();

  useEffect(() => {
    let mounted = true;

    async function loadPermission() {
      if (!nativeAvailable) {
        if (mounted) {
          setPermission("web");
        }

        return;
      }

      try {
        const result =
          await getNotificationPermission();

        if (!mounted) {
          return;
        }

        setPermission(
          result.display === "granted"
            ? "granted"
            : result.display === "denied"
              ? "denied"
              : "prompt"
        );
      } catch {
        if (mounted) {
          setPermission("unknown");
        }
      }
    }

    void loadPermission();

    return () => {
      mounted = false;
    };
  }, [nativeAvailable]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  async function ensurePermission():
    Promise<boolean> {
    if (!nativeAvailable) {
      setMessage(
        t(
          "notifications.nativeOnly"
        )
      );

      return false;
    }

    try {
      const result =
        await requestNotificationPermission();

      const granted =
        result.display === "granted";

      setPermission(
        granted
          ? "granted"
          : result.display === "denied"
            ? "denied"
            : "prompt"
      );

      if (!granted) {
        setMessage(
          t(
            "notifications.permissionRequired"
          )
        );
      }

      return granted;
    } catch {
      setMessage(
        t(
          "notifications.permissionError"
        )
      );

      return false;
    }
  }

  async function toggleWorkout() {
    if (busy) {
      return;
    }

    const next =
      !settings.workoutReminder;

    try {
      setBusy("workout");
      setMessage(null);

      if (next) {
        const granted =
          permission === "granted"
            ? true
            : await ensurePermission();

        if (!granted) {
          return;
        }

        const scheduled =
          await scheduleWorkoutReminder();

        if (!scheduled) {
          throw new Error(
            t(
              "notifications.scheduleFailed"
            )
          );
        }
      } else {
        await cancelWorkoutReminder();
      }

      setSettings(
        current => ({
          ...current,
          workoutReminder: next,
        })
      );
    } catch (error) {
      console.error(
        "IRONAGE WORKOUT NOTIFICATION UI ERROR:",
        error
      );

      setMessage(
        t(
          "notifications.scheduleFailed"
        )
      );
    } finally {
      setBusy(null);
    }
  }

  async function toggleNutrition() {
    if (busy) {
      return;
    }

    const next =
      !settings.nutritionReminders;

    try {
      setBusy("nutrition");
      setMessage(null);

      if (next) {
        const granted =
          permission === "granted"
            ? true
            : await ensurePermission();

        if (!granted) {
          return;
        }

        const scheduled =
          await scheduleNutritionReminders();

        if (!scheduled) {
          throw new Error(
            t(
              "notifications.scheduleFailed"
            )
          );
        }
      } else {
        await cancelNutritionReminders();
      }

      setSettings(
        current => ({
          ...current,
          nutritionReminders: next,
        })
      );
    } catch (error) {
      console.error(
        "IRONAGE NUTRITION NOTIFICATION UI ERROR:",
        error
      );

      setMessage(
        t(
          "notifications.scheduleFailed"
        )
      );
    } finally {
      setBusy(null);
    }
  }

  async function toggleMotivation() {
    if (busy) {
      return;
    }

    const next =
      !settings.motivationReminder;

    try {
      setBusy("motivation");
      setMessage(null);

      if (next) {
        const granted =
          permission === "granted"
            ? true
            : await ensurePermission();

        if (!granted) {
          return;
        }

        const scheduled =
          await scheduleMotivationReminder();

        if (!scheduled) {
          throw new Error(
            t(
              "notifications.scheduleFailed"
            )
          );
        }
      } else {
        await cancelMotivationReminder();
      }

      setSettings(
        current => ({
          ...current,
          motivationReminder: next,
        })
      );
    } catch (error) {
      console.error(
        "IRONAGE MOTIVATION NOTIFICATION UI ERROR:",
        error
      );

      setMessage(
        t(
          "notifications.scheduleFailed"
        )
      );
    } finally {
      setBusy(null);
    }
  }

  function toggleProgress() {
    setSettings(
      current => ({
        ...current,
        progressUpdates:
          !current.progressUpdates,
      })
    );
  }

  async function testNotification() {
    if (busy) {
      return;
    }

    try {
      setBusy("test");
      setMessage(null);

      const granted =
        permission === "granted"
          ? true
          : await ensurePermission();

      if (!granted) {
        return;
      }

      const sent =
        await sendTestIronageNotification();

      if (!sent) {
        throw new Error(
          t(
            "notifications.testFailed"
          )
        );
      }

      setMessage(
        t(
          "notifications.testScheduled"
        )
      );
    } catch (error) {
      console.error(
        "IRONAGE TEST NOTIFICATION UI ERROR:",
        error
      );

      setMessage(
        t(
          "notifications.testFailed"
        )
      );
    } finally {
      setBusy(null);
    }
  }

  function permissionLabel() {
    switch (permission) {
      case "granted":
        return t(
          "notifications.permissionGranted"
        );

      case "denied":
        return t(
          "notifications.permissionDenied"
        );

      case "prompt":
        return t(
          "notifications.permissionPrompt"
        );

      case "web":
        return t(
          "notifications.permissionWeb"
        );

      default:
        return t(
          "notifications.permissionUnknown"
        );
    }
  }

  return (
    <main className="notifications-screen">
      <div className="notifications-screen__shell">

        <header className="notifications-screen__header">
          <button
            type="button"
            className="notifications-screen__back"
            onClick={onBack}
            aria-label={t("common.back")}
          >
            ←
          </button>

          <div>
            <span>
              IRONAGE
            </span>

            <h1>
              {t(
                "notifications.title"
              )}
            </h1>

            <p>
              {t(
                "notifications.subtitle"
              )}
            </p>
          </div>
        </header>

        <section className="notifications-screen__status">
          <div>
            <span>
              {t(
                "notifications.permission"
              )}
            </span>

            <strong>
              {permissionLabel()}
            </strong>
          </div>

          {nativeAvailable &&
            permission !== "granted" && (
              <button
                type="button"
                onClick={() => {
                  void ensurePermission();
                }}
              >
                {t(
                  "notifications.allow"
                )}
              </button>
            )}
        </section>

        <section className="notifications-screen__section">
          <div className="notifications-screen__title">
            01 · {t(
              "notifications.reminders"
            )}
          </div>

          <button
            type="button"
            className="notifications-screen__row"
            disabled={busy !== null}
            onClick={() => {
              void toggleWorkout();
            }}
          >
            <div>
              <strong>
                {t(
                  "notifications.workout"
                )}
              </strong>

              <span>
                {t(
                  "notifications.workoutDescription"
                )}
              </span>
            </div>

            <span
              className={
                settings.workoutReminder
                  ? "notifications-screen__switch notifications-screen__switch--on"
                  : "notifications-screen__switch"
              }
            >
              <i />
            </span>
          </button>

          <button
            type="button"
            className="notifications-screen__row"
            disabled={busy !== null}
            onClick={() => {
              void toggleNutrition();
            }}
          >
            <div>
              <strong>
                {t(
                  "notifications.nutrition"
                )}
              </strong>

              <span>
                {t(
                  "notifications.nutritionDescription"
                )}
              </span>
            </div>

            <span
              className={
                settings.nutritionReminders
                  ? "notifications-screen__switch notifications-screen__switch--on"
                  : "notifications-screen__switch"
              }
            >
              <i />
            </span>
          </button>

          <button
            type="button"
            className="notifications-screen__row"
            disabled={busy !== null}
            onClick={() => {
              void toggleMotivation();
            }}
          >
            <div>
              <strong>
                {t(
                  "notifications.motivation"
                )}
              </strong>

              <span>
                {t(
                  "notifications.motivationDescription"
                )}
              </span>
            </div>

            <span
              className={
                settings.motivationReminder
                  ? "notifications-screen__switch notifications-screen__switch--on"
                  : "notifications-screen__switch"
              }
            >
              <i />
            </span>
          </button>

          <button
            type="button"
            className="notifications-screen__row"
            onClick={toggleProgress}
          >
            <div>
              <strong>
                {t(
                  "notifications.progress"
                )}
              </strong>

              <span>
                {t(
                  "notifications.progressDescription"
                )}
              </span>
            </div>

            <span
              className={
                settings.progressUpdates
                  ? "notifications-screen__switch notifications-screen__switch--on"
                  : "notifications-screen__switch"
              }
            >
              <i />
            </span>
          </button>
        </section>

        <section className="notifications-screen__section">
          <div className="notifications-screen__title">
            02 · {t(
              "notifications.test"
            )}
          </div>

          <button
            type="button"
            className="notifications-screen__test"
            disabled={busy !== null}
            onClick={() => {
              void testNotification();
            }}
          >
            <span>
              {busy === "test"
                ? t(
                    "notifications.testing"
                  )
                : t(
                    "notifications.testButton"
                  )}
            </span>

            <b>→</b>
          </button>
        </section>

        {message && (
          <div className="notifications-screen__message">
            {message}
          </div>
        )}

      </div>
    </main>
  );
}
